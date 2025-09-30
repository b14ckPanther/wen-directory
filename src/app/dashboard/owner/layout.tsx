import React from 'react';
import Sidebar from '@/app/dashboard/owner/components/Sidebar';

export default function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#0A1024] text-gray-200 font-sans">
      {/* Sidebar fixed on the right */}
      <Sidebar />

      {/* Main content shifted left with margin to avoid overlap */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 mr-20">
        {children}
      </main>
    </div>
  );
}
