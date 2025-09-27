'use client'; 

import React, { useState } from 'react'; 
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

import { 
  ChevronDown, UtensilsCrossed, Coffee, Cake, CookingPot, Truck, Beef, ShoppingBasket, PartyPopper,
  Stethoscope, Hospital, Pill, Dna, Bot, Scale, Handshake, HeartPulse, Sparkles, Droplet,
  Scissors, Paintbrush, SprayCan, PersonStanding, Diamond,
  HardHat, Wrench, Zap, Hammer, PaintRoller, Ruler, Bug, Car, CarTaxiFront,
  HandCoins, Settings2, Landmark, Calculator, DraftingCompass, Users,
  Megaphone, Code, PenTool, ShoppingCart, Shirt, Laptop, Sofa, Gift, BookOpen,
  ToyBrick, Dumbbell, Camera, Music, Clapperboard, Palette,
  GraduationCap, School, BookUser, Library, Languages, Cat, Watch, Cross,
  Dog, Bone, Bird, Gamepad2, KeyRound, Factory, Printer, Sprout, Leaf, Recycle, Tractor,
  TriangleAlert, Bike, Sailboat, ParkingCircle, Building, Brush, Gem, Drama,
  ClipboardList , Flower, Mail, ShieldCheck, TrendingUp, Home, Repeat, Hotel, Plane, Map, Ticket, Stamp,Warehouse,
} from 'lucide-react';

