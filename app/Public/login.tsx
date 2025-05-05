import { StatusBar } from 'expo-status-bar';
import { useEffect, useState, useCallback } from 'react';
import { Pressable, View, StyleSheet, Text, TextInput, Image, Platform } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import Background from '../../components/Background';
import { useAuth } from '../../context/Authcontext';
import { ROUTES } from '../../config/routes';
import api from '../../utils/axiosConfig';
import { useAlert } from '../../context/AlertContext';
import LoadingScreen from '../components/LoadingScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

WebBrowser.maybeCompleteAuthSession();

export default function Login() {
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');
    const [onPressIn, setOnPressIn] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { login, isProcessing } = useAuth();
    const { showAlert } = useAlert();

    const [request, response, promptAsync] = Google.useAuthRequest({
        clientId: '694329343357-atp58qbde6oguf753bpo2j5ssek0b7iq.apps.googleusercontent.com',
        scopes: ['openid', 'email', 'profile'],
        responseType: 'id_token',
        ...(Platform.OS === 'web' ? {
            expoClientId: '694329343357-atp58qbde6oguf753bpo2j5ssek0b7iq.apps.googleusercontent.com',
            webClientId: '694329343357-atp58qbde6oguf753bpo2j5ssek0b7iq.apps.googleusercontent.com'
        } : {}),
    });

    const handleGoogleAuth = useCallback(async () => {
        if (isLoading) return;
        
        try {
            const result = await promptAsync();
            if (result?.type !== 'success') {
                if (result?.type === 'error') {
                    showAlert('Error', 'No se pudo iniciar sesión con Google', 'error');
                }
                return;
            }
        } catch (error) {
            console.error('Error iniciando auth de Google:', error);
            showAlert('Error', 'Error al iniciar la autenticación con Google', 'error');
        }
    }, [isLoading, promptAsync, showAlert]);

    useEffect(() => {
        if (response?.type === 'success') {
            const { id_token } = response.params;
            
            if (id_token) {
                handleGoogleLogin(id_token);
            } else {
                showAlert('Error', 'No se recibió información válida de Google', 'error');
            }
        }
    }, [response]);

    const handleLogin = async () => {
        if (isLoading) return;
        
        try {
            setIsLoading(true);
            
            if (!correo || !password) {
                showAlert('Error', 'Por favor ingrese correo y contraseña', 'error');
                return;
            }

            const response = await api.post('/api/autenticarUsuario', {
                correo,
                password
            });
    
            const { data } = response;
    
            if (data.status) {
                if (!data.session_token) {
                    showAlert('Error', 'No se recibió un token de sesión válido', 'error');
                    return;
                }
                
                await login(data.session_token);
                await AsyncStorage.multiSet(
                    Object.entries(data.usuario).map(([key, value]) => [
                      key,
                      value ? value.toString() : ""
                    ])
                );
            } else {
                showAlert('Error', data.message || 'Credenciales inválidas', 'error');
            }
        } catch (error: any) {
            console.error('Error en login:', error.response?.data || error.message);
            
            if (error.response?.status === 401) {
                showAlert('Error', 'Credenciales inválidas', 'error');
            } else {
                showAlert('Error', 'No se pudo conectar con el servidor. Verifique su conexión a internet e intente nuevamente.', 'error');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async (idToken: string) => {
        if (isLoading) return;
        
        try {
            setIsLoading(true);
            
            if (!idToken) {
                throw new Error('Token inválido');
            }
            
            const response = await api.post('/api/autenticarUsuarioGoogle', {
                token: idToken
            });
            
            const { data } = response;
            
            if (data.status) {
                let sessionToken = data.session_token;
                
                if (!sessionToken && data.usuario && data.usuario.session_token) {
                    sessionToken = data.usuario.session_token;
                }
                
                if (sessionToken) {
                    await login(sessionToken);
                    await AsyncStorage.multiSet(
                        Object.entries(data.usuario).map(([key, value]) => [
                          key,
                          value ? value.toString() : ""
                        ])
                    );
                } else {
                    showAlert('Error', 'No se recibió un token de sesión válido', 'error');
                }
            } else {
                showAlert('Error', data.message || 'No se pudo iniciar sesión con Google', 'error');
            }
        } catch (error: any) {
            console.error('Error en Google login:', error.response?.data || error.message);
            showAlert('Error', 'No se pudo completar el inicio de sesión con Google. Intente nuevamente.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaProvider>
            <StatusBar style='auto'/>
            <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
                <Background />
                <View style={styles.headerContainer}>
                    <Text style={styles.title}>Iniciar Sesión</Text>
                    <Text style={styles.text}>¡Bienvenido de nuevo, te hemos echado de menos!</Text>
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.area}
                        placeholder="Correo Electrónico"
                        value={correo}
                        onChangeText={setCorreo}
                        editable={!isLoading}
                    />

                    <TextInput
                        style={styles.area}
                        placeholder="Contraseña"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        editable={!isLoading}
                    />
                </View>

                <View style={styles.buttonContainer}>
                    <Pressable
                        style={[
                            styles.button,
                            isLoading && styles.buttonDisabled
                        ]}
                        onPress={handleLogin}
                        disabled={isLoading}
                    >
                        <Text style={styles.buttonText}>
                            {isLoading ? 'Iniciando...' : 'Iniciar'}
                        </Text>
                    </Pressable>

                    <Pressable
                        onPress={() => router.push(ROUTES.PUBLIC.SIGNUP as any)}
                        disabled={isLoading}
                    >
                        <Text style={styles.text}>
                            Crear nueva cuenta
                        </Text>
                    </Pressable>

                    {/* <Text style={styles.text}>O continuar con</Text> */}
                </View>

                <View style={styles.socialLoginContainer}>
                    <Pressable 
                        style={styles.img} 
                        onPress={handleGoogleAuth}
                        disabled={isLoading}
                    >
                        <Image source={require('../../assets/icons/google.png')} style={styles.socialIcon} />
                    </Pressable>

                    {/* <Pressable style={onPressIn ? styles.imgFocus : styles.img}>
                        <Image source={require('../../assets/icons/facebook-ci.png')} style={styles.socialIcon} />
                    </Pressable> */}

                    {/* <Pressable style={onPressIn ? styles.imgFocus : styles.img}>
                        <Image source={require('../../assets/icons/apple.png')} style={styles.socialIcon} />
                    </Pressable> */}
                </View>
                {(isLoading || isProcessing) && <LoadingScreen />}
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingBottom: 30,
        paddingHorizontal: 30,
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 35,
        fontWeight: '800',
        color: '#900020',
    },
    text: {
        color: '#000',
        fontSize: 25,
        fontWeight: '700',
        textAlign: 'center',
    },
    button: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: 60,
        backgroundColor: '#900020',
        borderRadius: 10
    },
    buttonDisabled: {
        backgroundColor: '#cccccc',
    },
    buttonText: {
        color: 'white',
        fontSize: 22,
        fontWeight: '700',
    },
    area: {
        borderWidth: 2,
        borderColor: '#ffffff',
        borderRadius: 10,
        width: '100%',
        paddingVertical: 20,
        paddingHorizontal: 20,
        fontSize: 16,
        fontWeight: '700',
        backgroundColor: '#ffeaee',
    },
    img: {
        marginHorizontal: 5,
        borderRadius: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
    socialIcon: {
        width: 40,
        height: 40,
        margin: 10
    },
    headerContainer: {
        flex: 2,
        display: 'flex',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        width: '100%',
    },
    inputContainer: {
        flex: 2,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        width: '100%',
        gap: 20,
    },
    buttonContainer: {
        flex: 2,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        width: '100%',
    },
    socialLoginContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
    },
});