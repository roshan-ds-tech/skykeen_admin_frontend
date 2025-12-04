/**
 * Application Configuration
 * 
 * API Base URL configuration for the frontend application.
 * This can be overridden by setting VITE_API_URL in environment variables.
 */

// IMPORTANT: Correct spelling is "entreprise" (not "entrepis" or "entrepris")
const DEFAULT_API_URL = 'https://api.skykeenentreprise.com';
const envApiUrl = import.meta.env.VITE_API_URL;

// Validate the API URL to catch typos
const validateApiUrl = (url: string): string => {
  if (url.includes('skykeenentrepis') || url.includes('skykeenentrepris')) {
    console.error('❌ ERROR: API URL has incorrect spelling!');
    console.error('   Found:', url);
    console.error('   Should be: https://api.skykeenentreprise.com');
    console.error('   Note: "entreprise" not "entrepis" or "entrepris"');
    // Return the correct URL instead of the wrong one
    return DEFAULT_API_URL;
  }
  return url;
};

export const API_BASE_URL = validateApiUrl(envApiUrl || DEFAULT_API_URL);

// Log the API URL to help debug
console.log('✅ API Base URL configured:', API_BASE_URL);

// Export for use in other parts of the application
export default {
  API_BASE_URL,
};

