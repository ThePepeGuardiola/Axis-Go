import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

type AuthContextType = {
  isAuthenticated: boolean;
  loading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Verificar estado de autenticación al iniciar
    const checkAuth = async () => {
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem('session_token');
        setIsAuthenticated(!!token);
      } catch (error) {
        console.error('Error verificando autenticación:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const login = async (token: string) => {
    try {
      console.log('Guardando token en AuthContext:', token);
      await AsyncStorage.setItem('session_token', token);
      setIsAuthenticated(true);
      
      // La navegación se manejará en el AuthGuard
      console.log('Login completado, estado de autenticación actualizado');
      
      // Eliminamos la redirección de aquí para que sea manejada por AuthGuard
      // router.replace('/Auth/home');
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('session_token');
      setIsAuthenticated(false);
      
      // Dejamos que AuthGuard maneje la redirección
    } catch (error) {
      console.error('Error en logout:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export { AuthProvider };