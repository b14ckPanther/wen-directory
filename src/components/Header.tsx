'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  Menu,
  UserCircle,
  PlusCircle,
  X,
  Home,
  LayoutGrid,
  MapPin,
} from 'lucide-react';
import LocationSelector from '@/components/LocationSelector';

type HeaderProps = {
  selectedLocation: string;
  setSelectedLocation: (loc: string) => void;
};

export default function Header({
  selectedLocation,
  setSelectedLocation,
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);

  // Prevent background scrolling when a modal is open
  useEffect(() => {
    const bodyStyle = document.body.style;
    if (isMenuOpen || isLocationOpen) {
      bodyStyle.overflow = 'hidden';
    } else {
      bodyStyle.overflow = 'auto';
    }
    return () => {
      bodyStyle.overflow = 'auto';
    };
  }, [isMenuOpen, isLocationOpen]);

  const navLinks = [
    { href: '#', text: 'الرئيسية', icon: Home },
    { href: '#', text: 'الفئات', icon: LayoutGrid },
  ];

  return (
    <>
      {/* Main Header */}
      <header className="sticky top-0 z-50 bg-navy/70 backdrop-blur-xl border-b border-gold/20">
        <nav className="container mx-auto flex items-center justify-between p-4 h-20 text-gray">
          {/* Left Section */}
          <div className="flex items-center gap-8">
            <div className="text-3xl font-bold text-gold">
              <span className="font-dancing text-4xl">Wen</span>
            </div>

            <div className="hidden lg:flex items-center gap-6 font-semibold">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.text}
                    href={link.href}
                    className="flex items-center gap-2 text-gray hover:text-gold transition-colors duration-300"
                  >
                    <Icon size={20} />
                    {link.text}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Center Section: Location + Search (Desktop) */}
          <div className="hidden md:flex flex-1 justify-center px-8 items-center gap-4">
            <button
              onClick={() => setIsLocationOpen(true)}
              className="flex items-center gap-2 bg-[#1B2A41]/80 rounded-full py-2.5 px-5 hover:bg-gold/10 transition-colors flex-shrink-0"
            >
              <MapPin size={20} className="text-gold" />
              <span className="font-semibold text-sm whitespace-nowrap">
                {selectedLocation}
              </span>
            </button>

            <div className="relative w-full max-w-md group">
              <input
                type="text"
                placeholder="ابحث عن أي خدمة..."
                className="w-full bg-[#1B2A41]/80 text-gray border-2 border-transparent rounded-full py-2.5 pr-12 pl-5 focus:outline-none focus:border-gold/50 focus:bg-[#0B132B] transition-all"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray/60 group-focus-within:text-gold transition-colors">
                <Search size={22} />
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="#"
              className="flex items-center gap-2 text-gray hover:text-gold transition-colors font-semibold"
            >
              <PlusCircle size={20} />
              انضم لنا
            </a>
            <button className="bg-gradient-to-br from-gold to-yellow-500 text-navy font-bold py-2.5 px-6 rounded-full hover:opacity-90 transition-all flex items-center gap-2 shadow-lg shadow-gold/20 transform hover:scale-105">
              <UserCircle size={20} />
              تسجيل الدخول
            </button>
          </div>

          {/* Mobile Buttons */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setIsLocationOpen(true)}
              className="text-gray hover:text-gold transition-colors p-2"
            >
              <MapPin size={28} />
            </button>
            <button
              onClick={() => setIsMenuOpen(true)}
              className="text-gray hover:text-gold transition-colors p-2"
            >
              <Menu size={28} />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Slide-out Menu */}
      <div
        className={`fixed inset-0 z-[60] bg-navy/90 backdrop-blur-2xl transition-transform duration-500 ease-in-out md:hidden ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="container mx-auto p-4 flex flex-col h-full">
          <div className="flex items-center justify-between mb-10">
            <div className="text-2xl font-bold text-gold">
              <span className="font-dancing text-3xl">Wen</span>
            </div>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="text-gray hover:text-gold transition-colors p-2"
            >
              <X size={32} />
            </button>
          </div>

          <div className="flex flex-col items-center justify-center flex-grow gap-6 text-xl font-semibold">
            <div className="relative w-full max-w-sm mb-4">
              <input
                type="text"
                placeholder="ابحث عن أي خدمة..."
                className="w-full bg-[#1B2A41] text-gray border border-gold/50 rounded-full py-3 pr-12 pl-5 focus:outline-none focus:ring-2 focus:ring-gold/50"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gold">
                <Search size={22} />
              </div>
            </div>

            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.text}
                  href={link.href}
                  className="w-full text-center p-4 rounded-lg flex items-center justify-center gap-3 text-gray hover:text-navy hover:bg-gold transition-all"
                >
                  <Icon size={24} />
                  {link.text}
                </a>
              );
            })}
            <a
              href="#"
              className="w-full text-center p-4 rounded-lg flex items-center justify-center gap-3 text-gray hover:text-navy hover:bg-gold transition-all"
            >
              <PlusCircle size={24} />
              انضم لنا
            </a>
          </div>

          <div className="py-6">
            <a
              href="#"
              className="w-full p-4 rounded-lg flex items-center justify-center gap-3 text-lg font-semibold text-gold border-2 border-gold hover:bg-gold hover:text-navy transition-all"
            >
              <UserCircle size={24} />
              تسجيل الدخول
            </a>
          </div>
        </div>
      </div>

      {/* Location Selector Modal */}
      <LocationSelector
        isOpen={isLocationOpen}
        onClose={() => setIsLocationOpen(false)}
        onSelect={setSelectedLocation}
      />
    </>
  );
}
