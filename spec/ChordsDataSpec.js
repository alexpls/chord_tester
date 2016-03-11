var _ = require('lodash');
var glob = require('glob');
var fs = require('fs');

describe('chords data', function() {
  beforeAll(function() {
    var chordFiles = {};
    var filePaths = glob.sync('data/chords/*-chords.json');
    _.each(filePaths, function(filePath) {
      chordFiles[filePath] = require('../' + filePath);
    });
    this.chordFiles = chordFiles;
  });

  function splitFilename(fn) {
    var matches = fn.match(/\/([a-zA-Z-]+)-chords\.json$/);
    if (!matches) { return false; }
    return {
      instrument: matches[1]
    };
  }

  it('currently only has one chord set defined', function() {
    expect(_.keys(this.chordFiles).length).toBe(1);
    expect(_.keys(this.chordFiles)[0]).toMatch(/acoustic-guitar-chords\.json$/);
  });

  it('all chords have a name', function() {
    _.each(this.chordFiles, function(chords, fileName) {
      _.each(chords, function(chord) {
        expect(_.isString(chord.name)).toBe(true);
        expect(chord.name.length).toBeGreaterThan(0);
      });
    });
  });

  it('has correctly formatted file name', function() {
    _.each(this.chordFiles, function(chords, fileName) {
      expect(splitFilename(fileName)).not.toBe(false);
    });
  });

  it('has all the required audio files', function() {
    _.each(this.chordFiles, function(chords, fileName) {
      var fnComps = splitFilename(fileName);

      _.each(chords ,function(chord) {
        expect(fs.statSync(chord.audioFilePath).isFile()).toBe(true);
      });
    });
  });
});
