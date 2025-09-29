'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { X, Star, Zap } from 'lucide-react';
import React from 'react';

type FilterModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const FilterModal: React.FC<FilterModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: '0%' }}
          exit={{ y: '100%' }}
          transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
          className="fixed inset-0 bg-[#0B132B] z-50 flex flex-col"
        >
          {/* Header */}
          <header className="flex items-center justify-between p-4 border-b border-gold/20 flex-shrink-0">
            <button onClick={onClose} className="p-2">
              <X size={28} className="text-gray-300" />
            </button>
            <h2 className="text-xl font-bold text-gold">الفلاتر</h2>
            <button className="p-2 text-sm font-semibold text-gray-300">
              مسح الكل
            </button>
          </header>

          {/* Body with scrolling content */}
          <main className="flex-1 p-6 overflow-y-auto space-y-8">
            {/* Price Range */}
            <div>
              <h4 className="text-lg font-bold mb-4 text-gray-200">نطاق السعر</h4>
              <div className="flex justify-between gap-2">
                {['$', '$$', '$$$', '$$$$'].map(price => (
                  <button key={price} className="flex-1 px-4 py-2 text-lg font-bold rounded-lg bg-[#1B2A41] text-gold border border-gold/20 hover:bg-gold/20 transition-colors">
                    {price}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Rating */}
            <div>
              <h4 className="text-lg font-bold mb-4 text-gray-200">التقييم</h4>
              <div className="flex gap-2 flex-wrap">
                {[4, 3, 2].map(rating => (
                  <button key={rating} className="flex items-center gap-1 px-4 py-2 text-sm rounded-full bg-[#1B2A41] text-gold border border-gold/20 hover:bg-gold/20 transition-colors">
                    {rating} <Star size={14} /> &amp; up
                  </button>
                ))}
              </div>
            </div>

            {/* Distance */}
            <div>
              <h4 className="text-lg font-bold mb-4 text-gray-200">المسافة</h4>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-400">1km</span>
                <input type="range" min="1" max="50" defaultValue="10" className="w-full accent-gold" />
                <span className="text-sm text-gray-400">50km</span>
              </div>
            </div>

            {/* Open Now */}
            <div>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-lg font-bold text-gray-200">الحالة</span>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-gray-200">
                    <Zap size={18} className="inline text-emerald-500 mr-1"/>
                    مفتوح الآن
                  </span>
                  <div className="relative">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:after:translate-x-full after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </div>
                </div>
              </label>
            </div>
          </main>

          {/* Footer */}
          <footer className="p-4 border-t border-gold/20 flex-shrink-0">
            <button 
              onClick={onClose}
              className="w-full bg-gold text-navy font-bold py-3 px-8 rounded-full hover:bg-yellow-300 transition-all shadow-lg shadow-gold/20 transform hover:scale-105"
            >
              عرض النتائج
            </button>
          </footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FilterModal;