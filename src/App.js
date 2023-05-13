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
    console.log('isGameStarted:', isGameStarted);
  }, [isGameStarted]);

  useEffect(() => {
    fetchHighScores();
  }, [isGameStarted]);

  const fetchHighScores = async () => {
    try {
      const highScoresRef = ref(realtimeDatabase, 'highscores');
      const snapshot = await get(highScoresRef);
      
      if (snapshot.exists()) {
        let scores = Object.keys(snapshot.val()).map(key => ({
          id: key,
          ...snapshot.val()[key]
        }));
        scores = scores.sort((a, b) => b.score - a.score); // sorts scores in descending order
        setHighScores(scores);
      } else {
        console.log('No data available');
      }
    } catch (error) {
      console.error('Error fetching high scores:', error);
    }
  };
   
  const startGame = () => {
    console.log('Game is starting...');
    setIsGameStarted(true);
  };

  const endGame = () => {
    setIsGameStarted(false);
  };

  return (
    <div className="App">
      {isGameStarted ? (
        <Quiz initialHighScores={highScores} endGame={endGame} fetchHighScores={fetchHighScores} />
      ) : (
        <Intro highScores={highScores} startGame={startGame} />
      )}
    </div>
  );
};

export default App;