import axios from 'axios';

const API = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

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
