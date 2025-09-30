import React from 'react';
import Sidebar from '@/app/dashboard/owner/components/Sidebar';

export default function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#0A1024] text-gray-200 font-sans">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6">
        {children}
      </main>
    </div>
  );
}