import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api' });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('focus90_token') || sessionStorage.getItem('focus90_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
api.interceptors.response.use((r) => r, (error) => {
  if (error.response?.status === 401) {
    localStorage.removeItem('focus90_token');
    sessionStorage.removeItem('focus90_token');
  }
  return Promise.reject(error);
});
export default api;
