import React, { useState, useEffect } from 'react';
import { questions } from './data/questions';
import { firestore } from './firebaseConfig';
import './App.css';
import { collection, query, orderBy, limit, getDocs, addDoc } from 'firebase/firestore';

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);

  const [highScores, setHighScores] = useState([]);

  useEffect(() => {
    fetchHighScores();
  }, []);

  const fetchHighScores = async () => {
    const highScoresRef = collection(firestore, 'highscores');
    const highScoresQuery = query(highScoresRef, orderBy('score', 'desc'), limit(10));
    const snapshot = await getDocs(highScoresQuery);
    const scores = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setHighScores(scores);
  };

  const saveHighScore = async (name, score) => {
    const highScoresRef = collection(firestore, 'highscores');
    await addDoc(highScoresRef, { name, score });
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
    const playerName = prompt('Enter your name for the high score:');
    if (playerName) {
      saveHighScore(playerName, score);
    }
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
  

  if (!shuffledQuestions[currentQuestion]) {
    return <div>Loading...</div>;
  }

  return (
    <div>
        <div className="score">Score: {score}</div>
        <h2 className="quiz-question">{shuffledQuestions[currentQuestion].question}</h2>
            <div class="question-wrapper">
            {showResult ? (
                <div className={`result-screen ${isAnswerCorrect ? 'correct' : 'incorrect'}`}>
                <h2>{isAnswerCorrect ? "Correct" : "Incorrect"}</h2>
                <div class="correct-answer">{!isAnswerCorrect ? "Correct answer: " : ""}{shuffledQuestions[currentQuestion].correctAnswer}</div>
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
  );
};

export default Quiz;