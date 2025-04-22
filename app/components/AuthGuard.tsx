import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useSegments, useRouter, usePathname } from 'expo-router';
import { useAuth } from '../../context/Authcontext';
import { ROUTES } from '../../config/routes';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, loading } = useAuth();
    const segments = useSegments();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (loading) return;

        const inAuthGroup = segments[0] === 'Auth';
        const inPublicGroup = segments[0] === 'Public';

        // Solo redirigir si es absolutamente necesario
        if (!isAuthenticated && inAuthGroup && pathname !== ROUTES.PUBLIC.LOGIN) {
            router.replace(ROUTES.PUBLIC.LOGIN);
        } else if (isAuthenticated && inPublicGroup && pathname !== ROUTES.AUTH.HOME) {
            router.replace(ROUTES.AUTH.HOME);
        }
    }, [isAuthenticated, loading, segments, pathname]);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#900020" />
            </View>
        );
    }

    return <>{children}</>;
} 