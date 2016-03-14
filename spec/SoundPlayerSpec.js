var _ = require('lodash');

var SoundPlayer = require('../lib/SoundPlayer');

xdescribe('SoundPlayer', function() {

  function generateFakeAudio() {
    return {
      currentTime: 0,
      readyState: 0,
      play: function() { },
      addEventListener: function() { }
    };
  }

  describe('.addToCache', function() {
    it('adds to cache given a url and Audio instance', function() {
      var fakeAudio = { foo: 'bar' };
      SoundPlayer.addToCache('/hey.mp3', fakeAudio);
      var cache = SoundPlayer.getCache();
      expect(_.keys(cache).length).toBe(1);
      expect(cache['/hey.mp3']).toBe(fakeAudio);
    })
  });

  describe('.play', function() {
    beforeEach(function() {
      this.fake = generateFakeAudio();
      spyOn(this.fake, 'play').and.callThrough();
    });

    it('rewinds an audio before playing', function() {
      this.fake.currentTime = 100;
      SoundPlayer.addToCache('/hey.mp3', this.fake);
      SoundPlayer.play('/hey.mp3');
      expect(this.fake.currentTime).toBe(0);
    });

    it('sends the play message to the audio', function() {
      SoundPlayer.addToCache('/hey.mp3', this.fake);
      SoundPlayer.play('/hey.mp3');
      expect(this.fake.play).toHaveBeenCalled();
    });
  });

  xdescribe('.preloadAudio', function() {
    it('calls back once all audio urls have been loaded in', function(done) {
      var fakes = {
        '/hey.mp3': generateFakeAudio(),
        '/yo.mp3': generateFakeAudio(),
        '/whats-up.mp3': generateFakeAudio()
      };
      fakes['/hey.mp3'].readyState = 4; // pretend that this one is already loaded

      var registeredCallbacks = {};
      var callingLastCallback = false;

      spyOn(SoundPlayer, 'getOrCreateAudio').and.callFake(function(url) {
        var fake = fakes[url];

        spyOn(fake, 'addEventListener').and.callFake(function(eventName, cb) {
          expect(eventName).toBe('canplaythrough');
          registeredCallbacks[url] = cb;
        });

        return fake;
      });

      SoundPlayer.preloadAudio(_.keys(fakes), function() {
        expect(callingLastCallback).toBe(true);
        done();
      });

      setTimeout(function() {
        expect(_.difference(_.keys(fakes), _.keys(registeredCallbacks))[0]).toBe('/hey.mp3');
        registeredCallbacks['/whats-up.mp3']();
        callingLastCallback = true;
        registeredCallbacks['/yo.mp3']();
      }, 10);
    });
  });
});
