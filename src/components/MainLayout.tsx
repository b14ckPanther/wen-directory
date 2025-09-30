'use client';

import React from 'react';
import { usePathname } from 'next/navigation'; // Import usePathname
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ChatWidget from '@/components/ChatWidget';
import { LocationProvider, useLocation } from '@/context/LocationContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import LocationSelector from '@/components/LocationSelector';

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { isLocationModalOpen, closeLocationModal, setSelectedLocation } = useLocation();
  const { user } = useAuth();
  const pathname = usePathname(); // Get the current URL path

  // Determine if the user is currently inside the admin dashboard
  const isAdminDashboard = user?.role === 'admin' && pathname.startsWith('/dashboard/admin');

  return (
    <>
      {/* If the user is in the admin dashboard, render only the dashboard content */}
      {isAdminDashboard ? (
        children
      ) : (
        // Otherwise, render the standard public layout
        <>
          <Header />
          <main>{children}</main>
          <ChatWidget />
          <Footer />
        </>
      )}
      
      {/* The location selector is always available */}
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
    <AuthProvider>
      <LocationProvider>
        <LayoutContent>{children}</LayoutContent>
      </LocationProvider>
    </AuthProvider>
  );
}