// src/components/CategoryGrid.tsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, type LucideIcon } from 'lucide-react';
import TiltCard from './TiltCard';

// --- Define types to match the data structure from Supabase ---
type Subcategory = {
  id: number;
  name: string;
  slug: string;
  icon: LucideIcon;
  category_id: number;
};

type CategorySection = {
  id: number;
  name: string;
  title: string;
  description: string | null;
  slug: string;
  image: string | null;
  categories: Subcategory[];
};
// --- End type definitions ---


const gridContainerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const gridItemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

type CategoryGridProps = {
  sections: (CategorySection | undefined)[];
  openSections?: { [key: string]: boolean };
  onToggleSection?: (title: string) => void;
  startExpanded?: boolean;
};

export default function CategoryGrid(props: CategoryGridProps) {
  const {
    sections,
    openSections: controlledOpenSections,
    onToggleSection,
    startExpanded = false
  } = props;

  const isControlled = controlledOpenSections !== undefined && onToggleSection !== undefined;

  const [internalOpenSections, setInternalOpenSections] = useState(() => {
    if (startExpanded) {
      return (sections || []).reduce((acc, section) => {
        if (section) acc[section.title] = true;
        return acc;
      }, {} as { [key: string]: boolean });
    }
    return {};
  });

  const openSections = isControlled ? controlledOpenSections : internalOpenSections;
  
  const toggleSection = (title: string) => {
    if (isControlled) {
      onToggleSection?.(title);
    } else {
      setInternalOpenSections(prev => ({ ...prev, [title]: !prev[title] }));
    }
  };
  
  const displaySections = sections || [];

  return (
    <section className="bg-navy py-12 md:py-16">
      <div className="container mx-auto px-4">
        {displaySections.map((section) => {
          if (!section || !section.image) return null;
          
          const isOpen = openSections[section.title] || false;
          
          return (
            <div key={section.title} className="mb-8" style={{ perspective: '1000px' }}>
              <TiltCard>
                <button
                  onClick={() => toggleSection(section.title)}
                  className="w-full relative rounded-lg overflow-hidden group shadow-xl"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <div className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-110" style={{ transform: 'translateZ(8px)' }}>
                     <Image
                      src={section.image}
                      alt={section.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/70 to-navy/50"></div>
                  <div className="relative w-full p-6 md:p-8 text-center" style={{ transform: 'translateZ(40px)' }}>
                    <h2 className="text-3xl md:text-4xl font-bold text-gold">
                      {section.title}
                    </h2>
                    <p className="text-gray/80 text-base md:text-lg mt-2">
                      {section.description}
                    </p>
                    <div className="absolute top-1/2 -translate-y-1/2 left-6 text-gold p-2 bg-black/20 rounded-full" style={{ transform: 'translateZ(20px)' }}>
                       <ChevronDown
                          size={32}
                          className={`transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`}
                        />
                    </div>
                  </div>
                </button>
              </TiltCard>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <motion.div
                      variants={gridContainerVariants}
                      initial="hidden"
                      animate="show"
                      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6 pt-6"
                    >
                      {section.categories.map((category) => {
                        const IconComponent = category.icon;
                        return (
                          <motion.div key={category.name} variants={gridItemVariants}>
                            <Link
                              href={`/categories/${category.slug}`}
                              className="group bg-[#1B2A41] p-4 rounded-lg text-center text-gray flex flex-col items-center justify-center gap-3 transition-all duration-300 shadow-lg hover:shadow-gold/20 hover:bg-gold hover:text-navy transform hover:-translate-y-1.5 overflow-hidden"
                            >
                              <div className="relative text-gold transition-colors duration-300 group-hover:text-navy">
                                <IconComponent size={32} />
                                <div className="absolute -top-2 -left-8 w-16 h-16 bg-white/30 rounded-full opacity-0 transform -rotate-45 group-hover:opacity-100 group-hover:animate-glint"></div>
                              </div>
                              <span className="text-base font-semibold">{category.name}</span>
                            </Link>
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}