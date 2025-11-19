import axios from "axios";

const base = process.env.VITE_API_URL; // uses Vite env var
const api = axios.create({
  baseURL: base,
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
