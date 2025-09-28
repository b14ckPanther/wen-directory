'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Phone, Mail, User, Send } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    businessName: '',
    businessType: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // TODO: send formData to API / DB
    console.log('Business registration request:', formData);

    alert('تم إرسال طلبك! سيتم التواصل معك بعد المراجعة.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      businessName: '',
      businessType: '',
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0B132B] to-[#1B2A41] p-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg bg-[#0B132B]/80 backdrop-blur-xl border border-gold/30 
                   rounded-2xl shadow-[0_8px_30px_rgba(255,215,0,0.2)] p-8"
      >
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <Link
            href="/"
            className="bg-gradient-to-br from-gold to-yellow-500 p-3 rounded-full shadow-lg mb-3 hover:scale-105 transition"
          >
            <Building2 className="text-navy" size={32} />
          </Link>
          <h1 className="text-gold font-bold text-2xl">انضم كصاحب بزنس</h1>
          <p className="text-gray/70 text-sm mt-2 text-center">
            عبّي النموذج وخلّي فريق Wen يتواصل معك عشان نفعل حسابك
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gold/60" size={20} />
            <input
              type="text"
              name="name"
              placeholder="اسمك الكامل"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gold/30 bg-[#1B2A41]/60 
                         text-gray placeholder-gray/50 focus:outline-none focus:ring-1 focus:ring-gold/50"
            />
          </div>

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gold/60" size={20} />
            <input
              type="email"
              name="email"
              placeholder="البريد الإلكتروني"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gold/30 bg-[#1B2A41]/60 
                         text-gray placeholder-gray/50 focus:outline-none focus:ring-1 focus:ring-gold/50"
            />
          </div>

          {/* Phone */}
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gold/60" size={20} />
            <input
              type="tel"
              name="phone"
              placeholder="رقم الهاتف"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gold/30 bg-[#1B2A41]/60 
                         text-gray placeholder-gray/50 focus:outline-none focus:ring-1 focus:ring-gold/50"
            />
          </div>

          {/* Business Name */}
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gold/60" size={20} />
            <input
              type="text"
              name="businessName"
              placeholder="اسم البزنس"
              value={formData.businessName}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gold/30 bg-[#1B2A41]/60 
                         text-gray placeholder-gray/50 focus:outline-none focus:ring-1 focus:ring-gold/50"
            />
          </div>

          {/* Business Type */}
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gold/60" size={20} />
            <input
              type="text"
              name="businessType"
              placeholder="نوع البزنس (مطعم، متجر، صالون..)"
              value={formData.businessType}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gold/30 bg-[#1B2A41]/60 
                         text-gray placeholder-gray/50 focus:outline-none focus:ring-1 focus:ring-gold/50"
            />
          </div>

          {/* Submit */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-gradient-to-br from-gold to-yellow-500 text-navy 
                       py-2 px-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2"
          >
            <Send size={20} />
            إرسال الطلب
          </motion.button>
        </form>

        {/* Extra Actions */}
        <div className="mt-6 flex flex-col items-center gap-3 text-sm">
          <p className="text-gray/60">
            عندك حساب؟{' '}
            <Link href="/login" className="text-gold hover:underline">
              تسجيل الدخول
            </Link>
          </p>

          <Link
            href="/"
            className="text-gray/50 hover:text-gold transition-colors flex items-center gap-1"
          >
            ← العودة للرئيسية
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
