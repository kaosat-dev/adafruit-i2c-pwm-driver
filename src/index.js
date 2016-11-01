const I2C = require('i2c')
const sleep = require('sleep')

// ============================================================================
// Adafruit PCA9685 16-Channel PWM Servo Driver
// ============================================================================
module.exports = makePwmDriver

function makePwmDriver (options) {
  // Registers/etc.
  const __SUBADR1 = 0x02
  const __SUBADR2 = 0x03
  const __SUBADR3 = 0x04
  const __MODE1 = 0x00
  const __PRESCALE = 0xFE
  const __LED0_ON_L = 0x06
  const __LED0_ON_H = 0x07
  const __LED0_OFF_L = 0x08
  const __LED0_OFF_H = 0x09
  const __ALLLED_ON_L = 0xFA
  const __ALLLED_ON_H = 0xFB
  const __ALLLED_OFF_L = 0xFC
  const __ALLLED_OFF_H = 0xFD

  const defaults = {
    address: 0x40,
    device: '/dev/i2c-1',
    debug: false
  }
  const {address, device, debug} = Object.assign({}, defaults, options)
  let prescale
  const i2c = new I2C(address, {device: device})

  if (debug) {
    console.log(`device //{device}, adress:${address}, debug:${debug}`)
    console.log(`Reseting PCA9685, mode1: ${__MODE1}`)
  }
  _send(__MODE1, 0x00)
  if (debug) {
    console.log('init done')
  }

  const _send = (cmd, values) => {
    if (!(values instanceof Array)) {
      values = [values]
    }

    if (debug) {
      console.log(`cmd ${cmd.toString(16)} values ${values}`)
    }

    i2c.writeBytes(cmd, values, (err) => {
      if (err) {
        console.log('Error: in I2C', err)
      }}
    )
  }

  const _read = (cmd, length, callback) => i2c.readBytes(cmd, length, callback)

  const scan = () => {
    console.log('scanning I2c devices')
    i2c.scan((err, data) => {
      if (err) {
        console.log('error', err)
      }
      console.log('data', data)
    })
  }

  const _step2 = (err, res) => {
    if (err) {
      console.log('error', err)
      throw new Error(err)
    }

    const oldmode = res[0]
    let newmode = (oldmode & 0x7F) | 0x10 // sleep

    if (this.debug) {
      console.log(`prescale ${Math.floor(prescale)}, newMode: newmode.toString(16)`)
    }

    _send(__MODE1, newmode) // go to sleep
    _send(__PRESCALE, Math.floor(prescale))
    _send(__MODE1, oldmode)
    sleep.usleep(10000)
    _send(__MODE1, oldmode | 0x80)
  }

  const setPWMFreq = freq => {
    // "Sets the PWM frequency"
    let prescaleval = 25000000.0 // 25MHz
    prescaleval /= 4096.0 // 12-bit
    prescaleval /= freq
    prescaleval -= 1.0

    if (debug) {
      console.log(`Setting PWM frequency to ${freq} Hz`)
      console.log(`Estimated pre-scale: ${prescaleval}`)
    }
    prescale = Math.floor(prescaleval + 0.5)
    if (debug) {
      console.log(`Final pre-scale: ${prescale}`)
    }
    _read(__MODE1, 1, _step2)
  }

  const setPWM = (channel, on_, off_) => {
    // "Sets a single PWM channel"
    if (debug) {
      console.log(`Setting PWM channel, channel: ${channel}, on : ${on_} off ${off_}`)
    }
    _send(__LED0_ON_L + 4 * channel, on_ & 0xFF)
    _send(__LED0_ON_H + 4 * channel, on_ >> 8)
    _send(__LED0_OFF_L + 4 * channel, off_ & 0xFF)
    _send(__LED0_OFF_H + 4 * channel, off_ >> 8)
  }

  const stop = () => _send(__ALLLED_OFF_H, 0x01)

  return {
    _send,
    _read,
    scan,
    setPWM,
    setPWMFreq,
    stop
  }
}

