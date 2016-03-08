var React = require('react');
var ReactDOM = require('react-dom');
var _ = require('lodash');

var QuestionBuilder = require('./lib/QuestionBuilder.js');

var difficulties = require('./data/difficulties.json');

var StartScreen = require('./components/StartScreen.js');
var CountdownTimer = require('./components/CountdownTimer.js');

var contentElem = document.getElementById('content');

var QuestionAnswer = React.createClass({
  render: function() {
    return (
      <div className="answer">
        <span className="chord-name">{this.props.chordName}</span>
      </div>
    );
  }
});

var QuizQuestion = React.createClass({
  render: function() {
    var answerNodes = _.map(this.props.potentialAnswers, function(a) {
      return <QuestionAnswer chordName={a.name}/>;
    });

    return (
      <div className="question">
        <p>{ "What chord is this? (pro tip: it's "+this.props.correctAnswer.name+")" }</p>
        {answerNodes}
      </div>
    );
  }
});

var QuizScreen = React.createClass({
  getInitialState: function() {
    return { currentQuestionIdx: 0 }
  },

  render: function() {
    var q = this.props.questions[this.state.currentQuestionIdx];

    return (
      <div className="quiz">
        <h2>THE QUIZ HAS BEGUN!</h2>
        <CountdownTimer seconds={this.props.secondsPerQuestion} />
        <QuizQuestion potentialAnswers={q.potentialAnswers} correctAnswer={q.correctAnswer} />
      </div>
    );
  }
});

var acousticChords = require('./data/chords/acoustic-guitar-chords.json');
var qb = new QuestionBuilder(acousticChords);

function onStartQuiz(difficultyId) {
  var instrument = "acoustic-guitar";
  var questions = qb.buildQuestions(10, 6);

  ReactDOM.render(
    <QuizScreen
      secondsPerQuestion={10}
      questions={questions}
    />,
    contentElem
  );
}

ReactDOM.render(
  <StartScreen difficulties={difficulties} onStartQuiz={onStartQuiz} />,
  contentElem
);
