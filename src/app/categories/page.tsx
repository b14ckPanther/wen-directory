// src/app/categories/page.tsx
'use client';

import { useState, useMemo } from 'react';
import CategoryGrid from '@/components/CategoryGrid';
import ExpandCollapseToggle from '@/components/ExpandCollapseToggle'; // The new toggle
import { categorySections } from '@/data/categories';

export default function CategoriesPage() {
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({});

  const allSectionTitles = useMemo(() => categorySections.map(s => s.title), []);

  const isAllExpanded = useMemo(() => {
    if (allSectionTitles.length === 0) return false;
    return allSectionTitles.every(title => openSections[title]);
  }, [openSections, allSectionTitles]);

  const handleToggleSection = (title: string) => {
    setOpenSections(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  const handleToggleAll = () => {
    setOpenSections(isAllExpanded ? {} : allSectionTitles.reduce((acc, title) => {
      acc[title] = true;
      return acc;
    }, {} as { [key: string]: boolean }));
  };

  return (
    <main className="bg-navy min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#0B132B] via-[#1B2A41] to-[#0B132B] py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gold">الفئات</h1>
        <p className="text-gray mt-4 text-lg md:text-xl">
          استعرض جميع الخدمات والقطاعات المتوفرة في وين بسهولة
        </p>

        {/* ✅ The new, beautiful toggle is placed here */}
        <ExpandCollapseToggle 
          isExpanded={isAllExpanded}
          onToggle={handleToggleAll}
        />
      </section>

      {/* The CategoryGrid remains a controlled component */}
      <div className="flex-1">
        <CategoryGrid
          sections={categorySections}
          openSections={openSections}
          onToggleSection={handleToggleSection}
        />
      </div>
    </main>
  );
}