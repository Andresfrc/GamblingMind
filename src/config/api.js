/**
 * Configuración de endpoints de API
 * Centraliza todas las rutas de la API
 */

import { API_CONFIG } from './constants';

export const API_ENDPOINTS = {
  // Juegos
  GAMES: '/games',
  
  // Predicciones
  PREDICT: '/predict',
  PREDICTION_HISTORY: '/predictions',
  
  // Simulaciones
  SIMULATE: '/simulate',
  SIMULATION_STATUS: '/simulation/status',
  
  // Chat
  CHAT: '/chat',
  
  // Estadísticas
  STATS: '/stats',
  STATS_BY_GAME: '/stats/game/:game',
  
  // Sistema
  HEALTH: '/health',
  STATUS: '/status',
};

/**
 * Constructor de URLs completas de la API
 */
export const getApiUrl = (endpoint, params = {}) => {
  let url = `${API_CONFIG.BASE_URL}${endpoint}`;
  
  // Reemplazar parámetros dinámicos
  Object.entries(params).forEach(([key, value]) => {
    url = url.replace(`:${key}`, value);
  });
  
  return url;
};

/**
 * Configuración de timeouts por endpoint
 */
export const ENDPOINT_TIMEOUTS = {
  [API_ENDPOINTS.HEALTH]: 5000,
  [API_ENDPOINTS.PREDICT]: 15000,
  [API_ENDPOINTS.SIMULATE]: 20000,
  [API_ENDPOINTS.CHAT]: 30000,
  [API_ENDPOINTS.STATS]: 10000,
};

/**
 * Retry policy para diferentes tipos de errores
 */
export const RETRY_CONFIG = {
  // Reintentar estos códigos de error
  RETRYABLE_STATUS: [408, 429, 500, 502, 503, 504],
  
  // No reintentar estos códigos
  NON_RETRYABLE_STATUS: [400, 401, 403, 404],
  
  // Máximo de intentos
  MAX_ATTEMPTS: 3,
  
  // Delay entre intentos (ms)
  INITIAL_DELAY: 1000,
  MAX_DELAY: 5000,
};
