'use client';

import { motion, Variants } from 'framer-motion';
import Link from 'next/link';

// Animation variant for sections fading in
const fadeInUp: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

export default function PrivacyPolicyPage() {
  const lastUpdatedDate = '29 سبتمبر 2025';

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
            سياسة الخصوصية
          </h1>
          <p className="text-gray/70">آخر تحديث: {lastUpdatedDate}</p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-8 prose prose-invert prose-p:text-gray/80 prose-headings:text-gold/90 prose-strong:text-gray">
          
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            className="bg-yellow-900/30 border border-yellow-500/50 text-yellow-300 p-4 rounded-lg"
          >
            <p className="!m-0">
              <strong>ملاحظة هامة:</strong> هذا النص هو نموذج توضيحي فقط. يجب عليك استشارة محامٍ أو خبير قانوني لصياغة سياسة خصوصية تتوافق مع قوانين بلدك ومتطلبات عملك.
            </p>
          </motion.div>

          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <h2>1. مقدمة</h2>
            <p>
              أهلاً بك في Wen. نحن نأخذ خصوصيتك على محمل الجد. توضح هذه السياسة كيفية جمعنا واستخدامنا وحمايتنا لمعلوماتك الشخصية عند استخدامك لمنصتنا وخدماتنا.
            </p>
          </motion.section>

          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <h2>2. المعلومات التي نجمعها</h2>
            <p>قد نجمع أنواعًا مختلفة من المعلومات، بما في ذلك:</p>
            <ul>
              <li><strong>معلومات شخصية:</strong> مثل الاسم، البريد الإلكتروني، ورقم الهاتف عند التسجيل أو التواصل معنا.</li>
              <li><strong>معلومات الأعمال:</strong> تفاصيل حول عملك عند تسجيله على المنصة، بما في ذلك الاسم، العنوان، ونوع الخدمة.</li>
              <li><strong>بيانات الاستخدام:</strong> معلومات حول كيفية تفاعلك مع موقعنا، مثل الصفحات التي تزورها وعمليات البحث التي تقوم بها.</li>
            </ul>
          </motion.section>

          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <h2>3. كيف نستخدم معلوماتك</h2>
            <p>نستخدم المعلومات التي نجمعها للأغراض التالية:</p>
            <ul>
              <li>لتوفير وتحسين خدماتنا.</li>
              <li>لتخصيص تجربتك على المنصة.</li>
              <li>للتواصل معك بخصوص حسابك أو تحديثات الخدمة.</li>
              <li>لأغراض أمنية ولمنع الاحتيال.</li>
            </ul>
          </motion.section>

          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <h2>4. مشاركة معلوماتك</h2>
            <p>
              نحن لا نبيع معلوماتك الشخصية لأطراف ثالثة. قد نشارك معلوماتك مع مقدمي الخدمات الذين يساعدوننا في تشغيل منصتنا، أو إذا كان ذلك مطلوبًا بموجب القانون. المعلومات العامة لعملك ستكون متاحة للعامة على المنصة.
            </p>
          </motion.section>

          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <h2>5. حقوقك</h2>
            <p>
              لديك الحق في الوصول إلى معلوماتك الشخصية وتصحيحها أو حذفها. يمكنك ممارسة هذه الحقوق من خلال إعدادات حسابك أو عبر <Link href="/contact" className="text-gold hover:underline">التواصل معنا</Link>.
            </p>
          </motion.section>

          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <h2>6. التغييرات على هذه السياسة</h2>
            <p>
              قد نقوم بتحديث سياسة الخصوصية هذه من وقت لآخر. سنقوم بإعلامك بأي تغييرات جوهرية عن طريق نشر السياسة الجديدة على هذه الصفحة.
            </p>
          </motion.section>
        </div>
      </div>
    </div>
  );
}