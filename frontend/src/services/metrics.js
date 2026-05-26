import axiosInstance from '../config/axios';

const METRICS_ENDPOINTS = {
  GET_OVERVIEW: '/metrics/overview',
  GET_VOLUME: '/metrics/volume',
  GET_RESPONSE_TIMES: '/metrics/response-times',
  GET_RESOLUTION: '/metrics/resolution',
};

/**
 * Metrics Service
 * Handles all dashboard metrics API calls
 */
export const metricsService = {
  /**
   * Get dashboard overview metrics
   * @returns {Promise} Overview data (total tickets, open, resolved, etc.)
   */
  getOverview: async () => {
    try {
      const response = await axiosInstance.get(METRICS_ENDPOINTS.GET_OVERVIEW);
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch overview metrics');
    }
  },

  /**
   * Get ticket volume metrics
   * @param {string} period - Time period ('day', 'week', 'month', etc.)
   * @returns {Promise} Volume data
   */
  getVolume: async (period = 'day') => {
    try {
      const response = await axiosInstance.get(METRICS_ENDPOINTS.GET_VOLUME, {
        params: { period },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch volume metrics');
    }
  },

  /**
   * Get response time metrics
   * @returns {Promise} Response time data
   */
  getResponseTimes: async () => {
    try {
      const response = await axiosInstance.get(METRICS_ENDPOINTS.GET_RESPONSE_TIMES);
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch response time metrics');
    }
  },

  /**
   * Get resolution metrics
   * @returns {Promise} Resolution data (resolved rate, avg resolution time, etc.)
   */
  getResolution: async () => {
    try {
      const response = await axiosInstance.get(METRICS_ENDPOINTS.GET_RESOLUTION);
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch resolution metrics');
    }
  },
};

export default metricsService;
