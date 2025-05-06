import React, { useState, useEffect, useRef } from "react";
import { GoogleMap, LoadScriptNext, Marker, Polyline } from "@react-google-maps/api";
import { StyleSheet, View, Text, TouchableOpacity, Image, Animated, TextInput, ScrollView, Platform, ActivityIndicator } from "react-native";
import { router } from 'expo-router';
import axios from 'axios';
import * as Location from 'expo-location';

const libraries = ["geometry", "places"];

// Revert to the original API key configuration that was working before
const GOOGLE_MAPS_APIKEY = "AIzaSyC7mGVZuJBQoyjHxGDwoV3xtRbrhpADEX0";  // Replace with your actual API key

const API_BASE_URL = 'http://localhost:5050/api';

// Servicios de API
const api = {
  // Rutas y Direcciones
  fetchRoute: async (start, end) => {
    const response = await axios.post(`${API_BASE_URL}/fetchRoute`, { start, end });
    return response.data;
  },

  calculateRoutes: async (origin, destination) => {
    const response = await axios.get(`${API_BASE_URL}/routes/calculate`, {
      params: { origin, destination }
    });
    return response.data;
  },

  saveRoute: async (routeData) => {
    const response = await axios.post(`${API_BASE_URL}/routes/save`, routeData);
    return response.data;
  },

  // Estaciones y Transportes
  getNearbyStations: async (location) => {
    const response = await axios.get(`${API_BASE_URL}/stations`, {
      params: { lat: location.lat, lng: location.lng }
    });
    return response.data;
  },

  getTransportTypes: async () => {
    const response = await axios.get(`${API_BASE_URL}/transport/types`);
    return response.data;
  },

  getTransportSchedule: async (stationId, transportType) => {
    const response = await axios.get(`${API_BASE_URL}/transport/schedule`, {
      params: { stationId, transportType }
    });
    return response.data;
  },

  // Información en tiempo real
  getRealtimeInfo: async (routeId) => {
    const response = await axios.get(`${API_BASE_URL}/routes/realtime`, {
      params: { routeId }
    });
    return response.data;
  },

  // Rutas populares e historial
  getPopularRoutes: async () => {
    const response = await axios.get(`${API_BASE_URL}/routes/popular`);
    return response.data;
  },

  getMostUsedRoutes: async () => {
    const response = await axios.get(`${API_BASE_URL}/mostUsedRoutes`);
    return response.data;
  },

  getUserRouteHistory: async () => {
    const response = await axios.get(`${API_BASE_URL}/routes/history`);
    return response.data;
  }
};

axios.post('http://localhost:5050/api/fetchRoute', {
  start: 'Avenida John F. Kennedy Km. 5 1/2, SANTO ',
  end: 'Avenida Los Proceres #3, Santo Domingo, Distrito Nacional · < 1 km'
})
.then(response => {
  console.log('Datos recibidos:', response.data);
})
.catch(error => {
  console.error('Error en la petición:', error);
});

// keys

// Geocoding API
// Geolocation API
// Google Cloud APIs
// Google Maps for Fleet Routing
// Places API (New)
// Routes API
// Maps JavaScript API

const Toast = ({ message, visible, style }) => {
  if (!visible) return null;
  return (
    <View style={[styles.toast, style]}>
      <Text style={styles.toastText}>{message}</Text>
    </View>
  );
};

