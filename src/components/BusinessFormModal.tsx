// src/components/BusinessFormModal.tsx
'use client';

import React, { useState, useEffect, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building, Tag, Layers, DollarSign, Phone, X, AlertCircle, CheckCircle, UploadCloud} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Business } from '@/types';
import Image from 'next/image';

// --- Types ---
type Category = { id: number; name: string; };
type Subcategory = { id: number; name: string; category_id: number; };

type BusinessFormModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
    business?: Business | null;
    initialSubcategoryId?: number;
};

// --- Main Modal Form Component ---
export default function BusinessFormModal({ isOpen, onClose, onSave, business, initialSubcategoryId }: BusinessFormModalProps) {
    const isEditing = Boolean(business);

    const [formData, setFormData] = useState({
        name: '',
        category_id: '',
        subcategory_id: initialSubcategoryId?.toString() || '',
        subscription: 'أساسي' as 'أساسي' | 'مميز' | 'ذهبي',
        phone: '',
        owner: '',
        image: '',
        logo: '',
    });

    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [coverPreview, setCoverPreview] = useState<string | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);

    const [categories, setCategories] = useState<Category[]>([]);
    const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
    const [filteredSubcategories, setFilteredSubcategories] = useState<Subcategory[]>([]);

    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // Fetch dropdown data on mount
    useEffect(() => {
        const fetchDropdownData = async () => {
            const { data: cats } = await supabase.from('categories').select('*');
            if (cats) setCategories(cats);
            const { data: subs } = await supabase.from('subcategories').select('*');
            if (subs) setSubcategories(subs);
        };
        fetchDropdownData();
    }, []);

    // Populate form when editing
    useEffect(() => {
        if (business) {
            setFormData({
                name: business.name || '',
                category_id: business.category_id?.toString() || '',
                subcategory_id: business.subcategory_id?.toString() || '',
                subscription: business.subscription || 'أساسي',
                phone: business.phone || '',
                owner: business.owner || '',
                image: business.image || '',
                logo: 'logo' in business ? business.logo || '' : '',
            });
            setCoverPreview(business.image);
            if ('logo' in business) {
                setLogoPreview(business.logo);
            }
        } else {
            // Reset for new entry, keeping initial subcategory
            setFormData({
                name: '',
                category_id: '',
                subcategory_id: initialSubcategoryId?.toString() || '',
                subscription: 'أساسي',
                phone: '',
                owner: '',
                image: '',
                logo: '',
            });
        }
    }, [business, initialSubcategoryId]);

    // Filter subcategories when category changes
    useEffect(() => {
        if (formData.category_id) {
            setFilteredSubcategories(subcategories.filter(sub => sub.category_id === Number(formData.category_id)));
        } else {
            setFilteredSubcategories([]);
        }
    }, [formData.category_id, subcategories]);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>, type: 'cover' | 'logo') => {
        const file = e.target.files?.[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            if (type === 'cover') { setCoverFile(file); setCoverPreview(previewUrl); }
            else { setLogoFile(file); setLogoPreview(previewUrl); }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleMainCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const categoryId = e.target.value;
        setFormData(prev => ({ ...prev, category_id: categoryId, subcategory_id: '' }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);

        try {
            let coverUrl = formData.image;
            let logoUrl = formData.logo;

            if (coverFile) {
                const filePath = `public/${Date.now()}-${coverFile.name.replace(/\s/g, '_')}`;
                const { error: uploadError } = await supabase.storage.from('business-assets').upload(filePath, coverFile);
                if (uploadError) throw new Error(`Cover image upload failed: ${uploadError.message}`);
                coverUrl = supabase.storage.from('business-assets').getPublicUrl(filePath).data.publicUrl;
            }

            if (logoFile) {
                const filePath = `public/${Date.now()}-${logoFile.name.replace(/\s/g, '_')}`;
                const { error: uploadError } = await supabase.storage.from('business-assets').upload(filePath, logoFile);
                if (uploadError) throw new Error(`Logo upload failed: ${uploadError.message}`);
                logoUrl = supabase.storage.from('business-assets').getPublicUrl(filePath).data.publicUrl;
            }

            const payload = { ...formData, image: coverUrl, logo: logoUrl, category_id: Number(formData.category_id), subcategory_id: Number(formData.subcategory_id) };
            const { error } = isEditing
                ? await supabase.from('businesses').update(payload).eq('id', business!.id)
                : await supabase.from('businesses').insert(payload);

            if (error) throw error;

            setMessage({ type: 'success', text: `تم ${isEditing ? 'تحديث' : 'إنشاء'} المصلحة بنجاح!` });
            setTimeout(() => {
                onSave(); // This will trigger a data refresh on the parent page
                onClose();
            }, 1500);

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
            setMessage({ type: 'error', text: errorMessage });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-navy/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div initial={{ scale: 0.9, y: -20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                        className="bg-[#1B2A41] w-full max-w-lg rounded-2xl p-6 border border-gold/20 flex flex-col max-h-[90vh]">

                        <div className="flex justify-between items-center mb-4 flex-shrink-0">
                            <h2 className="text-xl font-bold text-gold">{isEditing ? 'تعديل المصلحة' : 'إضافة مصلحة جديدة'}</h2>
                            <button onClick={onClose}><X className="text-gray-400" /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto pr-2">
                            {message && (
                                <div className={`flex items-center gap-3 p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                    {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                                    <span>{message.text}</span>
                                </div>
                            )}

                            <InputField label="اسم المصلحة" name="name" placeholder="مثال: مطعم القدس" icon={Building} value={formData.name} onChange={handleChange} required />
                            <InputField label="رقم الهاتف" name="phone" placeholder="050-123-4567" icon={Phone} value={formData.phone} onChange={handleChange} required={false} />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <SelectField label="الفئة الرئيسية" name="category_id" value={formData.category_id} onChange={handleMainCategoryChange} icon={Tag} options={categories.map(c => ({ value: c.id, label: c.name }))} />
                                <SelectField label="الفئة الفرعية" name="subcategory_id" value={formData.subcategory_id} onChange={handleChange} icon={Layers} options={filteredSubcategories.map(s => ({ value: s.id, label: s.name }))} disabled={!formData.category_id} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">صورة الغلاف</label>
                                    <label htmlFor="cover-upload" className="cursor-pointer bg-[#0A1024] border-2 border-dashed border-gray-700 rounded-lg p-4 text-center hover:border-gold transition-colors flex flex-col items-center justify-center h-40">
                                        {coverPreview ? (
                                            <Image src={coverPreview} alt="Cover preview" width={150} height={150} className="max-h-full w-auto object-contain rounded-md" />
                                        ) : (
                                            <div className="text-gray-400">
                                                <UploadCloud size={32} className="mx-auto" />
                                                <p>Click to upload cover image</p>
                                            </div>
                                        )}
                                    </label>
                                    <input id="cover-upload" name="cover-upload" type="file" className="sr-only" onChange={(e) => handleFileChange(e, 'cover')} accept="image/*" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">الشعار (اللوغو)</label>
                                    <label htmlFor="logo-upload" className="cursor-pointer bg-[#0A1024] border-2 border-dashed border-gray-700 rounded-lg p-4 text-center hover:border-gold transition-colors flex flex-col items-center justify-center h-40">
                                        {logoPreview ? (
                                            <Image src={logoPreview} alt="Logo preview" width={150} height={150} className="max-h-full w-auto object-contain rounded-md" />
                                        ) : (
                                            <div className="text-gray-400">
                                                <UploadCloud size={32} className="mx-auto" />
                                                <p>Click to upload logo</p>
                                            </div>
                                        )}
                                    </label>
                                    <input id="logo-upload" name="logo-upload" type="file" className="sr-only" onChange={(e) => handleFileChange(e, 'logo')} accept="image/*" />
                                </div>
                            </div>

                            <SelectField label="خطة الاشتراك" name="subscription" value={formData.subscription} onChange={handleChange} icon={DollarSign} options={[{ value: 'أساسي', label: 'أساسي' }, { value: 'مميز', label: 'مميز' }, { value: 'ذهبي', label: 'ذهبي' }]} />

                            <div className="pt-4 flex justify-end gap-4">
                                <button type="button" onClick={onClose} className="bg-gray-700 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-600 transition-colors">إلغاء</button>
                                <button type="submit" disabled={isLoading} className="bg-gold text-navy font-bold py-2 px-6 rounded-lg hover:bg-yellow-300 transition-colors disabled:opacity-50">
                                    {isLoading ? 'جاري الحفظ...' : isEditing ? 'حفظ التغييرات' : 'إنشاء المصلحة'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// Helper components with corrected types
const InputField = ({ label, name, placeholder, icon: Icon, value, onChange, required = true, type = 'text' }: { label: string; name: string; placeholder: string; icon: React.ElementType; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; required?: boolean; type?: string }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon className="text-gray-400" size={18} />
            </div>
            <input type={type} name={name} id={name} placeholder={placeholder} value={value} onChange={onChange} className="w-full bg-[#0A1024] border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white" required={required} />
        </div>
    </div>
);

const SelectField = ({ label, name, value, onChange, icon: Icon, options, disabled = false }: { label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; icon: React.ElementType; options: { value: string | number; label: string }[], disabled?: boolean }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Icon className="text-gray-400" size={18} /></div>
            <select id={name} name={name} value={value} onChange={onChange} className="w-full bg-[#0A1024] border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white appearance-none disabled:opacity-50" disabled={disabled} required>
                <option value="">-- اختر --</option>
                {options.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
            </select>
        </div>
    </div>
);