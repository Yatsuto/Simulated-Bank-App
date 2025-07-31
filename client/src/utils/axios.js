import axios from 'axios';

const API = 'https://simulated-bank-app.onrender.com';

const axiosInstance = axios.create({
  baseURL: API,
});

// Automatically attach token to every request
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config;
});

export default axiosInstance;
