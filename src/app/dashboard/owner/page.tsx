'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Loader, Lock, Edit } from 'lucide-react';
import { User } from '@/types'; // This import now works correctly

type DynamicDashboardProps = {
    user: User | null;
};

// --- Dashboard Views for Different Subscriptions ---

const StaticDashboard = () => (
    <div className="bg-[#1B2A41] p-8 rounded-2xl text-center border border-yellow-500/20">
        <Lock size={48} className="mx-auto text-yellow-400 mb-4" />
        <h2 className="text-2xl font-bold text-white">الخطة الأساسية</h2>
        <p className="text-gray-400 mt-2 max-w-md mx-auto">
            صفحتك الحالية هي صفحة تعريفية ثابتة. لتحديث أي معلومات، يرجى التواصل مع فريق الدعم الفني.
        </p>
        <button className="mt-6 bg-gold text-navy font-bold py-2 px-6 rounded-lg">تواصل مع الدعم</button>
    </div>
);

const DynamicDashboard: React.FC<DynamicDashboardProps> = ({ user }) => (
     <div className="bg-[#1B2A41] p-8 rounded-2xl text-center border border-emerald-500/20">
        <Edit size={48} className="mx-auto text-emerald-400 mb-4" />
        <h2 className="text-2xl font-bold text-white">أهلاً بك، {user?.name}</h2>
        <p className="text-gray-400 mt-2 max-w-md mx-auto">
            أنت مشترك في الخطة {user?.subscription === 'مميز' ? 'المميزة' : 'الذهبية'}. يمكنك إدارة معلومات عملك ومنتجاتك/خدماتك مباشرة من لوحة التحكم.
        </p>
         {user?.subscription === 'ذهبي' && <p className="text-sm mt-2 text-gold">✨ ميزة استقبال الطلبات عبر واتساب مفعلة!</p>}
        <Link href="/dashboard/owner/products">
            <button className="mt-6 bg-gold text-navy font-bold py-2 px-6 rounded-lg">إدارة المنتجات/الخدمات</button>
        </Link>
    </div>
);


export default function OwnerDashboardPage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader size={48} className="text-gold animate-spin" />
      </div>
    );
  }

  const renderDashboard = () => {
    switch (user.subscription) {
      case 'أساسي':
        return <StaticDashboard />;
      case 'مميز':
      case 'ذهبي':
        return <DynamicDashboard user={user} />;
      default:
        return <p>خطة اشتراك غير معروفة.</p>;
    }
  };

  return (
    <div className="flex items-center justify-center h-full">
        {renderDashboard()}
    </div>
  );
}