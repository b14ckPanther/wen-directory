'use client';

import React from 'react';
import { ChevronDown, Bell } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Header() {
    const pathname = usePathname();
    const getTitle = () => {
        if (pathname.includes('businesses')) return 'إدارة الأعمال';
        if (pathname.includes('users')) return 'إدارة المستخدمين';
        return 'لوحة التحكم الرئيسية';
    }

  return (
    <header className="flex-shrink-0 bg-[#1B2A41] border-b border-gray-800">
      <div className="flex items-center justify-between p-4 h-20">
        <h1 className="text-xl font-bold text-white">{getTitle()}</h1>
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full hover:bg-gold/10 text-gray-400 hover:text-gold">
            <Bell size={20} />
          </button>
          
          <div className="relative">
            <button className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gold flex items-center justify-center text-navy font-bold">
                A
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Admin</p>
                <p className="text-xs text-gray-400">Super Admin</p>
              </div>
              <ChevronDown size={16} className="text-gray-400" />
            </button>
             {/* Dropdown can be added here later */}
          </div>
        </div>
      </div>
    </header>
  );
}