import { TripsProvider } from "./trips/TripsContext";
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import * as Font from 'expo-font';
import AuthGuard from './components/AuhtGuard';
import { AuthProvider } from '../context/Authcontext';
import { AlertProvider } from '../context/AlertContext';

export default function RootLayout() {
  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'AntDesign': require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/AntDesign.ttf'),
        // Add other fonts as needed
      });
    }
    loadFonts();
  }, []);

  return (
    <TripsProvider>
    <AlertProvider>
      <AuthProvider>
        <AuthGuard>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="Public" />
            <Stack.Screen name="Auth" />
            <Stack.Screen name="+not-found" options={{ title: 'Oops!' }} />
          </Stack>
        </AuthGuard>
      </AuthProvider>
    </AlertProvider>
    </TripsProvider>
  );
}