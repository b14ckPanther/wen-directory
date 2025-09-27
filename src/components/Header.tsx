'use client'; 

import React, { useState, useEffect } from 'react';
import { Search, Menu, UserCircle, PlusCircle, X, Home, LayoutGrid } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);

  const navLinks = [
    { href: "#", text: "الرئيسية", icon: Home },
    { href: "#", text: "الفئات", icon: LayoutGrid },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-navy/70 backdrop-blur-xl border-b border-gold/20">
        <nav className="container mx-auto flex items-center justify-between p-4 h-20 text-gray">
          
          <div className="flex items-center gap-8">
            {/* Logo with custom fonts applied */}
            <div className="text-3xl font-bold text-gold">
              <span className="font-dancing text-4xl">Wen</span> 
            </div>
            
            <div className="hidden lg:flex items-center gap-6 font-semibold">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                 <a key={link.text} href={link.href} className="flex items-center gap-2 text-gray hover:text-gold transition-colors duration-300">
                  <Icon size={20} />
                  {link.text}
                </a>
              )})}
            </div>
          </div>

          <div className="hidden md:flex flex-1 justify-center px-8">
            <div className="relative w-full max-w-lg group">
              <input
                type="text"
                placeholder="ابحث عن أي خدمة..."
                className="w-full bg-[#1B2A41]/80 text-gray border-2 border-transparent rounded-full py-2.5 pr-12 pl-5 focus:outline-none focus:border-gold/50 focus:bg-[#0B132B] transition-all duration-300"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray/60 group-focus-within:text-gold transition-colors duration-300">
                <Search size={22} />
              </div>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-4">
            <a href="#" className="flex items-center gap-2 text-gray hover:text-gold transition-colors font-semibold">
              <PlusCircle size={20} />
              انضم لنا
            </a>
            <button className="bg-gradient-to-br from-gold to-yellow-500 text-navy font-bold py-2.5 px-6 rounded-full hover:opacity-90 transition-all flex items-center gap-2 shadow-lg shadow-gold/20 hover:shadow-xl hover:shadow-gold/30 transform hover:scale-105">
              <UserCircle size={20} />
              تسجيل الدخول
            </button>
          </div>

          <div className="flex items-center gap-4 md:hidden">
            <button className="text-gray hover:text-gold transition-colors">
              <UserCircle size={28} />
            </button>
            <button onClick={() => setIsMenuOpen(true)} className="text-gray hover:text-gold transition-colors">
              <Menu size={28} />
            </button>
          </div>
        </nav>
      </header>

      <div
        className={`fixed inset-0 z-50 bg-navy/90 backdrop-blur-2xl transition-transform duration-500 ease-in-out md:hidden ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="container mx-auto p-4 flex flex-col h-full">
          <div className="flex items-center justify-between mb-10">
            {/* Mobile menu logo with custom fonts applied */}
            <div className="text-2xl font-bold text-gold">
               <span className="font-dancing text-3xl">Wen</span> 
            </div>
            <button onClick={() => setIsMenuOpen(false)} className="text-gray hover:text-gold transition-colors p-2">
              <X size={32} />
            </button>
          </div>
          
          <div className="flex flex-col items-center justify-center flex-grow gap-6 text-xl font-semibold">
             <div className="relative w-full max-w-sm mb-4">
              <input
                type="text"
                placeholder="ابحث عن أي خدمة..."
                className="w-full bg-[#1B2A41] text-gray border border-gold/50 rounded-full py-3 pr-12 pl-5 focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gold">
                <Search size={22} />
              </div>
            </div>

            <a href="#" className="w-full text-center p-4 rounded-lg flex items-center justify-center gap-3 text-gray hover:text-navy hover:bg-gold transition-all duration-300">
              <Home size={24} />
              الرئيسية
            </a>
             <a href="#" className="w-full text-center p-4 rounded-lg flex items-center justify-center gap-3 text-gray hover:text-navy hover:bg-gold transition-all duration-300">
              <LayoutGrid size={24} />
              الفئات
            </a>
            <a href="#" className="w-full text-center p-4 rounded-lg flex items-center justify-center gap-3 text-gray hover:text-navy hover:bg-gold transition-all duration-300">
              <PlusCircle size={24} />
              انضم لنا
            </a>
          </div>

          <div className="py-6">
             <a href="#" className="w-full p-4 rounded-lg flex items-center justify-center gap-3 text-lg font-semibold text-gold border-2 border-gold hover:bg-gold hover:text-navy transition-all duration-300">
              <UserCircle size={24} />
              تسجيل الدخول
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