/*
class PWMDriver{
  //const i2c = null

  // Registers/etc.
  __SUBADR1            : 0x02
  __SUBADR2            : 0x03
  __SUBADR3            : 0x04
  __MODE1              : 0x00
  __PRESCALE           : 0xFE
  __LED0_ON_L          : 0x06
  __LED0_ON_H          : 0x07
  __LED0_OFF_L         : 0x08
  __LED0_OFF_H         : 0x09
  __ALLLED_ON_L        : 0xFA
  __ALLLED_ON_H        : 0xFB
  __ALLLED_OFF_L       : 0xFC
  __ALLLED_OFF_H       : 0xFD

  //__RESET  	       : 0x0H

  constructor(address, device, debug){
    this.address = address || 0x40
    this.device = device || '/dev/i2c-1'
    this.debug = debug || false
    this.i2c = new I2C(this.address, {device: this.device})

    if (this.debug){
      console.log( "device //{device}, adress:#{address}, debug:#{debug}")
      console.log("Reseting PCA9685" , "mode1:", this.__MODE1)
    }

    this._send(this.__MODE1, 0x00)
    if (this.debug){
      console.log("init done")
    }

  }

  _send(cmd, values){

    if(!(values instanceof Array)){
      values = [values]
    }

    if( this.debug)
    {
      console.log(`cmd ${cmd.toString(16)} values ${values}`)
    }

    this.i2c.writeBytes(cmd, values, (err) =>{
      if(err){
        console.log("Error: in I2C", err)
      }}
    )
  }

  _read(cmd, length, callback){
    this.i2c.readBytes(cmd, length, callback)
  }

  scan(){
    console.log( "scanning I2c devices")
    this.i2c.scan( (err, data) =>
      {
      if(err){
        console.log( "error", err)
      }
      console.log("data", data)
    })
  }

  _step2(err, res){
    if(err){
      console.log( "error", err)
      throw new Error(err)
    }

    oldmode = res[0]
    newmode = (oldmode & 0x7F) | 0x10 // sleep
    prescale = this.prescale

    if( this.debug){
      console.log("prescale", Math.floor(prescale),"newMode", newmode.toString(16))
    }

    this._send(this.__MODE1, newmode)        // go to sleep
    this._send(this.__PRESCALE, Math.floor(prescale))
    this._send(this.__MODE1, oldmode)
    sleep.usleep(10000)
    this._send(this.__MODE1, oldmode | 0x80)
  }

  setPWMFreq(freq){
    //"Sets the PWM frequency"
    prescaleval = 25000000.0    // 25MHz
    prescaleval /= 4096.0       // 12-bit
    prescaleval /= freq
    prescaleval -= 1.0

    if( this.debug)
    {
      console.log(`Setting PWM frequency to ${freq} Hz`)
      console.log( `Estimated pre-scale: ${prescaleval}`)
    }
    prescale = Math.floor(prescaleval + 0.5)
    if( this.debug){
      console.log("Final pre-scale: ${prescale}")
    }

    this.prescale = prescale
    this._read(this.__MODE1, 1, this._step2)
  }

  setPWM(channel, on_, off_){
    //"Sets a single PWM channel"
    if(this.debug){
      console.log( `Setting PWM channel, channel: ${channel}, on : ${on_} off ${off_}`)
    }
    this._send(this.__LED0_ON_L+4*channel, on_ & 0xFF)
    this._send(this.__LED0_ON_H+4*channel, on_ >> 8)
    this._send(this.__LED0_OFF_L+4*channel, off_ & 0xFF)
    this._send(this.__LED0_OFF_H+4*channel, off_ >> 8)
  }

  stop(){
    this._send(this.__ALLLED_OFF_H, 0x01)
    //this._send(this.__ALLLED_OFF_h, off_ >> 8)
  }

}
module.exports = PWMDriver*/
