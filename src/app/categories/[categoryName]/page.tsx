'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import BusinessCard from '@/components/BusinessCard';
import FilterChips from '@/components/FilterChips';
import FilterModal from '@/components/FilterModal';
import BusinessDetailModal from '@/components/BusinessDetailModal';
import { Map } from 'lucide-react';
import { Business } from '@/types';

// The large mockBusinesses object has been removed from this file.

export default function CategoryResultsPage() {
  const params = useParams();
  const categoryName = decodeURIComponent(params.categoryName as string);

  // State for businesses, loading, and modals
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);

  useEffect(() => {
    const fetchAndFilterBusinesses = async () => {
      if (!categoryName) return;

      setLoading(true);
      try {
        const response = await fetch('/api/businesses');
        const allBusinesses: Business[] = await response.json();
        
        // Filter the businesses by the category name from the URL
        const filtered = allBusinesses.filter(biz => biz.category === categoryName);
        
        setBusinesses(filtered);
      } catch (error) {
        console.error("Failed to fetch businesses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAndFilterBusinesses();
  }, [categoryName]); // Re-run the effect if the categoryName changes

  if (loading) {
    return (
      <div className="bg-navy min-h-screen text-center py-40 text-gold">
        Loading businesses...
      </div>
    );
  }
  
  return (
    <>
      <FilterModal 
        isOpen={isFilterModalOpen} 
        onClose={() => setIsFilterModalOpen(false)} 
      />
      <BusinessDetailModal 
       business={selectedBusiness}
        onClose={() => setSelectedBusiness(null)}
      />
      
      <div className="bg-navy min-h-screen">
        <section className="bg-gradient-to-r from-[#0B132B] via-[#1B2A41] to-[#0B132B] py-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gold capitalize">
            {categoryName}
          </h1>
          <p className="text-gray mt-4 text-lg md:text-xl">
            تصفح أفضل الخيارات المتاحة في منطقتك
          </p>
        </section>

        <main className="container mx-auto px-4 py-8">
          <FilterChips onOpenFilterModal={() => setIsFilterModalOpen(true)} />
          
          <div className="flex justify-between items-center my-4">
            <p className="text-gray/80">
              تم العثور على <span className="font-bold text-gold">{businesses.length}</span> نتائج
            </p>
            <button className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-gold/10 text-gold hover:bg-gold/20 transition-colors">
              <Map size={20} />
              <span className="font-semibold">عرض الخريطة</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {businesses.map((biz) => (
              <BusinessCard 
                key={biz.id} 
                business={biz} 
                onClick={() => setSelectedBusiness(biz)}
              />
            ))}
          </div>
        </main>
      </div>
    </>
  );
}