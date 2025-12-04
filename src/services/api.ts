import axios from 'axios';
import { API_BASE_URL } from '../config';

// Configure axios to use credentials for session-based authentication
axios.defaults.withCredentials = true;

// Ensure we're using the correct API base URL
// ✅ Correct: api.skykeenentreprise.com (French spelling "entreprise")
// ❌ Wrong: api.skykeenenterprise.com (English spelling "enterprise")
// ❌ Wrong: api.skykeenentrepis.com or api.skykeenentrepris.com

// Double-check the base URL at runtime
if (API_BASE_URL && !API_BASE_URL.includes('skykeenentreprise')) {
  console.error('❌ CRITICAL: API_BASE_URL does not contain correct domain!');
  console.error('   Current:', API_BASE_URL);
  console.error('   Expected: https://api.skykeenentreprise.com');
}

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Log the base URL to help debug
console.log('🔗 Axios baseURL configured:', api.defaults.baseURL);

// Function to get CSRF token from cookies
function getCsrfToken(): string | null {
  const name = 'csrftoken';
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [key, value] = cookie.trim().split('=');
    if (key === name) {
      return decodeURIComponent(value);
    }
  }
  return null;
}

// Function to fetch CSRF token from the backend
export const fetchCsrfToken = async (): Promise<void> => {
  try {
    await axios.get(`${API_BASE_URL}/api/csrf-token/`, {
      withCredentials: true,
    });
  } catch (error) {
    console.warn('Failed to fetch CSRF token:', error);
    // Don't throw - app can still work if CSRF token is set via other means
  }
};

// Request interceptor to add CSRF token
api.interceptors.request.use(
  (config) => {
    const csrfToken = getCsrfToken();
    if (csrfToken && (config.method === 'post' || config.method === 'patch' || config.method === 'put' || config.method === 'delete')) {
      config.headers['X-CSRFToken'] = csrfToken;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle CSRF token from Set-Cookie header and 403 errors
api.interceptors.response.use(
  (response) => {
    // CSRF token is automatically set in cookies by Django
    return response;
  },
  async (error) => {
    // If we get a 403 error, it might be due to an expired or missing CSRF token
    // Try to refresh the CSRF token and retry the request (except for logout)
    if (error?.response?.status === 403 && error?.config && !error.config.url?.includes('/logout')) {
      const originalRequest = error.config;
      
      // Check if we've already retried this request
      if (!originalRequest._retry) {
        originalRequest._retry = true;
        
        try {
          // Fetch a new CSRF token
          await fetchCsrfToken();
          
          // Update the CSRF token in the original request
          const csrfToken = getCsrfToken();
          if (csrfToken) {
            originalRequest.headers['X-CSRFToken'] = csrfToken;
          }
          
          // Retry the original request
          return api(originalRequest);
        } catch (refreshError) {
          // If refreshing fails, reject with the original error
          return Promise.reject(error);
        }
      }
    }
    
    return Promise.reject(error);
  }
);

// API functions
export const login = async (email: string, password: string) => {
  const response = await api.post('/api/admin/login/', { email, password });
  return response.data;
};

export const logout = async () => {
  try {
    // Ensure we have a fresh CSRF token before logout
    const csrfToken = getCsrfToken();
    if (!csrfToken) {
      console.warn('No CSRF token found, attempting to fetch one before logout');
      await fetchCsrfToken();
    }
    
    const response = await api.post('/api/admin/logout/');
    return response.data;
  } catch (error: any) {
    // If logout fails due to CSRF or other issues, log it but don't throw
    // The app should still allow navigation to login
    if (error?.response?.status === 403) {
      console.warn('Logout failed with 403 (likely CSRF issue), but proceeding with logout');
    }
    throw error;
  }
};

export const checkAuth = async () => {
  const response = await api.get('/api/admin/check/');
  return response.data;
};

export const getRegistrations = async () => {
  const response = await api.get('/api/registrations/');
  return response.data;
};

export const getRegistration = async (id: number) => {
  const response = await api.get(`/api/registrations/${id}/`);
  return response.data;
};

export const verifyPayment = async (id: number, payment_verified: boolean, notes?: string) => {
  const response = await api.patch(`/api/registrations/${id}/verify/`, {
    payment_verified,
    notes,
  });
  return response.data;
};

export const deleteRegistration = async (id: number) => {
  const response = await api.delete(`/api/registrations/${id}/`);
  return response.data;
};

export default api;

