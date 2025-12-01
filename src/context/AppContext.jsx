import React, { useState, useEffect } from 'react';
import { AppContext } from './appContextDef';

const AppProvider = ({ children }) => {
  const [selectedGame, setSelectedGame] = useState(null);
  const [selectedTable, setSelectedTable] = useState('table_1');
  const [predictionData, setPredictionData] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [simulationHistory, setSimulationHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState('home');
  const [predictions, setPredictions] = useState(() => {
    const saved = localStorage.getItem('gamblingmind_predictions');
    return saved ? JSON.parse(saved) : [];
  });

  const addChatMessage = (role, content) => {
    setChatHistory(prev => [...prev, { 
      role, 
      content, 
      timestamp: new Date() 
    }]);
  };

  const clearChat = () => {
    setChatHistory([]);
  };

  const addSimulation = (result) => {
    setSimulationHistory(prev => [...prev, result]);
  };

  const clearSimulations = () => {
    setSimulationHistory([]);
  };

  useEffect(() => {
    localStorage.setItem('gamblingmind_predictions', JSON.stringify(predictions));
  }, [predictions]);

  const addPrediction = (prediction) => {
    const newPrediction = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      game: selectedGame,
      table: selectedTable,
      ...prediction
    };
    setPredictions(prev => [...prev, newPrediction]);
    return newPrediction.id;
  };

  const updatePredictionResult = (predictionId, result) => {
    setPredictions(prev => 
      prev.map(pred => {
        if (pred.id === predictionId) {
          let isCorrect = false;
          
          // Comparación según el juego
          if (pred.game === 'ruleta') {
            isCorrect = pred.prediction === result.color;
          } else if (pred.game === 'blackjack') {
            // Verificar si ganó o perdió basado en resultado
            isCorrect = (pred.prediction === 'ganar' && result.resultado === 'jugador_gana') ||
                       (pred.prediction === 'perder' && result.resultado !== 'jugador_gana');
          } else if (pred.game === 'poker') {
            // Para poker comparamos la fuerza de mano predicha
            isCorrect = pred.prediction === result.fuerza_mano;
          } else if (pred.game === 'jackpot') {
            // Para jackpot comparamos la tendencia del premio
            // Si no hay ganador, se marca como pendiente (resultado null)
            if (result.hubo_ganador && result.premio_ganado) {
              // Determinar si el premio fue al alza o a la baja (simple comparación)
              const premioActual = result.premio_ganado;
              const tendenciaReal = premioActual > 50000 ? 'creciente' : 'decreciente';
              isCorrect = pred.prediction === tendenciaReal;
            } else {
              isCorrect = false; // Sin ganador no se puede validar
            }
          }
          
          return { ...pred, result, correct: isCorrect };
        }
        return pred;
      })
    );
  };

  const navigateTo = (page) => {
    setCurrentPage(page);
    if (page === 'home') {
      setSelectedGame(null);
      setChatHistory([]);
      setSimulationHistory([]);
      setPredictionData(null);
    }
  };

  const value = {
    selectedGame,
    selectedTable,
    predictionData,
    chatHistory,
    isLoading,
    simulationHistory,
    currentPage,
    predictions,
    setSelectedGame,
    setSelectedTable,
    setPredictionData,
    setIsLoading,
    addChatMessage,
    clearChat,
    addSimulation,
    clearSimulations,
    addPrediction,
    updatePredictionResult,
    navigateTo
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
