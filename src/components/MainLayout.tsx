'use client';

import React, { useEffect } from 'react'; // Import useEffect
import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ChatModal from '@/components/ChatModal';
import { LocationProvider, useLocation } from '@/context/LocationContext';
import { AuthProvider } from '@/context/AuthContext';
import { ChatProvider } from '@/context/ChatContext';
import LocationSelector from '@/components/LocationSelector';
import AddToHomeScreen from '@/components/AddToHomeScreen';

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { isLocationModalOpen, closeLocationModal, setSelectedLocation } = useLocation();
  const pathname = usePathname();

  // Add this useEffect to register the service worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => console.log('Service Worker registered with scope:', registration.scope))
        .catch((error) => console.error('Service Worker registration failed:', error));
    }
  }, []);

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
    <AuthProvider>
      <LocationProvider>
        <ChatProvider>
          <LayoutContent>{children}</LayoutContent>
        </ChatProvider>
      </LocationProvider>
    </AuthProvider>
  );
}