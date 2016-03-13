var _ = require('lodash');

var audioCache = {};

var SoundPlayer = {
  addToCache: function(path, audio) {
    audioCache[path] = audio;
  },

  getCache: function() {
    return audioCache;
  },

  play: function(path) {
    var a = SoundPlayer.getOrCreateAudio(path);
    // since the audio is most likely going to be reused through the lifetime
    // of the page, then always make sure that we rewind it to the start before
    // playing
    a.currentTime = 0;
    a.play();
  },

  getOrCreateAudio: function(path) {
    if (!audioCache[path]) {
      var a = new Audio(path);
      a.preload = true;
      audioCache[path] = a;
    }

    return audioCache[path];
  },

  preloadAudio: function(urls, cb) {
    var that = this;
    var totalToLoad = urls.length;
    var totalLoaded = 0;

    function incr() {
      totalLoaded++;
      if (totalLoaded === totalToLoad) {
        cb();
      }
    }
    _.each(urls, function(url) {
      var a = that.getOrCreateAudio(url);

      if (a.readyState === 4) {
        incr();
      } else {
        a.addEventListener('canplaythrough', incr, false);
      }
    });
  }
};

module.exports = SoundPlayer;
