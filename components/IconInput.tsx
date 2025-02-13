import { View, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import React, { useState } from 'react';

interface IconInputProps extends TextInputProps {
    iconName: keyof typeof AntDesign.glyphMap;
    iconSize?: number;
    iconColor?: string;
}

const IconInput: React.FC<IconInputProps> = ({ iconName, iconSize = 15, iconColor = 'black', ...props }) => {
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
        paddingVertical: 15,
        paddingHorizontal: 15,
        marginVertical: 5,
        width: '100%',
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
    },
    inputFocused: {
        flex: 1,
        fontSize: 16,
        borderWidth: 0,
        borderBlockColor: 'transparent',
    },
});

export default IconInput;