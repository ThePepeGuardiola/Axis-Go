import React from "react";
import { TouchableOpacity, Text, StyleSheet, Dimensions } from "react-native";

interface FormSubmitButtonProps {
    title: string;
    onPress: () => void;
}

const FormSubmitButton: React.FC<FormSubmitButtonProps> = ({ title, onPress }) => {
    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#900020',
        height: 60,
        borderRadius: 10,
        boxShadow: '0px 10px 20px #FFB0C1',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'semibold'
    }
});

export default FormSubmitButton;