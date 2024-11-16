import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, useNavigate,Navigate } from 'react-router-dom';
import bgimg from './img/bgimage.jpg';
import Softcopy from './features/Softcopy';
import Genbook from './features/Genbook';
import { VariablesProvider } from './components/variables';

function App() {
  const [page, setBook] = useState(false); 
  const navigate = useNavigate();

  function togglePage() {
    setBook(!page); 
  }

  useEffect(() => {
    if (page) {
      navigate('/softcopy');
    } else {
      navigate('/genbook');
    }
  }, [page, navigate]);

  return (
      <div className="min-h-screen w-full bg-cover bg-center bg-fixed" style={{ backgroundImage: `url(${bgimg})` }}>
        {/* Header */}
        <h1 className="font-extrabold text-black text-6xl flex items-center justify-center underline">READ-MY-BOOK</h1>

        {/* Toggle Button */}
        <button 
          className="bg-red-400 rounded-md p-2 mt-4 "
          onClick={togglePage}
        >
          TOGGLE
        </button>

        <Routes>
          <Route path="/softcopy" element={<Softcopy />} />
          <Route path="/genbook" element={<Genbook />} />
          <Route path="/" element={<Navigate to={page ? '/softcopy' : '/genbook'} />} />
        </Routes>
      </div>
  );
}

export default function AppWrapper() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatRoutes: true }}>
      <VariablesProvider>
        <App />
      </VariablesProvider>
    </Router>
  );
}
