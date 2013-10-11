PmwServoDriver = require("../main")
sleep = require('sleep')

pwm = new PmwServoDriver(0x40, '/dev/i2c-1', true)

servoMin = 150  # Min pulse length out of 4096
servoMax = 600  # Max pulse length out of 4096

setServoPulse=(channel, pulse)->
  pulseLength = 1000000                   # 1,000,000 us per second
  pulseLength /= 60                       # 60 Hz
  print "%d us per period" % pulseLength
  pulseLength /= 4096                     # 12 bits of resolution
  print "%d us per bit" % pulseLength
  pulse *= 1000
  pulse /= pulseLength
  pwm.setPWM(channel, 0, pulse)

pwm.setPWMFreq(60) # Set frequency to 60 Hz  
#pwm.scan()    


setHigh=()->
  pwm.setPWM(0, 0, servoMax)
  setTimeout( setLow, 1000 )

setLow=()->
  pwm.setPWM(0,0, servoMin)
  setTimeout( setHigh, 1000 )

servoLoop=()->
  setLow()
  #pwm.setPWM(0, 0, servoMin)
  #setTimeout( setHigh, 1000 )

#setInterval servoLoop 2200

servoLoop()

###
while true
  # Change speed of continuous servo on channel O
  pwm.setPWM(0, 0, servoMin)
  pwm.setPWM(0, 0, servoMax)
  sleep.sleep(1)
###
