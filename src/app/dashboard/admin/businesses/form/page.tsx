// src/app/dashboard/admin/businesses/form/page.tsx
'use client';

import React, { useState, useEffect, Suspense, ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Building, Tag, User, Image as ImageIcon, DollarSign, LucideIcon, Layers, AlertCircle, CheckCircle, UploadCloud } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Image from 'next/image'; // Import the Next.js Image component

// --- Types ---
type InputFieldProps = {
    label: string; name: string; placeholder: string; icon: LucideIcon;
    value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};
type Category = { id: number; name: string; };
type Subcategory = { id: number; name:string; category_id: number; };

// --- InputField Component ---
const InputField: React.FC<InputFieldProps> = ({ label, name, placeholder, icon: Icon, value, onChange }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon className="text-gray-400" size={18} />
            </div>
            <input type="text" name={name} id={name} placeholder={placeholder} value={value} onChange={onChange}
                className="w-full bg-[#0A1024] border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-gold" required />
        </div>
    </div>
);

// --- Main Form Component ---
function BusinessForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const businessId = searchParams.get('id');
  const isEditing = Boolean(businessId);

  const [formData, setFormData] = useState({
      name: '', owner: '', category_id: '', subcategory_id: '',
      image: '', logo: '', subscription: 'أساسي',
  });
  
  // State for file handling and previews
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState<Subcategory[]>([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);


  useEffect(() => {
    // Fetch categories and subcategories
    const fetchDropdownData = async () => {
      const { data: cats } = await supabase.from('categories').select('*');
      if (cats) setCategories(cats);
      const { data: subs } = await supabase.from('subcategories').select('*');
      if (subs) setSubcategories(subs);
    };
    fetchDropdownData();
  }, []);

  useEffect(() => {
    // If editing, fetch existing business data
    if (isEditing && businessId) {
      const fetchBusinessData = async () => {
        setIsLoading(true);
        const { data, error } = await supabase.from('businesses').select('*').eq('id', businessId).single();
        if (error) {
          setMessage({ type: 'error', text: 'Failed to load business data.' });
        } else if (data) {
          setFormData({
            name: data.name || '',
            owner: data.owner || '',
            category_id: data.category_id?.toString() || '',
            subcategory_id: data.subcategory_id?.toString() || '',
            image: data.image || '',
            logo: data.logo || '',
            subscription: data.subscription || 'أساسي',
          });
          // Set existing images for previews
          setCoverPreview(data.image);
          setLogoPreview(data.logo);
        }
        setIsLoading(false);
      };
      fetchBusinessData();
    }
  }, [isEditing, businessId]);
  
   useEffect(() => {
    // Filter subcategories when main category changes
    if (formData.category_id) {
      setFilteredSubcategories(subcategories.filter(sub => sub.category_id === Number(formData.category_id)));
    }
  }, [formData.category_id, subcategories]);

  // Handle file selection and create local previews
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, type: 'cover' | 'logo') => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      if (type === 'cover') {
        setCoverFile(file);
        setCoverPreview(previewUrl);
      } else {
        setLogoFile(file);
        setLogoPreview(previewUrl);
      }
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
  
  // Updated handleSubmit to manage file uploads
  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setMessage(null);

      try {
        let { image: coverUrl, logo: logoUrl } = formData;

        // Upload Cover Image if a new one is selected
        if (coverFile) {
            const filePath = `public/${Date.now()}-${coverFile.name.replace(/\s/g, '_')}`;
            const { error: uploadError } = await supabase.storage.from('business-assets').upload(filePath, coverFile);
            if (uploadError) throw new Error(`Cover image upload failed: ${uploadError.message}`);
            const { data: urlData } = supabase.storage.from('business-assets').getPublicUrl(filePath);
            coverUrl = urlData.publicUrl;
        }

        // Upload Logo Image if a new one is selected
        if (logoFile) {
            const filePath = `public/${Date.now()}-${logoFile.name.replace(/\s/g, '_')}`;
            const { error: uploadError } = await supabase.storage.from('business-assets').upload(filePath, logoFile);
            if (uploadError) throw new Error(`Logo upload failed: ${uploadError.message}`);
            const { data: urlData } = supabase.storage.from('business-assets').getPublicUrl(filePath);
            logoUrl = urlData.publicUrl;
        }
        
        const finalPayload = { ...formData, image: coverUrl, logo: logoUrl };
        const method = isEditing ? 'PUT' : 'POST';
        const apiPayload = isEditing ? { id: businessId, ...finalPayload } : finalPayload;

        const response = await fetch('/api/businesses', {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(apiPayload),
        });

        const result = await response.json();

        if (response.ok) {
          setMessage({ type: 'success', text: result.message });
          setTimeout(() => router.push('/dashboard/admin/businesses'), 1500);
        } else {
          setMessage({ type: 'error', text: result.message || 'An unexpected error occurred.' });
        }

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        setMessage({ type: 'error', text: errorMessage });
      } finally {
        setIsLoading(false);
      }
  };

   return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex items-center gap-4 mb-6">
            <Link href="/dashboard/admin/businesses">
                <div className="p-2 bg-[#1B2A41] rounded-lg hover:bg-gold/10 text-gold">
                    <ArrowRight size={20} />
                </div>
            </Link>
            <h1 className="text-2xl font-bold text-white">
                {isEditing ? 'تعديل العمل' : 'إضافة عمل جديد'}
            </h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#1B2A41] p-8 rounded-2xl border border-gray-800 space-y-6">
            {message && (
                <div className={`flex items-center gap-3 p-3 rounded-lg text-sm ${
                    message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                }`}>
                    {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                    <span>{message.text}</span>
                </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label="اسم العمل" name="name" placeholder="مثال: مطعم القدس" icon={Building} value={formData.name} onChange={handleChange} />
                <InputField label="اسم المالك" name="owner" placeholder="مثال: أحمد خليل" icon={User} value={formData.owner} onChange={handleChange}/>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="category_id" className="block text-sm font-medium text-gray-300 mb-2">الفئة الرئيسية</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Tag className="text-gray-400" size={18} /></div>
                        <select id="category_id" name="category_id" value={formData.category_id} onChange={handleMainCategoryChange} className="w-full bg-[#0A1024] border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-gold appearance-none" required>
                            <option value="">-- اختر فئة رئيسية --</option>
                            {categories.map((cat) => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
                        </select>
                    </div>
                </div>
                <div>
                    <label htmlFor="subcategory_id" className="block text-sm font-medium text-gray-300 mb-2">الفئة الفرعية</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Layers className="text-gray-400" size={18} /></div>
                        <select id="subcategory_id" name="subcategory_id" value={formData.subcategory_id} onChange={handleChange} disabled={!formData.category_id} className="w-full bg-[#0A1024] border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-gold appearance-none disabled:opacity-50 disabled:cursor-not-allowed" required>
                            <option value="">-- اختر فئة فرعية --</option>
                            {filteredSubcategories.map((sub) => (<option key={sub.id} value={sub.id}>{sub.name}</option>))}
                        </select>
                    </div>
                </div>
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
            
            <div>
                <label htmlFor="subscription" className="block text-sm font-medium text-gray-300 mb-2">خطة الاشتراك</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><DollarSign className="text-gray-400" size={18} /></div>
                    <select id="subscription" name="subscription" value={formData.subscription} onChange={handleChange} className="w-full bg-[#0A1024] border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-gold appearance-none">
                        <option value="أساسي">أساسي</option>
                        <option value="مميز">مميز</option>
                        <option value="ذهبي">ذهبي</option>
                    </select>
                </div>
            </div>

            <div className="pt-4 flex justify-end gap-4">
                <Link href="/dashboard/admin/businesses">
                    <button type="button" className="bg-gray-700 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-600 transition-colors">إلغاء</button>
                </Link>
                <button type="submit" disabled={isLoading} className="bg-gold text-navy font-bold py-2 px-6 rounded-lg hover:bg-yellow-300 transition-colors disabled:opacity-50">
                    {isLoading ? 'جاري الحفظ...' : isEditing ? 'حفظ التغييرات' : 'إنشاء العمل'}
                </button>
            </div>
      </form>
    </motion.div>
  );
}

// Wrap the component in Suspense
export default function BusinessFormPage() {
    return (
        <Suspense fallback={<div>Loading form...</div>}>
            <BusinessForm />
        </Suspense>
    );
}