// routes.pb.js

const { time } = require("console");

//---------------------------------------------------------------------
// 2) A new route that returns the station collection names as JSON
//---------------------------------------------------------------------
routerAdd("GET", "/api/stationCollections", (e) => {
    try {
        const utils = require(`${__hooks}/utils.js`);
        const stationCollections = utils.getStationCollections();
        return e.json(200, { stationCollections });
    } catch (err) {
        return e.json(500, {
            error: "Failed to retrieve station collections",
            message: err?.message || String(err)
        });
    }
});

routerAdd("GET", "/api/topFailsNew", async (e) => {
    try {
        // --------------------------------------------------------------------
        // 1) Calculate "today" in UTC, from 00:00:00 to 23:59:59
        // --------------------------------------------------------------------
        const now = new Date();
        const startOfUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
        const endOfUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59));

        const startStr = startOfUTC.toISOString().replace("T", " ").split(".")[0];
        const endStr = endOfUTC.toISOString().replace("T", " ").split(".")[0];

        // --------------------------------------------------------------------
        // 2) Fetch "failures" for today's UTC range
        // --------------------------------------------------------------------
        const filterExpr = `
          time >= {:start} &&
          time <= {:end}
        `;
        const failures = await $app.findRecordsByFilter(
            "failures",
            filterExpr,
            "-created",  // sort descending
            100000,
            0,
            { start: startStr, end: endStr }
        );
        await $app.expandRecords(failures, [
            "station",
            "station.line", // if you need line info, but we'll just show stationLineKey for now
            "test_data",    // has device_code, etc.
        ]);

        // --------------------------------------------------------------------
        // 2) Prepare data structures
        // --------------------------------------------------------------------
        // A) "stationsMap" = per stationLineKey aggregator
        //    stationsMap[stationLineKey] = {
        //      totalFails: number,
        //      topTests: { [testName]: { count, devicePairs: [] } }
        //    }
        //
        // B) "globalTestInfo" = aggregator for global top fails
        //    globalTestInfo[testName] = {
        //      count: number,
        //      stations: { [stationLineKey]: number }  // how many times that test happened at each stationLineKey
        //    }
        //
        const stationsMap = {};
        const globalTestInfo = {};

        // --------------------------------------------------------------------
        // 3) Aggregate data
        // --------------------------------------------------------------------
        for (let f of failures) {
            // ---- stationLineKey (e.g. "A20-1") ----
            const stationRec = f.expandedOne("station");
            const stationName = stationRec?.get("name") ?? "UnknownStation";

            const lineRec = stationRec?.expandedOne("line");
            const lineName = lineRec?.get("name") ?? "Line ?";

            // If you prefer to store separate stationName + lineName, do so.
            // For simplicity, we'll just combine stationName + line suffix (like "A20-1").
            const lineSuffix = (lineName || "").split(" ")[1] ?? "?";
            const stationLineKey = `${stationName}-${lineSuffix}`;

            // ---- testName + device info ----
            const testName = f.getString("test");
            const testDataRec = f.expandedOne("test_data");
            const devicePair = {
                id: testDataRec?.id ?? "unknown-id",
                device_code: testDataRec?.get("device_code") ?? "unknown-device-code",
            };

            // -- A) Update stationsMap aggregator --
            if (!stationsMap[stationLineKey]) {
                stationsMap[stationLineKey] = {
                    totalFails: 0,
                    topTests: {}
                };
            }
            const stationInfo = stationsMap[stationLineKey];
            stationInfo.totalFails += 1;

            if (!stationInfo.topTests[testName]) {
                stationInfo.topTests[testName] = {
                    count: 0,
                    devicePairs: [],
                };
            }
            stationInfo.topTests[testName].count += 1;
            stationInfo.topTests[testName].devicePairs.push(devicePair);

            // -- B) Update globalTestInfo aggregator --
            if (!globalTestInfo[testName]) {
                globalTestInfo[testName] = {
                    count: 0,
                    stations: {},  // stationLineKey => number of times
                };
            }
            globalTestInfo[testName].count += 1;

            if (!globalTestInfo[testName].stations[stationLineKey]) {
                globalTestInfo[testName].stations[stationLineKey] = 0;
            }
            globalTestInfo[testName].stations[stationLineKey] += 1;
        }

        // --------------------------------------------------------------------
        // 4) Build "Global" top fails
        //    - Sort tests by descending "count"
        //    - For each test, create an array of stationLineKey usage
        //      (no devicePairs here, to keep it lean)
        // --------------------------------------------------------------------
        const globalFailsTotal = failures.length; // sum of all failures across all stations

        // Turn the globalTestInfo object into a sorted array
        // e.g. [ [testName, { count, stations: {...} }], ... ]
        const sortedGlobalTests = Object.entries(globalTestInfo)
            .sort((a, b) => b[1].count - a[1].count).slice(0, 5) // descending by count

        // If you want only the top X tests globally (e.g. top 3):
        //
        // for full listing, omit or raise the limit as needed

        const globalTopTests = sortedGlobalTests.map(([testName, info]) => {
            // Convert the stations object (stationLineKey => count)
            // into an array for easier iteration in the front-end
            // e.g. stations: [ { stationLineKey: "A20-1", count: 5 }, ... ]
            const stationUsageArray = Object.entries(info.stations).map(([key, cnt]) => ({
                stationLineKey: key,
                count: cnt,
            }));

            return {
                name: testName,
                count: info.count,
                stations: stationUsageArray,
            };
        });

        // --------------------------------------------------------------------
        // 5) Build "Stations" array
        //    - Each stationLineKey with totalFails and topTests array
        //    - Sort top tests by descending count if you want
        // --------------------------------------------------------------------
        const stationsResult = Object.entries(stationsMap).map(([stationLineKey, data]) => {
            // data.topTests is an object => convert to array
            // e.g. topTests => [ [testName, { count, devicePairs: [] }], ... ]
            const sortedStationTests = Object.entries(data.topTests)
                .sort((a, b) => b[1].count - a[1].count).slice(0, 5) // descending
                // If you want to limit station-level top tests, add .slice(0, 3)

                .map(([testName, testData]) => ({
                    name: testName,
                    count: testData.count,
                    devicePairs: testData.devicePairs,
                }));

            return {
                stationLineKey,
                totalFails: data.totalFails,
                topTests: sortedStationTests
            };
        });

        // --------------------------------------------------------------------
        // 6) Final Result
        // --------------------------------------------------------------------
        const finalResult = {
            Global: {
                totalFails: globalFailsTotal,
                topTests: globalTopTests  // array of { name, count, stations: [ { stationLineKey, count } ] }
            },
            Stations: stationsResult // array of { stationLineKey, totalFails, topTests: [ { name, count, devicePairs } ] }
        };

        return e.json(200, { "Top Fails": finalResult });

    } catch (err) {
        return e.json(500, {
            error: "Failed to compute top fails",
            message: err?.message || String(err),
        });
    }
});

