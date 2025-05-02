import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Pressable, Platform, ActivityIndicator, TextInput, Modal } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';
import IconInput from '@/components/IconInput';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { useAlert } from '../../context/AlertContext';

LocaleConfig.locales['es'] = {
    monthNames: [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ],
    monthNamesShort: ['Ene.', 'Feb.', 'Mar.', 'Abr.', 'May.', 'Jun.', 'Jul.', 'Ago.', 'Sep.', 'Oct.', 'Nov.', 'Dic.'],
    dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
    dayNamesShort: ['Dom.', 'Lun.', 'Mar.', 'Mié.', 'Jue.', 'Vie.', 'Sáb.'],
    today: 'Hoy'
};
LocaleConfig.defaultLocale = 'es';

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
    const { showAlert } = useAlert(); // Extract showAlert from the context
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

    const [profileImage, setProfileImage] = useState({ uri: DEFAULT_IMAGE });
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [isPressed1, setIsPressed1] = useState(false);
    const [isPressed2, setIsPressed2] = useState(false);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState<string | null>(null);
    const [profileData, setProfileData] = useState<any>(null);
    const [date, setDate] = useState(new Date());
    const [showCalendarModal, setShowCalendarModal] = useState(false);
    const [markedDates, setMarkedDates] = useState<{ [date: string]: any }>({});

    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    showAlert('','Permiso requerido para acceder a las imágenes', 'error');
                }
            }
        })();
    }, []);

    const uploadImage = async (imageUri: string): Promise<void> => {
        if (!token) return;
        if (Platform.OS === 'web') return;

        setIsUploadingImage(true);

        if (!imageUri) {
            showAlert('', 'No hay imagen para subir.','error');
            return;
        }

        const localUri = imageUri;
        const filename = localUri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename ?? '');
        const type = match ? `image/${match[1]}` : `image`;

        const formData = new FormData();
        formData.append('image', {
            uri: localUri,
            name: filename ?? 'profile.jpg',
            type: type,
        } as any);

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
                console.log('✅ Imagen subida correctamente', data.imageUrl);
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
            showAlert('','Error subiendo la imagen: ' + err.message,'error');
            console.error('Error subiendo la imagen:', err);
        } finally {
            setIsUploadingImage(false);
        }
    };

    const pickImage = async () => {
        if (Platform.OS === 'web') {
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
                        console.log('✅ Imagen subida correctamente (Web)', data.imageUrl);
                    }
                } catch (err: any) {
                    showAlert('','Error subiendo la imagen: ' + err.message,'error');
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
                showAlert("", "No se encontró el token de sesión", 'error');
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
            setLoading(true);
            try {
                const res = await axios.get('http://localhost:5050/api/user-profile', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const fetchedProfileData = res.data;
                setProfileData(fetchedProfileData);

                const genderLabel = fetchedProfileData.gender === 'Masculino' ? 'Masculino' :
                    fetchedProfileData.gender === 'Femenino' ? 'Femenino' : 'Otro';

                setProfile({
                    username: fetchedProfileData.username || '',
                    email: fetchedProfileData.email || '',
                    birthdate: fetchedProfileData.birthdate || '',
                    phone: fetchedProfileData.phone || '',
                    gender: genderLabel,
                    country_code: fetchedProfileData.country_code || '',
                });

                if (fetchedProfileData.birthdate) {
                    const parsedDate = new Date(fetchedProfileData.birthdate);
                    if (!isNaN(parsedDate.getTime())) {
                        setDate(parsedDate);

                        setMarkedDates({
                            [fetchedProfileData.birthdate]: {
                                selected: true,
                                selectedColor: '#900020',
                                selectedTextColor: 'white'
                            }
                        });
                    } else {
                        console.warn("Invalid birthdate format received:", fetchedProfileData.birthdate);
                        setDate(new Date());
                        setProfile(prev => ({ ...prev, birthdate: '' }));
                        setMarkedDates({});
                    }
                } else {
                    setDate(new Date());
                    setMarkedDates({});
                }

                setProfileImage(
                    fetchedProfileData.image_url?.startsWith('http')
                        ? { uri: fetchedProfileData.image_url }
                        : DEFAULT_IMAGE
                );

            } catch (error: any) {
                showAlert('', 'Error al cargar el perfil:' + error.message,'error');
                console.error('Error al cargar el perfil:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [token]);

    const formatDisplayDate = (dateString: string) => {
        if (!dateString) return '';

        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (dateRegex.test(dateString)) {
            return dateString;
        }

        return new Date(dateString).toLocaleDateString('en-CA');
    };

    const handleDateSelect = (day: any) => {
        console.log("📅 Fecha seleccionada:", day.dateString);
        const selectedDate = day.dateString;

        setProfile(prev => ({ ...prev, birthdate: selectedDate }));
        setDate(new Date(selectedDate));

        setMarkedDates({
            [selectedDate]: {
                selected: true,
                selectedColor: '#900020',
                selectedTextColor: 'white'
            }
        });

        setTimeout(() => setShowCalendarModal(false), 300);
    };

    const openCalendar = () => {
        setShowCalendarModal(true);
    };

    const handleSave = async () => {
        if (!token) return;

        const birthdateToSend = profile.birthdate;

        if (!profile.username || !birthdateToSend || !profile.gender) {
            showAlert('', 'Por favor completa todos los campos obligatorios (Usuario, Fecha de Nacimiento, Género)', 'error');
            return;
        }

        const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
        if (profile.phone && !phoneRegex.test(profile.phone)) {
            showAlert('', 'Número inválido. Usa el formato XXX-XXX-XXXX', 'error');
            return;
        }

        try {
            await axios.put('http://localhost:5050/api/user-profile', {
                username: profile.username,
                email: profile.email,
                birthdate: birthdateToSend,
                phone: profile.phone,
                gender: profile.gender,
                country_code: profile.country_code,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            showAlert('', 'Perfil actualizado correctamente', 'success');
        } catch (error: any) {
            console.error('Error al guardar el perfil:', error.response?.data || error.message || error);
            showAlert('', `Hubo un problema al guardar los cambios: ${error.response?.data?.message || error.message}`,'error');
        }
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', ...Platform.select({ web: { paddingHorizontal: 5 } }) }}>
                {loading ? <ActivityIndicator size="large" style={{ marginTop: 20 }} /> : (
                    <>
                        <View style={{ flex: 1, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                            <Pressable style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', cursor: 'pointer' }} onPress={() => router.back()}>
                                <Image source={require('../../assets/icons/arrow.png')} />
                                <Text style={{ fontSize: 18, fontWeight: 700 }}>Perfil</Text>
                            </Pressable>
                        </View>
                        <View style={{ flex: 4, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <Pressable onPress={pickImage}>
                                {isUploadingImage ? <ActivityIndicator size="large" /> : <Image style={{ width: 150, height: 150, borderRadius: 100 }} source={profileImage?.uri ? { uri: profileImage.uri + '?t=' + new Date() } : DEFAULT_IMAGE} />}
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

                            <Pressable onPress={openCalendar} style={styles.dateInput}>
                                <AntDesign name="calendar" size={20} color="#555" style={styles.icon} />
                                <Text style={[styles.dateText, !profile.birthdate && styles.placeholderStyle]}>
                                    {profile.birthdate ? formatDisplayDate(profile.birthdate) : 'Fecha de nacimiento'}
                                </Text>
                            </Pressable>

                            <Modal
                                animationType="fade"
                                transparent={true}
                                visible={showCalendarModal}
                                onRequestClose={() => setShowCalendarModal(false)}
                            >
                                <Pressable
                                    style={styles.modalOverlay}
                                    onPress={() => setShowCalendarModal(false)}
                                >
                                    <View style={styles.calendarModal}>
                                        <Pressable style={styles.calendarContainer} onPress={e => e.stopPropagation()}>
                                            <View style={styles.calendarHeader}>
                                                <Text style={styles.calendarTitle}>Selecciona tu Fecha de Nacimiento</Text>
                                                <Pressable onPress={() => setShowCalendarModal(false)} style={styles.closeButton}>
                                                    <AntDesign name="close" size={24} color="#333" />
                                                </Pressable>
                                            </View>
                                            <Calendar
                                                current={profile.birthdate || undefined}
                                                minDate="1900-01-01"
                                                maxDate={new Date().toISOString().split('T')[0]}
                                                onDayPress={handleDateSelect}
                                                markedDates={markedDates}
                                                style={styles.calendar}
                                                theme={{
                                                    backgroundColor: '#ffffff',
                                                    calendarBackground: '#ffffff',
                                                    textSectionTitleColor: '#333333',
                                                    textSectionTitleDisabledColor: '#d9e1e8',
                                                    selectedDayBackgroundColor: '#900020',
                                                    selectedDayTextColor: '#ffffff',
                                                    todayTextColor: '#900020',
                                                    dayTextColor: '#2d4150',
                                                    textDisabledColor: '#d9e1e8',
                                                    dotColor: '#900020',
                                                    selectedDotColor: '#ffffff',
                                                    arrowColor: '#900020',
                                                    disabledArrowColor: '#d9e1e8',
                                                    monthTextColor: '#333333',
                                                    indicatorColor: '#900020',
                                                    textDayFontWeight: '300',
                                                    textMonthFontWeight: 'bold',
                                                    textDayHeaderFontWeight: '600',
                                                    textDayFontSize: 16,
                                                    textMonthFontSize: 16,
                                                    textDayHeaderFontSize: 14
                                                }}
                                            />
                                            <View style={styles.calendarActions}>
                                                <Pressable
                                                    style={styles.calendarButton}
                                                    onPress={() => setShowCalendarModal(false)}
                                                >
                                                    <Text style={styles.calendarButtonText}>Cerrar</Text>
                                                </Pressable>
                                            </View>
                                        </Pressable>
                                    </View>
                                </Pressable>
                            </Modal>

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
                                maxHeight={300}
                                labelField="label"
                                valueField="value"
                                placeholder="Género"
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
        color: '#aaa'
    },
    selectedTextStyle: {
        fontSize: 16,
        color: '#333'
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
    dateInput: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 55,
        width: '100%',
        borderWidth: 1.5,
        borderColor: '#bebebe',
        backgroundColor: 'white',
        borderRadius: 12,
        paddingHorizontal: 15,
        marginVertical: 5,
    },
    dateText: {
        fontSize: 16,
        color: '#333',
        flex: 1,
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
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    calendarModal: {
        width: '100%',
        maxWidth: 500,
        borderRadius: 16,
        overflow: 'hidden',
    },
    calendarContainer: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 4,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.37,
        shadowRadius: 7.49,
        elevation: 12,
    },
    calendarHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    calendarTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    closeButton: {
        padding: 4,
    },
    calendar: {
        borderRadius: 10,
        overflow: 'hidden',
        marginTop: 4,
        marginBottom: 10,
    },
    calendarActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 12,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    calendarButton: {
        backgroundColor: '#900020',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    calendarButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    webDateInput: {
        flex: 1,
        height: '100%',
        borderWidth: 0,
        backgroundColor: 'transparent',
        fontSize: 16,
        color: '#333',
        outline: 'none',
        fontFamily: 'inherit',
    },
});

export default ProfileScreen;