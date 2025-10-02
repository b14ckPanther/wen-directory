'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit, Trash2, PlusCircle, ChevronDown, Image as ImageIcon, Loader, AlertTriangle, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

// --- Types ---
type Subcategory = { id: number; name: string; slug: string; category_id: number; };
type CategorySection = { id: number; name: string; slug: string; description?: string; image?: string; subcategories: Subcategory[]; };

type CategoryData = { id?: number; name: string; slug: string; };
type SubcategoryData = { id?: number; name: string; slug: string; category_id: number; };

type AddCatModalState = { mode: 'add-cat'; data?: undefined };
type EditCatModalState = { mode: 'edit-cat'; data: CategorySection };
type AddSubModalState = { mode: 'add-sub'; data: { category_id: number } };
type EditSubModalState = { mode: 'edit-sub'; data: Subcategory };
type NullModalState = { mode: null; data?: undefined };

type ModalState = AddCatModalState | EditCatModalState | AddSubModalState | EditSubModalState | NullModalState;

type DeleteState = { type: 'cat' | 'sub'; data: { id: number; name: string; }; } | null;


// --- Components ---
const CategoryModal = ({ isOpen, onClose, onSave, categoryData }: { isOpen: boolean; onClose: () => void; onSave: (data: CategoryData) => void; categoryData?: CategorySection; }) => {
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    useEffect(() => { setName(categoryData?.name || ''); setSlug(categoryData?.slug || ''); }, [categoryData]);
    if (!isOpen) return null;
    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSave({ id: categoryData?.id, name, slug }); };
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-navy/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-[#1B2A41] w-full max-w-md rounded-2xl p-6 border border-gold/20">
                <h2 className="text-xl font-bold text-gold mb-4">{categoryData ? 'عدّل القسم' : 'زيد قسم جديد'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" placeholder="اسم القسم" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-[#0A1024] p-2 rounded-lg border border-gray-700"/>
                    <input type="text" placeholder="الاسم بالإنجليزي (للربط)" value={slug} onChange={e => setSlug(e.target.value)} required className="w-full bg-[#0A1024] p-2 rounded-lg border border-gray-700"/>
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="bg-gray-700 py-2 px-4 rounded-lg">إلغاء</button>
                        <button type="submit" className="bg-gold text-navy font-bold py-2 px-4 rounded-lg">حفظ</button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

const SubcategoryModal = ({ isOpen, onClose, onSave, subcategoryData, categoryId }: { isOpen: boolean; onClose: () => void; onSave: (data: SubcategoryData) => void; subcategoryData?: Subcategory; categoryId?: number; }) => {
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    useEffect(() => { setName(subcategoryData?.name || ''); setSlug(subcategoryData?.slug || ''); }, [subcategoryData]);
    if (!isOpen) return null;
    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSave({ id: subcategoryData?.id, name, slug, category_id: subcategoryData?.category_id || categoryId! }); };
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-navy/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-[#1B2A41] w-full max-w-md rounded-2xl p-6 border border-gold/20">
                <h2 className="text-xl font-bold text-gold mb-4">{subcategoryData ? 'عدّل الفئة الفرعية' : 'زيد فئة فرعية'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" placeholder="اسم الفئة" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-[#0A1024] p-2 rounded-lg border border-gray-700"/>
                    <input type="text" placeholder="الاسم بالإنجليزي (للربط)" value={slug} onChange={e => setSlug(e.target.value)} required className="w-full bg-[#0A1024] p-2 rounded-lg border border-gray-700"/>
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="bg-gray-700 py-2 px-4 rounded-lg">إلغاء</button>
                        <button type="submit" className="bg-gold text-navy font-bold py-2 px-4 rounded-lg">حفظ</button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

const ConfirmationModal = ({ deleteState, onClose, onConfirm }: { deleteState: DeleteState; onClose: () => void; onConfirm: () => void; }) => {
    if (!deleteState) return null;
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-navy/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-[#1B2A41] w-full max-w-md rounded-2xl p-6 border border-red-500/30 text-center">
                <AlertTriangle size={48} className="mx-auto text-red-400 mb-4" />
                <h2 className="text-xl font-bold text-white mb-2">متأكد بدك تمحى؟</h2>
                <p className="text-gray-400 mb-6">أنت على وشك حذف: <span className="font-bold text-gold">{deleteState.data.name}</span>.</p>
                <div className="flex justify-center gap-4">
                    <button onClick={onClose} className="bg-gray-700 py-2 px-6 rounded-lg">لا، تراجعت</button>
                    <button onClick={onConfirm} className="bg-red-600 text-white font-bold py-2 px-6 rounded-lg">آه، امحى</button>
                </div>
            </motion.div>
        </motion.div>
    );
};

// --- Page ---
export default function ManageCategoriesPage() {
    const { session } = useAuth();
    const [categorySections, setCategorySections] = useState<CategorySection[]>([]);
    const [loading, setLoading] = useState(true);
    const [openSection, setOpenSection] = useState<number | null>(null);
    const [modalState, setModalState] = useState<ModalState>({ mode: null });
    const [deleteState, setDeleteState] = useState<DeleteState>(null);
    const [pageMessage, setPageMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const fetchCategories = useCallback(async () => {
        if (!session) {
            setLoading(false);
            return;
        }

        setLoading(true);
        const { data: categories, error: catError } = await supabase.from('categories').select('*').order('name', { ascending: true });
        const { data: subcategories, error: subError } = await supabase.from('subcategories').select('*').order('name', { ascending: true });
        if (catError || subError) { console.error(catError || subError); setLoading(false); return; }
        const combinedData: CategorySection[] = categories.map(cat => ({ ...cat, subcategories: subcategories.filter(sub => sub.category_id === cat.id) }));
        setCategorySections(combinedData);
        setLoading(false);
    }, [session]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const handleSave = async (data: CategoryData | SubcategoryData) => {
        const isSub = modalState.mode === 'add-sub' || modalState.mode === 'edit-sub';
        const isEditing = modalState.mode === 'edit-cat' || modalState.mode === 'edit-sub';
        const url = isSub ? '/api/subcategories' : '/api/categories';
        const method = isEditing ? 'PUT' : 'POST';
        
        try {
            const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message);
            setPageMessage({ type: 'success', text: result.message });
            fetchCategories();
        } catch (error) {
            const msg = error instanceof Error ? error.message : "صار في غلط";
            setPageMessage({ type: 'error', text: msg });
        } finally {
            setModalState({ mode: null });
        }
    };

    const handleConfirmDelete = async () => {
        if (!deleteState) return;
        const url = deleteState.type === 'sub' ? '/api/subcategories' : '/api/categories';
        try {
            const response = await fetch(url, { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: deleteState.data.id }) });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message);
            setPageMessage({ type: 'success', text: result.message });
            fetchCategories();
        } catch (error) {
            const msg = error instanceof Error ? error.message : "صار في غلط";
            setPageMessage({ type: 'error', text: msg });
        } finally {
            setDeleteState(null);
        }
    };
    
    if (loading) return <div className="flex justify-center items-center h-full"><Loader className="animate-spin text-gold" size={48} /><p className="ml-4 text-xl"> espere un momento...</p></div>;

    return (
        <>
            <AnimatePresence>
                {modalState.mode === 'add-cat' && <CategoryModal isOpen={true} onClose={() => setModalState({ mode: null })} onSave={handleSave} />}
                {modalState.mode === 'edit-cat' && <CategoryModal isOpen={true} onClose={() => setModalState({ mode: null })} onSave={handleSave} categoryData={modalState.data} />}
                {modalState.mode === 'add-sub' && <SubcategoryModal isOpen={true} onClose={() => setModalState({ mode: null })} onSave={handleSave} categoryId={modalState.data.category_id} />}
                {modalState.mode === 'edit-sub' && <SubcategoryModal isOpen={true} onClose={() => setModalState({ mode: null })} onSave={handleSave} subcategoryData={modalState.data} />}
                {deleteState && <ConfirmationModal deleteState={deleteState} onClose={() => setDeleteState(null)} onConfirm={handleConfirmDelete} />}
            </AnimatePresence>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-6">
                <AnimatePresence>
                    {pageMessage && (
                        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={`flex items-center gap-3 p-3 rounded-lg text-sm ${pageMessage.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                            {pageMessage.type === 'success' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
                            <span>{pageMessage.text}</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-white">تحكم بالفئات والأقسام</h1>
                    <button onClick={() => setModalState({ mode: 'add-cat' })} className="flex items-center gap-2 bg-gold text-navy font-bold py-2 px-4 rounded-lg hover:bg-yellow-300 transition-colors">
                        <PlusCircle size={20} /><span>زيد قسم جديد</span>
                    </button>
                </div>

                <div className="bg-[#1B2A41] rounded-2xl border border-gray-800 shadow-lg">
                    {categorySections.map(section => (
                        <div key={section.id} className="border-b border-gray-800 last:border-b-0">
                            <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-[#0A1024]/50" onClick={() => setOpenSection(openSection === section.id ? null : section.id)}>
                                <div className="flex items-center gap-4"><ImageIcon size={20} className="text-gold" /><span className="font-semibold text-white">{section.name}</span></div>
                                <div className="flex items-center gap-4">
                                    <button onClick={(e) => { e.stopPropagation(); setModalState({ mode: 'edit-cat', data: section }); }} className="text-blue-400 hover:text-blue-300" title="تعديل"><Edit size={18} /></button>
                                    <button onClick={(e) => { e.stopPropagation(); setDeleteState({ type: 'cat', data: section }); }} className="text-red-400 hover:text-red-300" title="حذف"><Trash2 size={18} /></button>
                                    <ChevronDown size={20} className={`text-gray-400 transition-transform ${openSection === section.id ? 'rotate-180' : ''}`} />
                                </div>
                            </div>
                            <AnimatePresence>
                                {openSection === section.id && (
                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                        <div className="p-4 pl-12 bg-[#0A1024]/50">
                                            {section.subcategories.map(subCat => (
                                                <div key={subCat.id} className="flex items-center justify-between py-2 border-b border-gray-700/50 last:border-b-0">
                                                    <span className="text-gray-300">{subCat.name}</span>
                                                    <div className="flex items-center gap-3">
                                                        <Link href={`/dashboard/admin/categories/${subCat.slug}`} title="إدارة المصالح في هذه الفئة">
                                                            <div className="text-green-400 hover:text-green-300">
                                                                <Edit size={16} />
                                                            </div>
                                                        </Link>
                                                        <button onClick={() => setModalState({ mode: 'edit-sub', data: subCat })} className="text-blue-400 hover:text-blue-300" title="تعديل"><Edit size={16} /></button>
                                                        <button onClick={() => setDeleteState({ type: 'sub', data: subCat })} className="text-red-400 hover:text-red-300" title="حذف"><Trash2 size={16} /></button>
                                                    </div>
                                                </div>
                                            ))}
                                            <button onClick={() => setModalState({ mode: 'add-sub', data: { category_id: section.id } })} className="flex items-center gap-2 text-sm text-gold mt-4 hover:text-yellow-300">
                                                <PlusCircle size={16} /><span>زيد فئة فرعية</span>
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </motion.div>
        </>
    );
}