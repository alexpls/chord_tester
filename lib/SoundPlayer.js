var _ = require('lodash');

var audioCache = {};
var currentlyPlaying;
var upNextTimeout;

var SoundPlayer = {
  addToCache: function(audio, audioElem) {
    audio.audio = audioElem;
    audioCache[audio.url] = audio;
  },

  getCache: function() {
    return audioCache;
  },

  getOrCreateAudio: function(audio) {
    if (!audioCache[audio.url]) {
      var a = new Audio(audio.url);
      a.preload = true;
      this.addToCache(audio, a);
    }

    return audioCache[audio.url];
  },

  play: function(audios) {
    audios = _.isArray(audios) ? audios : [audios];

    var audioElems = _.map(audios, function(audio) {
      return SoundPlayer.getOrCreateAudio(audio);
    });

    var playedIdx = 0;

    if (currentlyPlaying) {
      SoundPlayer.stop();
    }

    function playNext() {
      var a = audioElems[playedIdx];

      // deferring playback of the audio seems to keep the countdown timer
      // updating smoothly
      setTimeout(function() {
        // Since the audio is most likely going to be reused through the lifetime
        // of the page, then always make sure that we rewind it to the start before
        // playing.
        a.audio.currentTime = 0;
        a.audio.play();
        currentlyPlaying = a;
      }, 1);

      // called when playback of the audio should have finished
      upNextTimeout = setTimeout(function() {
        currentlyPlaying = null;
        if (playedIdx < audios.length-1) {
          playedIdx++;
          playNext();
        }
      }, a.duration * 1000);
    }

    playNext();
  },

  stop: function() {
    if (!currentlyPlaying) { return; }
    currentlyPlaying.audio.pause();
    currentlyPlaying.audio.currentTime = 0;
    clearTimeout(upNextTimeout);
    upNextTimeout = null;
  },

  preloadAudio: function(audios, cb) {
    var that = this;
    var totalToLoad = audios.length;
    var totalLoaded = 0;

    // Break apart loading audio into a sequential operation... if we try
    // to push the browser by getting it to load too many audio files at the
    // same time sometimes the 'canplaythrough' event doesn't get called.
    // This way is slightly slower but heaps safer.
    function incr() {
      totalLoaded++;

      if (totalLoaded === totalToLoad) {
        cb();
      } else {
        next();
      }
    }

    function next() {
      var a = that.getOrCreateAudio(audios[totalLoaded]);

      if (a.audio.readyState === 4) {
        incr();
      } else {
        a.audio.addEventListener('canplaythrough', incr, false);
      }
    }

    next(); // kick it off
  }
};

module.exports = SoundPlayer;
