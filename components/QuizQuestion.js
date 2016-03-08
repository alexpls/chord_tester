var React = require('react');
var QuestionAnswer = require('./QuestionAnswer');

module.exports = React.createClass({
  getInitialState: function() {
    return { selectedAnswerName: null };
  },

  componentWillReceiveProps: function(nextProps) {
    this.setState({ selectedAnswerName: null });
  },

  onSelectedAnswer: function(name) {
    console.log(name);
    this.setState({ selectedAnswerName: name });
  },

  render: function() {
    var that = this;
    var answerNodes = _.map(this.props.potentialAnswers, function(answer) {
      var isSelected = answer.name === that.state.selectedAnswerName;

      return <QuestionAnswer
        key={answer.name}
        chordName={answer.name}
        onSelectedAnswer={that.onSelectedAnswer}
        isSelected={isSelected}
      />;
    });

    return (
      <div className="question">
        <p>{ "What chord is this? (pro tip: it's "+this.props.correctAnswer.name+")" }</p>
        {answerNodes}
      </div>
    );
  }
});
