const realmModel = require("./schema");
const realmConfig = require("./config");
const Realm = require("realm");
const BSON = require("bson");

const schemaList = [realmModel.DeviceSchema, realmModel.ComponentSchema];
const app = new Realm.App({ id: realmConfig.appID });
let realm;

// Javascript flexible sync tutorial: 
// https://www.mongodb.com/developer/article/realm-flexible-sync/

// REST API insert new device function
exports.createDevice = function createDevice() {
  let device;
  let component;
  realm.write(() => {
    device = realm.create(realmModel.DeviceSchema.name, {
      _id: new BSON.ObjectID,
      owner_id: app.currentUser.id,
      signals: {
        type: "device"
      }
    });
  });
  return { device: device, component: component };
}

// REST API add component function
exports.addComponent = function addComponent() {
  const device = realm.objects(realmModel.DeviceSchema.name)[0];
  let component;
  realm.write(() => {
    component = realm.create(realmModel.ComponentSchema.name, {
      _id: new BSON.ObjectID,
      owner_id: app.currentUser.id,
      signals: {
        type: "component"
      }
    });
    device.components.push(component);
  });
  return { device: device, component: component };
}

// Realm object change listener
function changedPropertiesListener(object, changes) {
  console.log("Object: " + JSON.stringify(object));
  console.log("Changes: " + JSON.stringify(changes));
}

// Realm collection change listener
function colChangeListener(objects, changes) {
  // Handle newly added objects
  changes.insertions.forEach((index) => {
    const insertedObject = objects[index];
    console.log(`New object added: ${insertedObject.name}!`);
    insertedObject.addListener(changedPropertiesListener);
  });
}

// Main function
async function run() {
  // Authenticate the device user
  try {
    const user = await app.logIn(
      new Realm.Credentials.emailPassword(
        realmConfig.user.username,
        realmConfig.user.password
      )
    );
    console.log("Successfully logged in: " + app.currentUser.id);
  } catch (error) {
    console.error("Failed to log in: ", error.message);
  }
  // Open the local Realm
  try {
    realm = await Realm.open({
      schema: schemaList,
      sync: {
        user: app.currentUser,
        flexible: true,
      },
    });
    // Create and add a filter subscription
    await realm.subscriptions.update((subscriptions) => {
      subscriptions.add(
        realm
          .objects(realmModel.DeviceSchema.name)
          .filtered("owner_id =" + JSON.stringify(app.currentUser.id), { name: "device-filter" })
      );
      subscriptions.add(
        realm
          .objects(realmModel.ComponentSchema.name)
          .filtered("owner_id =" + JSON.stringify(app.currentUser.id), { name: "component-filter" })
      );
    });
    // Add change listener to filtered list of objects
    realm.objects(realmModel.DeviceSchema.name).addListener(colChangeListener);
    realm.objects(realmModel.ComponentSchema.name).addListener(colChangeListener);
  } catch (error) {
    console.error("Open Realm failed: " + error.message);
  }
}

// Execute main function
run().catch((err) => {
  console.error("Failed: ", err);
});

// Shutdown and cleanup code
process.on("SIGINT", function () {
  console.log("Shutdown and cleanup initiated!");
  try {
    realm.write(() => {
      // Delete all objects of the current filter from the realm.
      realm.deleteAll();
    });
    realm.removeAllListeners();
    realm.subscriptions.update((subscriptions) => {
      subscriptions.removeAll();
    })
    process.exit();
  } catch (err) {
    console.error("Failed: ", err.message);
  }
});
