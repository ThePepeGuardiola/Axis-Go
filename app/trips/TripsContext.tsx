import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Trip = {
  id: string;
  title: string;
  start: string;
  end: string;
  estimatedTime: string;
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

interface TripsContextType {
  trips: Trip[];
  setTrips: React.Dispatch<React.SetStateAction<Trip[]>>;
}

const TripsContext = createContext<TripsContextType | undefined>(undefined);

export const TripsProvider = ({ children }: { children: ReactNode }) => {
  const [trips, setTrips] = useState<Trip[]>(initialTrips);
  return (
    <TripsContext.Provider value={{ trips, setTrips }}>
      {children}
    </TripsContext.Provider>
  );
};

export const useTrips = () => {
  const context = useContext(TripsContext);
  if (!context) throw new Error('useTrips must be used within a TripsProvider');
  return context;
}; 