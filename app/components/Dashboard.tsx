import { router } from 'expo-router';
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import Svg, { Path } from 'react-native-svg';

//componente de bienvenida
export const Welcome = () => (
    <View style={styles.welcomeSection}>
            <Text style={styles.welcomeText}>Bienvenido de nuevo! 👋</Text>
    </View>
);

// Componente de clima y ubicación
export const WeatherSection = () => (
  <View style={styles.weatherSection}>
    <Text style={styles.temperature}>29°</Text>
    <Text style={styles.date}>2 DIC, 2024</Text>
    <Text style={styles.location}>
    <Svg width={11} height={12} viewBox="0 0 11 12" fill="none">
              <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10.7927 4.94299C10.7927 2.18157 8.55415 -0.0570068 5.79272 -0.0570068C3.0313 -0.0570068 0.792725 2.18157 0.792725 4.94299C0.792725 6.6288 1.69393 8.281 3.17975 9.84937C3.68922 10.3871 4.2336 10.8771 4.77814 11.3107C4.87358 11.3867 4.96571 11.4583 5.05397 11.5253L5.30662 11.7126L5.51537 11.859C5.68332 11.971 5.90213 11.971 6.07008 11.859L6.27883 11.7126L6.53148 11.5253C6.61974 11.4583 6.71187 11.3867 6.80731 11.3107C7.35185 10.8771 7.89623 10.3871 8.4057 9.84937C9.89152 8.281 10.7927 6.6288 10.7927 4.94299ZM1.79273 4.94299C1.79273 2.73386 3.58359 0.942994 5.79273 0.942994C8.00186 0.942994 9.79273 2.73386 9.79273 4.94299C9.79273 6.31969 9.00643 7.76124 7.67975 9.16162C7.20485 9.6629 6.69454 10.1222 6.18439 10.5284L6.05322 10.6317L5.96871 10.6969L5.79223 10.829L5.65807 10.7284C5.57604 10.6661 5.49019 10.5994 5.40106 10.5284C4.89091 10.1222 4.3806 9.6629 3.9057 9.16162C2.57902 7.76124 1.79273 6.31969 1.79273 4.94299ZM5.79273 2.943C6.8973 2.943 7.79273 3.83843 7.79273 4.943C7.79273 6.04756 6.8973 6.943 5.79273 6.943C4.68816 6.943 3.79273 6.04756 3.79273 4.943C3.79273 3.83843 4.68816 2.943 5.79273 2.943ZM4.79272 4.94299C4.79272 4.39071 5.24043 3.94299 5.79272 3.94299C6.345 3.94299 6.79272 4.39071 6.79272 4.94299C6.79272 5.49528 6.345 5.94299 5.79272 5.94299C5.24043 5.94299 4.79272 5.49528 4.79272 4.94299Z"
                fill="#8D8D8D"
              />
            </Svg>
      Santo Domingo, DN
    </Text>
    <Image source={require('../../assets/images/sun.png')} style={{ position: 'absolute', left: '85%' }} />
  </View>
);

// Componente de tarjeta de categoría
interface CategoryCardProps {
  title: string;
  subtitle: string;
  imageUri: string;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ title, subtitle, imageUri }) => (
  <View style={styles.categoryCard}>
    <Image source={{ uri: imageUri }} style={styles.categoryImage} />
    <Text style={styles.categoryTitle}>{title}</Text>
    <Text style={styles.categorySubtitle}>{subtitle}</Text>
  </View>
);

// Sección de categorías
export const Categories = () => (
  <View style={styles.categories}>
    <CategoryCard title="Groceries" subtitle="220 Locations" imageUri="https://centrocuestanacional.com/wp-content/uploads/2023/06/Foto-fachada-223-min-scaled-e1688052065911.jpg" />

    <CategoryCard title="Gym" subtitle="120 Locations" imageUri="https://resources.diariolibre.com/images/2024/03/14/smartfit-gano-us235-millones-en-2023-focus-min0.04-0.28-608-342.jpg" />
  </View>
);

// Sección de recientes
export const RecentSection = () => (
  <View style={styles.recentSection}>
    <View style={styles.recentHeader}>
      <Text style={styles.recentTitle}>Recientes</Text>
      <Text style={styles.seeAll}>Ver Todo</Text>
    </View>
    <View style={styles.recentItem}>
      <Text style={styles.itemTitle}>Supermercados</Text>
      <Text style={styles.itemSubtitle}>Jumbo, Av. Luperon - 1.7 Km</Text>
    </View>
    <View style={styles.recentItem}>
      <Text style={styles.itemTitle}>Gym</Text>
      <Text style={styles.itemSubtitle}>Smart fit, Núñez de caceres - 1.5 Km</Text>
    </View>
    <View style={styles.recentItem}>
      <Text style={styles.itemTitle}>Farmacias</Text>
      <Text style={styles.itemSubtitle}>GBC, Av. Republica de colombia - 3.5 Km</Text>
    </View>
  </View>
);

// Componente de botón de navegación
interface NavButtonProps {
  onPress: () => void;
  iconPath: string;
  width: number;
  height: number;
}

