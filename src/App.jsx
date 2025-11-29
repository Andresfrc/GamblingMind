// src/App.jsx
import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import Sidebar from './components/Sidebar';
import HomePage from './pages/HomePage';
import ConfigPage from './pages/ConfigPage';
import PredictionPage from './pages/PredictionPage';
import './styles/App.css';
import { AppContext } from './context/AppContextCreate';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [gameSelected, setGameSelected] = useState(false);

  const handleNavigation = (page) => {
    setCurrentPage(page);
    if (page === 'home') {
      setGameSelected(false);
    }
  };

  const handleGameSelect = () => {
    setGameSelected(true);
    setCurrentPage('predicts');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onGameSelect={handleGameSelect} />;
      case 'config':
        return <ConfigPage />;
      case 'predicts':
        return gameSelected ? <PredictionPage /> : <HomePage onGameSelect={handleGameSelect} />;
      default:
        return <HomePage onGameSelect={handleGameSelect} />;
    }
  };

  return (
    <AppProvider>
      <div className="app">
        <Sidebar currentPage={currentPage} onNavigate={handleNavigation} />
        <div className="main-content">
          {renderPage()}
        </div>
      </div>
    </AppProvider>
  );
}

export default App;