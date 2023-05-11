import React, { useState, useEffect } from 'react';
import { questions } from './data/questions';
import { realtimeDatabase } from './firebaseConfig';
import './App.css';
import { ref, get, onValue, push, set } from 'firebase/database';

const Quiz = ({ introHighScores }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
  const [showHighScoreForm, setShowHighScoreForm] = useState(false);

  const [highScores, setHighScores] = useState([]);

  useEffect(() => {
    fetchHighScores();
  }, []);

  const fetchHighScores = async () => {
    const highScoresRef = ref(realtimeDatabase, 'highscores');
    const snapshot = await get(highScoresRef);
    
    if (snapshot.exists()) {
      const scores = Object.keys(snapshot.val()).map(key => ({
        id: key,
        ...snapshot.val()[key]
      }));
      setHighScores(scores);
    } else {
      console.log('No data available');
    }
  };  
  
  const saveHighScore = async (name, score) => {
    const highScoresRef = ref(realtimeDatabase, 'highscores/');
    const newHighScoreRef = push(highScoresRef);
    await set(newHighScoreRef, { name, score });
    fetchHighScores();
  };

  useEffect(() => {
    setShuffledQuestions(shuffleArray([...questions]));
  }, []);

  useEffect(() => {
    if (currentQuestion >= shuffledQuestions.length) {
      setCurrentQuestion(0);
    }
  }, [currentQuestion, shuffledQuestions]);

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const checkHighScore = () => {
    setShowHighScoreForm(true);
  };
  
  const handleAnswerClick = (answer) => {
    if (answer === shuffledQuestions[currentQuestion]?.correctAnswer) {
      setScore(score + 1);
      setIsAnswerCorrect(true);
    } else {
      setScore(0);
      setIsAnswerCorrect(false);
      checkHighScore();
    }
    setShowResult(true);
    setTimeout(() => {
      setShowResult(false);
      setCurrentQuestion(currentQuestion + 1);
    }, 4000);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const playerName = e.target.playerName.value;
    if (playerName) {
      saveHighScore(playerName, score);
    }
    setScore(0);
    setShowHighScoreForm(false);
    setCurrentQuestion(currentQuestion + 1);
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