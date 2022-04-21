const realmModel = require("./schema");
const realmConfig = require("./config");
const Realm = require("realm");
const BSON = require("bson");

const schema = realmModel.DeviceSchema;
const app = new Realm.App({ id: realmConfig.appID });

let realm;

// Javascript flexible sync tutorial: 
// https://www.mongodb.com/developer/article/realm-flexible-sync/

// REST API insert new device function
exports.create = function create() {
  let device;
  realm.write(() => {
    device = realm.create(schema.name, {
      _id: new BSON.ObjectID,
      owner_id: app.currentUser.id,
      signals: {
        hello: "world"
      }
    })
  });
  return device;
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
      schema: [schema],
      sync: {
        user: app.currentUser,
        flexible: true,
      },
    });
    // Create and add a filter subscription
    await realm.subscriptions.update((subscriptions) => {
      subscriptions.add(
        realm
          .objects(schema.name)
          .filtered("owner_id =" + JSON.stringify(app.currentUser.id), { name: "owner-filter" })
      );
    });
    // Add change listener to filtered list of objects
    realm.objects(schema.name).addListener(colChangeListener);
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
