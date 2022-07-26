import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './css/App.css';
import Home from './pages/Home.js';
// import NotFound from './pages/NotFound';

function App() {
  
  return (
    <Router>
      <Routes>
        {/* Home Page */}
        <Route path="/" element={<Home />}></Route>
      </Routes>
    </Router> 
  );
}

export default App;
