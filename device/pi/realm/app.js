const realmModel = require("./model");
const realmConfig = require("./config");
const Realm = require("realm");
const BSON = require("bson");

const schema = realmModel.ItemSchema;
const app = new Realm.App({ id: realmConfig.appID });

// Javascript flexible sync tutorial: https://www.mongodb.com/developer/article/realm-flexible-sync/

// Realm object change listener which logs changes to console
function listener(device, changes) {
  console.log(JSON.stringify(changes));
}

// Main function
async function run() {
  // Authenticate the device
  try {
    const user = await app.logIn(
      new Realm.Credentials.emailPassword(
        realmConfig.user.username,
        realmConfig.user.password
      )
    );
    console.log("Successfully logged in: " + user.id);
  } catch (error) {
    console.error("Failed to log in: ", error.message);
  }
  // Open Realm
  try {
    const realm = await Realm.open({
      schema: [schema],
      sync: {
        user: app.currentUser,
        flexible: true,
      },
    });
    // Create a Query and Add it to your Subscriptions
    await realm.subscriptions.update((mutableSubscriptions) => {
      mutableSubscriptions.add(
        realm
          .objects(schema.name)
          .filtered("owner_id = nil", {name: "owner-search"})
      );
    });
    let items = realm.objects(schema.name);
    console.log(items.length);
    items.addListener(listener);
  } catch (error) {
    console.error("Open Realm failed: " + error.message);
  }
}

run().catch((err) => {
  console.error("Failed: ", err);
});

// Demo shutdown and cleanup code
process.on("SIGINT", function () {
  console.log("Shutdown and cleanup initiated!");
  try {
    const realm = Realm.open({
      schema: [schema],
      sync: {
        user: app.currentUser,
        flexible: true,
      },
    }).then((realm) => {
      realm.write(() => {
        // Delete all objects from the realm.
        //realm.deleteAll();
      });
      realm.subscriptions.update((subscriptions) => {
        subscriptions.removeAll();
      })
      process.exit();
    });
  } catch (err) {
    console.error("Failed: ", err.message);
  }
});
