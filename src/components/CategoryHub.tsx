// src/components/CategoryHub.tsx

'use client'; 

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronDown, Image as ImageIcon, UtensilsCrossed, Coffee, Cake, CookingPot, Truck, Beef, ShoppingBasket, PartyPopper, Stethoscope, Hospital, Pill, Dna, Bot, Scale, Handshake, HeartPulse, Sparkles, Droplet, Scissors, Paintbrush, SprayCan, PersonStanding, Diamond, HardHat, Wrench, Zap, Hammer, PaintRoller, Ruler, Bug, Car, CarTaxiFront, HandCoins, Settings2, Landmark, Calculator, DraftingCompass, Users, Megaphone, Code, PenTool, ShoppingCart, Shirt, Laptop, Sofa, Gift, BookOpen, ToyBrick, Dumbbell, Camera, Music, Clapperboard, Palette, GraduationCap, School, BookUser, Library, Languages, Cat, Dog, Bone, Bird, Gamepad2, KeyRound, TriangleAlert, Bike, Sailboat, ParkingCircle, Building } from 'lucide-react';

// An object that maps string names to the actual icon components
const iconMap = {
  UtensilsCrossed, Coffee, Cake, CookingPot, Truck, Beef, ShoppingBasket, PartyPopper,
  Stethoscope, Hospital, Pill, Dna, Bot, Scale, Handshake, HeartPulse, Sparkles, Droplet,
  Scissors, Paintbrush, SprayCan, PersonStanding, Diamond,
  HardHat, Wrench, Zap, Hammer, PaintRoller, Ruler, Bug, Car, CarTaxiFront,
  HandCoins, Settings2, Landmark, Calculator, DraftingCompass, Users,
  Megaphone, Code, PenTool, ShoppingCart, Shirt, Laptop, Sofa, Gift, BookOpen,
  ToyBrick, Dumbbell, Camera, Music, Clapperboard, Palette,
  GraduationCap, School, BookUser, Library, Languages, Cat,
  Dog, Bone, Bird, Gamepad2, KeyRound, 
  TriangleAlert, Bike, Sailboat, ParkingCircle, Building 
};

// Update the Category type to accept the icon name as a string
type Category = {
  name: string;
  icon: keyof typeof iconMap; // The icon is now a key of our iconMap
};

type CategoryHubProps = {
  section: {
    title: string;
    image: string;
    categories: Category[];
  };
};

export default function CategoryHub({ section }: CategoryHubProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 bg-[#1B2A41] rounded-lg p-4 md:p-6 shadow-xl">
        <div className="w-full md:w--1/3 lg:w-1/4 flex-shrink-0">
          <Image
            src={section.image}
            alt={section.title}
            width={600}
            height={400}
            className="w-full h-40 object-cover rounded-lg shadow-md"
          />
        </div>
        <div className="flex-grow text-center md:text-right">
          <h2 className="text-2xl md:text-3xl font-bold text-gold border-b-2 md:border-b-0 md:border-r-4 border-gold pb-2 pr-0 md:pr-4 mb-3">
            {section.title}
          </h2>
          <p className="text-gray/80 text-base md:text-lg pr-0 md:pr-4 mb-4">
            استكشف أفضل {section.title} في منطقتك.
          </p>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden w-full flex justify-center items-center gap-2 bg-gold/10 text-gold font-semibold py-2 px-4 rounded-lg border border-gold/20"
          >
            {isOpen ? 'إخفاء الفئات' : 'عرض الفئات'}
            <ChevronDown className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      <div className={`grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6 mt-6 ${isOpen ? 'grid' : 'hidden'} md:grid`}>
        {section.categories.map((category) => {
          // Look up the component from the map, with a fallback
          const IconComponent = iconMap[category.icon] || ImageIcon;
          return (
            <a
              key={category.name}
              href="#"
              className="bg-[#1B2A41] p-4 rounded-lg text-center text-gray flex flex-col items-center justify-center gap-3 hover:bg-gold hover:text-navy transition-all duration-300 transform hover:-translate-y-1 shadow-lg"
            >
              <div className="text-gold">
                <IconComponent size={32} />
              </div>
              <span className="text-base font-semibold">{category.name}</span>
            </a>
          );
        })}
      </div>
    </div>
  );
}