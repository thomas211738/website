// src/App.tsx
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Brothers from './pages/Brothers';
import Rush from './pages/Rush';
import Contact from './pages/Contact';
import './App.css';

function App() {
  return (
    <div className="App">
      {/* Simple Nav Bar */}
      <nav style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/brothers">Brothers</Link>
        <Link to="/rush">Rush</Link>
        <Link to="/contact">Contact</Link>
      </nav>

      {/* Route Definitions */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/brothers" element={<Brothers />} />
        <Route path="/rush" element={<Rush />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </div>
  );
}

export default App;
