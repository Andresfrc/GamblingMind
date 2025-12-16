import React, { useState, useEffect } from 'react';
import api from '../services/api';
import '../styles/AgentStatus.css';

const AgentStatus = () => {
  const [agentActive, setAgentActive] = useState(false);
  const [agentStats, setAgentStats] = useState({ experimentos: 0, hallazgos: 0, precision: 0 });
  const [loading, setLoading] = useState(false);
  const [pollInterval, setPollInterval] = useState(null);

  // Obtener estado del agente
  const fetchAgentStatus = async () => {
    try {
      const status = await api.getAgentStatus();
      setAgentActive(status.activo);
      if (status.activo) {
        setAgentStats({
          experimentos: status.experimentos || 0,
          hallazgos: status.hallazgos || 0,
          precision: status.precision || 0
        });
      }
    } catch (error) {
      console.error('Error fetching agent status:', error);
    }
  };

  // Iniciar agente
  const handleStartAgent = async () => {
    setLoading(true);
    try {
      const duracion = prompt('Duración del agente en segundos (default 300):', '300');
      if (!duracion) return;

      await api.startAgent(parseInt(duracion));
      setAgentActive(true);

      // Polling cada 2 segundos para actualizar estadísticas
      const interval = setInterval(fetchAgentStatus, 2000);
      setPollInterval(interval);

      // Auto-detener después de la duración especificada
      setTimeout(() => {
        setAgentActive(false);
        clearInterval(interval);
        setPollInterval(null);
      }, parseInt(duracion) * 1000);
    } catch (error) {
      alert(`❌ Error al iniciar agente: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Detener agente
  const handleStopAgent = async () => {
    try {
      await api.stopAgent();
      setAgentActive(false);
      if (pollInterval) {
        clearInterval(pollInterval);
        setPollInterval(null);
      }
    } catch (error) {
      alert(`❌ Error al detener agente: ${error.message}`);
    }
  };

  useEffect(() => {
    // Limpiar interval al desmontar
    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [pollInterval]);

  return (
    <div className="agent-status-container">
      <h2>🤖 Agente Autónomo</h2>

      <div className={`agent-status-badge ${agentActive ? 'active' : 'inactive'}`}>
        <span className="status-dot"></span>
        {agentActive ? 'Activo' : 'Inactivo'}
      </div>

      {agentActive && (
        <div className="agent-stats">
          <div className="stat-item">
            <span className="stat-label">Experimentos:</span>
            <span className="stat-value">{agentStats.experimentos}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Hallazgos:</span>
            <span className="stat-value">{agentStats.hallazgos}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Precisión:</span>
            <span className="stat-value">{(agentStats.precision * 100).toFixed(1)}%</span>
          </div>
        </div>
      )}

      <div className="agent-controls">
        {!agentActive ? (
          <button
            className="agent-btn start"
            onClick={handleStartAgent}
            disabled={loading}
          >
            🚀 Iniciar Agente
          </button>
        ) : (
          <button
            className="agent-btn stop"
            onClick={handleStopAgent}
          >
            ⏹️ Detener Agente
          </button>
        )}
      </div>

      <p className="agent-info">
        💡 El agente ejecutará experimentos automáticos y reportará hallazgos interesantes.
      </p>
    </div>
  );
};

export default AgentStatus;
