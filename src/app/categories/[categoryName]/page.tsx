'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import BusinessCard from '@/components/BusinessCard';
import FilterModal from '@/components/FilterModal';
import BusinessDetailModal from '@/components/BusinessDetailModal';
import { Map, Edit, PlusCircle, AlertTriangle, ChevronsRight, SlidersHorizontal, Star, Zap } from 'lucide-react';
import { Business, Subcategory } from '@/types';
import Loader from '@/components/Loader';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence, useTransform, useScroll } from 'framer-motion';
import BusinessFormModal from '@/components/BusinessFormModal';
import { supabase } from '@/lib/supabase';
import DynamicIcon from '@/components/DynamicIcon';

type ParentCategory = { id: number; name: string; slug: string; };

// --- NEW 3D CAROUSEL COMPONENT ---
const CategoryCarousel = ({ subcategories, activeSlug, parentCategory }: { subcategories: Subcategory[], activeSlug: string | undefined, parentCategory: ParentCategory | null }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const foundIndex = subcategories.findIndex(s => s.slug === activeSlug);
        setActiveIndex(foundIndex !== -1 ? foundIndex : 0);
    }, [activeSlug, subcategories]);

    // This creates the "3D" effect. Items further from the center are smaller and less opaque.
    const getStyle = (index: number) => {
        const distance = Math.abs(activeIndex - index);
        const scale = Math.max(1 - distance * 0.2, 0.5);
        const opacity = Math.max(1 - distance * 0.3, 0.3);
        const zIndex = subcategories.length - distance;
        return { scale, opacity, zIndex };
    };

    return (
        <div className="relative w-full h-80 flex flex-col items-center justify-center pt-8 overflow-hidden">
             {parentCategory && (
                <motion.nav 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex justify-center items-center gap-2 text-sm text-gold/70 mb-4 z-20"
                >
                    <Link href="/categories" className="hover:text-gold transition-colors">كل الفئات</Link>
                    <ChevronsRight size={16} />
                    <span className="cursor-default font-semibold text-gold">{parentCategory.name}</span>
                </motion.nav>
            )}
            
            <div className="relative w-full h-56 flex items-center justify-center" style={{ perspective: '1000px' }}>
                {subcategories.map((sub, index) => {
                    const { scale, opacity, zIndex } = getStyle(index);
                    const position = (index - activeIndex) * 100; // Adjust spacing

                    return (
                        <motion.div
                            key={sub.id}
                            initial={{ x: `${position}%`, scale: 0, opacity: 0 }}
                            animate={{ x: `${position}%`, scale, opacity }}
                            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                            style={{ zIndex, position: 'absolute' }}
                        >
                            <Link href={`/categories/${sub.slug}`} scroll={false}>
                                <div
                                    className={`flex flex-col items-center justify-center w-32 h-32 rounded-full transition-all duration-300 cursor-pointer
                                    ${sub.slug === activeSlug 
                                        ? 'bg-gold shadow-[0_0_20px_theme(colors.gold),0_0_40px_theme(colors.gold)]' 
                                        : 'bg-[#1B2A41]/70 backdrop-blur-sm border border-gold/20'
                                    }`}
                                >
                                    <DynamicIcon name={sub.icon || 'HelpCircle'} size={32} className={sub.slug === activeSlug ? 'text-navy' : 'text-gold/80'} />
                                    <span className={`font-bold text-center text-sm mt-2 ${sub.slug === activeSlug ? 'text-navy' : 'text-gray-300'}`}>{sub.name}</span>
                                </div>
                            </Link>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};


const ConstellationFilters = ({ onOpenFilterModal }: { onOpenFilterModal: () => void }) => {
    const filters = [
        { label: 'كل الفلاتر', icon: SlidersHorizontal, main: true },
        { label: 'الأعلى تقييماً', icon: Star, main: false },
        { label: 'مفتوح الآن', icon: Zap, main: false },
    ];
    
    return (
        <div className="container mx-auto px-4 py-6 flex justify-center items-center gap-4 flex-wrap">
            {filters.map((filter, index) => {
                const Icon = filter.icon;
                return (
                    <motion.button
                        key={filter.label}
                        onClick={filter.main ? onOpenFilterModal : undefined}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                        whileHover={{ y: -3, scale: 1.05,
                           boxShadow: filter.main ? "0 0 15px theme(colors.gold / 0.5)" : "0 0 15px hsl(0 0% 100% / 0.1)"
                        }}
                        className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300
                            ${filter.main 
                                ? 'text-gold bg-gold/10 border border-gold/30' 
                                : 'text-gray-300 bg-[#1B2A41]/50 border border-gray-700'
                            }`
                        }
                    >
                        <Icon size={16} />
                        <span>{filter.label}</span>
                    </motion.button>
                )
            })}
        </div>
    );
}

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
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);
    const [deletingBusiness, setDeletingBusiness] = useState<Business | null>(null);

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
            <FilterModal isOpen={isFilterModalOpen} onClose={() => setIsFilterModalOpen(false)} />
            <BusinessDetailModal business={selectedBusiness} onClose={() => setSelectedBusiness(null)} />
            
            {user?.role === 'admin' && (
                <>
                    <BusinessFormModal isOpen={isFormModalOpen} onClose={() => setIsFormModalOpen(false)} onSave={fetchData} business={editingBusiness} initialSubcategoryId={subcategory?.id} />
                    <DeleteConfirmationModal isOpen={!!deletingBusiness} onClose={() => setDeletingBusiness(null)} onConfirm={confirmDelete} businessName={deletingBusiness?.name || ''} />
                </>
            )}

            <div className="bg-navy min-h-screen">
                <section className="relative bg-gradient-to-b from-[#0B132B] via-[#1B2A41] to-[#0A1024] pt-12 pb-4 text-center overflow-hidden">
                    {user?.role === 'admin' && (
                        <div className="absolute top-4 right-4 z-20">
                            <button onClick={() => setIsEditMode(!isEditMode)} className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full transition-colors ${isEditMode ? 'bg-red-500/20 text-red-300 border border-red-500/50' : 'bg-gold/10 text-gold border border-gold/50'}`}>
                                <Edit size={16} />
                                {isEditMode ? 'خلص تعديل' : 'عدّل الصفحة'}
                            </button>
                        </div>
                    )}
                    {siblingSubcategories.length > 0 && (
                        <CategoryCarousel 
                            subcategories={siblingSubcategories} 
                            activeSlug={subcategory?.slug} 
                            parentCategory={parentCategory}
                        />
                    )}
                </section>
                
                {/* Section for Filters */}
                <section className="bg-[#0A1024] border-y border-gold/10">
                     <ConstellationFilters onOpenFilterModal={() => setIsFilterModalOpen(true)} />
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

