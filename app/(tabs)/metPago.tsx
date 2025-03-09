import React from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";
import { BottomNav } from "../components/Dashboard_Footer";
import { router } from "expo-router";
import Card from "../components/card";

const MetPago = () => {
  return (
    <View style={metPagoStyles.container}>
      <Pressable style={metPagoStyles.back} onPress={() => router.back()}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.835 3.86998L16.055 2.09998L6.16504 12L16.065 21.9L17.835 20.13L9.70504 12L17.835 3.86998Z" fill="#0B0B0B"/>
            </svg>
      </Pressable>

      <View style={metPagoStyles.content}>
        <Text style={metPagoStyles.title}>Payment Methods</Text>
        <Pressable>
                <Text style={metPagoStyles.add} onPress={() => {router.push('/CardFormScreen')}}>Add card</Text>
        </Pressable>
        <Card />
      </View>
      <BottomNav />
    </View>
  );
};

const metPagoStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  back: {
    padding: 20,
  },
  content: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  add: {
    fontWeight: "500",
    color: "#900020",
    marginBottom: 100,
  },
});

export default MetPago;
