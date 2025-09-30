'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Edit, Trash2, PlusCircle, Search } from 'lucide-react';
import Image from 'next/image';

// Mock data for products/services
const mockProducts = [
  { id: 1, name: 'بيتزا مارجريتا', price: '45.00₪', category: 'البيتزا', stock: 25, image: 'https://images.unsplash.com/photo-1594007654729-407eedc4be65' },
  { id: 2, name: 'برجر كلاسيك', price: '55.00₪', category: 'البرجر', stock: 15, image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add' },
  { id: 3, name: 'سلطة سيزر', price: '35.00₪', category: 'السلطات', stock: 30, image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9' },
  { id: 4, name: 'استشارة قانونية', price: '350.00₪', category: 'الاستشارات', stock: 10, image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f' },
];

export default function ManageProductsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[#1B2A41] p-4 md:p-6 pr-20 rounded-2xl border border-gray-800 shadow-lg"
    >
      {/* Header and Actions */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-white">إدارة المنتجات والخدمات</h1>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="ابحث عن منتج..."
              className="w-full bg-[#0A1024] border border-gray-700 rounded-full py-2 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>
          <button className="flex-shrink-0 flex items-center justify-center gap-2 bg-gold text-navy font-bold py-2 px-4 rounded-lg hover:bg-yellow-300 transition-colors">
            <PlusCircle size={20} />
            <span className="hidden sm:inline">إضافة جديد</span>
          </button>
        </div>
      </div>

      {/* Products Table (Desktop) */}
      <div className="overflow-x-auto hidden md:block">
        <table className="w-full text-right">
          <thead className="border-b border-gray-700">
            <tr>
              <th className="p-3 text-sm font-semibold text-gray-400">المنتج/الخدمة</th>
              <th className="p-3 text-sm font-semibold text-gray-400">السعر</th>
              <th className="p-3 text-sm font-semibold text-gray-400">الفئة</th>
              <th className="p-3 text-sm font-semibold text-gray-400">المخزون/الكمية</th>
              <th className="p-3 text-sm font-semibold text-gray-400 text-center">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {mockProducts.map((product) => (
              <tr key={product.id} className="border-b border-gray-800 hover:bg-[#0A1024]/50">
                <td className="p-4 font-semibold text-white flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg overflow-hidden relative flex-shrink-0">
                    <Image src={product.image} alt={product.name} fill className="object-cover" />
                  </div>
                  {product.name}
                </td>
                <td className="p-4 text-gray-300">{product.price}</td>
                <td className="p-4 text-gray-300">{product.category}</td>
                <td className="p-4 text-gray-300">{product.stock}</td>
                <td className="p-4 text-center">
                  <div className="flex items-center justify-center gap-3">
                    <button className="text-blue-400 hover:text-blue-300" title="تعديل">
                      <Edit size={18} />
                    </button>
                    <button className="text-red-400 hover:text-red-300" title="حذف">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Product Cards (Mobile) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
        {mockProducts.map((product) => (
          <div
            key={product.id}
            className="bg-[#0A1024] rounded-lg border border-gray-800 flex flex-col"
          >
            <div className="relative h-32">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover rounded-t-lg"
              />
            </div>
            <div className="p-4 flex flex-col gap-3 flex-grow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-white">{product.name}</p>
                  <p className="text-sm text-gold">{product.category}</p>
                </div>
                <p className="font-bold text-lg text-emerald-400">{product.price}</p>
              </div>
              <div className="flex-grow"></div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">الكمية: {product.stock}</span>
                <div className="flex items-center gap-3">
                  <button className="text-blue-400 hover:text-blue-300" title="تعديل">
                    <Edit size={18} />
                  </button>
                  <button className="text-red-400 hover:text-red-300" title="حذف">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
