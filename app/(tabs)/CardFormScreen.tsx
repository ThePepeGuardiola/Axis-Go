import React from "react";
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity } from "react-native";
import { BottomNav } from "../components/Dashboard_Footer";
import { router } from "expo-router";


const CreditCardInput = () => {
  return (
  <View style={styles.container}>
    <View style={styles.cardContainer}>
      <Image source={require('@/assets/images/Axis_logo.png')} style={styles.brand}/>

      <Text style={styles.label}>Card number</Text>
      <TextInput style={styles.input} placeholder="0000-0000-0000-0000" placeholderTextColor="#ccc" />

      <Text style={styles.label}>Card holder</Text>
      <TextInput style={styles.input} placeholder="e.g. Jabe Green" placeholderTextColor="#ccc" />

      <View style={styles.row}>
        <View style={styles.expiration}>
          <Text style={styles.label}>Expiration date</Text>
          <View style={styles.expiryRow}>
            <TextInput style={styles.expiryInput} placeholder="MM" placeholderTextColor="#ccc" />
            <TextInput style={styles.expiryInput} placeholder="YY" placeholderTextColor="#ccc" />
          </View>
        </View>
        <View style={styles.cvvContainer}>
          <Text style={styles.label}>CVV/CVC</Text>
          <TextInput style={styles.cvvInput} placeholder="***" placeholderTextColor="#ccc" secureTextEntry />
        </View>  
      </View>
      <TouchableOpacity style={styles.button} onPress={() => router.push('./metPago')}>
        <Text style={styles.buttonText} >Submit</Text>
      </TouchableOpacity>
    </View>
    <BottomNav />
  </View>
        
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#fff",
  },
  cardContainer: {
    backgroundImage: "linear-gradient(244.80deg, #900020 30%, #FF809D 90%)",
    padding: 20,
    borderRadius: 10,
    width: '85%',
  },
  brand: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    position: 'relative',
    left: '85%'
  },
  label: {
    color: "#fff",
    fontSize: 18,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.2)", // Soft transparent white
    borderRadius: 15, // Rounded edges
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 14,
    color: "white",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  expiration: {
    width: "50%",
  },
  expiryRow: {
    flexDirection: "row",
  },
  expiryInput: {
    backgroundColor: "rgba(255, 255, 255, 0.2)", // Soft transparent white
    borderRadius: 15, // Rounded edges
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginLeft: 5,
    fontSize: 14,
    color: "white",
    width: 60,
    alignItems:'center'
  },
  cvvContainer: {
    alignItems: "flex-end",
  },
  cvvInput: {
    backgroundColor: "rgba(255, 255, 255, 0.2)", // Soft transparent white
    borderRadius: 15, // Rounded edges
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 14,
    color: "white",
  },
  button: {
    backgroundColor: "rgba(255, 255, 255, 0.3)", // Soft transparent white
    borderRadius: 15,
    marginTop: 20,
    paddingVertical: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "rgba(255, 255, 255, 0.8)", // Slightly faded white
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default CreditCardInput;
