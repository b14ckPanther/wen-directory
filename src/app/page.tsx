'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import CategoryGrid from '@/components/CategoryGrid';
import { useAuth } from '@/context/AuthContext';
import { useLocation } from '@/context/LocationContext';
import { useChat } from '@/context/ChatContext';
import { Bot, Search, MessageSquare, ChevronLeft, type LucideIcon, Edit, UtensilsCrossed, Coffee, Cake, CookingPot, Truck, Beef, ShoppingBasket, PartyPopper, Stethoscope, Hospital, Pill, Dna, Bot as BotIcon, Scale, Handshake, HeartPulse, Sparkles, Droplet, Scissors, Paintbrush, SprayCan, PersonStanding, Diamond, HardHat, Wrench, Zap, Hammer, PaintRoller, Ruler, Bug, Car, CarTaxiFront, HandCoins, Settings2, Landmark, Calculator, DraftingCompass, Users, Megaphone, Code, PenTool, ShoppingCart, Shirt, Laptop, Sofa, Gift, BookOpen, ToyBrick, Dumbbell, Camera, Music, Clapperboard, Palette, GraduationCap, School, BookUser, Library, Languages, Cat, Watch, Cross, Dog, Bone, Bird, Gamepad2, KeyRound, Factory, Printer, Sprout, Leaf, Recycle, Tractor, TriangleAlert, Bike, Sailboat, ParkingCircle, Building, Brush, Gem, Drama, ClipboardList , Flower, Mail, ShieldCheck, TrendingUp, House, Repeat, Hotel, Plane, Map, Ticket, Stamp,Warehouse } from 'lucide-react';
import { motion, Variants } from 'framer-motion';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

