var React = require('react');
var ReactDOM = require('react-dom');
var _ = require('lodash');

var difficulties = require('./data/difficulties.json');
var acousticChords = require('./data/chords/acoustic-guitar-chords.json');

var QuestionBuilder = require('./lib/QuestionBuilder');

var StartScreen = require('./components/StartScreen');
var QuizScreen = require('./components/QuizScreen');
var ResultsScreen = require('./components/ResultsScreen');

function main() {
  var contentElem = document.getElementById('content');

  function onStartQuiz(difficultyId) {
    var qb = new QuestionBuilder(acousticChords);
    var instrument = "acoustic-guitar";
    var questions = qb.buildQuestions(10, 6);

    ReactDOM.render(
      <QuizScreen
        secondsPerQuestion={10}
        questions={questions}
        showResults={showResults}
        />,
      contentElem
    );
  };

  function showResults(results) {
    console.log('showResults', results);
    ReactDOM.render(
      <ResultsScreen
        results={results}
        onRestart={showStartScreen}
      />,
      contentElem
    );
  }

  function showStartScreen() {
    ReactDOM.render(
      <StartScreen difficulties={difficulties} onStartQuiz={onStartQuiz} />,
      contentElem
    );
  }

  showStartScreen();

}

main();
