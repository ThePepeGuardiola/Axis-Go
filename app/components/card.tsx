import React from "react";
import { View, Text, StyleSheet } from "react-native";

const Card = () => {
  return (
    <View style={styles.container}>
      <View style={[styles.card, styles.mainCard]}>
        <Text style={styles.balance}>$500.00</Text>
        <Text style={styles.label}>Metro</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  card: {
    width: 345,
    height: 210,
    borderRadius: 15,
    position: "absolute",
    justifyContent: "space-around",
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  mainCard: {
    backgroundColor: "#0A6D23",
  },
  balance: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  label: {
    fontSize: 16,
    color: "white",
    marginTop: 5,
  },
});

export default Card;
