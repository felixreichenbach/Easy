exports.deviceSchema = {
  name: 'device',
  properties: {
    _id: 'objectId',
    attributes: 'device_attributes',
    signals: 'device_signals',
  },
  primaryKey: '_id',
};

exports.device_attributesSchema = {
  name: 'device_attributes',
  embedded: true,
  properties: {
    engine_ccm: 'int?',
    model: 'string?',
    weight: 'double?',
  },
};

exports.device_signalsSchema = {
  name: 'device_signals',
  embedded: true,
  properties: {
    fuel_level: 'int?',
    gps_coords: 'device_signals_gps_coords',
    speed: 'double?',
  },
};

exports.device_signals_gps_coordsSchema = {
  name: 'device_signals_gps_coords',
  embedded: true,
  properties: {
    coordinates: 'double[]',
    type: 'string?',
  },
};
