import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#080F22] border-t border-gold/20 text-gray/70">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* About Section */}
          <div className="md:col-span-1">
            <h3 className="text-2xl font-bold text-gold mb-2">
              <span className="font-dancing text-3xl">Wen</span>
            </h3>
            <p className="text-sm">
              دليلك الشامل لأفضل الخدمات والمحترفين في مجتمعك. اكتشف، تواصل، ونمِّ أعمالك.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-gray mb-4">روابط سريعة</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-gold transition-colors">مين احنا</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">تواصل معنا</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">الأسئلة الشائعة</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">سياسة الخصوصية</a></li>
            </ul>
          </div>

          {/* Business Links */}
          <div>
            <h4 className="font-bold text-gray mb-4">للأعمال</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-gold transition-colors">انضم لنا</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">لوحة تحكم الأعمال</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">إعلان معنا</a></li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="font-bold text-gray mb-4">تابعنا</h4>
            <div className="flex space-x-4">
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
