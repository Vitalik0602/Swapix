import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AdDetails from './pages/AdDetails';
import CreateAd from './pages/CreateAd';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ad/:id" element={<AdDetails />} />
        <Route path="/create-ad" element={<CreateAd />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}

export default App;