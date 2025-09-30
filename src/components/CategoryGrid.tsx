'use client'; 

import React, { useState } from 'react'; 
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { categorySections } from '@/data/categories'; // استيراد البيانات من الملف المركزي

const gridContainerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const gridItemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

// تحديد أنواع خصائص المكون
type CategoryGridProps = {
  startExpanded?: boolean;
};

export default function CategoryGrid({ startExpanded = false }: CategoryGridProps) {
  // تهيئة الحالة بناءً على خاصية startExpanded
  const [openSections, setOpenSections] = useState<{[key: string]: boolean}>(() => {
    if (startExpanded) {
      return categorySections.reduce((acc, section) => ({...acc, [section.title]: true }), {});
    }
    return {};
  });

  const toggleSection = (title: string) => {
    setOpenSections(prev => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <section className="bg-navy py-12 md:py-16">
      <div className="container mx-auto px-4">
        {categorySections.map((section) => {
          const isOpen = openSections[section.title] || false;
          
          return (
            <div key={section.title} className="mb-8">
              <button
                onClick={() => toggleSection(section.title)}
                className="w-full relative text-left rounded-lg overflow-hidden group shadow-xl"
              >
                <div className="absolute inset-0">
                   <Image
                    src={section.image}
                    alt={section.title}
                    fill
                    className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/70 to-navy/50"></div>
                <div className="relative w-full p-6 md:p-8 text-center">
                  <h2 className="text-3xl md:text-4xl font-bold text-gold">
                    {section.title}
                  </h2>
                  <p className="text-gray/80 text-base md:text-lg mt-2">
                    {section.description}
                  </p>
                  <div className="absolute top-1/2 -translate-y-1/2 left-6 text-gold p-2 bg-black/20 rounded-full">
                     <ChevronDown
                        size={32}
                        className={`transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`}
                      />
                  </div>
                </div>
              </button>

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
                              className="bg-[#1B2A41] p-4 rounded-lg text-center text-gray flex flex-col items-center justify-center gap-3 transition-all duration-300 shadow-lg hover:shadow-gold/20 hover:bg-gold hover:text-navy transform hover:-translate-y-1.5"
                            >
                              <div className="text-gold transition-colors duration-300">
                                <IconComponent size={32} />
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