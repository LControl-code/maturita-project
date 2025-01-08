// 1) Basic app initialization
onBootstrap((e) => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const utils = require(`${__hooks}/utils.js`)
  utils.welcome()
  e.next()
})

// 2) Trigger after any record is created in a "station_*" collection
//    (excluding those named "*_updates" or "*_limits").
onModelAfterCreateSuccess((e) => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const utils = require(`${__hooks}/utils.js`)

  const collectionName = e.model.tableName()

  // Match station_ but exclude *_updates or *_limits
  const pattern = /^station_(?!.*(?:updates|limits)$).*/
  if (pattern.test(collectionName)) {
    const stationName = collectionName.split("_")[1].toUpperCase()

    // Only run if test_fail == true
    if (!e.model.get("test_fail")) {
      return
    }

    // Combine station update + copy to live_errors in a SINGLE transaction
    utils.handleUpdatesAndCopy(collectionName, stationName, e.model)
  }

  // Always call e.next() unless you want to halt the chain
  e.next()
})

// We'll call this onRecordAfterCreateSuccess for station_s02.
// If your "final" station is named differently, just change "station_s02" below.

onRecordAfterCreateSuccess((e) => {
  // We'll wrap everything in a try/catch so we can handle errors gracefully.
  try {
    // 1. Run a transaction to safely update the stats record
    $app.runInTransaction((txApp) => {
      // 2. Count distinct device_code in station_s02
      //    (We assume station_s02 is your final station)
      //
      // Example raw SQL approach:
      const query = txApp.db()
          .newQuery("SELECT COUNT(DISTINCT device_code) as cnt FROM station_s02")
      const result = new DynamicModel({ cnt: 0 })
      query.one(result) // throws if station_s02 doesn't exist or is empty

      const totalTested = result.cnt

      // 3. Load your single stats record (by name or by ID)
      let statsRecord
      try {
        statsRecord = txApp.findFirstRecordByData("stats", "name", "globalStats")
      } catch {
        // If you haven't created it yet, do so here
        const statsColl = txApp.findCollectionByNameOrId("stats")
        statsRecord = new Record(statsColl, {
          name: "globalStats",
          totalTested: 0
        })
      }

      // 4. Update the total tested count
      statsRecord.set("totalTested", totalTested)
      txApp.save(statsRecord)

      // Optional log
      $app.logger().info(
          "Stats updated after new record in station_s02",
          "totalTested", totalTested
      )
    })
  } catch (err) {
    $app.logger().error("Failed to update stats", "error", err)
  }

  // Don’t forget to call e.next() if you want subsequent hooks to continue
  e.next()
}, "station_s02") // <-- "station_s02" is your final station collection name
