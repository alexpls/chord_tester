// var jasmine = require('jasmine');
var Countdown = require('../lib/Countdown');

describe('Countdown', function() {

  beforeEach(function() {
    jasmine.clock().install();
    this.c = new Countdown(1);
  });

  afterEach(function() {
    jasmine.clock().uninstall();
  })

  describe('instantiates', function() {
    it('successfully with a number of seconds', function() {
      var numSecs = 10;
      var c = new Countdown(numSecs);
      expect(c instanceof Countdown).toBe(true);
      expect(c.seconds).toBe(numSecs);
    });

    it('unsuccessfully if seconds are not passed', function() {
      function complainer() { new Countdown(); }
      function complainer2() { new Countdown('potato'); }

      expect(complainer).toThrowError(/must be instantiated with a number of seconds/i);
      expect(complainer2).toThrowError(/Seconds passed in must be a number/i);
    });
  });

  describe('.start()', function() {
    it('sets the running var', function() {
      expect(this.c.running).toBe(false);
      this.c.start();
      expect(this.c.running).toBe(true);
    });

    it('sets timeStarted', function() {
      var mockedDate = new Date();
      jasmine.clock().mockDate(mockedDate);
      this.c.start();
      expect(this.c.timeStarted).toBe(+mockedDate);
    });

    it('is idempotent', function() {
      this.c.start();
      var timeStarted = this.c.timeStarted;
      this.c.start();
      this.c.start();
      expect(timeStarted).toBe(this.c.timeStarted);
    });
  });

  it('updates registered callbacks on its progress', function() {
    var c = this.c;

    var timesCalledTick = 0;
    c.on('tick', function() {
      timesCalledTick++;
    });

    c.start();
    jasmine.clock().tick(100);

    expect(timesCalledTick).toBe(1);
    jasmine.clock().tick(50);
    expect(timesCalledTick).toBe(1);
    jasmine.clock().tick(50);
    expect(timesCalledTick).toBe(2);
  });

  describe('.getRemainingMs()', function() {
    it('returns the number of remaining ms', function() {
      var c = this.c;
      var d = new Date();
      jasmine.clock().mockDate(d);
      c.start();
      expect(c.getRemainingMs()).toBe(c.seconds * 1000);
      d.setTime(d.getTime() + 100); // +100ms to time
      jasmine.clock().mockDate(d);
      expect(c.getRemainingMs()).toBe((c.seconds * 1000) - 100);
    });

    it('returns 0 if checked after the countdown has run its course', function() {
      var c = this.c;
      var d = new Date();
      jasmine.clock().mockDate(d);
      c.start();
      d.setTime(d.getTime() + 10000000000);
      jasmine.clock().mockDate(d);
      expect(c.getRemainingMs()).toBe(0);
    });

    it('returns 0 if the timer hasn\'nt started yet', function() {
      expect(this.c.getRemainingMs()).toBe(0);
    });
  });

  describe('.stop()', function() {
    it('no longer fires tick event callbacks', function() {
      this.c.start();
      var timesCalledTick = 0;
      this.c.on('tick', function() { timesCalledTick++; });
      jasmine.clock().tick(100);
      expect(timesCalledTick).toBe(1);
      this.c.stop();
      jasmine.clock().tick(200);
      expect(timesCalledTick).toBe(1);
    });

    it('sets running to false', function() {
      this.c.start();
      this.c.stop();
      expect(this.c.running).toBe(false);
    });

    it('calls the finished event', function(done) {
      this.c.start();
      this.c.on('finished', done);
      this.c.stop();
    });
  });

  describe('.restart()', function() {
    it('restarts the countdown', function() {
      var c = this.c;
      var d = new Date();
      jasmine.clock().mockDate(d);
      c.start();
      d.setTime(d.getTime() + 10000); // +10s to time
      c.restart();
      expect(c.running).toBe(true);
      expect(c.getRemainingMs()).toBe(c.seconds * 1000);
    });
  });

  it('finishes when the time runs out', function(done) {
    var c = this.c;
    var d = new Date();
    var msToAdvance = ((c.seconds+1) * 1000);

    c.on('finished', done);

    jasmine.clock().mockDate(d);
    c.start();
    d.setTime(d.getTime() + msToAdvance);
    jasmine.clock().mockDate(d);
    jasmine.clock().tick(msToAdvance);
  });

});
