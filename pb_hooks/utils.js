module.exports = {
  welcome: () => {
    console.log(`
    ██████╗ ███████╗██╗  ████████╗ █████╗     ██████╗ ██████╗ 
    ██╔══██╗██╔════╝██║  ╚══██╔══╝██╔══██╗    ██╔══██╗██╔══██╗
    ██║  ██║█████╗  ██║     ██║   ███████║    ██║  ██║██████╔╝
    ██║  ██║██╔══╝  ██║     ██║   ██╔══██║    ██║  ██║██╔══██╗
    ██████╔╝███████╗███████╗██║   ██║  ██║    ██████╔╝██████╔╝
    ╚═════╝ ╚══════╝╚══════╝╚═╝   ╚═╝  ╚═╝    ╚═════╝ ╚═════╝ 
        `);
  },

  /**
   * Fetch existing station_updates record by "station_id",
   * or prepare a new one if none is found.
   */
  _getOrCreateStationUpdateRecord(txApp, collectionName) {
    let record;
    try {
      record = txApp.findFirstRecordByData("station_updates", "station_id", collectionName);
    } catch {
      record = null;
    }

    if (record) {
      record.set("update_time", new Date().toISOString());
      return record;
    } else {
      const coll = txApp.findCollectionByNameOrId("station_updates");
      return new Record(coll, {
        station_id: collectionName,
        update_time: new Date().toISOString(),
      });
    }
  },

  /**
   * Called from inside the transaction to process test data vs. station limits.
   * If errors exist, creates a new record in "live_errors".
   */
  _createLiveErrorsRecordIfNeeded(txApp, stationName, record, logger) {
    // fetch station limits
    const testMotorType = record.get("motor_type");
    const limits = this.getLimitsForStation(stationName, testMotorType);
    if (!limits) {
      logger.warn("No station limits found, skipping live_errors creation");
      return;
    }

    // Deep copy the record data as plain JS object
    const testData = JSON.parse(JSON.stringify(record));
    [
      "collectionId", "collectionName", "created", "device_code",
      "test_fail", "time", "updated", "motor_type", "id"
    ].forEach(k => delete testData[k]);

    // Check data vs. limits
    const errors = this.processTestData(testData, limits);

    // Only if we have errors, create live_errors record
    if (errors.length > 0) {
      const coll = txApp.findCollectionByNameOrId("live_errors");
      const newRecord = new Record(coll, {
        time:         record.get("time"),
        station_name: stationName,
        motor_type:   testMotorType,
        device_code:  record.get("device_code"),
        test_data: {
          id:         record.get("id"),
          station:    stationName,
          errors:     errors,
          deviceCode: record.get("device_code"),
          timestamp:  record.get("time"),
          deviceId:   record.get("id"),
        },
        device_id: record.get("id"),
      });

      txApp.save(newRecord);
      logger.info("Created live_errors record", "errorsCount", errors.length);
    }
  },

  /**
   * The main function that unifies station_updates and live_errors creation in ONE transaction.
   */
  handleUpdatesAndCopy(collectionName, stationName, record) {
    // Create a logger with grouped attributes
    const logTx = $app.logger()
        .withGroup("stationFlow")
        .with("stationName", stationName, "collectionName", collectionName);

    try {
      $app.runInTransaction((txApp) => {
        logTx.debug("Starting transaction");

        // 1) Update or create station_updates
        const stationRec = this._getOrCreateStationUpdateRecord(txApp, collectionName);
        txApp.save(stationRec);
        logTx.debug("station_updates record saved");

        // 2) Check limits and create live_errors if needed
        this._createLiveErrorsRecordIfNeeded(txApp, stationName, record, logTx);

        logTx.debug("Transaction finished successfully");
      });
    } catch (err) {
      // If anything inside runInTransaction throws,
      // the entire transaction is rolled back automatically.
      $app.logger().error(
          "Failed handleUpdatesAndCopy",
          "stationName", stationName,
          "collectionName", collectionName,
          "error", err
      );
    }
  },

  /**
   * Retrieve the station_{name}_limits record by motorType. Returns null if not found.
   */
  getLimitsForStation(stationName, motorType) {
    try {
      const collName = `station_${stationName.toLowerCase()}_limits`;
      $app.logger().debug("Looking for station limits", "collName", collName, "motorType", motorType);

      const limitsRecord = $app.findFirstRecordByData(collName, "motor_type", motorType);
      if (!limitsRecord) {
        $app.logger().warn("No limits found", "stationName", stationName, "motorType", motorType);
        return null;
      }
      return limitsRecord;
    } catch (err) {
      $app.logger().error(
          "Failed to get station limits",
          "stationName", stationName,
          "error", err
      );
      return null;
    }
  },

  /**
   * Compare numeric fields with {TESTNAME_MIN, TESTNAME_MAX} in the given limits record
   * and collect any out-of-bounds test errors.
   */
  processTestData(testData, limits) {
    const errors = [];
    for (let [key, val] of Object.entries(testData)) {
      // Only check numeric fields
      if (typeof val !== "number") continue;

      const minLimit = limits.get(`${key}_MIN`);
      const maxLimit = limits.get(`${key}_MAX`);

      if (minLimit !== undefined && val < minLimit) {
        errors.push({
          test:   key,
          value:  Number(val.toFixed(3)),
          limit:  minLimit,
          type:   "below",
          offset: Number((minLimit - val).toFixed(3))
        });
      }
      if (maxLimit !== undefined && val > maxLimit) {
        errors.push({
          test:   key,
          value:  Number(val.toFixed(3)),
          limit:  maxLimit,
          type:   "above",
          offset: Number((val - maxLimit).toFixed(3))
        });
      }
    }
    return errors;
  },

  getStationCollections() {
    const allCols = $app.findAllCollections();
    return allCols
        .filter(col => col.name.startsWith("station_"))
        .filter(col => !col.name.endsWith("_limits"))
        .filter(col => col.name !== "station_updates")
        .map(col => col.name);
  },
};

