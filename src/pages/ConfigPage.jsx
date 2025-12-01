import React from 'react';
import { useAppContext } from '../context/useAppContext';
import { useBackend } from '../hooks/useBackend';
import AnimatedBackground from '../components/AnimatedBackground';
import SkeletonLoader from '../components/SkeletonLoader';
import '../styles/ConfigPage.css';

const ConfigPage = () => {
  const { selectedTable, setSelectedTable } = useAppContext();
  const { backendStatus, loading, isOnline, refreshStatus } = useBackend();

  const handleTableChange = (e) => {
    setSelectedTable(e.target.value);
  };

  return (
    <div className="config-page">
      <AnimatedBackground />
      
      <div className="config-content">
        <h1 className="config-title">Configuración</h1>

        <div className="config-section">
          <h2>Estado del Backend</h2>
          {loading ? (
            <SkeletonLoader count={1} variant="details" />
          ) : (
            <div className="status-card">
              <div className={`status-indicator ${isOnline ? 'online' : 'offline'}`}>
                {isOnline ? '✅ Online' : '❌ Offline'}
              </div>
              
              {isOnline && (
                <div className="status-details">
                  <p><strong>Predictor:</strong> {backendStatus.predictor_loaded ? '✓' : '✗'}</p>
                  <p><strong>Simulador:</strong> {backendStatus.simulador_loaded ? '✓' : '✗'}</p>
                  <p><strong>Ollama IA:</strong> {backendStatus.ollama_available ? '✓' : '✗'}</p>
                  
                  {backendStatus.mesas_activas && (
                    <div className="mesas-info">
                      <strong>Mesas Activas:</strong>
                      <ul>
                        <li>Ruleta: {backendStatus.mesas_activas.ruleta || 0}</li>
                        <li>Blackjack: {backendStatus.mesas_activas.blackjack || 0}</li>
                        <li>Poker: {backendStatus.mesas_activas.poker || 0}</li>
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          
          <button className="refresh-status-btn" onClick={refreshStatus}>
            🔄 Verificar Conexión
          </button>
        </div>

        <div className="config-section">
          <h2>Selección de Mesa</h2>
          <div className="table-selector">
            <label htmlFor="table-select">Mesa Actual:</label>
            <select 
              id="table-select"
              value={selectedTable} 
              onChange={handleTableChange}
              className="table-select"
            >
              <option value="table_1">Mesa 1</option>
              <option value="table_2">Mesa 2</option>
              <option value="table_3">Mesa 3</option>
            </select>
          </div>
        </div>

        <div className="config-section">
          <h2>Información del Sistema</h2>
          <div className="info-card">
            <p><strong>Versión:</strong> 1.0.0</p>
            <p><strong>Modo:</strong> Educativo</p>
            <p><strong>Backend URL:</strong> {import.meta.env.VITE_API_URL || 'http://localhost:5000'}</p>
          </div>
        </div>

        <div className="config-warning">
          <p>⚠️ <strong>ADVERTENCIA:</strong> Este sistema es exclusivamente educativo. 
          NO debe utilizarse para apuestas reales.</p>
        </div>
      </div>
    </div>
  );
};

export default ConfigPage;