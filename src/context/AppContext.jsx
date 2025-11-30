import React, { useState } from 'react';
import { AppContext } from './appContextDef';

const AppProvider = ({ children }) => {
  const [selectedGame, setSelectedGame] = useState(null);
  const [selectedTable, setSelectedTable] = useState('table_1');
  const [predictionData, setPredictionData] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [simulationHistory, setSimulationHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState('home');

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

  const navigateTo = (page) => {
    setCurrentPage(page);
    if (page === 'home') {
      setSelectedGame(null);
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
    setSelectedGame,
    setSelectedTable,
    setPredictionData,
    setIsLoading,
    addChatMessage,
    clearChat,
    addSimulation,
    clearSimulations,
    navigateTo
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
