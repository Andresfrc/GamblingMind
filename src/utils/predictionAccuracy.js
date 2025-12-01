/**
 * Verifica si la predicción fue correcta comparándola con el resultado
 */
export const checkPredictionAccuracy = (game, prediction, simulation) => {
  if (!prediction || !simulation) return null;

  let isCorrect = false;
  let reason = '';

  if (game === 'ruleta') {
    // Ruleta: verificar si el color predicho es correcto
    const predictedColor = prediction.probabilidades_color?.rojo > 
      (prediction.probabilidades_color?.negro || 0) ? 'rojo' : 'negro';
    isCorrect = predictedColor === simulation.color;
    reason = `${predictedColor} vs ${simulation.color}`;
  } 
  else if (game === 'blackjack') {
    // Blackjack: verificar si predijo correctamente el resultado
    const predictedWin = prediction.probabilidad_ganar > 50;
    const actualWin = simulation.resultado === 'jugador_gana';
    isCorrect = predictedWin === actualWin;
    reason = `Predicción: ${predictedWin ? 'Ganar' : 'Perder'} | Resultado: ${
      actualWin ? 'Ganó' : simulation.resultado === 'empate' ? 'Empate' : 'Perdió'
    }`;
  } 
  else if (game === 'poker') {
    // Poker: verificar si la fuerza de mano coincide
    const predictedStrength = prediction.fuerza_mano || 'desconocida';
    const actualStrength = simulation.fuerza_mano || 'desconocida';
    isCorrect = predictedStrength === actualStrength;
    reason = `${predictedStrength} vs ${actualStrength}`;
  } 
  else if (game === 'jackpot') {
    // Jackpot: verificar si el premio está dentro del rango
    const rango = prediction.rango_predicho;
    const premio = simulation.premio_actual || simulation.premio_ganado || 0;
    if (rango && rango.minimo && rango.maximo) {
      isCorrect = premio >= rango.minimo && premio <= rango.maximo;
      reason = `$${premio.toLocaleString()} en rango $${rango.minimo.toLocaleString()}-$${rango.maximo.toLocaleString()}`;
    }
  }

  return {
    isCorrect,
    reason,
    timestamp: Date.now()
  };
};

/**
 * Obtiene el histórico de aciertos del localStorage
 */
export const getAccuracyHistory = (game) => {
  const key = `prediction_accuracy_${game}`;
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : [];
};

/**
 * Guarda un acierto en el histórico
 */
export const saveAccuracyRecord = (game, accuracy) => {
  const key = `prediction_accuracy_${game}`;
  const history = getAccuracyHistory(game);
  
  // Guardar últimos 50 registros
  history.push(accuracy);
  if (history.length > 50) {
    history.shift();
  }
  
  localStorage.setItem(key, JSON.stringify(history));
};

/**
 * Calcula estadísticas de precisión
 */
export const getAccuracyStats = (game) => {
  const history = getAccuracyHistory(game);
  if (history.length === 0) {
    return { total: 0, correct: 0, percentage: 0 };
  }

  const correct = history.filter(h => h.isCorrect).length;
  const total = history.length;
  const percentage = Math.round((correct / total) * 100);

  return { total, correct, percentage };
};

/**
 * Limpia el histórico para un juego
 */
export const clearAccuracyHistory = (game) => {
  const key = `prediction_accuracy_${game}`;
  localStorage.removeItem(key);
};
