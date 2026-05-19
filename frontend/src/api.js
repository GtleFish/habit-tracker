const API_URL = import.meta.env.VITE_API_URL;

export const api = {
  async getHabits() {
    const res = await fetch(`${API_URL}/api/habits`);
    if (!res.ok) throw new Error('Failed to fetch habits');
    return res.json();
  },

  async createHabit(name, description = '') {
    const res = await fetch(`${API_URL}/api/habits`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description }),
    });
    if (!res.ok) throw new Error('Failed to create habit');
    return res.json();
  },

  async deleteHabit(id) {
    const res = await fetch(`${API_URL}/api/habits/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete habit');
    return res.json();
  },

  async getLogs() {
    const res = await fetch(`${API_URL}/api/logs`);
    if (!res.ok) throw new Error('Failed to fetch logs');
    return res.json();
  },

  async createLog(habitId, date) {
    const res = await fetch(`${API_URL}/api/logs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ habitId, date }),
    });
    if (!res.ok) throw new Error('Failed to create log');
    return res.json();
  },

  async checkHealth() {
    const res = await fetch(`${API_URL}/api/health`);
    if (!res.ok) throw new Error('Health check failed');
    return res.json();
  },
};
