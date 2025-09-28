'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, Lock, LogIn } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // TODO: Replace with real auth & role fetch
    const role =
      username === 'admin' ? 'admin' : username === 'owner' ? 'owner' : 'user';

    if (role === 'admin') {
      router.push('/dashboard/admin');
    } else if (role === 'owner') {
      router.push('/dashboard/owner');
    } else {
      router.push('/dashboard/user');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0B132B] to-[#1B2A41] p-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-[#0B132B]/80 backdrop-blur-xl border border-gold/30 
                   rounded-2xl shadow-[0_8px_30px_rgba(255,215,0,0.2)] p-8"
      >
        {/* Header */}
  <div className="flex flex-col items-center mb-6">
  {/* Clickable Logo */}
  <Link
    href="/"
    className="bg-gradient-to-br from-gold to-yellow-500 p-3 rounded-full shadow-lg mb-3 hover:scale-105 transition"
  >
    <User className="text-navy" size={32} />
  </Link>

  <h1 className="text-gold font-bold text-2xl">تسجيل الدخول</h1>
  <p className="text-gray/70 text-sm mt-2 text-center">
    أدخل بياناتك للوصول إلى حسابك ولوحتك الخاصة
  </p>
</div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Username */}
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gold/60" size={20} />
            <input
              type="text"
              placeholder="اسم المستخدم"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gold/30 bg-[#1B2A41]/60 
                         text-gray placeholder-gray/50 focus:outline-none focus:ring-1 focus:ring-gold/50"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gold/60" size={20} />
            <input
              type="password"
              placeholder="كلمة المرور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            <LogIn size={20} />
            دخول
          </motion.button>
        </form>

        {/* Extra Actions */}
   <div className="mt-6 flex flex-col items-center gap-3 text-sm">
  <p className="text-gray/60">
    ما عندك حساب؟{' '}
    <Link href="/register" className="text-gold hover:underline">
      انضم لنا
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
