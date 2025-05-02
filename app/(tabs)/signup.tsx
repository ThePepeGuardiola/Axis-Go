import React from "react";
import { StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import CreateAccForm from "../components/CreateAccForm";
import Svg, { Circle, ClipPath, Defs, G, Rect } from "react-native-svg";

const MySvgComponent = () => (
  <Svg
    height="100%"
    width="100%"
    viewBox="0 0 390 844"
    fill="none"
    style={styles.background}
  >
    <G clipPath="url(#clip0_116_166)">
      <Rect width="390" height="844" fill="white" />
      <Rect
        x="-216.796"
        y="602.149"
        width="370"
        height="370"
        transform="rotate(16.0111 -216.796 602.149)"
        stroke="#F1F4FF"
        strokeWidth="2"
      />
      <Rect
        x="-281"
        y="641"
        width="370"
        height="370"
        stroke="#F1F4FF"
        strokeWidth="2"
      />
      <Circle cx="271" cy="77" r="246.5" stroke="#F8F9FF" strokeWidth="3" />
      <Circle
        cx="431.5"
        cy="-38.5"
        r="317.5"
        fill="#FFC3D0"
        fillOpacity="0.75"
      />
    </G>
    <Defs>
      <ClipPath id="clip0_116_166">
        <Rect width="460" height="844" fill="white" />
      </ClipPath>
    </Defs>
  </Svg>
);

export default function Signup(props: any) {
  return (
    <View style={styles.container}>
      <MySvgComponent />
      <CreateAccForm {...props} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
    backgroundColor: "#fff",
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
});
