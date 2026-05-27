import axiosInstance from '../config/axios';

const METRICS_ENDPOINTS = {
  GET_OVERVIEW: '/metrics/overview',
  GET_VOLUME_TREND: '/metrics/volume-trend',
  GET_AI_RATIO: '/metrics/ai-ratio',
  GET_RESPONSE_TIME: '/metrics/response-time',
  GET_RECENT_TICKETS: '/metrics/recent-tickets',
  GET_VOLUME: '/metrics/volume',
  GET_RESPONSE_TIMES: '/metrics/response-times',
  GET_RESOLUTION: '/metrics/resolution',
};

export const metricsService = {
  getOverview: async () => {
    try {
      const response = await axiosInstance.get(METRICS_ENDPOINTS.GET_OVERVIEW);
      return response.data.data;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch overview metrics');
    }
  },

  getVolumeTrend: async (period = 'daily') => {
    try {
      const response = await axiosInstance.get(METRICS_ENDPOINTS.GET_VOLUME_TREND, {
        params: { period },
      });
      return response.data.data;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch volume trend metrics');
    }
  },

  getAIRatio: async () => {
    try {
      const response = await axiosInstance.get(METRICS_ENDPOINTS.GET_AI_RATIO);
      return response.data.data;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch AI ratio metrics');
    }
  },

  getResponseTime: async () => {
    try {
      const response = await axiosInstance.get(METRICS_ENDPOINTS.GET_RESPONSE_TIME);
      return response.data.data;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch response time metrics');
    }
  },

  getRecentTickets: async () => {
    try {
      const response = await axiosInstance.get(METRICS_ENDPOINTS.GET_RECENT_TICKETS);
      return response.data.data;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch recent tickets');
    }
  },

  // Legacy endpoints (kept for backward compatibility)
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

  getResponseTimes: async () => {
    try {
      const response = await axiosInstance.get(METRICS_ENDPOINTS.GET_RESPONSE_TIMES);
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch response time metrics');
    }
  },

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
