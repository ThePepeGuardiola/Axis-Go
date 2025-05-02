import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Pressable,
  Switch,
  Platform,
} from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BottomNav } from '../components/Dashboard_Footer';
import { useTrips } from '../trips/TripsContext';
import { saveTrip } from '../trips/tripService';

// Tipos para los viajes
type Trip = {
  id: string;
  title: string;
  start: string;
  end: string;
  estimatedTime: string;
  favorite: boolean;
  date: Date | null;
};

type TripForm = {
  title: string;
  start: string;
  end: string;
  favorite: boolean;
  date: Date | null;
};

const initialTrips: Trip[] = [
  {
    id: '1',
    title: 'Viaje a la playa',
    start: 'Mi ubicación',
    end: 'Playa del Sol',
    estimatedTime: '45 min',
    favorite: true,
    date: new Date(),
  },
  {
    id: '2',
    title: 'Trabajo',
    start: 'Casa',
    end: 'Oficina',
    estimatedTime: '30 min',
    favorite: false,
    date: null,
  },
];

const GOOGLE_MAPS_APIKEY = 'AIzaSyC7mGVZuJBQoyjHxGDwoV3xtRbrhpADEX0';

const TripsScreen: React.FC = () => {
  const { trips, setTrips } = useTrips();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [form, setForm] = useState<TripForm>({
    title: '',
    start: '',
    end: '',
    favorite: false,
    date: null,
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateInput, setDateInput] = useState(''); // Para web
  // Para el picker tipo rueda en web
  const [showWheelPicker, setShowWheelPicker] = useState(false);
  const [wheelDay, setWheelDay] = useState('today');
  const [wheelHour, setWheelHour] = useState('2');
  const [wheelMinute, setWheelMinute] = useState('00');
  const [wheelAMPM, setWheelAMPM] = useState('AM');
  const navigation = useNavigation();

  // Filter trips based on showOnlyFavorites state
  const filteredTrips = showOnlyFavorites ? trips.filter(trip => trip.favorite) : trips;

  const openModal = (trip: Trip | null = null) => {
    setEditingTrip(trip);
    if (trip) {
      setForm({
        title: trip.title,
        start: trip.start,
        end: trip.end,
        favorite: trip.favorite,
        date: trip.date,
      });
    } else {
      setForm({ title: '', start: '', end: '', favorite: false, date: null });
    }
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingTrip(null);
  };

  // Función para obtener el tiempo estimado usando Google Directions API

  // Example client-side code
  const fetchEstimatedTime = async (origin: string, destination: string) => {
    try {
      const response = await fetch(
        `http://localhost:5050/api/directions?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error:', error);
      // Return a default response structure
      return {
        routes: [{
          legs: [{
            duration: { text: 'No disponible' }
          }]
        }]
      };
    }
  };

  
// const fetchEstimatedTime = async (origin: string, destination: string) => {
//   try {
//     const response = await fetch(
//       `http://localhost:5050/api/directions?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`
//     );
//     console.log(`http://localhost:5050/api/directions?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`);
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error('Error:', error);
//     throw error;
//   }
// };


// const handleSave = async () => {
//   if (!form.title || !form.start || !form.end) return;
  
//   try {
//     const response = await fetchEstimatedTime(form.start, form.end);
//     const estimatedTime = response?.routes[0]?.legs[0]?.duration?.text || 'No disponible';

//     const tripData = {
//       title: form.title,
//       start: form.start,
//       end: form.end,
//       estimatedTime,
//       favorite: form.favorite,
//       date: form.date,
//     };

//     if (editingTrip) {
//       // Actualizar viaje existente
//       const updatedTrip = await tripService.updateTrip(editingTrip.id, tripData);
//       setTrips(trips.map(t => t.id === editingTrip.id ? { ...updatedTrip, date: updatedTrip.date ? new Date(updatedTrip.date) : null } : t));
//     } else {
//       // Crear nuevo viaje
//       const newTrip = await tripService.createTrip(tripData);
//       setTrips([...trips, { ...newTrip, date: newTrip.date ? new Date(newTrip.date) : null }]);
//     }
//     closeModal();
//   } catch (error) {
//     console.error('Error al guardar el viaje:', error);
//     // Alert.alert('Error', 'No se pudo guardar el viaje');
//   }
// };

const handleSave = async () => {
  if (!form.title || !form.start || !form.end) return;

  try {
    const tripData = {
      origin: 'Santo Domingo',
      destination: 'Santiago',
      distance: '155 km',
      duration: '2 horas',
    };

    const savedTrip = await saveTrip(tripData);
    console.log('Viaje guardado:', savedTrip);
  } catch (error) {
    console.error('Error al guardar el viaje:', error);
  }
  
  try {
    const response = await fetchEstimatedTime(form.start, form.end);
    const estimatedTime = response?.routes[0]?.legs[0]?.duration?.text || 'No disponible';

    if (editingTrip) {
      setTrips(trips.map(t => 
        t.id === editingTrip.id 
          ? { ...editingTrip, ...form, estimatedTime } 
          : t
      ));
    } else {
      setTrips([
        ...trips,
        {
          ...form,
          id: Date.now().toString(),
          estimatedTime,
        },
      ]);
    }
    closeModal();
  } catch (error) {
    console.error('Error al guardar el viaje:', error);
    // Optionally show an error message to the user
  }
};

  const handleDelete = (id: string) => {
    setTrips(trips.filter(t => t.id !== id));
  };

  const handleFavorite = (id: string) => {
    setTrips(trips.map(t => t.id === id ? { ...t, favorite: !t.favorite } : t));
  };

  // Generar días próximos (hoy + 6 días)
  const getDaysOptions = () => {
    const days = [];
    const now = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() + i);
      if (i === 0) {
        days.push({ label: 'Today', value: 'today', date: d });
      } else {
        days.push({
          label: d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }),
          value: d.toISOString().slice(0, 10),
          date: d,
        });
      }
    }
    return days;
  };

  // Al guardar la selección del picker
  const handleWheelPickerSave = () => {
    // Obtener la fecha base
    let baseDate;
    if (wheelDay === 'today') {
      baseDate = new Date();
    } else {
      baseDate = new Date(wheelDay + 'T00:00');
    }
    let hour = parseInt(wheelHour, 10);
    if (wheelAMPM === 'PM' && hour < 12) hour += 12;
    if (wheelAMPM === 'AM' && hour === 12) hour = 0;
    baseDate.setHours(hour);
    baseDate.setMinutes(parseInt(wheelMinute, 10));
    baseDate.setSeconds(0);
    setForm({ ...form, date: baseDate });
    setShowWheelPicker(false);
  };

  // Navegar a favoritos y pasar los viajes favoritos
  const goToFavorites = () => {
    const favorites = trips.filter(t => t.favorite);
    // @ts-ignore
    navigation.navigate('list', { favorites });
  };

  const renderTrip = ({ item }: { item: Trip }) => (
    <View style={styles.card}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <TouchableOpacity onPress={() => handleFavorite(item.id)}>
          <Ionicons name={item.favorite ? 'star' : 'star-outline'} size={24} color={item.favorite ? '#FF5A5F' : '#bbb'} />
        </TouchableOpacity>
      </View>
      <View style={styles.cardRow}>
        <MaterialIcons name="place" size={18} color="#FF5A5F" />
        <Text style={styles.cardText}>{item.start}</Text>
      </View>
      <View style={styles.cardRow}>
        <MaterialIcons name="flag" size={18} color="#4F8EF7" />
        <Text style={styles.cardText}>{item.end}</Text>
      </View>
      <View style={styles.cardRow}>
        <FontAwesome name="clock-o" size={16} color="#888" />
        <Text style={styles.cardText}>{item.estimatedTime}</Text>
      </View>
      {item.date && (
        <View style={styles.cardRow}>
          <Ionicons name="calendar" size={16} color="#888" />
          <Text style={styles.cardText}>{item.date.toLocaleString()}</Text>
        </View>
      )}
      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => openModal(item)}>
          <Ionicons name="create-outline" size={20} color="#4F8EF7" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => handleDelete(item.id)}>
          <Ionicons name="trash-outline" size={20} color="#FF5A5F" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mis Viajes</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={[styles.filterBtn, showOnlyFavorites && styles.filterBtnActive]} 
            onPress={() => setShowOnlyFavorites(!showOnlyFavorites)}
          >
            <Ionicons 
              name="star" 
              size={20} 
              color={showOnlyFavorites ? '#fff' : '#FF5A5F'} 
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.addBtn} onPress={() => openModal()}>
            <Ionicons name="add" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={filteredTrips}
        keyExtractor={item => item.id}
        renderItem={renderTrip}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', color: '#888', marginTop: 40 }}>
            {showOnlyFavorites ? 'No hay viajes favoritos.' : 'No hay viajes aún.'}
          </Text>
        }
      />
      {/* Modal para crear/editar viaje */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editingTrip ? 'Editar Viaje' : 'Nuevo Viaje'}</Text>
            <TextInput
              style={styles.input}
              placeholder="Título"
              value={form.title}
              onChangeText={text => setForm({ ...form, title: text })}
              placeholderTextColor="#bbb"
            />
            <TextInput
              style={styles.input}
              placeholder="Punto de comienzo"
              value={form.start}
              onChangeText={text => setForm({ ...form, start: text })}
              placeholderTextColor="#bbb"
            />
            <TextInput
              style={styles.input}
              placeholder="Punto de llegada"
              value={form.end}
              onChangeText={text => setForm({ ...form, end: text })}
              placeholderTextColor="#bbb"
            />
            <View style={styles.rowBetween}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="star" size={20} color={form.favorite ? '#FF5A5F' : '#bbb'} />
                <Text style={{ marginLeft: 8 }}>Favorito</Text>
              </View>
              <Switch
                value={form.favorite}
                onValueChange={val => setForm({ ...form, favorite: val })}
                thumbColor={form.favorite ? '#FF5A5F' : '#ccc'}
                trackColor={{ false: '#ccc', true: '#FFD1DC' }}
              />
            </View>
            {/* Fecha: solo para web, picker tipo rueda */}
            {Platform.OS === 'web' ? (
              <View style={{ marginBottom: 16 }}>
                <Pressable
                  style={styles.dateBtn}
                  onPress={() => setShowWheelPicker(true)}
                >
                  <Ionicons name="calendar" size={20} color="#4F8EF7" />
                  <Text style={{ marginLeft: 8 }}>
                    {form.date ? form.date.toLocaleString() : 'Selecciona fecha y hora'}
                  </Text>
                </Pressable>
                {showWheelPicker && (
                  <View style={{
                    backgroundColor: '#fff',
                    borderRadius: 16,
                    padding: 20,
                    marginTop: 10,
                    alignItems: 'center',
                    boxShadow: '0 2px 16px rgba(0,0,0,0.12)',
                    zIndex: 100,
                  }}>
                    <div style={{ display: 'flex', flexDirection: 'row', gap: 12 }}>
                      <select
                        value={wheelDay}
                        onChange={e => setWheelDay(e.target.value)}
                        style={{ fontSize: 18, padding: 6, borderRadius: 8 }}
                      >
                        {getDaysOptions().map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                      <select
                        value={wheelHour}
                        onChange={e => setWheelHour(e.target.value)}
                        style={{ fontSize: 18, padding: 6, borderRadius: 8 }}
                      >
                        {[...Array(12)].map((_, i) => {
                          const val = (i + 1).toString();
                          return <option key={val} value={val}>{val}</option>;
                        })}
                      </select>
                      <select
                        value={wheelMinute}
                        onChange={e => setWheelMinute(e.target.value)}
                        style={{ fontSize: 18, padding: 6, borderRadius: 8 }}
                      >
                        {['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'].map(val => (
                          <option key={val} value={val}>{val}</option>
                        ))}
                      </select>
                      <select
                        value={wheelAMPM}
                        onChange={e => setWheelAMPM(e.target.value)}
                        style={{ fontSize: 18, padding: 6, borderRadius: 8 }}
                      >
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                      </select>
                    </div>
                    <div style={{ marginTop: 18, display: 'flex', gap: 10 }}>
                      <button
                        style={{
                          background: '#4F8EF7', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 22px', fontSize: 16, cursor: 'pointer', fontWeight: 600,
                        }}
                        onClick={handleWheelPickerSave}
                      >Aceptar</button>
                      <button
                        style={{
                          background: '#fff', color: '#4F8EF7', border: '1.5px solid #4F8EF7', borderRadius: 8, padding: '8px 22px', fontSize: 16, cursor: 'pointer', fontWeight: 600,
                        }}
                        onClick={() => setShowWheelPicker(false)}
                      >Cancelar</button>
                    </div>
                  </View>
                )}
              </View>
            ) : (
              <Pressable
                style={styles.dateBtn}
                onPress={() => setShowDatePicker(true)}
              >
                <Ionicons name="calendar" size={20} color="#4F8EF7" />
                <Text style={{ marginLeft: 8 }}>
                  {form.date ? form.date.toLocaleString() : 'Programar fecha (opcional)'}
                </Text>
              </Pressable>
            )}
            {showDatePicker && Platform.OS !== 'web' && (
              <DateTimePicker
                value={form.date || new Date()}
                mode="datetime"
                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                onChange={(event: DateTimePickerEvent, selectedDate?: Date | undefined) => {
                  setShowDatePicker(false);
                  if (selectedDate) setForm({ ...form, date: selectedDate });
                }}
              />
            )}
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>{editingTrip ? 'Guardar' : 'Crear'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelBtn} onPress={closeModal}>
                <Text style={{ color: '#FF5A5F' }}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <BottomNav />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  filterBtn: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FF5A5F',
  },
  filterBtnActive: {
    backgroundColor: '#FF5A5F',
    borderColor: '#FF5A5F',
  },
  addBtn: {
    backgroundColor: '#FF5A5F',
    borderRadius: 20,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  cardText: {
    marginLeft: 8,
    color: '#444',
    fontSize: 15,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  actionBtn: {
    marginLeft: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 18,
    color: '#222',
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#F3F3F3',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    color: '#222',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  dateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F3F3',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  saveBtn: {
    backgroundColor: '#4F8EF7',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  cancelBtn: {
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF5A5F',
    marginLeft: 10,
  },
  bottomNav: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 8,
  },
  centerBtn: {
    backgroundColor: '#FF5A5F',
    borderRadius: 32,
    padding: 10,
    marginTop: -28,
    shadowColor: '#FF5A5F',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default TripsScreen; 