// filepath: /c:/Users/taiba/gestion-parrainages/parrainage-frontoffice/project/src/App.tsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import RegisterParrain from './pages/RegisterParrain';
import CandidatsList from './pages/CandidatsList';
import ParrainageForm from './pages/ParrainageForm';
import LoginParrain from './pages/LoginParrain';
import CandidatePresentation from './pages/CandidatePresentation';
import About from './pages/About';
import CandidatLogin from './pages/CandidatLogin';
import CandidatDashboard from './pages/CandidatDashboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<RegisterParrain />} />
          <Route path="/login" element={<LoginParrain />} />
          <Route path="/parrain" element={<ParrainageForm />} />
          <Route path="/candidats" element={<CandidatsList />} />
          <Route path="/candidat/:id" element={<CandidatePresentation />} />
          <Route path="/about" element={<About />} />
          <Route path="/candidat/login" element={<CandidatLogin />} />
          <Route path="/candidat/dashboard" element={<CandidatDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;