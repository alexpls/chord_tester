var _ = require('lodash');
var glob = require('glob');

describe('chords data', function() {
  beforeAll(function() {
    var chordFiles = {};
    var filePaths = glob.sync('data/chords/*-chords.json');
    _.each(filePaths, function(filePath) {
      chordFiles[filePath] = require('../' + filePath);
    });
    this.chordFiles = chordFiles;
  });

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
});
