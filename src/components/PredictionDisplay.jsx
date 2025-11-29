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

  // ✅ Cálculo simple de UI, no lógica de negocio
  const formatProbability = () => {
    if (prediction.probabilidades_color?.rojo) {
      return prediction.probabilidades_color.rojo.toFixed(1);
    }
    if (prediction.probabilidad_ganar) {
      return prediction.probabilidad_ganar.toFixed(1);
    }
    return '0.0';
  };

  const getGameName = () => {
    if (!game) return 'RULETA';
    return game.toUpperCase();
  };

  return (
    <div className="prediction-display">
      {/* Header */}
      <div className="prediction-header">
        <div className="prediction-label">Juego Actual:</div>
        <div className="prediction-game-icon">
          {gameIcons[game] || '🎲'}
        </div>
        <div className="prediction-game-name">
          {getGameName()}
        </div>
      </div>

      {/* Body */}
      <div className="prediction-body">
        <div className="probability-label">Probabilidad de Ganar:</div>
        <div className="probability-value">
          {formatProbability()}%
          <span className="probability-arrow">↗</span>
        </div>
      </div>

      {/* Información adicional si existe */}
      {prediction.numeros_calientes && prediction.numeros_calientes.length > 0 && (
        <div className="hot-numbers">
          <div className="hot-numbers-label">Números Calientes:</div>
          <div className="hot-numbers-list">
            {prediction.numeros_calientes.slice(0, 3).map((num, idx) => (
              <div key={idx} className="hot-number">
                {num.numero} <span>({num.frecuencia})</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PredictionDisplay;