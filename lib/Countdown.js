var _ = require('lodash');
var EventEmitter = require('events');

function Countdown(seconds) {
  EventEmitter.call(this);

  parseConstructorArgs.apply(this, arguments);
  this.seconds = seconds;
  this.running = false;
}

Countdown.prototype = _.extend({}, EventEmitter.prototype, {
  start: function() {
    if (this.running) { return; }

    this.running = true;
    this.timeStarted = +new Date();
    this.timeWillFinish = this.timeStarted + (1000 * this.seconds);

    var that = this;
    this._interval = setInterval(function() {
      var remaining = that.getRemainingMs();

      if (remaining == 0) {
        that.stop();
      } else {
        that.emit('tick');
      }
    }, 100);
  },

  stop: function() {
    if (!this.running) { return; }
    clearInterval(this._interval);
    this.running = false;
    this.emit('finished');
  },

  restart: function() {
    this.stop();
    this.start();
  },

  getRemainingMs: function() {
    if (!this.running) { return 0; }
    return Math.max(0, this.timeWillFinish - (+new Date()));
  }
});

function parseConstructorArgs() {
  var seconds = arguments[0];
  if (!seconds) {
    throw Error('Countdown must be instantiated with a number of seconds');
  }

  if (!_.isNumber(seconds)) {
    throw Error('Seconds passed in must be a number');
  }
}

module.exports = Countdown;
