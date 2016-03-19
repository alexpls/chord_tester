var React = require('react');
var QuestionAnswer = require('./QuestionAnswer');

module.exports = React.createClass({
  onSelectedAnswer: function(name) {
    this.props.handleSelectedAnswer(name);
  },

  render: function() {
    var that = this;
    var answerNodes = _.map(this.props.potentialAnswers, function(answer) {
      var isSelected = answer.name === that.props.selectedAnswerName;

      return <QuestionAnswer
        key={answer.name}
        chordName={answer.name}
        onSelectedAnswer={that.onSelectedAnswer}
        isSelected={isSelected}
        isDisabled={!that.props.canAnswerQuestion}
      />;
    });

    return (
      <div className="question">
        {answerNodes}
      </div>
    );
  }
});
