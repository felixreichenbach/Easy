const models = require("./models");
const demoConfig = require("./demoConfig");
const Realm = require("realm");
const BSON = require("bson");

const deviceSchemas = [models.deviceSchema, models.device_attributesSchema, models.device_signalsSchema, models.device_signals_gps_coordsSchema];
const app = new Realm.App({ id: demoConfig.RealmAppID });

// Init state of the device used to create the shadow document on startup
const init_state = {
  _id: BSON.ObjectID(),
  vin: app.currentUser.profile.email,
  signals: {
    speed: 120,
    gps_coords: {
      type: "Point",
      coordinates: [
        -73.856077,
        40.848447]
    },
    fuel_level: 75
  },
  attributes: {
    model: "Race Car",
    weight: 1500,
    engine_ccm: 350
  }
}

// Realm object change listener which logs changes to console
function listener(device, changes) {
  //console.log(JSON.stringify(changes));
  console.log(
    `${changes.changedProperties.length} properties have changed:`
  );
  changes.changedProperties.forEach((prop) => {
    console.log("- " + `${prop}: ${JSON.stringify(device[prop])}`);
  });
}

// Main function
async function run() {

  // Authenticate the device
  try {
    const user = await app.logIn(new Realm.Credentials.emailPassword(demoConfig.VProfile.username, demoConfig.VProfile.password));
    console.log("Successfully logged in: " + user.profile.email);
  } catch (error) {
    console.error("Failed to log in: ", error.message);
  }
  // Open Realm
  try {
    const realm = await Realm.open({
      schema: deviceSchemas,
      sync: {
        user: app.currentUser,
        partitionValue: app.currentUser.profile.email
      }
    });
    // Create initial state document
    realm.write(() => {
      device = realm.create("device", init_state);
    });
    // Add device object change listener
    device.addListener(listener);
  } catch (error) {
    console.error("Open Realm failed: " + error.message)
  };
}

run().catch(err => {
  console.error("Failed: ", err)
});


// Demo shutdown and cleanup code
process.on("SIGINT", function () {
  console.log("Shutdown and cleanup initiated!");
  try {
    const realm = Realm.open({
      schema: deviceSchemas,
      sync: {
        user: app.currentUser,
        partitionValue: app.currentUser.profile.email,
      }
    }).then((realm) => {
      realm.write(() => {
        // Delete all objects from the realm.
        realm.deleteAll();
      });
      process.exit();
    });
  } catch (err) {
    console.error("Failed: ", err.message);
  }
});
