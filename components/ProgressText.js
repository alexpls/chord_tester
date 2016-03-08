var React = require('react');

module.exports = React.createClass({
  render: function() {
    return (
      <div className="progressText">
        {this.props.prefixText} {this.props.current} of {this.props.total}
      </div>
    );
  }
});
