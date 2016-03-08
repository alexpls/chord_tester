var _ = require('lodash');
var QuestionBuilder = require('../lib/QuestionBuilder');
var acousticChords = require('../data/chords/acoustic-guitar-chords.json');

describe('QuestionBuilder', function() {
  describe('gets instantiated', function() {
    it('can be instantiated with an array of chords', function() {
      var qb = new QuestionBuilder(acousticChords);
      expect(qb instanceof QuestionBuilder).toBe(true);
      expect(qb.chords).toBe(acousticChords);
    });

    it('throws an error if not instantiated with chords', function() {
      expect(function() { new QuestionBuilder() }).toThrowError(/array of chords/);
    });

    it('throws an error if chords array is empty', function() {
      expect(function() { new QuestionBuilder([]); }).toThrowError(/array of chords/);
    });
  });

  describe('builds questions', function() {
    beforeEach(function() {
      this.qb = new QuestionBuilder(acousticChords);
    });

    it('throws if not given number of questions to build', function() {
      var qb = this.qb;
      function complainer() { qb.buildQuestions(); }
      expect(complainer).toThrowError(/must be passed number of questions/i);
    });

    it('throws if not given number of answers to build', function() {
      var qb = this.qb;
      function complainer() { qb.buildQuestions(2); }
      expect(complainer).toThrowError(/must be passed number of answers/i);
    });

    it('throws if not given integer for number of questions to build', function() {
      var qb = this.qb;
      function complainer() { qb.buildQuestions('two', 12); }
      expect(complainer).toThrowError(/question count must be an integer/i);
    });

    it('throws if not given integer for number of answers to build', function() {
      var qb = this.qb;
      function complainer() { qb.buildQuestions(12, '29'); }
      expect(complainer).toThrowError(/answer count must be an integer/i);
    });

    it('numbering as specified', function() {
      var that = this;
      _.times(3, function() {
        var num = _.random(1, 20);
        expect(that.qb.buildQuestions(num, 1).length).toBe(num);
      });
    });

    it('with the specified number of potential answers', function() {
      var qb = this.qb;
      _.times(3, function() {
        var num = _.random(1, 20);
        var qs = qb.buildQuestions(10, num);
        _.each(qs, function(q) { expect(q.potentialAnswers.length).toBe(num); });
      })
    });

    it('with the correct number of answers even when its chord pool is smaller', function() {
      var numAnswers = this.qb.chords.length + 10;
      var question = this.qb.buildQuestions(1, numAnswers)[0];
      expect(question.potentialAnswers.length).toBe(numAnswers);
    });

    it('with a single correct answer', function() {
      var qb = this.qb;
      _.times(3, function() {
        var num = _.random(1, 20);
        var qs = qb.buildQuestions(8, num);
        _.each(qs, function(q) {
          expect(_.isPlainObject(q.correctAnswer)).toBe(true);
          expect(_.isArray(q.correctAnswer)).toBe(false);
        });
      });
    });

    it('with the correct answer in the array of potential answers', function() {
      var qb = this.qb;

      _.times(10, function() {
        _.each(qb.buildQuestions(_.random(1, 20), _.random(1, 20)), function(question) {
          expect(_.indexOf(question.potentialAnswers, question.correctAnswer)).toBeGreaterThan(-1);
        });
      });
    });
  });
});
