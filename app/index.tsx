import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import SignupHeader from "./components/signupHeader";
import SignupForm from "./components/sigunpForm";
import Subtext from "./components/subtext";
import AccountJoiner from "./components/accountJoiner";

import Svg, { Circle, ClipPath, Defs, G, Rect } from 'react-native-svg';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    backgroundColor: '#fff',
  },
  svgBackground: {
    ...StyleSheet.absoluteFillObject,
  },
});

const MySvgComponent = () => (
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
);

export default function App() {
  return ( 
    <View style={styles.container}>
      <MySvgComponent />
      <View style={{height: 100, marginBottom: 40}}>
        <SignupHeader />
      </View>
      <ScrollView>
        <SignupForm />
        <Subtext />
        <AccountJoiner />
      </ScrollView>
    </View>
  );
}
