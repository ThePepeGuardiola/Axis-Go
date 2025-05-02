import React, { createContext, useContext, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, Platform } from 'react-native';

type AlertType = 'success' | 'error' | 'info';

interface AlertContextType {
  showAlert: (title: string, message: string, type?: AlertType) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<AlertType>('info');
  const slideAnim = useState(new Animated.Value(-100))[0];

  const showAlert = useCallback((newTitle: string, newMessage: string, newType: AlertType = 'info') => {
    setTitle(newTitle);
    setMessage(newMessage);
    setType(newType);
    setVisible(true);

    // Slide in
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: Platform.OS !== 'web',
    }).start();

    // Auto hide after 3 seconds
    setTimeout(() => {
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: Platform.OS !== 'web',
      }).start(() => {
        setVisible(false);
      });
    }, 3000);
  }, [slideAnim]);

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      {visible && (
        <Animated.View
          style={[
            styles.alertContainer,
            styles[type],
            { transform: [{ translateY: slideAnim }] }
          ]}
        >
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
        </Animated.View>
      )}
    </AlertContext.Provider>
  );
};

const styles = StyleSheet.create({
  alertContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: 15,
    margin: 10,
    borderRadius: 8,
    elevation: 5,
    ...(Platform.OS === 'web' ? {
      boxShadow: '0px 2px 3.84px rgba(0, 0, 0, 0.25)'
    } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    }),
    zIndex: 1000,
  },
  success: {
    backgroundColor: '#4CAF50',
  },
  error: {
    backgroundColor: '#f44336',
  },
  info: {
    backgroundColor: '#2196F3',
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  message: {
    color: '#fff',
    fontSize: 14,
  },
});

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
}; 