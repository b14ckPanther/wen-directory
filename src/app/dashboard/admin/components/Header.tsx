'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Bell, ChevronDown, LogOut, User, Settings, HelpCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

// -----------------------------
// Custom hook: Real-time clock
// -----------------------------
const useDateTime = () => {
  const [dateTime, setDateTime] = useState<Date>(new Date());

  useEffect(() => {
    const id = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return dateTime;
};

// -----------------------------
// Custom hook: Detect clicks outside
// -----------------------------
const useClickOutside = (
  ref: React.RefObject<HTMLDivElement | null>,
  handler: () => void
) => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler();
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
};


// -----------------------------
// Component: Header
// -----------------------------
export default function Header() {
  const pathname = usePathname();
  const dateTime = useDateTime();
  const { logout, user } = useAuth();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown on outside click
  useClickOutside(dropdownRef, () => setIsDropdownOpen(false));

  // Dynamic title based on route
  const getTitle = () => {
    if (pathname.includes('/businesses/form')) return 'إدارة الأعمال / نموذج';
    if (pathname.includes('/businesses')) return 'إدارة الأعمال';
    if (pathname.includes('/users')) return 'إدارة المستخدمين';
    if (pathname.includes('/categories')) return 'إدارة الفئات';
    if (pathname.includes('/settings')) return 'الإعدادات العامة';
    return 'لوحة التحكم الرئيسية';
  };

  // Format date/time (Arabic)
  const formattedDate = new Intl.DateTimeFormat('ar-EG-u-nu-latn', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateTime);

  const formattedTime = dateTime.toLocaleTimeString('ar-EG-u-nu-latn', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  // Animations
  const dropdownVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95, y: -10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.2, ease: 'easeOut' },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: -10,
      transition: { duration: 0.15, ease: 'easeIn' },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <header className="flex-shrink-0 bg-[#1B2A41]/50 backdrop-blur-xl border-b border-gold/20 h-24 px-6 z-30 relative">
      {/* Animated Gradient Line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent animate-hologram-border" />

      <div className="flex items-center justify-between h-full">
        {/* Left Section: Title + Clock */}
        <div>
          <motion.h1
            key={getTitle()}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-white tracking-wide"
          >
            {getTitle()}
          </motion.h1>
          <p className="text-sm text-gray-400 font-mono tracking-wider">
            {formattedDate} - {formattedTime}
          </p>
        </div>

        {/* Right Section: Notifications + Profile */}
        <div className="flex items-center gap-6">
          {/* Notification Bell */}
          <button className="relative p-2 rounded-full text-gray-400 hover:text-gold hover:bg-gold/10 transition-colors">
            <Bell size={22} />
            <span className="absolute top-1 right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-[#1B2A41]"></span>
            </span>
          </button>

          {/* User Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className="flex items-center gap-3"
            >
              <div className="relative w-12 h-12">
                <div className="w-full h-full rounded-full bg-gold flex items-center justify-center text-navy text-xl font-bold border-2 border-gold/50 shadow-lg shadow-gold/20">
                  {user?.name?.[0]?.toUpperCase() || 'A'}
                </div>
                <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-[#1B2A41]" />
              </div>
              <div>
                <p className="text-md font-semibold text-white">
                  {user?.name || 'Admin'}
                </p>
                <p className="text-xs text-gray-400">N & D</p>
              </div>
              <motion.div
                animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown size={20} className="text-gray-400" />
              </motion.div>
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute top-full mt-4 right-0 w-60 bg-[#121c2c]/80 backdrop-blur-2xl border border-gold/20 rounded-xl shadow-2xl z-50 overflow-hidden"
                >
                  <motion.div
                    className="p-2"
                    initial="hidden"
                    animate="visible"
                    variants={{
                      visible: { transition: { staggerChildren: 0.05 } },
                    }}
                  >
                    <motion.a
                      variants={itemVariants}
                      href="#"
                      className="flex items-center gap-3 w-full p-3 text-sm text-gray-300 rounded-lg hover:bg-gold/10 hover:text-gold transition-colors"
                    >
                      <User size={18} />
                      <span>ملفي الشخصي</span>
                    </motion.a>
                    <motion.a
                      variants={itemVariants}
                      href="/dashboard/admin/settings"
                      className="flex items-center gap-3 w-full p-3 text-sm text-gray-300 rounded-lg hover:bg-gold/10 hover:text-gold transition-colors"
                    >
                      <Settings size={18} />
                      <span>الإعدادات</span>
                    </motion.a>
                    <motion.a
                      variants={itemVariants}
                      href="#"
                      className="flex items-center gap-3 w-full p-3 text-sm text-gray-300 rounded-lg hover:bg-gold/10 hover:text-gold transition-colors"
                    >
                      <HelpCircle size={18} />
                      <span>المساعدة</span>
                    </motion.a>
                    <div className="h-px bg-gold/20 my-2" />
                    <motion.button
                      variants={itemVariants}
                      onClick={logout}
                      className="flex items-center gap-3 w-full p-3 text-sm text-red-400 rounded-lg hover:bg-red-500/10 hover:text-red-300 transition-colors"
                    >
                      <LogOut size={18} />
                      <span>تسجيل الخروج</span>
                    </motion.button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
