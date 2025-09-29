'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import BusinessCard from '@/components/BusinessCard';
import FilterChips from '@/components/FilterChips';
import FilterModal from '@/components/FilterModal';
import BusinessDetailModal from '@/components/BusinessDetailModal';
import { Map } from 'lucide-react';
import { Business, Restaurant, Clinic } from '@/types'; // Import shared types

// Mock data using the imported types
const mockBusinesses: { restaurants: Restaurant[]; clinics: Clinic[] } = {
  restaurants: [
    {
      id: 1,
      name: 'مطعم القدس',
      description: 'أشهى المأكولات الشرقية التقليدية بأجواء أصيلة.',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1548&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      logo: 'https://img.freepik.com/premium-vector/restaurant-logo-design-template_79169-56.jpg',
      rating: 4.5,
      distance: '2.1km',
      phone: '+972501234567',
      isOpen: true,
      menu: [
        { id: 101, name: 'مشاوي مشكلة', description: 'كباب، شيش طاووق، وريش', price: '95.00', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1' },
        { id: 102, name: 'حمص باللحمة', description: 'حمص طازج مع قطع لحم غنم', price: '40.00', image: 'https://images.unsplash.com/photo-1598214886806-2c88b8509d17' },
      ],
    },
    {
      id: 2,
      name: 'بيتزا هت',
      description: 'البيتزا العالمية الشهيرة، مباشرة إلى باب بيتك.',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      logo: 'https://cdn.iconscout.com/icon/free/png-256/free-pizza-hut-1-282297.png',
      rating: 4.2,
      distance: '1.5km',
      phone: '+972501234568',
      isOpen: false,
      menu: [
        { id: 201, name: 'بيتزا مارجريتا', description: 'صلصة طماطم، جبنة موزاريلا، وريحان', price: '45.00', image: 'https://images.unsplash.com/photo-1594007654729-407eedc4be65' },
        { id: 202, name: 'برجر كلاسيك', description: 'لحم بقري، خس، طماطم، وبصل', price: '55.00', image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add' },
      ]
    },
  ],
  clinics: [],
};

export default function CategoryResultsPage() {
  const params = useParams();
  const categoryName = params.categoryName as keyof typeof mockBusinesses;
  const businesses: Business[] = mockBusinesses[categoryName] || [];
  
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);

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
            {decodeURIComponent(categoryName as string)}
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