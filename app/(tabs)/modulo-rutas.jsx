import React, { useState, useEffect, useRef } from "react";
import { GoogleMap, LoadScriptNext, Marker, Polyline, InfoWindow } from "@react-google-maps/api";
import { StyleSheet, View, Text, TouchableOpacity, Image, Animated, TextInput } from "react-native";
import { router } from 'expo-router';
import axios from 'axios';

const libraries = ["geometry", "places"];

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

const AddressInput = ({ value, onChange, placeholder }) => {
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

const App = () => {
  const containerStyle = { width: "100%", height: "50vh" };
  const center = { lat: 18.4861, lng: -69.9312 };
  const [markers, setMarkers] = useState([]);
  const [route, setRoute] = useState([]);
  const [distance, setDistance] = useState(null);
  const [addressStart, setAddressStart] = useState({ address: "", coordinates: null });
  const [addressEnd, setAddressEnd] = useState({ address: "", coordinates: null });
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [mostUsedRoutes, setMostUsedRoutes] = useState([]);
  const mapRef = useRef();
  const [toast, setToast] = useState({ visible: false, message: '' });
  const fadeAnim = useRef(new Animated.Value(0)).current;

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
  
    if (markers.length === 2 && distance) {
      
      const newRoute = {
        startAddress: addressStart,
        endAddress: addressEnd,
        distance: distance || 0,
      };
  
      try {
        const response = await axios.post("http://localhost:5050/api/directions", newRoute);
        showToast("Ruta guardada exitosamente");
      } catch (error) {
        showToast("Error al guardar la ruta");
      }
    } else {
      showToast("Por favor, ingresa ambas direcciones");
    }
  };

  const fetchMostUsedRoutes = async () => {
    try {
      const response = await axios.get("http://localhost:5050/api/mostUsedRoutes");
      setMostUsedRoutes(response.data);
    } catch (error) {
      console.error("Error al obtener las rutas más utilizadas:", error);
    }
  };

  useEffect(() => {
    fetchMostUsedRoutes();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.toastContainer,
          {
            opacity: fadeAnim,
            transform: [{
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0]
              })
            }]
          }
        ]}
      >
        <Toast visible={toast.visible} message={toast.message} />
      </Animated.View>

      <LoadScriptNext 
        googleMapsApiKey={process.env.EXPO_PUBLIC_GOOGLE_MAPS_APIKEY}
        libraries={libraries}
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={10}
          onClick={handleMapClick}
          onLoad={(map) => (mapRef.current = map)}
        >
          {markers.map((marker, index) => (
            <Marker
              key={index}
              position={marker}
              draggable={true}
              onDragEnd={(event) => handleMarkerDrag(index, event)}
              onClick={() => setSelectedMarker(index)}
            />
          ))}
          {route.length > 0 && (
            <Polyline path={route} options={{ strokeColor: "#E70034", strokeWeight: 5 }} />
          )}
          {route.length > 0 && markers.length === 2 && selectedMarker === 1 && (
            <InfoWindow position={markers[1]} onCloseClick={() => setSelectedMarker(null)}>
              <div>
                <p>Distancia: {distance} km</p>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScriptNext>

      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.push('/home')}
      >
        <View style={styles.backButtonContent}>
          <Image
            source={require('../../assets/icons/arrow_back.png')}
            style={styles.backButtonIcon}
          />
        </View>
      </TouchableOpacity>

      <View style={styles.mostUsedRoutesContainer}>
        <Text style={styles.mostUsedRoutesTitle}>Ruta Más Transcurrida</Text>
        {mostUsedRoutes && mostUsedRoutes.length > 0 ? (
          <TouchableOpacity 
            style={styles.mostUsedRoute}
            onPress={async () => {
              setAddressStart(mostUsedRoutes[0].start_address);
              setAddressEnd(mostUsedRoutes[0].end_address);
              const startLocation = await geocodeAddress(mostUsedRoutes[0].start_address);
              const endLocation = await geocodeAddress(mostUsedRoutes[0].end_address);
              if (startLocation && endLocation) {
                setMarkers([startLocation, endLocation]);
              }
            }}
          >
            <View style={styles.routeTextContainer}>
              <Text style={styles.routeLabel}>Inicio: </Text>
              <Text numberOfLines={1} ellipsizeMode="tail" style={styles.routeText}>
                {mostUsedRoutes[0].start_address}
              </Text>
            </View>
            <View style={styles.routeTextContainer}>
              <Text style={styles.routeLabel}>Fin: </Text>
              <Text numberOfLines={1} ellipsizeMode="tail" style={styles.routeText}>
                {mostUsedRoutes[0].end_address}
              </Text>
            </View>
          </TouchableOpacity>
        ) : (
          <Text>No hay rutas disponibles.</Text>
        )}
      </View>
      <View style={styles.formContainer}>
      <AddressInput
        value={addressStart}
        onChange={(selectedAddress) => setAddressStart(selectedAddress)}
        placeholder="Mi Ubicación"
/>
     <AddressInput
        value={addressEnd}
        onChange={(selectedAddress) => setAddressEnd(selectedAddress)}
        placeholder="¿Hacia Donde?"
     />
  <TouchableOpacity style={styles.button} onPress={handleSaveRoute}>
    <Text style={styles.buttonText}>Guardar Ruta</Text>
  </TouchableOpacity>
</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  mostUsedRoutesContainer: {
    marginTop: 30,
    padding: 10,
    borderRadius: 10,
  },
  mostUsedRoutesTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  mostUsedRoute: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    marginTop: 5,
  },
  routeLabel: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  routeText: {
    padding: 5,
    fontSize: 15,
    flex: 1,
    overflow: 'hidden',
  },
  backButton: {
    position: 'relative',
    top: 20,
    left: 10,
    width: '10%',
    backgroundColor: '#900020',
    borderRadius: '15%',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  backButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  backButtonIcon: {
    width: 26,
    height: 24,
    tintColor: '#FFFFFF',
  },

  formContainer: {
    position: "absolute",
    bottom: 20,
    left: "50%",
    transform: [{ translateX: "-50%" }],
    backgroundColor: "white",
    padding: 10, 
    borderRadius: 8,
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)", 
    zIndex: 10,
    width: "90%",
    maxWidth: 400, 
  },
  button: {
    backgroundColor: "#900020",
    paddingVertical: 10, 
    paddingHorizontal: 15,
    borderRadius: 6,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 14, 
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
});

export default App;