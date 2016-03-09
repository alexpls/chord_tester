var React = require('react');
var _ = require('lodash');

var CountdownTimer = require('./CountdownTimer');
var QuizQuestion = require('./QuizQuestion');
var ProgressText = require('./ProgressText');

module.exports = React.createClass({
  getInitialState: function() {
    return {
      currentQuestionIdx: 0,
      questionsWithSelectedAnswers: [],
      selectedAnswer: null,
      canAnswerQuestion: true
    }
  },

  logSelectedAnswerAgainstCurrentQuestion: function() {
    var selected = this.state.questionsWithSelectedAnswers;
    var selectedAnswer = this.state.selectedAnswer;
    var currQuestion = this.getCurrentQuestion();

    selected.push({
      question: currQuestion,
      selectedAnswer: this.state.selectedAnswer,
      isCorrect: currQuestion.correctAnswer.name === (selectedAnswer && selectedAnswer.name)
    });

    this.setState({questionsWithSelectedAnswers: selected});
  },

  getCurrentQuestion: function() {
    return this.props.questions[this.state.currentQuestionIdx];
  },

  goToNextQuestion: function(selectedAnswer) {
    var currIdx = this.state.currentQuestionIdx;

    this.logSelectedAnswerAgainstCurrentQuestion();

    var newIdx = currIdx + 1;
    if (newIdx < this.props.questions.length) {
      this.setState({
        currentQuestionIdx: currIdx+1, selectedAnswer: null,
        canAnswerQuestion: true
      });
    }
  },

  showResults: function() {
    console.log('TODO results page');
    console.log(this.state.questionsWithSelectedAnswers);
  },

  handleSelectedAnswer: function(selectedAnswerName) {
    var answer = _.find(this.getCurrentQuestion().potentialAnswers, { name: selectedAnswerName });
    this.setState({selectedAnswer: answer});
  },

  handleCountdownFinished: function() {
    this.setState({ canAnswerQuestion: false });
  },

  render: function() {
    var q = this.getCurrentQuestion();
    var isLastQuestion = this.props.questions.length-1 === this.state.currentQuestionIdx;

    return (
      <div className="quiz">
        <h2>THE QUIZ HAS BEGUN!</h2>
        <CountdownTimer
          seconds={this.props.secondsPerQuestion}
          handleFinished={this.handleCountdownFinished}
        />
        <ProgressText
          total={this.props.questions.length}
          current={this.state.currentQuestionIdx+1}
          prefixText="Question"
        />
        <QuizQuestion
          potentialAnswers={q.potentialAnswers}
          correctAnswer={q.correctAnswer}
          selectedAnswerName={this.state.selectedAnswer ? this.state.selectedAnswer.name : null}
          handleSelectedAnswer={this.handleSelectedAnswer}
          canAnswerQuestion={this.state.canAnswerQuestion}
        />
        { isLastQuestion ?
          <a href="#" onClick={this.showResults}>View results</a> :
          <a href="#" onClick={this.goToNextQuestion}>Next question</a> }
      </div>
    );
  }
});
