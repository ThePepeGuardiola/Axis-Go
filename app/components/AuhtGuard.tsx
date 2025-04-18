import { useEffect, useState, useRef } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { useSegments, useRouter, usePathname } from 'expo-router';
import { useAuth } from '../../context/Authcontext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// API URL configuration
const API_URL = 'http://localhost:5050';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading, logout } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const pathname = usePathname();
  const [validatingToken, setValidatingToken] = useState(false);
  const navigationInProgress = useRef(false);
  const latestAuthState = useRef(isAuthenticated);
  const lastPathRef = useRef(pathname);
  const navigationLockTimer = useRef<NodeJS.Timeout | null>(null);
  const [forceAllowPath, setForceAllowPath] = useState<string | null>(null);
  
  // Update ref when auth state changes
  useEffect(() => {
    latestAuthState.current = isAuthenticated;
  }, [isAuthenticated]);
  
  useEffect(() => {
    if (pathname.includes('/Auth/PerfilUsuario')) {
      setForceAllowPath('/Auth/PerfilUsuario');
    }
    
    lastPathRef.current = pathname;
  }, [pathname]);
  
  const validateToken = async () => {
    try {
      setValidatingToken(true);
      const token = await AsyncStorage.getItem('session_token');
      
      if (!token) {
        return false;
      }
      
      // Skip API calls during navigation, but never skip for PerfilUsuario path
      if (navigationInProgress.current && !forceAllowPath) {
        return true;
      }
      
      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      try {
        const response = await axios.get(`${API_URL}/api/verificarSesion`, {
          headers: {
            'session-token': token
          },
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        return response.data.status === true;
      } catch (error) {
        if ((error as { name?: string }).name === 'AbortError') {
          return true;
        }
        throw error;
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        return false;
      }
      
      // Server error during validation, assume valid
      return true;
    } finally {
      setValidatingToken(false);
    }
  };

  const safeNavigate = (path: string) => {
    // If we're forcing a specific path, don't allow navigation elsewhere
    if (forceAllowPath && path !== forceAllowPath) {
      return;
    }
    
    // Don't navigate to path if we're already there (including query params)
    const currentPathWithoutParams = pathname.split('?')[0];
    const targetPathWithoutParams = path.split('?')[0];
    
    if (currentPathWithoutParams === targetPathWithoutParams) {
      return;
    }
    
    // Don't navigate to the same path if navigation is already in progress
    if (navigationInProgress.current) {
      return;
    }
    
    // Special case: Always allow navigation to PerfilUsuario
    if (path.includes('/Auth/PerfilUsuario')) {
      setForceAllowPath('/Auth/PerfilUsuario');
      navigationInProgress.current = true;
      router.replace(path);
      
      if (navigationLockTimer.current) {
        clearTimeout(navigationLockTimer.current);
      }
      
      navigationLockTimer.current = setTimeout(() => {
        navigationInProgress.current = false;
        navigationLockTimer.current = null;
      }, 1000);
      return;
    }
    
    // Don't navigate away from PerfilUsuario
    if (pathname.includes('/Auth/PerfilUsuario') && !path.includes('/Auth/PerfilUsuario')) {
      return;
    }
    
    navigationInProgress.current = true;
    
    // Clear any existing navigation lock timer
    if (navigationLockTimer.current) {
      clearTimeout(navigationLockTimer.current);
    }
    
    router.replace(path);
    
    // Reset navigation lock after delay
    navigationLockTimer.current = setTimeout(() => {
      navigationInProgress.current = false;
      navigationLockTimer.current = null;
    }, 1000); // Increased to 1 second for more stability
  };
  
  // The main route handling logic
  useEffect(() => {
    // Skip if still loading or validating
    if (loading || validatingToken) {
      return;
    }
    
    // CRITICAL CHECK: If we're trying to access PerfilUsuario, force allow it
    if (pathname.includes('/Auth/PerfilUsuario')) {
      setForceAllowPath('/Auth/PerfilUsuario');
      return;
    }
    
    // If we had a force allowed path but now we're on a different path, clear it
    if (forceAllowPath && !pathname.includes(forceAllowPath)) {
      setForceAllowPath(null);
    }
    
    const segmentsArray = Array.isArray(segments) ? segments : [];
    const firstSegment = segmentsArray.length > 0 ? segmentsArray[0] : '';
    const secondSegment = segmentsArray.length > 1 ? segmentsArray[1] : '';
    
    // Parse path without query params for comparison
    const cleanPath = pathname.split('?')[0];
    
    const isRootPath = segmentsArray.length === 0 || (segmentsArray.length === 1 && firstSegment === '');
    const inAuthGroup = firstSegment === 'Auth';
    const inPublicGroup = firstSegment === 'Public' || firstSegment === '';
    
    // Flag to avoid state updates after unmount
    let isMounted = true;
    
    const checkAuthAndNavigate = async () => {
      // Skip checks if navigation is already in progress
      if (navigationInProgress.current) {
        return;
      }
      
      // Skip checks if we're forcing a path
      if (forceAllowPath && pathname.includes(forceAllowPath)) {
        return;
      }
      
      try {
        // ABSOLUTE PRIORITY: Check if trying to access PerfilUsuario
        if (cleanPath.includes('/Auth/PerfilUsuario')) {
          setForceAllowPath('/Auth/PerfilUsuario');
          
          // Only validate token, no redirects
          const isTokenValid = await validateToken();
          if (!isTokenValid && isMounted) {
            setForceAllowPath(null); // Clear force path before logout
            await logout();
          }
          return;
        }
        
        // Authenticated users in Auth group
        if (isAuthenticated && inAuthGroup) {
          // Always validate token
          const isTokenValid = await validateToken();
          if (!isTokenValid && isMounted) {
            await logout();
            return;
          }
          
          // Only redirect if at exact Auth root with no other segments
          if (cleanPath === '/Auth' && !secondSegment) {
            safeNavigate('/Auth/home');
            return;
          }
          
          return;
        }
        
        // 404 case - not in valid groups
        if (!inAuthGroup && !inPublicGroup && !isRootPath) {
          safeNavigate('/not_founds');
          return;
        }
        
        // Authenticated users trying to access public areas
        if (isAuthenticated && (inPublicGroup || isRootPath)) {
          safeNavigate('/Auth/home');
          return;
        } 
        
        // Unauthenticated users trying to access protected areas
        if (!isAuthenticated && inAuthGroup) {
          safeNavigate('/Public/login');
          return;
        }
      } catch (error) {
        // Silent error handling
      }
    };
    
    // Execute auth check after delay to ensure state is stable
    const timeoutId = setTimeout(() => {
      if (isMounted) {
        checkAuthAndNavigate();
      }
    }, 300); // Increased for more stability
    
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [isAuthenticated, pathname, loading, validatingToken, forceAllowPath, segments]);

  // Periodic token validation 
  useEffect(() => {
    const segmentsArray = Array.isArray(segments) ? segments : [];
    const firstSegment = segmentsArray.length > 0 ? segmentsArray[0] : '';
    
    if (loading || firstSegment !== 'Auth') return;
    
    const intervalId = setInterval(async () => {
      const isTokenValid = await validateToken();
      if (!isTokenValid) {
        setForceAllowPath(null); // Clear force path before logout
        await logout();
      }
    }, 15 * 60 * 1000); // Check every 15 minutes
    
    return () => clearInterval(intervalId);
  }, [segments, loading]);

  // Loading indicator
  if (loading || validatingToken) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#900020" />
        <Text style={{ marginTop: 10 }}>
          {loading ? "Verificando autenticación..." : "Validando sesión..."}
        </Text>
      </View>
    );
  }

  return <>{children}</>;
}