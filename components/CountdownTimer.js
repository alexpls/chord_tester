var React = require('react');
var _ = require('lodash');

module.exports = React.createClass({
  render: function() {
    var formattedTimeRemaining = Math.round(this.props.msRemaining / 100) / 10;
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
