
import { useState, useEffect, useCallback } from 'react';
import api from '../services/api.js';

export const useBackend = () => {
  const [backendStatus, setBackendStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkHealth = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    checkHealth();
  }, [checkHealth]);

  return {
    backendStatus,
    loading,
    error,
    refreshStatus: checkHealth,
    isOnline: backendStatus?.status === 'ok'
  };
};

export default useBackend;