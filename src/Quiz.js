import React, { useState, useEffect } from 'react';
import { questions } from './data/questions';
import './App.css';

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);

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

  const handleAnswerClick = (answer) => {
    if (answer === shuffledQuestions[currentQuestion]?.correctAnswer) {
      setScore(score + 1);
      setIsAnswerCorrect(true);
    } else {
      setScore(0);
      setIsAnswerCorrect(false);
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