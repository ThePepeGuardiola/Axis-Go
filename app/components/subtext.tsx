import React from "react";
import { View, Text, StyleSheet } from "react-native";

const Subtext = () => {
    return (
        <View style={styles.container}>
            <Text style={{fontSize: 14, fontWeight: 'bold', color: '#494949', paddingBottom: 40}}>Already have an account</Text>
            <Text style={{fontSize: 14, fontWeight: 'bold', color: '#900020'}}>Or continue with</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 60
    },
});

export default Subtext;