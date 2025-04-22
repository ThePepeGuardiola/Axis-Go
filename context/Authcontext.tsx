import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import api from '../utils/axiosConfig';
import { ROUTES } from '../config/routes';
import { useAlert } from './AlertContext';

type AuthContextType = {
  isAuthenticated: boolean;
  loading: boolean;
  isProcessing: boolean;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const { showAlert } = useAlert();
  const navigationInProgress = useRef(false);

  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('session_token');
      
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        const response = await api.get('/api/verificarSesion');
        setIsAuthenticated(response.data.status === true);
      } catch (error) {
        setIsAuthenticated(false);
      }
    } catch (error) {
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const handleNavigation = useCallback((route: string) => {
    if (navigationInProgress.current) return;
    navigationInProgress.current = true;
    
    // Usar setTimeout para asegurar que el estado se ha actualizado
    setTimeout(() => {
      router.replace(route);
      navigationInProgress.current = false;
    }, 50);
  }, []);

  const login = useCallback(async (token: string) => {
    try {
      if (!token) {
        throw new Error('Token is required for login');
      }

      setIsProcessing(true);
      navigationInProgress.current = true;
      
      // Actualizar el token y el estado
      await AsyncStorage.setItem('session_token', token);
      
      // Esperar un poco para asegurar que el token se guardó
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setIsAuthenticated(true);
      showAlert('¡Bienvenido!', 'Has iniciado sesión correctamente', 'success');
      
      // Navegar después de un delay
      setTimeout(() => {
        router.replace(ROUTES.AUTH.HOME);
        navigationInProgress.current = false;
        setIsProcessing(false);
      }, 500);
    } catch (error) {
      navigationInProgress.current = false;
      setIsProcessing(false);
      showAlert('Error', 'No se pudo iniciar sesión', 'error');
      throw error;
    }
  }, [showAlert]);

  const logout = useCallback(async () => {
    try {
      setIsProcessing(true);
      navigationInProgress.current = true;
      
      const token = await AsyncStorage.getItem('session_token');
      
      if (token) {
        try {
          await api.post('/api/cerrarSesion', {
            session_token: token
          });
          showAlert('Sesión cerrada', 'Has cerrado sesión correctamente', 'info');
        } catch (error: any) {
          console.error('Error al cerrar sesión en el servidor:', error.response?.data || error.message);
        }
      }
      
      // Limpiar el estado local
      setIsAuthenticated(false);
      await AsyncStorage.removeItem('session_token');
      await AsyncStorage.removeItem('last_token_validation');
      await AsyncStorage.removeItem('user_data');
      
      // Esperar un poco antes de navegar
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Navegar después de un delay
      setTimeout(() => {
        router.replace(ROUTES.PUBLIC.LOGIN);
        navigationInProgress.current = false;
        setIsProcessing(false);
      }, 500);
    } catch (error: any) {
      navigationInProgress.current = false;
      setIsProcessing(false);
      console.error('Error al cerrar sesión:', error);
      showAlert('Error', 'No se pudo cerrar sesión completamente', 'error');
      throw error;
    }
  }, [showAlert]);

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      loading,
      isProcessing, 
      login, 
      logout
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