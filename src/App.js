import React, { useState, useEffect } from 'react';
import Quiz from './Quiz';
import Intro from './Intro';
import { questions } from './data/questions';
import { firestore } from './firebaseConfig';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import './App.css';

const App = () => {
  const [isGameStarted, setIsGameStarted] = useState(false);
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

  const startGame = () => {
    setIsGameStarted(true);
  };

  return (
    <div className="App">
      {isGameStarted ? (
        <Quiz highScores={highScores} />
      ) : (
        <Intro highScores={highScores} startGame={startGame} />
      )}
    </div>
  );
};

export default App;