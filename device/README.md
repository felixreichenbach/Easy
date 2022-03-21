# THIS README IS OUTDATED AND WILL BE UPDATED IN THE NEXT COUPLE OF DAYS


## Implementation Specification

- Sync Profiles: Each vehicle and each customer has its own sync profile (e.g. username/password)
- Partition Key: Using VIN as partitioning key, only car specific data in one or multiple documents is synced
- Sync Permissions: The sync permissions make sure that vehicles/customers only have access to their own information

## Prerequisits:

**_NOTE:_**  I ran into issues with the latest node package and switched to 15.

* [Install npm / Realm SDK](https://docs.mongodb.com/realm/sdk/node/)

## Demo Setup

Create brand specific vin: [https://vingenerator.org/brand](https://vingenerator.org/brand)

### Setup Realm Application
[Get Started](https://docs.mongodb.com/realm/sync/get-started/)

### Configure Vehicle and Customer

- Create vehicle and customer profile
- Open demoConfig.js and fill in the appID and usernames/passwords.

### Run The Demo

**_NOTE:_**  I ran into issues with the latest node package and switched to 15.

Start the vehicle instance which will create the shadow instance in MongoDB Atlas.

```node vehicleInstance.js```

Start the customer app which will sync the vehicle shadow and set up a change listener.

```node customerApp.js```

Connect with a MongoDB Shell: 

[Connect to MongoDB Atlas Database](https://docs.atlas.mongodb.com/connect-to-cluster/#use-the-connect-to-your-cluster-dialog-to-connect-to-your-cluster)

Run this command to trigger changes on the shadow instance:

```db.Vehicle.updateOne({},{$set:{"miles": 200, "engine.cc":2}})```
