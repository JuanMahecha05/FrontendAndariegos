import axios from "axios";
import https from "https";

// ⚠️ Solo ignorar en desarrollo
const agent = new https.Agent({
  rejectUnauthorized: false
});

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
  // Agrega el agente solo en desarrollo
  httpsAgent: process.env.NODE_ENV !== "production" ? agent : undefined,
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
