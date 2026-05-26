import axiosInstance from '../config/axios';

const API_VERSION = '/v1';
const TICKETS_BASE = `${API_VERSION}/tickets`;
const MESSAGES_BASE = `${API_VERSION}/messages`;

const TICKET_ENDPOINTS = {
  GET_ALL: TICKETS_BASE,
  GET_BY_ID: (id) => `${TICKETS_BASE}/${id}`,
  CREATE: TICKETS_BASE,
  UPDATE: (id) => `${TICKETS_BASE}/${id}`,
  DELETE: (id) => `${TICKETS_BASE}/${id}`,
  GET_BY_STATUS: (status) => `${TICKETS_BASE}/by-status/${status}`,
};

const MESSAGE_ENDPOINTS = {
  GET_BY_TICKET: (ticketId) => `${MESSAGES_BASE}/ticket/${ticketId}`,
  ADD_MESSAGE: (ticketId) => `${MESSAGES_BASE}/ticket/${ticketId}`,
  DELETE_MESSAGE: (messageId) => `${MESSAGES_BASE}/${messageId}`,
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
      return response.data.data || response.data;
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
      return response.data.data || response.data;
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
      return response.data.data || response.data;
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
      return response.data.data || response.data;
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
   * Get messages/thread for a ticket
   * @param {number|string} ticketId - Ticket ID
   * @returns {Promise} Array of messages
   */
  getMessages: async (ticketId) => {
    try {
      const response = await axiosInstance.get(MESSAGE_ENDPOINTS.GET_BY_TICKET(ticketId));
      return response.data.data || response.data;
    } catch (error) {
      throw new Error(error.message || `Failed to fetch messages for ticket ${ticketId}`);
    }
  },

  /**
   * Add a message/reply to a ticket
   * @param {number|string} ticketId - Ticket ID
   * @param {object} message - Message data (body, senderType, senderName)
   * @returns {Promise} Message response
   */
  addMessage: async (ticketId, message) => {
    try {
      const response = await axiosInstance.post(MESSAGE_ENDPOINTS.ADD_MESSAGE(ticketId), message);
      return response.data.data || response.data;
    } catch (error) {
      throw new Error(error.message || `Failed to add message to ticket ${ticketId}`);
    }
  },

  /**
   * Delete a message
   * @param {number|string} messageId - Message ID
   * @returns {Promise} Delete response
   */
  deleteMessage: async (messageId) => {
    try {
      const response = await axiosInstance.delete(MESSAGE_ENDPOINTS.DELETE_MESSAGE(messageId));
      return response.data;
    } catch (error) {
      throw new Error(error.message || `Failed to delete message ${messageId}`);
    }
  },

  /**
   * Get tickets filtered by status
   * @param {string} status - Status filter value
   * @returns {Promise} Array of tickets
   */
  getTicketsByStatus: async (status) => {
    try {
      const response = await axiosInstance.get(TICKET_ENDPOINTS.GET_BY_STATUS(status));
      return response.data.data || response.data;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch tickets by status');
    }
  },
};

export default ticketService;
