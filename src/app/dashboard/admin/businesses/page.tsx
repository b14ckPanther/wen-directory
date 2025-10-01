// src/app/dashboard/admin/businesses/page.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit, Trash2, PlusCircle, Search, AlertTriangle, CheckCircle } from 'lucide-react';
import type { Business, BusinessStatus } from '@/types';

// --- دالة لتحديد لون الحالة ---
const getStatusChip = (status: BusinessStatus): string => {
    switch (status) {
        case 'مقبول': return 'bg-emerald-500/10 text-emerald-400';
        case 'قيد المراجعة': return 'bg-yellow-500/10 text-yellow-400';
        case 'مرفوض': return 'bg-red-500/10 text-red-400';
        default: return 'bg-gray-500/10 text-gray-400';
    }
}

// --- شاشة تأكيد الحذف ---
const ConfirmationModal = ({ isOpen, onClose, onConfirm, businessName }: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    businessName: string;
}) => {
    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-navy/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
            <motion.div
                initial={{ scale: 0.9, y: -20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-[#1B2A41] w-full max-w-md rounded-2xl p-6 border border-red-500/30 text-center"
            >
                <AlertTriangle size={48} className="mx-auto text-red-400 mb-4" />
                <h2 className="text-xl font-bold text-white mb-2">متأكد بدك تمحى؟</h2>
                <p className="text-gray-400 mb-6">
                    أنت على وشك حذف المصلحة: <span className="font-bold text-gold">{businessName}</span>.
                    <br />
                    هاي الخطوة ما في منها رجعة.
                </p>
                <div className="flex justify-center gap-4">
                    <button onClick={onClose} className="bg-gray-700 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-600 transition-colors">
                        لا، تراجعت
                    </button>
                    <button onClick={onConfirm} className="bg-red-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-700 transition-colors">
                        آه، امحى
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

// --- الصفحة الرئيسية لإدارة المصالح ---
export default function ManageBusinessesPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmingDelete, setConfirmingDelete] = useState<Business | null>(null);
  const [pageMessage, setPageMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchBusinesses = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/businesses');
      const data = await response.json();
      setBusinesses(data);
    } catch (error) {
      console.error("Failed to fetch businesses:", error);
      setPageMessage({ type: 'error', text: 'صار في غلط واحنا بنجيب المصالح.' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBusinesses();
  }, [fetchBusinesses]);
  
  const handleDeleteClick = (biz: Business) => {
    setPageMessage(null); // Clear previous messages
    setConfirmingDelete(biz);
  };
  
  const handleConfirmDelete = async () => {
    if (!confirmingDelete) return;

    try {
        const response = await fetch('/api/businesses', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: confirmingDelete.id }),
        });

        if (response.ok) {
            setPageMessage({ type: 'success', text: `مصلحة "${confirmingDelete.name}" انحذفت بنجاح.` });
            fetchBusinesses(); 
        } else {
            const errorData = await response.json();
            throw new Error(errorData.message || 'فشل الحذف');
        }
    } catch (error) {
        const message = error instanceof Error ? error.message : "صار في غلط بالشبكة.";
        setPageMessage({ type: 'error', text: `ما قدرناش نحذف: ${message}` });
    } finally {
        setConfirmingDelete(null);
    }
  };

  if (loading) {
    return <div className="text-center text-gold p-10">جاري تحميل المصالح...</div>;
  }

  return (
    <>
      <AnimatePresence>
        {confirmingDelete && (
            <ConfirmationModal 
                isOpen={!!confirmingDelete}
                onClose={() => setConfirmingDelete(null)}
                onConfirm={handleConfirmDelete}
                businessName={confirmingDelete.name}
            />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-[#1B2A41] p-4 md:p-6 rounded-2xl border border-gray-800 shadow-lg"
      >
        <AnimatePresence>
            {pageMessage && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                    className={`mb-4 flex items-center gap-3 p-3 rounded-lg text-sm ${
                        pageMessage.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                    }`}
                >
                    {pageMessage.type === 'success' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
                    <span>{pageMessage.text}</span>
                </motion.div>
            )}
        </AnimatePresence>

        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
            <input 
              type="text" 
              placeholder="دوّر على مصلحة..."
              className="w-full bg-[#0A1024] border border-gray-700 rounded-full py-2 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>
          <Link href="/dashboard/admin/businesses/form" className="w-full md:w-auto">
              <button className="w-full flex items-center justify-center gap-2 bg-gold text-navy font-bold py-2 px-4 rounded-lg hover:bg-yellow-300 transition-colors">
                  <PlusCircle size={20} />
                  <span>زيد مصلحة جديدة</span>
              </button>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="border-b border-gray-700">
              <tr>
                <th className="p-3 text-sm font-semibold text-gray-400">اسم المصلحة</th>
                <th className="p-3 text-sm font-semibold text-gray-400">الفئة</th>
                <th className="p-3 text-sm font-semibold text-gray-400">المالك</th>
                <th className="p-3 text-sm font-semibold text-gray-400">الحالة</th>
                <th className="p-3 text-sm font-semibold text-gray-400">الاشتراك</th>
                <th className="p-3 text-sm font-semibold text-gray-400 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {businesses.map(biz => (
                <tr key={biz.id} className="border-b border-gray-800 hover:bg-[#0A1024]/50">
                  <td className="p-4 font-semibold text-white">{biz.name}</td>
                  <td className="p-4 text-gray-300">{biz.subcategory}</td>
                  <td className="p-4 text-gray-300">{biz.owner || <span className="text-gray-500">مش محدد</span>}</td>
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
                        <button onClick={() => handleDeleteClick(biz)} className="text-red-400 hover:text-red-300" title="حذف"><Trash2 size={18} /></button>
                      </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </>
  );
}