routerAdd("GET", "/api/failedTestsGraphNew", async (e) => {
    try {
        // --------------------------------------------------------------------
        // 0) Parse "line" query param: e.g. ?line=1,2,4
        //    We'll accept multiple comma-separated values
        // --------------------------------------------------------------------
        const lineParam = e.request.url.query().get("line") || "";
        // e.g. "1,2,4" => ["1","2","4"]
        // If lineParam is empty, we interpret that as "all lines".
        let linesRequested = [];
        if (lineParam.trim() !== "") {
            linesRequested = lineParam.split(",").map(v => v.trim());
            // linesRequested = ["1","2","4"] in the example
        }

        // --------------------------------------------------------------------
        // 1) Calculate "today" in UTC, from 00:00:00 to 23:59:59
        // --------------------------------------------------------------------
        const now = new Date();
        const startOfUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
        const endOfUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59));

        const startStr = startOfUTC.toISOString().replace("T", " ").split(".")[0];
        const endStr = endOfUTC.toISOString().replace("T", " ").split(".")[0];

        // --------------------------------------------------------------------
        // 2) Fetch "failures" for today's UTC range
        // --------------------------------------------------------------------
        const filterExpr = `
          time >= {:start} &&
          time <= {:end}
        `;
        const failures = await $app.findRecordsByFilter(
            "failures",
            filterExpr,
            "-created",  // sort descending
            100000,
            0,
            { start: startStr, end: endStr }
        );

        // --------------------------------------------------------------------
        // 3) Expand relations:
        //    - "station" => to get the station name (e.g. "R23")
        //    - "station.line" => to get the line name (e.g. "Line 1")
        //    - "test_data" => to retrieve device_code
        //    - "device_type" => if you want the deviceType name
        // --------------------------------------------------------------------
        await $app.expandRecords(failures, [
            "station",
            "station.line",
            "test_data",
            "device_type",
        ]);

        // --------------------------------------------------------------------
        // 4) Build the final data structure
        //    graphData[stationName][testName] = array of objects
        // --------------------------------------------------------------------
        const graphData = {};

        for (let f of failures) {
            // a) Station + line
            const stationRec = f.expandedOne("station");
            if (!stationRec) {
                // If station missing, skip
                continue;
            }
            const stationName = stationRec.get("name") || "UnknownStation";

            // b) line info
            //    if lineRec.get("name") => "Line 1", parse out "1"
            const lineRec = stationRec.expandedOne("line");
            const lineName = lineRec?.get("name") || "Line ?";
            let lineNumber = "Unknown";
            if (lineName.startsWith("Line ")) {
                lineNumber = lineName.split(" ")[1]; // e.g. "1", "2", "4", etc.
            }

            // c) If we have linesRequested, and lineNumber isn't in that set => skip
            if (
                linesRequested.length > 0 &&    // user specified some lines
                !linesRequested.includes(lineNumber)
            ) {
                continue;  // skip this record
            }

            // d) Test name
            const testName = f.getString("test") || "UnknownTest";

            // e) measuredValue, limit, offset, difference
            const measuredValue = f.getFloat("value");
            const limitValue = f.getFloat("limit");
            const offsetValue = f.getFloat("offset");
            const difference = parseFloat((measuredValue - limitValue).toFixed(3));

            // f) "type" (e.g. "above" / "below")
            const typeValue = f.getString("type") || "unknown-type";

            // g) timestamp
            const time = f.getString("time") || "unknown-time";

            // h) deviceCode
            const testDataRec = f.expandedOne("test_data");
            const deviceCode = testDataRec?.get("device_code") || "UnknownDevice";

            // i) deviceType
            const deviceTypeRec = f.expandedOne("device_type");
            const deviceTypeVal = deviceTypeRec?.get("name") || "UnknownDeviceType";

            // ----------------------------------------------------------------
            // Insert into graphData => graphData[stationName][testName] = [...]
            // We'll also store "lineNumber" in the final object so we know which line it is
            // ----------------------------------------------------------------
            if (!graphData[stationName]) {
                graphData[stationName] = {};
            }
            if (!graphData[stationName][testName]) {
                graphData[stationName][testName] = [];
            }

            graphData[stationName][testName].push({
                deviceCode,
                difference,
                limit: limitValue,
                measuredValue,
                offset: offsetValue,
                type: typeValue,
                time,
                deviceType: deviceTypeVal,
                line: lineName,         // e.g. "Line 2"
                lineNumber: lineNumber  // e.g. "2"
            });
        }

        // --------------------------------------------------------------------
        // 5) Return the final data structure
        // --------------------------------------------------------------------
        return e.json(200, graphData);

    } catch (err) {
        return e.json(500, {
            error: "Failed to compute failed tests graph (new)",
            message: err?.message || String(err),
        });
    }
});

