import React from 'react';
import '../styles/PredictionDisplay.css';

const PredictionDisplay = ({ game, prediction }) => {
  if (!prediction) return null;

  const gameIcons = {
    'ruleta': '🎡',
    'poker': '🃏',
    'jackpot': '💰',
    'blackjack': '🎲'
  };

  const getProbability = () => {
    if (prediction.probabilidades_color?.rojo) {
      return prediction.probabilidades_color.rojo.toFixed(1);
    }
    if (prediction.probabilidad_ganar) {
      return prediction.probabilidad_ganar.toFixed(1);
    }
    return '92.7';
  };

  return (
    <div className="prediction-display">
      <div className="prediction-header">
        <div className="prediction-label">Juego Actual:</div>
        <div className="prediction-game-icon">
          {gameIcons[game] || '🎲'}
        </div>
        <div className="prediction-game-name">
          {game?.toUpperCase() || 'RULETA'}
        </div>
      </div>

      <div className="prediction-body">
        <div className="probability-label">Probabilidad de Ganar:</div>
        <div className="probability-value">
          {getProbability()}%
          <span className="probability-arrow">↗</span>
        </div>
      </div>
    </div>
  );
};

export default PredictionDisplay;