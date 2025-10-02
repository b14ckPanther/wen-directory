// src/components/modals/AdminModals.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { CategorySection, Subcategory } from '@/types'; // Assuming types are exported from types.ts

// --- Types for Modal Data ---
export type CategoryData = { id?: number; name: string; slug: string; description: string; image: string; };
export type SubcategoryData = { id?: number; name: string; slug: string; category_id: number; icon: string; };

// --- Category Modal ---
export const CategoryModal = ({
  isOpen,
  onClose,
  onSave,
  categoryData,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CategoryData) => void;
  categoryData?: CategorySection;
}) => {
  const [formData, setFormData] = useState({ name: '', slug: '', description: '', image: '' });

  useEffect(() => {
    if (categoryData) {
      setFormData({
        name: categoryData.name || '',
        slug: categoryData.slug || '',
        description: categoryData.description || '',
        image: categoryData.image || '',
      });
    } else {
      setFormData({ name: '', slug: '', description: '', image: '' });
    }
  }, [categoryData]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ id: categoryData?.id, ...formData });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-navy/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-[#1B2A41] w-full max-w-md rounded-2xl p-6 border border-gold/20">
        <h2 className="text-xl font-bold text-gold mb-4">{categoryData ? 'Edit Category' : 'Add New Category'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="name" placeholder="Category Name" value={formData.name} onChange={handleChange} required className="w-full bg-[#0A1024] p-2 rounded-lg border border-gray-700 text-white"/>
          <input type="text" name="slug" placeholder="Slug (e.g., 'food-dining')" value={formData.slug} onChange={handleChange} required className="w-full bg-[#0A1024] p-2 rounded-lg border border-gray-700 text-white"/>
          <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="w-full bg-[#0A1024] p-2 rounded-lg border border-gray-700 text-white"/>
          <input type="text" name="image" placeholder="Image URL" value={formData.image} onChange={handleChange} className="w-full bg-[#0A1024] p-2 rounded-lg border border-gray-700 text-white"/>
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="bg-gray-700 py-2 px-4 rounded-lg">Cancel</button>
            <button type="submit" className="bg-gold text-navy font-bold py-2 px-4 rounded-lg">Save</button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

// --- Subcategory Modal ---
export const SubcategoryModal = ({
  isOpen,
  onClose,
  onSave,
  subcategoryData,
  categoryId,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: SubcategoryData) => void;
  subcategoryData?: Subcategory;
  categoryId?: number;
}) => {
    const [formData, setFormData] = useState({ name: '', slug: '', icon: 'UtensilsCrossed' });

    useEffect(() => {
      if (subcategoryData) {
        setFormData({
            name: subcategoryData.name || '',
            slug: subcategoryData.slug || '',
            icon: (subcategoryData.icon as string) || 'UtensilsCrossed',
        });
      } else {
        setFormData({ name: '', slug: '', icon: 'UtensilsCrossed' });
      }
    }, [subcategoryData]);

  if (!isOpen) return null;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalCategoryId = subcategoryData?.category_id || categoryId;
    if (finalCategoryId === undefined) {
      console.error("Category ID is missing");
      return;
    }
    onSave({ id: subcategoryData?.id, ...formData, category_id: finalCategoryId });
  };

  return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-navy/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-[#1B2A41] w-full max-w-md rounded-2xl p-6 border border-gold/20">
                <h2 className="text-xl font-bold text-gold mb-4">{subcategoryData ? 'Edit Subcategory' : 'Add New Subcategory'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" name="name" placeholder="Subcategory Name" value={formData.name} onChange={handleChange} required className="w-full bg-[#0A1024] p-2 rounded-lg border border-gray-700 text-white"/>
                    <input type="text" name="slug" placeholder="Slug (e.g., 'restaurants')" value={formData.slug} onChange={handleChange} required className="w-full bg-[#0A1024] p-2 rounded-lg border border-gray-700 text-white"/>
                    <input type="text" name="icon" placeholder="Icon Name (e.g., 'UtensilsCrossed')" value={formData.icon} onChange={handleChange} className="w-full bg-[#0A1024] p-2 rounded-lg border border-gray-700 text-white"/>
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="bg-gray-700 py-2 px-4 rounded-lg">Cancel</button>
                        <button type="submit" className="bg-gold text-navy font-bold py-2 px-4 rounded-lg">Save</button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
  );
};


// --- Confirmation Modal ---
export const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  itemName,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
}) => {
  if (!isOpen) return null;
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-navy/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-[#1B2A41] w-full max-w-md rounded-2xl p-6 border border-red-500/30 text-center">
        <AlertTriangle size={48} className="mx-auto text-red-400 mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Are you sure?</h2>
        <p className="text-gray-400 mb-6">
          You are about to delete: <span className="font-bold text-gold">{itemName}</span>. This action cannot be undone.
        </p>
        <div className="flex justify-center gap-4">
          <button onClick={onClose} className="bg-gray-700 py-2 px-6 rounded-lg">Cancel</button>
          <button onClick={onConfirm} className="bg-red-600 text-white font-bold py-2 px-6 rounded-lg">Yes, Delete</button>
        </div>
      </motion.div>
    </motion.div>
  );
};