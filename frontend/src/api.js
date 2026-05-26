const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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

  async getLogs(habitId = null) {
    const url = habitId
      ? `${API_URL}/api/logs?habit_id=${habitId}`
      : `${API_URL}/api/logs`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch logs');
    return res.json();
  },

  async createLog(habitId, completedDate, note = '') {
    const res = await fetch(`${API_URL}/api/logs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        habit_id: habitId,
        completed_date: completedDate,
        note,
      }),
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
