import { View, TextInput, StyleSheet, TextInputProps, Platform } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import React, { useState } from 'react';

interface IconInputProps extends TextInputProps {
    iconName: keyof typeof AntDesign.glyphMap;
    iconSize?: number;
    iconColor?: string;
}

const IconInput: React.FC<IconInputProps> = ({ iconName, iconSize = 20, iconColor = 'black', multiline=false, ...props }) => {
    const [isFocused, setIsFocused] = useState(false);
    
    return (
        <View style={styles.container}>
            <AntDesign name={iconName} size={iconSize} color={iconColor} style={styles.icon} />
            <TextInput
                style={isFocused ? styles.inputFocused : styles.input}
                {...props}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
            /> 
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#bebebe',
        borderRadius: 10,
        ...Platform.select({
            ios: {
                paddingVertical: 5,
            },
            android: {
                paddingVertical: 5,
            },
            web: {
                paddingVertical: 15,
            }
        }),
        paddingHorizontal: 15,
        marginVertical: 8,
        height: 55,
        maxHeight: 55,
        width: '100%',
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
        width: 0,
    },
    inputFocused: {
        flex: 1,
        fontSize: 16,
        borderWidth: 0,
        borderBlockColor: 'transparent',
        width: 0,
    },
});

export default IconInput;