routerAdd("GET", "/api/liveErrorsNew", async (e) => {
    try {
        // Calculate today's UTC date range
        const now = new Date();
        const startOfUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
        const endOfUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59));

        const startStr = startOfUTC.toISOString().replace("T", " ").split(".")[0];
        const endStr = endOfUTC.toISOString().replace("T", " ").split(".")[0];

        // Fetch failures for today
        const filterExpr = `
            time >= {:start} &&
            time <= {:end}
        `;
        const failures = await $app.findRecordsByFilter(
            "failures",
            filterExpr,
            "-created",
            1000,
            0,
            { start: startStr, end: endStr }
        );

        // Expand relations
        await $app.expandRecords(failures, [
            "station",
            "test_data",
            "device_type",
            "station.line"
        ]);

        // Group by test_data ID
        const groupedFailures = {};
        for (const failure of failures) {
            const testDataRec = failure.expandedOne("test_data");
            const stationRec = failure.expandedOne("station");
            const deviceTypeRec = failure.expandedOne("device_type");
            const stationLineRec = stationRec.expandedOne("line");

            if (!testDataRec || !stationRec) continue;

            const testDataId = testDataRec.id;
            if (!groupedFailures[testDataId]) {
                groupedFailures[testDataId] = {
                    station_line: stationLineRec?.get("name") || "Unknown",
                    station_name: stationRec.get("name"),
                    motor_type: deviceTypeRec?.get("name") || "Unknown",
                    device_code: testDataRec.get("device_code"),
                    device_id: testDataRec.id,
                    test_data: {
                        errors: [],
                    },
                    time: failure.getString("time")
                };
            }

            // Add error to the errors array
            groupedFailures[testDataId].test_data.errors.push({
                test: failure.getString("test"),
                value: failure.getFloat("value"),
                type: failure.getString("type"),
                limit: failure.getFloat("limit"),
                offset: failure.getFloat("offset")
            });
        }

        // Convert to array and sort by time descending
        const result = Object.values(groupedFailures).sort(
            (a, b) => new Date(b.time) - new Date(a.time)
        );

        return e.json(200, result);

    } catch (err) {
        return e.json(500, {
            error: "Failed to fetch live errors",
            message: err?.message || String(err)
        });
    }
});

