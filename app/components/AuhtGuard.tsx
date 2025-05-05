import React, { useEffect, useState, useRef } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { useSegments, useRouter, usePathname } from 'expo-router';
import { useAuth } from '../../context/Authcontext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from '../../config/api';
import { ROUTES, AppRoute } from '../../config/routes';

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
  const [forceAllowPath, setForceAllowPath] = useState<AppRoute | null>(null);

  useEffect(() => {
    latestAuthState.current = isAuthenticated;
  }, [isAuthenticated]);
  
  useEffect(() => {
    if (pathname.includes(ROUTES.AUTH.PROFILE)) {
      setForceAllowPath(ROUTES.AUTH.PROFILE);
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
      
      if (navigationInProgress.current && !forceAllowPath) {
        return true;
      }
      
      const lastValidation = await AsyncStorage.getItem('last_token_validation');
      if (lastValidation) {
        const lastValidationTime = parseInt(lastValidation);
        if (Date.now() - lastValidationTime < 5 * 60 * 1000) {
          return true;
        }
      }
      
      try {
        const response = await axios.get(`${API_URL}/api/verificarSesion`, {
          headers: {
            'session-token': token
          },
        });
        console.log("respuesta, AuthGuard", response);
        
        if (response.data.status === true) {
          await AsyncStorage.setItem('last_token_validation', Date.now().toString());
          return true;
        }
        return false;
      } catch (error) {
        return false;
      }
    } catch (error) {
      return false;
    } finally {
      setValidatingToken(false);
    }
  };

  const isProfilePath = (path: AppRoute): path is typeof ROUTES.AUTH.PROFILE => {
    return path === ROUTES.AUTH.PROFILE;
  };

  const safeNavigate = (path: AppRoute) => {
    if (forceAllowPath && path !== forceAllowPath) {
      return;
    }
    
    const currentPathWithoutParams = pathname.split('?')[0];
    const targetPathWithoutParams = path.split('?')[0];
    
    if (currentPathWithoutParams === targetPathWithoutParams) {
      return;
    }
    
    if (navigationInProgress.current) {
      return;
    }
    
    if (isProfilePath(path)) {
      setForceAllowPath(path);
      navigationInProgress.current = true;
      router.replace(path as any);
      
      if (navigationLockTimer.current) {
        clearTimeout(navigationLockTimer.current);
      }
      
      navigationLockTimer.current = setTimeout(() => {
        navigationInProgress.current = false;
        navigationLockTimer.current = null;
      }, 1000);
      return;
    }
    
    if (pathname.includes(ROUTES.AUTH.PROFILE) && !isProfilePath(path)) {
      return;
    }
    
    navigationInProgress.current = true;
    
    if (navigationLockTimer.current) {
      clearTimeout(navigationLockTimer.current);
    }
    
    router.replace(path as any);
    
    navigationLockTimer.current = setTimeout(() => {
      navigationInProgress.current = false;
      navigationLockTimer.current = null;
    }, 1000);
  };
  
  useEffect(() => {
    if (loading || validatingToken) {
      return;
    }
    
    if (pathname.includes(ROUTES.AUTH.PROFILE)) {
      setForceAllowPath(ROUTES.AUTH.PROFILE);
      return;
    }
    
    if (forceAllowPath && !pathname.includes(forceAllowPath)) {
      setForceAllowPath(null);
    }
    
    const segmentsArray = Array.isArray(segments) ? segments : [];
    const firstSegment = segmentsArray.length > 0 ? segmentsArray[0] : '';
    const secondSegment = segmentsArray.length > 1 ? segmentsArray[1] : '';
    
    const cleanPath = pathname.split('?')[0];
    
    const isRootPath = segmentsArray.length === 0 || (segmentsArray.length === 1 && firstSegment === '');
    const inAuthGroup = firstSegment === 'Auth';
    const inPublicGroup = firstSegment === 'Public' || firstSegment === '';
    
    let isMounted = true;
    
    const checkAuthAndNavigate = async () => {
      if (navigationInProgress.current) {
        return;
      }
      
      if (forceAllowPath && pathname.includes(forceAllowPath)) {
        return;
      }
      
      try {
        if (cleanPath.includes(ROUTES.AUTH.PROFILE)) {
          setForceAllowPath(ROUTES.AUTH.PROFILE);
          
          const isTokenValid = await validateToken();
          if (!isTokenValid && isMounted) {
            setForceAllowPath(null);
            await logout();
          }
          return;
        }
        
        if (isAuthenticated && inAuthGroup) {
          const isTokenValid = await validateToken();
          if (!isTokenValid && isMounted) {
            await logout();
            return;
          }
          
          if (cleanPath === '/Auth' && !secondSegment) {
            safeNavigate(ROUTES.AUTH.HOME);
            return;
          }
          
          return;
        }
        
        if (!isAuthenticated && inAuthGroup) {
          console.log("No autenticado");
          safeNavigate(ROUTES.PUBLIC.LOGIN);
          return;
        }
        
        if (isAuthenticated && (inPublicGroup || isRootPath)) {
          safeNavigate(ROUTES.AUTH.HOME);
          return;
        } 
        
        if (!inAuthGroup && !inPublicGroup && !isRootPath) {
          safeNavigate(ROUTES.ERRORS.NOT_FOUND);
          return;
        }
      } catch (error) {
        // Silent error handling
      }
    };
    
    const timeoutId = setTimeout(() => {
      if (isMounted) {
        checkAuthAndNavigate();
      }
    }, 300);
    
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [isAuthenticated, pathname, loading, validatingToken, forceAllowPath, segments]);

  useEffect(() => {
    const segmentsArray = Array.isArray(segments) ? segments : [];
    const firstSegment = segmentsArray.length > 0 ? segmentsArray[0] : '';
    
    if (loading || firstSegment !== 'Auth') return;
    
    const intervalId = setInterval(async () => {
      const isTokenValid = await validateToken();
      if (!isTokenValid) {
        setForceAllowPath(null);
        await logout();
      }
    }, 15 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [segments, loading]);

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