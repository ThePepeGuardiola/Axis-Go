import React, { JSXElementConstructor, ReactElement, useState } from 'react';
import { View, Text, Image, StyleSheet, Pressable, Platform, GestureResponderEvent, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';
import IconInput from '../../components/IconInput';
import { router } from 'expo-router';
import { useAuth } from '../../context/Authcontext';

const data = [
    { label: '+1 (US)', value: 'Estados Unidos' },
    { label: '+1 (CA)', value: 'Canadá' },
    { label: '+52 (MX)', value: 'México' },
    { label: '+55 (BR)', value: 'Brasil' },
    { label: '+54 (AR)', value: 'Argentina' },
    { label: '+56 (CL)', value: 'Chile' },
    { label: '+57 (CO)', value: 'Colombia' },
    { label: '+34 (ESP)', value: 'España' },
    { label: '+33 (FR)', value: 'Francia' },
    { label: '+1 (RD)', value: 'República Dominicana' },
];

const data_1 = [
    { label: 'Hombre', value: true },
    { label: 'Mujer', value: false },
];

export default function PerfilUsuario() {
    const [value_1, setValue_1] = useState(null);
    const [value_2, setValue_2] = useState(null);
    const [profileImage, setProfileImage] = useState(require('../../assets/images/user-icon.png'));
    const [isPressed1, setIsPressed1] = useState(false);
    const [isPressed2, setIsPressed2] = useState(false);
    const { logout } = useAuth(); // Usar el hook de autenticación

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setProfileImage({ uri: result.assets[0].uri });
        }
    };

    // Función para renderizar los elementos del dropdown
    const renderItem = (item: any) => {
        return (
            <View style={styles.item}>
                <Text style={styles.textItem}>{item.label}</Text>
            </View>
        );
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', ...Platform.select({ web: {paddingHorizontal: 5}})}}>
                <View style={{flex: 1, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}}>
                    <Pressable style={{display: 'flex', flexDirection: 'row', alignItems: 'center', cursor: 'pointer'}}>
                        <Image source={require('../../assets/icons/arrow.png')} />
                        <Text style={{fontSize: 18, fontWeight: 700}}>Perfil</Text>
                    </Pressable>
                </View>

                <View style={{flex: 4, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                    <Pressable onPress={pickImage}>
                        <Image style={{width: 150, height: 150, borderRadius: 100}} source={profileImage}/>
                    </Pressable>
                </View>

                <View style={{flex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', width: '100%', paddingHorizontal: 20}}>
                    <IconInput
                        iconName="user"
                        placeholder="Usuario"
                        verticalAlign='middle'
                        multiline={false}
                    />

                    <IconInput
                        iconName="calendar"
                        placeholder="Fecha de nacimiento"
                        keyboardType="numeric"
                        verticalAlign='middle'
                        multiline={false}
                    />

                    <IconInput
                        iconName="mail"
                        placeholder="Correo electrónico"
                        keyboardType="email-address"
                        verticalAlign='middle'
                        multiline={false}
                    />

                    <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginVertical: 5, flexWrap: 'wrap'}}>
                        <View style={{display: 'flex', alignItems: 'flex-start', justifyContent: 'center', marginVertical: 5, marginRight: 5, width: '45%'}}>
                            <Dropdown
                                style={styles.dropdown}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                inputSearchStyle={styles.inputSearchStyle}
                                iconStyle={styles.iconStyle}
                                data={data}
                                search
                                maxHeight={300}
                                labelField="label"
                                valueField="value"
                                placeholder=""
                                searchPlaceholder="Search..."
                                value={value_1}
                                onChange={item => {
                                setValue_1(item.value);
                                }}
                                renderLeftIcon={() => (
                                <AntDesign style={styles.icon} color="black" name="enviromento" size={20} />
                                )}
                                renderItem={renderItem}
                            />
                        </View>

                        <View  style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'center', width: '50%'}}>
                            <IconInput
                                iconName='phone'
                                placeholder='Número de tel.'
                                keyboardType='numeric'
                                verticalAlign='middle'
                                multiline={false}
                            />
                        </View>
                    </View>
                    
                    <Dropdown
                        style={styles.dropdown_1}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        iconStyle={styles.iconStyle}
                        data={data_1}
                        search
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder="Género"
                        searchPlaceholder="Search..."
                        value={value_2}
                        onChange={item => {
                        setValue_2(item.value);
                        }}
                        renderLeftIcon={() => (
                        <AntDesign style={styles.icon} color="black" name={value_2 ? "man" : "woman"} size={18} />
                        )}
                        renderItem={renderItem}
                    />

                    <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginVertical: 10, flexWrap: 'wrap'}}>
                        <Pressable
                            style={isPressed1 ? styles.buttonPressed : styles.button}
                            onPressIn={() => setIsPressed1(true)}
                            onPressOut={() => setIsPressed1(false)}
                            hitSlop={20}
                            pressRetentionOffset={{top: 10, left: 10, right: 10, bottom: 10}}
                        >
                            <Image source={require('../../assets/icons/wallet.png')} />
                            <Text style={{color: 'white', textAlign: 'center', fontSize: 16, fontWeight: 700, marginHorizontal: 10}}>Cartera</Text>
                        </Pressable>

                        <Pressable 
                            style={isPressed2 ? styles.buttonPressed : styles.button}
                            onPressIn={() => setIsPressed2(true)}
                            onPressOut={() => setIsPressed2(false)}
                            hitSlop={10}
                            pressRetentionOffset={{top: 10, left: 10, right: 10, bottom: 10}}
                        >
                            <Image source={require('../../assets/icons/time.png')} />
                            <Text style={{color: 'white', textAlign: 'center', fontSize: 16, fontWeight: 700, marginHorizontal: 10}}>Recientes</Text>
                        </Pressable>

                        <Pressable 
                        style={styles.logoutButton}
                        onPress={logout} // Conectar el botón con la función logout
                        >
                            <Text style={{color: 'white', textAlign: 'center', fontSize: 16, fontWeight: 700, marginHorizontal: 10}}>Logout</Text>
                        </Pressable>
                    </View>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({
    dropdown: {
        height: 55,
        width: '100%',
        borderWidth: 1.5,
        borderColor: '#bebebe',
        backgroundColor: 'white',
        borderRadius: 12,
        paddingHorizontal: 15,
    },
    dropdown_1: {
        height: 55,
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 12,
        marginVertical: 5,
        paddingHorizontal: 15,
        borderWidth: 1.5,
        borderColor: '#bebebe',
    },
    icon: {
        marginRight: 10,
    },
    item: {
        padding: 17,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    textItem: {
        flex: 1,
        fontSize: 16,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
    button: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#900020',
        width: '45%',
        paddingVertical: 15,
        paddingHorizontal: 5,
        borderRadius: 10,
        marginVertical: 5
    },
    buttonPressed: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000000',
        width: '45%',
        paddingVertical: 15,
        paddingHorizontal: 5,
        borderRadius: 10,
        marginVertical: 5
    },
    logoutButton: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#900020',
        width: '100%',
        paddingVertical: 15,
        paddingHorizontal: 5,
        borderRadius: 10,
        marginVertical: 5
    },
    logoutButtonPressed: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000000',
        width: '100%',
        paddingVertical: 15,
        paddingHorizontal: 5,
        borderRadius: 10,
        marginVertical: 5
    }
});