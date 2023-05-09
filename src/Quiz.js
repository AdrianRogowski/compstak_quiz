// src/Quiz.js

import React, { useState } from 'react';
import { questions } from './data/questions';

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleAnswerClick = (answer) => {
    if (answer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
      setShowResult(true);
      setTimeout(() => {
        setShowResult(false);
        setCurrentQuestion(currentQuestion + 1);
      }, 2000);
    } else {
      setShowResult(true);
      setTimeout(() => {
        setShowResult(false);
        setScore(0);
        setCurrentQuestion(0);
      }, 2000);
    }
  };

  return (
    <div>
      {showResult ? (
        <div>
          {score > 0 ? "Correct" : "Incorrect"}
          {score === 0 && (
            <div>Correct answer: {questions[currentQuestion].correctAnswer}</div>
          )}
        </div>
      ) : (
        <div>
          <h2>{questions[currentQuestion].question}</h2>
          {questions[currentQuestion].options.map((option, index) => (
            <button key={index} onClick={() => handleAnswerClick(option)}>
              {option}
            </button>
          ))}
        </div>
      )}
      <div>Score: {score}</div>
    </div>
  );
};

export default Quiz;
