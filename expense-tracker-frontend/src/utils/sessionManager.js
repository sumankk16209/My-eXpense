import { getStoredTokens, isTokenExpired, refreshAccessToken, clearTokens } from '../api';

class SessionManager {
  constructor() {
    this.refreshTimeout = null;
    this.init();
  }

  init() {
    // Check token expiration every minute
    this.startExpirationCheck();
    
    // Set up refresh token logic
    this.setupTokenRefresh();
  }

  startExpirationCheck() {
    setInterval(() => {
      this.checkTokenExpiration();
    }, 60000); // Check every minute
  }

  checkTokenExpiration() {
    const { token } = getStoredTokens();
    
    if (token && isTokenExpired(token)) {
      console.log('Token expired, attempting refresh...');
      this.refreshToken();
    }
  }

  setupTokenRefresh() {
    const { token } = getStoredTokens();
    
    if (token && !isTokenExpired(token)) {
      this.scheduleTokenRefresh(token);
    }
  }

  scheduleTokenRefresh(token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiresAt = payload.exp * 1000; // Convert to milliseconds
      const now = Date.now();
      const timeUntilExpiry = expiresAt - now;
      
      // Refresh token 5 minutes before expiration
      const refreshTime = Math.max(timeUntilExpiry - 300000, 60000); // At least 1 minute
      
      if (this.refreshTimeout) {
        clearTimeout(this.refreshTimeout);
      }
      
      this.refreshTimeout = setTimeout(() => {
        this.refreshToken();
      }, refreshTime);
      
      console.log(`Token refresh scheduled in ${Math.round(refreshTime / 1000)} seconds`);
    } catch (error) {
      console.error('Error scheduling token refresh:', error);
    }
  }

  async refreshToken() {
    try {
      const newToken = await refreshAccessToken();
      this.scheduleTokenRefresh(newToken);
      console.log('Token refreshed successfully');
      return newToken;
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.handleRefreshFailure();
      throw error;
    }
  }

  handleRefreshFailure() {
    clearTokens();
    
    // Redirect to login if not already there
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }

  // Method to manually refresh token (e.g., before making important requests)
  async ensureValidToken() {
    const { token } = getStoredTokens();
    
    if (!token) {
      throw new Error('No token available');
    }
    
    if (isTokenExpired(token)) {
      return await this.refreshToken();
    }
    
    return token;
  }

  // Clean up on logout
  cleanup() {
    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout);
      this.refreshTimeout = null;
    }
  }
}

// Create singleton instance
const sessionManager = new SessionManager();

export default sessionManager;
