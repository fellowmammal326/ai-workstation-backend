// FIX: Manually define types for import.meta.env to resolve TypeScript errors,
// as the /// <reference types="vite/client" /> directive was failing.
declare global {
  interface ImportMeta {
    readonly env: {
      readonly VITE_API_URL?: string;
    };
  }
}

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
