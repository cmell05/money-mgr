import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// Get or create session ID
let sessionId = localStorage.getItem('sessionId');

if (!sessionId) {
  // Generate new session ID on first visit
  sessionId = crypto.randomUUID();
  localStorage.setItem('sessionId', sessionId);
}

// Add session ID to all requests
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'x-session-id': sessionId
  }
});

export const getExpenses = () => api.get('/expenses');
export const createExpense = (data) => api.post('/expenses', data);
export const updateExpense = (id, data) => api.put(`/expenses/${id}`, data);
export const deleteExpense = (id) => api.delete(`/expenses/${id}`);