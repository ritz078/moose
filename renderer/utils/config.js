const config = require('application-config')('snape');

function readConfig(cb) {
  config.read((err, data) => cb(err, data));
}

function addToConfig(obj, cb) {
  readConfig((err, data) => {
    if (err) console.log(err);
    const newConfig = Object.assign({}, data, obj);
    config.write(newConfig, cb);
  });
}

module.exports = {
  readConfig,
  addToConfig
};
