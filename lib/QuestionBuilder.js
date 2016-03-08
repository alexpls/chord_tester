var _ = require('lodash');

function QuestionBuilder(chords) {
  if (!chords || !_.isArray(chords) || chords.length === 0) {
    throw new Error('Must instantiate QuestionBuilder with an array of chords');
  }
  this.chords = chords;
};

QuestionBuilder.prototype = {
  buildQuestions: function(numQuestions, numAnswers) {
    var that = this;

    validateBuildQuestionsArgs.apply({}, arguments);

    return _.times(numQuestions, function() {
      var correctAnswer = that.pickCorrectAnswer();
      var potentialAnswers = that.pickPotentialAnswers(numAnswers);

      if (_.indexOf(potentialAnswers, correctAnswer) === -1) {
        potentialAnswers.splice(0, 1, correctAnswer);
        potentialAnswers = _.shuffle(potentialAnswers);
      }

      return {
        potentialAnswers: potentialAnswers,
        correctAnswer: correctAnswer
      };
    });
  },

  pickCorrectAnswer: function() {
    return _.sample(this.chords);
  },

  pickPotentialAnswers: function(num) {
    var that = this;
    return _.times(num, function() {
      return _.sample(that.chords);
    });
  }
};

function validateBuildQuestionsArgs() {
  var args = [].slice.call(arguments);

  var numQuestions = args[0];
  var numAnswers = args[1];

  if (!numQuestions) {
    throw new Error('Must be passed number of questions to build');
  }

  if (!numAnswers) {
    throw new Error('Must be passed number of answers to build');
  }

  if (!_.isInteger(numQuestions)) {
    throw new Error('Question count must be an integer');
  }

  if (!_.isInteger(numAnswers)) {
    throw new Error('Answer count must be an integer');
  }
}

module.exports = QuestionBuilder;
