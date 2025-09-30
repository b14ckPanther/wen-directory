'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Briefcase, UserPlus, Clock, LucideIcon } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// FIX: Corrected the import path for mockData
import { mockData } from '@/app/dashboard/admin/components/mock-data';

// --- Define Types for StatCard Props ---
type StatCardProps = {
    icon: LucideIcon;
    title: string;
    value: string;
    change: string;
    color: {
        border: string;
        bg: string;
        icon: string;
    };
};

// --- Reusable Stat Card Component ---
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
        <p className={`text-xs mt-2 ${change.includes('+') ? 'text-emerald-400' : 'text-red-400'}`}>{change}</p>
    </motion.div>
);


// --- Main Dashboard Component ---
export default function AdminDashboardPage() {

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* --- Stat Cards Section --- */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="إجمالي الإيرادات" value="₪12,450" change="+12.5% هذا الشهر" icon={DollarSign} color={{ border: 'border-emerald-500/20', bg: 'bg-emerald-500/10', icon: 'text-emerald-400' }} />
        <StatCard title="إجمالي الأعمال" value="1,280" change="+32 نشاط تجاري جديد" icon={Briefcase} color={{ border: 'border-blue-500/20', bg: 'bg-blue-500/10', icon: 'text-blue-400' }} />
        <StatCard title="طلبات جديدة" value="42" change="5 قيد المراجعة" icon={UserPlus} color={{ border: 'border-yellow-500/20', bg: 'bg-yellow-500/10', icon: 'text-yellow-400' }} />
        <StatCard title="مراجعات معلقة" value="18" change="تحتاج إلى موافقة" icon={Clock} color={{ border: 'border-red-500/20', bg: 'bg-red-500/10', icon: 'text-red-400' }} />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* --- Revenue Chart --- */}
        <motion.div variants={itemVariants} className="lg:col-span-2 bg-[#1B2A41] p-6 rounded-2xl border border-gray-800">
          <h3 className="text-lg font-semibold text-white mb-4">نمو الإيرادات الشهري</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockData.revenue}>
              <XAxis dataKey="name" stroke="#888888" fontSize={12} />
              <YAxis stroke="#888888" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: '#1B2A41', border: '1px solid #444' }} />
              <Legend />
              <Bar dataKey="revenue" fill="#FFD700" name="الإيرادات (بالشيكل)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* --- Recent Join Requests --- */}
        <motion.div variants={itemVariants} className="bg-[#1B2A41] p-6 rounded-2xl border border-gray-800">
           <h3 className="text-lg font-semibold text-white mb-4">أحدث الطلبات للانضمام</h3>
           <div className="space-y-4">
             {mockData.requests.map(req => (
               <div key={req.id} className="flex items-center justify-between">
                 <div>
                   <p className="font-semibold text-white">{req.name}</p>
                   <p className="text-xs text-gray-400">{req.type}</p>
                 </div>
                 <button className="text-xs font-semibold text-yellow-400 hover:text-yellow-300">مراجعة</button>
               </div>
             ))}
           </div>
        </motion.div>
      </div>
    </motion.div>
  );
}