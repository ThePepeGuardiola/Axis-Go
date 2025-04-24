import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Pressable, Platform, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';
import IconInput from '@/components/IconInput';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const data = [
    { label: '+1', value: '+1' },
    { label: '+52', value: '+52' },
    { label: '+55', value: '+55' },
    { label: '+54', value: '+54' },
    { label: '+56', value: '+56' },
    { label: '+57', value: '+57' },
    { label: '+34', value: '+34' },
    { label: '+33', value: '+33' },
];

const data_1 = [
    { label: 'Masculino', value: 'Masculino' },
    { label: 'Femenino', value: 'Femenino' },
    { label: 'Otro', value: 'Otro' },
];

const ProfileScreen = () => {
    const navigation = useNavigation();
    const DEFAULT_IMAGE = require('../../assets/images/user-icon.png');
    interface Profile {
        username: string;
        email: string;
        birthdate: string;
        phone: string;
        gender: string;
        country_code: string;
    }

    const [profile, setProfile] = useState<Profile>({
        username: '',
        email: '',
        birthdate: '',
        phone: '',
        gender: '',
        country_code: '',
    });

    // Estados del perfil de usuario
    const [profileImage, setProfileImage] = useState({ uri: DEFAULT_IMAGE });
    const [isUploadingImage, setIsUploadingImage] = useState(false);

    //Botones
    const [isPressed1, setIsPressed1] = useState(false);
    const [isPressed2, setIsPressed2] = useState(false);

    // Estado de carga
    const [loading, setLoading] = useState(true);

    // Token de sesion
    const [token, setToken] = useState<string | null>(null);
    
    // Estado de perfil
    const [profileData, setProfileData] = useState<any>(null);

    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    alert('Permiso requerido para acceder a las imágenes');
                }
            }
        })();
    }, []);

    const uploadImage = async (imageUri: string): Promise<void> => {
        if (!token) return;
        if (Platform.OS === 'web') return;
    
        setIsUploadingImage(true);
    
        if (!imageUri) {
            alert('No hay imagen para subir.');
            return;
        }
        
        const localUri = imageUri;
        const filename = localUri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename ?? '');
        const type = match ? `image/${match[1]}` : `image`;

        console.log("📸 URI seleccionada:", imageUri);

        const formData = new FormData();
        formData.append('image', {
            uri: localUri,
            name: filename ?? 'profile.jpg',
            type: type,
        } as any );

        try {
        const res = await fetch('http://localhost:5050/api/user-profile/upload-image', {
            method: 'POST',
            body: formData,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || 'Error subiendo imagen');
        }

        if (data.imageUrl) {
            setProfileImage({ uri: data.imageUrl });
            console.log('✅ Imagen subida correctamente');
        }

        await axios.put(
            'http://localhost:5050/api/user-profile/image-url', { imageUrl: data.imageUrl },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        
        console.log('✅ Imagen subida y URL actualizada en la base de datos');

        } catch (err: any) {
            alert('Error subiendo la imagen: ' + err.message);
            console.error('Error subiendo la imagen:', err);
        } finally {
            setIsUploadingImage(false);
        }
    };

    const pickImage = async () => {
        if (Platform.OS === 'web') {
            // Crear input dinámicamente en web
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = async () => {
                const file = input.files?.[0];
                if (!file) return;
    
                const formData = new FormData();
                formData.append('image', file);
    
                try {
                    const res = await fetch('http://localhost:5050/api/user-profile/upload-image', {
                        method: 'POST',
                        body: formData,
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
    
                    const data = await res.json();
    
                    if (!res.ok) throw new Error(data.message || 'Error subiendo imagen');
    
                    if (data.imageUrl) {
                        setProfileImage({ uri: data.imageUrl });
                        console.log('✅ Imagen subida correctamente (Web)');
                    }
                } catch (err: any) {
                    alert('Error subiendo la imagen: ' + err.message);
                    console.error('Error subiendo la imagen (web):', err);
                }
            };
    
            input.click();
        } else {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            });
    
            if (result.assets && result.assets.length > 0) {
                uploadImage(result.assets[0].uri);
            }
        }
    };

    useEffect(() => {
        if (profileData?.profile_image_url) {
            setProfileImage({ uri: profileData.profile_image_url });
        }
    }, [profileData]);

    const renderItem = (item: { label: string; value: string }) => {
        return (
            <View style={styles.item}>
            <Text style={styles.textItem}>{item.label}</Text>
            {item.value === profile.country_code && (
                <AntDesign
                style={styles.icon}
                color="black"
                name="Safety"
                size={20}
                />
            )}
            </View>
        );
    };

    const renderItem_1 = (item: { label: string; value: string }) => {
        return (
            <View style={styles.item}>
            <Text style={styles.textItem}>{item.label}</Text>
            {item.value === profile.gender && (
                <AntDesign
                style={styles.icon}
                color="black"
                name="Safety"
                size={20}
                />
            )}
            </View>
        );
    };

    useEffect(() => {
        const loadToken = async () => {
            const storedToken = await AsyncStorage.getItem("session_token");

            if (!storedToken) {
                alert("No se encontró el token de sesión");
                console.error("No se encontró el token de sesión");
                return;
            }

            setToken(storedToken);
        };

        loadToken();
    }, []);

    useEffect(() => {
        if (!token) return;

        const fetchProfile = async () => {
            try {
                const res = await axios.get('http://localhost:5050/api/user-profile', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const profileData = res.data;

                const genderLabel = profileData.gender === 'Masculino' ? 'Masculino' : profileData.gender === 'Femenino' ? 'Femenino' : 'Otro';

                console.log(genderLabel);

                setProfile({
                    ...profileData,
                    gender: genderLabel,
                    country_code: profileData.country_code || '',
                });

                console.log('Perfil cargado:', res.data);

                setProfileImage(
                    profileData.image_url?.startsWith('http')
                        ? { uri: profileData.image_url }
                        : DEFAULT_IMAGE
                );

                setLoading(false);
            } catch (error: any) {
                alert('Error al cargar el perfil:' + error.message);
                console.error('Error al cargar el perfil:', error);
            }
        };

        fetchProfile();
    }, [token]);

    const handleSave = async () => {
        if (!token) return;

        if (!profile.username || !profile.birthdate || profile.gender === null) {
            alert('Por favor completa todos los campos obligatorios');
            return;
        }

        const parts = profile.birthdate.split('-');
        const isValidDate = parts.length === 3 && !isNaN(new Date(`${parts[2]}-${parts[1]}-${parts[0]}`).getTime());
        if (!isValidDate) {
            alert('Fecha inválida');
            return;
        }

        const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
        if (profile.phone && !phoneRegex.test(profile.phone)) {
            alert('Número inválido. Usa el formato XXX-XXX-XXXX');
            return;
        }

        const genderToString = profile.gender == 'Masculino' ? 'Masculino' : profile.gender == 'Femenino' ? 'Femenino' : 'Otro';

        if (!['Masculino', 'Femenino', 'Otro'].includes(profile.gender)) {
            alert('Selecciona un género válido');
            return;
        }

        try {
            // No hardcodess
            await axios.put('http://localhost:5050/api/user-profile', {
                username: profile.username,
                email: profile.email,
                birthdate: profile.birthdate,
                phone: profile.phone,
                gender: genderToString,
                country_code: profile.country_code,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        
        alert('Perfil actualizado correctamente');
        } catch (error) {
            console.error('Error al guardar el perfil:', error);
            alert('Hubo un problema al guardar los cambios');
        }
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', ...Platform.select({ web: {paddingHorizontal: 5}})}}>
                {loading ? <ActivityIndicator size="large" style={{marginTop: 20}} /> : (
                    <>
                        <View style={{ flex: 1, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                            <Pressable style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', cursor: 'pointer' }} onPress={() => navigation.goBack()}>
                                <Image source={require('../../assets/icons/arrow.png')} />
                                <Text style={{ fontSize: 18, fontWeight: 700 }}>Perfil</Text>
                            </Pressable>
                        </View>
                        <View style={{ flex: 4, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <Pressable onPress={pickImage}>
                                {isUploadingImage ? <ActivityIndicator size="large" /> : <Image style={{ width: 150, height: 150, borderRadius: 100 }} source={profileImage?.uri ? { uri: profileImage.uri } : DEFAULT_IMAGE} />}
                            </Pressable>
                        </View>
                        <View style={{ flex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', width: '100%', paddingHorizontal: 20 }}>
                            <IconInput
                                iconName="user"
                                placeholder="Usuario"
                                value={profile.username}
                                onChangeText={text => setProfile(prev => ({ ...prev, username: text }))}
                                verticalAlign='middle'
                                multiline={false} />

                            <IconInput
                                iconName="calendar"
                                placeholder="Fecha de nacimiento"
                                value={profile.birthdate}
                                onChangeText={text => setProfile(prev => ({ ...prev, birthdate: text }))}
                                keyboardType="numeric"
                                verticalAlign='middle'
                                multiline={false} />

                            <IconInput
                                iconName="mail"
                                placeholder="Correo electrónico"
                                value={profile.email}
                                editable={false}
                                keyboardType="email-address"
                                verticalAlign='middle'
                                multiline={false} />

                            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginVertical: 5, flexWrap: 'wrap' }}>
                                <View style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', marginVertical: 5, marginRight: 5, width: '45%' }}>
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
                                        placeholder="Código"
                                        searchPlaceholder="Search..."
                                        value={profile.country_code}
                                        onChange={item => setProfile(prev => ({ ...prev, country_code: item.value }))}
                                        renderLeftIcon={() => (
                                            <AntDesign style={styles.icon} color="black" name="enviromento" size={20} />
                                        )}
                                        renderItem={renderItem} />
                                </View>

                                <View style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', width: '50%' }}>
                                    <IconInput
                                        iconName='phone'
                                        placeholder='Número de tel.'
                                        value={profile.phone}
                                        onChangeText={text => setProfile(prev => ({ ...prev, phone: text }))}
                                        keyboardType='numeric'
                                        verticalAlign='middle'
                                        multiline={false} />
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
                                value={profile.gender}
                                onChange={item => setProfile(prev => ({ ...prev, gender: item.value }))}
                                renderLeftIcon={() => (
                                    <AntDesign style={styles.icon} color="black" name={profile.gender === "Masculino" ? "man" : profile.gender === "Femenino" ? "woman" : "question"} size={18} />
                                )}
                                renderItem={renderItem_1} />

                            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginVertical: 10, flexWrap: 'wrap' }}>
                                <Pressable
                                    style={isPressed1 ? styles.buttonPressed : styles.button}
                                    onPressIn={() => setIsPressed1(true)}
                                    onPressOut={() => setIsPressed1(false)}
                                    hitSlop={20}
                                    pressRetentionOffset={{ top: 10, left: 10, right: 10, bottom: 10 }}
                                >
                                    <Image source={require('../../assets/icons/wallet.png')} />
                                    <Text style={{ color: 'white', textAlign: 'center', fontSize: 16, fontWeight: 700, marginHorizontal: 10 }}>Cartera</Text>
                                </Pressable>

                                <Pressable
                                    disabled={isUploadingImage || loading}
                                    style={isPressed2 ? styles.buttonPressed : styles.button}
                                    onPressIn={() => setIsPressed2(true)}
                                    onPressOut={() => setIsPressed2(false)}
                                    onPress={handleSave}
                                    hitSlop={10}
                                    pressRetentionOffset={{ top: 10, left: 10, right: 10, bottom: 10 }}
                                >
                                    <Image source={require('../../assets/icons/time.png')} />
                                    <Text style={{ color: 'white', textAlign: 'center', fontSize: 16, fontWeight: 700, marginHorizontal: 10 }}>Guardar</Text>
                                </Pressable>
                            </View>
                        </View>
                    </>
                )}
            </SafeAreaView>
        </SafeAreaProvider>
    )
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
    }
});

export default ProfileScreen;