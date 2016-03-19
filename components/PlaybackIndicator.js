var React = require('react');

module.exports = React.createClass({
  render: function() {
    return (
      <span>[{this.props.playbackState.displayName}] </span>
    )
  }
});
