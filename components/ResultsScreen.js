var React = require('react');

module.exports = React.createClass({
  render: function() {

    var resultRowNodes = _.map(this.props.results, function(result, num) {
      var counter = num+1;

      return (
        <tr key={num}>
          <td>{counter}</td>
          <td>{ result.isCorrect ? 'Correct' : 'Failed' }</td>
          <td>{ (result.selectedAnswer && result.selectedAnswer.name) || '-' }</td>
          <td>{ result.question.correctAnswer.name }</td>
        </tr>
      );
    });

    return (
      <div className="results-screen">
        <h2>Your results should be here!</h2>

        <table className="results">
          <thead>
            <tr>
              <th>#</th>
              <th></th>
              <th>Your answer</th>
              <th>Correct answer</th>
            </tr>
          </thead>
          <tbody>
            {resultRowNodes}
          </tbody>
        </table>

        <a href="#" onClick={this.props.onRestart}>Restart</a>
      </div>
    )
  }
});
