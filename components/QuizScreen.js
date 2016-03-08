var React = require('react');

var CountdownTimer = require('./CountdownTimer');
var QuizQuestion = require('./QuizQuestion');
var ProgressText = require('./ProgressText');

module.exports = React.createClass({
  getInitialState: function() {
    return { currentQuestionIdx: 0 }
  },

  goToNextQuestion: function() {
    var currIdx = this.state.currentQuestionIdx;
    var newIdx = currIdx + 1;
    if (newIdx < this.props.questions.length) {
      this.setState({currentQuestionIdx: this.state.currentQuestionIdx+1});
    }
  },

  render: function() {
    var q = this.props.questions[this.state.currentQuestionIdx];
    var isLastQuestion = this.props.questions.length-1 === this.state.currentQuestionIdx;

    return (
      <div className="quiz">
        <h2>THE QUIZ HAS BEGUN!</h2>
        <CountdownTimer seconds={this.props.secondsPerQuestion} />
        <ProgressText
          total={this.props.questions.length}
          current={this.state.currentQuestionIdx+1}
          prefixText="Question"
        />
        <QuizQuestion potentialAnswers={q.potentialAnswers} correctAnswer={q.correctAnswer} />
        { !isLastQuestion && <a href="#" onClick={this.goToNextQuestion}>Next question</a> }
      </div>
    );
  }
});
