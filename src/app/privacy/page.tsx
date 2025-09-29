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
          <p className="text-gray/70">آخر تعديل: {lastUpdatedDate}</p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-8 prose prose-invert prose-p:text-gray/80 prose-headings:text-gold/90 prose-strong:text-gray">
          
          {/* CORRECTED SECTION: Yellow box styling is back, with the new text inside. */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            className="bg-yellow-900/30 border border-yellow-500/50 text-yellow-300 p-4 rounded-lg"
          >
            <p className="!m-0">
              سياسة الخصوصية هاي بتوضح كيف منصة Wen بتجمع، بتستخدم، وبتحمي المعلومات اللي بتعطينا إياها. استخدامك للمنصة معناه إنك موافق على الشروط الموجودة بهاي الصفحة. بننصحك تقرأها منيح عشان تفهم كيف بنتعامل مع معلوماتك.
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
              أهلًا فيك بـ Wen. خصوصيتك أشي كثير مهم إلنا. بهاي الصفحة بنشرحلك كيف بنجمع، بنستخدم، وبنحمي معلوماتك الشخصية لما تستعمل تطبيقنا وخدماتنا، كله حسب القانون بإسرائيل.
            </p>
          </motion.section>

          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <h2>2. شو المعلومات اللي بنجمعها؟</h2>
            <p>ممكن نجمع أنواع معلومات مختلفة، زي:</p>
            <ul>
              <li><strong>معلومات شخصية:</strong> زي اسمك، إيميلك، ورقم تلفونك لما تسجل أو تحكي معنا.</li>
              <li><strong>معلومات عن البزنس:</strong> تفاصيل عن مصلحتك لما تسجلها عنا، زي الاسم، العنوان، وشو نوع الشغل.</li>
              <li><strong>معلومات عن كيفية الاستخدام:</strong> كيف بتتفاعل مع موقعنا، زي أي صفحات بتزورها وشو بتبحث.</li>
            </ul>
          </motion.section>

          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <h2>3. ليش بنستخدم معلوماتك وكيف؟</h2>
            <p>المعلومات اللي بنجمعها بنستخدمها عشان:</p>
            <ul>
              <li>نقدملك خدماتنا ونضل نحسّنها.</li>
              <li>نخلّي تجربتك معنا شخصية ومناسبة إلك.</li>
              <li>نتواصل معك بخصوص حسابك أو أي تحديثات جديدة.</li>
              <li>نحمي المنصة ونمنع أي عمليات احتيال.</li>
              <li>نلتزم بواجباتنا القانونية حسب قانون حماية الخصوصية.</li>
            </ul>
          </motion.section>

          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <h2>4. مع مين ممكن نشارك معلوماتك؟</h2>
            <p>
              احنا <strong>ما بنبيع</strong> معلوماتك الشخصية لأي حدا. ممكن نشارك معلوماتك بس مع أطراف ثالثة بتساعدنا نشغّل المنصة (زي شركات الاستضافة)، أو إذا القانون بطلب منا هالشي. طبعًا، المعلومات العامة عن البزنس تبعك (زي الاسم والعنوان) بتكون ظاهرة للكل على المنصة.
            </p>
          </motion.section>

          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <h2>5. حقوقك حسب القانون</h2>
            <p>
              حسب قانون حماية الخصوصية بإسرائيل، إلك الحق تطلب تراجع معلوماتك الشخصية الموجودة عنا (حق الاطلاع)، تطلب تصليح أي معلومة غلط (حق تعديل)، أو حتى تطلب مسحها بحالات معينة. عشان تستخدم هاي الحقوق، بتقدر <Link href="/contact" className="text-gold hover:underline">تحكي معنا</Link>.
            </p>
          </motion.section>

          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <h2>6. تعديلات على هاي السياسة</h2>
            <p>
              ممكن نعدّل على سياسة الخصوصية هاي من وقت لوقت. إذا عملنا أي تغيير كبير، رح نعلّمه على هاي الصفحة ونحدّث تاريخ آخر تعديل فوق.
            </p>
          </motion.section>
        </div>
      </div>
    </div>
  );
}