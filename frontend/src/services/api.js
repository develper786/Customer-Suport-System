/**
 * API Services Barrel Export
 * Re-exports all service modules for backward compatibility
 *
 * Instead of importing from this file, consider importing directly from:
 * - import authService from './services/auth'
 * - import ticketService from './services/tickets'
 * - import metricsService from './services/metrics'
 * - import axiosInstance from './config/axios'
 */

import axiosInstance from '../config/axios';
import authService from './auth';
import ticketService from './tickets';
import metricsService from './metrics';

// Re-export all services for backward compatibility
export { authService, ticketService, metricsService };

// Export axios instance for direct usage if needed
export { axiosInstance };

// Default export for backward compatibility
export default axiosInstance;
