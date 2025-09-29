'use client';

import React from 'react';
import Image from 'next/image';
import { Plus } from 'lucide-react';

// Define the type for a single menu item
type MenuItem = {
  name: string;
  description: string;
  price: string;
  image: string;
};

// Define the type for the component's props
type MenuItemCardProps = {
  item: MenuItem;
  onAddToCart: () => void;
};

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, onAddToCart }) => {
  return (
    <div className="bg-[#1B2A41] rounded-lg p-3 flex items-center gap-4">
      <div className="w-20 h-20 rounded-md overflow-hidden relative flex-shrink-0">
        <Image src={item.image} alt={item.name} fill className="object-cover" />
      </div>
      <div className="flex-1">
        <h3 className="font-bold text-gray-200">{item.name}</h3>
        <p className="text-sm text-gray-400">{item.description}</p>
        <p className="font-semibold text-gold mt-1">{item.price}</p>
      </div>
      <button 
        onClick={onAddToCart}
        className="p-2 bg-gold/10 text-gold rounded-full hover:bg-gold/20 transition-colors flex-shrink-0"
        aria-label={`Add ${item.name} to cart`}
      >
        <Plus size={24} />
      </button>
    </div>
  );
};

export default MenuItemCard;