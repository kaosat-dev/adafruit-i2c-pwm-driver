const makePwmDriver = require('../dist/index')
// const makePwmDriver = require('adafruit-i2c-pwm')// use this one in real use case
const sleep = require('../dist/sleep').sleep

const pwm = makePwmDriver({address: 0x40, device: '/dev/i2c-1', debug: false})

// Configure min and max servo pulse lengths
const servo_min = 150 // Min pulse length out of 4096
const servo_max = 600 // Max pulse length out of 4096

pwm.setPWMFreq(50)

const loop = function () {
  return sleep(1)
    .then(function () { return pwm.setPWM(0, 0, servo_min) })
    .then(function () { return sleep(1) })
    .then(function () { return pwm.setPWM(0, 0, servo_max) })
    .then(loop)
}

sleep(5)
  .then(loop)
