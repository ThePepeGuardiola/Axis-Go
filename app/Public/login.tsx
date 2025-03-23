import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Pressable, View, StyleSheet, Text, TextInput, Image, Alert } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import Background from '@/components/Background';
import { useAuth } from '../../context/Authcontext';

WebBrowser.maybeCompleteAuthSession();

export default function Login() {
    const [correo, setCorreo] = useState('');
    const [contraseña, setContraseña] = useState('');
    const [onPressIn, setOnPressIn] = useState(false);
    const { login } = useAuth();

    const [request, response, promptAsync] = Google.useAuthRequest({
        clientId: '685273445323-99ecno46gmaj0perclsb4t9dnq51gfo8.apps.googleusercontent.com',
        scopes: ['openid', 'email', 'profile'],
        responseType: 'id_token'
    });

    useEffect(() => {
        if (response?.type === 'success') {
            const { id_token } = response.params;
            if (id_token) handleGoogleLogin(id_token);
            else Alert.alert('Error', 'No se recibió el ID Token de Google');
        }
    }, [response]);

    const handleLogin = async () => {
        try {
            console.log('Iniciando login con:', { correo });
            const res = await fetch('http://localhost:5050/api/autenticarUsuario', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ correo, password: contraseña })
            });
    
            const data = await res.json();
            console.log('Respuesta del servidor:', data);
    
            if (data.status) {
                console.log('Login exitoso, guardando token');
                await login(data.session_token);
                console.log('Token guardado');
            } else {
                Alert.alert('Error', data.message);
            }
        } catch (error) {
            console.error('Error en login:', error);
            Alert.alert('Error', 'Ocurrió un error, intenta de nuevo.');
        }
    };

    const handleGoogleLogin = async (idToken: string) => {
        try {
            const res = await fetch('http://localhost:5050/api/autenticarUsuarioGoogle', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: idToken })
            });

            const data = await res.json();

            if (data.status) {
                // Usar el contexto de autenticación en lugar de AsyncStorage directo
                await login(data.session_token);
                router.replace('/Auth/home');            
            } else {
                Alert.alert('Error', 'Autenticación fallida con Google');
            }
        } catch (error) {
            console.error('Error autenticando con Google:', error);
            Alert.alert('Error', 'Ocurrió un problema con Google');
        }
    };

    // El resto del componente permanece igual
    return (
        <SafeAreaProvider>
            <StatusBar style='auto'/>
            <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
                <Background />
                <View style={styles.headerContainer}>
                    <Text style={styles.title}>Iniciar Sesión</Text>
                    <Text style={styles.text}>¡Bienvenido de nuevo, te hemos hechado de menos!</Text>
                </View>

                <View style={{ flex: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'center', width: '100%' }} >
                    <TextInput
                        style={styles.area}
                        placeholder="Correo Electrónico"
                        value={correo}
                        onChangeText={setCorreo}
                    />

                    <TextInput
                        style={styles.area}
                        placeholder="Contraseña"
                        value={contraseña}
                        onChangeText={setContraseña}
                        secureTextEntry
                    />
                </View>
                <View>
                    <Pressable
                        onPressIn={() => setOnPressIn(true)}
                        onPressOut={() => setOnPressIn(false)}
                        hitSlop={5}
                        pressRetentionOffset={{top: 5, left: 5, bottom: 5, right: 5}}
                    >
                        <Text style={onPressIn ? styles.text : styles.textRed}>Olvidaste tu contraseña?</Text>
                    </Pressable>
                </View>

                <View style={styles.buttonContainer}>
                    <Pressable
                        style={onPressIn ? styles.buttonActive : styles.button}
                        onPress={handleLogin}
                    >
                        <Text style={styles.buttonText}>Iniciar</Text>
                    </Pressable>

                    <Pressable
                        onPress={() => router.push('/signup')}
                        hitSlop={5}
                        pressRetentionOffset={{top: 5, left: 5, bottom: 5, right: 5}}
                    >
                        <Text style={onPressIn ? styles.textRed : styles.text}>
                            Crear nueva cuenta
                        </Text>
                    </Pressable>

                    <Pressable
                        hitSlop={5}
                        pressRetentionOffset={{top: 5, left: 5, bottom: 5, right: 5}}
                    >
                        <Text style={onPressIn ? styles.text : styles.container}>O continuar con</Text>
                    </Pressable>
                </View>

                <View style={styles.socialLoginContainer}>
                    <Pressable style={onPressIn ? styles.imgFocus : styles.img} onPress={() => promptAsync()}>
                        <Image source={require('../../assets/icons/google.png')} style={styles.socialIcon} />
                    </Pressable>

                    <Pressable style={onPressIn ? styles.imgFocus : styles.img}>
                        <Image source={require('../../assets/icons/facebook-ci.png')} style={styles.socialIcon} />
                    </Pressable>

                    <Pressable style={onPressIn ? styles.imgFocus : styles.img}>
                        <Image source={require('../../assets/icons/apple.png')} style={styles.socialIcon} />
                    </Pressable>
                </View>
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
    textRed: {
        color: '#900020',
        fontSize: 16,
        fontWeight: '600',
    },
    button: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: 60,
        color: '#fff',
        fontWeight: '700',
        backgroundColor: '#900020',
        fontSize: 25,
        borderRadius: 10
    },
    buttonActive: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: 60,
        color: '#fff',
        fontWeight: '700',
        backgroundColor: '#000',
        fontSize: 25,
        borderRadius: 10
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
    areaFocus: {
        borderWidth: 2,
        borderColor: '#900020',
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
    imgFocus: {
        marginHorizontal: 5,
        borderRadius: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
    socialIcon: {
        width: 40,
        height: 40,
        margin: 10
    },
    forgotPassword: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        width: '100%',
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