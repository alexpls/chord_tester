var React = require('react');

module.exports = React.createClass({
  handleSelectedAnswer: function() {
    this.props.onSelectedAnswer(this.props.chordName);
  },

  render: function() {
    return (
      <div className="answer" onClick={this.handleSelectedAnswer}>
        { this.props.isSelected ? '[X] ' : '[ ] ' }
        <span className="chord-name">{this.props.chordName}</span>
      </div>
    );
  }
});
