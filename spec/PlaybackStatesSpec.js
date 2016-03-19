var _ = require('lodash');
var PlaybackStates = require('../lib/PlaybackStates');

describe('PlaybackStates', function() {
  it('all playback states have a name', function() {
    _.each(PlaybackStates, function(state) {
      expect(state.displayName).toEqual(jasmine.any(String));
    });
  });
});
