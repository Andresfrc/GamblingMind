// src/pages/GameSelectionPage.jsx
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import api from '../services/api';
import GameCard from '../components/GameCard';
import CircuitBackground from '../components/CircuitBackground';
import '../styles/GameSelectionPage.css';
import AnimatedBackground from '../components/AnimatedBackground';

const GameSelectionPage = ({ onGameSelect }) => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { setSelectedGame } = useAppContext();

  useEffect(() => {
    loadGames();
  }, []);

  const loadGames = async () => {
    try {
      setLoading(true);
      const response = await api.getGames();
      setGames(response.juegos || []);
      setError(null);
    } catch (err) {
      setError('Error al cargar los juegos. Asegúrate de que el backend esté corriendo.');
      console.error('Error loading games:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGameSelect = (game) => {
    setSelectedGame(game.id);
    onGameSelect(game);
  };

  if (loading) {
    return (
      <div className="game-selection-page">
        <AnimatedBackground />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando juegos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="game-selection-page">
        <AnimatedBackground />
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button className="retry-button" onClick={loadGames}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="game-selection-page">
      <AnimatedBackground />
      <div className="game-selection-content">
        <h1 className="page-title">Elija el juego a predecir:</h1>
        <div className="games-grid">
          {games.map(game => (
            <GameCard 
              key={game.id} 
              game={game} 
              onClick={() => handleGameSelect(game)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameSelectionPage;