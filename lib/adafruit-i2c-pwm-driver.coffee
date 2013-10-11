
I2C = require 'i2c'
sleep = require 'sleep'

# ============================================================================
# Adafruit PCA9685 16-Channel PWM Servo Driver
# ============================================================================

class PWMDriver
  i2c = null

  # Registers/etc.
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

  #__RESET  	       : 0x0H

  constructor:(address,device, debug)->
    @address = address or 0x40
    @device = device or 1
    @debug = debug or false
    @i2c = new I2C(@address, device: @device)
      
    if (@debug)
      console.log "device #{device}, adress:#{address}, debug:#{debug}" 
      console.log "Reseting PCA9685" , "mode1:", @__MODE1
    @_send(@__MODE1, 0x00)

    if (@debug)
      console.log "init done"
   
  _send:(cmd, values)->
    ###
    console.log "cmd #{cmd.toString(16)} values #{values}"
    sys = require('sys')
    exec = require('child_process').exec;
    puts=(error, stdout, stderr)->
      sys.puts(stdout)
    exec("i2cset -y 1 0x40 #{cmd} #{values}", puts)
    ###

    if not (values instanceof Array)
      values = [values]
    console.log "cmd #{cmd.toString(16)} values #{values}"
    @i2c.writeBytes cmd, values, (err)=>
      if err?
        console.log "Error: in I2C", err

  _read:(cmd, length, callback) ->
    @i2c.readBytes cmd, length, callback
  
  scan:->
    console.log "scanning I2c devices"
    @i2c.scan (err, data)=>
      if err?
        console.log "error", err
      console.log "data", data

  _step2:(err, res)=>
    if err?
      console.log "error", err

    console.log "result buffer", res
    oldmode = res[0]
    console.log "oldmode", oldmode, "asHex", oldmode.toString(16)

    newmode = (oldmode & 0x7F) | 0x10             # sleep
    prescale = @prescale
    console.log("prescale", Math.floor(prescale),"newMode", newmode.toString(16))

    @_send(@__MODE1, newmode)        # go to sleep
    @_send(@__PRESCALE, Math.floor(prescale))
    @_send(@__MODE1, oldmode)
    #sleep.usleep(5000)
    sleep.usleep(10000)
    @_send(@__MODE1, oldmode | 0x80)
    
  setPWMFreq:(freq)->
    #"Sets the PWM frequency"
    console.log "Debug", @debug
    prescaleval = 25000000.0    # 25MHz
    prescaleval /= 4096.0       # 12-bit
    prescaleval /= freq
    prescaleval -= 1.0

    if @debug
      console.log "Setting PWM frequency to #{freq} Hz" 
      console.log "Estimated pre-scale: #{prescaleval}" 
    prescale = Math.floor(prescaleval + 0.5)
    if @debug
      console.log "Final pre-scale: #{prescale}"
    
    @prescale = prescale
    @_read(@__MODE1, 1, @_step2)
    

  setPWM:(channel, on_, off_)->
    #"Sets a single PWM channel"
    if @debug
      console.log "Setting PWM channel, channel: #{channel}, on : #{on_} off #{off_}"
      
    @_send(@__LED0_ON_L+4*channel, on_ & 0xFF)
    @_send(@__LED0_ON_H+4*channel, on_ >> 8)
    @_send(@__LED0_OFF_L+4*channel, off_ & 0xFF)
    @_send(@__LED0_OFF_H+4*channel, off_ >> 8)

  stop:->
    @_send(@__ALLLED_OFF_H, 0x01)
    #@_send(@__ALLLED_OFF_h, off_ >> 8)

module.exports = PWMDriver