const categorySections = [
  {
    title: 'مطاعم ومأكولات',
    description: 'اكتشف أفضل المطاعم وخدمات الطعام في منطقتك.',
    image: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?q=80&w=1548&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    categories: [
      { name: 'مطاعم', icon: UtensilsCrossed },
      { name: 'مقاهي', icon: Coffee },
      { name: 'مخابز وحلويات', icon: Cake },
      { name: 'توصيل طعام', icon: CookingPot },
      { name: 'شاحنات طعام', icon: Truck },
      { name: 'جزارون (لحوم)', icon: Beef },
      { name: 'محلات أطعمة خاصة', icon: ShoppingBasket },
      { name: 'خدمات تقديم طعام (كاترينج)', icon: PartyPopper },
    ],
  },
  {
    title: 'صحة وعافية',
    description: 'أفضل مقدمي الرعاية الصحية والخدمات الطبية في منطقتك.',
    image: 'https://images.unsplash.com/photo-1758691463354-055e4d72e5fc?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    categories: [
      { name: 'أطباء', icon: Stethoscope },
      { name: 'مستشفيات وعيادات', icon: Hospital },
      { name: 'عيادات أسنان', icon: HeartPulse },
      { name: 'صيدليات', icon: Pill },
      { name: 'علاج طبيعي', icon: Dna },
      { name: 'أخصائيو تغذية', icon: Bot },
      { name: 'صحة نفسية', icon: Scale },
      { name: 'أخصائيو بصريات', icon: Handshake },
      { name: 'مراكز أشعة', icon: HeartPulse },
      { name: 'مختبرات طبية', icon: HeartPulse },
      { name: 'علاج النطق', icon: Bot },
      { name: 'طب بديل', icon: Sparkles },
    ],
  },
  {
    title: 'جمال وعناية شخصية',
    description: 'اكتشف أفضل صالونات التجميل وخدمات العناية الشخصية في منطقتك.',
    image: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    categories: [
      { name: 'صالونات تجميل', icon: Scissors },
      { name: 'حلاقون', icon: Scissors },
      { name: 'سبا ومنتجعات صحية', icon: Sparkles },
      { name: 'فنانو مكياج', icon: Paintbrush },
      { name: 'إزالة شعر', icon: SprayCan },
      { name: 'صالونات أظافر', icon: PersonStanding },
      { name: 'مراكز العناية بالبشرة', icon: Droplet },
      { name: 'وشم (تاتو) وثقب الجسم', icon: Diamond },
    ],
  },
  {
    title: 'منزل وبناء',
    description: 'اكتشف أفضل خدمات المنزل والبناء في منطقتك.',
    image: 'https://images.unsplash.com/photo-1516216628859-9bccecab13ca?q=80&w=1738&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    categories: [
      { name: 'مقاولون', icon: HardHat },
      { name: 'سباكون', icon: Wrench },
      { name: 'كهربائيون', icon: Zap },
      { name: 'نجارون', icon: Hammer },
      { name: 'دهان (طلاء)', icon: PaintRoller },
      { name: 'تصميم داخلي', icon: Ruler },
      { name: 'خدمات تنظيف', icon: SprayCan },
      { name: 'تنسيق حدائق', icon: SprayCan },
      { name: 'مكافحة حشرات', icon: Bug },
      { name: 'إصلاح أجهزة منزلية', icon: Wrench },
      { name: 'أقفال ومفاتيح', icon: Wrench },
      { name: 'أنظمة أمنية وكاميرات', icon: Camera },
      { name: 'نقل أثاث', icon: Truck },
      { name: 'تركيب ألواح شمسية', icon: Zap },
    ],
  },
  {
    title: 'سيارات ونقل',
    description: 'اكتشف أفضل خدمات السيارات والنقل في منطقتك.',
    image: 'https://images.unsplash.com/photo-1639927676452-984f8210befc?q=80&w=928&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    categories: [
      { name: 'ميكانيكي سيارات', icon: Wrench },
      { name: 'غسيل وتفصيل سيارات', icon: Sparkles },
      { name: 'تأجير سيارات', icon: KeyRound },
      { name: 'بيع سيارات', icon: HandCoins },
      { name: 'قطع غيار سيارات', icon: Settings2 },
      { name: 'خدمات القطر (الجر)', icon: TriangleAlert },
      { name: 'محلات إطارات', icon: Settings2 },
      { name: 'تعليم قيادة', icon: GraduationCap },
      { name: 'خدمات نقل وشحن', icon: Truck },
      { name: 'سائقو سيارات أجرة', icon: CarTaxiFront },
      { name: 'دراجات نارية', icon: Bike },
      { name: 'قوارب ويخوت', icon: Sailboat },
      { name: 'مواقف سيارات', icon: ParkingCircle },
    ],
  },
  {
    title: 'خدمات مهنية وقانونية',
    description: 'أفضل الخدمات المهنية والقانونية في منطقتك.',
    image: 'https://images.unsplash.com/photo-1707902665498-a202981fb5ac?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    categories: [
      { name: 'محامون', icon: Landmark },
      { name: 'محاسبون ومدققون', icon: Calculator },
      { name: 'مهندسون', icon: DraftingCompass },
      { name: 'مستشارون', icon: Users },
      { name: 'خدمات ترجمة', icon: Languages },
      { name: 'كاتب عدل', icon: PenTool },
      { name: 'وكلاء عقارات', icon: Building },
      { name: 'وكلاء تأمين', icon: Handshake },
      { name: 'مستشارون ماليون', icon: HandCoins },
    ],
  },
  {
    title: 'تسوق',
    description: 'أفضل المتاجر وخدمات التسوق في منطقتك.',
    image: 'https://images.unsplash.com/photo-1664455340023-214c33a9d0bd?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    categories: [
      { name: 'سوبر ماركت', icon: ShoppingCart },
      { name: 'محلات ملابس', icon: Shirt },
      { name: 'متاجر إلكترونيات', icon: Laptop },
      { name: 'أثاث ومفروشات', icon: Sofa },
      { name: 'هدايا وزهور', icon: Gift },
      { name: 'مكتبات', icon: BookOpen },
      { name: 'محلات مجوهرات', icon: Diamond },
      { name: 'محلات ألعاب', icon: ToyBrick },
      { name: 'معدات رياضية', icon: Dumbbell },
      { name: 'خياطة وتعديل ملابس', icon: Scissors },
    ],
  },
  {
    title: 'مناسبات وترفيه',
    description: 'أفضل أماكن الترفيه وتنظيم المناسبات في منطقتك.',
    image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1738&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    categories: [
      { name: 'قاعات أفراح ومناسبات', icon: PartyPopper },
      { name: 'منظمو حفلات', icon: PartyPopper },
      { name: 'مصورون', icon: Camera },
      { name: 'فرق موسيقية و DJ', icon: Music },
      { name: 'تأجير معدات للمناسبات', icon: Settings2 },
      { name: 'دور سينما ومسارح', icon: Clapperboard },
      { name: 'متاحف ومعارض فنية', icon: Palette },
      { name: 'خدمة صف السيارات (فاليه)', icon: Car },
    ],
  },
  {
    title: 'تعليم وتطوير',
    description: 'أفضل المؤسسات التعليمية والمدرسين في منطقتك.',
    image: 'https://images.unsplash.com/photo-1758685734622-3e0a002b2f53?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    categories: [
      { name: 'مدارس', icon: School },
      { name: 'جامعات', icon: GraduationCap },
      { name: 'مدرسون خصوصيون', icon: BookUser },
      { name: 'مراكز تعليمية', icon: Library },
      { name: 'مدارس لغات', icon: Languages },
      { name: 'دروس موسيقى وفن', icon: Music },
      { name: 'مدربو حياة (لايف كوتش)', icon: Users },
      { name: 'مخيمات صيفية', icon: PartyPopper },
    ],
  },
  {
    title: 'تكنولوجيا وإعلام',
    description: 'أفضل شركات التكنولوجيا والإعلام في منطقتك.',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    categories: [
      { name: 'مطورون ويب وبرامج', icon: Code },
      { name: 'مصممو جرافيك', icon: PenTool },
      { name: 'وكالات تسويق رقمي', icon: Megaphone },
      { name: 'خدمات IT وتصليح حاسوب', icon: Laptop },
      { name: 'خدمات طباعة', icon: BookOpen },
      { name: 'استوديوهات تسجيل', icon: Music },
      { name: 'شركات علاقات عامة', icon: Megaphone },
    ],
  },
  {
    title: 'حيوانات أليفة',
    description: 'اكتشف أفضل خدمات الحيوانات الأليفة في منطقتك.',
    image: 'https://images.unsplash.com/photo-1623387641168-d9803ddd3f35?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    categories: [
      { name: 'أطباء بيطريون', icon: Stethoscope },
      { name: 'محلات حيوانات أليفة', icon: Cat },
      { name: 'العناية بالحيوانات الأليفة', icon: Dog },
      { name: 'فنادق حيوانات أليفة', icon: Bone },
      { name: 'مدربو حيوانات', icon: Bird },
    ],
  },
  {
    title: 'رياضة ولياقة',
    description: 'اكتشف أفضل مراكز الرياضة واللياقة البدنية في منطقتك.',
    image: 'https://images.unsplash.com/photo-1527933053326-89d1746b76b9?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    categories: [
      { name: 'صالات رياضية (جيم)', icon: Dumbbell },
      { name: 'مدربو رياضة شخصيون', icon: PersonStanding },
      { name: 'نوادي رياضية', icon: Gamepad2 },
      { name: 'استوديوهات يوجا وبيلاتس', icon: PersonStanding },
      { name: 'فنون قتالية', icon: PersonStanding },
    ],
  },
  {
    title: 'عقارات وأملاك',
    description: 'ابحث عن منزلك القادم أو استثمر في العقارات مع أفضل الخبراء.',
    image: 'https://images.unsplash.com/photo-1722487631997-cf1e0f92c2c4?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    categories: [
      { name: 'وكلاء عقارات', icon: Building },
      { name: 'شقق للبيع', icon: HandCoins },
      { name: 'شقق للإيجار', icon: KeyRound },
      { name: 'إدارة الممتلكات', icon: ClipboardList }, // Corrected icon
      { name: 'مقاولات بناء', icon: HardHat },
      { name: 'مستشارون عقاريون', icon: Users },
    ],
  },
  {
    title: 'عائلتك وأطفالك',
    description: 'كل ما تحتاجه عائلتك من رعاية، تعليم، وترفيه للأطفال.',
    image: 'https://images.unsplash.com/photo-1632052998134-ee83afa9cced?q=80&w=1620&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    categories: [
      { name: 'حضانات ورياض أطفال', icon: School },
      { name: 'جليسات أطفال', icon: PersonStanding },
      { name: 'مراكز ألعاب للأطفال', icon: ToyBrick },
      { name: 'مستشارون أسريون', icon: Users },
      { name: 'مخيمات صيفية', icon: PartyPopper },
      { name: 'محلات ملابس أطفال', icon: Shirt },
    ],
  },
  {
    title: 'خدمات حكومية ومجتمعية',
    description: 'دليلك للوصول إلى الخدمات العامة والمؤسسات الحكومية بسهولة.',
    image: 'https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    categories: [
      { name: 'مكاتب بريد', icon: Landmark },
      { name: 'مكتبات عامة', icon: Library },
      { name: 'جمعيات خيرية', icon: Handshake },
      { name: 'مراكز مجتمعية', icon: Building },
      { name: 'سفارات وقنصليات', icon: Landmark },
      { name: 'خدمات الطوارئ', icon: TriangleAlert },
    ],
  },
{
  title: 'أعراس ومناسبات خاصة',
  description: 'كل ما تحتاجه لتنظيم يومك المميز، من قاعات الأفراح إلى المصورين.',
  image: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  categories: [
    { name: 'قاعات أفراح', icon: PartyPopper },
    { name: 'منظمو أعراس', icon: ClipboardList },
    { name: 'فساتين زفاف', icon: Shirt },
    { name: 'مصورو أعراس', icon: Camera },
    { name: 'بطاقات دعوة', icon: Mail },
    { name: 'زهور للمناسبات', icon: Flower },
  ],
},
{
  title: 'تمويل وتأمين',
  description: 'خبراء لمساعدتك في إدارة أموالك، استثماراتك، وتأمين مستقبلك.',
  image: 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  categories: [
    { name: 'بنوك ومصارف', icon: Landmark },
    { name: 'شركات تأمين', icon: ShieldCheck },
    { name: 'شركات استثمار', icon: TrendingUp },
    { name: 'رهن عقاري', icon: Home },
    { name: 'صرافة', icon: Repeat },
    { name: 'مستشارون ماليون', icon: HandCoins },
  ],
},
{
  title: 'سفر وسياحة',
  description: 'خطط لرحلتك القادمة مع أفضل الفنادق، وكالات السفر، والجولات السياحية.',
  image: 'https://images.unsplash.com/photo-1490430657723-4d607c1503fc?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  categories: [
    { name: 'فنادق ومنتجعات', icon: Hotel },
    { name: 'وكالات سفر', icon: Plane },
    { name: 'مرشدون سياحيون', icon: Map },
    { name: 'تأجير سيارات سياحية', icon: Car },
    { name: 'مناطق سياحية', icon: Ticket },
    { name: 'تأشيرات سفر', icon: Stamp },
  ],
},
{
  title: 'صناعة وتجارة الجملة',
  description: 'كل ما تحتاجه أعمالك من موردين، معدات صناعية، وخدمات لوجستية.',
  image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  categories: [
    { name: 'موردون بالجملة', icon: Warehouse },
    { name: 'معدات صناعية', icon: Factory },
    { name: 'خدمات لوجستية', icon: Truck },
    { name: 'مواد بناء', icon: HardHat },
    { name: 'شركات طباعة', icon: Printer },
    { name: 'آلات ومكائن', icon: Settings2 },
  ],
},

