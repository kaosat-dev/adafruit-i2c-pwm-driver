'use strict';

var I2C = require('i2c');

/*
  this wrappers wraps the i2c readBytes, writeBytes functions and returns promises
*/
function makeI2CWrapper(address, _ref) {
  var device = _ref.device,
      debug = _ref.debug;

  var i2c = new I2C(address, { device: device });

  var readBytes = function readBytes(cmd, length) {
    return new Promise(function (resolve, reject) {
      i2c.readBytes(cmd, length, function (error, data) {
        if (error) {
          return reject(error);
        }
        resolve(data);
      });
    });
  };

  var writeBytes = function writeBytes(cmd, buf) {
    if (!(buf instanceof Array)) {
      buf = [buf];
    }
    if (debug) {
      console.log('cmd ' + cmd.toString(16) + ' values ' + buf);
    }
    return new Promise(function (resolve, reject) {
      i2c.writeBytes(cmd, buf, function (error, data) {
        if (error) {
          return reject(error);
        }

        resolve(data);
      });
    });
  };

  return {
    readBytes: readBytes,
    writeBytes: writeBytes
  };
}

module.exports = makeI2CWrapper;