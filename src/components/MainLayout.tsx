'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ChatModal from '@/components/ChatModal';
import { LocationProvider, useLocation } from '@/context/LocationContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { ChatProvider } from '@/context/ChatContext';
import LocationSelector from '@/components/LocationSelector';

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { isLocationModalOpen, closeLocationModal, setSelectedLocation } = useLocation();
  const { user } = useAuth();
  const pathname = usePathname();

  // This is the crucial logic: check if the current path is part of the admin dashboard
  const isAdminDashboard = pathname.startsWith('/dashboard/admin');

  return (
    <>
      {/* If the user is on an admin dashboard page, only render the dashboard's own layout */}
      {isAdminDashboard ? (
        children
      ) : (
        // For all other pages, render the standard public layout
        <>
          <Header />
          <main>{children}</main>
          <Footer />
        </>
      )}
      
      {/* These components are available globally, but we can hide the chat on the dash */}
      {!isAdminDashboard && <ChatModal />}
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
        <ChatProvider>
          <LayoutContent>{children}</LayoutContent>
        </ChatProvider>
      </LocationProvider>
    </AuthProvider>
  );
}