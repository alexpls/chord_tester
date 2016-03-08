var React = require('react');
var ReactDOM = require('react-dom');

var Difficulty = require('./Difficulty.js');

module.exports = React.createClass({
  getInitialState: function() {
    return { selectedDifficultyId: this.props.difficulties[0].id }
  },

  didSelectDifficulty: function(difficultyId) {
    this.setState({ selectedDifficultyId: difficultyId });
  },

  handleStartQuiz: function() {
    console.log('Starting quiz with difficulty: ' + this.state.selectedDifficultyId);
    this.props.onStartQuiz(this.state.selectedDifficultyId);
  },

  render: function() {
    var that = this;

    var difficultyNodes = this.props.difficulties.map(function(difficulty) {
      var isSelected = difficulty.id === that.state.selectedDifficultyId;

      return (
        <Difficulty
          key={difficulty.id}
          id={difficulty.id}
          name={difficulty.name}
          isSelected={isSelected}
          didSelectDifficulty={that.didSelectDifficulty}
        />
      );
    });

    return (
      <div className="difficulties">
        <h2>Choose a difficulty</h2>
        {difficultyNodes}
        <a href="#" onClick={this.handleStartQuiz}>Start!</a>
      </div>
    )
  }
});