export const NavButton1: React.FC<NavButtonProps> = ({ onPress, iconPath, width, height }) => (
  <TouchableOpacity style={styles.navItem} onPress={onPress}>
    <Svg width={29} height={29} viewBox="0 0 29 29" fill="none">
            <Path
              d="M2.92542 14.8235L13.3723 4.37659C13.8849 3.86403 14.7159 3.86403 15.2285 4.37659L25.6754 14.8235M5.55042 12.1985V24.011C5.55042 24.7359 6.13804 25.3235 6.86292 25.3235H11.6754V19.636C11.6754 18.9111 12.263 18.3235 12.9879 18.3235H15.6129C16.3378 18.3235 16.9254 18.9111 16.9254 19.636V25.3235H21.7379C22.4628 25.3235 23.0504 24.7359 23.0504 24.011V12.1985M9.92542 25.3235H19.5504"
              stroke="black"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
  </TouchableOpacity>
);

export const NavButton2: React.FC<NavButtonProps> = ({ onPress, iconPath, width, height }) => (
  <TouchableOpacity style={styles.navItem} onPress={onPress}>
    <Svg width={29} height={29} viewBox="0 0 29 29" fill="none">
            <Path
              d="M13.6945 4.90534C13.9187 4.36637 14.6822 4.36637 14.9064 4.90534L17.3867 10.8687C17.4812 11.0959 17.6949 11.2512 17.9402 11.2708L24.3781 11.787C24.96 11.8336 25.1959 12.5598 24.7526 12.9395L19.8476 17.1412C19.6607 17.3013 19.5791 17.5525 19.6362 17.7919L21.1347 24.0742C21.2702 24.642 20.6525 25.0908 20.1543 24.7865L14.6425 21.42C14.4325 21.2917 14.1684 21.2917 13.9584 21.42L8.44659 24.7865C7.94843 25.0908 7.33074 24.642 7.46618 24.0742L8.96475 17.7919C9.02185 17.5525 8.94023 17.3013 8.75334 17.1412L3.84829 12.9395C3.40497 12.5598 3.64091 11.8336 4.22278 11.787L10.6607 11.2708C10.906 11.2512 11.1197 11.0959 11.2142 10.8687L13.6945 4.90534Z"
              stroke="black"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
  </TouchableOpacity>
);

export const NavButton3: React.FC<NavButtonProps> = ({ onPress, iconPath, width, height }) => (
  <TouchableOpacity style={styles.navItem} onPress={onPress}>
    <Svg width={29} height={29} viewBox="0 0 29 29" fill="none">
            <Path
              d="M25.4772 14.8235C25.4772 13.3738 24.3019 12.1985 22.8522 12.1985H18.4772C18.4772 14.1315 16.9102 15.6985 14.9772 15.6985C13.0442 15.6985 11.4772 14.1315 11.4772 12.1985H7.10217C5.65243 12.1985 4.47717 13.3738 4.47717 14.8235M25.4772 14.8235V21.8235C25.4772 23.2733 24.3019 24.4485 22.8522 24.4485H7.10217C5.65243 24.4485 4.47717 23.2733 4.47717 21.8235V14.8235M25.4772 14.8235V11.3235M4.47717 14.8235V11.3235M25.4772 11.3235C25.4772 9.87377 24.3019 8.69852 22.8522 8.69852H7.10217C5.65243 8.69852 4.47717 9.87377 4.47717 11.3235M25.4772 11.3235V7.82352C25.4772 6.37377 24.3019 5.19852 22.8522 5.19852H7.10217C5.65243 5.19852 4.47717 6.37377 4.47717 7.82352V11.3235"
              stroke="black"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
    iconPlaceholder: {
        padding: 10 
},
    welcomeSection: {
        padding: 20,
},
    welcomeText: {
        fontSize: 34, 
        fontWeight: 'bold', 
        marginVertical: 20
},

    weatherSection: {
        marginVertical: 20, 
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 20
},
    temperature: { 
        fontSize: 32, 
        fontWeight: 'bold' 
},
    date: { 
        fontSize: 16, 
        color: '#C7C7C7' 
},
    location: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        marginTop: 5 
},
    categoryCard: { 
        width: '45%', 
        padding: 10, 
        backgroundColor: '#fff', 
        borderRadius: 10, 
        alignItems: 'center' 
},
    categoryImage: { 
        width: '100%', 
        height: 170, 
        borderRadius: 10 
},
    categoryTitle: { 
        fontWeight: 'bold', 
        marginTop: 5 
},
    categorySubtitle: { 
        color: 'gray', 
        fontSize: 12 
},
    categories: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        marginVertical: 20 
},
    recentSection: { 
        padding: 20 
},
    recentHeader: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
},
    recentTitle: { 
        fontSize: 18, 
        fontWeight: '500',
        color: '#900020'
},
    seeAll: { 
        fontWeight: '500',
        color: '#900020' 
},
    recentItem: { 
        paddingVertical: 10 
},
    itemTitle: { 
        fontSize: 16, 
        fontWeight: 'bold' 
},
    itemSubtitle: { 
        color: 'gray' 
},
    navItem: { 
      alignItems: 'center', 
      justifyContent: 'center' 
    },
});

export default function Dashboard() {
  // ... existing component code ...
}