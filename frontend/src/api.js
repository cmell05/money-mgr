import axios from "axios";

const API_BASE = "http://localhost:4000";

export const getExpenses = () => {
  console.log("🔵 Fetching expenses from:", `${API_BASE}/expenses`);
  return axios.get(`${API_BASE}/expenses`);
};

export const createExpense = (expense) => {
  console.log("🔵 Creating expense at:", `${API_BASE}/expenses`);
  console.log("🔵 Data being sent:", expense);
  return axios.post(`${API_BASE}/expenses`, expense);
};

export const updateExpense = (id, expense) => {
  console.log("🔵 Updating expense at:", `${API_BASE}/expenses/${id}`);
  return axios.put(`${API_BASE}/expenses/${id}`, expense);
};

export const deleteExpense = (id) => {
  console.log("🔵 Deleting expense at:", `${API_BASE}/expenses/${id}`);
  return axios.delete(`${API_BASE}/expenses/${id}`);
};