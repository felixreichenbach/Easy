/**
 * MongoDB Realm Object Model Definition
 * https://www.mongodb.com/docs/realm/sdk/node/examples/define-a-realm-object-model/
 */

const BSON = require("bson");

exports.DeviceSchema = {
  name: "Devices",
  properties: {
    _id: { type: "objectId" },
    name: { type: "string?", default: "Device" },
    owner_id: "string",
    signals: "{}",
    components: "Components[]"
  },
  primaryKey: '_id',
};


exports.ComponentSchema = {
  name: "Components",
  properties: {
    _id: { type: "objectId" },
    name: { type: "string?", default: "Component" },
    owner_id: "string",
    signals: "{}"
  },
  primaryKey: '_id',
};