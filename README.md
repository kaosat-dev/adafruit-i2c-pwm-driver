# Adafruit I2C PWM Driver

[![npm version](https://badge.fury.io/js/adafruit-i2c-pwm-driver.svg)](https://badge.fury.io/js/adafruit-i2c-pwm-driver)


Node.js implementation for the Adafruit 16-Channel 12-bit PWM/Servo Driver
http://www.adafruit.com/products/815

- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
- [Contribute](#contribute)
- [License](#license)

## Installation

```
npm i adafruit-i2c-pwm-driver
```


## Usage

```js
const makePwmDriver = require('adafruit-i2c-pwm-driver')
const pwmDriver = makePwmDriver({address: 0x40, device: '/dev/i2c-1'})

pwmDriver.setPWMFreq(50)
pwmDriver.setPWM(2) // channel, on , off

```

To configure I2c on your Raspberry-pi / Beaglebone please see [here](https://npmjs.org/package/i2c)

you can find a simple example [here](https://raw.githubusercontent.com/kaosat-dev/adafruit-i2c-pwm-driver/master/examples/simple.js)


## API


`makePwmDriver({address:Number,device:String,debug:Bool})`

Setting up a new PwmDriver

- address: Address of the i2c panel, e.g. 0x20
- device: Device name, e.g. '/dev/i2c-1' (defaults to /dev/i2c-1)
- debug: flag used to display debug messages

`pwmDriver.setPWMFreq(frequency:Number)`

Set the PWM frequency to the provided value (in hertz).

`pwmDriver.setPWM(channel:Number, on:Number, off:Number)`

Sets a single PWM channel.

`pwmDriver.setALLPWM(channel:Number, on:Number, off:Number)`

Sets all PWM channels.


## Contribute

PRs accepted.

Small note: If editing the Readme, please conform to the [standard-readme](https://github.com/RichardLitt/standard-readme) specification.


## License
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

[![Standard - JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)
