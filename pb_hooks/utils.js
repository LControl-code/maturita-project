/// <reference path="../pb_data/types.d.ts" />

// pb_hooks/utils.js
module.exports = {
  debug: () => {
    return false
  },

  welcome: () => {
    console.log(`\n
    ██████╗ ███████╗██╗  ████████╗ █████╗     ██████╗ ██████╗ 
    ██╔══██╗██╔════╝██║  ╚══██╔══╝██╔══██╗    ██╔══██╗██╔══██╗
    ██║  ██║█████╗  ██║     ██║   ███████║    ██║  ██║██████╔╝
    ██║  ██║██╔══╝  ██║     ██║   ██╔══██║    ██║  ██║██╔══██╗
    ██████╔╝███████╗███████╗██║   ██║  ██║    ██████╔╝██████╔╝
    ╚═════╝ ╚══════╝╚══════╝╚═╝   ╚═╝  ╚═╝    ╚═════╝ ╚═════╝ 
    `)
  },

  handleStationUpdates: (collectionName, stationName, debug) => {
    try {
      let record;

      try {
        // Try to find existing update record
        record = $app.dao().findFirstRecordByData('station_updates', 'station_id', collectionName)
      } catch (findError) {
        // Record not found - will create new one
        record = null
      }

      if (record) {
        // Update existing record
        record.set('update_time', new Date().toISOString())
        $app.dao().saveRecord(record)
        if (debug) console.log(`Updated record for collection ${stationName}(${collectionName})`)
      } else {
        // Create new record
        const collection = $app.dao().findCollectionByNameOrId("station_updates")
        const newRecord = new Record(collection, {
          "station_id": collectionName,
          "update_time": new Date().toISOString()
        })
        $app.dao().saveRecord(newRecord)
        if (debug) console.log(`Created new record for collection ${stationName}(${collectionName})`)
      }
    } catch (err) {
      console.error(`Failed to update / create record for ${stationName}(${collectionName}): `, err)
    }
  },

  OLDcopyToLiveErrors: (collectionName, stationName, model, debug) => {
    try {
      const collection = $app.dao().findCollectionByNameOrId("live_errors");
      const test_device_code = model.get("device_code")
      const test_motor_type = model.get("motor_type")
      const test_time = model.get("time")
      const test_device_id = model.get("id")

      // Create a deep copy of the model
      const test_result_data = JSON.parse(JSON.stringify(model))

      // Delete unwanted properties
      delete test_result_data.collectionId
      delete test_result_data.collectionName
      delete test_result_data.created
      delete test_result_data.device_code
      delete test_result_data.test_fail
      delete test_result_data.time
      delete test_result_data.updated
      delete test_result_data.motor_type
      delete test_result_data.id

      const newRecord = new Record(collection, {
        "time": test_time,
        "station_name": stationName,
        "motor_type": test_motor_type,
        "device_code": test_device_code,
        "test_data": test_result_data,
        "device_id": test_device_id
      });
      $app.dao().saveRecord(newRecord);
      if (debug) console.log(`Copied data to live_errors for collection ${stationName}(${collectionName})`);
    } catch (err) {
      console.error(`Failed to copy data to live_errors for ${stationName}(${collectionName}): `, err);
    }
  },


  getLimitsForStation: (stationName, motorType, debug) => {
    try {
      if (debug) console.log(`Got motor_type: ${motorType}`)
      const collectionName = `station_${stationName.toLowerCase()}_limits`;
      if (debug) console.log(`Looking for limits in collection: ${collectionName}`);

      const limitsRecord = $app.dao().findFirstRecordByData(collectionName, 'motor_type', motorType);
      if (debug) console.log(`Found limits record for motor type: ${motorType}`);

      if (!limitsRecord) {
        console.error(`No limits found for station ${stationName} and motor type ${motorType}`);
        return null;
      }

      if (debug) console.log(`Limits record: ${JSON.stringify(limitsRecord)}`);
      return limitsRecord;
    } catch (err) {
      console.error(`Failed to get limits for ${stationName}: `, err);
      return null;
    }
  },

  processTestData: (testData, limits) => {
    const errors = [];

    // Iterate through each test in the test data
    Object.entries(testData).forEach(([key, value]) => {
      // Skip if the value isn't a number or is a special field
      if (typeof value !== 'number') return;

      const minLimit = limits.get(`${key}_MIN`);
      const maxLimit = limits.get(`${key}_MAX`);

      if (minLimit !== undefined && value < minLimit) {
        errors.push({
          test: key,
          value: Number(value.toFixed(3)),
          limit: minLimit,
          type: 'below',
          offset: Number((minLimit - value).toFixed(3))
        });
      }

      if (maxLimit !== undefined && value > maxLimit) {
        errors.push({
          test: key,
          value: Number(value.toFixed(3)),
          limit: maxLimit,
          type: 'above',
          offset: Number((value - maxLimit).toFixed(3))
        });
      }
    });

    return errors;
  },

  copyToLiveErrors: (collectionName, stationName, model, debug) => {
    try {
      const collection = $app.dao().findCollectionByNameOrId("live_errors");
      const test_device_code = model.get("device_code");
      const test_motor_type = model.get("motor_type");
      const test_time = model.get("time");
      const test_device_id = model.get("id");

      // Get the limits for this station and motor type
      const limits = module.exports.getLimitsForStation(stationName, test_motor_type, debug);
      if (!limits) {
        if (debug) console.log(`No limits found for ${stationName} - ${test_motor_type}, skipping processing`);
        return;
      }

      // Create a deep copy of the model and clean it
      const test_result_data = JSON.parse(JSON.stringify(model));

      // Delete unwanted properties
      delete test_result_data.collectionId;
      delete test_result_data.collectionName;
      delete test_result_data.created;
      delete test_result_data.device_code;
      delete test_result_data.test_fail;
      delete test_result_data.time;
      delete test_result_data.updated;
      delete test_result_data.motor_type;
      delete test_result_data.id;

      // Process the cleaned test data against limits
      const errors = module.exports.processTestData(test_result_data, limits);

      // Only create record if there are errors
      if (errors.length > 0) {
        const newRecord = new Record(collection, {
          "time": test_time,
          "station_name": stationName,
          "motor_type": test_motor_type,
          "device_code": test_device_code,
          "test_data": {
            "id": test_device_id,
            "station": stationName,
            "errors": errors,
            "deviceCode": test_device_code,
            "timestamp": test_time,
            "deviceId": test_device_id
          },
          "device_id": test_device_id
        });

        $app.dao().saveRecord(newRecord);
        if (debug) console.log(`Created live_errors record with ${errors.length} errors for ${stationName}(${collectionName})`);
      } else {
        if (debug) console.log(`No errors found for ${stationName}(${collectionName}), skipping record creation`);
      }
    } catch (err) {
      console.error(`Failed to process and copy data to live_errors for ${stationName}(${collectionName}): `, err);
    }
  }
};