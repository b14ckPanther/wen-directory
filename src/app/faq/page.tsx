// app/faq/page.tsx
'use client';

import { motion, Variants } from 'framer-motion';
import FaqAccordion from '@/components/FaqAccordion'; // Make sure the path is correct
import Link from 'next/link';
import { MessageSquare } from 'lucide-react';

// Animation variants
const fadeInUp: Variants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

// Data for the FAQs
const faqData = {
  general: [
    {
      question: 'ما هي منصة "Wen"؟',
      answer: '"Wen" هي دليلك الشامل للعثور على أفضل الخدمات والمحترفين في مجتمعك المحلي. نحن نربط المستخدمين بمقدمي الخدمات الموثوقين لتسهيل حياتهم اليومية وتعزيز الاقتصاد المحلي.',
    },
    {
      question: 'هل استخدام المنصة مجاني؟',
      answer: 'نعم، البحث عن الخدمات والتواصل مع أصحاب الأعمال عبر منصتنا مجاني تمامًا للمستخدمين. أصحاب الأعمال قد يكون لديهم خطط اشتراك مختلفة لعرض خدماتهم.',
    },
    {
      question: 'كيف يمكنني التأكد من جودة مقدمي الخدمة؟',
      answer: 'نحن نسعى لعرض الأعمال التي تتمتع بسمعة جيدة. كما نشجع المستخدمين على قراءة التقييمات والمراجعات من عملاء آخرين لاتخاذ قرار مستنير.',
    },
  ],
  business: [
    {
      question: 'أنا صاحب عمل، كيف يمكنني الانضمام إلى "Wen"؟',
      answer: 'رائع! يمكنك البدء بالضغط على رابط "انضم لنا" في أعلى الصفحة أو في الأسفل. ستقوم بملء نموذج بسيط، وسيقوم فريقنا بمراجعة طلبك والتواصل معك لتفعيل حسابك.',
    },
    {
      question: 'ما هي فوائد عرض عملي على منصتكم؟',
      answer: 'الانضمام إلى "Wen" يمنحك وصولاً مباشرًا لجمهور واسع يبحث عن خدماتك، يزيد من ظهورك على الإنترنت، يبني الثقة من خلال نظام التقييمات، ويوفر لك أدوات لإدارة صفحتك وعروضك.',
    },
    {
      question: 'هل يمكنني تعديل معلومات عملي بعد التسجيل؟',
      answer: 'بالتأكيد. بعد تفعيل حسابك، ستحصل على وصول إلى لوحة تحكم خاصة بالأعمال حيث يمكنك تحديث معلوماتك، إضافة صور، إدارة الخدمات، والرد على تقييمات العملاء.',
    },
  ],
};

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B132B] to-[#1B2A41] text-gray">
      <div className="container mx-auto px-4 py-16 md:py-24">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gold mb-4">
            الأسئلة الشائعة
          </h1>
          <p className="max-w-2xl mx-auto text-gray/80 text-lg">
            أجوبة لأكثر الأسئلة التي تصلنا. إذا لم تجد ما تبحث عنه، لا تتردد في التواصل معنا.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          {/* General Questions Section */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInUp}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-gold/90 mb-6 border-r-4 border-gold pr-4">
              أسئلة عامة
            </h2>
            {faqData.general.map((faq, index) => (
              <FaqAccordion key={index} question={faq.question} answer={faq.answer} />
            ))}
          </motion.div>

          {/* Business Questions Section */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInUp}
          >
            <h2 className="text-2xl font-bold text-gold/90 mb-6 border-r-4 border-gold pr-4">
              لأصحاب الأعمال
            </h2>
            {faqData.business.map((faq, index) => (
              <FaqAccordion key={index} question={faq.question} answer={faq.answer} />
            ))}
          </motion.div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={fadeInUp}
          className="text-center mt-20 bg-[#1B2A41]/70 p-8 rounded-2xl max-w-3xl mx-auto border border-gold/20"
        >
          <MessageSquare className="w-12 h-12 text-gold mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray mb-3">
            لم تجد إجابتك؟
          </h2>
          <p className="text-gray/70 mb-6">
            فريقنا مستعد دائمًا للمساعدة. تواصل معنا مباشرة وسنكون سعداء بالرد على استفساراتك.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-gold text-navy font-bold py-2.5 px-8 rounded-full hover:bg-yellow-300 transition-all shadow-lg shadow-gold/20 transform hover:scale-105"
          >
            تواصل معنا
          </Link>
        </motion.div>
      </div>
    </div>
  );
}