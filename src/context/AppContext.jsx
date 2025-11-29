// src/context/AppContext.jsx
import React, { createContext, useContext, useState } from 'react';

// 1. CREAR el contexto
const AppContext = createContext();

// 2. Hook personalizado para usar el contexto
const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext debe usarse dentro de AppProvider");
  }
  return context;
};

// 3. Provider del contexto
const AppProvider = ({ children }) => {
  // Estados globales
  const [selectedGame, setSelectedGame] = useState(null);
  const [selectedTable, setSelectedTable] = useState('table_1');
  const [predictionData, setPredictionData] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [simulationHistory, setSimulationHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState('home');

  // Métodos para manipular el chat
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

  // Métodos para simulaciones
  const addSimulation = (result) => {
    setSimulationHistory(prev => [...prev, result]);
  };

  const clearSimulations = () => {
    setSimulationHistory([]);
  };

  // Navegación
  const navigateTo = (page) => {
    setCurrentPage(page);
    if (page === 'home') {
      setSelectedGame(null);
    }
  };

  // Valor del contexto
  const value = {
    // Estados
    selectedGame,
    selectedTable,
    predictionData,
    chatHistory,
    isLoading,
    simulationHistory,
    currentPage,
    
    // Setters directos
    setSelectedGame,
    setSelectedTable,
    setPredictionData,
    setIsLoading,
    
    // Métodos
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

// ✅ EXPORTAR SOLO EL PROVIDER COMO DEFAULT (Fast Refresh compatible)
export default AppProvider;

// Exportar el hook por separado
export { useAppContext };