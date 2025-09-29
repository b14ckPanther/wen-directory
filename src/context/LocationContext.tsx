'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';

// 1. Add modal state and functions to the context type
type LocationContextType = {
  selectedLocation: string;
  setSelectedLocation: (location: string) => void;
  isLocationModalOpen: boolean;
  openLocationModal: () => void;
  closeLocationModal: () => void;
};

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: ReactNode }) {
  const [selectedLocation, setSelectedLocation] = useState('كل المناطق');
  // 2. Add state for the modal's visibility
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  const openLocationModal = () => setIsLocationModalOpen(true);
  const closeLocationModal = () => setIsLocationModalOpen(false);

  const value = {
    selectedLocation,
    setSelectedLocation,
    isLocationModalOpen,
    openLocationModal,
    closeLocationModal,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}