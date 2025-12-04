import axios from 'axios';
import { API_BASE_URL } from '../config';

// Configure axios to use credentials for session-based authentication
axios.defaults.withCredentials = true;

// Ensure we're using the correct API base URL
// Correct domain: api.skykeenentreprise.com (not entrepris or entrepis)
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Log the base URL in development
if (import.meta.env.DEV) {
  console.log('Axios baseURL configured:', api.defaults.baseURL);
}

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

// Response interceptor to handle CSRF token from Set-Cookie header
api.interceptors.response.use(
  (response) => {
    // CSRF token is automatically set in cookies by Django
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API functions
export const login = async (email: string, password: string) => {
  const response = await api.post('/api/admin/login/', { email, password });
  return response.data;
};

export const logout = async () => {
  const response = await api.post('/api/admin/logout/');
  return response.data;
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

