import React, { useState, useEffect } from 'react';
import Quiz from './Quiz';
import Intro from './Intro';
import { questions } from './data/questions';
import { realtimeDatabase } from './firebaseConfig';
import { ref, get, onValue, query, orderByValue, limitToLast } from 'firebase/database';
import './App.css';

const App = () => {
  const [isGameStarted, setIsGameStarted] = useState(false);
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