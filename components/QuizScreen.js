var React = require('react');
var _ = require('lodash');

// Require lib stuff
var Countdown = require('../lib/Countdown');
var SoundPlayer = require('../lib/SoundPlayer');

// Require UI components
var CountdownTimer = require('./CountdownTimer');
var QuestionAnswerList = require('./QuestionAnswerList');
var ProgressText = require('./ProgressText');
var ChordVariantsPlayButtons = require('./ChordVariantsPlayButtons');

module.exports = React.createClass({
  componentDidMount: function() {
    var that = this;

    this.playChordAudio();

    this.countdown = new Countdown(this.props.secondsPerQuestion);
    this.countdown.start();
    this.updateStateFromCountdown();

    this.countdown.on('tick', function() {
      that.updateStateFromCountdown();
    });

    this.countdown.on('finished', function() {
      that.handleCountdownFinished();
    });
  },

  componentWillUnmount: function() {
    this.countdown.stop();
    this.countdown = null;
  },

  getInitialState: function() {
    return {
      currentQuestionIdx: 0,
      questionsWithSelectedAnswers: [],
      selectedAnswer: null,
      canAnswerQuestion: true,
      currentlyPlayingVariant: null
    }
  },

  componentDidUpdate: function(prevProps, prevState) {
    if (prevState.currentQuestionIdx !== this.state.currentQuestionIdx) {
      this.playChordAudio();
    }
  },

  chordVariants: function() {
    return this.getCurrentQuestion().correctAnswer.variants;
  },

  playChordAudio: function() {
    var that = this;

    var audioPaths = _.filter(this.chordVariants(), function(v, k) {
      return _.indexOf(that.props.difficulty.variants, k) > -1;
    });

    var currentlyPlayingIdx = 0;
    var that = this;

    function playSound() {
      var audioInfo = audioPaths[currentlyPlayingIdx] || null;
      that.setState({currentlyPlayingVariant: audioInfo});

      if (audioInfo) {
        currentlyPlayingSound = SoundPlayer.getOrCreateAudio(audioInfo);
        // once we're done playing this sound queue up the next one
        currentlyPlayingSound.once('finishedPlaying', function() {
          currentlyPlayingIdx++;
          playSound();
        });
        SoundPlayer.play(currentlyPlayingSound);
      }
    }

    playSound();
  },

  updateStateFromCountdown: function() {
    this.setState({countdownMsRemaining: this.countdown.getRemainingMs()});
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
      this.countdown.restart();

      this.setState({
        currentQuestionIdx: currIdx+1,
        selectedAnswer: null,
        canAnswerQuestion: true
      });
    }
  },

  showResults: function() {
    this.logSelectedAnswerAgainstCurrentQuestion();
    this.props.showResults(this.state.questionsWithSelectedAnswers);
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
          msRemaining={this.state.countdownMsRemaining}
        />
        <ProgressText
          total={this.props.questions.length}
          current={this.state.currentQuestionIdx+1}
          prefixText="Question"
        />

        <strong>What chord is this?</strong>
        <ChordVariantsPlayButtons
          variants={this.chordVariants()}
          currentlyPlayingVariant={this.state.currentlyPlayingVariant}
        />

        <QuestionAnswerList
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
