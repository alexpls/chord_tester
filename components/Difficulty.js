var React = require('react');
var ReactDOM = require('react-dom');

module.exports = React.createClass({
  handleSelectedDifficulty: function(e) {
    e.preventDefault();
    this.props.didSelectDifficulty(this.props.id);
  },

  render: function() {
    var className = "difficulty";
    if (this.props.isSelected) {
      className += " selected";
    }
    return (
      <div className={className} onClick={this.handleSelectedDifficulty}>
        <p className="title">
          {this.props.isSelected ? "[X]" : "[ ]"}
          {this.props.name}
        </p>
      </div>
    );
  }
});
