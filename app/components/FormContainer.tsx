import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';

interface FormContainerProps {
    children: ReactNode;
}

const FormContainer: React.FC<FormContainerProps> = ({ children }) => {
    return (
        <KeyboardAvoidingView enabled behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
            {children}
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        width: Dimensions.get('window').width
    }
});

export default FormContainer;