
import { useState, useEffect } from 'react';
import api from '../services/api';

export const useBackend = () => {
  const [backendStatus, setBackendStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkHealth = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.checkHealth();
      setBackendStatus(response);
    } catch (err) {
      setError(err.message);
      setBackendStatus({ 
        status: 'error', 
        error: err.message 
      });
    } finally {
      setLoading(false);
    }
  };

  // Verificar al montar
  useEffect(() => {
    checkHealth();
  }, []);

  return {
    backendStatus,
    loading,
    error,
    refreshStatus: checkHealth,
    isOnline: backendStatus?.status === 'ok'
  };
};

export default useBackend;