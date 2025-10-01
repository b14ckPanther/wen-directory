// src/app/feedback/page.tsx
'use client';

import { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { User, Mail, Star, Send } from 'lucide-react';
import Link from 'next/link';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { ease: 'easeOut', duration: 0.5 } },
};

export default function FeedbackPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    feedbackType: 'suggestion',
    message: '',
    rating: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRating = (rate: number) => {
    setFormData({ ...formData, rating: rate });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Feedback submission:', formData);
    alert('شكرًا لملاحظاتك! نحن نقدر وقتك.');
    setFormData({ name: '', email: '', feedbackType: 'suggestion', message: '', rating: 0 });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0B132B] to-[#1B2A41] p-4 sm:p-6">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-2xl bg-[#0B132B]/80 backdrop-blur-xl border border-gold/30 rounded-2xl shadow-[0_8px_30px_rgba(255,215,0,0.2)] p-6 sm:p-8"
      >
        <motion.div variants={itemVariants} className="text-center mb-8">
          <h1 className="text-gold font-bold text-3xl sm:text-4xl">شاركنا رأيك</h1>
          <p className="text-gray/70 text-sm sm:text-base mt-2">
            نحن نسعى دائمًا للتحسين. ملاحظاتك تساعدنا على تقديم أفضل تجربة ممكنة.
          </p>
        </motion.div>

        <motion.form onSubmit={handleSubmit} className="space-y-5" variants={itemVariants}>
          <div className="grid md:grid-cols-2 gap-5">
            <div className="relative">
              <User className="absolute right-3 top-1/2 -translate-y-1/2 text-gold/60" size={20} />
              <input type="text" name="name" placeholder="الاسم (اختياري)" value={formData.name} onChange={handleChange} className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-gold/30 bg-[#1B2A41]/60 text-gray placeholder-gray/50 focus:outline-none focus:ring-1 focus:ring-gold/50" />
            </div>
            <div className="relative">
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-gold/60" size={20} />
              <input type="email" name="email" placeholder="البريد الإلكتروني (اختياري)" value={formData.email} onChange={handleChange} className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-gold/30 bg-[#1B2A41]/60 text-gray placeholder-gray/50 focus:outline-none focus:ring-1 focus:ring-gold/50" />
            </div>
          </div>

          <div className="relative">
            <select name="feedbackType" value={formData.feedbackType} onChange={handleChange} className="w-full appearance-none pr-10 pl-4 py-2.5 rounded-xl border border-gold/30 bg-[#1B2A41]/60 text-gray focus:outline-none focus:ring-1 focus:ring-gold/50">
              <option value="suggestion">اقتراح</option>
              <option value="bug">الإبلاغ عن مشكلة</option>
              <option value="general">ملاحظات عامة</option>
            </select>
          </div>

          <div className="relative">
            <textarea name="message" placeholder="رسالتك..." value={formData.message} onChange={handleChange} required rows={5} className="w-full px-4 py-2.5 rounded-xl border border-gold/30 bg-[#1B2A41]/60 text-gray placeholder-gray/50 focus:outline-none focus:ring-1 focus:ring-gold/50"></textarea>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray mb-3 text-center">ما مدى رضاك عن تجربتك؟</h3>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((rate) => (
                <button key={rate} type="button" onClick={() => handleRating(rate)} className={`p-2 rounded-full transition-colors ${formData.rating >= rate ? 'text-gold' : 'text-gray/50 hover:text-gold'}`}>
                  <Star size={28} fill={formData.rating >= rate ? 'currentColor' : 'none'} />
                </button>
              ))}
            </div>
          </div>

          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} type="submit" className="w-full bg-gradient-to-br from-gold to-yellow-500 text-navy py-2.5 px-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2">
            <Send size={20} />
            إرسال
          </motion.button>
        </motion.form>
        <motion.div variants={itemVariants} className="mt-8 text-center">
            <Link
                href="/"
                className="text-gray/50 hover:text-gold transition-colors text-sm"
            >
                ← العودة للرئيسية
            </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}