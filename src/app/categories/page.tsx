// src/app/categories/page.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import CategoryGrid from '@/components/CategoryGrid';
import ExpandCollapseToggle from '@/components/ExpandCollapseToggle';
import { supabase } from '@/lib/supabase';
import { type LucideIcon, UtensilsCrossed } from 'lucide-react';

// --- Define Types to match the data structure from Supabase ---
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

// You can expand this map if you add more icons to your subcategories table
const iconMap: { [key: string]: LucideIcon } = {
  UtensilsCrossed: UtensilsCrossed,
  // Add other icons here as needed
};

export default function CategoriesPage() {
  const [categorySections, setCategorySections] = useState<CategorySection[]>([]);
  const [loading, setLoading] = useState(true);
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const fetchAllCategories = async () => {
      setLoading(true);
      const { data: categories, error: catError } = await supabase.from('categories').select('*');
      const { data: subcategories, error: subError } = await supabase.from('subcategories').select('*');

      if (catError || subError) {
        console.error("Failed to fetch categories:", catError || subError);
        setLoading(false);
        return;
      }

      const sections: CategorySection[] = categories.map(category => ({
        ...category,
        title: category.name,
        categories: subcategories
          .filter(sub => sub.category_id === category.id)
          .map(sub => ({
            ...sub,
            icon: iconMap[sub.icon as string] || UtensilsCrossed
          }))
      }));

      setCategorySections(sections);
      setLoading(false);
    };

    fetchAllCategories();
  }, []);


  const allSectionTitles = useMemo(() => categorySections.map(s => s.title), [categorySections]);

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
    const nextState = !isAllExpanded;
    const newOpenSections = allSectionTitles.reduce((acc, title) => {
      acc[title] = nextState;
      return acc;
    }, {} as { [key: string]: boolean });
    setOpenSections(newOpenSections);
  };
  
  if (loading) {
    return <div className="text-center text-gold p-10">جاري تحميل الفئات...</div>;
  }

  return (
    <main className="bg-navy min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#0B132B] via-[#1B2A41] to-[#0B132B] py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gold">الفئات</h1>
        <p className="text-gray mt-4 text-lg md:text-xl">
          استعرض جميع الخدمات والقطاعات المتوفرة في وين بسهولة
        </p>

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