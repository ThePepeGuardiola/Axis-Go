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
  switch (type?.toLowerCase()) {
    case 'metro':
      return require('../../assets/images/metroo.png');
    case 'bus':
      return require('../../assets/images/bus.png');
    case 'car':
    default:
      return require('../../assets/images/car.png');
  }
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
  const [nearbyStations, setNearbyStations] = useState([]);
  const [transportTypes, setTransportTypes] = useState([]);
  const [availableRoutes, setAvailableRoutes] = useState([]);
  const [realtimeInfo, setRealtimeInfo] = useState(null);
  const [popularRoutes, setPopularRoutes] = useState([]);

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

  // Ejemplo de opciones de ruta (esto vendrá de la API después)
  const routeOptions = [
    {
      id: 1,
      type: "Metro + Bus",
      time: "25 min",
      distance: "3.2 km",
      price: "35.00",
      icon: require('../../assets/images/metroo.png'),
      steps: [
        { type: "walk", description: "Caminar hasta estación Centro de los Héroes", duration: "5 min" },
        { type: "metro", description: "Tomar Metro Línea 1 hacia Villa Mella", duration: "15 min" },
        { type: "bus", description: "Tomar OMSA C-01 hacia destino", duration: "5 min" }
      ]
    },
    {
      id: 2,
      type: "Bus Expreso",
      time: "30 min",
      distance: "3.5 km",
      price: "25.00",
      icon: require('../../assets/images/bus.png'),
      steps: [
        { type: "walk", description: "Caminar hasta parada OMSA", duration: "3 min" },
        { type: "bus", description: "Tomar OMSA Expreso hacia destino", duration: "27 min" }
      ]
    },
    {
      id: 3,
      type: "Carrito Público",
      time: "20 min",
      distance: "3.0 km",
      price: "50.00",
      icon: require('../../assets/images/car.png'),
      steps: [
        { type: "walk", description: "Caminar hasta parada de carros", duration: "2 min" },
        { type: "car", description: "Tomar carro público ruta 'Los Ríos'", duration: "18 min" }
      ]
    }
  ];

  const handleSearchRoute = async () => {
    if (!addressStart.coordinates || !addressEnd.coordinates) {
      showToast("Por favor, ingresa ambas direcciones");
      return;
    }

    setIsLoading(true);
    try {
      // Obtener rutas calculadas
      const routes = await api.calculateRoutes(
        addressStart.coordinates,
        addressEnd.coordinates
      );

      // Obtener información en tiempo real para cada ruta
      const routesWithRealtime = await Promise.all(
        routes.map(async (route) => {
          const realtimeData = await api.getRealtimeInfo(route.id);
          return { ...route, realtime: realtimeData };
        })
      );

      setAvailableRoutes(routesWithRealtime);
      setShowRouteOptions(true);
    } catch (error) {
      console.error('Error searching routes:', error);
      showToast('Error al buscar rutas disponibles');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRouteSelect = async (route) => {
    setSelectedRoute(route);
    try {
      // Obtener horarios de transporte para la ruta seleccionada
      const scheduleInfo = await api.getTransportSchedule(
        route.stationId,
        route.transportType
      );
      
      // Actualizar la información de la ruta con los horarios
      setSelectedRoute(prev => ({
        ...prev,
        schedule: scheduleInfo
      }));
    } catch (error) {
      console.error('Error fetching schedule:', error);
      showToast('Error al obtener horarios');
    }
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
      await api.saveRoute({
        start: addressStart,
        end: addressEnd,
        routeDetails: selectedRoute
      });
      showToast('Ruta guardada exitosamente');
    } catch (error) {
      console.error('Error saving route:', error);
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

  // Actualizar estaciones cercanas cuando cambia la ubicación
  useEffect(() => {
    const updateNearbyStations = async () => {
      if (addressStart.coordinates) {
        try {
          const stations = await api.getNearbyStations(addressStart.coordinates);
          setNearbyStations(stations);
    } catch (error) {
          console.error('Error fetching nearby stations:', error);
        }
    }
  };

    updateNearbyStations();
  }, [addressStart.coordinates]);

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

          <TouchableOpacity 
            style={[styles.searchButton, isLoading && styles.searchButtonDisabled]} 
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
                  selectedRoute?.id === route.id && styles.selectedRouteOption
                ]}
                onPress={() => handleRouteSelect(route)}
              >
                <View style={styles.routeOptionContent}>
                  <View style={styles.routeOptionLeft}>
                    <Image
                      source={getTransportTypeIcon(route.transportType)}
                      style={styles.transportIcon}
                    />
                    <View style={styles.routeDetails}>
                      <Text style={styles.routeType}>
                        {route.transportType}
                        {route.realtime?.delay && (
                          <Text style={styles.delayText}>
                            {' '}• {route.realtime.delay} min retraso
                          </Text>
                        )}
                      </Text>
                      <Text style={styles.routeTime}>
                        {route.duration} • {route.distance}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.routePrice}>DOP {route.price}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {selectedRoute && (
            <View style={styles.routeStepsContainer}>
              <Text style={styles.routeStepsTitle}>Detalles del Viaje</Text>
              {selectedRoute.steps.map((step, index) => (
                <View key={index} style={styles.routeStep}>
                  <Image
                    source={getTransportTypeIcon(step.type)}
                    style={styles.stepIcon}
                  />
                  <View style={styles.stepDetails}>
                    <Text style={styles.stepDescription}>{step.description}</Text>
                    <Text style={styles.stepDuration}>{step.duration}</Text>
                    {step.schedule && (
                      <Text style={styles.scheduleText}>
                        Próxima salida: {step.schedule.nextDeparture}
                      </Text>
                    )}
                  </View>
                </View>
              ))}
              
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={handleSaveRoute}
              >
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
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#eee",
  },
  selectedRouteOption: {
    borderColor: "#900020",
    backgroundColor: "#fff5f5",
  },
  routeOptionContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  routeOptionLeft: {
    flexDirection: "row",
    alignItems: "center",
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
    fontWeight: "bold",
    marginBottom: 4,
  },
  routeTime: {
    fontSize: 14,
    color: "#666",
  },
  routePrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#900020",
  },
  routeStepsContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    marginBottom: 15,
  },
  routeStepsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  routeStep: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    padding: 10, 
    backgroundColor: "white",
    borderRadius: 8,
  },
  stepIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  stepDetails: {
    flex: 1,
  },
  stepDescription: {
    fontSize: 14,
    marginBottom: 2,
  },
  stepDuration: {
    fontSize: 12,
    color: "#666",
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