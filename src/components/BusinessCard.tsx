// src/components/BusinessCard.tsx
import Image from 'next/image';
import { Star, MapPin, ImageIcon, Edit, Trash2 } from 'lucide-react';
import React from 'react';
import { Business, Restaurant, Clinic } from '@/types';

type BusinessCardProps = {
  business: Business;
  onClick: () => void;
  isEditMode?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
};

const BusinessCard: React.FC<BusinessCardProps> = ({ business, onClick, isEditMode = false, onEdit, onDelete }) => {
  const isClinic = (b: Business): b is Clinic => 'specialty' in b;
  const isRestaurant = (b: Business): b is Restaurant => 'cuisine' in b;

  return (
    <div className="relative group">
        <button
          onClick={onClick}
          disabled={isEditMode}
          className="w-full text-left bg-[#1B2A41] rounded-lg overflow-hidden shadow-lg hover:shadow-gold/20 transition-shadow duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-gold/50 disabled:cursor-default"
        >
          <div className="relative h-48 bg-[#0A1024]">
            {business.image ? (
                <Image
                  src={business.image}
                  alt={business.name}
                  fill
                  className="object-cover"
                />
            ) : (
                <div className="flex items-center justify-center h-full">
                    <ImageIcon size={48} className="text-gray-600" />
                </div>
            )}
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
        
        {/* EDIT/DELETE OVERLAY - ADMIN ONLY */}
        {isEditMode && (
            <div className="absolute top-2 right-2 flex gap-2">
                <button 
                    onClick={onEdit}
                    className="p-2 bg-blue-500/80 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors"
                    aria-label="Edit Business"
                >
                    <Edit size={16} />
                </button>
                <button 
                    onClick={onDelete}
                    className="p-2 bg-red-500/80 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
                    aria-label="Delete Business"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        )}
    </div>
  );
};

export default BusinessCard;