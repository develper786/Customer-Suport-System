import axios from 'axios';

const API_BASE_URL = 'http://localhost:9000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: (username, password) =>
    api.post('/auth/login', { username, password }),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
};

export const ticketService = {
  getTickets: (filters = {}) => api.get('/tickets', { params: filters }),
  getTicketById: (id) => api.get(`/tickets/${id}`),
  createTicket: (data) => api.post('/tickets', data),
  updateTicket: (id, data) => api.patch(`/tickets/${id}`, data),
  replyToTicket: (id, reply) => api.post(`/tickets/${id}/reply`, reply),
};

export const metricsService = {
  getOverview: () => api.get('/metrics/overview'),
  getVolume: (period = 'day') => api.get('/metrics/volume', { params: { period } }),
  getResponseTimes: () => api.get('/metrics/response-times'),
  getResolution: () => api.get('/metrics/resolution'),
};

export default api;
