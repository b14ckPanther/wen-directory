'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Edit, Trash2, PlusCircle, Search, MoreVertical } from 'lucide-react';

// Define the exact possible values for a business status
type BusinessStatus = 'مقبول' | 'قيد المراجعة' | 'مرفوض';

// Define the shape of a business object
type MockBusiness = {
  id: number;
  name: string;
  category: string;
  owner: string;
  status: BusinessStatus;
  subscription: string;
};

// Apply the types to your mock data array
const mockBusinesses: MockBusiness[] = [
  { id: 1, name: 'مطعم القدس', category: 'مطاعم', owner: 'أحمد خليل', status: 'مقبول', subscription: 'مميز' },
  { id: 2, name: 'صالون الملكة', category: 'جمال', owner: 'فاطمة علي', status: 'قيد المراجعة', subscription: 'أساسي' },
  { id: 3, name: 'ورشة أبو أحمد', category: 'سيارات', owner: 'أحمد ناصر', status: 'مرفوض', subscription: 'لا يوجد' },
  { id: 4, name: 'عيادة الأمل', category: 'صحة', owner: 'سارة إبراهيم', status: 'مقبول', subscription: 'مميز' },
];

// Type the 'status' parameter in the helper function
const getStatusChip = (status: BusinessStatus): string => {
    switch (status) {
        case 'مقبول': return 'bg-emerald-500/10 text-emerald-400';
        case 'قيد المراجعة': return 'bg-yellow-500/10 text-yellow-400';
        case 'مرفوض': return 'bg-red-500/10 text-red-400';
        default: return 'bg-gray-500/10 text-gray-400';
    }
}

export default function ManageBusinessesPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[#1B2A41] p-4 md:p-6 rounded-2xl border border-gray-800 shadow-lg"
    >
      {/* Header and Actions - Now Responsive */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
          <input 
            type="text" 
            placeholder="ابحث عن عمل..."
            className="w-full bg-[#0A1024] border border-gray-700 rounded-full py-2 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-gold"
          />
        </div>
        <Link href="/dashboard/admin/businesses/form" className="w-full md:w-auto">
            <button className="w-full flex items-center justify-center gap-2 bg-gold text-navy font-bold py-2 px-4 rounded-lg hover:bg-yellow-300 transition-colors">
                <PlusCircle size={20} />
                <span>إضافة عمل جديد</span>
            </button>
        </Link>
      </div>

      {/* Businesses Table - Hidden on Mobile */}
      <div className="overflow-x-auto hidden md:block">
        <table className="w-full text-right">
          <thead className="border-b border-gray-700">
            <tr>
              <th className="p-3 text-sm font-semibold text-gray-400">اسم العمل</th>
              <th className="p-3 text-sm font-semibold text-gray-400">الفئة</th>
              <th className="p-3 text-sm font-semibold text-gray-400">المالك</th>
              <th className="p-3 text-sm font-semibold text-gray-400">الحالة</th>
              <th className="p-3 text-sm font-semibold text-gray-400">الاشتراك</th>
              <th className="p-3 text-sm font-semibold text-gray-400 text-center">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {mockBusinesses.map(biz => (
              <tr key={biz.id} className="border-b border-gray-800 hover:bg-[#0A1024]/50">
                <td className="p-4 font-semibold text-white">{biz.name}</td>
                <td className="p-4 text-gray-300">{biz.category}</td>
                <td className="p-4 text-gray-300">{biz.owner}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusChip(biz.status)}`}>
                    {biz.status}
                  </span>
                </td>
                <td className="p-4 text-gray-300">{biz.subscription}</td>
                <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <Link href={`/dashboard/admin/businesses/form?id=${biz.id}`}>
                        <button className="text-blue-400 hover:text-blue-300" title="تعديل"><Edit size={18} /></button>
                      </Link>
                      <button className="text-red-400 hover:text-red-300" title="حذف"><Trash2 size={18} /></button>
                    </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Business Cards - For Mobile View */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {mockBusinesses.map(biz => (
            <div key={biz.id} className="bg-[#0A1024] p-4 rounded-lg border border-gray-800 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="font-bold text-white text-lg">{biz.name}</p>
                        <p className="text-sm text-gold">{biz.category}</p>
                    </div>
                     <button className="text-gray-400"><MoreVertical size={20} /></button>
                </div>
                <div className="text-sm text-gray-300">
                    <span className="font-semibold text-gray-500">المالك: </span>{biz.owner}
                </div>
                <div className="flex justify-between items-center mt-2">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusChip(biz.status)}`}>
                        {biz.status}
                    </span>
                    <div className="flex items-center gap-3">
                        <Link href={`/dashboard/admin/businesses/form?id=${biz.id}`}>
                            <button className="text-blue-400 hover:text-blue-300" title="تعديل"><Edit size={18} /></button>
                        </Link>
                        <button className="text-red-400 hover:text-red-300" title="حذف"><Trash2 size={18} /></button>
                    </div>
                </div>
            </div>
        ))}
      </div>
    </motion.div>
  );
}