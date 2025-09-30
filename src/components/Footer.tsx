import React from 'react';
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#080F22] border-t border-gold/20 text-gray/70">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* About Section with Clickable Logo */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-block">
              <h3 className="text-2xl font-bold text-gold mb-2">
                <span className="font-dancing text-3xl">Wen</span>
              </h3>
            </Link>
            <p className="text-sm">
              دليلك الشامل لأفضل الخدمات والمحترفين في مجتمعك. اكتشف، تواصل، ونمِّ أعمالك.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-gray mb-4">روابط سريعة</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-gold transition-colors">مين احنا</Link></li>
              <li><Link href="/contact" className="hover:text-gold transition-colors">تواصل معنا</Link></li>
              <li><Link href="/faq" className="hover:text-gold transition-colors">الأسئلة الشائعة</Link></li>
              <li><Link href="/privacy" className="hover:text-gold transition-colors">سياسة الخصوصية</Link></li>
              <li><Link href="/feedback" className="hover:text-gold transition-colors">شاركنا رأيك</Link></li>

            </ul>
          </div>

          {/* Business Links */}
          <div>
            <h4 className="font-bold text-gray mb-4">للأعمال</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/register" className="hover:text-gold transition-colors">انضم لنا</Link></li>
              <li><Link href="/login" className="hover:text-gold transition-colors">لوحة تحكم الأعمال</Link></li>
              <li><Link href="/contact" className="hover:text-gold transition-colors">إعلان معنا</Link></li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="font-bold text-gray mb-4">تابعنا</h4>
            <div className="flex space-x-4">
              {/* Note: Replace '#' with your actual social media URLs */}
              <a href="#" className="text-gray hover:text-gold transition-colors"><Facebook size={20} /></a>
              <a href="#" className="text-gray hover:text-gold transition-colors"><Twitter size={20} /></a>
              <a href="#" className="text-gray hover:text-gold transition-colors"><Instagram size={20} /></a>
              <a href="#" className="text-gray hover:text-gold transition-colors"><Linkedin size={20} /></a>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-8 pt-8 border-t border-gold/10 text-center text-sm">
          <p>&copy; {currentYear} Wen. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
}