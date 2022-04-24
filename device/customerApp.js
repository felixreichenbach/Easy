const models = require("./models");
const Realm = require("realm");
const BSON = require("bson");
const demoConfig = require("./demoConfig");

const deviceSchemas = [models.deviceSchema, models.device_attributesSchema, models.device_signalsSchema, models.device_signals_gps_coordsSchema];
const app = new Realm.App({ id: demoConfig.RealmAppID });

// Realm Object Change Listener
function listener(device, changes) {
  console.log(
    `${changes.changedProperties.length} properties have changed:`
  );
  changes.changedProperties.forEach((prop) => {
    console.log("- " + `${prop}: ${JSON.stringify(device[prop])}`);
  });
}

// Main function
async function run() {
  // Authenticate the customer
  try {
    const user = await app.logIn(new Realm.Credentials.emailPassword(demoConfig.CProfile.username, demoConfig.CProfile.password));
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
        partitionValue: app.currentUser.customData.vin
      }
    });

    // Query device and add object change listener
    const device = realm.objects("device");
    if (device.length > 0) {
      device[0].addListener(listener);
    } else {
      console.log("device needs to be registered first!");
      process.exit();
    }
  } catch (error) {
    console.error("Open Realm failed: " + error.message)
  };
}

run().catch(err => {
  console.error("Failed to open realm:", err);
});

// Demo shutdown and cleanup code
process.on("SIGINT", function () {
  console.log("Shutdown initiated!");
  process.exit();
});