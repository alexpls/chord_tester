var React = require('react');
var _ = require('lodash');

module.exports = React.createClass({
  getInitialState: function() {
    return { remainingTimeInMs: this.props.seconds * 1000 };
  },

  componentDidMount: function() {
    this.startCountdown();
  },

  startCountdown: function() {
    var that = this;
    var refreshIntervalMs = 100;

    // reset countdown state each time we start it
    this.setState(this.getInitialState());

    var startedAtTime = +new Date();
    var finishAtTime = startedAtTime + (this.props.seconds * 1000);
    this.setState({ startedAtTime: startedAtTime });

    this._remainingTimeInterval = setInterval(function() {
      var remaining = finishAtTime - (+new Date());

      if (remaining <= 0) {
        clearInterval(that._remainingTimeInterval);
        remaining = 0;
        that.props.handleFinished();
      }

      that.setState({ remainingTimeInMs: remaining });
    }, refreshIntervalMs);
  },

  render: function() {
    var formattedTimeRemaining = Math.round(this.state.remainingTimeInMs / 100) / 10;
    if (formattedTimeRemaining % 1 === 0) {
      formattedTimeRemaining = "" + formattedTimeRemaining + ".0";
    }
    return (
      <span className="countdown">
        {formattedTimeRemaining} seconds remaining
      </span>
    );
  }
});
