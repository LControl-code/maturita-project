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




// Hardcoded daily target:


// Register a custom GET route /api/stats
routerAdd("GET", "/api/stats", (e) => {
    const DAILY_TARGET = 220;
    const STATIONS = [
        "station_a20",
        "station_a25",
        "station_a26",
        "station_nvh",
        "station_r23",
        "station_s02",
    ];

    try {
        // 1) Attempt to load your "globalStats" record (optional)
        let statsRecord;
        try {
            statsRecord = $app.findFirstRecordByData("stats", "name", "globalStats");
        } catch {
            // Not found? We'll just set it to null or create one, your call
            statsRecord = null;
        }

        // 2) Today’s production: Distinct device_code in station_s02 since midnight
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const todayProdModel = new DynamicModel({
            totalToday: 0,
        });

        $app.db()
            .newQuery(`
        WITH distinct_today AS (
          SELECT DISTINCT device_code
          FROM station_s02
          WHERE time >= {:todayStart}
        )
        SELECT COUNT(*) as totalToday
        FROM distinct_today
      `)
            .bind({ todayStart: startOfDay.toISOString() })
            .one(todayProdModel); // populates todayProdModel.totalToday

        const totalToday = todayProdModel.totalToday;
        const todaysProduction = (totalToday / DAILY_TARGET) * 100; // e.g. 45.8%

        // 3) Overall efficiency: set-based approach with UNION + INTERSECT
        const multiStationModel = new DynamicModel({
            totalTestedAllStations: 0,
            totalPassedAllStations: 0,
        });

        // Build the UNION part for all tested
        const unionPart = STATIONS.map(
            (s, idx) => `SELECT device_code FROM ${s}${idx === 0 ? "" : "\n"}`
        ).join("\nUNION\n");

        // Build the INTERSECT part for all pass
        const intersectPart = STATIONS.map(
            (s, idx) => `SELECT device_code FROM ${s} WHERE test_fail=false${idx === 0 ? "" : "\n"}`
        ).join("\nINTERSECT\n");

        const unionIntersectQuery = `
      WITH all_tested AS (
        ${unionPart}
      ),
      all_pass AS (
        ${intersectPart}
      )
      SELECT
        (SELECT COUNT(*) FROM all_tested) as totalTestedAllStations,
        (SELECT COUNT(*) FROM all_pass) as totalPassedAllStations
    `;

        $app.db()
            .newQuery(unionIntersectQuery)
            .one(multiStationModel);

        const totalTested = multiStationModel.totalTestedAllStations;
        const totalPassed = multiStationModel.totalPassedAllStations;
        const overallEfficiency = totalTested > 0
            ? (totalPassed / totalTested) * 100
            : 0;

        // 4) Merge final result
        // Convert the PB Record to a plain object
        const statsData = statsRecord ? statsRecord.publicExport() : {};

        // Then build your final response
        const result = {
            ...statsData,
            todaysProduction,
            overallEfficiency,
        };

        return e.json(200, result);
    } catch (err) {
        // On error, return 500
        return e.json(500, {
            error: "Failed to compute stats",
            message: err?.message || String(err),
        });
    }
});
