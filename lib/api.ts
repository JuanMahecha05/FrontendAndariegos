import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:7080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptores opcionales (para agregar tokens o manejar errores globales)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // o desde contexto/Auth
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
