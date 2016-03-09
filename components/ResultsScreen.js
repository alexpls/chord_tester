var React = require('react');

module.exports = React.createClass({
  render: function() {
    return (
      <div className="results-screen">
        <h2>Your results should be here!</h2>
        <a href="#" onClick={this.props.onRestart}>Restart</a>
      </div>
    )
  }
});
