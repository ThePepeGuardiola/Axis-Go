import React from "react";
import { TextInput, StyleSheet } from "react-native";

interface FormInputProps {
    placeholder: string;
}

const FormInput: React.FC<FormInputProps> = ({ placeholder }) => {
    return (
        <TextInput 
            placeholder={placeholder}
            placeholderTextColor="#626262"
            style={styles.input}
        />
    );
}

const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderColor: '#900020',
        backgroundColor: '#FFEEF1',
        height: 65,
        borderRadius: 10,
        fontSize: 16,
        paddingLeft: 10,
        marginBottom: 30
    }
});

export default FormInput;  