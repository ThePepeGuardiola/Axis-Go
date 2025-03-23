import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Redirect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Index() {
  // Esta página simplemente redirecciona según el estado de autenticación
  return <Redirect href="/Public/login" />;
}