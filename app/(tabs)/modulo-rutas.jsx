import React, { useState, useEffect, useRef } from "react";
import Autosuggest from "react-autosuggest";
import { GoogleMap, LoadScript, Marker, Polyline, InfoWindow } from "@react-google-maps/api";
import { StyleSheet, View, TextInput, Button, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const libraries = ["geometry"];
const GOOGLE_MAPS_APIKEY = 'AIzaSyC7mGVZuJBQoyjHxGDwoV3xtRbrhpADEX0';

// Componente de autocompletado para el formulario de direcciones
const AddressAutosuggest = ({ value, onChange, placeholder }) => {
  const [suggestions, setSuggestions] = useState([]);

  // Función para obtener sugerencias desde Nominatim (limitado a República Dominicana)
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
    setSuggestions([]);
  };

  const getSuggestionValue = suggestion => suggestion.display_name;

  const renderSuggestion = suggestion => (
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
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    background: "white",
    zIndex: 3,
    borderTop: "none",
    maxHeight: "200px",
    overflowY: "auto"
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
    onChange: (event, { newValue }) => onChange(newValue)
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
      }}
    />
  );
};

// Componente controlado para la tarjeta de dirección "Go again"
const AddressCard = ({ icon, title, address, placeholder, onChange, onCardPress }) => {
  const [editing, setEditing] = useState(false);

  const handleBlur = () => {
    setEditing(false);
  };

  return (
    <TouchableOpacity onPress={() => onCardPress(address)}>
      <View style={styles.card}>
        <MaterialIcons name={icon} size={24} color="black" />
        <View style={styles.cardTextContainer}>
          <Text style={styles.cardTitle}>{title}</Text>
          {editing ? (
            <TextInput
              style={styles.cardInput}
              value={address}
              placeholder={placeholder}
              onChangeText={onChange}
              onBlur={handleBlur}
              autoFocus
            />
          ) : (
            <Text
              style={[styles.cardSubtitle, !address && styles.placeholder]}
              onPress={() => setEditing(true)}
            >
              {address || placeholder}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const App = () => {
  // Configuración del mapa
  const containerStyle = { width: "100%", height: "50vh" };
  const center = { lat: 18.4861, lng: -69.9312 };
  const [markers, setMarkers] = useState([]);
  const [route, setRoute] = useState([]);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [addressStart, setAddressStart] = useState("");
  const [addressEnd, setAddressEnd] = useState("");
  const [isFocusedStart, setIsFocusedStart] = useState(false);
  const [isFocusedEnd, setIsFocusedEnd] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const mapRef = useRef();

  // Estados para las direcciones de las tarjetas "Go again"
  const [workAddress, setWorkAddress] = useState("");
  const [homeAddress, setHomeAddress] = useState("");

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
        const url = "https://routes.googleapis.com/directions/v2:computeRoutes";
        const body = {
          origin: { location: { latLng: { latitude: markers[0].lat, longitude: markers[0].lng } } },
          destination: { location: { latLng: { latitude: markers[1].lat, longitude: markers[1].lng } } },
          travelMode: "DRIVE",
          routingPreference: "TRAFFIC_AWARE",
          computeAlternativeRoutes: false,
        };

        try {
          const response = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Goog-Api-Key": GOOGLE_MAPS_APIKEY,
              "X-Goog-FieldMask": "routes.polyline,routes.duration,routes.distanceMeters,routes.legs.duration,routes.legs.distanceMeters",
            },
            body: JSON.stringify(body),
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
      console.log("Geocoding response:", response);
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

  // Al presionar una tarjeta se asigna su dirección al input "Where to?"
  const handleCardPress = (address) => {
    setAddressEnd(address);
  };

  // Función para agregar marcadores desde el formulario
  const handleAddMarkerFromAddress = async () => {
    const startLocation = await geocodeAddress(addressStart);
    const endLocation = await geocodeAddress(addressEnd);
    if (startLocation && endLocation) {
      setMarkers([startLocation, endLocation]);
    }
  };

  return (
    <View style={styles.container}>
      <LoadScript googleMapsApiKey={GOOGLE_MAPS_APIKEY} libraries={libraries}>
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
      </LoadScript>

      {/* Sección "Go again" con las tarjetas */}
      <View style={styles.goAgainContainer}>
        <Text style={styles.goAgainTitle}>Go again</Text>
        <View style={styles.cardContainer}>
          <AddressCard
            icon="work"
            title="Work"
            address={workAddress}
            placeholder="Agregar dirección"
            onChange={setWorkAddress}
            onCardPress={handleCardPress}
          />
          <AddressCard
            icon="home"
            title="Home"
            address={homeAddress}
            placeholder="Agregar dirección"
            onChange={setHomeAddress}
            onCardPress={handleCardPress}
          />
        </View>
      </View>

      {/* Formulario de direcciones con react-autosuggest */}
      <View style={styles.formContainer}>
        <AddressAutosuggest
          value={addressStart}
          onChange={setAddressStart}
          placeholder="My Location"
        />
        <AddressAutosuggest
          value={addressEnd}
          onChange={setAddressEnd}
          placeholder="Where to?"
        />
        <Button title="Agregar Direcciones" onPress={handleAddMarkerFromAddress} color="#900020" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  goAgainContainer: {
    position: "absolute",
    top: 500,
    left: "48%",
    transform: [{ translateX: "-50%" }],
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    margin: 10,
    width: "90%",
    maxWidth: 500,
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  goAgainTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
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