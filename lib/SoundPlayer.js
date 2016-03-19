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

  getOrCreateAudio: function(sound) {
    if (!audioCache[sound.url]) {
      var a = new Audio(sound.url);
      a.preload = true;
      this.addToCache(sound, a);
    }

    return audioCache[sound.url];
  },

  play: function(sounds) {
    sounds = _.isArray(sounds) ? sounds : [sounds];

    var soundElems = _.map(sounds, function(sound) {
      return SoundPlayer.getOrCreateAudio(sound);
    });

    var playedIdx = 0;

    if (currentlyPlaying) {
      SoundPlayer.stop();
    }

    function playNext() {
      var s = soundElems[playedIdx];

      // deferring playback of the audio seems to keep the countdown timer
      // updating smoothly
      setTimeout(function() {
        // Since the audio is most likely going to be reused through the lifetime
        // of the page, then always make sure that we rewind it to the start before
        // playing.
        s.audio.currentTime = 0;
        s.audio.play();
        currentlyPlaying = s;
      }, 1);

      // called when playback of the audio should have finished
      upNextTimeout = setTimeout(function() {
        currentlyPlaying.finished();
        currentlyPlaying = null;
        if (playedIdx < sounds.length-1) {
          playedIdx++;
          playNext();
        }
      }, s.duration * 1000);
    }

    playNext();
  },

  stop: function() {
    if (!currentlyPlaying) { return; }
    currentlyPlaying.audio.pause();
    currentlyPlaying.audio.currentTime = 0;
    currentlyPlaying.finished();
    currentlyPlaying = null;
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
