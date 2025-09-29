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

// Data for the FAQs - باللهجة العامية
const faqData = {
  general: [
    {
      question: 'شو هي منصة "Wen"؟',
      answer: '"Wen" هو دليلك الكامل عشان تلاقي أحسن الخدمات والمحترفين بمنطقتك. احنا بنوصلّك بالناس الشاطرة والموثوقة عشان نسهّل عليك حياتك وندعم شغل البلد.',
    },
    {
      question: 'استخدام "Wen" ببلاش؟',
      answer: 'أكيد، البحث والتواصل مع أصحاب المحلات والخدمات ببلاش بالكامل. أصحاب المصالح ممكن يكون عندهم باقات اشتراك عشان يعرضوا شغلهم.',
    },
    {
      question: 'كيف بضمن إنه اللي بقدم الخدمة شاطر؟',
      answer: 'احنا بنحاول نعرضلك بس المحلات اللي سمعتها ممتازة. وبننصحك دايمًا تقرأ التقييمات والتعليقات من الزباين اللي جربوا قبل ما تقرر.',
    },
  ],
  business: [
    {
      question: 'عندي بزنس، كيف ممكن أنضم لـ "Wen"؟',
      answer: 'ممتاز! بتقدر تبلّش بأنك تكبس على رابط "انضم إلنا". بتعبي فورم صغير، وفريقنا براجع طلبك وبرجع بحكي معك عشان يفعّلك حسابك.',
    },
    {
      question: 'شو بستفيد إذا بعرض شغلي عندكم؟',
      answer: 'لما تنضم إلنا، بتوصل لناس كثير بتدوّر على خدماتك، بتصير مشهور أونلاين، وبتبني ثقة عند الزباين عن طريق التقييمات. غير إنه بنعطيك أدوات سهلة عشان تدير صفحتك وعروضك.',
    },
    {
      question: 'بقدر أعدّل معلومات البزنس تبعي بعد ما أسجل؟',
      answer: 'طبعًا. بس يتفعّل حسابك، بصير عندك لوحة تحكم خاصة فيك بتقدر منها تعدّل معلوماتك، تضيف صور، تدير خدماتك، وحتى ترد على تعليقات الزباين.',
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
            أسئلة بتتكرر
          </h1>
          <p className="max-w-2xl mx-auto text-gray/80 text-lg">
            هاي أجوبة لأكثر الأسئلة اللي بتوصلنا. إذا ما لقيت جواب لسؤالك، ابعثلنا واحنا بنساعدك.
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
              لأصحاب المصالح
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
            ما لقيت جوابك؟
          </h2>
          <p className="text-gray/70 mb-6">
            فريقنا دايمًا جاهز يساعد. ابعثلنا مباشرة وبنكون مبسوطين نرد على كل أسئلتك.
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