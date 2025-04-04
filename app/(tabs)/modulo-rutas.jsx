import React, { useState, useEffect, useRef } from "react";
import Autosuggest from "react-autosuggest";
import { GoogleMap, LoadScriptNext, Marker, Polyline, InfoWindow } from "@react-google-maps/api";
import { StyleSheet, View, Button, Text, TouchableOpacity, Image } from "react-native";
import { router } from 'expo-router';
import axios from 'axios';
import { GOOGLE_MAPS_APIKEY } from '@env';

const libraries = ["geometry"];

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

// Función para obtener sugerencias desde el backend
const fetchSuggestions = async (query) => {
  if (query.trim().length === 0) return [];
  try {
    const response = await axios.post("http://localhost:5050/api/suggestions", { query });
    return response.data;
  } catch (error) {
    console.error("Error fetching suggestions", error);
    return [];
  }
};

// Componente de autocompletado para el formulario de direcciones

const AddressAutosuggest = ({ value, onChange, placeholder }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);

  const fetchSuggestions = async (query) => {
    if (query.trim().length === 0) return [];
    try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=do`
            );
            const data = await response.json();
            return data;
          } catch (error) {
            console.error("Error fetching suggestions", error);
            return [];
          }
        };

  const onSuggestionsFetchRequested = async ({ value }) => {
    const results = await fetchSuggestions(value);
    setSuggestions(results);
  };

  const onSuggestionsClearRequested = () => {
{
      setSuggestions([]);
    }
  };

  const getSuggestionValue = (suggestion) => suggestion.display_name;

  const renderSuggestion = (suggestion) => (
    <div style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
      {suggestion.display_name}
    </div>
  );

  // Estilos personalizados para el autosuggest
  const theme = {
    container: { 
      position: "relative", 
      width: "100%"
    },
    input: { 
      width: "94%", 
      padding: "10px", 
      fontSize: "16px", 
      border: "1px solid #ccc", 
      borderRadius: "4px" 
    },
    suggestionsContainer: {
      position: "relative", 
      marginTop: "5px",
      background: "white",
      border: "1px solid #ccc",
      borderRadius: "4px",
      maxHeight: "200px",
      overflowY: "auto",
    },
    suggestion: { 
      padding: "10px",
      zIndex: 3,
    },
    suggestionHighlighted: { 
      backgroundColor: "#ddd" 
    },
  };

  const inputProps = {
    placeholder,
    value,
    onChange: (event, { newValue }) => onChange(newValue),
    onFocus: () => setIsFocused(true),
    onBlur: () => setIsFocused(false),
  };

  return (
    <Autosuggest
      suggestions={suggestions}
      onSuggestionsFetchRequested={onSuggestionsFetchRequested}
      onSuggestionsClearRequested={onSuggestionsClearRequested}
      getSuggestionValue={getSuggestionValue}
      renderSuggestion={renderSuggestion}
      inputProps={inputProps}
      theme={theme}
      onSuggestionSelected={(event, { suggestion }) => {
        onChange(suggestion.display_name);
        setSuggestions([]);
      }}
      shouldRenderSuggestions={(value) => value.trim().length > 0}
      focusInputOnSuggestionClick={false}
    />
  );
};

const App = () => {
  // Configuración del mapa
  const containerStyle = { width: "100%", height: "50vh" };
  const center = { lat: 18.4861, lng: -69.9312 };
  const [markers, setMarkers] = useState([]);
  const [route, setRoute] = useState([]);
  const [distance, setDistance] = useState(null);
  const [addressStart, setAddressStart] = useState("");
  const [addressEnd, setAddressEnd] = useState("");
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [mostUsedRoutes, setMostUsedRoutes] = useState([]); // Estado para rutas más utilizadas
  const mapRef = useRef();

  // Al hacer clic en el mapa se agregan marcadores
  const handleMapClick = (event) => {
    if (markers.length < 2) {
      setMarkers([...markers, { lat: event.latLng.lat(), lng: event.latLng.lng() }]);
    }
  };

  // Actualiza la posición de un marcador al arrastrarlo
  const handleMarkerDrag = (index, event) => {
    const newMarkers = [...markers];
    newMarkers[index] = { lat: event.latLng.lat(), lng: event.latLng.lng() };
    setMarkers(newMarkers);
  };

  // Efecto para obtener la ruta cuando hay 2 marcadores
  useEffect(() => {
    const fetchRoute = async () => {
      if (markers.length === 2) {
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

            // Extraer distancia
            if (routeData.distanceMeters) {
              setDistance((routeData.distanceMeters / 1000).toFixed(2));
            } else if (
              routeData.legs &&
              routeData.legs.length > 0 &&
              routeData.legs[0].distanceMeters
            ) {
              setDistance((routeData.legs[0].distanceMeters / 1000).toFixed(2));
            } else {
              console.error("No se encontró la distancia en la respuesta:", routeData);
            }
            const path = data.routes[0].polyline.encodedPolyline;
            const decodedPath = window.google.maps.geometry.encoding.decodePath(path);
            setRoute(decodedPath);
            if (mapRef.current) {
              const bounds = new window.google.maps.LatLngBounds();
              decodedPath.forEach((point) => bounds.extend(point));
              mapRef.current.fitBounds(bounds);
            }
          } else {
            setRoute([]);
          }
        } catch (error) {
          console.error("Error obteniendo la ruta:", error);
        }
      } else {
        setRoute([]);
      }
    };

    fetchRoute();
  }, [markers]);

  // Geocodificación para el formulario de direcciones
  const geocodeAddress = async (address) => {
    const geocoder = new window.google.maps.Geocoder();
    try {
      const response = await geocoder.geocode({ address });
      if (response.results && response.results.length > 0) {
        const location = response.results[0].geometry.location;
        return { lat: location.lat(), lng: location.lng() };
      } else {
        alert("Dirección no encontrada: " + address);
      }
    } catch (error) {
      console.error("Error geocodificando la dirección:", error);
      alert("Hubo un problema con la geocodificación.");
    }
    return null;
  };

  // Función para agregar marcadores desde el formulario
  const handleAddMarkerFromAddress = async () => {
    const startLocation = await geocodeAddress(addressStart);
    const endLocation = await geocodeAddress(addressEnd);
  
    if (startLocation && endLocation) {
      setMarkers([startLocation, endLocation]);
  
      // Guardar la ruta en la base de datos
      const newRoute = {
        startAddress: addressStart,
        endAddress: addressEnd,
        distance: distance || 0,
      };
  
      try {
        const response = await axios.post("http://localhost:5050/api/directions", newRoute);
        console.log("Ruta guardada:", response.data);
      } catch (error) {
        console.error("Error al guardar la ruta:", error);
        alert("Hubo un problema al guardar la ruta.");
      }
    } else {
      alert("Por favor, asegúrate de que las direcciones sean válidas.");
    }
  };
  // Función para agregar guardar rutas
  const handleSaveRoute = async () => {
    if (markers.length === 2 && distance) {
      const newRoute = {
        startAddress: addressStart,
        endAddress: addressEnd,
        distance,
      };
  
      try {
        const response = await axios.post("http://localhost:5050/api/saveRoute", newRoute);
        alert("Ruta guardada exitosamente.");
        console.log("Ruta guardada:", response.data);
      } catch (error) {
        console.error("Error al guardar la ruta:", error);
        alert("Hubo un problema al guardar la ruta.");
      }
    } else {
      alert("Por favor, asegúrate de tener una ruta válida antes de guardarla.");
    }
  };

  // Función para obtener las rutas más utilizadas
  const fetchMostUsedRoutes = async () => {
    try {
      const response = await axios.get("http://localhost:5050/api/mostUsedRoutes");
      console.log("Rutas obtenidas:", response.data); // Para depuración
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
      <LoadScriptNext googleMapsApiKey={GOOGLE_MAPS_APIKEY} libraries={libraries}>

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

      <TouchableOpacity style={styles.navItem} onPress={() => router.push('/home')}>
                <View>
                  <Image
                    source={require('../../assets/icons/arrow_back.png')}
                    style={{ position: 'relative', top: 15, left:30, width: 30, height: 30 }}
                  />
                </View>
              </TouchableOpacity>

       {/* Sección de rutas más utilizadas */}
       <View style={styles.mostUsedRoutesContainer}>
          <Text style={styles.mostUsedRoutesTitle}>Ruta Más Transcurrida</Text>
            {mostUsedRoutes && mostUsedRoutes.length > 0 ? (
              <View style={styles.mostUsedRoute}>
                <View style={styles.routeTextContainer}>
               <Text style={styles.routeLabel}>Inicio: </Text>
              <Text style={styles.routeText}>{mostUsedRoutes[0].start_address}</Text>
      </View>
      <View style={styles.routeTextContainer}>
          <Text style={styles.routeLabel}>Fin: </Text>
          <Text style={styles.routeText}>{mostUsedRoutes[0].end_address}</Text>
      </View>
    </View>
  ) : (
    <Text>No hay rutas disponibles.</Text>
  )}
</View>

      {/* Formulario de direcciones con react-autosuggest */}
      <View style={styles.formContainer}>
        <AddressAutosuggest
          value={addressStart}
          onChange={setAddressStart}
          placeholder="Mi Ubicación"
        />
        <AddressAutosuggest
          value={addressEnd}
          onChange={setAddressEnd}
          placeholder="Hacia Donde?"
        />
        <Button title="Agregar Direcciones" onPress={handleAddMarkerFromAddress} color="#900020" />
        <Button title="Guardar Ruta" onPress={handleSaveRoute} color="#900020" />
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
    marginTop: 20,
    padding: 10,
    backgroundColor: "#f9f9f9",
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
    backgroundColor: "#fff",
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
    fontSize: 14,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderRadius: 10,
    flex: 1,
    margin: 5,
  },
  cardTextContainer: {
    marginLeft: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  cardSubtitle: {
    fontSize: 14,
    color: "gray",
    width: 300,
  },
  placeholder: {
    fontStyle: "italic",
    color: "#aaa",
  },
  cardInput: {
    fontSize: 14,
    padding: 4,
    borderBottomWidth: 0,
    borderColor: "#ccc",
    minWidth: 150,
  },
  formContainer: {
    position: "absolute",
    bottom: 20,
    left: "50%",
    transform: [{ translateX: "-50%" }],
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
    zIndex: 10,
    width: "90%",
    maxWidth: 500,
  },
});

export default App;