// Centralized API configuration for Django Backend
export const API_BASE_URL = 
  import.meta.env.VITE_API_URL || 
  (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
    ? `${window.location.protocol}//${window.location.hostname}:8001`
    : 'http://127.0.0.1:8001');

export const API_ENDPOINTS = {
  health: `${API_BASE_URL}/api/health/`,
  bundle: `${API_BASE_URL}/api/bundle/`,
  profile: `${API_BASE_URL}/api/profile/`,
  categories: `${API_BASE_URL}/api/categories/`,
  projects: `${API_BASE_URL}/api/projects/`,
  bookings: `${API_BASE_URL}/api/bookings/`,
  tools: `${API_BASE_URL}/api/tools/`,
  industries: `${API_BASE_URL}/api/industries/`,
  experiences: `${API_BASE_URL}/api/experiences/`,
  education: `${API_BASE_URL}/api/education/`,
};

/**
 * Returns authorization headers for CMS requests
 */
export function getAuthHeaders(existingHeaders = {}) {
  let passcode = 'superadmin';
  try {
    passcode = sessionStorage.getItem('cms_passcode') || 'superadmin';
  } catch {
    // fallback
  }

  return {
    ...existingHeaders,
    'X-Admin-Passcode': passcode,
  };
}
