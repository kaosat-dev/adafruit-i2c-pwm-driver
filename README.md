Adafruit I2C PWM Driver
======================

Node.js implementation for the Adafruit 16-Channel 12-bit PWM/Servo Driver 
http://www.adafruit.com/products/815



Usage
-----
```coffeescript
PwmDriver = require('adafruit-i2c-pwm')
pwm = new PwmDriver  0x40 '/dev/i2c-1'

```


API
====

  - [PwmDriver(device:String,address:Number)](#lcdplatedevicestringaddressnumberpollintervalnumber)

## PwmDriver(device:String,address:Number)

Setting up a new PwmDriver

- device: Device name, e.g. '/dev/i2c-1'
- address: Address of the i2c panel, e.g. 0x20

#
## Licence
MIT

Based on the [Adafruit's Raspberry-Pi Python Code Library](https://github.com/adafruit/Adafruit-Raspberry-Pi-Python-Code.git)

>  Here is a growing collection of libraries and example python scripts
>  for controlling a variety of Adafruit electronics with a Raspberry Pi
  
>  In progress!
>
>  Adafruit invests time and resources providing this open source code,
>  please support Adafruit and open-source hardware by purchasing
>  products from Adafruit!
>
>  Written by Limor Fried, Kevin Townsend and Mikey Sklar for Adafruit Industries.
>  BSD license, all text above must be included in any redistribution
>
>  To download, we suggest logging into your Pi with Internet accessibility and typing:
>  git clone https://github.com/adafruit/Adafruit-Raspberry-Pi-Python-Code.git
