import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  getStoredTokens, 
  isTokenExpired, 
  getCurrentUser, 
  logoutUser 
} from '../api';
import sessionManager from '../utils/sessionManager';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status on app start
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const { token } = getStoredTokens();
        
        if (token && !isTokenExpired(token)) {
          const userData = await getCurrentUser();
          setUser(userData);
          setIsAuthenticated(true);
          
          // Set up session management for this user
          sessionManager.setupTokenRefresh();
        } else {
          // Token is expired or invalid, clear it
          logoutUser();
          sessionManager.cleanup();
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        logoutUser();
        sessionManager.cleanup();
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Update user data
  const updateUser = (userData) => {
    setUser(userData);
  };

  // Login user
  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    
    // Set up session management for the new user
    sessionManager.setupTokenRefresh();
  };

  // Logout user
  const logout = () => {
    logoutUser();
    setUser(null);
    setIsAuthenticated(false);
    
    // Clean up session management
    sessionManager.cleanup();
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
