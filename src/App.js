// App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from './components/Signup';
import Home from './components/Home';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
