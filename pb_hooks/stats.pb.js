// Example hook for station_s02
onRecordAfterCreateSuccess((e) => {
    try {
        // 1. Run a transaction to safely update the stats record
        $app.runInTransaction((txApp) => {
            // 2. Count distinct device_code in station_s02
            const query = txApp.db()
                .newQuery("SELECT COUNT(DISTINCT device_code) as cnt FROM station_s02");

            const result = new DynamicModel({ cnt: 0 });
            query.one(result); // throws on DB error or missing table

            const totalTested = result.cnt;

            // 3. Load or create your single stats record
            let statsRecord;
            try {
                statsRecord = txApp.findFirstRecordByData("stats", "name", "globalStats");
            } catch {
                const statsColl = txApp.findCollectionByNameOrId("stats");
                statsRecord = new Record(statsColl, {
                    name:        "globalStats",
                    totalTested: 0,
                });
            }

            // 4. Update the total tested count
            statsRecord.set("totalTested", totalTested);
            txApp.save(statsRecord);

            // Optional log
            $app.logger().info(
                "Stats updated after new record in station_s02",
                "totalTested", totalTested
            );
        });
    } catch (err) {
        $app.logger().error("Failed to update stats", "error", err);
    }

    e.next();
}, "station_s02");

// Register a custom route: GET /api/stats
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
        // 1) Attempt to load "globalStats"
        let statsRecord;
        try {
            statsRecord = $app.findFirstRecordByData("stats", "name", "globalStats");
        } catch {
            statsRecord = null;
        }

        // 2) Today’s production: distinct device_code in station_s02 since midnight
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const todayProdModel = new DynamicModel({ totalToday: 0 });
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
            .one(todayProdModel);

        const totalToday = todayProdModel.totalToday;
        const todaysProduction = (totalToday / DAILY_TARGET) * 100;

        // 3) Overall efficiency with set-based approach
        const multiStationModel = new DynamicModel({
            totalTestedAllStations: 0,
            totalPassedAllStations: 0,
        });

        // Build the UNION of all tested
        const unionPart = STATIONS.map((s, i) => {
            return `${i === 0 ? "" : "\n"}SELECT device_code FROM ${s}`;
        }).join("\nUNION");

        // Build the INTERSECT of all passed (test_fail = false)
        const intersectPart = STATIONS.map((s, i) => {
            return `${i === 0 ? "" : "\n"}SELECT device_code FROM ${s} WHERE test_fail=false`;
        }).join("\nINTERSECT");

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
        const statsData = statsRecord ? statsRecord.publicExport() : {};
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