{
  title: 'فنون وحرف وثقافة',
  description: 'مساحة للفنانين، الحرفيين، وهواة الثقافة. اكتشف ورش عمل، معارض، ومراكز ثقافية.',
  image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  categories: [
    { name: 'فنانون تشكيليون', icon: Palette },
    { name: 'ورش عمل فنية', icon: Brush },
    { name: 'خزف وفخار', icon: Gem },
    { name: 'مراكز ثقافية', icon: Landmark },
    { name: 'حرف يدوية', icon: Scissors },
    { name: 'مدارس تمثيل', icon: Drama },
  ],
},

{
  title: 'زراعة وبيئة',
  description: 'مصادر للمزارعين، هواة الحدائق، وكل ما يتعلق بالاستدامة والخدمات البيئية.',
  image: 'https://images.unsplash.com/photo-1587316807833-7008b6d63a4e?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  categories: [
    { name: 'مشاتل ومستلزمات', icon: Sprout },
    { name: 'مهندسون زراعيون', icon: DraftingCompass },
    { name: 'مزارع عضوية', icon: Leaf },
    { name: 'خدمات بيئية', icon: Recycle },
    { name: 'تربية مواشي', icon: Beef },
    { name: 'معدات زراعية', icon: Tractor },
  ],
},

{
  title: 'خدمات شخصية ومتنوعة',
  description: 'لجميع الخدمات اليومية الأساسية التي تحتاجها، من التنظيف الجاف إلى التصليحات الدقيقة.',
  image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  categories: [
    { name: 'تنظيف جاف وغسيل', icon: Shirt },
    { name: 'تصليح أحذية وحقائب', icon: Wrench },
    { name: 'تصليح ساعات', icon: Watch },
    { name: 'تخزين شخصي', icon: Warehouse },
    { name: 'خدمات كبار السن', icon: Users },
    { name: 'خدمات جنازة', icon: Cross },
  ],
},

];

const gridContainerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const gridItemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function CategoryGrid() {
  const [openSections, setOpenSections] = useState<{[key: string]: boolean}>({});

  const toggleSection = (title: string) => {
    setOpenSections(prev => ({ ...prev, [title]: !prev[title] }));
  };
  
  return (
    <section className="bg-navy py-12 md:py-16">
      <div className="container mx-auto px-4">
        {categorySections.map((section) => {
          const isOpen = openSections[section.title] || false;
          
          return (
            <div key={section.title} className="mb-8">
              <button
                onClick={() => toggleSection(section.title)}
                className="w-full relative text-left rounded-lg overflow-hidden group shadow-xl"
              >
                <div className="absolute inset-0">
                   <Image
                    src={section.image}
                    alt={section.title}
                    fill
                    className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/70 to-navy/50"></div>
                <div className="relative w-full p-6 md:p-8 text-center">
                  <h2 className="text-3xl md:text-4xl font-bold text-gold">
                    {section.title}
                  </h2>
                  <p className="text-gray/80 text-base md:text-lg mt-2">
                    {section.description}
                  </p>
                  <div className="absolute top-1/2 -translate-y-1/2 left-6 text-gold p-2 bg-black/20 rounded-full">
                     <ChevronDown
                        size={32}
                        className={`transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`}
                      />
                  </div>
                </div>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <motion.div
                      variants={gridContainerVariants}
                      initial="hidden"
                      animate="show"
                      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6 pt-6"
                    >
                      {section.categories.map((category) => {
                        const IconComponent = category.icon;
                        return (
                          <motion.a
                            key={category.name}
                            href="#"
                            variants={gridItemVariants}
                            className="bg-[#1B2A41] p-4 rounded-lg text-center text-gray flex flex-col items-center justify-center gap-3 transition-all duration-300 shadow-lg hover:shadow-gold/20 hover:bg-gold hover:text-navy transform hover:-translate-y-1.5"
                          >
                            <div className="text-gold transition-colors duration-300">
                              <IconComponent size={32} />
                            </div>
                            <span className="text-base font-semibold">{category.name}</span>
                          </motion.a>
                        );
                      })}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}

