// src/app/dashboard/admin/businesses/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Edit, Trash2, PlusCircle, Search } from 'lucide-react';
import type { Business, BusinessStatus } from '@/types';

const getStatusChip = (status: BusinessStatus): string => {
    switch (status) {
        case 'مقبول': return 'bg-emerald-500/10 text-emerald-400';
        case 'قيد المراجعة': return 'bg-yellow-500/10 text-yellow-400';
        case 'مرفوض': return 'bg-red-500/10 text-red-400';
        default: return 'bg-gray-500/10 text-gray-400';
    }
}

export default function ManageBusinessesPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBusinesses = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/businesses');
      const data = await response.json();
      setBusinesses(data);
    } catch (error) {
      console.error("Failed to fetch businesses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, []);
  
  // ✅ NEW: Handle Delete Function
  const handleDelete = async (bizId: number, bizName: string) => {
    if (window.confirm(`Are you sure you want to delete "${bizName}"? This action cannot be undone.`)) {
        try {
            const response = await fetch('/api/businesses', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: bizId }),
            });

            if (response.ok) {
                // Refresh the list after a successful delete
                fetchBusinesses(); 
            } else {
                const errorData = await response.json();
                console.error("Failed to delete business:", errorData.message);
                alert(`Error: ${errorData.message}`); // Shows an error if deletion fails
            }
        } catch (error) {
            console.error("Network error:", error);
            alert("A network error occurred while trying to delete the business.");
        }
    }
  };

  if (loading) {
    return <div>Loading businesses...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[#1B2A41] p-4 md:p-6 rounded-2xl border border-gray-800 shadow-lg"
    >
      {/* Header and Actions */}
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

      {/* Businesses Table */}
      <div className="overflow-x-auto">
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
            {businesses.map(biz => (
              <tr key={biz.id} className="border-b border-gray-800 hover:bg-[#0A1024]/50">
                <td className="p-4 font-semibold text-white">{biz.name}</td>
                <td className="p-4 text-gray-300">{biz.subcategory}</td>
                <td className="p-4 text-gray-300">{biz.owner}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusChip(biz.status)}`}>
                    {biz.status}
                  </span>
                </td>
                <td className="p-4 text-gray-300">{biz.subscription}</td>
                <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-3">
                      {/* ✅ FIX: Pass the business ID as a query parameter */}
                      <Link href={`/dashboard/admin/businesses/form?id=${biz.id}`}>
                        <button className="text-blue-400 hover:text-blue-300" title="تعديل"><Edit size={18} /></button>
                      </Link>
                      {/* ✅ FIX: Call the new handleDelete function */}
                      <button onClick={() => handleDelete(biz.id, biz.name)} className="text-red-400 hover:text-red-300" title="حذف"><Trash2 size={18} /></button>
                    </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}