// src/context/AppContext.jsx
import React, { useState } from 'react';
import { AppContext } from './AppContextCreate';

export const AppProvider = ({ children }) => {
  const [selectedGame, setSelectedGame] = useState(null);
  const [selectedTable, setSelectedTable] = useState('table_1');
  const [predictionData, setPredictionData] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [simulationHistory, setSimulationHistory] = useState([]);

  const addChatMessage = (role, content) => {
    setChatHistory(prev => [...prev, { role, content, timestamp: new Date() }]);
  };

  const clearChat = () => {
    setChatHistory([]);
  };

  const addSimulation = (result) => {
    setSimulationHistory(prev => [...prev, result]);
  };

  return (
    <AppContext.Provider value={{
      selectedGame,
      setSelectedGame,
      selectedTable,
      setSelectedTable,
      predictionData,
      setPredictionData,
      chatHistory,
      setChatHistory,
      addChatMessage,
      clearChat,
      isLoading,
      setIsLoading,
      simulationHistory,
      addSimulation
    }}>
      {children}
    </AppContext.Provider>
  );
};

