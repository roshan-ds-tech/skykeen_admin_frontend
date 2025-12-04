/**
 * Application Configuration
 * 
 * API Base URL configuration for the frontend application.
 * This can be overridden by setting VITE_API_URL in environment variables.
 * 
 * Frontend Admin Panel: admin.skykeenentreprise.com
 * Backend API: api.skykeenentreprise.com
 */

// IMPORTANT: Correct spelling is "entreprise" (French) NOT "enterprise" (English)
// ✅ Correct: skykeenentreprise.com
// ❌ Wrong: skykeenenterprise.com (English spelling)
// 
// Frontend runs at: admin.skykeenentreprise.com
// Backend API runs at: api.skykeenentreprise.com
const DEFAULT_API_URL = 'https://api.skykeenentreprise.com';
const envApiUrl = import.meta.env.VITE_API_URL;

// Validate the API URL to catch typos
const validateApiUrl = (url: string): string => {
  if (!url) {
    return DEFAULT_API_URL;
  }
  
  // Normalize the URL for comparison
  const normalizedUrl = url.toLowerCase().trim();
  
  // Check for common misspellings - must be exact match check
  // Check for "enterprise" (English) - wrong spelling
  if (normalizedUrl.includes('skykeenenterprise') && !normalizedUrl.includes('skykeenentreprise')) {
    console.error('❌ ERROR: API URL has incorrect spelling!');
    console.error('   Found:', url);
    console.error('   Should be: https://api.skykeenentreprise.com');
    console.error('   Note: "entreprise" (French) NOT "enterprise" (English)');
    return DEFAULT_API_URL;
  }
  
  // Check for "entrepris" (missing final 'e') - wrong spelling
  if (normalizedUrl.includes('skykeenentrepris') && !normalizedUrl.includes('skykeenentreprise')) {
    console.error('❌ ERROR: API URL has incorrect spelling!');
    console.error('   Found:', url);
    console.error('   Should be: https://api.skykeenentreprise.com');
    console.error('   Note: "entreprise" (with final "e") NOT "entrepris" (missing "e")');
    return DEFAULT_API_URL;
  }
  
  // Check for "entrepis" (missing 'r' and 'e') - wrong spelling
  if (normalizedUrl.includes('skykeenentrepis') && !normalizedUrl.includes('skykeenentreprise')) {
    console.error('❌ ERROR: API URL has incorrect spelling!');
    console.error('   Found:', url);
    console.error('   Should be: https://api.skykeenentreprise.com');
    console.error('   Note: "entreprise" NOT "entrepis"');
    return DEFAULT_API_URL;
  }
  
  // Final check: if URL doesn't contain the correct spelling, force it
  if (!normalizedUrl.includes('skykeenentreprise')) {
    console.warn('⚠️ WARNING: API URL does not contain correct domain. Using default.');
    console.warn('   Provided:', url);
    console.warn('   Using:', DEFAULT_API_URL);
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

