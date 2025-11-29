import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import api from '../services/api';
import ChatInterface from '../components/ChatInterface';
import PredictionDisplay from '../components/PredictionDisplay';
import CircuitBackground from '../components/CircuitBackground';
import '../styles/PredictionPage.css';

const PredictionPage = () => {
  const { 
    selectedGame, 
    selectedTable, 
    predictionData, 
    setPredictionData,
    chatHistory,
    addChatMessage,
    isLoading,
    setIsLoading 
  } = useAppContext();

  const [simulationCount, setSimulationCount] = useState(0);

  useEffect(() => {
    if (selectedGame) {
      initializeGame();
    }
  }, [selectedGame]);

  const initializeGame = async () => {
    // Simular algunas rondas iniciales para tener datos
    await runSimulations(15);
    await getPrediction();
  };

  const runSimulations = async (count) => {
    try {
      for (let i = 0; i < count; i++) {
        await api.simulate(selectedGame, selectedTable);
        setSimulationCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error running simulations:', error);
    }
  };

  const getPrediction = async () => {
    try {
      setIsLoading(true);
      const response = await api.predict(selectedGame, selectedTable);
      
      if (response.prediccion) {
        setPredictionData(response.prediccion);
      } else if (response.error) {
        addChatMessage('assistant', `⚠️ ${response.mensaje || response.error}`);
      }
    } catch (error) {
      console.error('Error getting prediction:', error);
      addChatMessage('assistant', 'Error al obtener la predicción. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (message) => {
    addChatMessage('user', message);
    setIsLoading(true);

    try {
      const response = await api.chat(message);
      
      if (response.response) {
        addChatMessage('assistant', response.response);
      }

      // Si el mensaje pide una nueva predicción, actualizarla
      if (message.toLowerCase().includes('predicción') || 
          message.toLowerCase().includes('tendencia') ||
          message.toLowerCase().includes('gráfico')) {
        await getPrediction();
      }
    } catch (error) {
      console.error('Error sending message:', error);
      addChatMessage('assistant', 'Lo siento, hubo un error al procesar tu mensaje.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSimulate = async () => {
    try {
      await api.simulate(selectedGame, selectedTable);
      setSimulationCount(prev => prev + 1);
      await getPrediction();
    } catch (error) {
      console.error('Error simulating:', error);
    }
  };

  if (!selectedGame) {
    return (
      <div className="prediction-page">
        <CircuitBackground />
        <div className="no-game-selected">
          <p>Por favor, selecciona un juego primero.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="prediction-page">
      <CircuitBackground />
      
      <div className="prediction-content">
        <div className="prediction-header">
          <h2>Análisis: {selectedGame.toUpperCase()}</h2>
          <div className="prediction-controls">
            <button className="simulate-btn" onClick={handleSimulate}>
              🎲 Simular Ronda
            </button>
            <button className="refresh-btn" onClick={getPrediction}>
              🔄 Actualizar Predicción
            </button>
            <span className="simulation-counter">
              Simulaciones: {simulationCount}
            </span>
          </div>
        </div>

        <ChatInterface 
          messages={chatHistory}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          gameImage="https://via.placeholder.com/80x80/dc143c/ffffff?text=R"
        />
      </div>

      <PredictionDisplay 
        game={selectedGame}
        prediction={predictionData}
      />
    </div>
  );
};

export default PredictionPage;