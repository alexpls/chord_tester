var React = require('react');
var ReactDOM = require('react-dom');
var _ = require('lodash');
var Rubin = require('rubin');

var difficulties = require('./data/difficulties.json');
var acousticChords = require('./data/chords/acoustic-guitar-chords.json');

var QuestionBuilder = require('./lib/QuestionBuilder');

var StartScreen = require('./components/StartScreen');
var QuizScreen = require('./components/QuizScreen');
var ResultsScreen = require('./components/ResultsScreen');

var addSoundsToQuestions = require('./lib/ConfusingFunctionsINeedToRefactorAndTest').addSoundsToQuestions;
var getSoundsToLoadFromQuestions = require('./lib/ConfusingFunctionsINeedToRefactorAndTest').getSoundsToLoadFromQuestions;

var rubin;

function main() {
  var contentElem = document.getElementById('content');

  function onStartQuiz(difficultyId) {
    var difficulty = _.find(difficulties, { id: difficultyId });
    var qb = new QuestionBuilder(acousticChords, difficulty);
    var instrument = "acoustic-guitar";
    var questions = qb.buildQuestions(10, 6);

    function finishedLoading() {
      ReactDOM.render(
        <QuizScreen
        secondsPerQuestion={difficulty.secondsPerQuestion}
        questions={questions}
        showResults={showResults}
        difficulty={difficulty}
        />,
        contentElem
      );
    }

    var soundsToLoad = getSoundsToLoadFromQuestions(questions);
    if (!rubin) { rubin = new Rubin(); }

    rubin.preloadSounds(soundsToLoad, function(err, soundsLoaded) {
      questions = addSoundsToQuestions(questions, soundsLoaded)
      finishedLoading()
    });

    ReactDOM.render(
      <h2>Loading chords...</h2>,
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
