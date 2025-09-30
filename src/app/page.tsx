// src/app/page.tsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import CategoryGrid from '@/components/CategoryGrid';
import { useLocation } from '@/context/LocationContext';
import { useChat } from '@/context/ChatContext';
import { Bot, Search } from 'lucide-react';
import { motion, Variants } from 'framer-motion';

export default function Home() {
  const { selectedLocation, openLocationModal } = useLocation();
  const { toggleChat } = useChat();

  const [placeholder, setPlaceholder] = useState('');
  const searchSuggestions = useMemo(() => ["على شو بتدوّر؟", "مطاعم...", "أطباء...", "محامون...", "صالونات..."], []);

  useEffect(() => {
    let suggestionIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let timeoutId: NodeJS.Timeout;

    const type = () => {
      const currentSuggestion = searchSuggestions[suggestionIndex];
      const speed = isDeleting ? 75 : 150;

      if (isDeleting) {
        setPlaceholder(currentSuggestion.substring(0, charIndex - 1));
        charIndex--;
        if (charIndex === 0) {
          isDeleting = false;
          suggestionIndex = (suggestionIndex + 1) % searchSuggestions.length;
          timeoutId = setTimeout(type, 500); // Pause before typing new word
        } else {
          timeoutId = setTimeout(type, speed);
        }
      } else {
        setPlaceholder(currentSuggestion.substring(0, charIndex + 1));
        charIndex++;
        if (charIndex === currentSuggestion.length) {
          isDeleting = true;
          timeoutId = setTimeout(type, 2000); // Wait before deleting
        } else {
          timeoutId = setTimeout(type, speed);
        }
      }
    };

    timeoutId = setTimeout(type, 150);

    return () => clearTimeout(timeoutId);
  }, [searchSuggestions]);


  // Animation Variants for Framer Motion
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    },
  };

  return (
    <>
      <section className="relative w-full text-center py-20 md:py-32 bg-navy overflow-hidden">
        {/* Animated Starfield Background */}
        <div className="absolute inset-0 z-0 animate-star-field pointer-events-none"></div>

        <motion.div
          className="container relative z-10 mx-auto px-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="text-4xl md:text-6xl font-bold leading-tight bg-gradient-to-r from-amber-300 via-gold to-sky-400 bg-clip-text text-transparent animate-bg-pan bg-[200%_auto]"
            variants={itemVariants}
          >
            ابحث، اكتشف، وتواصل
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-gray/80 mt-4 max-w-2xl mx-auto"
            variants={itemVariants}
          >
            وين هو دليلك الكامل لأحسن الخدمات والمهنيين بمنطقتك.
          </motion.p>

          <motion.div className="mt-6" variants={itemVariants}>
            <button
              onClick={openLocationModal}
              className="px-4 py-2 bg-gold/10 text-gold font-semibold rounded-full hover:bg-gold/20 transition-transform hover:scale-105"
            >
              موقعك الحالي: {selectedLocation}
            </button>
          </motion.div>

          <motion.div className="mt-8 max-w-2xl mx-auto" variants={itemVariants}>
            <form className="relative group">
              <input
                type="text"
                placeholder={placeholder + '|'}
                className="w-full bg-[#1B2A41]/80 text-lg text-gray border-2 border-gold/30 rounded-full py-4 pl-6 pr-20 focus:outline-none focus:ring-4 focus:ring-gold/50 focus:border-gold/50 transition-all duration-300 shadow-lg"
              />
              <button
                type="submit"
                className="absolute inset-y-1.5 right-1.5 flex items-center justify-center bg-gold text-navy rounded-full w-14 h-14 transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-amber-300 group-hover:via-gold group-hover:to-sky-400 group-hover:animate-bg-pan group-hover:bg-[200%_auto] group-hover:shadow-lg group-hover:shadow-gold/40"
                aria-label="بحث"
              >
                <Search size={28} />
              </button>
            </form>

            <div className="mt-6 text-center md:hidden">
              <button
                onClick={toggleChat}
                className="inline-flex items-center gap-2 px-5 py-2 bg-transparent border border-gold/40 text-gold font-semibold rounded-full hover:bg-gold/10 transition-colors duration-300"
              >
                <Bot size={20} />
                <span>مش مدبر حالك؟ اسألني</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      </section>

      <CategoryGrid />
    </>
  );
}