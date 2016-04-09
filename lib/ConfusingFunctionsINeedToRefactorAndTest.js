function addSoundsToQuestions(questions, soundsLoaded) {
  return _.map(questions, function(question) {
    _.each(question.correctAnswer.variants, function(variant, variantKey) {
      var key = question.correctAnswer.name + '-' + variantKey;
      var sound = _.find(soundsLoaded, {key: key});
      variant.sound = sound;
    })

    _.each(question.potentialAnswers, function(answer) {
      _.each(answer.variants, function(variant, variantKey) {
        var key = answer.name + '-' + variantKey;
        var sound = _.find(soundsLoaded, {key: key});
        variant.sound = sound;
      })
    })

    return question;
  })
}

function getSoundsToLoadFromQuestions(questions) {
  var soundsToLoad = [];

  var uniqueAnswers = _.uniq(_.flatMap(questions, function(q) {
    return q.potentialAnswers
  }));

  _.each(uniqueAnswers, function(answer) {
    _.each(answer.variants, function(variant, variantType) {
      var key = answer.name + '-' + variantType;
      var url = variant.url;
      var type = 'mp3';
      soundsToLoad.push({
        key: key,
        urls: [
          {
            url: url,
            type: type
          }
        ]
      })
    })
  })
  return soundsToLoad;
}

module.exports = {
  addSoundsToQuestions: addSoundsToQuestions,
  getSoundsToLoadFromQuestions: getSoundsToLoadFromQuestions
}
