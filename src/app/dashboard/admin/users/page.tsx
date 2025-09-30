'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Shield, Search, MoreVertical } from 'lucide-react';

// تحديد الأنواع للبيانات لضمان سلامة الكود
type UserStatus = 'فعال' | 'غير مفعل';
type MockUser = {
  id: number;
  name: string;
  business: string;
  email: string;
  status: UserStatus;
};

const mockUsers: MockUser[] = [
  { id: 1, name: 'أحمد خليل', business: 'مطعم القدس', email: 'ahmad@email.com', status: 'فعال' },
  { id: 2, name: 'فاطمة علي', business: 'صالون الملكة', email: 'fatima@email.com', status: 'غير مفعل' },
  { id: 3, name: 'أحمد ناصر', business: 'ورشة أبو أحمد', email: 'ahmad.n@email.com', status: 'فعال' },
  { id: 4, name: 'سارة إبراهيم', business: 'عيادة الأمل', email: 'sara@email.com', status: 'غير مفعل' },
];

// دالة مساعدة لتحديد لون حالة المستخدم
const getStatusChip = (status: UserStatus): string => {
    switch (status) {
        case 'فعال': return 'bg-emerald-500/10 text-emerald-400';
        case 'غير مفعل': return 'bg-yellow-500/10 text-yellow-400';
        default: return 'bg-gray-500/10 text-gray-400';
    }
}

export default function ManageUsersPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[#1B2A41] p-4 md:p-6 rounded-2xl border border-gray-800 shadow-lg"
    >
      {/* رأس الصفحة والإجراءات - متجاوب مع الهواتف */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
          <input 
            type="text" 
            placeholder="ابحث عن مالك أو عمل..."
            className="w-full bg-[#0A1024] border border-gray-700 rounded-full py-2 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-gold"
          />
        </div>
        <button className="w-full md:w-auto flex items-center justify-center gap-2 bg-gold text-navy font-bold py-2 px-4 rounded-lg hover:bg-yellow-300 transition-colors">
          <UserPlus size={20} />
          <span>إضافة مستخدم جديد</span>
        </button>
      </div>

      {/* عرض الجدول على الشاشات الكبيرة */}
      <div className="overflow-x-auto hidden md:block">
        <table className="w-full text-right">
          <thead className="border-b border-gray-700">
            <tr>
              <th className="p-3 text-sm font-semibold text-gray-400">اسم المالك</th>
              <th className="p-3 text-sm font-semibold text-gray-400">العمل التجاري</th>
              <th className="p-3 text-sm font-semibold text-gray-400">البريد الإلكتروني</th>
              <th className="p-3 text-sm font-semibold text-gray-400">حالة الحساب</th>
              <th className="p-3 text-sm font-semibold text-gray-400">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {mockUsers.map(user => (
              <tr key={user.id} className="border-b border-gray-800 hover:bg-[#0A1024]/50">
                <td className="p-4 font-semibold text-white">{user.name}</td>
                <td className="p-4 text-gray-300">{user.business}</td>
                <td className="p-4 text-gray-300">{user.email}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusChip(user.status)}`}>
                    {user.status}
                  </span>
                </td>
                <td className="p-4 flex items-center gap-3">
                  <button className="text-emerald-400 hover:text-emerald-300" title="تفعيل/إنشاء حساب"><UserPlus size={18} /></button>
                  <button className="text-blue-400 hover:text-blue-300" title="تغيير الصلاحيات"><Shield size={18} /></button>
                  <button className="text-yellow-400 hover:text-yellow-300" title="إرسال رسالة"><Mail size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* عرض البطاقات على شاشات الهواتف */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {mockUsers.map(user => (
          <div key={user.id} className="bg-[#0A1024] p-4 rounded-lg border border-gray-800 flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold text-white text-lg">{user.name}</p>
                <p className="text-sm text-gold">{user.business}</p>
              </div>
              <button className="text-gray-400"><MoreVertical size={20} /></button>
            </div>
            <div className="text-sm text-gray-300 break-all">{user.email}</div>
            <div className="flex justify-between items-center mt-2">
              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusChip(user.status)}`}>
                {user.status}
              </span>
              <div className="flex items-center gap-3">
                  <button className="text-emerald-400 hover:text-emerald-300" title="تفعيل/إنشاء حساب"><UserPlus size={18} /></button>
                  <button className="text-blue-400 hover:text-blue-300" title="تغيير الصلاحيات"><Shield size={18} /></button>
                  <button className="text-yellow-400 hover:text-yellow-300" title="إرسال رسالة"><Mail size={18} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}