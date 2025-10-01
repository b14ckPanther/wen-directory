'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ChatModal from '@/components/ChatModal';
import { LocationProvider, useLocation } from '@/context/LocationContext';
import { AuthProvider, useAuth } from '@/context/AuthContext'; // Import useAuth
import { ChatProvider } from '@/context/ChatContext';
import LocationSelector from '@/components/LocationSelector';
import AddToHomeScreen from '@/components/AddToHomeScreen';
import Loader from '@/components/Loader'; // Import your Loader component

// This new component decides what to show based on auth state
function LayoutContent({ children }: { children: React.ReactNode }) {
  const { isLocationModalOpen, closeLocationModal, setSelectedLocation } = useLocation();
  const { loading: authLoading } = useAuth(); // Get the loading state from AuthContext
  const pathname = usePathname();

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => console.log('Service Worker registered with scope:', registration.scope))
        .catch((error) => console.error('Service Worker registration failed:', error));
    }
  }, []);

  // While the initial auth check is running, show a full-page loader.
  // This is the key to preventing the blank screen.
  if (authLoading) {
    return <Loader />;
  }

  const isStandalonePage = pathname.startsWith('/dashboard') || pathname === '/login' || pathname === '/register';

  return (
    <>
      {isStandalonePage ? (
        children
      ) : (
        <>
          <Header />
          <main>{children}</main>
          <Footer />
        </>
      )}
      
      {!isStandalonePage && <ChatModal />}
      <LocationSelector
        isOpen={isLocationModalOpen}
        onClose={closeLocationModal}
        onSelect={setSelectedLocation}
      />
      <AddToHomeScreen />
    </>
  );
}

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    // The order of providers is important. AuthProvider should wrap Location/Chat providers.
    <AuthProvider>
      <LocationProvider>
        <ChatProvider>
          <LayoutContent>{children}</LayoutContent>
        </ChatProvider>
      </LocationProvider>
    </AuthProvider>
  );
}