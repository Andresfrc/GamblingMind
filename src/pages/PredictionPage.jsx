import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import api from '../services/api';
import ChatInterface from '../components/ChatInterface';
import PredictionDisplay from '../components/PredictionDisplay';
import AnimatedBackground from '../components/AnimatedBackground';
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
  const [chatInput, setChatInput] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [gameImage, setGameImage] = useState('');

  useEffect(() => {
    if (selectedGame) {
      initializeGame();
      setGameImageFromGame();
    }
  }, [selectedGame]);

  useEffect(() => {
    if (predictionData) {
      generateRecommendation();
    }
  }, [predictionData]);

  const setGameImageFromGame = () => {
    const images = {
      'ruleta': '',
      'poker': 'https://via.placeholder.com/80x80/2e7d32/ffffff?text=P',
      'jackpot': 'https://via.placeholder.com/80x80/ffc107/ffffff?text=J',
      'blackjack': 'https://via.placeholder.com/80x80/1976d2/ffffff?text=B'
    };
    setGameImage(images[selectedGame] || images['ruleta']);
  };

  const initializeGame = async () => {
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
      addChatMessage('assistant', '⚠️ Error al ejecutar simulaciones');
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

  const generateRecommendation = () => {
    if (!predictionData) {
      setRecommendation('Esperando análisis...');
      return;
    }

    if (predictionData.probabilidades_color?.rojo > 50) {
      setRecommendation(`Apuesta Rojo (${predictionData.probabilidades_color.rojo.toFixed(1)}% probabilidad)`);
    } else if (predictionData.probabilidades_color?.negro > 50) {
      setRecommendation(`Apuesta Negro (${predictionData.probabilidades_color.negro.toFixed(1)}% probabilidad)`);
    } else if (predictionData.numero_predicho) {
      setRecommendation(`Apuesta al número ${predictionData.numero_predicho}`);
    } else {
      setRecommendation('Análisis en progreso...');
    }
  };

  const handleSimulate = async () => {
    try {
      await api.simulate(selectedGame, selectedTable);
      setSimulationCount(prev => prev + 1);
      await getPrediction();
      addChatMessage('assistant', '✅ Nueva simulación completada');
    } catch (error) {
      console.error('Error simulating:', error);
      addChatMessage('assistant', '⚠️ Error en la simulación');
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isLoading) return;

    const message = chatInput;
    setChatInput('');
    addChatMessage('user', message);
    setIsLoading(true);

    try {
      const response = await api.chat(message);
      
      if (response.response) {
        addChatMessage('assistant', response.response);
      }

      const needsPrediction = message.toLowerCase().includes('predicción') || 
                              message.toLowerCase().includes('tendencia') ||
                              message.toLowerCase().includes('gráfico') ||
                              message.toLowerCase().includes('probabilidad');
      
      if (needsPrediction) {
        await getPrediction();
      }
    } catch (error) {
      console.error('Error sending message:', error);
      addChatMessage('assistant', 'Lo siento, hubo un error al procesar tu mensaje.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!selectedGame) {
    return (
      <div className="prediction-page">
        <AnimatedBackground />
        <div className="no-game-selected">
          <p>Por favor, selecciona un juego primero.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="prediction-page">
      <AnimatedBackground />
      
      <div className="prediction-content">
        <div className="prediction-header">
          <h2>Análisis: {selectedGame.toUpperCase()}
            </h2>
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
      inputValue={chatInput}
      onInputChange={setChatInput}
      onSendMessage={handleSendMessage}
      isLoading={isLoading}
      gameImage={gameImage}
      recommendation={recommendation}
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