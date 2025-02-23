import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import RegisterParrain from './pages/RegisterParrain';
import ParrainageForm from './pages/ParrainageForm';
import CandidatsList from './pages/CandidatsList';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<RegisterParrain />} />
          <Route path="/parrainage" element={<ParrainageForm />} />
          <Route path="/candidats" element={<CandidatsList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;