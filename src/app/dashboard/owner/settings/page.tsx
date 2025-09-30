'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, CreditCard, Save } from 'lucide-react';

// --- Define Types for Reusable Components ---
type SettingInputProps = {
    label: string;
    name: string;
    type?: string;
    value: string; // value is required
    placeholder: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

// --- Reusable Components with Types ---
const SettingInput: React.FC<SettingInputProps> = ({ label, name, type = 'text', value, placeholder, onChange }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-400 mb-2">{label}</label>
        <input 
            type={type} 
            name={name}
            id={name}
            value={value} // Use value for controlled components
            placeholder={placeholder}
            onChange={onChange}
            className="w-full bg-[#0A1024] border border-gray-700 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-gold"
        />
    </div>
);

export default function OwnerSettingsPage() {
    // State to manage the form inputs
    const [settings, setSettings] = useState({
        fullName: 'صاحب العمل',
        email: 'owner@wen.com',
        currentPassword: '',
        newPassword: '',
    });

    // Handler for input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSettings(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // Handler for saving the form
    const handleSave = () => {
        console.log("Saving settings:", settings);
        alert("تم حفظ التغييرات بنجاح!");
    };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto space-y-8"
    >
        <h1 className="text-3xl font-bold text-white">إعدادات الحساب</h1>

        {/* Profile Information */}
        <div className="bg-[#1B2A41] p-6 rounded-2xl border border-gray-800">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><User size={22} className="text-gold"/> معلومات الملف الشخصي</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SettingInput label="الاسم الكامل" name="fullName" value={settings.fullName} onChange={handleChange} placeholder="أدخل اسمك الكامل..." />
                <SettingInput label="البريد الإلكتروني" name="email" value={settings.email} onChange={handleChange} placeholder="example@email.com" />
            </div>
        </div>

        {/* Change Password */}
         <div className="bg-[#1B2A41] p-6 rounded-2xl border border-gray-800">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Lock size={22} className="text-gold"/> تغيير كلمة المرور</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SettingInput label="كلمة المرور الحالية" name="currentPassword" type="password" placeholder="••••••••" value={settings.currentPassword} onChange={handleChange} />
                <SettingInput label="كلمة المرور الجديدة" name="newPassword" type="password" placeholder="••••••••" value={settings.newPassword} onChange={handleChange} />
            </div>
        </div>

        {/* Subscription Plan */}
        <div className="bg-[#1B2A41] p-6 rounded-2xl border border-gray-800">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><CreditCard size={22} className="text-gold"/> خطة الاشتراك</h2>
            <div className="bg-[#0A1024] p-4 rounded-lg flex flex-col md:flex-row justify-between items-center">
                <div>
                    <p className="text-lg font-semibold text-white">خطتك الحالية: <span className="text-gold">مميز</span></p>
                    <p className="text-sm text-gray-400">تنتهي في: 30 أكتوبر 2025</p>
                </div>
                <button className="mt-4 md:mt-0 bg-gold/10 text-gold font-bold py-2 px-4 rounded-lg hover:bg-gold/20 transition-colors">
                    ترقية الخطة
                </button>
            </div>
        </div>
        
        {/* Save Button */}
        <div className="flex justify-end">
            <button onClick={handleSave} className="flex items-center gap-2 bg-gold text-navy font-bold py-3 px-6 rounded-lg hover:bg-yellow-300 transition-colors">
                <Save size={20} />
                <span>حفظ التغييرات</span>
            </button>
        </div>
    </motion.div>
  );
}