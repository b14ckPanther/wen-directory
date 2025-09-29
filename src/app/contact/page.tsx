'use client';

import { useState } from 'react';
// FIX 1: Import the 'Variants' type from framer-motion
import { motion, Variants } from 'framer-motion';
import { Mail, Phone, MapPin, User, Send, BookText } from 'lucide-react';
import Link from 'next/link';

// FIX 2: Explicitly type the constant with 'Variants'
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

// FIX 3: Explicitly type this constant as well
const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact form submission:', formData);
    alert('شكرًا لتواصلك! سنرد عليك في أقرب وقت ممكن.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0B132B] to-[#1B2A41] p-4 sm:p-6">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-4xl bg-[#0B132B]/80 backdrop-blur-xl border border-gold/30 
                   rounded-2xl shadow-[0_8px_30px_rgba(255,215,0,0.2)] p-6 sm:p-8"
      >
        <motion.div variants={itemVariants} className="text-center mb-8">
          <h1 className="text-gold font-bold text-3xl sm:text-4xl">تواصل معنا</h1>
          <p className="text-gray/70 text-sm sm:text-base mt-2">
            عندك سؤال أو اقتراح؟ فريقنا جاهز يسمع منك.
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-10">
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <User className="absolute right-3 top-1/2 -translate-y-1/2 text-gold/60" size={20} />
              <input
                type="text" name="name" placeholder="اسمك الكامل"
                value={formData.name} onChange={handleChange} required
                className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-gold/30 bg-[#1B2A41]/60 
                           text-gray placeholder-gray/50 focus:outline-none focus:ring-1 focus:ring-gold/50"
              />
            </div>
            <div className="relative">
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-gold/60" size={20} />
              <input
                type="email" name="email" placeholder="البريد الإلكتروني"
                value={formData.email} onChange={handleChange} required
                className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-gold/30 bg-[#1B2A41]/60 
                           text-gray placeholder-gray/50 focus:outline-none focus:ring-1 focus:ring-gold/50"
              />
            </div>
            <div className="relative">
              <BookText className="absolute right-3 top-1/2 -translate-y-1/2 text-gold/60" size={20} />
              <input
                type="text" name="subject" placeholder="الموضوع"
                value={formData.subject} onChange={handleChange} required
                className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-gold/30 bg-[#1B2A41]/60 
                           text-gray placeholder-gray/50 focus:outline-none focus:ring-1 focus:ring-gold/50"
              />
            </div>
            <div className="relative">
              <textarea
                name="message" placeholder="رسالتك..." value={formData.message}
                onChange={handleChange} required rows={5}
                className="w-full px-4 py-2.5 rounded-xl border border-gold/30 bg-[#1B2A41]/60 
                           text-gray placeholder-gray/50 focus:outline-none focus:ring-1 focus:ring-gold/50"
              ></textarea>
            </div>
            <motion.button
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0px 0px 15px rgba(255, 215, 0, 0.5)"
              }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-gradient-to-br from-gold to-yellow-500 text-navy 
                         py-2.5 px-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2"
            >
              <Send size={20} />
              إرسال الرسالة
            </motion.button>
          </form>

          <div className="space-y-6 flex flex-col justify-center">
            <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-gold/5 transition-colors">
              <Mail size={24} className="text-gold mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-lg text-gray">البريد الإلكتروني</h3>
                <p className="text-gray/70">تواصل معنا للاستفسارات العامة.</p>
                <a href="mailto:info@wen.app" className="text-gold hover:underline">info@wen.app</a>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-gold/5 transition-colors">
              <Phone size={24} className="text-gold mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-lg text-gray">الهاتف</h3>
                <p className="text-gray/70">لدعم أصحاب الأعمال والشركاء.</p>
                <a href="tel:+9720000000" className="text-gold hover:underline" dir="ltr">+972 50 714 7134</a>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-gold/5 transition-colors">
              <MapPin size={24} className="text-gold mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-lg text-gray">عنواننا</h3>
                <p className="text-gray/70">زوروا مكتبنا الرئيسي.</p>
                <p className="text-gold">منفكر بعدين</p>
              </div>
            </div>
          </div>
        </motion.div>
        
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