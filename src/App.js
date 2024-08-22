// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import TaskManager from './components/TaskManager';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/tasks/*" element={<TaskManager  />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
