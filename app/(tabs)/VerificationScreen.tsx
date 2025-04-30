import React, { useState, useEffect } from 'react';
import { 
    SafeAreaView, Text, StyleSheet, Platform, TextInput, 
    View, Pressable, Image, Alert 
} from 'react-native';

import {
    CodeField,
    Cursor,
    useBlurOnFulfill,
    useClearByFocusCell,
} from 'react-native-confirmation-code-field';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useRouter } from "expo-router";
import axios from 'axios';

const CELL_COUNT = 7;

const Verification = () => {
    const router = useRouter();

    // Accedemos al correo electrónico desde el contexto
    const [verificationCode, setVerificationCode] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [isCooldown, setIsCooldown] = useState(false);

    const ref = useBlurOnFulfill({ value: verificationCode, cellCount: CELL_COUNT });
    const [cellprops, getCellOnLayoutHandler] = useClearByFocusCell({
        value: verificationCode,
        setValue: setVerificationCode,
    });

    const [userData, setUserData] = useState<{ [key: string]: string | null } | null>(null);

    useEffect(() => {
        const loadUserData = async () => {
            try {
            const storedData = await AsyncStorage.multiGet([
                "emailRegistro",
                "passwordRegistro",
                "usernameRegistro",
                "birthdateRegistro",
                "phoneRegistro",
                "country_codeRegistro",
                "genderRegistro",
            ]);
    
            const parsedData = Object.fromEntries(
                storedData.map(([key, value]) => [key.replace("Registro", ""), value])
            );
    
            if (!parsedData.email || !parsedData.username || !parsedData.password || !parsedData.birthdate || !parsedData.gender) {
                alert("Error: Datos vacíos después de cargarlos");
            }

            setUserData(parsedData);
            } catch (error: any) {
                alert("Error al cargar los datos: " + error);
            }
        };
    
        loadUserData();
    }, []);

    // Función para verificar el código
    const handleVerifyCode = async () => {
        if (verificationCode.length !== CELL_COUNT) {
            alert("Código incompleto: " + "Por favor, ingresa el código completo.");
            return;
        }
    
        setIsVerifying(true);
    
        try {
            const requestData = { ...userData, verificationCode };
    
            const response = await fetch("http://localhost:5050/api/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestData)
            });
    
            const data = await response.json();
    
            if (response.ok) {
                alert("Éxito: " + "Código verificado correctamente.");
                setTimeout(async () => {
                    await handleLogin();
                }, 100);
            } else {
                alert("Error: " + data.message || "Error en la verificación del código");
                return;
            }
        } catch (error) {
            alert("Error: " + "No se pudo verificar el código.");
        } finally {
            setIsVerifying(false);
        }
    };

    // Función para reenviar el código
    const handleResendCode = async () => {
        setIsResending(true);
        setIsCooldown(true);

        try {
            // 🔹 Obtener el email almacenado en AsyncStorage
            const storedEmail = await AsyncStorage.getItem("emailRegistro");

            const response = await fetch("http://localhost:5050/api/resend-verification-token", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: storedEmail })
            });

            const data = await response.json();
            alert("Respuesta del servidor: " + JSON.stringify(data, null, 2));

            if (response.ok) {
                alert("Código reenviado: " + "Revisa tu correo para el nuevo código.");
            } else {
                alert("Error: " + data.message || "No se pudo reenviar el código.");
            }
        } catch (error) {
            alert("Error: " + "Ocurrió un problema al reenviar el código.");
        }

        setIsResending(false);
        setTimeout(() => {
            setIsCooldown(false);
        }, 15000);
    };

    // Función para iniciar sesión automáticamente después de verificar
    const handleLogin = async () => {

        try {
            // 🔹 Obtener el email almacenado en AsyncStorage
            const storedEmail = await AsyncStorage.getItem("emailRegistro");

            if (!storedEmail) {
                alert("Error: " + "No se pudo obtener el email.");
                return;
            }

            const response = await fetch("http://localhost:5050/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: storedEmail })
            });

            const data = await response.json();

            if (response.ok) {
                await AsyncStorage.setItem("session_token", data.session_token);

                alert("Inicio de sesión exitoso: " + "Bienvenido a Axis Go");
                
                if (router) {
                    router.push('/(tabs)/home');
                } else {
                    alert("Ocurrio un problema al navegar al home.");
                }
            } else {
                alert("Error: " + data.message || "No se pudo iniciar sesión.");
            }
        } catch (error) {
            alert("Error: " + "Ocurrió un problema al iniciar sesión.");
        }
    };

    const handleLogout = async () => {
        try {
            const token = await AsyncStorage.getItem('session_token');
            const response = await fetch("http://localhost:5050/api/logout", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
    
            if (response.ok) {
                await AsyncStorage.removeItem('session_token');
                router.push("../(tabs)/signup.tsx"); // Redirigir al login
            } else {
                alert("Error: " + "No se pudo cerrar sesión.");
            }
        } catch (error) {
            alert("Error: " + "Ocurrió un problema al cerrar sesión.");
        }
    };

    const handleCancelRegister = async () => {
        try {
            const storedEmail = await AsyncStorage.getItem("emailRegistro");
    
            if (!storedEmail) {
                alert("Error: " + "No se pudo obtener el email.");
                return;
            }
    
            const response = await axios.delete("http://localhost:5050/api/cancel-register", { data: { email: storedEmail } });
    
            if (response.status === 200) {
                Alert.alert("Registro cancelado", "El registro ha sido cancelado exitosamente.");
                router.back(); // Navegar hacia atrás solo si la cancelación fue exitosa
            } else {
                alert("Error: " + response.data.message || "No se pudo cancelar el registro.");
            }
        } catch (error: any) {
            if (error.response) {
                alert("Error: " + error.response.data.message || "Error al invalidar el token.");
            } else {
                alert("Error: " + "Ocurrió un problema al cancelar el registro.");
            }
        }
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.root}>
                <View style={{ flex: 1, width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                <Pressable
                    style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', cursor: 'pointer' }}
                    onPress={handleCancelRegister}
                >
                    <Image source={require('../../assets/icons/arrow.png')} />
                    <Text style={{ fontSize: 18, fontWeight: '700' }}>Cancelar</Text>
                </Pressable>
                </View>
                <View style={styles.picture}>
                    <Image
                        source={require('../../assets/images/secure.png')}
                        style={{ width: 250, height: 200, borderRadius: 100 }}
                    />
                </View>
                <View style={styles.code}>
                    <Text style={{ fontSize: 28, fontWeight: '800' }}>Código de verificación</Text>
                    <CodeField
                        ref={ref}
                        {...cellprops}
                        value={verificationCode}
                        onChangeText={setVerificationCode}
                        cellCount={CELL_COUNT}
                        rootStyle={styles.codeFieldRoot}
                        keyboardType="default"
                        textContentType="oneTimeCode"
                        autoComplete={Platform.select({ android: 'sms-otp', ios: 'one-time-code' }) as 'sms-otp' | 'one-time-code'}
                        InputComponent={TextInput}
                        testID="my-code-input"
                        renderCell={({ index, symbol, isFocused }) => (
                            <Text
                                key={index}
                                style={[styles.cell, isFocused && styles.focusCell]}
                                onLayout={getCellOnLayoutHandler(index)}>
                                {symbol || (isFocused ? <Cursor /> : null)}
                            </Text>
                        )}
                    />
                </View>
                <View style={styles.botones}>
                    <Pressable
                        style={styles.verificar}
                        onPress={handleVerifyCode}
                        disabled={isVerifying}
                    >
                        <Text style={{ color: '#fff', fontSize: 20, fontWeight: '700' }}>
                            {isVerifying ? "Verificando..." : "Verificar"}
                        </Text>
                    </Pressable>

                    <Pressable
                        style={{ marginVertical: 10 }}
                        onPress={handleResendCode}
                        disabled={isResending || isCooldown}
                    >
                        <Text style={styles.reenviar}>
                            {isResending ? "Reenviando..." : "Reenviar código"}
                        </Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({
    root: {
        flex: 1,
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    picture: {
        flex: 3,
        justifyContent: 'center',
        alignItems: 'center',
    },
    code: {
        width: '100%',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingVertical: 20,
        borderRadius: 20,
    },
    codeFieldRoot: {
        marginTop: 20
    },
    cell: {
        width: 40,
        height: 40,
        lineHeight: 38,
        fontSize: 24,
        borderWidth: 2,
        borderColor: '#00000066',
        borderRadius: 5,
        margin: 5,
        textAlign: 'center',
    },
    focusCell: {
        borderColor: '#000',
    },
    botones: {
        flex: 2,
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    verificar: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#900020',
        width: '90%',
        height: 50,
        marginVertical: 20,
        borderRadius: 10,
    },
    reenviar: {
        fontSize: 16,
        fontWeight: '600',
        color: '#900020',
    }
});

export default Verification;