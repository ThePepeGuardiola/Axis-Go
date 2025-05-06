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
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useNavigation  } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAlert } from '../../context/AlertContext';
import { useAuth } from '../../context/Authcontext';

const CELL_COUNT = 7;

type VerificationScreenRouteProp = RouteProp<{ Verification: { email: string } }, 'Verification'>;
type VerificationScreenNavigationProp = StackNavigationProp<any>;

const Verification = ({ route }: { route: VerificationScreenRouteProp }) => {
    const { login, isProcessing } = useAuth();

    // Accedemos al correo electrónico desde el contexto
    const [verificationCode, setVerificationCode] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [isResending, setIsResending] = useState(false);

    const ref = useBlurOnFulfill({ value: verificationCode, cellCount: CELL_COUNT });
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value: verificationCode,
        setValue: setVerificationCode,
    });
    const { showAlert } = useAlert();

    const [userData, setUserData] = useState<{ [key: string]: string | null } | null>(null);

    useEffect(() => {
        const loadUserData = async () => {
            try {
            const storedData = await AsyncStorage.multiGet([
                "email",
                "password",
                "userName",
                "birthdate",
                "phone",
                "country_code",
                "gender",
            ]);
    
            const parsedData = Object.fromEntries(
                storedData.map(([key, value]) => [key, value])
            );
    
            if (!parsedData.email || !parsedData.userName || !parsedData.password || !parsedData.birthdate || !parsedData.gender) {
                console.error("❌ Error: Datos vacíos después de cargar desde AsyncStorage");
            }

            setUserData(parsedData);
            } catch (error) {
                console.error("❌ Error al cargar los datos de AsyncStorage:", error);
            }
        };
    
        loadUserData();
    }, []);

    // Función para verificar el código
    const handleVerifyCode = async () => {
        if (verificationCode.length !== CELL_COUNT) {
            showAlert("", "Por favor, ingresa el código completo.", "error");
            return;
        }

        if (!userData) {
            console.error("❌ No hay datos para enviar a /api/verify");
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
                showAlert("", "Código verificado correctamente.", "success");
                setTimeout(async () => {
                    await handleLogin();
                }, 100);
            } else {
                showAlert("", data.msg || "Error en la verificación del código", "error");
                return;
            }
        } catch (error) {
            console.error("❌ Error en la verificación:", error);
            showAlert("", "No se pudo verificar el código.", "error");
        } finally {
            setIsVerifying(false);
        }
    };

    // Función para reenviar el código
    const handleResendCode = async () => {
        setIsResending(true);
        try {
            // 🔹 Obtener el email almacenado en AsyncStorage
            const storedEmail = await AsyncStorage.getItem("email");

            const response = await fetch("http://localhost:5050/api/resend-verification-token", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: storedEmail })
            });

            const data = await response.json();

            if (response.ok) {
                showAlert("", "Revisa tu correo para el nuevo código.", "success");
            } else {
                showAlert("", data.message || "No se pudo reenviar el código.", "error");
            }
        } catch (error) {
            showAlert("", "Ocurrió un problema al reenviar el código.", "error");
        }
        setIsResending(false);
    };

    // Función para iniciar sesión automáticamente después de verificar
    const handleLogin = async () => {

    try {
        // 🔹 Obtener el email almacenado en AsyncStorage
        const storedEmail = await AsyncStorage.getItem("email");

        if (!storedEmail) {
            console.error("❌ Email no definido en handleLogin");
            showAlert("", "No se pudo obtener el email.", "error");
            return;
        }

        const response = await fetch("http://localhost:5050/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: storedEmail })
        });

        const data = await response.json();

        if (response.ok) {
            await AsyncStorage.setItem("userId", data.user_id);
            await login(data.session_token);

            showAlert("", "Inicio de sesión exitoso. Bienvenido a Axis Go", "success");
        } else {
            console.error("❌ Error en login:", data.message);
            showAlert("", data.message || "No se pudo iniciar sesión.", "error");
        }
    } catch (error) {
        console.error("❌ Error en handleLogin:", error);
        showAlert("Error", "Ocurrió un problema al iniciar sesión.");
    }
};

    return (
        <SafeAreaView style={styles.root}>
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
                    {...props}
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
                    disabled={isResending}
                >
                    <Text style={styles.reenviar}>
                        {isResending ? "Reenviando..." : "Reenviar código"}
                    </Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    root: {
        flex: 1,
        padding: 17,
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