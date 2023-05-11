import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyAZzTx-HgGetOZ8tRb5_3rmOjJR62iFkJo",
    authDomain: "compstak-quiz.firebaseapp.com",
    databaseURL: "https://compstak-quiz-default-rtdb.firebaseio.com",
    projectId: "compstak-quiz",
    storageBucket: "compstak-quiz.appspot.com",
    messagingSenderId: "1008141173943",
    appId: "1:1008141173943:web:4856da21002fb039afb932"
  };

const app = initializeApp(firebaseConfig);
const realtimeDatabase = getDatabase(app);

export { realtimeDatabase };