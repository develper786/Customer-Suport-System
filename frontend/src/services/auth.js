import axiosInstance from '../config/axios';

const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  GET_CURRENT_USER: '/me',
  GET_CURRENT_USER_ALT: '/auth/me',
};

/**
 * Authentication Service
 * Handles all auth-related API calls
 */
export const authService = {
  /**
   * Login user with username and password
   * @param {string} username - User username
   * @param {string} password - User password
   * @returns {Promise} Login response with user data
   */
  login: async (username, password) => {
    try {
      const response = await axiosInstance.post(AUTH_ENDPOINTS.LOGIN, {
        username,
        password,
      });

      if (response.data.success) {
        // Store only non-sensitive user data in sessionStorage (not localStorage)
        // Session cookie (JSESSIONID) handles actual authentication
        const userData = {
          username: response.data.username,
          roles: response.data.roles,
          loginTime: new Date().toISOString(),
        };
        sessionStorage.setItem('user', JSON.stringify(userData));
        return response.data;
      }

      throw new Error(response.data.message || 'Login failed');
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message || 'Login failed');
    }
  },

  /**
   * Logout current user
   * @returns {Promise} Logout response
   */
  logout: async () => {
    try {
      const response = await axiosInstance.post(AUTH_ENDPOINTS.LOGOUT);
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('X-CSRF-TOKEN');
      return response.data;
    } catch (error) {
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('X-CSRF-TOKEN');
      throw new Error(error.message || 'Logout failed');
    }
  },

  /**
   * Get current authenticated user
   * @returns {Promise} Current user data
   */
  getCurrentUser: async () => {
    try {
      const response = await axiosInstance.get(AUTH_ENDPOINTS.GET_CURRENT_USER);
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch current user');
    }
  },

  /**
   * Get current authenticated user (alternative endpoint)
   * @returns {Promise} Current user data
   */
  getCurrentUserAlt: async () => {
    try {
      const response = await axiosInstance.get(AUTH_ENDPOINTS.GET_CURRENT_USER_ALT);
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch current user');
    }
  },

  /**
   * Check if user is logged in
   * @returns {boolean} True if user exists in sessionStorage
   */
  isLoggedIn: () => {
    const user = sessionStorage.getItem('user');
    return !!user;
  },

  /**
   * Get user from sessionStorage
   * @returns {object|null} User object or null
   */
  getStoredUser: () => {
    const user = sessionStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

export default authService;
