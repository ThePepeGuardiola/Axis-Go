import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

export const LoadingScreen = () => (
    <View style={styles.container}>
        <ActivityIndicator size="large" color="#900020" />
    </View>
);

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
    },
});

export default LoadingScreen; 