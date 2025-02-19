// app/homep.tsx
import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

// Componente principal de la pantalla de inicio
const HomeScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Barra superior con iconos y barra de búsqueda */}
      <View style={styles.topBar}>
        {/* Botón izquierdo con icono (por ejemplo, candado o menú) */}
        <TouchableOpacity style={styles.iconPlaceholder}>
          <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Path
              d="M15.75 10.5V6C15.75 3.92893 14.0711 2.25 12 2.25C9.92893 2.25 8.25 3.92893 8.25 6V10.5M19.606 8.50723L20.8692 20.5072C20.9391 21.1715 20.4183 21.75 19.7504 21.75H4.24963C3.58172 21.75 3.06089 21.1715 3.13081 20.5072L4.39397 8.50723C4.45424 7.93466 4.93706 7.5 5.51279 7.5H18.4872C19.0629 7.5 19.5458 7.93466 19.606 8.50723ZM8.625 10.5C8.625 10.7071 8.4571 10.875 8.25 10.875C8.04289 10.875 7.875 10.7071 7.875 10.5C7.875 10.2929 8.04289 10.125 8.25 10.125C8.4571 10.125 8.625 10.2929 8.625 10.5ZM16.125 10.5C16.125 10.7071 15.9571 10.875 15.75 10.875C15.5429 10.875 15.375 10.7071 15.375 10.5C15.375 10.2929 15.5429 10.125 15.75 10.125C15.9571 10.125 16.125 10.2929 16.125 10.5Z"
              stroke="black"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </TouchableOpacity>

        {/* Barra de búsqueda */}
        <TextInput style={styles.searchBar} placeholder="Search" />

        {/* Botón derecho con otro icono (por ejemplo, campana de notificaciones) */}
        <TouchableOpacity style={styles.iconPlaceholder}>
          <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Path
              d="M14.8569 17.0817C16.7514 16.857 18.5783 16.4116 20.3111 15.7719C18.8743 14.177 17.9998 12.0656 17.9998 9.75V9.04919C17.9999 9.03281 18 9.01641 18 9C18 5.68629 15.3137 3 12 3C8.68629 3 6 5.68629 6 9L5.9998 9.75C5.9998 12.0656 5.12527 14.177 3.68848 15.7719C5.4214 16.4116 7.24843 16.857 9.14314 17.0818M14.8569 17.0817C13.92 17.1928 12.9666 17.25 11.9998 17.25C11.0332 17.25 10.0799 17.1929 9.14314 17.0818M14.8569 17.0817C14.9498 17.3711 15 17.6797 15 18C15 19.6569 13.6569 21 12 21C10.3431 21 9 19.6569 9 18C9 17.6797 9.05019 17.3712 9.14314 17.0818"
              stroke="black"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </TouchableOpacity>
      </View>

      {/* Contenedor principal con scroll para el contenido de la pantalla */}
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Mensaje de bienvenida */}
        <Text style={styles.greeting}>Bienvenido de nuevo! 👋</Text>

        {/* Sección de clima, fecha y ubicación */}
        <View style={styles.weatherSection}>
          <Text style={styles.temperature}>29°</Text>
          <Text style={styles.date}>2 DIC, 2024</Text>

          {/* Ubicación con icono de localización */}
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

          {/* Imagen que representa el clima (sol) posicionada de forma absoluta */}
          <Image
            source={require('../../assets/images/sun.png')}
            style={{ position: 'absolute', left: '85%' }}
          />
        </View>

        {/* Sección de categorías */}
        <View style={styles.categories}>
          {/* Tarjeta para la categoría "Groceries" */}
          <View style={styles.categoryCard}>
            <Image
              source={{
                uri: 'https://centrocuestanacional.com/wp-content/uploads/2023/06/Foto-fachada-223-min-scaled-e1688052065911.jpg',
              }}
              style={styles.categoryImage}
            />
            <Text style={styles.categoryTitle}>Groceries</Text>
            <Text style={styles.categorySubtitle}>220 Locations</Text>
          </View>

          {/* Tarjeta para la categoría "Gym" */}
          <View style={styles.categoryCard}>
            <Image
              source={{
                uri: 'https://resources.diariolibre.com/images/2024/03/14/smartfit-gano-us235-millones-en-2023-focus-min0.04-0.28-608-342.jpg',
              }}
              style={styles.categoryImage}
            />
            <Text style={styles.categoryTitle}>Gym</Text>
            <Text style={styles.categorySubtitle}>120 Locations</Text>
          </View>
        </View>

        {/* Sección de "Recientes" */}
        <View style={styles.recentSection}>
          {/* Encabezado de la sección con título y opción "See All" */}
          <View style={styles.recentHeader}>
            <Text style={styles.recentTitle}>Recientes</Text>
            <Text style={styles.seeAll}>See All</Text>
          </View>

          {/* Elemento reciente: Supermercados */}
          <View style={styles.recentItem}>
            <Text style={styles.itemTitle}>Supermercados</Text>
            <Text style={styles.itemSubtitle}>
              Jumbo, Av. Luperon - 1.7 Km
            </Text>
          </View>
          {/* Elemento reciente: Gym */}
          <View style={styles.recentItem}>
            <Text style={styles.itemTitle}>Gym</Text>
            <Text style={styles.itemSubtitle}>
              Smart fit, Núñez de caceres - 1.5 Km
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Barra de navegación inferior */}
      <View style={styles.bottomNav}>
        {/* Primer botón de navegación (por ejemplo, inicio) */}
        <TouchableOpacity style={styles.navItem}>
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

        {/* Segundo botón de navegación (por ejemplo, favoritos) */}
        <TouchableOpacity style={styles.navItem}>
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

        {/* Tercer botón de navegación con imagen (por ejemplo, búsqueda avanzada) */}
        <TouchableOpacity style={styles.navItem}>
          <View>
            <Image
              source={require('../../assets/images/Search.png')}
              style={{
                position: 'relative',
                bottom: 30,
                width: 150,
                height: 150,
              }}
            />
          </View>
        </TouchableOpacity>

        {/* Cuarto botón de navegación (por ejemplo, notificaciones) */}
        <TouchableOpacity style={styles.navItem}>
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

        {/* Quinto botón de navegación: Perfil */}
        <TouchableOpacity style={styles.navItem}>
          <View style={styles.profile}>
            <Image
              source={require('../../assets/images/profilep.png')}
              style={{
                width: 30,
                height: 30,
                position: 'relative',
                top: 4,
                left: 4,
              }}
            />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