// ---------------------------------------------------------------------
// /api/topFails (GET)
// ---------------------------------------------------------------------
// Replicates your getTopFailsData() Next.js logic to find today's "test_fail" records,
// filter out tests that are within station limits, and return top fails by station.
routerAdd("GET", "/api/topFails", (e) => {
    try {
        // Use the helper function
        const utils = require(`${__hooks}/utils.js`);
        const stationCollections = utils.getStationCollections();

        // --- NEW: Calculate "today" in UTC, from 00:00:00 to 23:59:59 ---
        const now = new Date();
        // startOfUTC = today's date at 00:00:00 UTC
        const startOfUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
        // endOfUTC = today's date at 23:59:59 UTC
        const endOfUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59));

        // Convert to "YYYY-MM-DD HH:MM:SS" for PocketBase filters
        const startStr = startOfUTC.toISOString().replace("T", " ").split(".")[0];
        const endStr = endOfUTC.toISOString().replace("T", " ").split(".")[0];

        // We'll store final data in an object keyed by collection name
        const recordsByStation = {};

        // 1) For each station collection, fetch relevant station limits
        const limitsByStation = {};
        for (let coll of stationCollections) {
            const limitsCollName = `${coll}_limits`;
            // If you need to filter by motor_type, do it here:
            // e.g. $app.findAllRecords(limitsCollName, $dbx.hashExp({ "motor_type": "EFAD" }))
            const stationLimits = $app.findAllRecords(limitsCollName);
            limitsByStation[coll] = stationLimits; // usually an array, so you pick [0]
        }

        // 2) Fetch "test_fail = true" records from each station for "today" (UTC)
        for (let coll of stationCollections) {
            const filterExpr = `
                test_fail = true &&
                time >= {:start} &&
                time <= {:end}
            `;
            const stationRecords = $app.findRecordsByFilter(
                coll,
                filterExpr,
                "-created",   // sort
                100000,       // limit (large enough)
                0,            // offset
                {
                    "start": startStr,
                    "end": endStr,
                },
            );

            // 3) Filter out tests that are within the station limits
            const filteredRecords = [];
            const testFailuresCount = {};

            for (let r of stationRecords) {
                // Because we want to remove standard fields,
                // create a shallow copy of r.publicExport().
                let copy = JSON.parse(JSON.stringify(r.publicExport()));

                // Remove standard fields
                delete copy.id;
                delete copy.collectionId;
                delete copy.collectionName;
                delete copy.created;
                delete copy.updated;
                delete copy.test_fail;
                delete copy.motor_type;

                // Attempt to read the first station limit object
                let stationLimit = (limitsByStation[coll] && limitsByStation[coll].length > 0)
                    ? limitsByStation[coll][0]
                    : null;

                // Check each test to see if it's within the limit
                for (let key of Object.keys(copy)) {
                    if (key === "device_code" || key === "time") continue;
                    const val = copy[key];
                    if (typeof val === "number" && stationLimit) {
                        const min = stationLimit.get(`${key}_MIN`);
                        const max = stationLimit.get(`${key}_MAX`);
                        // If within the limit range => remove it
                        if (min !== undefined && max !== undefined && val >= min && val <= max) {
                            delete copy[key];
                        }
                    }
                }

                // Count how many tests remain
                const remainingTests = Object.keys(copy).filter(k => k !== "device_code" && k !== "time");
                for (let t of remainingTests) {
                    testFailuresCount[t] = (testFailuresCount[t] || 0) + 1;
                }

                // If anything remains besides device_code/time, push it
                filteredRecords.push(copy);
            }

            recordsByStation[coll] = {
                count: filteredRecords.length,
                records: filteredRecords,
                testFailures: testFailuresCount,
            };
        }

        // 4) Build final "Top Fails" structure
        //    Sort by the station with the highest "count"
        const result = {};
        const sortedStations = Object.entries(recordsByStation).sort((a, b) => {
            return b[1].count - a[1].count; // descending by "count"
        });

        for (let [station, data] of sortedStations) {
            if (data.count === 0) continue;

            // Sort top 3 tests by failure count
            const topTests = Object.entries(data.testFailures)
                .sort((a, b) => b[1] - a[1]) // descending
                .slice(0, 3)
                .map(([test, count]) => ({ name: test, count }));

            const stationName = station.split("_")[1].toUpperCase();
            result[stationName] = {
                value: data.count,
                topTests: topTests,
            };
        }

        return e.json(200, { "Top Fails": result });
    } catch (err) {
        return e.json(500, { error: "Failed to compute top fails", message: err?.message || String(err) });
    }
});

