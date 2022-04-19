
exports.DeviceSchema = {
  name: 'Devices',
  properties: {
    _id: 'objectId',
    name: 'string?',
    owner_id: 'string?',
  },
  primaryKey: '_id',
};