// Definición de estilos para el componente
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFC1CF',
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100,
  },
  topBar: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  iconPlaceholder: {
    padding: 8,
  },
  searchBar: {
    flex: 1,
    backgroundColor: '#EFEFEF',
    borderRadius: 8,
    marginHorizontal: 8,
    paddingHorizontal: 10,
    height: 40,
  },
  greeting: {
    fontSize: 34,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  weatherSection: {
    marginTop: 50,
    marginBottom: 40,
    padding: 20,
    borderRadius: 20,
    backgroundColor: '#fff',
  },
  temperature: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
  },
  date: {
    fontSize: 14,
    color: '#666',
    paddingTop: 5,
  },
  location: {
    fontSize: 14,
    color: '#666',
    paddingTop: 5,
  },
  categories: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  categoryImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  categorySubtitle: {
    fontSize: 14,
    color: '#666',
  },
  recentSection: {
    marginTop: 40,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  recentTitle: {
    fontSize: 18,
    fontWeight: '300',
  },
  profile: {
    flex: 1,
    backgroundColor: '#E8F2FE',
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  seeAll: {
    fontSize: 14,
    color: '#900020',
  },
  recentItem: {
    marginBottom: 10,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderTopWidth: 0.5,
    borderTopColor: '#ccc',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 60,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