const AddressInput = ({ value, onChange, placeholder, editable }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);

  const fetchSuggestions = async (input) => {
    if (!input) {
      setSuggestions([]);
      return;
    }

    const endpoint = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      input
    )}&addressdetails=1&limit=5&countrycodes=DO`;
    try {
      const response = await fetch(endpoint);
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const handleSelect = (suggestion) => {
    onChange({
      address: suggestion.display_name,
      coordinates: { lat: parseFloat(suggestion.lat), lng: parseFloat(suggestion.lon) },
    });
    setSuggestions([]); 
    setIsFocused(false);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setIsFocused(false);
    }, 200);
  };

  return (
    <View style={{ marginBottom: 20 }}>
      <TextInput
        value={value?.address || ""} 
        onChangeText={(text) => {
          onChange({ address: text, coordinates: null }); 
          fetchSuggestions(text); 
        }}
        placeholder={placeholder}
        onFocus={() => setIsFocused(true)} 
        onBlur={handleBlur} 
        style={{
          borderWidth: 1,
          borderColor: "#ddd",
          padding: 10,
          borderRadius: 8,
          backgroundColor: "#f9f9f9",
          fontSize: 15,
          marginBottom: 1,
        }}
        editable={editable}
      />
      {isFocused && suggestions.length > 0 && (
        <View
          style={{
            backgroundColor: "white",
            borderRadius: 8,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 5,
            marginTop: 5,
          }}
        >
          {suggestions.map((suggestion, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleSelect(suggestion)}
              style={{
                padding: 15,
                borderBottomWidth: index === suggestions.length - 1 ? 0 : 1,
                borderColor: "#eee",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: "#900020",
                  marginRight: 10,
                }}
              />
              <Text style={{ fontSize: 16, color: "#333", flex: 1 }}>
                {suggestion.display_name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const RouteOption = ({ option, selected, onSelect }) => (
  <TouchableOpacity 
    style={[styles.routeOption, selected && styles.selectedRouteOption]}
    onPress={() => onSelect(option)}
  >
    <View style={styles.routeOptionContent}>
      <View style={styles.routeOptionLeft}>
        <Image
          source={option.icon}
          style={styles.transportIcon}
        />
        <View style={styles.routeDetails}>
          <Text style={styles.routeType}>{option.type}</Text>
          <Text style={styles.routeTime}>{option.time} • {option.distance}</Text>
        </View>
      </View>
      <Text style={styles.routePrice}>DOP {option.price}</Text>
    </View>
  </TouchableOpacity>
);

const getTransportTypeIcon = (type) => {
  if (!type) return require('../../assets/images/car.png');
  const t = type.toLowerCase();
  if (t.includes('metro') && t.includes('teleférico')) return require('../../assets/images/metroo.png');
  if (t.includes('metro') && t.includes('omsa')) return require('../../assets/images/metroo.png');
  if (t.includes('teleférico') && t.includes('omsa')) return require('../../assets/images/tele.png');
  if (t.includes('metro')) return require('../../assets/images/metroo.png');
  if (t.includes('omsa')) return require('../../assets/images/bus.png');
  if (t.includes('teleférico')) return require('../../assets/images/tele.png');
      return require('../../assets/images/car.png');
};

// Wrap the map component with error boundary
const MapComponent = ({ children, ...props }) => {
  if (!GOOGLE_MAPS_APIKEY) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: Google Maps API key is not configured</Text>
      </View>
    );
  }

  return (
    <LoadScriptNext
      googleMapsApiKey={GOOGLE_MAPS_APIKEY}
      libraries={libraries}
    >
      <GoogleMap {...props}>
        {children}
      </GoogleMap>
    </LoadScriptNext>
  );
};

const App = () => {
  const containerStyle = { 
    width: "100%", 
    height: "100vh"
  };
  const [center, setCenter] = useState({ lat: 18.4861, lng: -69.9312 });
  const [markers, setMarkers] = useState([]);
  const [route, setRoute] = useState([]);
  const [distance, setDistance] = useState(null);
  const [addressStart, setAddressStart] = useState({ address: "Obteniendo ubicación...", coordinates: null });
  const [addressEnd, setAddressEnd] = useState({ address: "", coordinates: null });
  const [showRouteOptions, setShowRouteOptions] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const mapRef = useRef();
  const [toast, setToast] = useState({ visible: false, message: '' });
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [isUsingCurrentLocation, setIsUsingCurrentLocation] = useState(true);

  // Nuevos estados para la información de la API
  const [transportTypes, setTransportTypes] = useState([]);
  const [availableRoutes, setAvailableRoutes] = useState([]);
  const [realtimeInfo, setRealtimeInfo] = useState(null);
  const [popularRoutes, setPopularRoutes] = useState([]);

  // Estaciones principales de Metro (ejemplo real de tu base)
  const METRO_STATIONS = [
    { name: "Centro de los Héroes", location: "Av Enrique Jiménez Moya, Santo Domingo" },
    { name: "Francisco Alberto Caamaño", location: "Av. Dr. Bernardo Correa y Cidrón, Santo Domingo" },
    { name: "Amín Abel", location: "Av. Dr. Bernardo Correa y Cidrón, Santo Domingo" },
    { name: "Joaquín Balaguer", location: "Av. Máximo Gómez, Santo Domingo" },
    { name: "Casandra Damirón", location: "F3CQ+G54 estacion casandra damiron, Santo Domingo" },
    { name: "Prof. Juan Bosch", location: "Av. Máximo Gómez, Santo Domingo" },
    { name: "Juan Pablo Duarte", location: "Av. Máximo Gómez, Santo Domingo" },
    { name: "Peña Battle", location: "Av. Máximo Gómez, Santo Domingo" },
    { name: "Pedro L. Cedeño", location: "Av. Máximo Gómez, Santo Domingo" },
    { name: "Los Taínos", location: "Av. Máximo Gómez, Santo Domingo" },
    { name: "Máximo Gómez", location: "Santo Domingo" },
    { name: "Hermanas Mirabal", location: "Av. Ecológica Prof. Juan Bosch, Santo Domingo" },
    { name: "José Francisco Peña Gómez", location: "Av. Hermanas Mirabal, Santo Domingo" },
    { name: "Gregorio Luperón", location: "Santo Domingo" },
    { name: "Gregorio Urbano Gilbert", location: "Avenida Hermanas Mirabal, Santo Domingo" },
    { name: "Mamá Tingó", location: "Av. Hermanas Mirabal, Santo Domingo" }
  ];

  // Paradas principales de OMSA (usando algunos puntos de tu base de datos)
  const OMSA_STOPS = [
    { name: "Terminal de OMSA", location: "Av. Jacobo Majluta" },
    { name: "Antiguo Control OMSA", location: "Av. Jacobo Majluta" },
    { name: "Después Av. Hermanas Mirabal (Frente Hiper Olé)", location: "Av. Jacobo Majluta" },
    { name: "Frente Templo MITA", location: "Av. Jacobo Majluta" },
    { name: "Frente Planta Marañón Colgate & Palmolive", location: "Av. Jacobo Majluta" },
    { name: "Frente entrada Brisas de los Palmares esq. C/22", location: "Av. Jacobo Majluta" },
    { name: "Después C/ Peatón Manuel de Js. Galván (Debajo Puente Peatonal)", location: "Av. Jacobo Majluta" },
    { name: "Después Carretera La Victoria, Cruce Sabana Perdida", location: "Av. Prol. Av. Charles de Gaulle" },
    { name: "Antes del Puente Rio Ozama", location: "Av. Prol. Av. Charles de Gaulle" },
    { name: "Frente Multicentro La Sirena", location: "Av. Prol. Av. Charles de Gaulle" },
    { name: "Después Carretera Mella y Antes C/ Marcos Rojas (Frente a Shoes)", location: "Av. Charles de Gaulle" },
    { name: "Antes Av. Simón Orozco (Frente Presidente Sport)", location: "Av. Charles de Gaulle" },
    { name: "Después Av. Simón Orozco (Al lado Payano Sandwich)", location: "Av. Charles de Gaulle" },
    { name: "Antes Cruce Carretera Medoza (Frente SermerCarro)", location: "Av. Charles de Gaulle" },
    { name: "Después Carretera Mendoza (Frente GIMAM)", location: "Av. Charles de Gaulle" },
    { name: "Antes Cruce Autopista San Isidro (Frente Cervecería Nacional Dominicana)", location: "Av. Charles de Gaulle" },
    { name: "Después Cruce Autopista San Isidro (Frente Pescadería Restaurant Segura)", location: "Av. Charles de Gaulle" },
    { name: "Antes Av. Ecológica, después entrada de Franconia", location: "Av. Charles de Gaulle" },
    { name: "Debajo del Puente Juan Carlos", location: "Aut. Las Américas" },
    { name: "Frente Alcantara Carga Express", location: "Aut. Las Américas" },
    { name: "Antes de entrada a Av. del Hipódromo V Centenario", location: "Aut. Las Américas" },
    { name: "Av. Entrada al Hipódromo", location: "Av. Entrada al Hipódromo V Centenario" },
    { name: "Terminal de OMSA (final)", location: "Av. Entrada al Hipódromo V Centenario" }
  ];

  // Estaciones principales de Teleférico (ejemplo real de tu base)
  const TELEFERICO_STATIONS = [
    { name: "Gualey (T1)", location: "G438+WJ4, Av. Padre Castellanos, Santo Domingo" },
    { name: "Tres Brazos (T2)", location: "Av. Pdte. Hugo Chávez 29, Santo Domingo Este" },
    { name: "Sabana Perdida (T3)", location: "Calle Principal, Santo Domingo" },
    { name: "Cruce Charles de Gaulle (T4)", location: "Av. Charles de Gaulle, Santo Domingo" }
  ];

  const TRANSPORT_PRICES = {
    Metro: 20,
    OMSA: 15,
    Teleferico: 20
  };

  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'web') {
        // Para navegadores web
        if ('geolocation' in navigator) {
          const permissionStatus = await navigator.permissions.query({ name: 'geolocation' });
          
          if (permissionStatus.state === 'denied') {
            showToast('Por favor habilita los permisos de ubicación en tu navegador');
            setLocationError('Permisos denegados');
            // Mostrar ubicación por defecto
            setAddressStart({
              address: "Santo Domingo, República Dominicana",
              coordinates: { lat: 18.4861, lng: -69.9312 }
            });
            return false;
          }
        } else {
          showToast('Tu navegador no soporta geolocalización');
          return false;
        }
      } else {
        // Para dispositivos móviles
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          showToast('Se requieren permisos de ubicación para una mejor experiencia');
          setLocationError('Permisos denegados');
          return false;
        }
      }
      return true;
    } catch (error) {
      console.error('Error al solicitar permisos:', error);
      return false;
    }
  };

  const getCurrentLocation = async () => {
    try {
      setAddressStart({ 
        ...addressStart, 
        address: "Obteniendo ubicación..." 
      });

      let location;
      if (Platform.OS === 'web') {
        // Para navegadores web
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          });
        });
        
        location = {
          coords: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }
        };
      } else {
        // Para dispositivos móviles
        location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High
        });
      }

      const currentLocation = {
        lat: location.coords.latitude,
        lng: location.coords.longitude
      };

      setCenter(currentLocation);
      setMarkers(prevMarkers => [currentLocation, ...(prevMarkers.slice(1))]);

      // Obtener dirección
      try {
        let address;
        if (Platform.OS === 'web') {
          // Usar Google Geocoding API para web
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${currentLocation.lat},${currentLocation.lng}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_APIKEY}`
          );
          const data = await response.json();
          if (data.results && data.results.length > 0) {
            address = data.results[0].formatted_address;
          }
        } else {
          // Usar Expo Location para móviles
          const response = await Location.reverseGeocodeAsync({
            latitude: currentLocation.lat,
            longitude: currentLocation.lng,
          });
          if (response && response.length > 0) {
            const addr = response[0];
            address = `${addr.street || ''} ${addr.name || ''}, ${addr.district || ''} ${addr.city || ''}, ${addr.region || ''}`.trim();
          }
        }

        setAddressStart({
          address: address || "Ubicación actual",
          coordinates: currentLocation
        });
      } catch (error) {
        console.error('Error en geocoding:', error);
        setAddressStart({
          address: "Ubicación actual",
          coordinates: currentLocation
        });
      }
    } catch (error) {
      console.error('Error al obtener ubicación:', error);
      handleLocationError(error);
    }
  };

  const handleLocationError = (error) => {
    let message = 'Error al obtener la ubicación';
    
    if (error.code === 1) {
      message = 'Por favor habilita los permisos de ubicación en la configuración de tu navegador';
    } else if (error.code === 2) {
      message = 'No se pudo obtener la ubicación. Verifica tu conexión';
    } else if (error.code === 3) {
      message = 'Tiempo de espera agotado al obtener la ubicación';
    }
    
    showToast(message);
    setLocationError(message);
    
    // Establecer ubicación por defecto
    setAddressStart({
      address: "Santo Domingo, República Dominicana",
      coordinates: { lat: 18.4861, lng: -69.9312 }
    });
  };

  useEffect(() => {
    const initializeLocation = async () => {
      const hasPermission = await requestLocationPermission();
      if (hasPermission) {
        await getCurrentLocation();
      }
    };

    initializeLocation();
  }, []);

  const updateCurrentLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (hasPermission) {
      await getCurrentLocation();
    }
  };

  function findClosestStation(address, stations) {
    if (!address) return stations[0];
    const lower = address.toLowerCase();
    let found = stations.find(s => lower.includes(s.name.toLowerCase()) || lower.includes(s.location.toLowerCase()));
    if (found) return found;
    return stations[0];
  }

  const handleSearchRoute = async () => {
    if (!addressStart.address || !addressEnd.address) {
      showToast("Por favor, ingresa ambas direcciones");
      return;
    }
    setIsLoading(true);
    try {
      // Metro
      const metroStart = findClosestStation(addressStart.address, METRO_STATIONS);
      const metroEnd = findClosestStation(addressEnd.address, METRO_STATIONS);
      const metroStartIdx = METRO_STATIONS.findIndex(s => s.name === metroStart.name);
      const metroEndIdx = METRO_STATIONS.findIndex(s => s.name === metroEnd.name);
      let metroPath = metroStartIdx <= metroEndIdx
        ? METRO_STATIONS.slice(metroStartIdx, metroEndIdx + 1)
        : METRO_STATIONS.slice(metroEndIdx, metroStartIdx + 1).reverse();
      const metroAvgTime = Math.max(5, metroPath.length * 2);

      // OMSA
      const omsaStart = findClosestStation(addressStart.address, OMSA_STOPS);
      const omsaEnd = findClosestStation(addressEnd.address, OMSA_STOPS);
      const omsaStartIdx = OMSA_STOPS.findIndex(s => s.name === omsaStart.name);
      const omsaEndIdx = OMSA_STOPS.findIndex(s => s.name === omsaEnd.name);
      let omsaPath = omsaStartIdx <= omsaEndIdx
        ? OMSA_STOPS.slice(omsaStartIdx, omsaEndIdx + 1)
        : OMSA_STOPS.slice(omsaEndIdx, omsaStartIdx + 1).reverse();
      const omsaAvgTime = Math.max(8, omsaPath.length * 3);

      // Teleférico
      const telefericoStart = findClosestStation(addressStart.address, TELEFERICO_STATIONS);
      const telefericoEnd = findClosestStation(addressEnd.address, TELEFERICO_STATIONS);
      const telefericoStartIdx = TELEFERICO_STATIONS.findIndex(s => s.name === telefericoStart.name);
      const telefericoEndIdx = TELEFERICO_STATIONS.findIndex(s => s.name === telefericoEnd.name);
      let telefericoPath = telefericoStartIdx <= telefericoEndIdx
        ? TELEFERICO_STATIONS.slice(telefericoStartIdx, telefericoEndIdx + 1)
        : TELEFERICO_STATIONS.slice(telefericoEndIdx, telefericoStartIdx + 1).reverse();
      const telefericoAvgTime = Math.max(6, telefericoPath.length * 4);

      // Combinaciones
      const combinations = [];

      // Metro + Teleférico (si el destino está cerca de una estación de Teleférico y hay conexión en Eduardo Brito/Gualey)
      const metroToEduardoBritoIdx = METRO_STATIONS.findIndex(s => s.name === 'Eduardo Brito');
      const telefericoFromGualeyIdx = TELEFERICO_STATIONS.findIndex(s => s.name === 'Gualey (T1)');
      if (metroToEduardoBritoIdx !== -1 && telefericoFromGualeyIdx !== -1) {
        // Trayecto Metro hasta Eduardo Brito
        let metroComboPath = metroStartIdx <= metroToEduardoBritoIdx
          ? METRO_STATIONS.slice(metroStartIdx, metroToEduardoBritoIdx + 1)
          : METRO_STATIONS.slice(metroToEduardoBritoIdx, metroStartIdx + 1).reverse();
        // Trayecto Teleférico desde Gualey hasta destino
        let telefericoComboPath = telefericoFromGualeyIdx <= telefericoEndIdx
          ? TELEFERICO_STATIONS.slice(telefericoFromGualeyIdx, telefericoEndIdx + 1)
          : TELEFERICO_STATIONS.slice(telefericoEndIdx, telefericoFromGualeyIdx + 1).reverse();
        const comboAvgTime = Math.max(10, metroComboPath.length * 2 + telefericoComboPath.length * 4 + 10);
        combinations.push({
          type: 'Metro + Teleférico',
          price: TRANSPORT_PRICES.Metro + TRANSPORT_PRICES.Teleferico,
          avgTime: comboAvgTime,
          steps: [
            { instruction: `Camina a la estación/parada más cercana: ${metroStart.name}`, location: metroStart.location, duration: 5 },
            ...(metroComboPath.length > 1 ? [
              { instruction: `Toma el Metro/OMSA/Teleférico pasando por:`, location: metroComboPath.map(s => s.name).join(" → "), duration: Math.max(1, metroComboPath.length * 2) }
            ] : []),
            { instruction: `Bájate en: ${telefericoEnd.name}`, location: telefericoEnd.location, duration: 5 }
          ]
        });
      }

      // Metro + OMSA (si el destino está lejos de una estación de Metro)
      if (metroEndIdx !== -1 && omsaEndIdx !== -1 && Math.abs(metroEndIdx - metroStartIdx) > 2) {
        let metroComboPath = metroStartIdx <= metroEndIdx
          ? METRO_STATIONS.slice(metroStartIdx, metroEndIdx + 1)
          : METRO_STATIONS.slice(metroEndIdx, metroStartIdx + 1).reverse();
        let omsaComboPath = omsaStartIdx <= omsaEndIdx
          ? OMSA_STOPS.slice(omsaStartIdx, omsaEndIdx + 1)
          : OMSA_STOPS.slice(omsaEndIdx, omsaStartIdx + 1).reverse();
        const comboAvgTime = Math.max(15, metroComboPath.length * 2 + omsaComboPath.length * 3 + 10);
        combinations.push({
          type: 'Metro + OMSA',
          price: TRANSPORT_PRICES.Metro + TRANSPORT_PRICES.OMSA,
          avgTime: comboAvgTime,
          steps: [
            { instruction: `Camina a la estación/parada más cercana: ${metroStart.name}`, location: metroStart.location, duration: 5 },
            ...(metroComboPath.length > 1 ? [
              { instruction: `Toma el Metro/OMSA/Teleférico pasando por:`, location: metroComboPath.map(s => s.name).join(" → "), duration: Math.max(1, metroComboPath.length * 2) }
            ] : []),
            { instruction: `Bájate en: ${omsaEnd.name}`, location: omsaEnd.location, duration: 5 }
          ]
        });
      }

      // Teleférico + OMSA (si el destino está lejos de una estación de Teleférico)
      if (telefericoEndIdx !== -1 && omsaEndIdx !== -1 && Math.abs(telefericoEndIdx - telefericoStartIdx) > 1) {
        let telefericoComboPath = telefericoStartIdx <= telefericoEndIdx
          ? TELEFERICO_STATIONS.slice(telefericoStartIdx, telefericoEndIdx + 1)
          : TELEFERICO_STATIONS.slice(telefericoEndIdx, telefericoStartIdx + 1).reverse();
        let omsaComboPath = omsaStartIdx <= omsaEndIdx
          ? OMSA_STOPS.slice(omsaStartIdx, omsaEndIdx + 1)
          : OMSA_STOPS.slice(omsaEndIdx, omsaStartIdx + 1).reverse();
        const comboAvgTime = Math.max(15, telefericoComboPath.length * 4 + omsaComboPath.length * 3 + 10);
        combinations.push({
          type: 'Teleférico + OMSA',
          price: TRANSPORT_PRICES.Teleferico + TRANSPORT_PRICES.OMSA,
          avgTime: comboAvgTime,
          steps: [
            { instruction: `Camina a la estación/parada más cercana: ${telefericoStart.name}`, location: telefericoStart.location, duration: 5 },
            ...(telefericoComboPath.length > 1 ? [
              { instruction: `Toma el Teleférico/OMSA pasando por:`, location: telefericoComboPath.map(s => s.name).join(" → "), duration: Math.max(1, telefericoComboPath.length * 4) }
            ] : []),
            { instruction: `Bájate en: ${omsaEnd.name}`, location: omsaEnd.location, duration: 5 }
          ]
        });
      }

      // Opciones individuales
      const options = [
        {
          type: "Metro",
          price: TRANSPORT_PRICES.Metro,
          avgTime: metroAvgTime,
      steps: [
            { instruction: `Camina a la estación/parada más cercana: ${metroStart.name}`, location: metroStart.location, duration: 5 },
            ...(metroPath.length > 1 ? [
              { instruction: `Toma el Metro/OMSA/Teleférico pasando por:`, location: metroPath.map(s => s.name).join(" → "), duration: Math.max(1, metroAvgTime - 10) }
            ] : []),
            { instruction: `Bájate en: ${metroEnd.name}`, location: metroEnd.location, duration: 5 }
          ]
        },
        {
          type: "OMSA",
          price: TRANSPORT_PRICES.OMSA,
          avgTime: omsaAvgTime,
      steps: [
            { instruction: `Camina a la estación/parada más cercana: ${omsaStart.name}`, location: omsaStart.location, duration: 5 },
            ...(omsaPath.length > 1 ? [
              { instruction: `Toma la OMSA pasando por:`, location: omsaPath.map(s => s.name).join(" → "), duration: Math.max(1, omsaAvgTime - 10) }
            ] : []),
            { instruction: `Bájate en: ${omsaEnd.name}`, location: omsaEnd.location, duration: 5 }
          ]
        },
        {
          type: "Teleférico",
          price: TRANSPORT_PRICES.Teleferico,
          avgTime: telefericoAvgTime,
      steps: [
            { instruction: `Camina a la estación/parada más cercana: ${telefericoStart.name}`, location: telefericoStart.location, duration: 5 },
            ...(telefericoPath.length > 1 ? [
              { instruction: `Toma el Teleférico/OMSA pasando por:`, location: telefericoPath.map(s => s.name).join(" → "), duration: Math.max(1, telefericoAvgTime - 10) }
            ] : []),
            { instruction: `Bájate en: ${telefericoEnd.name}`, location: telefericoEnd.location, duration: 5 }
          ]
        },
        ...combinations
      ];
      setAvailableRoutes(options);
      setShowRouteOptions(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRouteSelect = (route) => {
    setSelectedRoute(route);
  };

  useEffect(() => {
    if (addressStart.coordinates && addressEnd.coordinates) {
      setMarkers([addressStart.coordinates, addressEnd.coordinates]);
    }
  }, [addressStart, addressEnd]);

  const showToast = (message) => {
    setToast({ visible: true, message });
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.delay(2000),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start(() => {
      setToast({ visible: false, message: '' });
    });
  };

  const handleMapClick = (event) => {
    if (markers.length < 2) {
      setMarkers([...markers, { lat: event.latLng.lat(), lng: event.latLng.lng() }]);
    }
  };

  const handleMarkerDrag = (index, event) => {
    const newMarkers = [...markers];
    newMarkers[index] = { lat: event.latLng.lat(), lng: event.latLng.lng() };
    setMarkers(newMarkers);
  };

  useEffect(() => {
    const fetchRoute = async () => {
      if (markers.length === 2 && window?.google) {
        try {
          const response = await fetch("http://localhost:5050/api/fetchRoute", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              start: markers[0],
              end: markers[1],
            }),
          });

          const data = await response.json();

          if (data.routes && data.routes.length > 0) {
            const routeData = data.routes[0];
            if (routeData.distanceMeters) {
              setDistance((routeData.distanceMeters / 1000).toFixed(2));
            }
            
            const path = routeData.polyline.encodedPolyline;
            const decodedPath = window.google.maps.geometry.encoding.decodePath(path);
            setRoute(decodedPath);
            
            if (mapRef.current) {
              const bounds = new window.google.maps.LatLngBounds();
              decodedPath.forEach((point) => bounds.extend(point));
              mapRef.current.fitBounds(bounds);
            }
          }
        } catch (error) {
          console.error("Error al obtener la ruta:", error);
          showToast("Error al calcular la ruta");
        }
      }
    };

    fetchRoute();
  }, [markers]);

  const geocodeAddress = async (address) => {
    if (!address || address.trim() === '') {
      showToast("Por favor, ingresa una dirección válida");
      return null;
    }

    try {
      const geocoder = new window.google.maps.Geocoder();
      const response = await geocoder.geocode({ 
        address,
        componentRestrictions: {
          country: 'DO'
        }
      });
      
      if (response.results && response.results.length > 0) {
        const location = response.results[0].geometry.location;
        return { lat: location.lat(), lng: location.lng() };
      } else {
        showToast("No se encontró la ubicación especificada");
      }
    } catch (error) {
      console.error("Error geocodificando la dirección:", error);
      showToast("Error al buscar la dirección");
    }
    return null;
  };

  const handleAddMarkerFromAddress = async () => {
      // Validar que las direcciones no estén vacías
    if (!addressStart?.address?.trim() || !addressEnd?.address?.trim()) {
      showToast("Por favor, ingresa ambas direcciones");
      return;
    }

    // Geocodificar las direcciones
    const startLocation = await geocodeAddress(addressStart.address);
    const endLocation = await geocodeAddress(addressEnd.address);

    // Si las coordenadas son válidas, actualiza los marcadores
    if (startLocation && endLocation) {
      setMarkers([startLocation, endLocation]);
    }
  };

  const handleSaveRoute = async () => {
    if (!selectedRoute) return;
    try {
      await axios.post(`${API_BASE_URL}/directions`, {
        startAddress: addressStart.address,
        endAddress: addressEnd.address,
        distance: 0 // o el valor que calcules
      });
      showToast('Ruta guardada exitosamente');
    } catch (error) {
      showToast('Error al guardar la ruta');
    }
  };

  const handleStartLocationChange = (selectedAddress) => {
    setIsUsingCurrentLocation(false);
    setAddressStart(selectedAddress);
  };

  const switchToCurrentLocation = async () => {
    setIsUsingCurrentLocation(true);
    await updateCurrentLocation();
  };

  // Cargar datos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [transportTypesData, popularRoutesData] = await Promise.all([
          api.getTransportTypes(),
          api.getPopularRoutes()
        ]);

        setTransportTypes(transportTypesData);
        setPopularRoutes(popularRoutesData);
      } catch (error) {
        console.error('Error loading initial data:', error);
        showToast('Error al cargar datos iniciales');
      }
    };

    loadInitialData();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.toastContainer, {
        opacity: fadeAnim,
        transform: [{
          translateY: fadeAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [20, 0]
          })
        }]
      }]}>
        <Toast visible={toast.visible} message={toast.message} />
      </Animated.View>

      <View style={styles.mapWrapper}>
        <LoadScriptNext 
          googleMapsApiKey={GOOGLE_MAPS_APIKEY}
          libraries={libraries}
        >
          <View style={styles.mapContainer}>
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={15}
              onClick={handleMapClick}
              onLoad={(map) => (mapRef.current = map)}
              options={{
                zoomControl: false,
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: false,
                styles: [
                  {
                    featureType: "poi",
                    elementType: "labels",
                    stylers: [{ visibility: "off" }],
                  },
                ],
              }}
            >
              {markers.map((marker, index) => (
                <Marker
                  key={index}
                  position={marker}
                  draggable={true}
                  onDragEnd={(event) => handleMarkerDrag(index, event)}
                />
              ))}
              {route.length > 0 && (
                <Polyline path={route} options={{ strokeColor: "#900020", strokeWeight: 5 }} />
              )}
            </GoogleMap>
            
            <View style={styles.mapTypeContainer}>
              <TouchableOpacity style={styles.mapTypeButton}>
                <Text style={styles.mapTypeText}>Mapa</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.mapTypeButton, styles.mapTypeButtonInactive]}>
                <Text style={[styles.mapTypeText, styles.mapTypeTextInactive]}>Satélite</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LoadScriptNext>
      </View>

      {!showRouteOptions ? (
        <View style={styles.formContainer}>
          <View style={styles.locationInputContainer}>
            <View style={styles.locationInputWrapper}>
              <View style={styles.inputIconContainer}>
                <View style={styles.dotIndicator} />
                <View style={styles.verticalLine} />
                <View style={[styles.dotIndicator, styles.destinationDot]} />
              </View>
              <View style={styles.inputsContainer}>
                <AddressInput
                  value={addressStart}
                  onChange={handleStartLocationChange}
                  placeholder="Mi Ubicación"
                  editable={!isUsingCurrentLocation}
                  style={[
                    styles.locationInput,
                    isUsingCurrentLocation && styles.currentLocationInput
                  ]}
                />
                {!isUsingCurrentLocation && (
      <TouchableOpacity 
                    style={styles.currentLocationButton}
                    onPress={switchToCurrentLocation}
      >
          <Image
                      source={require('../../assets/icons/location.png')}
                      style={styles.locationIcon}
          />
                    <Text style={styles.currentLocationText}>Usar ubicación actual</Text>
      </TouchableOpacity>
                )}
                <AddressInput
                  value={addressEnd}
                  onChange={(selectedAddress) => setAddressEnd(selectedAddress)}
                  placeholder="¿Hacia Donde?"
                  style={styles.locationInput}
                />
              </View>
              {isUsingCurrentLocation && (
          <TouchableOpacity 
                  style={styles.refreshButton}
                  onPress={updateCurrentLocation}
                >
                  <Image
                    source={require('../../assets/icons/refresh.png')}
                    style={styles.refreshIcon}
                  />
                  <Text style={styles.refreshText}>Actualizar ubicación</Text>
                </TouchableOpacity>
              )}
            </View>
            </View>

          {locationError && (
            <TouchableOpacity 
              style={styles.errorContainer}
              onPress={requestLocationPermission}
            >
              <Text style={styles.errorText}>{locationError}</Text>
              <Text style={styles.errorAction}>Toca para reintentar</Text>
          </TouchableOpacity>
          )}

          {/* Botones Buscar Rutas y Volver en la misma fila */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 12 }}>
          <TouchableOpacity 
              style={[styles.searchButton, { width: 120, backgroundColor: '#f5f5f5', borderColor: '#900020', borderWidth: 1, marginRight: 8, paddingHorizontal: 0 }]} 
              onPress={() => router.back()}
              accessibilityLabel="Volver"
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="10" height="18" viewBox="0 0 10 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.75 16.5L1.25 9L8.75 1.5" stroke="#900020" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <Text style={[styles.searchButtonText, { color: '#900020', marginLeft: 8 }]}>Volver</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.searchButton, isLoading && styles.searchButtonDisabled, { flex: 1 }]} 
            onPress={handleSearchRoute}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.searchButtonText}>Buscar Rutas</Text>
            )}
          </TouchableOpacity>
          </View>
      </View>
      ) : (
        <View style={styles.routeOptionsContainer}>
          <View style={styles.routeOptionsHeader}>
            <Text style={styles.routeOptionsTitle}>Rutas Disponibles</Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowRouteOptions(false)}
            >
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.routeOptionsList}>
            {availableRoutes.map((route, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.routeOption,
                  selectedRoute === route && styles.selectedRouteOption
                ]}
                onPress={() => handleRouteSelect(route)}
              >
                <View style={styles.routeOptionContent}>
                  <View style={styles.routeOptionLeft}>
                    <Image
                      source={getTransportTypeIcon(route.type)}
                      style={styles.transportIcon}
                    />
                    <View style={styles.routeDetails}>
                      <Text style={styles.routeType}>{route.type}</Text>
                      <Text style={styles.routeTime}>Aprox. {route.avgTime} min</Text>
                    </View>
                  </View>
                  <Text style={styles.routePrice}>
                    {route.price ? `DOP ${route.price}` : ''}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {selectedRoute && selectedRoute.steps && (
            <View style={styles.routeStepsContainer}>
              <Text style={styles.routeStepsTitle}>Pasos del viaje</Text>
              {selectedRoute.steps.map((step, idx) => (
                <View key={idx} style={styles.routeStep}>
                  <Text style={styles.stepDescription}>{step.instruction}</Text>
                  <Text style={styles.stepDuration}>{step.duration} min</Text>
                </View>
              ))}
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveRoute}>
                <Text style={styles.saveButtonText}>Guardar Ruta</Text>
  </TouchableOpacity>
</View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    position: 'relative',
    height: '100vh',
  },
  mapWrapper: {
    flex: 1,
    position: 'relative',
    height: '100%',
  },
  mapContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  mapTypeContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1,
  },
  mapTypeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  mapTypeButtonInactive: {
    backgroundColor: '#f5f5f5',
  },
  mapTypeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#900020',
  },
  mapTypeTextInactive: {
    color: '#666',
  },
  formContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 2,
  },
  locationInputContainer: {
    marginBottom: 20,
  },
  locationInputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 4,
  },
  inputIconContainer: {
    width: 20,
    alignItems: 'center',
    marginRight: 12,
    marginTop: 12,
  },
  dotIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#900020',
  },
  destinationDot: {
    backgroundColor: '#666',
  },
  verticalLine: {
    width: 2,
    height: 30,
    backgroundColor: '#ddd',
    marginVertical: 4,
  },
  inputsContainer: {
    flex: 1,
    marginRight: 8,
  },
  locationInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 16,
    marginBottom: 12,
    fontSize: 16,
  },
  currentLocationInput: {
    backgroundColor: '#f8f9fa',
    borderColor: '#900020',
  },
  currentLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    marginTop: -8,
    marginBottom: 8,
  },
  locationIcon: {
    width: 16,
    height: 16,
    tintColor: '#900020',
    marginRight: 8,
    },
  currentLocationText: {
    color: '#900020',
    fontSize: 14,
    fontWeight: '500',
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    marginLeft: 8,
  },
  refreshIcon: {
    width: 16,
    height: 16,
    tintColor: '#900020',
    marginRight: 4,
  },
  refreshText: {
    color: '#900020',
    fontSize: 12,
    fontWeight: '500',
  },
  searchButton: {
    backgroundColor: '#900020',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
    marginHorizontal: 4,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  errorAction: {
    color: '#900020',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
  },
  routeOptionsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '75%',
    padding: 20,
    paddingBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 2,
  },
  routeOptionsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  routeOptionsTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 28,
    color: "#666",
  },
  routeOptionsList: {
    maxHeight: "60%",
  },
  routeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedRouteOption: {
    borderColor: '#900020',
    backgroundColor: '#fff5f5',
  },
  routeOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  routeOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transportIcon: {
    width: 40,
    height: 40,
    marginRight: 15,
  },
  routeDetails: {
    flex: 1,
  },
  routeType: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#900020',
  },
  routeTime: {
    fontSize: 14,
    color: '#666',
  },
  routeDetailsText: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  routePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#900020',
  },
  routeStepsContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 15,
  },
  routeStepsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#900020',
  },
  routeStep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    padding: 10, 
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  stepDescription: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  stepDuration: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
  button: {
    backgroundColor: "#900020",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  confirmButton: {
    marginTop: 15,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  toastContainer: {
    position: 'absolute',
    top: 60,
    alignSelf: 'center',
    zIndex: 1000,
    width: '80%',
    maxWidth: 300,
  },
  toast: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  toastText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  searchButtonDisabled: {
    opacity: 0.7,
  },
  delayText: {
    color: '#d32f2f',
    fontSize: 12,
    marginLeft: 4,
  },
  scheduleText: {
    color: '#666',
    fontSize: 12,
    marginTop: 4,
  },
  saveButton: {
    backgroundColor: '#900020',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
export default App;