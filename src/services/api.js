const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000';

class ApiService {
  async request(endpoint, options = {}) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
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
}

export default new ApiService();
