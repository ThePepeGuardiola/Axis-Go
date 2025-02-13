import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';
import IconInput from '@/components/IconInput';

const data = [
    { label: '+1 (US)', value: 'Estados Unidos' },
    { label: '+1', value: 'Canadá' },
    { label: '+52', value: 'México' },
    { label: '+55', value: 'Brasil' },
    { label: '+54', value: 'Argentina' },
    { label: '+56', value: 'Chile' },
    { label: '+57', value: 'Colombia' },
    { label: '+34', value: 'España' },
    { label: '+33', value: 'Francia' },
    { label: '+1', value: 'República Dominicana' },
];

const data_1 = [
    { label: 'Hombre', value: 'm' },
    { label: 'Mujer', value: 'f' },
];

export default function PerfilUsuario() {
    const [value, setValue] = useState(null);

    //Botones

    const [isPressed1, setIsPressed1] = useState(false);
    const [isPressed2, setIsPressed2] = useState(false);

    const renderItem = (item: { label: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; value: null; }) => {
        return (
            <View style={styles.item}>
            <Text style={styles.textItem}>{item.label}</Text>
            {item.value === value && (
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

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingHorizontal: 10}}>
                <View style={{flex: 0, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}}>
                    <Pressable style={{display: 'flex', flexDirection: 'row', alignItems: 'center', cursor: 'pointer'}}>
                        <Image source={require('../../assets/icons/arrow.png')} />
                        <Text style={{fontSize: 18, fontWeight: 700}}>Perfil</Text>
                    </Pressable>
                </View>

                <View style={{flex: 1, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                    <Image style={{width: 150, height: 150}} source={require('../../assets/images/user-icon.png')}/>
                    {/* <Image style={{backgroundColor: '#900020', borderRadius: 13, position: 'absolute', top: 155 , left: 220, width: 35, height: 35}} source={require('../../assets/icons/pencil.png')}/> */}
                </View>

                <View style={{flex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', width: '100%', paddingHorizontal: 20}}>
                    <IconInput
                        iconName="user"
                        placeholder="Usuario"
                        verticalAlign='middle'
                    />

                    <IconInput
                        iconName="calendar"
                        placeholder="Fecha de nacimiento"
                        keyboardType="numeric"
                        verticalAlign='middle'
                    />

                    <IconInput
                        iconName="mail"
                        placeholder="Correo electrónico"
                        keyboardType="email-address"
                        verticalAlign='middle'
                    />

                    <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginVertical: 5, flexWrap: 'wrap'}}>
                        <View style={{display: 'flex', alignItems: 'flex-start', justifyContent: 'center', marginVertical: 5, marginRight: 5, width: '40%'}}>
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
                                value={value}
                                onChange={item => {
                                setValue(item.value);
                                }}
                                renderLeftIcon={() => (
                                <AntDesign style={styles.icon} color="black" name="Safety" size={20} />
                                )}
                                renderItem={renderItem}
                            />
                        </View>

                        <View  style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'center', marginVertical: 5, width: '55%'}}>
                            <IconInput
                                iconName='phone'
                                placeholder='Número de tel.'
                                keyboardType='numeric'
                                verticalAlign='middle'
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
                        value={value}
                        onChange={item => {
                        setValue(item.value);
                        }}
                        renderLeftIcon={() => (
                        <AntDesign style={styles.icon} color="black" name="Safety" size={20} />
                        )}
                        renderItem={renderItem}
                    />

                    <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginVertical: 5, flexWrap: 'wrap'}}>
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

                        <Pressable style={isPressed2 ? styles.buttonPressed : styles.button}
                            onPressIn={() => setIsPressed2(true)}
                            onPressOut={() => setIsPressed2(false)}
                            hitSlop={10}
                            pressRetentionOffset={{top: 10, left: 10, right: 10, bottom: 10}}
                        >
                            <Image source={require('../../assets/icons/time.png')} />
                            <Text style={{color: 'white', textAlign: 'center', fontSize: 16, fontWeight: 700, marginHorizontal: 10}}>Recientes</Text>
                        </Pressable>
                    </View>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    )
};

const styles = StyleSheet.create({
    dropdown: {
        height: 50,
        width: '100%',
        borderWidth: 1.5,
        borderColor: '#bebebe',
        backgroundColor: 'white',
        borderRadius: 12,
        paddingHorizontal: 20,
    },
    dropdown_1: {
        height: 50,
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 12,
        paddingHorizontal: 20,
        marginVertical: 5,
        borderWidth: 1.5,
        borderColor: '#bebebe',
    },
    icon: {
        marginRight: 5,
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