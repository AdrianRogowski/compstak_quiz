import React from 'react';

const Intro = ({ highScores, startGame }) => {
    return (
      <div>
        <div className="highscores">
          <h2>High Scores</h2>
          <ol>
            {highScores.map((score, index) => (
              <li key={index}>{score.name}: {score.score}</li>
            ))}
          </ol>
        </div>
        <button onClick={startGame}>Start Game</button>
      </div>
    );
  };

export default Intro;