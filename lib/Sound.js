var _ = require('lodash');
var EventEmitter = require('events').EventEmitter;

function Sound(opts) {
  EventEmitter.call(this);
  this.url = opts.url;
  this.duration = opts.duration;
};

Sound.prototype = _.extend({}, EventEmitter.prototype, {
  finished: function() {
    this.emit('finishedPlaying');
  }
});

module.exports = Sound;
