import axios from 'axios';

const API_BASE_URL = 'http://localhost:9000/api';

// Create axios instance with centralized config
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add credentials to all requests
axiosInstance.interceptors.request.use(
  (config) => {
    config.withCredentials = true;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle global errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle different error status codes globally
    if (error.response) {
      const { status, data } = error.response;

      // Unauthorized - redirect to login
      if (status === 401) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.href = '/login';
        return Promise.reject(new Error('Session expired. Please login again.'));
      }

      // Forbidden - user doesn't have permission
      if (status === 403) {
        return Promise.reject(new Error(data.message || 'Access denied.'));
      }

      // Bad request - validation error
      if (status === 400) {
        return Promise.reject(new Error(data.message || 'Invalid request.'));
      }

      // Server error
      if (status >= 500) {
        return Promise.reject(new Error(data.message || 'Server error. Please try again later.'));
      }

      // Generic error with message from server
      return Promise.reject(new Error(data.message || error.message));
    }

    // Network error
    if (error.request && !error.response) {
      return Promise.reject(new Error('Network error. Please check your connection.'));
    }

    // Other errors
    return Promise.reject(error);
  }
);

export default axiosInstance;
