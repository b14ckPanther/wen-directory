'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, Briefcase, UserPlus, Clock, LucideIcon, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Business } from '@/types';

type RegistrationRequest = {
  id: number;
  name: string;
  business_name: string;
  business_type: string;
};

type StatCardProps = {
    icon: LucideIcon;
    title: string;
    value: string;
    change: string;
    color: { border: string; bg: string; icon: string; };
};

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, title, value, change, color }) => (
    <motion.div 
        whileHover={{ y: -5 }}
        className={`bg-[#1B2A41] p-6 rounded-2xl border ${color.border} shadow-lg`}>
        <div className="flex justify-between items-start">
            <div className="flex flex-col">
                <p className="text-sm text-gray-400">{title}</p>
                <p className="text-3xl font-bold text-white">{value}</p>
            </div>
            <div className={`p-3 rounded-xl ${color.bg}`}>
                <Icon size={24} className={color.icon} />
            </div>
        </div>
        <p className={`text-xs mt-2 ${change.startsWith('+') ? 'text-emerald-400' : 'text-yellow-400'}`}>{change}</p>
    </motion.div>
);

export default function AdminDashboardPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [requests, setRequests] = useState<RegistrationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageMessage, setPageMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const { data: businessesData } = await supabase.from('businesses').select('*');
    if (businessesData) setBusinesses(businessesData as Business[]);
    
    const { data: requestsData } = await supabase
      .from('registration_requests')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });
      
    if (requestsData) setRequests(requestsData);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleApprove = async (requestId: number) => {
    try {
      const response = await fetch('/api/admin/approve-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);

      setPageMessage({ type: 'success', text: result.message });
      fetchData(); // Refresh data after approval
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      setPageMessage({ type: 'error', text: errorMessage });
    }
  };

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <AnimatePresence>
        {pageMessage && (
            <motion.div
                initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                className={`mb-4 flex items-center gap-3 p-3 rounded-lg text-sm ${
                    pageMessage.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                }`}
            >
                {pageMessage.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                <span>{pageMessage.text}</span>
            </motion.div>
        )}
      </AnimatePresence>

      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="إجمالي الإيرادات" value="N/A" change="بيانات غير متوفرة" icon={DollarSign} color={{ border: 'border-gray-500/20', bg: 'bg-gray-500/10', icon: 'text-gray-400' }} />
        <StatCard title="إجمالي الأعمال" value={loading ? '...' : businesses.length.toString()} change="" icon={Briefcase} color={{ border: 'border-blue-500/20', bg: 'bg-blue-500/10', icon: 'text-blue-400' }} />
        <StatCard title="طلبات جديدة" value={loading ? '...' : requests.length.toString()} change="قيد المراجعة" icon={UserPlus} color={{ border: 'border-yellow-500/20', bg: 'bg-yellow-500/10', icon: 'text-yellow-400' }} />
        <StatCard title="مراجعات معلقة" value="N/A" change="بيانات غير متوفرة" icon={Clock} color={{ border: 'border-gray-500/20', bg: 'bg-gray-500/10', icon: 'text-gray-400' }} />
      </motion.div>

      <motion.div variants={itemVariants} className="bg-[#1B2A41] p-6 rounded-2xl border border-gray-800">
         <h3 className="text-lg font-semibold text-white mb-4">أحدث طلبات الانضمام</h3>
         <div className="space-y-4">
           {loading ? <p className="text-gray-400">Loading...</p> : 
            requests.length > 0 ? (
              requests.slice(0, 5).map(req => (
                <div key={req.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-[#0A1024]">
                  <div>
                    <p className="font-semibold text-white">{req.business_name}</p>
                    <p className="text-xs text-gray-400">بواسطة: {req.name} ({req.business_type})</p>
                  </div>
                  <button onClick={() => handleApprove(req.id)} className="text-xs font-semibold bg-emerald-500/10 text-emerald-400 py-1 px-3 rounded-full hover:bg-emerald-500/20">
                    موافقة
                  </button>
                </div>
              ))
           ) : (
              <p className="text-gray-500 text-center py-4">لا توجد طلبات جديدة.</p>
           )}
         </div>
      </motion.div>
    </motion.div>
  );
}