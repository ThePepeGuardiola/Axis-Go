import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Definir el tipo Trip aquí ya que no está importado correctamente
export type Trip = {
  id: string;
  title: string;
  start: string;
  end: string;
  estimatedTime: string;
  favorite: boolean;
  date: Date | null;
};



interface TripsContextType {
  trips: Trip[];
  setTrips: React.Dispatch<React.SetStateAction<Trip[]>>;
}

const TripsContext = createContext<TripsContextType | undefined>(undefined);

export const TripsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [trips, setTrips] = useState<Trip[]>(initialTrips);

  // Cargar los viajes guardados al iniciar la app
  useEffect(() => {
    const loadTrips = async () => {
      try {
        const savedTrips = await AsyncStorage.getItem('trips');
        if (savedTrips) {
          const parsedTrips = JSON.parse(savedTrips);
          // Convertir las fechas string de nuevo a objetos Date
          const tripsWithDates = parsedTrips.map((trip: Trip) => ({
            ...trip,
            date: trip.date ? new Date(trip.date) : null,
          }));
          setTrips(tripsWithDates);
        } else {
          // Si no hay datos guardados, usar initialTrips
          await AsyncStorage.setItem('trips', JSON.stringify(initialTrips));
        }
      } catch (error) {
        console.error('Error al cargar los viajes:', error);
      }
    };
    loadTrips();
  }, []);

  // Guardar los viajes cada vez que cambian
  useEffect(() => {
    const saveTrips = async () => {
      try {
        const tripsToSave = trips.map(trip => ({
          ...trip,
          estimatedTime: trip.estimatedTime || 'No disponible'
        }));
        await AsyncStorage.setItem('trips', JSON.stringify(tripsToSave));
      } catch (error) {
        console.error('Error al guardar los viajes:', error);
      }
    };
    if (trips.length > 0) {
      saveTrips();
    }
  }, [trips]);

  return (
    <TripsContext.Provider value={{ trips, setTrips }}>
      {children}
    </TripsContext.Provider>
  );
};

export const useTrips = () => {
  const context = useContext(TripsContext);
  if (!context) {
    throw new Error('useTrips debe ser usado dentro de un TripsProvider');
  }
  return context;
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