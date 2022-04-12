
exports.ItemSchema = {
  name: 'Item',
  properties: {
    _id: 'objectId',
    name: 'string?',
    owner_id: 'string?',
  },
  primaryKey: '_id',
};
