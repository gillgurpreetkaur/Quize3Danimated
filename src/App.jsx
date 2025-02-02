// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // For routing
import HomePage from './components/HomePage'; // Import HomePage component
import QuizPage from './components/QuizPage'; // Import QuizPage component

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />   {/* Home page route */}
        <Route path="/quiz" element={<QuizPage />} /> {/* Quiz page route */}
      </Routes>
    </Router>
  );
};

export default App;

