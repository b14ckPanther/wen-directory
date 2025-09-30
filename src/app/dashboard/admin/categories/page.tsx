'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit, Trash2, PlusCircle, ChevronDown, Image as ImageIcon } from 'lucide-react';
import { categorySections } from '@/data/categories'; // استيراد البيانات المركزية

export default function ManageCategoriesPage() {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (title: string) => {
    setOpenSection(openSection === title ? null : title);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* رأس الصفحة والإجراءات */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">إدارة الفئات والأقسام</h1>
        <button className="flex items-center gap-2 bg-gold text-navy font-bold py-2 px-4 rounded-lg hover:bg-yellow-300 transition-colors">
          <PlusCircle size={20} />
          <span>إضافة قسم رئيسي جديد</span>
        </button>
      </div>

      {/* قائمة الفئات الرئيسية */}
      <div className="bg-[#1B2A41] rounded-2xl border border-gray-800 shadow-lg">
        {categorySections.map((section) => (
          <div key={section.slug} className="border-b border-gray-800 last:border-b-0">
            {/* رأس الفئة الرئيسية */}
            <div 
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-[#0A1024]/50"
              onClick={() => toggleSection(section.title)}
            >
              <div className="flex items-center gap-4">
                <ImageIcon size={20} className="text-gold" />
                <span className="font-semibold text-white">{section.title}</span>
              </div>
              <div className="flex items-center gap-4">
                <button className="text-blue-400 hover:text-blue-300"><Edit size={18} /></button>
                <button className="text-red-400 hover:text-red-300"><Trash2 size={18} /></button>
                <ChevronDown 
                  size={20} 
                  className={`text-gray-400 transition-transform ${openSection === section.title ? 'rotate-180' : ''}`} 
                />
              </div>
            </div>

            {/* قائمة الفئات الفرعية (تظهر عند الفتح) */}
            <AnimatePresence>
              {openSection === section.title && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 pl-12 bg-[#0A1024]/50">
                    {section.categories.map(subCat => (
                      <div key={subCat.slug} className="flex items-center justify-between py-2 border-b border-gray-700/50 last:border-b-0">
                        <span className="text-gray-300">{subCat.name}</span>
                        <div className="flex items-center gap-3">
                          <button className="text-blue-400 hover:text-blue-300"><Edit size={16} /></button>
                          <button className="text-red-400 hover:text-red-300"><Trash2 size={16} /></button>
                        </div>
                      </div>
                    ))}
                     <button className="flex items-center gap-2 text-sm text-gold mt-4 hover:text-yellow-300">
                        <PlusCircle size={16} />
                        <span>إضافة فئة فرعية</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </motion.div>
  );
}