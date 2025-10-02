'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import CategoryGrid from '@/components/CategoryGrid';
import { useAuth } from '@/context/AuthContext';
import ExpandCollapseToggle from '@/components/ExpandCollapseToggle';
import { supabase } from '@/lib/supabase';
import { type LucideIcon, Edit, UtensilsCrossed, Coffee, Cake, CookingPot, Truck, Beef, ShoppingBasket, PartyPopper, Stethoscope, Hospital, Pill, Dna, Bot as BotIcon, Scale, Handshake, HeartPulse, Sparkles, Droplet, Scissors, Paintbrush, SprayCan, PersonStanding, Diamond, HardHat, Wrench, Zap, Hammer, PaintRoller, Ruler, Bug, Car, CarTaxiFront, HandCoins, Settings2, Landmark, Calculator, DraftingCompass, Users, Megaphone, Code, PenTool, ShoppingCart, Shirt, Laptop, Sofa, Gift, BookOpen, ToyBrick, Dumbbell, Camera, Music, Clapperboard, Palette, GraduationCap, School, BookUser, Library, Languages, Cat, Watch, Cross, Dog, Bone, Bird, Gamepad2, KeyRound, Factory, Printer, Sprout, Leaf, Recycle, Tractor, TriangleAlert, Bike, Sailboat, ParkingCircle, Building, Brush, Gem, Drama, ClipboardList , Flower, Mail, ShieldCheck, TrendingUp, House, Repeat, Hotel, Plane, Map, Ticket, Stamp,Warehouse } from 'lucide-react';

type Subcategory = { id: number; name: string; slug: string; icon: LucideIcon | string; category_id: number; };
type CategorySection = { id: number; name: string; title: string; description: string | null; slug: string; image: string | null; categories: Subcategory[]; };

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


export default function CategoriesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isEditMode, setIsEditMode] = useState(false);
  const [categorySections, setCategorySections] = useState<CategorySection[]>([]);
  const [loading, setLoading] = useState(true);
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({});
  const [preEditOpenSections, setPreEditOpenSections] = useState<{ [key: string]: boolean }>({});

  const fetchAllCategories = useCallback(async () => {
    setLoading(true);
    const { data: categories, error: catError } = await supabase.from('categories').select('*').order('position');
    const { data: subcategories, error: subError } = await supabase.from('subcategories').select('*').order('position');

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
        .map(sub => ({ ...sub, icon: iconMap[sub.icon as string] || UtensilsCrossed }))
    }));

    setCategorySections(sections);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAllCategories();
  }, [fetchAllCategories]);

  const allSectionTitles = useMemo(() => categorySections.map(s => s.title), [categorySections]);

  const isAllExpanded = useMemo(() => {
    if (isEditMode) return true;
    if (allSectionTitles.length === 0) return false;
    return allSectionTitles.every(title => openSections[title]);
  }, [openSections, allSectionTitles, isEditMode]);

  const handleToggleSection = (title: string) => {
    if (isEditMode) return;
    setOpenSections(prev => ({ ...prev, [title]: !prev[title] }));
  };

  const handleToggleAll = () => {
    if (isEditMode) return;
    const nextState = !isAllExpanded;
    const newOpenSections = allSectionTitles.reduce((acc, title) => {
      acc[title] = nextState;
      return acc;
    }, {} as { [key: string]: boolean });
    setOpenSections(newOpenSections);
  };
  
  const handleSetEditMode = (isEditing: boolean) => {
      setIsEditMode(isEditing);
      if (isEditing) {
          setPreEditOpenSections(openSections);
          const allOpen = allSectionTitles.reduce((acc, title) => {
              acc[title] = true;
              return acc;
          }, {} as { [key: string]: boolean });
          setOpenSections(allOpen);
      } else {
          setOpenSections(preEditOpenSections);
      }
  };
  
  const forceReload = () => {
      fetchAllCategories();
  };

  if (loading) {
    return <div className="text-center text-gold p-10">Loading Categories...</div>;
  }

  return (
    <main className="bg-navy min-h-screen flex flex-col">
      <section className="bg-gradient-to-r from-[#0B132B] via-[#1B2A41] to-[#0B132B] py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gold">الفئات</h1>
        <p className="text-gray mt-4 text-lg md:text-xl">
          Browse all available services and sectors
        </p>

        {user?.role === 'admin' && (
            <div className="mt-8">
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
            </div>
        )}

        {!isEditMode && (
          <ExpandCollapseToggle
            isExpanded={isAllExpanded}
            onToggle={handleToggleAll}
          />
        )}
      </section>

      <div className="flex-1">
        <CategoryGrid
          sections={categorySections}
          openSections={openSections}
          onToggleSection={handleToggleSection}
          isEditMode={isEditMode}
          forceReload={forceReload}
        />
      </div>
    </main>
  );
}