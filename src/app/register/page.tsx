'use client';

import { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { Building2, Phone, Mail, User, Send, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import TiltCard from '@/components/TiltCard'; // Import the TiltCard

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
    console.log('Business registration request:', formData);
    alert('تم إرسال طلبك! سيتم التواصل معك بعد المراجعة.');
    setFormData({ name: '', email: '', phone: '', businessName: '', businessType: '' });
  };
  
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { ease: 'easeOut', duration: 0.5 } },
  };


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-navy p-6 overflow-hidden" style={{ minHeight: '100dvh' }}>
      <div className="absolute inset-0 z-0 animate-star-field pointer-events-none"></div>

      <Link href="/" className="absolute top-6 left-6 z-20 flex items-center gap-2 text-gray/60 hover:text-gold transition-colors">
        <ArrowLeft size={20} />
        <span>العودة للرئيسية</span>
      </Link>

      <div style={{ perspective: '1000px' }}>
        <TiltCard>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="relative w-full max-w-lg bg-[#0B132B]/50 backdrop-blur-xl rounded-2xl p-8"
          >
            {/* Animated Border */}
            <div className="absolute inset-0 rounded-2xl border-2 animate-hologram-border pointer-events-none"></div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="relative z-10"
            >
              <motion.div variants={itemVariants} className="flex flex-col items-center mb-6">
                <div className="bg-gradient-to-br from-gold to-yellow-500 p-3 rounded-full shadow-lg mb-3">
                  <Building2 className="text-navy" size={32} />
                </div>
                <h1 className="text-gold font-bold text-2xl">انضم كصاحب بزنس</h1>
                <p className="text-gray/70 text-sm mt-2 text-center">
                  عبّي النموذج وخلّي فريقنا يتواصل معك
                </p>
              </motion.div>

              <motion.form onSubmit={handleSubmit} className="space-y-4" variants={itemVariants}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gold/60" size={20} />
                    <input type="text" name="name" placeholder="اسمك الكامل" value={formData.name} onChange={handleChange} required className="w-full pl-10 pr-4 py-2 rounded-xl border border-gold/30 bg-[#1B2A41]/60 text-gray placeholder-gray/50 focus:outline-none focus:ring-2 focus:ring-gold/50"/>
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gold/60" size={20} />
                    <input type="email" name="email" placeholder="البريد الإلكتروني" value={formData.email} onChange={handleChange} required className="w-full pl-10 pr-4 py-2 rounded-xl border border-gold/30 bg-[#1B2A41]/60 text-gray placeholder-gray/50 focus:outline-none focus:ring-2 focus:ring-gold/50"/>
                  </div>
                </div>
                 <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gold/60" size={20} />
                  <input type="tel" name="phone" placeholder="رقم الهاتف" value={formData.phone} onChange={handleChange} required className="w-full pl-10 pr-4 py-2 rounded-xl border border-gold/30 bg-[#1B2A41]/60 text-gray placeholder-gray/50 focus:outline-none focus:ring-2 focus:ring-gold/50"/>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gold/60" size={20} />
                    <input type="text" name="businessName" placeholder="اسم البزنس" value={formData.businessName} onChange={handleChange} required className="w-full pl-10 pr-4 py-2 rounded-xl border border-gold/30 bg-[#1B2A41]/60 text-gray placeholder-gray/50 focus:outline-none focus:ring-2 focus:ring-gold/50"/>
                  </div>
                   <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gold/60" size={20} />
                    <input type="text" name="businessType" placeholder="نوع البزنس" value={formData.businessType} onChange={handleChange} required className="w-full pl-10 pr-4 py-2 rounded-xl border border-gold/30 bg-[#1B2A41]/60 text-gray placeholder-gray/50 focus:outline-none focus:ring-2 focus:ring-gold/50"/>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-gradient-to-br from-gold to-yellow-500 text-navy py-2.5 px-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 hover:shadow-gold/30 transition-shadow"
                >
                  <Send size={20} />
                  إرسال الطلب
                </motion.button>
              </motion.form>

              <motion.div variants={itemVariants} className="mt-6 text-center text-sm">
                <p className="text-gray/60">
                  عندك حساب؟{' '}
                  <Link href="/login" className="text-gold hover:underline font-semibold">
                    تسجيل الدخول
                  </Link>
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        </TiltCard>
      </div>
    </div>
  );
}
