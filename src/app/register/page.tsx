'use client';

import { useState } from 'react';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import { Building2, Phone, Mail, User, Send, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import TiltCard from '@/components/TiltCard';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    businessName: '',
    businessType: '',
  });
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setStatus({ type: 'success', message: 'تم إرسال طلبك! سيتم التواصل معك بعد المراجعة.' });
        setFormData({ name: '', email: '', phone: '', businessName: '', businessType: '' });
      } else {
        setStatus({ type: 'error', message: result.message || 'حدث خطأ أثناء إرسال طلبك.' });
      }
   } catch {
  setStatus({ type: 'error', message: 'حدث خطأ في الشبكة. يرجى المحاولة مرة أخرى.' });
}
 finally {
      setLoading(false);
    }
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

      <div style={{ perspective: '1000px' }}>
        <TiltCard>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="relative w-full max-w-lg bg-[#0B132B]/50 backdrop-blur-xl rounded-2xl p-8 flex flex-col items-center"
          >
            {/* Animated Border */}
            <div className="absolute inset-0 rounded-2xl border-2 animate-hologram-border pointer-events-none"></div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="relative z-10 w-full"
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
                <AnimatePresence>
                  {status && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`text-sm rounded-lg p-3 flex items-center gap-2 ${
                        status.type === 'success'
                          ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                          : 'bg-red-500/10 border border-red-500/30 text-red-400'
                      }`}
                    >
                      {status.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                      <span>{status.message}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              
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
                  disabled={loading}
                  className="w-full bg-gradient-to-br from-gold to-yellow-500 text-navy py-2.5 px-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 hover:shadow-gold/30 transition-shadow disabled:opacity-70"
                >
                  <Send size={20} />
                  {loading ? 'جاري الإرسال...' : 'إرسال الطلب'}
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

            <motion.div variants={itemVariants} className="mt-8 pt-6 border-t border-gold/20 w-full">
                <Link href="/" className="flex items-center justify-center gap-2 text-gray/70 hover:text-gold transition-colors w-full py-2 rounded-lg hover:bg-gold/10">
                    <ArrowLeft size={20} />
                    <span>العودة إلى الرئيسية</span>
                </Link>
            </motion.div>
          </motion.div>
        </TiltCard>
      </div>
    </div>
  );
}