// 1) Basic app initialization
onBootstrap((e) => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const utils = require(`${__hooks}/utils.js`);
  utils.welcome();
  e.next();
});

// 2) Trigger after any record is created in a "station_*" collection
//    (excluding those named "*_updates" or "*_limits").
onRecordAfterCreateSuccess((e) => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const utils = require(`${__hooks}/utils.js`);

  // Get the collection name from the record
  const collectionName = e.record.collection().name;

  // Match `station_` but exclude `_updates` or `_limits`
  const pattern = /^station_(?!.*(?:updates|limits)$).*/;
  if (pattern.test(collectionName)) {
    const stationName = collectionName.split("_")[1].toUpperCase();

    // Check your boolean field with `getBool` for clarity
    if (!e.record.getBool("test_fail")) {
      // If `test_fail` is false, we skip
      return e.next();
    }

    // Combine station update + copy to live_errors in a SINGLE transaction
    utils.handleUpdatesAndCopy(collectionName, stationName, e.record);
  }

  // Always call e.next() to continue the hook chain
  e.next();
});
