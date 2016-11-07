const I2C = require('i2c')

/*
  this wrappers wraps the i2c readBytes, writeBytes functions and returns promises
*/
function makeI2CWrapper (address, {device, debug}) {
  const i2c = new I2C(address, {device})

  const readBytes = (cmd, length) => {
    return new Promise(
      function (resolve, reject) {
        i2c.readBytes(cmd, length, function (error, data) {
          if (error) {
            return reject(error)
          }
          resolve(data)
        })
      }
    )
  }

  const writeBytes = (cmd, buf) => {
    if (!(buf instanceof Array)) {
      buf = [buf]
    }
    if(debug){
      console.log(`cmd ${cmd.toString(16)} values ${buf}`)
    }
    return new Promise(
      function (resolve, reject) {
        i2c.writeBytes(cmd, buf, function (error, data) {
          if (error) {
            return reject(error)
          }

          resolve(data)
        })
      }
    )
  }

  return {
    readBytes,
    writeBytes
  }
}

module.exports = makeI2CWrapper
