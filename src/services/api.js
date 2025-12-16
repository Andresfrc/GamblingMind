const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000';
const MAX_RETRIES = 2;
const RETRY_DELAY = 1000;

class ApiService {
  async request(endpoint, options = {}, retries = 0) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options,
        timeout: 10000
      });

      let data = null;
      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (!response.ok) {
        const error = new Error(
          data?.mensaje || data?.error || `HTTP error! status: ${response.status}`
        );
        error.status = response.status;
        error.data = data;
        throw error;
      }

      return data;
    } catch (error) {
      // Reintentar solo en errores de conexión (no HTTP errors)
      if (retries < MAX_RETRIES && !error.status) {
        console.warn(`🔄 Reintentando ${endpoint} (${retries + 1}/${MAX_RETRIES})...`);
        await new Promise(r => setTimeout(r, RETRY_DELAY));
        return this.request(endpoint, options, retries + 1);
      }
      
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  async checkHealth() {
    return this.request('/health');
  }

  async getGames() {
    return this.request('/games');
  }

  async getTables(game) {
    return this.request(`/tables/${game}`);
  }

  async simulate(game, table = 'table_1') {
    return this.request('/simulate', {
      method: 'POST',
      body: JSON.stringify({ game, table })
    });
  }

  async predict(game, table = 'table_1') {
    return this.request('/predict', {
      method: 'POST',
      body: JSON.stringify({ game, table })
    });
  }

  async chat(message) {
    return this.request('/chat', {
      method: 'POST',
      body: JSON.stringify({ message })
    });
  }

  async getStats() {
    return this.request('/stats');
  }

  async resetTable(game, table) {
    return this.request(`/reset/${game}/${table}`, {
      method: 'POST'
    });
  }

  // Agente autónomo endpoints
  async startAgent(duracion = 300) {
    return this.request('/agente/iniciar', {
      method: 'POST',
      body: JSON.stringify({ duracion })
    });
  }

  async getAgentStatus() {
    return this.request('/agente/estado');
  }

  async stopAgent() {
    return this.request('/agente/detener', {
      method: 'POST'
    });
  }
}

export default new ApiService();
