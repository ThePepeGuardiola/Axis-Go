import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Pressable, View, StyleSheet, Text, TextInput, Image, ImageBackground } from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import Background from '../../components/Background';

export default function Home() {

    //Input Focus
    
    const [isFocused, setIsFocused] = useState(false);
    const [isFocused_1, setIsFocused_1] = useState(false);

    //Pressable Focus

    const [onPressIn, OnpressOut] = useState(false);
    const [onPressIn_1, OnpressOut_1] = useState(false);
    const [onPressIn_2, OnpressOut_2] = useState(false);
    const [onPressIn_3, OnpressOut_3] = useState(false);
    const [onPressIn_4, OnpressOut_4] = useState(false);
    const [onPressIn_5, OnpressOut_5] = useState(false);
    const [onPressIn_6, OnpressOut_6] = useState(false);

    return (
        <SafeAreaProvider>
            <StatusBar style='auto'/>
            <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']} >
                <Background />
                <View style={{flex: 2 ,display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', width: '100%', height: 'auto'}} >
                    <Text style={styles.title}>Iniciar Sesión</Text>
                    <Text style={styles.text}>¡Bienvenido de nuevo, te hemos hechado de menos!</Text>
                </View>

                <View style={{flex: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'center', width: '100%'}} >
                    <TextInput style={isFocused ? styles.areaFocus : styles.area}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder='Correo Electrónico'
                    />

                    <TextInput style={isFocused_1 ? styles.areaFocus : styles.area}
                        onFocus={() => setIsFocused_1(true)}
                        onBlur={() => setIsFocused_1(false)}
                        placeholder='Contraseña'
                    />

                    <Pressable
                        style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', width: '100%'}}
                        onPressIn={() => OnpressOut(true)}
                        onPressOut={() => OnpressOut(false)}
                        hitSlop={5}
                        pressRetentionOffset={{top: 5, left: 5, bottom: 5, right: 5}}
                    >
                        <Text style={onPressIn ? styles.new : styles.textRed}>Olvidaste tu contraseña?</Text>
                    </Pressable>
                </View>
                            
                <View style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end'}} >
                    
                </View>

                <View style={{flex: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'center', width: '100%'}} >
                    <Pressable
                        style={onPressIn_1 ? styles.buttonActive : styles.button}
                        onPressIn={() => OnpressOut_1(true)}
                        onPressOut={() => OnpressOut_1(false)}
                        hitSlop={20}
                        pressRetentionOffset={{top: 20, left: 20, bottom: 20, right: 20}}
                    >
                        <Text style={{color: 'white', fontSize: 22, fontWeight: '700'}}>Iniciar</Text>
                    </Pressable>

                    <Pressable
                        onPressIn={() => OnpressOut_2(true)}
                        onPressOut={() => OnpressOut_2(false)}
                        hitSlop={5}
                        pressRetentionOffset={{top: 5, left: 5, bottom: 5, right: 5}}
                    >
                        <Text style={onPressIn_2 ? styles.textRed : styles.new}>Crear nueva cuenta</Text>
                    </Pressable>

                    <Pressable
                        onPressIn={() => OnpressOut_3(true)}
                        onPressOut={() => OnpressOut_3(false)}
                        hitSlop={5}
                        pressRetentionOffset={{top: 5, left: 5, bottom: 5, right: 5}}
                    >
                        <Text style={onPressIn_3 ? styles.new : styles.continue}>O continuar con</Text>
                    </Pressable>
                </View>

                <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                    <Pressable style={onPressIn_4 ? styles.imgFocus : styles.img}
                        onPressIn={() => OnpressOut_4(true)}
                        onPressOut={() => OnpressOut_4(false)}
                    >
                        <Image
                            source={require('../../assets/icons/google.png')}
                            style={{width: 40, height: 40, margin: 10}}
                        />
                    </Pressable>

                    <Pressable style={onPressIn_5 ? styles.imgFocus : styles.img}
                        onPressIn={() => OnpressOut_5(true)}
                        onPressOut={() => OnpressOut_5(false)}
                    >
                        <Image
                            source={require('../../assets/icons/facebook-ci.png')}
                            style={{width: 40, height: 40, margin: 10}}
                    />
                    </Pressable>

                    <Pressable style={onPressIn_6 ? styles.imgFocus : styles.img}
                        onPressIn={() => OnpressOut_6(true)}
                        onPressOut={() => OnpressOut_6(false)}
                    >
                        <Image
                            source={require('../../assets/icons/apple.png')}
                            style={{width: 40, height: 40, margin: 10}}
                        />
                    </Pressable>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
)}

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
        shadowColor: '#900020',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 15,
        fontSize: 25,
        borderRadius: 10
    },
    buttonActive: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        color: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 15,
        fontSize: 25,
        height: 60,
        fontWeight: '700',
        backgroundColor: '#000',
        borderRadius: 10
    },
    new: {
        color: 'gray',
        fontSize: 16,
        fontWeight: '600',
    },
    continue: {
        color: '#900020',
        fontSize: 16,
        fontWeight: '600',
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
    }
});
