import axios from "axios";

const API = "http://localhost:4000";

export async function fetchTransactions() {
  const res = await axios.get(`${API}/expenses`);
  return res.data;
}

export async function addTransactionAPI(data: any) {
  const res = await axios.post(`${API}/expenses`, data);
  return res.data[0];
}

export async function deleteTransactionAPI(id: string) {
  await axios.delete(`${API}/expenses/${id}`);
}

export async function updateTransactionAPI(id: string, data: any) {
  const res = await axios.put(`${API}/expenses/${id}`, data);
  return res.data[0];
}