// ---------------------------------------------------------------------
// /api/failedTestsGraph (GET)
// ---------------------------------------------------------------------
// Replicates getFailedTestsGraphData() logic.
routerAdd("GET", "/api/failedTestsGraph", (e) => {
    try {
        const utils = require(`${__hooks}/utils.js`);
        const stationCollections = utils.getStationCollections();

        // --- NEW: Calculate "today" in UTC, from 00:00:00 to 23:59:59 ---
        const now = new Date();
        const startOfUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
        const endOfUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59));

        const startStr = startOfUTC.toISOString().replace("T", " ").split(".")[0];
        const endStr = endOfUTC.toISOString().replace("T", " ").split(".")[0];

        // 1) Load station limits
        const limitsByStation = {};
        for (let coll of stationCollections) {
            const limitsColl = `${coll}_limits`;
            // Suppose we filter motor_type='EFAD' as in your code
            const stationLimits = $app.findAllRecords(limitsColl, $dbx.hashExp({ "motor_type": "EFAD" }));
            limitsByStation[coll] = stationLimits;
        }

        // 2) Fetch station records that are test_fail = true for "today" (UTC)
        const recordsByStation = {};
        for (let coll of stationCollections) {
            const filterExpr = `
                test_fail = true &&
                time >= {:start} &&
                time <= {:end}
            `;
            const stationRecords = $app.findRecordsByFilter(
                coll,
                filterExpr,
                "-created",  // sort desc
                100000,
                0,
                {
                    "start": startStr,
                    "end": endStr,
                },
            );

            // Filter out tests within the limit
            const filtered = [];
            for (let r of stationRecords) {
                let copy = JSON.parse(JSON.stringify(r.publicExport()));
                const stationLimit = (limitsByStation[coll] && limitsByStation[coll].length > 0)
                    ? limitsByStation[coll][0]
                    : null;

                // Remove standard fields
                delete copy.id;
                delete copy.collectionId;
                delete copy.collectionName;
                delete copy.created;
                delete copy.updated;
                delete copy.test_fail;
                delete copy.motor_type;

                // Remove tests within min..max
                if (stationLimit) {
                    for (let key of Object.keys(copy)) {
                        if (["device_code", "time"].includes(key)) continue;
                        const val = copy[key];
                        if (typeof val === "number") {
                            const min = stationLimit.get(`${key}_MIN`);
                            const max = stationLimit.get(`${key}_MAX`);
                            if (min !== undefined && max !== undefined && val >= min && val <= max) {
                                delete copy[key];
                            }
                        }
                    }
                }

                // Keep only if there's at least 1 failing test
                const keysRemaining = Object.keys(copy).filter(k => k !== "device_code" && k !== "time");
                if (keysRemaining.length > 0) {
                    filtered.push(copy);
                }
            }

            recordsByStation[coll] = filtered;
        }

        // 3) Transform into the data structure needed for your chart
        const transformedData = {};

        for (let coll of Object.keys(recordsByStation)) {
            const stationName = coll.split("_")[1].toUpperCase();
            transformedData[stationName] = {};

            const stationLimit = (limitsByStation[coll] && limitsByStation[coll].length > 0)
                ? limitsByStation[coll][0]
                : null;

            for (let rec of recordsByStation[coll]) {
                const deviceCode = rec.device_code;
                const timestamp = rec.time;

                for (let [test, val] of Object.entries(rec)) {
                    if (["device_code", "time"].includes(test)) continue;
                    if (typeof val !== "number") continue;

                    // Compare to station limit
                    if (stationLimit) {
                        const min = stationLimit.get(`${test}_MIN`);
                        const max = stationLimit.get(`${test}_MAX`);
                        if (min !== undefined || max !== undefined) {
                            let limitUsed = val < min ? min : max;
                            let difference = parseFloat((val - limitUsed).toFixed(3));

                            if (!transformedData[stationName][test]) {
                                transformedData[stationName][test] = [];
                            }
                            transformedData[stationName][test].push({
                                deviceCode,
                                measuredValue: val,
                                limit: limitUsed,
                                difference,
                                timestamp,
                            });
                        }
                    }
                }
            }
        }

        // 4) (Optional) sort station by total fails descending
        const cleanedData = {};
        const stationEntries = Object.entries(transformedData).map(([st, tests]) => {
            const totalFails = Object.values(tests).reduce((sum, arr) => sum + arr.length, 0);
            return [st, tests, totalFails];
        });

        stationEntries.sort((a, b) => b[2] - a[2]);

        for (let [stName, testsObj,] of stationEntries) {
            // Only keep if we have fails
            if (Object.keys(testsObj).length > 0) {
                cleanedData[stName] = testsObj;
            }
        }

        return e.json(200, cleanedData);
    } catch (err) {
        return e.json(500, { error: "Failed to compute failed tests graph", message: err?.message || String(err) });
    }
});

