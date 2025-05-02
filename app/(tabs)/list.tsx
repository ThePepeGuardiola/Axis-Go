import { StatusBar } from "expo-status-bar";
import  FontAwesome from '@expo/vector-icons/FontAwesome';
import { StyleSheet, FlatList, View, Text } from "react-native";
import React, { useState, useEffect } from "react";
import * as Font from "expo-font";

// lista

const DATA = [
  {
    id: "1",
    category: "Supermercados",
    icon: "star",
    items1: ["Jumbo, Av. Luperon"],
    items2: ["1.7 Km"],
  },
  {
    id: "2",
    category: "Gym",
    icon: "star",
    items1: ["Smart fit, Nuñez de caceres"],
    items2: ["1.5 Km",],
  },
  {
    id: "2",
    category: "Gym",
    icon: "star",
    items1: ["Smart fit, Nuñez de caceres"],
    items2: ["1.5 Km",],
  },
  {
    id: "2",
    category: "Gym",
    icon: "star",
    items1: ["Smart fit, Nuñez de caceres"],
    items2: ["1.5 Km",],
  },
  {
    id: "2",
    category: "Gym",
    icon: "star",
    items1: ["Smart fit, Nuñez de caceres"],
    items2: ["1.5 Km",],
  },
  {
    id: "2",
    category: "Gym",
    icon: "star",
    items1: ["Smart fit, Nuñez de caceres"],
    items2: ["1.5 Km",],
  },
  {
    id: "2",
    category: "Gym",
    icon: "star",
    items1: ["Smart fit, Nuñez de caceres"],
    items2: ["1.5 Km",],
  },
  {
    id: "2",
    category: "Gym",
    icon: "star",
    items1: ["Smart fit, Nuñez de caceres"],
    items2: ["1.5 Km",],
  },
  {
    id: "2",
    category: "Gym",
    icon: "star",
    items1: ["Smart fit, Nuñez de caceres"],
    items2: ["1.5 Km",],
  },
  {
    id: "2",
    category: "Gym",
    icon: "star",
    items1: ["Smart fit, Nuñez de caceres"],
    items2: ["1.5 Km",],
  },
];

// Fuente del texto 

export default function App() {

  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        "Roboto-Regular": require("../../assets/fonts/Roboto-Regular.ttf"), 
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return <Text>Cargando fuentes...</Text>;
  }

  // Degradado del Background
    const gradientHeight = 700;
    const gradientBackground = "#FFC1CF";
    const data = Array.from({ length: gradientHeight }, (_, i) => i);
    return(
      
        <View style={styles.container}>
          
          {data.map((_, i) => (
          <View
            key={i}
            style={{
              position: "absolute",
              backgroundColor: gradientBackground,
              height: 5,
              top:  (gradientHeight - i - 1) ,
              right: 0,
              left: 0,
              opacity: (0.6 / gradientHeight) * (i + 1),
            }}
          />
        ))}
    
            <StatusBar style="auto"/>

            <Text style={styles.title}>Favoritos</Text>

            <FlatList

      data={DATA}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.listContainer}>

          {/* Icono */}

          <View style={styles.headerContainer}>
            <FontAwesome name={item.icon} size={23} color="#900020" style={styles.icon} />
            <Text style={styles.MainText}>{item.category}</Text>
          </View>

          {/* Contenedor de Sublistas */}

          <View style={styles.subListsContainer}>

            {/* Sublista 1 */}

            <FlatList
              data={item.items1}
              keyExtractor={(subItem, index) => subItem + index}
              renderItem={({ item: subItem }) => (
                <Text style={styles.subText}>{subItem}</Text>
              )}
            />

            {/* Sublista 2 */}

            <FlatList
              data={item.items2}
              keyExtractor={(subItem, index) => subItem + index}
              renderItem={({ item: subItem }) => (
                <Text style={styles.subText}>{subItem}</Text>
              )}
            />
          </View>
        </View>
      )}
    />
  </View>
)};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    overflow: 'hidden',
  },
  title: {
    marginLeft: 15,
    marginBottom: 10,
    marginTop: 20,
    fontSize: 28,
    color: '#3B3B3B',
    fontFamily: "Roboto-Regular",
  },

  listContainer: {
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 15,
  },

  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "30%",
  },

  icon: {
    marginRight: 20,
  },

  MainText: {
    fontSize: 18,
  },
  subListsContainer: {
    flexDirection: "row", 
    justifyContent: "space-between",
    width: "105%", 
  },
  subText: {
    fontSize: 15,
    color: '#8F8F8F',
    paddingVertical: 2,
    paddingHorizontal: 37,
  },
});