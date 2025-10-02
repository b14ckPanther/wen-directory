'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import BusinessCard from '@/components/BusinessCard';
import FilterModal from '@/components/FilterModal';
import BusinessDetailModal from '@/components/BusinessDetailModal';
import { Map, Edit, PlusCircle, AlertTriangle, ChevronsRight, SlidersHorizontal, ArrowDownUp, ListTree, ChevronDown, Info } from 'lucide-react';
import { Business, Subcategory } from '@/types';
import Loader from '@/components/Loader';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import BusinessFormModal from '@/components/BusinessFormModal';
import { supabase } from '@/lib/supabase';
import DynamicIcon from '@/components/DynamicIcon';

type ParentCategory = { id: number; name: string; slug: string; };

// --- Custom hook to detect clicks outside a component ---
const useClickOutside = (ref: React.RefObject<HTMLDivElement | null>, handler: () => void) => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler();
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
};

// --- Carousel Component (Mobile Optimized) ---
const CategoryCarousel = ({ subcategories, activeSlug, parentCategory }: { subcategories: Subcategory[], activeSlug: string | undefined, parentCategory: ParentCategory | null }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const router = useRouter();

    useEffect(() => {
        const foundIndex = subcategories.findIndex(s => s.slug === activeSlug);
        setActiveIndex(foundIndex !== -1 ? foundIndex : 0);
    }, [activeSlug, subcategories]);

    const onDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        const dragThreshold = 70;
        if (info.offset.x > dragThreshold) {
            setActiveIndex(i => Math.max(0, i - 1));
        } else if (info.offset.x < -dragThreshold) {
            setActiveIndex(i => Math.min(subcategories.length - 1, i + 1));
        }
    };

    return (
        <div className="relative w-full h-80 flex flex-col items-center justify-center pt-8 overflow-hidden">
             {parentCategory && (
                <motion.nav 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex justify-center items-center gap-2 text-sm text-gold/70 mb-4 z-30"
                >
                    <Link href="/categories" className="hover:text-gold transition-colors">كل الفئات</Link>
                    <ChevronsRight size={16} />
                    <span className="cursor-default font-semibold text-gold">{parentCategory.name}</span>
                </motion.nav>
            )}
            
            <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={onDragEnd}
                className="relative w-full h-56 flex items-center justify-center cursor-grab active:cursor-grabbing"
            >
                <AnimatePresence initial={false}>
                    {subcategories.map((sub, index) => {
                        const distance = index - activeIndex;
                        const isVisible = Math.abs(distance) <= 2;
                        if (!isVisible) return null;
                        return (
                            <motion.div
                                key={sub.id}
                                className="absolute"
                                style={{ pointerEvents: 'none' }}
                                initial={{ x: `${distance * 55}%`, scale: 1 - Math.abs(distance) * 0.25, opacity: 1 - Math.abs(distance) * 0.4, zIndex: subcategories.length - Math.abs(distance) }}
                                animate={{ x: `${distance * 55}%`, scale: 1 - Math.abs(distance) * 0.25, opacity: 1 - Math.abs(distance) * 0.4, zIndex: subcategories.length - Math.abs(distance) }}
                                transition={{ type: 'spring', stiffness: 350, damping: 35 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                            >
                                <motion.div
                                    style={{ pointerEvents: 'auto' }}
                                    onTap={() => router.push(`/categories/${sub.slug}`)}
                                    whileTap={{ scale: 0.95 }}
                                    className={`flex flex-col items-center justify-center w-32 h-32 rounded-full transition-all duration-300 ${sub.slug === activeSlug ? 'bg-gold shadow-[0_0_20px_theme(colors.gold),0_0_40px_theme(colors.gold)]' : 'bg-[#1B2A41]/70 backdrop-blur-sm border border-gold/20'}`}
                                >
                                    <DynamicIcon name={sub.icon || 'HelpCircle'} size={32} className={sub.slug === activeSlug ? 'text-navy' : 'text-gold/80'} />
                                    <span className={`font-bold text-center text-sm mt-2 ${sub.slug === activeSlug ? 'text-navy' : 'text-gray-300'}`}>{sub.name}</span>
                                </motion.div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, businessName }: { isOpen: boolean; onClose: () => void; onConfirm: () => void; businessName: string; }) => {
    if (!isOpen) return null;
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-navy/80 backdrop-blur-sm z-[101] flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-[#1B2A41] w-full max-w-md rounded-2xl p-6 border border-red-500/30 text-center">
                <AlertTriangle size={48} className="mx-auto text-red-400 mb-4" />
                <h2 className="text-xl font-bold text-white mb-2">متأكد بدك تمحى؟</h2>
                <p className="text-gray-400 mb-6">أنت على وشك حذف: <span className="font-bold text-gold">{businessName}</span>. هاي الخطوة ما في منها رجعة.</p>
                <div className="flex justify-center gap-4">
                    <button onClick={onClose} className="bg-gray-700 text-white font-bold py-2 px-6 rounded-lg">إلغاء</button>
                    <button onClick={onConfirm} className="bg-red-600 text-white font-bold py-2 px-6 rounded-lg">آه، امحى</button>
                </div>
            </motion.div>
        </motion.div>
    );
};

const InfoModal = ({ isOpen, onClose, message }: { isOpen: boolean; onClose: () => void; message: string; }) => {
    if (!isOpen) return null;
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-navy/80 backdrop-blur-sm z-[101] flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, y: -20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-[#1B2A41] w-full max-w-sm rounded-2xl p-6 border border-gold/20 text-center">
                <Info size={48} className="mx-auto text-gold mb-4" />
                <p className="text-gray-300 mb-6 text-lg">{message}</p>
                <button onClick={onClose} className="bg-gold text-navy font-bold py-2 px-8 rounded-lg hover:bg-yellow-300 transition-colors">
                    حسنًا
                </button>
            </motion.div>
        </motion.div>
    );
};

const SimplifiedFilterControls = ({ onOpenFilterModal, onSortClick, subcategories, activeSlug, parentCategoryName }: { onOpenFilterModal: () => void; onSortClick: () => void; subcategories: Subcategory[]; activeSlug: string | undefined; parentCategoryName: string | null; }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    useClickOutside(dropdownRef, () => setIsDropdownOpen(false));
    return (
        <div className="container mx-auto px-4 py-4 flex justify-center items-center gap-4">
            <motion.button onClick={onOpenFilterModal} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} whileHover={{ y: -3, scale: 1.05, boxShadow: "0 0 15px theme(colors.gold / 0.5)" }} className="flex items-center gap-2 px-6 py-2 text-sm font-semibold rounded-full transition-all duration-300 text-gold bg-gold/10 border border-gold/30">
                <SlidersHorizontal size={16} />
                <span>الفلاتر</span>
            </motion.button>
            <div className="relative" ref={dropdownRef}>
                <motion.button onClick={() => setIsDropdownOpen(prev => !prev)} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} whileHover={{ y: -3, scale: 1.05, boxShadow: "0 0 15px hsl(0 0% 100% / 0.1)" }} className="flex items-center gap-2 px-6 py-2 text-sm font-semibold rounded-full transition-all duration-300 text-gray-300 bg-[#1B2A41]/50 border border-gray-700">
                    <ListTree size={16} />
                    <span>الفئات الفرعية</span>
                    <ChevronDown size={16} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </motion.button>
                <AnimatePresence>
                    {isDropdownOpen && (
                        <motion.div initial={{ opacity: 0, y: -10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.95 }} className="absolute top-full mt-2 w-64 bg-[#121c2c]/90 backdrop-blur-xl border border-gold/20 rounded-xl shadow-2xl z-10 p-2">
                            <div className="px-3 py-2 text-sm font-bold text-gold border-b border-gold/20 mb-1">{parentCategoryName}</div>
                            <div className="max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                {subcategories.map(sub => (
                                    <Link key={sub.id} href={`/categories/${sub.slug}`} scroll={false}>
                                        <div onClick={() => setIsDropdownOpen(false)} className={`block w-full text-right px-3 py-2 text-sm rounded-md transition-colors ${sub.slug === activeSlug ? 'bg-gold/20 text-gold font-semibold' : 'text-gray-300 hover:bg-gold/10'}`}>
                                            {sub.name}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            <motion.button onClick={onSortClick} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} whileHover={{ y: -3, scale: 1.05, boxShadow: "0 0 15px hsl(0 0% 100% / 0.1)" }} className="flex items-center gap-2 px-6 py-2 text-sm font-semibold rounded-full transition-all duration-300 text-gray-300 bg-[#1B2A41]/50 border border-gray-700">
                <ArrowDownUp size={16} />
                <span>الترتيب</span>
            </motion.button>
        </div>
    );
}

export default function CategoryResultsPage() {
    const params = useParams();
    const router = useRouter();
    const categoryName = decodeURIComponent(params.categoryName as string);
    const { user } = useAuth();
    const [businesses, setBusinesses] = useState<Business[]>([]);
    const [subcategory, setSubcategory] = useState<(Subcategory & { category_id: number }) | null>(null);
    const [parentCategory, setParentCategory] = useState<ParentCategory | null>(null);
    const [siblingSubcategories, setSiblingSubcategories] = useState<Subcategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    const [infoModalMessage, setInfoModalMessage] = useState('');
    const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);
    const [deletingBusiness, setDeletingBusiness] = useState<Business | null>(null);

    const handleSortClick = () => {
        setInfoModalMessage("سيتم إضافة ميزة الترتيب قريبًا!");
        setIsInfoModalOpen(true);
    };

    const handleFilterClick = () => {
        setInfoModalMessage("سيتم إضافة ميزة الفلاتر قريبًا!");
        setIsInfoModalOpen(true);
    };

    const fetchData = useCallback(async () => {
        if (!categoryName) return;
        setLoading(true);
        try {
            const { data: subcategoryData, error: subcategoryError } = await supabase.from('subcategories').select('*').eq('slug', categoryName).single();
            if (subcategoryError || !subcategoryData) throw new Error("الفئة الفرعية مش موجودة");
            setSubcategory(subcategoryData);
            if (subcategoryData.category_id) {
                const { data: parentData, error: parentError } = await supabase.from('categories').select('id, name, slug').eq('id', subcategoryData.category_id).single();
                if (parentError) throw parentError;
                setParentCategory(parentData);
                const { data: siblingsData, error: siblingsError } = await supabase.from('subcategories').select('*').eq('category_id', subcategoryData.category_id).order('position');
                if (siblingsError) throw siblingsError;
                setSiblingSubcategories(siblingsData);
            }
            const { data: businessesData, error: businessesError } = await supabase.from('businesses').select('*').eq('subcategory_id', subcategoryData.id);
            if (businessesError) throw businessesError;
            const formattedBusinesses = businessesData.map(b => ({ ...b, subcategory: subcategoryData.name })) as Business[];
            setBusinesses(formattedBusinesses);
        } catch (error) {
            console.error("فشل بجلب البيانات:", error);
            router.push('/categories');
        } finally {
            setLoading(false);
        }
    }, [categoryName, router]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleAddBusiness = () => { setEditingBusiness(null); setIsFormModalOpen(true); };
    const handleEdit = (biz: Business) => { setEditingBusiness(biz); setIsFormModalOpen(true); };
    const handleDelete = (biz: Business) => { setDeletingBusiness(biz); };
    const confirmDelete = async () => {
        if (!deletingBusiness) return;
        const { error } = await supabase.from('businesses').delete().eq('id', deletingBusiness.id);
        if (error) { alert('ما قدرنا نمحى المصلحة.'); } else { fetchData(); }
        setDeletingBusiness(null);
    };

    if (loading) return <Loader />;

    return (
        <>
            <BusinessDetailModal business={selectedBusiness} onClose={() => setSelectedBusiness(null)} />
            <InfoModal isOpen={isInfoModalOpen} onClose={() => setIsInfoModalOpen(false)} message={infoModalMessage} />
            
            {user?.role === 'admin' && (
                <>
                    <BusinessFormModal isOpen={isFormModalOpen} onClose={() => setIsFormModalOpen(false)} onSave={fetchData} business={editingBusiness} initialSubcategoryId={subcategory?.id} />
                    <DeleteConfirmationModal isOpen={!!deletingBusiness} onClose={() => setDeletingBusiness(null)} onConfirm={confirmDelete} businessName={deletingBusiness?.name || ''} />
                </>
            )}
            <div className="bg-navy min-h-screen">
                <section className="relative bg-gradient-to-b from-[#0B132B] via-[#1B2A41] to-[#0A1024] pt-12 text-center overflow-hidden">
                    {user?.role === 'admin' && (
                        <div className="absolute top-4 right-4 z-20">
                            <button onClick={() => setIsEditMode(!isEditMode)} className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full transition-colors ${isEditMode ? 'bg-red-500/20 text-red-300 border border-red-500/50' : 'bg-gold/10 text-gold border border-gold/50'}`}>
                                <Edit size={16} />
                                {isEditMode ? 'خلص تعديل' : 'عدّل الصفحة'}
                            </button>
                        </div>
                    )}
                    {siblingSubcategories.length > 0 && (
                        <CategoryCarousel subcategories={siblingSubcategories} activeSlug={subcategory?.slug} parentCategory={parentCategory} />
                    )}
                </section>
                <section className="bg-[#0A1024] border-y border-gold/10 sticky top-[80px] z-20 backdrop-blur-sm">
                     <SimplifiedFilterControls 
                        onOpenFilterModal={handleFilterClick}
                        onSortClick={handleSortClick}
                        subcategories={siblingSubcategories}
                        activeSlug={subcategory?.slug}
                        parentCategoryName={parentCategory?.name || null}
                     />
                </section>
                <main className="container mx-auto px-4 py-8">
                    <div className="flex justify-between items-center mb-4">
                        <p className="text-gray/80">لقينا <span className="font-bold text-gold">{businesses.length}</span> نتائج</p>
                        <button className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-gold/10 text-gold"><Map size={20} /> <span className="font-semibold">شوف الخريطة</span></button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {businesses.map((biz) => (
                            <BusinessCard key={biz.id} business={biz} onClick={() => !isEditMode && setSelectedBusiness(biz)} isEditMode={isEditMode} onEdit={() => handleEdit(biz)} onDelete={() => handleDelete(biz)} />
                        ))}
                        {isEditMode && (
                            <button onClick={handleAddBusiness} className="w-full text-left bg-transparent border-2 border-dashed border-gray-600 rounded-lg overflow-hidden shadow-lg hover:border-gold hover:text-gold transition-all duration-300 flex flex-col items-center justify-center min-h-[280px]">
                                <PlusCircle size={48} className="mb-4" />
                                <h3 className="text-xl font-bold">زيد مصلحة جديدة</h3>
                            </button>
                        )}
                    </div>
                </main>
            </div>
        </>
    );
}