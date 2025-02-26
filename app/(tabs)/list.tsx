import { StatusBar } from "expo-status-bar";
import  FontAwesome from '@expo/vector-icons/FontAwesome';
import { StyleSheet, SectionList, FlatList, View, Text } from "react-native";


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


export default function App() {
    return(
      
        <View style={styles.container}>

               <StatusBar style="auto"/>

               


            <Text style={styles.title}>Favoritos</Text>


            <FlatList
      data={DATA}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.rowContainer}>
          {/* Columna 1: Categoría con Icono */}
          <View style={styles.headerContainer}>
            <FontAwesome name={item.icon} size={23} color="#900020" style={styles.icon} />
            <Text style={styles.category}>{item.category}</Text>
          </View>

          {/* Contenedor de Sublistas */}
          <View style={styles.subListsContainer}>
            {/* Sublista 1 */}
            <FlatList
              data={item.items1}
              keyExtractor={(subItem, index) => subItem + index}
              renderItem={({ item: subItem }) => (
                <Text style={styles.subItem}>{subItem}</Text>
              )}
            />

            {/* Sublista 2 */}
            <FlatList
              data={item.items2}
              keyExtractor={(subItem, index) => subItem + index}
              renderItem={({ item: subItem }) => (
                <Text style={styles.subItem}>{subItem}</Text>
              )}
            />
          </View>
        </View>
      )}
    />
               
               
        </View>
        
 );
}

const styles = StyleSheet.create({
  
  container: {
    height: '100%',
    overflow: 'hidden',
    backgroundColor: '#FFC1CF',
},

title: {
  marginLeft: 15,
  marginBottom: 20,
  fontSize: 30,
  color: '#3B3B3B',
},

rowContainer: {
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

category: {
  fontSize: 18,
},
subListsContainer: {
  flexDirection: "row", 
  justifyContent: "space-between",
  width: "105%", 
},
subItem: {
  fontSize: 15,
  color: '#8F8F8F',
  paddingVertical: 2,
  paddingHorizontal: 37,
},

});

