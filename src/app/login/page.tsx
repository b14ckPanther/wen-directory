'use client';
import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { User, Lock, LogIn, ArrowLeft, AlertCircle } from 'lucide-react'; // Import AlertCircle
import TiltCard from '@/components/TiltCard';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // State for the error message

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Clear previous errors on a new attempt

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    setLoading(false);

    if (authError) {
      // Set the error message in state instead of using alert()
      setError('البريد الإلكتروني أو كلمة المرور غير صحيحة.');
    }
    // No 'else' is needed, the AuthContext handles success.
  };

  // ... containerVariants and itemVariants are unchanged ...
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.3 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { ease: 'easeOut' } },
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
            className="relative w-full max-w-md bg-[#0B132B]/50 backdrop-blur-xl rounded-2xl p-8 flex flex-col items-center"
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
                  <User className="text-navy" size={32} />
                </div>
                <h1 className="text-gold font-bold text-2xl">تسجيل الدخول</h1>
                <p className="text-gray/70 text-sm mt-2 text-center">أدخل بياناتك للوصول إلى حسابك</p>
              </motion.div>

              <motion.form variants={itemVariants} onSubmit={handleLogin} className="space-y-5">
                {/* NEW: Error Message Display */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg p-3 flex items-center gap-2"
                    >
                      <AlertCircle size={18} />
                      <span>{error}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gold/60" size={20} />
                  <input type="email" placeholder="البريد الإلكتروني" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full pl-10 pr-4 py-2 rounded-xl border border-gold/30 bg-[#1B2A41]/60 text-gray placeholder-gray/50 focus:outline-none focus:ring-2 focus:ring-gold/50 transition-shadow"/>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gold/60" size={20} />
                  <input type="password" placeholder="كلمة المرور" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full pl-10 pr-4 py-2 rounded-xl border border-gold/30 bg-[#1B2A41]/60 text-gray placeholder-gray/50 focus:outline-none focus:ring-2 focus:ring-gold/50 transition-shadow"/>
                </div>
                <motion.button
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-br from-gold to-yellow-500 text-navy py-2.5 px-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 hover:shadow-gold/30 transition-shadow disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <LogIn size={20} />
                  {loading ? 'جاري الدخول...' : 'دخول'}
                </motion.button>
              </motion.form>

              <motion.div variants={itemVariants} className="mt-6 text-center text-sm">
                <p className="text-gray/60">ما عندك حساب؟ <Link href="/register" className="text-gold hover:underline font-semibold">انضم لنا</Link></p>
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

