'use client';

import React, { useEffect } from 'react';
import Sidebar from '@/app/dashboard/admin/components/Sidebar';
import Header from '@/app/dashboard/admin/components/Header';
import { useAuth } from '@/context/AuthContext';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (user?.role === 'admin') {
        logout();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [user, logout]);

  return (
    <div className="flex h-screen bg-navy text-gray-200 font-sans">
      {/* Sidebar fixed on the right */}
      <Sidebar />

      {/* Content shifted left with padding-right to respect sidebar width */}
      <div className="flex-1 flex flex-col overflow-hidden pr-20">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#0A1024] p-6">
          {children}
        </main>
      </div>
    </div>
  );
}