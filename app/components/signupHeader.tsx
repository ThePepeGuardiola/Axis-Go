import React from "react";
import { View, Text, StyleSheet } from "react-native";

const SignupHeader = () => {
    return (
        <>
            <View style={styles.container}>
                <Text style={styles.heading}>Create account</Text>
                <Text style={styles.sudheading}>Crea una cuenta para que puedas explorar todas las rutas de transporte disponibles.</Text>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    heading: { 
        fontSize: 30, 
        fontWeight: 'bold', 
        color: '#900020' 
    },
    sudheading: {
        fontSize: 16, 
        textAlign: 'center', 
        paddingTop: 14,
        width: 330
    }
})

export default SignupHeader;