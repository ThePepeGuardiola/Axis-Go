import { Stack } from 'expo-router';
import AuthGuard from './components/AuhtGuard';
import { AuthProvider } from '../context/Authcontext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <AuthGuard>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="login" />
          <Stack.Screen name="signup" />
          <Stack.Screen name="Auth" />
        </Stack>
      </AuthGuard>
    </AuthProvider>
  );
}