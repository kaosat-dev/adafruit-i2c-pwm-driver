const makePwmDriver = require('../dist/index')
// const makePwmDriver = require('adafruit-i2c-pwm')
const sleep = require('sleep').sleep

const pwm = makePwmDriver(0x40, '/dev/i2c-1')

// Configure min and max servo pulse lengths
const servo_min = 150 // Min pulse length out of 4096
const servo_max = 600 // Max pulse length out of 4096

pwm.setPWMFreq(50)

setTimeout(function () {
  console.log('Moving servo on channel 0, press Ctrl-C to quit...')
  while(true) {
    // Move servo on channel O between extremes.
    pwm.setPWM(0, 0, servo_min)
    //pwm.setPWM(12, 0, servo_min)
    sleep(1)
    pwm.setPWM(0, 0, servo_max)
    //pwm.setPWM(12, 0, servo_max)
    sleep(1)
  }
}, 5000)