// ---------------------------------------------------------------------
// /api/deviceData (GET)
// ---------------------------------------------------------------------
// Similar to getDeviceData(deviceCode). We'll read ?deviceCode=xxx.
routerAdd("GET", "/api/deviceData", (e) => {
    try {
        const utils = require(`${__hooks}/utils.js`);
        const stationCollections = utils.getStationCollections();

        const deviceCode = e.request.url.query().get("deviceCode") || "";
        if (!deviceCode) {
            throw new Error("No deviceCode provided.");
        }

        // We'll decode if needed:
        const decoded = decodeURIComponent(deviceCode);

        let currentStation = "";
        let motorType = "";
        const stationsResult = [];

        // 1) Preload station limits (motor_type='EFAD' as in your code)
        const limitsByStation = {};
        for (let coll of stationCollections) {
            const limitsColl = `${coll}_limits`;
            const stationLimits = $app.findAllRecords(
                limitsColl,
                $dbx.hashExp({ "motor_type": "EFAD" })
            );
            limitsByStation[coll] = stationLimits;
        }

        // 2) For each station collection, find the record(s) with device_code
        for (let coll of stationCollections) {
            const filterExpr = `device_code = {:dc}`;
            const stationRecords = $app.findRecordsByFilter(
                coll,
                filterExpr,
                "", // no sorting needed here
                100,
                0,
                { "dc": decoded }
            );

            if (stationRecords.length === 0) {
                // If no record found, it's "pending"
                stationsResult.push({
                    name: coll.split("_")[1].toUpperCase(),
                    status: "pending",
                    tests: []
                });
                continue;
            }

            // We'll consider only the first record for your display
            const r = stationRecords[0];
            if (r.get("motor_type")) {
                motorType = r.get("motor_type");
            }
            currentStation = coll.split("_")[1].toUpperCase();

            // Build trackTest array
            const tests = [];
            // Remove standard fields
            const ignoreFields = ["id", "collectionId", "collectionName", "created", "updated", "motor_type", "device_code", "time", "test_fail"];
            const stationLimit = (limitsByStation[coll] && limitsByStation[coll].length > 0)
                ? limitsByStation[coll][0]
                : null;

            // Check all record fields
            for (let key of Object.keys(r.publicExport())) {
                if (ignoreFields.includes(key)) continue;

                const value = r.getFloat(key); // or r.get(key)
                if (isNaN(value)) continue;

                let resultStatus = "passed";
                let offsetFromLimit;

                if (stationLimit) {
                    const min = stationLimit.get(`${key}_MIN`);
                    const max = stationLimit.get(`${key}_MAX`);

                    if (min !== undefined && value < min) {
                        resultStatus = "failed";
                        offsetFromLimit = (value - min).toFixed(3); // negative
                    } else if (max !== undefined && value > max) {
                        resultStatus = "failed";
                        offsetFromLimit = "+" + (value - max).toFixed(3);
                    }
                }

                const testObj = {
                    name: key,
                    result: resultStatus,
                    measuredValue: String(value),
                };
                if (resultStatus === "failed") {
                    testObj.offsetFromLimit = offsetFromLimit;
                }
                tests.push(testObj);
            }

            // Station status is "failed" if any test is "failed"
            const stationStatus = tests.some(t => t.result === "failed") ? "failed" : "passed";

            stationsResult.push({
                name: currentStation,
                status: stationStatus,
                tests: tests,
            });
        }

        const finalDeviceData = {
            code: decoded,
            type: motorType,
            currentStation,
            stations: stationsResult,
        };

        return e.json(200, finalDeviceData);
    } catch (err) {
        return e.json(500, { error: "Failed to retrieve device data", message: err?.message || String(err) });
    }
});

// ---------------------------------------------------------------------
// /api/liveErrors (GET)
// ---------------------------------------------------------------------
// Similar to getLiveErrorsData() - last 15 minutes from the live_errors collection
routerAdd("GET", "/api/liveErrors", (e) => {
    try {
        // 15 minutes ago
        const cutoff = new Date(Date.now() - 15 * 60 * 1000);
        // PocketBase default datetime format is "YYYY-MM-DD HH:MM:SS.sssZ"
        // We'll produce something like "2025-01-09 10:04:12"
        // For simplicity we can do: toISOString().replace('T',' ').split('.')[0]
        const dateISO = cutoff.toISOString().replace("T", " ").split(".")[0];

        // Fetch from live_errors
        // Use the doc approach with placeholders:
        const filterExpr = `
            created >= {:since}
        `;
        const records = $app.findRecordsByFilter(
            "live_errors",
            filterExpr,
            "-created", // sort desc
            500,
            0,
            { "since": dateISO }
        );

        // We only need test_data from each record
        const result = records.map(r => r.get("test_data"));
        return e.json(200, result);
    } catch (err) {
        return e.json(500, { error: "Failed to fetch live errors data", message: err?.message || String(err) });
    }
});
