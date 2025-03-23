import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { useAuth } from '../../context/Authcontext'; // Asegúrate de que la ruta sea correcta

// Componente para proteger las rutas
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
  
    const isRootPath = (segments as string[]).length === 0 || (segments.length === 1 && segments[0] === '');    
    const inAuthGroup = segments[0] === 'Auth';
    const inPublicGroup = segments[0] === 'Public' || segments[0] === '';
  
    // Para depuración
    console.log('Auth status:', {
      isAuthenticated,
      inAuthGroup,
      inPublicGroup,
      isRootPath,
      segments
    });
  
    // Manejo de rutas no encontradas primero
    if (!inAuthGroup && !inPublicGroup && !isRootPath) {
      console.log('Redirecting to not found page');
      router.replace('/not_founds');
      return;
    }
  
    // Luego manejo de autenticación
    if (isAuthenticated && (inPublicGroup || isRootPath)) {
      console.log('Authenticated user trying to access public pages, redirecting to home');
      router.replace('/Auth/home');
      return;
    } else if (!isAuthenticated && inAuthGroup) {
      console.log('Unauthenticated user trying to access protected pages, redirecting to login');
      router.replace('/Public/login');
      return;
    }
  }, [loading, isAuthenticated, segments]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#900020" />
      </View>
    );
  }

  return <>{children}</>;
}