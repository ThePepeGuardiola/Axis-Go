import React from 'react';
import { Svg, G, Rect, Circle, Defs, ClipPath } from 'react-native-svg';
import { StyleSheet, View } from 'react-native';

const Background = () => {
    return (
        <View style={styles.container}>
            <Svg height="100%" width="100%" viewBox="0 0 390 844" fill="none" style={styles.svgBackground}>
                <G clipPath="url(#clip0_116_166)">
                    <Rect width="390" height="844" fill="white" />
                    <Rect x="-216.796" y="602.149" width="370" height="370" transform="rotate(16.0111 -216.796 602.149)" stroke="#F1F4FF" strokeWidth="2" />
                    <Rect x="-281" y="641" width="370" height="370" stroke="#F1F4FF" strokeWidth="2" />
                    <Circle cx="271" cy="77" r="246.5" stroke="#F8F9FF" strokeWidth="3" />
                    <Circle cx="431.5" cy="-38.5" r="317.5" fill="#FFC3D0" fillOpacity="0.75" />
                </G>
                <Defs>
                    <ClipPath id="clip0_116_166">
                        <Rect width="460" height="844" fill="white" />
                    </ClipPath>
                </Defs>
            </Svg>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
    },
    svgBackground: {
        flex: 1,
    },
});

export default Background;