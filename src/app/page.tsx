'use client';

import React from 'react';
import CategoryGrid from '@/components/CategoryGrid';
import { useLocation } from '@/context/LocationContext';
import { useChat } from '@/context/ChatContext';
import { Bot } from 'lucide-react';

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

export default function Home() {
  const { selectedLocation, openLocationModal } = useLocation();
  const { toggleChat } = useChat();

  return (
    <>
      <section className="w-full text-center py-20 md:py-32 bg-navy">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-gold leading-tight">
            ابحث، اكتشف، وتواصل
          </h1>
          <p className="text-lg md:text-xl text-gray mt-4 max-w-2xl mx-auto">
            وين هو دليلك الكامل لأحسن الخدمات والمهنيين بمنطقتك.
          </p>

          <div className="mt-6">
            <button
              onClick={openLocationModal}
              className="px-4 py-2 bg-gold/10 text-gold font-semibold rounded-full hover:bg-gold/20 transition"
            >
              موقعك الحالي: {selectedLocation}
            </button>
          </div>
          
          <div className="mt-8 max-w-2xl mx-auto">
            <form className="relative">
              <input
                type="text"
                placeholder="على شو بتدوّر؟"
                className="w-full bg-[#1B2A41] text-lg text-gray border-2 border-gold/50 rounded-full py-4 pr-16 pl-6 focus:outline-none focus:ring-2 focus:ring-gold"
              />
              <button
                type="submit"
                className="absolute inset-y-0 right-0 flex items-center justify-center bg-gold text-navy rounded-full w-14 h-14 m-1 hover:bg-opacity-90 transition-all"
                aria-label="بحث"
              >
                <SearchIcon />
              </button>
            </form>
            
            {/* --- كبسة المساعد الذكي (بس للموبايل) --- */}
            <div className="mt-6 text-center md:hidden">
              <button
                onClick={toggleChat}
                className="inline-flex items-center gap-2 px-5 py-2 bg-transparent border border-gold/40 text-gold font-semibold rounded-full hover:bg-gold/10 transition-colors duration-300"
              >
                <Bot size={20} />
                <span>مش مدبر حالك؟ اسألني</span>
              </button>
            </div>
            
          </div>
        </div>
      </section>

      {/* بعرض كل الفئات، وبتكون مسكّرة بالعادة */}
      <CategoryGrid />
      
    </>
  );
}