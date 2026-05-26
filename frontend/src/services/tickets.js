import axiosInstance from '../config/axios';

const TICKET_ENDPOINTS = {
  GET_ALL: '/tickets',
  GET_BY_ID: (id) => `/tickets/${id}`,
  CREATE: '/tickets',
  UPDATE: (id) => `/tickets/${id}`,
  DELETE: (id) => `/tickets/${id}`,
  REPLY: (id) => `/tickets/${id}/reply`,
};

/**
 * Tickets Service
 * Handles all ticket-related API calls
 */
export const ticketService = {
  /**
   * Get all tickets with optional filtering
   * @param {object} filters - Filter parameters (status, priority, assigned_to, etc.)
   * @returns {Promise} Array of tickets
   */
  getTickets: async (filters = {}) => {
    try {
      const response = await axiosInstance.get(TICKET_ENDPOINTS.GET_ALL, {
        params: filters,
      });
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch tickets');
    }
  },

  /**
   * Get ticket by ID
   * @param {number|string} id - Ticket ID
   * @returns {Promise} Ticket data
   */
  getTicketById: async (id) => {
    try {
      const response = await axiosInstance.get(TICKET_ENDPOINTS.GET_BY_ID(id));
      return response.data;
    } catch (error) {
      throw new Error(error.message || `Failed to fetch ticket ${id}`);
    }
  },

  /**
   * Create new ticket
   * @param {object} data - Ticket data (title, description, priority, etc.)
   * @returns {Promise} Created ticket
   */
  createTicket: async (data) => {
    try {
      const response = await axiosInstance.post(TICKET_ENDPOINTS.CREATE, data);
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Failed to create ticket');
    }
  },

  /**
   * Update ticket
   * @param {number|string} id - Ticket ID
   * @param {object} data - Updated ticket data
   * @returns {Promise} Updated ticket
   */
  updateTicket: async (id, data) => {
    try {
      const response = await axiosInstance.patch(TICKET_ENDPOINTS.UPDATE(id), data);
      return response.data;
    } catch (error) {
      throw new Error(error.message || `Failed to update ticket ${id}`);
    }
  },

  /**
   * Delete ticket
   * @param {number|string} id - Ticket ID
   * @returns {Promise} Delete response
   */
  deleteTicket: async (id) => {
    try {
      const response = await axiosInstance.delete(TICKET_ENDPOINTS.DELETE(id));
      return response.data;
    } catch (error) {
      throw new Error(error.message || `Failed to delete ticket ${id}`);
    }
  },

  /**
   * Reply to ticket (add comment/response)
   * @param {number|string} id - Ticket ID
   * @param {object} reply - Reply data (message, etc.)
   * @returns {Promise} Reply response
   */
  replyToTicket: async (id, reply) => {
    try {
      const response = await axiosInstance.post(TICKET_ENDPOINTS.REPLY(id), reply);
      return response.data;
    } catch (error) {
      throw new Error(error.message || `Failed to reply to ticket ${id}`);
    }
  },
};

export default ticketService;
