'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import BusinessCard from '@/components/BusinessCard';
import FilterChips from '@/components/FilterChips';
import FilterModal from '@/components/FilterModal';
import BusinessDetailModal from '@/components/BusinessDetailModal';
import { Map, Edit, PlusCircle, AlertTriangle } from 'lucide-react';
import { Business } from '@/types';
import Loader from '@/components/Loader';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import BusinessFormModal from '@/components/BusinessFormModal'; // <-- IMPORT THE NEW MODAL
import { supabase } from '@/lib/supabase';

// Simple Confirmation Modal for Deletion
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
    const categoryName = decodeURIComponent(params.categoryName as string);
    const { user } = useAuth();

    const [businesses, setBusinesses] = useState<Business[]>([]);
    const [subcategory, setSubcategory] = useState<{ id: number; name: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);

    // Admin Edit State
    const [isEditMode, setIsEditMode] = useState(false);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);
    const [deletingBusiness, setDeletingBusiness] = useState<Business | null>(null);

    const fetchData = useCallback(async () => {
        if (!categoryName) return;
        setLoading(true);
        try {
            const { data: subcategoryData, error: subcategoryError } = await supabase.from('subcategories').select('id, name').eq('slug', categoryName).single();
            if (subcategoryError) throw new Error("Subcategory not found");
            setSubcategory(subcategoryData);
            
            const { data: businessesData, error: businessesError } = await supabase.from('businesses').select('*').eq('subcategory_id', subcategoryData.id);
            if (businessesError) throw businessesError;
            
            const formattedBusinesses = businessesData.map(b => ({ ...b, subcategory: subcategoryData.name })) as Business[];
            setBusinesses(formattedBusinesses);
        } catch (error) {
            console.error("Failed to fetch businesses:", error);
        } finally {
            setLoading(false);
        }
    }, [categoryName]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // --- Admin Action Handlers ---
    const handleAddBusiness = () => {
        setEditingBusiness(null);
        setIsFormModalOpen(true);
    };

    const handleEdit = (biz: Business) => {
        setEditingBusiness(biz);
        setIsFormModalOpen(true);
    };

    const handleDelete = (biz: Business) => {
        setDeletingBusiness(biz);
    };
    
    const confirmDelete = async () => {
        if (!deletingBusiness) return;
        
        const { error } = await supabase.from('businesses').delete().eq('id', deletingBusiness.id);

        if (error) {
            alert('Failed to delete business.');
        } else {
            fetchData(); // Refresh list
        }
        setDeletingBusiness(null);
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <>
            {/* User Modals */}
            <FilterModal isOpen={isFilterModalOpen} onClose={() => setIsFilterModalOpen(false)} />
            <BusinessDetailModal business={selectedBusiness} onClose={() => setSelectedBusiness(null)} />
            
            {/* Admin Modals */}
            {user?.role === 'admin' && (
                <>
                    <BusinessFormModal
                        isOpen={isFormModalOpen}
                        onClose={() => setIsFormModalOpen(false)}
                        onSave={fetchData}
                        business={editingBusiness}
                        initialSubcategoryId={subcategory?.id}
                    />
                    <DeleteConfirmationModal
                        isOpen={!!deletingBusiness}
                        onClose={() => setDeletingBusiness(null)}
                        onConfirm={confirmDelete}
                        businessName={deletingBusiness?.name || ''}
                    />
                </>
            )}

            <div className="bg-navy min-h-screen">
                <section className="relative bg-gradient-to-r from-[#0B132B] via-[#1B2A41] to-[#0B132B] py-12 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-gold capitalize">{categoryName}</h1>
                    <p className="text-gray mt-4 text-lg md:text-xl">تصفح أفضل الخيارات المتاحة في منطقتك</p>

                    {user?.role === 'admin' && (
                        <div className="absolute top-4 right-4">
                            <button onClick={() => setIsEditMode(!isEditMode)} className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full transition-colors ${isEditMode ? 'bg-red-500/20 text-red-300 border border-red-500/50' : 'bg-gold/10 text-gold border border-gold/50'}`}>
                                <Edit size={16} />
                                {isEditMode ? 'إنهاء التعديل' : 'تعديل الصفحة'}
                            </button>
                        </div>
                    )}
                </section>

                <main className="container mx-auto px-4 py-8">
                    <FilterChips onOpenFilterModal={() => setIsFilterModalOpen(false)} />
                    <div className="flex justify-between items-center my-4">
                        <p className="text-gray/80">تم العثور على <span className="font-bold text-gold">{businesses.length}</span> نتائج</p>
                        <button className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-gold/10 text-gold"><Map size={20} /> <span className="font-semibold">عرض الخريطة</span></button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {businesses.map((biz) => (
                            <BusinessCard key={biz.id} business={biz} onClick={() => !isEditMode && setSelectedBusiness(biz)} isEditMode={isEditMode} onEdit={() => handleEdit(biz)} onDelete={() => handleDelete(biz)} />
                        ))}
                        {isEditMode && (
                            <button onClick={handleAddBusiness} className="w-full text-left bg-transparent border-2 border-dashed border-gray-600 rounded-lg overflow-hidden shadow-lg hover:border-gold hover:text-gold transition-all duration-300 flex flex-col items-center justify-center min-h-[280px]">
                                <PlusCircle size={48} className="mb-4" />
                                <h3 className="text-xl font-bold">إضافة عمل جديد</h3>
                            </button>
                        )}
                    </div>
                </main>
            </div>
        </>
    );
}