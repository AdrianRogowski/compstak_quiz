import React, { useState, useEffect } from 'react';
import { questions } from './data/questions';
import { realtimeDatabase } from './firebaseConfig';
import './App.css';
import { ref, get, push, set } from 'firebase/database';

const Quiz = ({ initialHighScores, endGame, fetchHighScores }) => {
  console.log('Rendering Quiz component');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
  const [showHighScoreForm, setShowHighScoreForm] = useState(false);

  const [highScores, setHighScores] = useState(initialHighScores);

  useEffect(() => {
    setHighScores(initialHighScores);
  }, [initialHighScores]);

  const saveHighScore = async (name, score) => {
    const highScoresRef = ref(realtimeDatabase, 'highscores/');
    const newHighScoreRef = push(highScoresRef);
    await set(newHighScoreRef, { name, score });
    fetchHighScores();
  };

  useEffect(() => {
    if (currentQuestion > 0 && currentQuestion >= shuffledQuestions.length) {
      console.log('Calling endGame due to no more questions');
      endGame();
    }
  }, [currentQuestion, shuffledQuestions, endGame]);

  useEffect(() => {
    const shuffled = shuffleArray([...questions]);
    setShuffledQuestions(shuffled);
  }, []);

  const shuffleArray = (array) => {
    let shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const handleAnswerClick = (answer) => {
    if (answer === shuffledQuestions[currentQuestion]?.correctAnswer) {
      setScore(score + 1);
      setIsAnswerCorrect(true);
    } else {
      setIsAnswerCorrect(false);
      setTimeout(() => {
        if (score > 0 && score >= Math.min(...highScores.map(score => score.score))) {
          setShowHighScoreForm(true);
        } else {
          endGame();
        }
      }, 2000);
    }
    setShowResult(true);
    setTimeout(() => {
      setShowResult(false);
      setCurrentQuestion(currentQuestion + 1);
    }, 2000);
  };   

  const handleSubmit = (e) => {
    e.preventDefault();
    const playerName = e.target.playerName.value;
    if (playerName) {    saveHighScore(playerName, score);
    }
    setScore(0);
    setShowHighScoreForm(false);
    console.log('Calling endGame after submitting high score');
    endGame();
  };

  if (!shuffledQuestions[currentQuestion]) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {showHighScoreForm ? (
        <form onSubmit={handleSubmit}>
          <label htmlFor="playerName">Enter your name for the high score:</label>
          <input type="text" name="playerName" required />
          <button type="submit">Submit</button>
        </form>
      ) : (
        <div>
          <div className="score">Score: {score}</div>
          <h2 className="quiz-question">{shuffledQuestions[currentQuestion].question}</h2>
          <div className="question-wrapper">
            {showResult ? (
              <div className={`result-screen ${isAnswerCorrect ? 'correct' : 'incorrect'}`}>
              <h2>{isAnswerCorrect ? "Correct" : "Incorrect"}</h2>
              <div className="correct-answer">{!isAnswerCorrect ? "Correct answer: " : ""}{shuffledQuestions[currentQuestion].correctAnswer}</div>
            </div>
          ) : (
            <div>
              {shuffledQuestions[currentQuestion].options.map((option, index) => (
                <button key={index} className="option-btn" onClick={() => handleAnswerClick(option)}>
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    )}
  </div>
)
};

export default Quiz;
