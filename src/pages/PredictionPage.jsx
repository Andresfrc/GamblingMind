import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAppContext } from '../context/useAppContext';
import api from '../services/api.js';
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
    setIsLoading,
    addPrediction,
    updatePredictionResult
  } = useAppContext();

  const [simulationCount, setSimulationCount] = useState(0);
  const [chatInput, setChatInput] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [gameImage, setGameImage] = useState('');
  const [lastSimulation, setLastSimulation] = useState(null);
  const [simulationHistory, setSimulationHistory] = useState([]);
  const [currentPredictionId, setCurrentPredictionId] = useState(null);
  const initializedGameRef = useRef(null);
  const isMountedRef = useRef(true);

  // Evalúa la fuerza de una mano de poker
  const evaluatePokerHand = useCallback((mano) => {
    if (!mano || mano.length !== 2) return 'desconocida';
    
    const valores = { 'A': 14, 'K': 13, 'Q': 12, 'J': 11 };
    const cartas = [];
    
    for (const carta of mano) {
      const valorStr = carta.slice(0, -1); // Remover el palo
      const valor = valores[valorStr] || (parseInt(valorStr) || 0);
      cartas.push(valor);
    }
    
    // Pareja
    if (cartas[0] === cartas[1]) {
      return cartas[0] >= 13 ? 'Premium (pareja alta)' : 'Pareja';
    }
    // Cartas altas
    if (Math.max(...cartas) >= 12) {
      return 'Cartas altas';
    }
    
    return 'Mano media';
  }, []);

  const getPrediction = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.predict(selectedGame, selectedTable);
      
      if (!isMountedRef.current) return;
      
      if (response.prediccion) {
        setPredictionData(response.prediccion);
        
        // Guardar predicción según el juego
        let predictionValue = '';
        let probValue = 0;
        
        if (selectedGame === 'ruleta') {
          predictionValue = response.prediccion.probabilidades_color?.rojo > 
            (response.prediccion.probabilidades_color?.negro || 0) ? 'rojo' : 'negro';
          probValue = response.prediccion.probabilidades_color?.rojo || 0;
        } else if (selectedGame === 'blackjack') {
          predictionValue = response.prediccion.probabilidad_ganar > 50 ? 'ganar' : 'perder';
          probValue = response.prediccion.probabilidad_ganar || 0;
        } else if (selectedGame === 'poker') {
          predictionValue = response.prediccion.fuerza_mano || 'desconocida';
          probValue = response.prediccion.probabilidad_mejorar || 0;
        } else if (selectedGame === 'jackpot') {
          // Para jackpot usamos la tendencia como predicción
          predictionValue = response.prediccion.tendencia || 'estable';
          probValue = 50; // Confianza por defecto para tendencias
        }
        
        const predId = addPrediction({
          prediction: predictionValue,
          probability: probValue,
          type: 'prediction'
        });
        setCurrentPredictionId(predId);
      } else if (response.error) {
        addChatMessage('assistant', `⚠️ ${response.mensaje || response.error}`);
      }
    } catch (error) {
      console.error('Error getting prediction:', error);
      
      if (isMountedRef.current) {
        const data = error.data;
        if (data?.mensaje || data?.error) {
          addChatMessage('assistant', `⚠️ ${data.mensaje || data.error}`);
        } else {
          addChatMessage('assistant', 'Error al obtener la predicción. Intenta de nuevo.');
        }
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [selectedGame, selectedTable, setIsLoading, setPredictionData, addChatMessage, addPrediction]);

  useEffect(() => {
    // Inicializar referencia de montaje
    isMountedRef.current = true;
    
    if (!selectedGame) return;
    
    // Evitar re-inicialización si ya se inicializó para este juego
    if (initializedGameRef.current === selectedGame) return;
    initializedGameRef.current = selectedGame;

    const images = {
      'ruleta': 'https://via.placeholder.com/80x80/d32f2f/ffffff?text=R',
      'poker': 'https://via.placeholder.com/80x80/2e7d32/ffffff?text=P',
      'jackpot': 'https://via.placeholder.com/80x80/ffc107/ffffff?text=J',
      'blackjack': 'https://via.placeholder.com/80x80/1976d2/ffffff?text=B'
    };
    setGameImage(images[selectedGame] || images['ruleta']);

    const initializeGame = async () => {
      const history = [];
      try {
        // Ejecutar 15 simulaciones para obtener historial
        for (let i = 0; i < 15; i++) {
          const result = await api.simulate(selectedGame, selectedTable);
          if (result.resultado) {
            history.push(result.resultado);
          }
        }
        
        // Solo actualizar si el componente sigue montado
        if (isMountedRef.current) {
          setSimulationHistory(history.slice(-10));
          setLastSimulation(history[history.length - 1] || null);
          setSimulationCount(15);
        }
      } catch (error) {
        console.error('Error running simulations:', error);
        if (isMountedRef.current) {
          addChatMessage('assistant', '⚠️ Error al ejecutar simulaciones');
        }
      }
      
      try {
        setIsLoading(true);
        const response = await api.predict(selectedGame, selectedTable);
        
        // Solo actualizar si el componente sigue montado
        if (isMountedRef.current && response.prediccion) {
          setPredictionData(response.prediccion);
        }
      } catch (error) {
        console.error('Error getting initial prediction:', error);
      } finally {
        if (isMountedRef.current) {
          setIsLoading(false);
        }
      }
    };

    initializeGame();

    // Cleanup: marcar componente como desmontado
    return () => {
      isMountedRef.current = false;
    };
  }, [selectedGame, selectedTable, addChatMessage, setIsLoading, setPredictionData]);

  useEffect(() => {
    if (!predictionData) {
      setRecommendation('Esperando análisis...');
      return;
    }

    if (selectedGame === 'ruleta') {
      if (predictionData.probabilidades_color?.rojo > 50) {
        setRecommendation(`Apuesta Rojo (${predictionData.probabilidades_color.rojo.toFixed(1)}% probabilidad)`);
      } else if (predictionData.probabilidades_color?.negro > 50) {
        setRecommendation(`Apuesta Negro (${predictionData.probabilidades_color.negro.toFixed(1)}% probabilidad)`);
      } else if (predictionData.numero_predicho) {
        setRecommendation(`Apuesta al número ${predictionData.numero_predicho}`);
      } else {
        setRecommendation('Distribución equilibrada. Juega con precaución.');
      }
    } else if (selectedGame === 'blackjack') {
      const prob = predictionData.probabilidad_ganar;
      const trueCount = predictionData.true_count;
      if (trueCount > 2) {
        setRecommendation(`¡Momento favorable! True count: ${trueCount}. Prob. ganar: ${prob?.toFixed(1) || prob}%`);
      } else if (trueCount < -2) {
        setRecommendation(`Mazo desfavorable. True count: ${trueCount}. Reduce apuestas.`);
      } else {
        setRecommendation(`Mazo neutro. Prob. ganar: ${prob?.toFixed(1) || prob}%`);
      }
    } else if (selectedGame === 'poker') {
      const fuerza = predictionData.fuerza_mano || 'desconocida';
      const probMejorar = predictionData.probabilidad_mejorar;
      setRecommendation(`Fuerza: ${fuerza}. Prob. mejorar: ${probMejorar?.toFixed(1) || probMejorar || 0}%`);
    } else if (selectedGame === 'jackpot') {
      const rango = predictionData.rango_predicho;
      if (rango) {
        setRecommendation(`Rango estimado: $${rango.minimo?.toLocaleString()} - $${rango.maximo?.toLocaleString()}`);
      } else {
        setRecommendation('Esperando más historial de premios...');
      }
    } else {
      setRecommendation('Análisis en progreso...');
    }
  }, [predictionData, selectedGame]);

  const handleSimulate = useCallback(async () => {
    if (isLoading) return;
    
    try {
      setIsLoading(true);
      const result = await api.simulate(selectedGame, selectedTable);
      if (result.resultado) {
        let resultadoConMetadata = { ...result.resultado };
        
        // Para poker, calcular fuerza_mano de la simulación
        if (selectedGame === 'poker' && result.resultado.mano_jugador) {
          resultadoConMetadata.fuerza_mano = evaluatePokerHand(result.resultado.mano_jugador);
        }
        
        setLastSimulation(resultadoConMetadata);
        setSimulationHistory(prev => [...prev.slice(-9), resultadoConMetadata]);
        setSimulationCount(prev => prev + 1);
        
        // Guardar resultado de simulación en predicción actual
        if (currentPredictionId) {
          updatePredictionResult(currentPredictionId, resultadoConMetadata);
          
          // Notificación después de un pequeño delay
          setTimeout(() => {
            // Simulación completada
          }, 300);
        }
      }
      
      await getPrediction();
      addChatMessage('assistant', '✅ Nueva simulación completada');
    } catch (error) {
      console.error('Error simulating:', error);
      addChatMessage('assistant', '⚠️ Error en la simulación');
    } finally {
      setIsLoading(false);
    }
  }, [selectedGame, selectedTable, getPrediction, addChatMessage, isLoading, currentPredictionId, updatePredictionResult, evaluatePokerHand]);

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
      const data = error.data;
      if (data?.response) {
        addChatMessage('assistant', data.response);
      } else {
        addChatMessage('assistant', 'Lo siento, hubo un error al procesar tu mensaje.');
      }
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
          <h2>Análisis: {selectedGame.toUpperCase()}</h2>
          <div className="prediction-controls">
            <button className="simulate-btn" onClick={handleSimulate} disabled={isLoading}>
              🎲 Simular Ronda
            </button>
            <button className="refresh-btn" onClick={getPrediction} disabled={isLoading}>
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

        <PredictionDisplay 
          game={selectedGame}
          prediction={predictionData}
          lastSimulation={lastSimulation}
          simulationHistory={simulationHistory}
        />
      </div>
    </div>
  );
};
export default PredictionPage;