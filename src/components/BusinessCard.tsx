import Image from 'next/image';
import { Star, MapPin } from 'lucide-react';
import React from 'react';
import { Business, Restaurant, Clinic } from '@/types'; // Import the shared Business type

type BusinessCardProps = {
  business: Business;
  onClick: () => void;
};

const BusinessCard: React.FC<BusinessCardProps> = ({ business, onClick }) => {
  // Type guard to check if the business is a clinic
  const isClinic = (b: Business): b is Clinic => 'specialty' in b;
  // Type guard to check if the business is a restaurant
  const isRestaurant = (b: Business): b is Restaurant => 'cuisine' in b;

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-[#1B2A41] rounded-lg overflow-hidden shadow-lg hover:shadow-gold/20 transition-shadow duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-gold/50"
    >
      <div className="relative h-48">
        <Image
          src={business.image}
          alt={business.name}
          fill
          className="object-cover"
        />
        {business.isOpen && (
           <span className="absolute top-3 right-3 bg-emerald-500/80 text-white text-xs font-bold px-2 py-1 rounded-full">
           مفتوح الآن
         </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-200">{business.name}</h3>
        <div className="flex items-center justify-between mt-2 text-sm text-gray-400">
          <div className="flex items-center gap-1">
            <Star size={16} className="text-gold" />
            <span className="font-bold text-gray-200">{business.rating}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin size={16} className="text-gold" />
            <span>{business.distance}</span>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
            {/* Safely access properties using the type guards */}
            {(isRestaurant(business) || isClinic(business)) && (
              <span className='text-xs bg-gold/10 text-gold font-semibold px-2 py-1 rounded-full'>
                {isRestaurant(business) ? business.cuisine : business.specialty}
              </span>
            )}
            {isRestaurant(business) && business.priceRange && (
              <span className='text-xs bg-gold/10 text-gold font-semibold px-2 py-1 rounded-full'>
                {business.priceRange}
              </span>
            )}
        </div>
      </div>
    </button>
  );
};

export default BusinessCard;