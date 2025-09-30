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
  const pathname = usePathname();

  // Pages like login, register, and dashboards should have their own dedicated layouts.
  const isStandalonePage = pathname.startsWith('/dashboard') || pathname === '/login' || pathname === '/register';

  return (
    <>
      {/* If the user is on any standalone page, only render that page's content */}
      {isStandalonePage ? (
        children
      ) : (
        // For all public pages, render the standard layout
        <>
          <Header />
          <main>{children}</main>
          <Footer />
        </>
      )}
      
      {/* The ChatModal and LocationSelector are available globally, but we hide the chat on dashboards */}
      {!isStandalonePage && <ChatModal />}
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

