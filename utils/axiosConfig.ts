import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { API_URL } from '../config/api';
import { ROUTES } from '../config/routes';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('session_token');
    if (token) {
      config.headers['session-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      // Check if the error is due to session expiration
      if (error.response.status === 401 && error.response.data?.expired) {
        try {
          // Clear storage
          await AsyncStorage.removeItem('session_token');
          await AsyncStorage.removeItem('last_token_validation');
          await AsyncStorage.removeItem('user_data');
          
          // Redirect to login page
          router.replace(ROUTES.PUBLIC.LOGIN);
        } catch (clearError) {
          console.error('Error clearing session:', clearError);
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api; 