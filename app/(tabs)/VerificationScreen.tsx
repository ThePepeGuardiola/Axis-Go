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

const CELL_COUNT = 7;

type VerificationScreenRouteProp = RouteProp<{ Verification: { email: string } }, 'Verification'>;
type VerificationScreenNavigationProp = StackNavigationProp<any>;

const Verification = ({ route }: { route: VerificationScreenRouteProp }) => {
    const navigation = useNavigation<StackNavigationProp<any>>();

    // Obtener el email del contexto
    var email:string = "";
    var password:string = "";
    var username:string = "";
    var birthdate:string = "";
    var phone:string = "";
    var country_code:string = "";
    var gender:string = "";

    // Accedemos al correo electrónico desde el contexto
    const [verificationCode, setVerificationCode] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [isResending, setIsResending] = useState(false);

    const ref = useBlurOnFulfill({ value: verificationCode, cellCount: CELL_COUNT });
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value: verificationCode,
        setValue: setVerificationCode,
    });

    const [userData, setUserData] = useState<{ [key: string]: string | null } | null>(null);

    if (!navigation) {
        console.error("❌ La prop navigation no está disponible.");
    }

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
            Alert.alert("Código incompleto", "Por favor, ingresa el código completo.");
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
                Alert.alert("Éxito", "Código verificado correctamente.");
                setTimeout(async () => {
                    await handleLogin();
                }, 100);
            } else {
                Alert.alert("Error", data.message || "Error en la verificación del código");
                return;
            }
        } catch (error) {
            console.error("❌ Error en la verificación:", error);
            Alert.alert("Error", "No se pudo verificar el código.");
        } finally {
            setIsVerifying(false);
        }
    };

    // Función para reenviar el código
    const handleResendCode = async () => {
        setIsResending(true);
        try {
            // 🔹 Obtener el email almacenado en AsyncStorage
            const storedEmail = await AsyncStorage.getItem("emailRegistro");

            const response = await fetch("http://localhost:5050/api/resend-verification-token", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: storedEmail })
            });

            const data = await response.json();
            Alert.alert("Respuesta del servidor", JSON.stringify(data, null, 2));

            if (response.ok) {
                Alert.alert("Código reenviado", "Revisa tu correo para el nuevo código.");
            } else {
                Alert.alert("Error", data.message || "No se pudo reenviar el código.");
            }
        } catch (error) {
            Alert.alert("Error", "Ocurrió un problema al reenviar el código.");
        }
        setIsResending(false);
    };

    // Función para iniciar sesión automáticamente después de verificar
    const handleLogin = async () => {

    try {
        // 🔹 Obtener el email almacenado en AsyncStorage
        const storedEmail = await AsyncStorage.getItem("emailRegistro");

        if (!storedEmail) {
            console.error("❌ Email no definido en handleLogin");
            Alert.alert("Error", "No se pudo obtener el email.");
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

            Alert.alert("Inicio de sesión exitoso", "Bienvenido a Axis Go");
            
            if (navigation) {
                navigation.navigate('(tabs)/home');
            } else {
                console.error("❌ navigation no está definido.");
            }
        } else {
            console.error("❌ Error en login:", data.message);
            Alert.alert("Error", data.message || "No se pudo iniciar sesión.");
        }
    } catch (error) {
        console.error("❌ Error en handleLogin:", error);
        Alert.alert("Error", "Ocurrió un problema al iniciar sesión.");
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
                navigation.replace("Login"); // Redirigir al login
            } else {
                Alert.alert("Error", "No se pudo cerrar sesión.");
            }
        } catch (error) {
            Alert.alert("Error", "Ocurrió un problema al cerrar sesión.");
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