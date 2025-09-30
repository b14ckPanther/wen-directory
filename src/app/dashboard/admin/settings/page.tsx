'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Link as LinkIcon, DollarSign, ToolCase, Save } from 'lucide-react';

// --- Define Types for Reusable Components ---
type SettingInputProps = {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
};

type ToggleSettingProps = {
    label: string;
    description: string;
    enabled: boolean;
    setEnabled: (enabled: boolean) => void;
};


// --- Reusable Components with Types ---
const SettingInput: React.FC<SettingInputProps> = ({ label, name, value, onChange, placeholder }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-400 mb-2">{label}</label>
        <input 
            type="text" 
            name={name}
            id={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full bg-[#0A1024] border border-gray-700 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-gold"
        />
    </div>
);

const ToggleSetting: React.FC<ToggleSettingProps> = ({ label, description, enabled, setEnabled }) => (
    <div className="flex items-center justify-between">
        <div>
            <h4 className="font-semibold text-white">{label}</h4>
            <p className="text-sm text-gray-400">{description}</p>
        </div>
        <button 
            onClick={() => setEnabled(!enabled)}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${enabled ? 'bg-gold' : 'bg-gray-600'}`}
        >
            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
    </div>
);


// --- Main Page Component ---
export default function ManageSettingsPage() {
    const [settings, setSettings] = useState({
        appName: 'Wen - وين',
        contactEmail: 'info@wen.app',
        facebookUrl: 'https://facebook.com',
        instagramUrl: 'https://instagram.com',
        basicPlanPrice: '50',
        premiumPlanPrice: '150',
    });
    const [maintenanceMode, setMaintenanceMode] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        console.log("Saving settings:", { ...settings, maintenanceMode });
        alert("تم حفظ الإعدادات بنجاح!");
    };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto space-y-8"
    >
        {/* General Settings Section */}
        <div className="bg-[#1B2A41] p-6 rounded-2xl border border-gray-800">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Settings size={22} className="text-gold"/> الإعدادات العامة</h2>
            <div className="space-y-4">
                <SettingInput label="اسم التطبيق" name="appName" value={settings.appName} onChange={handleChange} placeholder="اكتب اسم التطبيق هنا..."/>
                <SettingInput label="البريد الإلكتروني للتواصل" name="contactEmail" value={settings.contactEmail} onChange={handleChange} placeholder="example@email.com"/>
            </div>
        </div>

        {/* Social Media Links Section */}
        <div className="bg-[#1B2A41] p-6 rounded-2xl border border-gray-800">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><LinkIcon size={22} className="text-gold"/> روابط التواصل الاجتماعي</h2>
            <div className="space-y-4">
                <SettingInput label="رابط فيسبوك" name="facebookUrl" value={settings.facebookUrl} onChange={handleChange} placeholder="https://facebook.com/..."/>
                <SettingInput label="رابط انستجرام" name="instagramUrl" value={settings.instagramUrl} onChange={handleChange} placeholder="https://instagram.com/..."/>
            </div>
        </div>

        {/* Subscription Plans Section */}
        <div className="bg-[#1B2A41] p-6 rounded-2xl border border-gray-800">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><DollarSign size={22} className="text-gold"/> خطط الاشتراك</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SettingInput label="سعر الخطة الأساسية (₪ شهرياً)" name="basicPlanPrice" value={settings.basicPlanPrice} onChange={handleChange} placeholder="50"/>
                <SettingInput label="سعر الخطة المميزة (₪ شهرياً)" name="premiumPlanPrice" value={settings.premiumPlanPrice} onChange={handleChange} placeholder="150"/>
            </div>
        </div>
        
        {/* Maintenance Mode Section */}
        <div className="bg-[#1B2A41] p-6 rounded-2xl border border-gray-800">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><ToolCase size={22} className="text-gold"/> وضع الصيانة</h2>
            <ToggleSetting 
                label="تفعيل وضع الصيانة"
                description="عند التفعيل، سيتم عرض صفحة صيانة لجميع الزوار."
                enabled={maintenanceMode}
                setEnabled={setMaintenanceMode}
            />
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
            <button 
                onClick={handleSave}
                className="flex items-center gap-2 bg-gold text-navy font-bold py-3 px-6 rounded-lg hover:bg-yellow-300 transition-colors"
            >
                <Save size={20} />
                <span>حفظ التغييرات</span>
            </button>
        </div>
    </motion.div>
  );
}