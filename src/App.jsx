import React from "react";
import { useAppContext } from "./context/useAppContext";
import Sidebar from "./components/Sidebar";
import HomePage from "./pages/HomePage";
import ConfigPage from "./pages/ConfigPage";
import PredictionPage from "./pages/PredictionPage";
import "./styles/index.css";

function App() {
  // Usar el contexto para todo
  const { currentPage, navigateTo, setSelectedGame } = useAppContext();

  // Handler para cuando se selecciona un juego
  const handleGameSelect = (game) => {
    setSelectedGame(game.id);
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
      <Sidebar />
      <div className="main-content">{renderPage()}</div>
    </div>
  );
}

export default App;
