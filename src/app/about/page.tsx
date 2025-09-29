'use client';

import { motion, Variants } from 'framer-motion';
import { Target, Eye, Users, Briefcase, HeartHandshake, Rocket } from 'lucide-react';
import Link from 'next/link';

// Animation variants for orchestration
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

// Variants for items fading in from below
const fadeInUp: Variants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

// Data for the timeline section - باللهجة العامية
const timelineEvents = [
  {
    icon: Rocket,
    year: '2024',
    title: 'ولادة الفكرة',
    description: "'Wen' بلشت من فكرة بسيطة: كيف ممكن نخلّي الناس تلاقي أحسن الخدمات والمحلات الموثوقة اللي حواليهم بسهولة؟",
  },
  {
    icon: Users,
    year: '2025',
    title: 'بنينا المنصة',
    description: 'فريقنا صمم وطوّر منصة سهلة، بتخدم الناس اللي بتدوّر على خدمة، وأصحاب المصالح بنفس الوقت.',
  },
  {
    icon: HeartHandshake,
    year: 'اليوم',
    title: 'احنا بخدمتكم',
    description: 'احنا هون عشان نوصلّك بأحسن الموجود بمنطقتك. بهمنا دايمًا الجودة، الثقة، وإنه الكل يستفيد وينمو معنا.',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B132B] to-[#1B2A41] text-gray overflow-x-hidden">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="container mx-auto px-4 py-16 md:py-24"
      >
        {/* Hero Section */}
        <motion.section variants={fadeInUp} className="text-center mb-20">
          <h1 className="text-4xl md:text-6xl font-bold text-gold mb-4">
            قصتنا بـ <span className="font-dancing">Wen</span>
          </h1>
          <p className="max-w-3xl mx-auto text-gray/80 text-lg">
            احنا بنآمن بقوة أهل البلد والمجتمع اللي حوالينا. Wen انوجد عشان يكون حلقة الوصل بينك وبين أحسن الخدمات والناس الشاطرة بمنطقتك، بكل سهولة وثقة.
          </p>
        </motion.section>

        {/* Mission & Vision Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
          className="grid md:grid-cols-2 gap-8 mb-20"
        >
          <motion.div
            variants={fadeInUp}
            whileHover={{ y: -5, boxShadow: '0px 10px 20px rgba(255, 215, 0, 0.1)' }}
            className="bg-[#1B2A41]/60 p-8 rounded-2xl border border-gold/20"
          >
            <Target className="w-12 h-12 text-gold mb-4" />
            <h2 className="text-2xl font-bold text-gray mb-2">مهمتنا</h2>
            <p className="text-gray/70">
              ندعم المصالح والشركات المحلية ونكبّرها، عن طريق منصة بتوصلهم لناس أكثر، بتساعدهم يبنوا سمعة قوية، وينمّوا البزنس تبعهم.
            </p>
          </motion.div>
          <motion.div
            variants={fadeInUp}
            whileHover={{ y: -5, boxShadow: '0px 10px 20px rgba(255, 215, 0, 0.1)' }}
            className="bg-[#1B2A41]/60 p-8 rounded-2xl border border-gold/20"
          >
            <Eye className="w-12 h-12 text-gold mb-4" />
            <h2 className="text-2xl font-bold text-gray mb-2">رؤيتنا</h2>
            <p className="text-gray/70">
              نكون الدليل الأول اللي بوثق فيه كل حدا بدور على أي خدمة بمنطقته. وبهالطريقة، احنا بنقوّي شغل البلد وبنزيد الثقة بين الناس.
            </p>
          </motion.div>
        </motion.section>
        
        {/* Timeline Section */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInUp}
          className="mb-20"
        >
          <h2 className="text-center text-3xl font-bold text-gold mb-12">مشوارنا</h2>
          <div className="relative max-w-2xl mx-auto">
            {/* The vertical line */}
            <motion.div 
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 1.5, ease: 'easeIn', delay: 0.5 }}
              className="absolute right-1 top-0 w-1 bg-gold/30 h-full origin-top"
            />
            <div className="space-y-12">
              {timelineEvents.map((event, index) => {
                const Icon = event.icon;
                return (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.6, delay: index * 0.3 }}
                    className="relative"
                  >
                    <div className="absolute right-7 top-1 translate-x-1/2 w-8 h-8 bg-navy border-2 border-gold rounded-full flex items-center justify-center z-10">
                      <Icon className="w-4 h-4 text-gold" />
                    </div>
                    <div className="pr-12">
                      <p className="text-sm text-gold/80 mb-1">{event.year}</p>
                      <h3 className="text-xl font-bold text-gray mb-2">{event.title}</h3>
                      <p className="text-gray/70">{event.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={fadeInUp}
          className="bg-gradient-to-r from-gold/10 to-transparent p-8 rounded-2xl border border-gold/20 text-center"
        >
          <h2 className="text-2xl font-bold text-gold mb-4">جاهز تكون جزء من قصتنا؟</h2>
          <p className="text-gray/80 mb-6">
            انضم لشبكة المحترفين اللي معنا، أو بلّش مشوارك هسا واكتشف أحسن الخدمات.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="bg-gradient-to-br from-gold to-yellow-500 text-navy font-bold py-2.5 px-6 rounded-full hover:opacity-90 transition-all flex items-center gap-2 shadow-lg shadow-gold/20 transform hover:scale-105 w-full sm:w-auto"
            >
              <Briefcase size={20} />
              انضم كصاحب مصلحة
            </Link>
            <Link
              href="/categories"
              className="bg-navy border-2 border-gold/50 text-gold font-bold py-2.5 px-6 rounded-full hover:bg-gold/10 transition-all flex items-center gap-2 transform hover:scale-105 w-full sm:w-auto"
            >
              شوف الفئات
            </Link>
          </div>
        </motion.section>

      </motion.div>
    </div>
  );
}