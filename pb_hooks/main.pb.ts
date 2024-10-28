// pb_hooks/main.pb.js

onBeforeBootstrap((e) => {
  const utils = require(`${__hooks}/utils.js`)

  utils.welcome()
})


onModelAfterCreate((e) => {
  const utils = require(`${__hooks}/utils.js`)
  const collectionName = e.model.tableName()
  const debug = utils.debug()


  // Match station collections but exclude updates and limits
  const pattern = /^station_(?!.*(?:updates|limits)$).*/;

  if (pattern.test(collectionName)) {
    const stationName = collectionName.split("_")[1].toUpperCase();

    // Only proceed if test_fail is true
    if (!e.model.get("test_fail")) {
      return;
    }

    // Handle station updates
    utils.handleStationUpdates(collectionName, stationName, debug);

    // Copy data to live_errors
    utils.copyToLiveErrors(collectionName, stationName, e.model, debug);
  }
});

