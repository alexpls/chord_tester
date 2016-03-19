var _ = require('lodash');
var React = require('react');

var PlaybackStates = require('../lib/PlaybackStates');
var chordVariants = require('../data/chord_variants');

var PlaybackIndicator = require('./PlaybackIndicator');

function getVariantDisplayName(variantKey) {
  var variant = _.find(chordVariants, {key: variantKey});
  return variant ? variant.name : null;
}

module.exports = React.createClass({
  render: function() {
    var that = this;
    var buttonNodes = _.map(this.props.variants, function(variant, key) {
      var playingUrl = that.props.currentlyPlayingVariant
        ? that.props.currentlyPlayingVariant.url : null;

      var playbackState = variant.url === playingUrl
        ? PlaybackStates.Playing : PlaybackStates.Stopped;

      return (
        <div className="chord-variant" key={key}>
          <PlaybackIndicator playbackState={playbackState} />
          <span className="variant-name">{getVariantDisplayName(key)}</span>
        </div>
      );
    });

    return (
      <div className="chord-variants">{buttonNodes}</div>
    );
  }
});
