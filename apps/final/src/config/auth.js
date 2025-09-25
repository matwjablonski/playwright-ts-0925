// Authentication configuration
export const AUTH_CONFIG = {
  // Default password for the application
  // In production, this should be handled server-side
  defaultPassword: 'admin123',
  
  // Session storage keys
  sessionKeys: {
    isAuthenticated: 'todoApp_isAuthenticated',
    loginTime: 'todoApp_loginTime'
  },
  
  // Session timeout (in milliseconds) - 24 hours
  sessionTimeout: 24 * 60 * 60 * 1000
};