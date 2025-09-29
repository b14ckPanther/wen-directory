'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ChatWidget from '@/components/ChatWidget';
import { LocationProvider, useLocation } from '@/context/LocationContext';
import LocationSelector from '@/components/LocationSelector'; // 1. Import LocationSelector

// Create a new component to access the context hook
function LayoutContent({ children }: { children: React.ReactNode }) {
  // 2. Get shared state from the context
  const { isLocationModalOpen, closeLocationModal, setSelectedLocation } = useLocation();

  return (
    <>
      <Header />
      <main>{children}</main>
      <ChatWidget />
      <Footer />
      
      {/* 3. Render the single, centralized modal here */}
      <LocationSelector
        isOpen={isLocationModalOpen}
        onClose={closeLocationModal}
        onSelect={setSelectedLocation}
      />
    </>
  );
}


export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    // The provider remains here, wrapping the content
    <LocationProvider>
      <LayoutContent>{children}</LayoutContent>
    </LocationProvider>
  );
}