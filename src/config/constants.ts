export const APP_NAME = 'ChMS';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  APP_STATE: 'app_storage',
} as const;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  ATTENDANCE: '/attendance',
  MEMBERS: '/members',
  SERVICES: '/services',
  REPORTS: '/reports',
} as const;

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'Unauthorized. Please log in.',
  FORBIDDEN: 'Access forbidden.',
  NOT_FOUND: 'Resource not found.',
} as const;

export const SUCCESS_MESSAGES = {
  LOGIN: 'Successfully logged in.',
  LOGOUT: 'Successfully logged out.',
  CHECK_IN: 'Successfully checked in.',
  CHECK_OUT: 'Successfully checked out.',
  SAVE: 'Successfully saved.',
  DELETE: 'Successfully deleted.',
} as const; 