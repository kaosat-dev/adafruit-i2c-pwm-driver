'use strict';

var _sleep = require('./sleep');

var I2C = require('./i2cWrapper');


// ============================================================================
// Adafruit PCA9685 16-Channel PWM Servo Driver
// ============================================================================
module.exports = makePwmDriver;

function makePwmDriver(options) {
  // Registers/etc.
  var MODE1 = 0x00;
  var MODE2 = 0x01;
  var SUBADR1 = 0x02;
  var SUBADR2 = 0x03;
  var SUBADR3 = 0x04;
  var PRESCALE = 0xFE;
  var LED0_ON_L = 0x06;
  var LED0_ON_H = 0x07;
  var LED0_OFF_L = 0x08;
  var LED0_OFF_H = 0x09;
  var ALL_LED_ON_L = 0xFA;
  var ALL_LED_ON_H = 0xFB;
  var ALL_LED_OFF_L = 0xFC;
  var ALL_LED_OFF_H = 0xFD;

  // Bits:
  var RESTART = 0x80;
  var SLEEP = 0x10;
  var ALLCALL = 0x01;
  var INVRT = 0x10;
  var OUTDRV = 0x04;

  var defaults = {
    address: 0x40,
    device: '/dev/i2c-1',
    debug: false
  };

  var _Object$assign = Object.assign({}, defaults, options),
      address = _Object$assign.address,
      device = _Object$assign.device,
      debug = _Object$assign.debug;

  var i2c = I2C(address, { device: device, debug: debug });
  var prescale = void 0;

  var init = function init() {
    if (debug) {
      console.log('device //{device}, adress:' + address + ', debug:' + debug);
      console.log('Reseting PCA9685, mode1: ' + MODE1);
    }
    // i2c.writeByte(0x06) // SWRST
    // i2c.writeBytes(MODE1, 0x00)
    //
    /*await setAllPWM(0, 0)
    await i2c.writeBytes(MODE2, OUTDRV)
    await i2c.writeBytes(MODE1, ALLCALL)
    sleep.usleep(5000) // wait for oscillator
     let mode1 =  await i2c.readBytes(MODE1, 1)
    mode1 = mode1 & ~SLEEP // wake up (reset sleep)
    await i2c.writeBytes(MODE1, mode1)
    sleep.usleep(5000) // wait for oscillator
     if (debug) {
      console.log('init done')
    }
    */

    // i2c.writeBytes(MODE1, 0x00)
    // in the future use await i2c.writeBytes(MODE1, ALLCALL)
    setAllPWM(0, 0);
    i2c.writeBytes(MODE2, OUTDRV);
    i2c.writeBytes(MODE1, ALLCALL);
    (0, _sleep.usleep)(5000).then(function (x) {
      return i2c.readBytes(MODE1, 1).then(function (mode1) {
        mode1 = mode1 & ~SLEEP; // wake up (reset sleep)
        return i2c.writeBytes(MODE1, mode1);
      }).then((0, _sleep.usleep)(5000)) // wait for oscillator)
      .then(function (x) {
        return debug ? console.log('init done ') : '';
      }).catch(function (e) {
        return console.error('error in init', e);
      });
    });
  };

  var setPWMFreq = function setPWMFreq(freq) {
    // "Sets the PWM frequency"
    var prescaleval = 25000000.0; // 25MHz
    prescaleval /= 4096.0; // 12-bit
    prescaleval /= freq;
    prescaleval -= 1.0;

    if (debug) {
      console.log('Setting PWM frequency to ' + freq + ' Hz');
      console.log('Estimated pre-scale: ' + prescaleval);
    }
    prescale = Math.floor(prescaleval + 0.5);
    if (debug) {
      console.log('Final pre-scale: ' + prescale);
    }

    return i2c.readBytes(MODE1, 1).then(function (data) {
      var oldmode = data[0];
      var newmode = oldmode & 0x7F | 0x10; // sleep
      if (debug) {
        console.log('prescale ' + Math.floor(prescale) + ', newMode: newmode.toString(16)');
      }
      i2c.writeBytes(MODE1, newmode); // go to sleep
      i2c.writeBytes(PRESCALE, Math.floor(prescale));
      i2c.writeBytes(MODE1, oldmode);
      (0, _sleep.usleep)(5000).then(function (x) {
        return i2c.writeBytes(MODE1, oldmode | 0x80);
      });
    });
  };

  // Sets a single PWM channel
  var setPWM = function setPWM(channel, on, off) {
    if (debug) {
      console.log('Setting PWM channel, channel: ' + channel + ', on : ' + on + ' off ' + off);
    }
    /*await i2c.writeBytes(LED0_ON_L + 4 * channel, on & 0xFF)
    await i2c.writeBytes(LED0_ON_H + 4 * channel, on >> 8)
    await i2c.writeBytes(LED0_OFF_L + 4 * channel, off & 0xFF)
    await i2c.writeBytes(LED0_OFF_H + 4 * channel, off >> 8)*/
    i2c.writeBytes(LED0_ON_L + 4 * channel, on & 0xFF);
    i2c.writeBytes(LED0_ON_H + 4 * channel, on >> 8);
    i2c.writeBytes(LED0_OFF_L + 4 * channel, off & 0xFF);
    i2c.writeBytes(LED0_OFF_H + 4 * channel, off >> 8);
  };

  var setAllPWM = function setAllPWM(on, off) {
    /*await i2c.writeBytes(ALL_LED_ON_L, on & 0xFF)
    await i2c.writeBytes(ALL_LED_ON_H, on >> 8)
    await i2c.writeBytes(ALL_LED_OFF_L, off & 0xFF)
    await i2c.writeBytes(ALL_LED_OFF_H, off >> 8)*/
    i2c.writeBytes(ALL_LED_ON_L, on & 0xFF);
    i2c.writeBytes(ALL_LED_ON_H, on >> 8);
    i2c.writeBytes(ALL_LED_OFF_L, off & 0xFF);
    i2c.writeBytes(ALL_LED_OFF_H, off >> 8);
  };

  var stop = function stop() {
    return i2c.writeBytes(ALL_LED_OFF_H, 0x01);
  };

  // actual init
  init();

  return {
    setPWM: setPWM,
    setAllPWM: setAllPWM,
    setPWMFreq: setPWMFreq,
    stop: stop };
}