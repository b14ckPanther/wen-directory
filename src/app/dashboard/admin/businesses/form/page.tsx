'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Building, Tag, User, Image as ImageIcon, DollarSign, LucideIcon, Layers } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

// InputField component remains the same

type InputFieldProps = {
    label: string;
    name: string;
    placeholder: string;
    icon: LucideIcon;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

type Category = {
  id: number;
  name: string;
};

type Subcategory = {
  id: number;
  name:string;
  category_id: number;
};

const InputField: React.FC<InputFieldProps> = ({ label, name, placeholder, icon: Icon, value, onChange }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon className="text-gray-400" size={18} />
            </div>
            <input 
                type="text" 
                name={name}
                id={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="w-full bg-[#0A1024] border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-gold"
                required
            />
        </div>
    </div>
);

export default function BusinessFormPage() {
  const router = useRouter();
  const isEditing = false;

  const [formData, setFormData] = useState({
      name: '',
      owner: '',
      category_id: '',
      subcategory_id: '',
      image: '',
      logo: '',
      subscription: 'أساسي',
  });

const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState<Subcategory[]>([]);

    useEffect(() => {
    const fetchCategories = async () => {
      const { data: categoriesData, error: categoriesError } = await supabase.from('categories').select('*');
      if (categoriesError) console.error('Error fetching categories:', categoriesError);
      else setCategories(categoriesData);

      const { data: subcategoriesData, error: subcategoriesError } = await supabase.from('subcategories').select('*');
      if (subcategoriesError) console.error('Error fetching subcategories:', subcategoriesError);
      else setSubcategories(subcategoriesData);
    };
    fetchCategories();
  }, []);
 const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMainCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = e.target.value;
    setFormData(prev => ({ ...prev, category_id: categoryId, subcategory_id: '' }));
    setFilteredSubcategories(subcategories.filter(sub => sub.category_id === Number(categoryId)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        const response = await fetch('/api/businesses', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          alert(`تم تسجيل العمل "${formData.name}" بنجاح!`);
          router.push('/dashboard/admin/businesses');
        } else {
          const errorData = await response.json();
          alert(`حدث خطأ أثناء إضافة العمل: ${errorData.message}`);
        }
      } catch (error) {
        console.error("Failed to submit form:", error);
        alert('حدث خطأ في الشبكة.');
      }
  };

   return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="اسم العمل" name="name" placeholder="مثال: مطعم القدس" icon={Building} value={formData.name} onChange={handleChange} />
            <InputField label="اسم المالك" name="owner" placeholder="مثال: أحمد خليل" icon={User} value={formData.owner} onChange={handleChange}/>
        </div>
        
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label htmlFor="category_id" className="block text-sm font-medium text-gray-300 mb-2">الفئة الرئيسية</label>
                <div className="relative">
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Tag className="text-gray-400" size={18} />
                    </div>
                    <select
                        id="category_id"
                        name="category_id"
                        value={formData.category_id}
                        onChange={handleMainCategoryChange}
                        className="w-full bg-[#0A1024] border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-gold appearance-none"
                        required
                    >
                        <option value="">-- اختر فئة رئيسية --</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div>
                <label htmlFor="subcategory_id" className="block text-sm font-medium text-gray-300 mb-2">الفئة الفرعية</label>
                 <div className="relative">
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Layers className="text-gray-400" size={18} />
                    </div>
                    <select
                        id="subcategory_id"
                        name="subcategory_id"
                        value={formData.subcategory_id}
                        onChange={handleChange}
                        disabled={!formData.category_id}
                        className="w-full bg-[#0A1024] border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-gold appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                        required
                    >
                        <option value="">-- اختر فئة فرعية --</option>
                        {filteredSubcategories.map((sub) => (
                            <option key={sub.id} value={sub.id}>
                                {sub.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="رابط صورة الغلاف" name="image" placeholder="https://..." icon={ImageIcon} value={formData.image} onChange={handleChange} />
            <InputField label="رابط الشعار (اللوغو)" name="logo" placeholder="https://..." icon={ImageIcon} value={formData.logo} onChange={handleChange}/>
        </div>
        
        <div>
            <label htmlFor="subscription" className="block text-sm font-medium text-gray-300 mb-2">خطة الاشتراك</label>
            <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="text-gray-400" size={18} />
                </div>
                <select 
                    id="subscription" 
                    name="subscription"
                    value={formData.subscription}
                    onChange={handleChange}
                    className="w-full bg-[#0A1024] border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-gold appearance-none"
                >
                    <option value="أساسي">أساسي</option>
                    <option value="مميز">مميز</option>
                    <option value="ذهبي">ذهبي</option>
                </select>
            </div>
        </div>

        <div className="pt-4 flex justify-end gap-4">
            <Link href="/dashboard/admin/businesses">
                <button type="button" className="bg-gray-700 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-600 transition-colors">
                    إلغاء
                </button>
            </Link>
            <button type="submit" className="bg-gold text-navy font-bold py-2 px-6 rounded-lg hover:bg-yellow-300 transition-colors">
                {isEditing ? 'حفظ التغييرات' : 'إنشاء العمل'}
            </button>
        </div>
      </form>
    </motion.div>
  );
}