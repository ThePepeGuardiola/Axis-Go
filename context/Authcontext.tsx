import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

type AuthContextType = {
  isAuthenticated: boolean;
  loading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  // Add a new navigate function that works consistently
  safeNavigate: (path: string) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  // Flag to track if navigation is in progress
  const [navigationInProgress, setNavigationInProgress] = useState(false);

  useEffect(() => {
    // Check auth state on startup
    const checkAuth = async () => {
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem('session_token');
        console.log("Initial auth check:", !!token ? "Token found" : "No token");
        setIsAuthenticated(!!token);
      } catch (error) {
        console.error('Error checking authentication:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // Centralized navigation function to ensure consistency
  const safeNavigate = useCallback((path: string) => {
    // Don't navigate if already in progress
    if (navigationInProgress) {
      console.log(`Navigation already in progress, ignoring request to ${path}`);
      return;
    }

    console.log(`Safely navigating to: ${path}`);
    setNavigationInProgress(true);
    
    // Use replace for more predictable navigation
    router.replace(path);
    
    // Reset navigation flag after delay
    setTimeout(() => {
      setNavigationInProgress(false);
      console.log("Navigation lock released");
    }, 500);
  }, [router, navigationInProgress]);

  // Use useCallback to prevent unnecessary function recreation
  const login = useCallback(async (token: string) => {
    try {
      console.log('Starting login process with token:', token ? token.substring(0, 10) + '...' : 'token undefined');
      
      if (!token) {
        console.error('Error: Token is undefined or empty');
        throw new Error('Token is required for login');
      }
      
      // Store token first
      await AsyncStorage.setItem('session_token', token);
      
      // Update authentication state
      setIsAuthenticated(true);
      console.log('Login completed, authenticated state is now true');
      
      // Use the consistent navigation method
      safeNavigate('/Auth/home');
    } catch (error) {
      console.error('Error in login:', error);
      throw error;
    }
  }, [safeNavigate]);

  const logout = useCallback(async () => {
    try {
      console.log('Starting logout process');
      
      // Get the current token
      const token = await AsyncStorage.getItem('session_token');
      
      // Update state first for immediate UI feedback
      setIsAuthenticated(false);
      
      // Then remove token
      await AsyncStorage.removeItem('session_token');
      
      // Only attempt server call if there's a token
      if (token) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 3000);
          
          const response = await fetch('http://localhost:5050/api/cerrarSesion', {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              'session-token': token
            },
            signal: controller.signal
          });
          
          clearTimeout(timeoutId);
          
          const data = await response.json();
          console.log('Server response (logout):', data);
        } catch (error) {
          console.error('Error communicating with server for logout:', error);
        }
      }
      
      console.log('Logout completed');
      
      // Use the consistent navigation method
      safeNavigate('/Public/login');
    } catch (error) {
      console.error('Error in logout:', error);
      throw error;
    }
  }, [safeNavigate]);

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      loading, 
      login, 
      logout, 
      safeNavigate 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthProvider };