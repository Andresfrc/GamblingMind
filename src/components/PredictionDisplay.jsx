import React, { useMemo } from 'react';
import AccuracyBadge from './AccuracyBadge';
import { checkPredictionAccuracy, saveAccuracyRecord, getAccuracyStats } from '../utils/predictionAccuracy';
import '../styles/PredictionDisplay.css';

const PredictionDisplay = ({ game, prediction, lastSimulation, simulationHistory }) => {
  // Compute accuracy without setState in effect
  const { accuracy, stats } = useMemo(() => {
    if (!prediction || !lastSimulation) {
      return { accuracy: null, stats: null };
    }

    const result = checkPredictionAccuracy(game, prediction, lastSimulation);
    if (result) {
      // Save to localStorage directly in memoized computation
      saveAccuracyRecord(game, result);
      return { accuracy: result, stats: getAccuracyStats(game) };
    }
    return { accuracy: null, stats: null };
  }, [game, prediction, lastSimulation]);

  if (!prediction && !lastSimulation) return null;

  const renderRuletaDisplay = () => (
    <>
      {/* Último resultado */}
      {lastSimulation && (
        <div className="last-result">
          <div className="result-label">Última tirada:</div>
          <div className={`result-number ${lastSimulation.color}`}>
            {lastSimulation.numero}
          </div>
          <div className="result-details">
            <span className={`color-badge ${lastSimulation.color}`}>{lastSimulation.color}</span>
            <span className="detail">{lastSimulation.paridad}</span>
            <span className="detail">Docena {lastSimulation.docena}</span>
          </div>
        </div>
      )}

      {/* Historial reciente */}
      {simulationHistory && simulationHistory.length > 0 && (
        <div className="history-section">
          <div className="history-label">Últimas tiradas:</div>
          <div className="history-numbers">
            {simulationHistory.map((sim, idx) => (
              <span key={idx} className={`history-number ${sim.color}`}>
                {sim.numero}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Predicción */}
      {prediction && (
        <div className="prediction-section">
          <div className="prediction-row">
            <span className="pred-label">Número predicho:</span>
            <span className="pred-value highlight">{prediction.numero_predicho}</span>
          </div>
          <div className="probability-bars">
            <div className="prob-bar">
              <span className="bar-label">Rojo</span>
              <div className="bar-container">
                <div className="bar rojo" style={{ width: `${prediction.probabilidades_color?.rojo || 0}%` }}></div>
              </div>
              <span className="bar-value">{prediction.probabilidades_color?.rojo?.toFixed(1)}%</span>
            </div>
            <div className="prob-bar">
              <span className="bar-label">Negro</span>
              <div className="bar-container">
                <div className="bar negro" style={{ width: `${prediction.probabilidades_color?.negro || 0}%` }}></div>
              </div>
              <span className="bar-value">{prediction.probabilidades_color?.negro?.toFixed(1)}%</span>
            </div>
          </div>
          {Array.isArray(prediction.numeros_calientes) && prediction.numeros_calientes.length > 0 && (
            <div className="hot-numbers">
              <span className="hot-label">🔥 Calientes:</span>
              {prediction.numeros_calientes.slice(0, 5).map((n, i) => (
                <span key={i} className="hot-number">{n.numero} ({n.frecuencia})</span>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );

  const renderBlackjackDisplay = () => (
    <>
      {lastSimulation && (
        <div className="last-result blackjack">
          <div className="result-label">Última mano:</div>
          <div className="cards-display">
            <div className="hand">
              <span className="hand-label">Tu mano:</span>
              <div className="cards">
                {lastSimulation.mano_jugador?.map((carta, i) => (
                  <span key={i} className="card">{carta}</span>
                ))}
              </div>
              <span className="hand-value">= {lastSimulation.valor_jugador}</span>
            </div>
            <div className="hand">
              <span className="hand-label">Dealer:</span>
              <div className="cards">
                {lastSimulation.mano_dealer?.map((carta, i) => (
                  <span key={i} className="card">{carta}</span>
                ))}
              </div>
            </div>
          </div>
          <div className={`result-badge ${lastSimulation.resultado?.includes('jugador') ? 'win' : 'lose'}`}>
            {lastSimulation.resultado === 'jugador_gana' ? '🎉 Ganaste' : 
             lastSimulation.resultado === 'dealer_gana' ? '❌ Dealer gana' : '🤝 Empate'}
          </div>
        </div>
      )}

      {prediction && (
        <div className="prediction-section">
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-label">Prob. Ganar</span>
              <span className="stat-value">{prediction.probabilidad_ganar?.toFixed(1)}%</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">True Count</span>
              <span className={`stat-value ${prediction.true_count > 0 ? 'positive' : 'negative'}`}>
                {prediction.true_count?.toFixed(1)}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Ventaja</span>
              <span className={`stat-value ${prediction.ventaja_jugador > 0 ? 'positive' : 'negative'}`}>
                {prediction.ventaja_jugador?.toFixed(1)}%
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Cartas vistas</span>
              <span className="stat-value">{prediction.cartas_vistas}</span>
            </div>
          </div>
          {prediction.momento_favorable && (
            <div className="favorable-alert">✨ ¡Momento favorable para apostar!</div>
          )}
        </div>
      )}
    </>
  );

  const renderPokerDisplay = () => (
    <>
      {lastSimulation && (
        <div className="last-result poker">
          <div className="result-label">Tu mano:</div>
          <div className="cards-display">
            <div className="cards poker-hand">
              {lastSimulation.mano_jugador?.map((carta, i) => (
                <span key={i} className="card large">{carta}</span>
              ))}
            </div>
          </div>
          {lastSimulation.cartas_comunitarias?.length > 0 && (
            <>
              <div className="result-label">Mesa ({lastSimulation.fase}):</div>
              <div className="cards community">
                {lastSimulation.cartas_comunitarias.map((carta, i) => (
                  <span key={i} className="card">{carta}</span>
                ))}
              </div>
            </>
          )}
          <div className="poker-info">
            <span>Pot: ${lastSimulation.pot_simulado}</span>
            <span>Jugadores: {lastSimulation.jugadores_activos}</span>
          </div>
        </div>
      )}

      {prediction && (
        <div className="prediction-section">
          <div className="stats-grid">
            <div className="stat-item large">
              <span className="stat-label">Fuerza de mano</span>
              <span className="stat-value">{prediction.fuerza_mano}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Fase</span>
              <span className="stat-value">{prediction.fase}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Prob. mejorar</span>
              <span className="stat-value">{prediction.probabilidad_mejorar?.toFixed(1)}%</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Outs</span>
              <span className="stat-value">{prediction.outs_estimados}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );

  const renderJackpotDisplay = () => (
    <>
      {lastSimulation && (
        <div className="last-result jackpot">
          <div className="result-label">Premio actual:</div>
          <div className="jackpot-amount">
            ${lastSimulation.premio_actual?.toLocaleString()}
          </div>
          {lastSimulation.hubo_ganador && (
            <div className="winner-alert">🎉 ¡Hubo un ganador! Premio: ${lastSimulation.premio_ganado?.toLocaleString()}</div>
          )}
        </div>
      )}

      {prediction && (
        <div className="prediction-section">
          <div className="jackpot-prediction">
            <div className="range-label">Rango predicho del próximo premio:</div>
            <div className="range-values">
              <span className="range-min">${prediction.rango_predicho?.minimo?.toLocaleString()}</span>
              <span className="range-separator">—</span>
              <span className="range-max">${prediction.rango_predicho?.maximo?.toLocaleString()}</span>
            </div>
          </div>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-label">Promedio histórico</span>
              <span className="stat-value">${prediction.estadisticas?.promedio_historico?.toLocaleString()}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Tendencia</span>
              <span className={`stat-value trend-${prediction.tendencia}`}>{prediction.tendencia}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );

  const gameIcons = {
    'ruleta': '🎡',
    'poker': '🃏',
    'jackpot': '💰',
    'blackjack': '🎲'
  };

  return (
    <div className={`prediction-display ${game}`}>
      <div className="display-header">
        <span className="game-icon">{gameIcons[game] || '🎮'}</span>
        <span className="game-title">{game?.toUpperCase()}</span>
      </div>
      
      <div className="display-content">
        {game === 'ruleta' && renderRuletaDisplay()}
        {game === 'blackjack' && renderBlackjackDisplay()}
        {game === 'poker' && renderPokerDisplay()}
        {game === 'jackpot' && renderJackpotDisplay()}
        
        {accuracy && <AccuracyBadge isCorrect={accuracy.isCorrect} reason={accuracy.reason} stats={stats} />}
      </div>
    </div>
  );
};

export default PredictionDisplay;
