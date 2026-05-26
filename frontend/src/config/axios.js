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

// Fetch CSRF token on app initialization
let csrfTokenPromise = null;

const fetchCsrfToken = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/csrf-token`, {
      withCredentials: true,
    });
    const token = response.data.token;
    sessionStorage.setItem('X-CSRF-TOKEN', token);
    return token;
  } catch (error) {
    console.error('Failed to fetch CSRF token:', error);
    return null;
  }
};

// Initialize CSRF token fetch
csrfTokenPromise = fetchCsrfToken();

// Request interceptor - add credentials and CSRF token
axiosInstance.interceptors.request.use(
  async (config) => {
    config.withCredentials = true;

    // For mutating requests (POST, PUT, DELETE, PATCH), include CSRF token
    if (['post', 'put', 'delete', 'patch'].includes(config.method)) {
      let csrfToken = sessionStorage.getItem('X-CSRF-TOKEN');

      // If no token, fetch it
      if (!csrfToken) {
        try {
          await csrfTokenPromise;
          csrfToken = sessionStorage.getItem('X-CSRF-TOKEN');
        } catch (error) {
          console.error('Error getting CSRF token:', error);
        }
      }

      if (csrfToken) {
        config.headers['X-CSRF-TOKEN'] = csrfToken;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle global errors and CSRF tokens
axiosInstance.interceptors.response.use(
  (response) => {
    // Extract CSRF token from response headers if present (backend may rotate tokens)
    const csrfToken = response.headers['x-csrf-token'];
    if (csrfToken) {
      sessionStorage.setItem('X-CSRF-TOKEN', csrfToken);
    }
    return response;
  },
  (error) => {
    // Handle different error status codes globally
    if (error.response) {
      const { status, data } = error.response;

      // Unauthorized - redirect to login
      if (status === 401) {
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('X-CSRF-TOKEN');
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
