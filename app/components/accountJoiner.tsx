import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';

const AccountJoiner = () => {
    return (
        <View style={styles.logoContainer}>
            <TouchableOpacity onPress={() => console.log('Google button pressed')}>
                <View style={[styles.logoWrapper]}>
                    <Image source={{ uri: 'https://loodibee.com/wp-content/uploads/Google-Symbol.png' }} style={styles.logo} />
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => console.log('Facebook button pressed')}>
                <View style={[styles.logoWrapper]}>
                    <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/2023_Facebook_icon.svg/480px-2023_Facebook_icon.svg.png' }} style={styles.logo} />
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => console.log('Apple button pressed')}>
                <View style={[styles.logoWrapper]}>
                    <Image source={{ uri: 'https://1000logos.net/wp-content/uploads/2017/02/Apple-Logosu.png' }} style={styles.logo} />
                </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    logoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: 20
    },
    logoWrapper: {
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#ECECEC',
    },
    logo: {
        width: 40,
        height: 40,
    },
});

export default AccountJoiner;