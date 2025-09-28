'use client';

import Header from '@/components/Header';
import CategoryGrid from '@/components/CategoryGrid';
import { useState } from 'react';

export default function CategoriesPage() {
  const [selectedLocation, setSelectedLocation] = useState('اختر موقعك');

  return (
    <main className="bg-navy min-h-screen flex flex-col">
      {/* Header */}
      <Header
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#0B132B] via-[#1B2A41] to-[#0B132B] py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gold">الفئات</h1>
        <p className="text-gray mt-4 text-lg md:text-xl">
          استعرض جميع الخدمات والقطاعات المتوفرة في وين بسهولة
        </p>
      </section>

      {/* Categories Grid */}
      <div className="flex-1">
        <CategoryGrid />
      </div>

    </main>
  );
}
