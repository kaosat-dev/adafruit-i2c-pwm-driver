'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sleep = sleep;
exports.usleep = usleep;
var NanoTimer = require('nanotimer');

function sleep(seconds) {
  return new Promise(function (resolve, reject) {
    var timer = new NanoTimer();
    timer.setTimeout(function (x) {
      return resolve(seconds);
    }, '', seconds + 's');
    timer.clearInterval();
  });
}

function usleep(micros) {
  return new Promise(function (resolve, reject) {
    var timer = new NanoTimer();
    timer.setTimeout(function (x) {
      return resolve(micros);
    }, '', micros + 'u');
    timer.clearInterval();
  });
}