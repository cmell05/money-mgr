import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const getExpenses = () => axios.get(`${API_URL}/expenses`);
export const createExpense = (data) => axios.post(`${API_URL}/expenses`, data);
export const updateExpense = (id, data) => axios.put(`${API_URL}/expenses/${id}`, data);
export const deleteExpense = (id) => axios.delete(`${API_URL}/expenses/${id}`);