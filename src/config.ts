/**
 * Application Configuration
 * 
 * API Base URL configuration for the frontend application.
 * This can be overridden by setting VITE_API_URL in environment variables.
 */

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.skykeenentreprise.com';

// Export for use in other parts of the application
export default {
  API_BASE_URL,
};

