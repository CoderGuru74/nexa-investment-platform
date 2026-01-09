import axios from 'axios';

// Dynamically determine the API URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  // IMPORTANT: withCredentials is only needed if you use HttpOnly Cookies for Auth.
  // Since you are using LocalStorage + Bearer Token, this is technically optional, 
  // but keeping it 'true' requires your backend CORS to be very specific.
  withCredentials: true, 
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 1. Handle Network Errors (Server down / CORS issues)
    if (!error.response) {
      console.error('Network Error: Please check if the backend is running and CORS is configured.');
    }

    // 2. Handle 401 Unauthorized (Expired or missing token)
    if (error.response?.status === 401) {
      const isLoginPage = window.location.pathname.includes('/login');
      const isRegisterPage = window.location.pathname.includes('/register');

      // Clear local storage
      localStorage.removeItem('token');

      // Only redirect if the user is not already on an auth page
      if (!isLoginPage && !isRegisterPage) {
        window.location.href = '/login?expired=true';
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;