// --- Define specific types for our data structure ---
type Subcategory = {
  id: number;
  name: string;
  slug: string;
  icon: LucideIcon | string; // Allow string for icon name from DB
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


const iconMap: { [key: string]: LucideIcon } = {
  UtensilsCrossed, Coffee, Cake, CookingPot, Truck, Beef, ShoppingBasket, PartyPopper,
  Stethoscope, Hospital, Pill, Dna, Bot: BotIcon, Scale, Handshake, HeartPulse, Sparkles, Droplet,
  Scissors, Paintbrush, SprayCan, PersonStanding, Diamond,
  HardHat, Wrench, Zap, Hammer, PaintRoller, Ruler, Bug, Car, CarTaxiFront,
  HandCoins, Settings2, Landmark, Calculator, DraftingCompass, Users,
  Megaphone, Code, PenTool, ShoppingCart, Shirt, Laptop, Sofa, Gift, BookOpen,
  ToyBrick, Dumbbell, Camera, Music, Clapperboard, Palette,
  GraduationCap, School, BookUser, Library, Languages, Cat, Watch, Cross,
  Dog, Bone, Bird, Gamepad2, KeyRound, Factory, Printer, Sprout, Leaf, Recycle, Tractor,
  TriangleAlert, Bike, Sailboat, ParkingCircle, Building, Brush, Gem, Drama,
  ClipboardList , Flower, Mail, ShieldCheck, TrendingUp, House, Repeat, Hotel, Plane, Map, Ticket, Stamp,Warehouse,
};


export default function Home() {
  const { user } = useAuth();
  const [isEditMode, setIsEditMode] = useState(false);
  const { selectedLocation, openLocationModal } = useLocation();
  const { toggleChat } = useChat();
  const [categorySections, setCategorySections] = useState<CategorySection[]>([]);
  
  // State to manage which accordions are open
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({});
  const [preEditOpenSections, setPreEditOpenSections] = useState<{ [key: string]: boolean }>({});
  
  const [placeholder, setPlaceholder] = useState('');
  const searchSuggestions = useMemo(() => ["على شو بتدوّر؟", "مطاعم...", "أطباء...", "محامون...", "صالونات..."], []);

  const fetchCategories = useCallback(async () => {
    const { data: categories, error: catError } = await supabase.from('categories').select('*').order('position');
    const { data: subcategories, error: subError } = await supabase.from('subcategories').select('*').order('position');

    if (catError || subError) {
      console.error(catError || subError);
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
  }, []);
  
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const popularCategories = useMemo(() => [
    categorySections.find(s => s.slug === 'طعام'),
    categorySections.find(s => s.slug === 'صحة'),
    categorySections.find(s => s.slug === 'جمال'),
    categorySections.find(s => s.slug === 'منزل-وبناء'),
    categorySections.find(s => s.slug === 'تسوق'),
  ].filter((c): c is CategorySection => !!c), [categorySections]);
  
  const handleToggleSection = (title: string) => {
    if (isEditMode) return;
    setOpenSections(prev => ({ ...prev, [title]: !prev[title] }));
  };

  const handleSetEditMode = (isEditing: boolean) => {
      setIsEditMode(isEditing);
      if (isEditing) {
          setPreEditOpenSections(openSections);
          const allOpen = popularCategories.reduce((acc, section) => {
              if(section) acc[section.title] = true;
              return acc;
          }, {} as { [key: string]: boolean });
          setOpenSections(allOpen);
      } else {
          setOpenSections(preEditOpenSections);
      }
  };

  const forceReload = () => {
      fetchCategories();
  };

  useEffect(() => {
    let suggestionIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let timeoutId: NodeJS.Timeout;

    const type = () => {
      const currentSuggestion = searchSuggestions[suggestionIndex];
      const speed = isDeleting ? 75 : 150;

      if (isDeleting) {
        setPlaceholder(currentSuggestion.substring(0, charIndex - 1));
        charIndex--;
        if (charIndex === 0) {
          isDeleting = false;
          suggestionIndex = (suggestionIndex + 1) % searchSuggestions.length;
          timeoutId = setTimeout(type, 500);
        } else {
          timeoutId = setTimeout(type, speed);
        }
      } else {
        setPlaceholder(currentSuggestion.substring(0, charIndex + 1));
        charIndex++;
        if (charIndex === currentSuggestion.length) {
          isDeleting = true;
          timeoutId = setTimeout(type, 2000);
        } else {
          timeoutId = setTimeout(type, speed);
        }
      }
    };

    timeoutId = setTimeout(type, 150);
    return () => clearTimeout(timeoutId);
  }, [searchSuggestions]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.3 } },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  return (
    <>
      <section className="relative w-full text-center py-20 md:py-32 bg-navy overflow-hidden">
        <div className="absolute inset-0 z-0 animate-star-field pointer-events-none"></div>
        <motion.div
          className="container relative z-10 mx-auto px-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="text-4xl md:text-6xl font-bold leading-tight bg-gradient-to-r from-amber-300 via-gold to-sky-400 bg-clip-text text-transparent animate-bg-pan bg-[200%_auto]"
            variants={itemVariants}
          >
            ابحث، اكتشف، وتواصل
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-gray/80 mt-4 max-w-2xl mx-auto"
            variants={itemVariants}
          >
            وين هو دليلك الكامل لأحسن الخدمات والمهنيين بمنطقتك.
          </motion.p>
            
          <motion.div className="mt-6" variants={itemVariants}>
            <button
              onClick={openLocationModal}
              className="px-4 py-2 bg-gold/10 text-gold font-semibold rounded-full hover:bg-gold/20 transition-transform hover:scale-105"
            >
              موقعك الحالي: {selectedLocation}
            </button>
          </motion.div>
          
          {user?.role === 'admin' && (
            <motion.div className="mt-8" variants={itemVariants}>
              <button
                onClick={() => handleSetEditMode(!isEditMode)}
                className={`flex items-center gap-2 mx-auto px-6 py-2 font-semibold rounded-full transition-colors ${
                  isEditMode
                    ? 'bg-red-500/20 text-red-300 border border-red-500/50'
                    : 'bg-gold/10 text-gold border border-gold/50'
                }`}
              >
                <Edit size={18} />
                {isEditMode ? 'Finish Editing' : 'Edit Page'}
              </button>
            </motion.div>
          )}

          <motion.div className="mt-8 max-w-2xl mx-auto" variants={itemVariants}>
            <form className="relative group">
              <input
                type="text"
                placeholder={placeholder + '|'}
                className="w-full bg-[#1B2A41]/80 text-lg text-gray border-2 border-gold/30 rounded-full py-4 pl-6 pr-20 focus:outline-none focus:ring-4 focus:ring-gold/50 focus:border-gold/50 transition-all duration-300 shadow-lg"
              />
              <button
                type="submit"
                className="absolute inset-y-1.5 right-1.5 flex items-center justify-center bg-gold text-navy rounded-full w-14 h-14 transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-amber-300 group-hover:via-gold group-hover:to-sky-400 group-hover:animate-bg-pan group-hover:bg-[200%_auto] group-hover:shadow-lg group-hover:shadow-gold/40"
                aria-label="بحث"
              >
                <Search size={28} />
              </button>
            </form>
            <div className="mt-6 text-center md:hidden">
              <button
                onClick={toggleChat}
                className="inline-flex items-center gap-2 px-5 py-2 bg-transparent border border-gold/40 text-gold font-semibold rounded-full hover:bg-gold/10 transition-colors duration-300"
              >
                <Bot size={20} />
                <span>مش مدبر حالك؟ اسألني</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      </section>

      <CategoryGrid 
        sections={popularCategories} 
        isEditMode={isEditMode}
        openSections={openSections}
        onToggleSection={handleToggleSection}
        forceReload={forceReload}
      />

      <div className="text-center bg-navy pb-16">
          <Link href="/categories" className="inline-flex items-center gap-2 text-gold font-bold py-3 px-8 rounded-full border-2 border-gold/50 hover:bg-gold/10 transition-all transform hover:scale-105">
              <span>عرض كل الفئات</span>
              <ChevronLeft size={20} />
          </Link>
      </div>

      <section className="bg-gradient-to-r from-[#0B132B] via-[#1B2A41] to-[#0B2A41] py-16">
        <motion.div
          className="container mx-auto px-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
        >
          <MessageSquare className="w-12 h-12 text-gold mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white">يهمنا رأيك!</h2>
          <p className="text-gray/80 mt-2 max-w-xl mx-auto">
            ساعدنا على تحسين Wen من خلال مشاركة ملاحظاتك واقتراحاتك.
          </p>
          <Link
            href="/feedback"
            className="mt-6 inline-block bg-gold text-navy font-bold py-3 px-8 rounded-full hover:bg-yellow-300 transition-all shadow-lg shadow-gold/20 transform hover:scale-105"
          >
            شاركنا رأيك
          </Link>
        </motion.div>
      </section>
    </>
  );
}