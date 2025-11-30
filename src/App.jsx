import React, { useState } from "react";
import { useAppContext } from "./context/useAppContext";
import Sidebar from "./components/Sidebar";
import MobileMenuToggle from "./components/MobileMenuToggle";
import HomePage from "./pages/HomePage";
import ConfigPage from "./pages/ConfigPage";
import PredictionPage from "./pages/PredictionPage";
import "./styles/index.css";
import "./styles/responsive.css";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Usar el contexto para todo
  const { currentPage, navigateTo, setSelectedGame, clearChat } = useAppContext();

  // Handler para cuando se selecciona un juego
  const handleGameSelect = (game) => {
    setSelectedGame(game.id);
    clearChat(); // Limpiar chat al cambiar de juego
    navigateTo("predicts");
  };

  // Renderizar la página según el estado del contexto
  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage onGameSelect={handleGameSelect} />;

      case "config":
        return <ConfigPage />;

      case "predicts":
        return <PredictionPage />;

      default:
        return <HomePage onGameSelect={handleGameSelect} />;
    }
  };

  return (
    <div className="app">
      <MobileMenuToggle isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-content">{renderPage()}</div>
    </div>
  );
}

export default App;
