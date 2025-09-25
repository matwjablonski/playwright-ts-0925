import { Service } from '../lib/Service';
import { AUTH_CONFIG } from '../config/auth';

export class AuthService extends Service {
  constructor(services) {
    super(services);
  }

  /**
   * Check if user is currently authenticated
   * @returns {boolean} - true if authenticated and session is valid
   */
  isAuthenticated() {
    const isAuth = sessionStorage.getItem(AUTH_CONFIG.sessionKeys.isAuthenticated);
    const loginTime = sessionStorage.getItem(AUTH_CONFIG.sessionKeys.loginTime);
    
    if (!isAuth || !loginTime) {
      return false;
    }
    
    // Check if session has expired
    const currentTime = Date.now();
    const sessionAge = currentTime - parseInt(loginTime);
    
    if (sessionAge > AUTH_CONFIG.sessionTimeout) {
      this.logout(); // Clear expired session
      return false;
    }
    
    return isAuth === 'true';
  }

  /**
   * Attempt to login with provided password
   * @param {string} password - Password to check
   * @returns {boolean} - true if login successful
   */
  login(password) {
    if (!password) {
      return false;
    }

    // In a real app, this would be a server-side API call
    if (password === AUTH_CONFIG.defaultPassword) {
      const currentTime = Date.now().toString();
      
      sessionStorage.setItem(AUTH_CONFIG.sessionKeys.isAuthenticated, 'true');
      sessionStorage.setItem(AUTH_CONFIG.sessionKeys.loginTime, currentTime);
      
      return true;
    }
    
    return false;
  }

  /**
   * Logout user and clear session
   */
  logout() {
    sessionStorage.removeItem(AUTH_CONFIG.sessionKeys.isAuthenticated);
    sessionStorage.removeItem(AUTH_CONFIG.sessionKeys.loginTime);
    
    // Optionally clear app data on logout
    // localStorage.clear();
  }

  /**
   * Get remaining session time in milliseconds
   * @returns {number} - milliseconds until session expires, 0 if not authenticated
   */
  getSessionTimeRemaining() {
    if (!this.isAuthenticated()) {
      return 0;
    }
    
    const loginTime = parseInt(sessionStorage.getItem(AUTH_CONFIG.sessionKeys.loginTime));
    const currentTime = Date.now();
    const sessionAge = currentTime - loginTime;
    
    return Math.max(0, AUTH_CONFIG.sessionTimeout - sessionAge);
  }

  /**
   * Refresh session timestamp
   */
  refreshSession() {
    if (this.isAuthenticated()) {
      sessionStorage.setItem(AUTH_CONFIG.sessionKeys.loginTime, Date.now().toString());
    }
  }
};