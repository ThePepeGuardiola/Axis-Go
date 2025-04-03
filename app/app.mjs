import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, ActivityIndicator } from 'react-native';
import LoginScreen from './(tabs)/Login.tsx';
import HomeScreen from './(tabs)/home.tsx';
import SignupForm from './(tabs)/CreateAccForm.tsx';
import Verification from './(tabs)/VerificationScreen';
import App from './(tabs)/signup.tsx';
import { validateSession } from './sessionManager.mjs';
import Home from './(tabs)/Login.tsx';

const Stack = createStackNavigator();

export default function App() {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isVerified, setIsVerified] = useState(false);

    useEffect(() => {
        const checkSession = async () => {
            const sessionData = await validateSession();
            setIsAuthenticated(sessionData.isAuthenticated);
            setIsVerified(sessionData.isVerified);
            setIsLoading(false);
        };

        checkSession();
    }, []);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#900020" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {isAuthenticated ? (
                    <Stack.Screen name="./(tabs)/home" component={HomeScreen} />
                ) : isVerified ? (
                    <Stack.Screen name="./(tabs)/Login" component={LoginScreen} />
                ) : (
                    <Stack.Screen name="./(tabs)/VerificationScreen" component={Verification} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}