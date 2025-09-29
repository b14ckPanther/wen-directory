'use client'; 

import React, { useState } from 'react'; 
import Image from 'next/image';
import Link from 'next/link';
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
    slug: 'طعام',
    image: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?q=80&w=1548&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    categories: [
      { name: 'مطاعم', icon: UtensilsCrossed, slug: 'مطاعم' },
      { name: 'مقاهي', icon: Coffee, slug: 'مقاهي' },
      { name: 'مخابز وحلويات', icon: Cake, slug: 'مخابز-وحلويات' },
      { name: 'توصيل طعام', icon: CookingPot, slug: 'توصيل-طعام' },
      { name: 'شاحنات طعام', icon: Truck, slug: 'شاحنات-طعام' },
      { name: 'جزارون (لحوم)', icon: Beef, slug: 'جزارون' },
      { name: 'محلات أطعمة خاصة', icon: ShoppingBasket, slug: 'اطعمة-خاصة' },
      { name: 'خدمات تقديم طعام (كاترينج)', icon: PartyPopper, slug: 'كاترينج' },
    ],
  },
  {
    title: 'صحة وعافية',
    description: 'أفضل مقدمي الرعاية الصحية والخدمات الطبية في منطقتك.',
    slug: 'صحة',
    image: 'https://images.unsplash.com/photo-1758691463354-055e4d72e5fc?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    categories: [
      { name: 'أطباء', icon: Stethoscope, slug: 'اطباء' },
      { name: 'مستشفيات وعيادات', icon: Hospital, slug: 'عيادات' },
      { name: 'عيادات أسنان', icon: HeartPulse, slug: 'اطباء-اسنان' },
      { name: 'صيدليات', icon: Pill, slug: 'صيدليات' },
      { name: 'علاج طبيعي', icon: Dna, slug: 'علاج-طبيعي' },
      { name: 'أخصائيو تغذية', icon: Bot, slug: 'اخصائيو-تغذية' },
      { name: 'صحة نفسية', icon: Scale, slug: 'صحة-نفسية' },
      { name: 'أخصائيو بصريات', icon: Handshake, slug: 'اخصائيو-بصريات' },
      { name: 'مراكز أشعة', icon: HeartPulse, slug: 'مراكز-اشعة' },
      { name: 'مختبرات طبية', icon: HeartPulse, slug: 'مختبرات-طبية' },
      { name: 'علاج النطق', icon: Bot, slug: 'علاج-النطق' },
      { name: 'طب بديل', icon: Sparkles, slug: 'طب-بديل' },
    ],
  },
  {
    title: 'جمال وعناية شخصية',
    description: 'اكتشف أفضل صالونات التجميل وخدمات العناية الشخصية في منطقتك.',
    slug: 'جمال',
    image: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    categories: [
      { name: 'صالونات تجميل', icon: Scissors, slug: 'صالونات-تجميل' },
      { name: 'حلاقون', icon: Scissors, slug: 'حلاقون' },
      { name: 'سبا ومنتجعات صحية', icon: Sparkles, slug: 'سبا' },
      { name: 'فنانو مكياج', icon: Paintbrush, slug: 'فنانو-مكياج' },
      { name: 'إزالة شعر', icon: SprayCan, slug: 'ازالة-شعر' },
      { name: 'صالونات أظافر', icon: PersonStanding, slug: 'صالونات-اظافر' },
      { name: 'مراكز العناية بالبشرة', icon: Droplet, slug: 'عناية-بالبشرة' },
      { name: 'وشم (تاتو) وثقب الجسم', icon: Diamond, slug: 'وشم-وثقب' },
    ],
  },
  {
    title: 'منزل وبناء',
    description: 'اكتشف أفضل خدمات المنزل والبناء في منطقتك.',
    slug: 'منزل-وبناء',
    image: 'https://images.unsplash.com/photo-1516216628859-9bccecab13ca?q=80&w=1738&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    categories: [
      { name: 'مقاولون', icon: HardHat, slug: 'مقاولون' },
      { name: 'سباكون', icon: Wrench, slug: 'سباكون' },
      { name: 'كهربائيون', icon: Zap, slug: 'كهربائيون' },
      { name: 'نجارون', icon: Hammer, slug: 'نجارون' },
      { name: 'دهان (طلاء)', icon: PaintRoller, slug: 'دهان' },
      { name: 'تصميم داخلي', icon: Ruler, slug: 'تصميم-داخلي' },
      { name: 'خدمات تنظيف', icon: SprayCan, slug: 'خدمات-تنظيف' },
      { name: 'تنسيق حدائق', icon: SprayCan, slug: 'تنسيق-حدائق' },
      { name: 'مكافحة حشرات', icon: Bug, slug: 'مكافحة-حشرات' },
      { name: 'إصلاح أجهزة منزلية', icon: Wrench, slug: 'اصلاح-اجهزة' },
      { name: 'أقفال ومفاتيح', icon: Wrench, slug: 'اقفال-ومفاتيح' },
      { name: 'أنظمة أمنية وكاميرات', icon: Camera, slug: 'انظمة-امنية' },
      { name: 'نقل أثاث', icon: Truck, slug: 'نقل-اثاث' },
      { name: 'تركيب ألواح شمسية', icon: Zap, slug: 'طاقة-شمسية' },
    ],
  },
  {
    title: 'سيارات ونقل',
    description: 'اكتشف أفضل خدمات السيارات والنقل في منطقتك.',
    slug: 'سيارات',
    image: 'https://images.unsplash.com/photo-1639927676452-984f8210befc?q=80&w=928&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    categories: [
      { name: 'ميكانيكي سيارات', icon: Wrench, slug: 'ميكانيكي' },
      { name: 'غسيل وتفصيل سيارات', icon: Sparkles, slug: 'غسيل-سيارات' },
      { name: 'تأجير سيارات', icon: KeyRound, slug: 'تأجير-سيارات' },
      { name: 'بيع سيارات', icon: HandCoins, slug: 'بيع-سيارات' },
      { name: 'قطع غيار سيارات', icon: Settings2, slug: 'قطع-غيار' },
      { name: 'خدمات القطر (الجر)', icon: TriangleAlert, slug: 'قطر-سيارات' },
      { name: 'محلات إطارات', icon: Settings2, slug: 'اطارات' },
      { name: 'تعليم قيادة', icon: GraduationCap, slug: 'تعليم-قيادة' },
      { name: 'خدمات نقل وشحن', icon: Truck, slug: 'نقل-وشحن' },
      { name: 'سائقو سيارات أجرة', icon: CarTaxiFront, slug: 'سيارات-اجرة' },
      { name: 'دراجات نارية', icon: Bike, slug: 'دراجات-نارية' },
      { name: 'قوارب ويخوت', icon: Sailboat, slug: 'قوارب' },
      { name: 'مواقف سيارات', icon: ParkingCircle, slug: 'مواقف' },
    ],
  },
  {
    title: 'خدمات مهنية وقانونية',
    description: 'أفضل الخدمات المهنية والقانونية في منطقتك.',
    slug: 'خدمات-مهنية',
    image: 'https://images.unsplash.com/photo-1707902665498-a202981fb5ac?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    categories: [
      { name: 'محامون', icon: Landmark, slug: 'محامون' },
      { name: 'محاسبون ومدققون', icon: Calculator, slug: 'محاسبون' },
      { name: 'مهندسون', icon: DraftingCompass, slug: 'مهندسون' },
      { name: 'مستشارون', icon: Users, slug: 'مستشارون' },
      { name: 'خدمات ترجمة', icon: Languages, slug: 'ترجمة' },
      { name: 'كاتب عدل', icon: PenTool, slug: 'كاتب-عدل' },
      { name: 'وكلاء عقارات', icon: Building, slug: 'وكلاء-عقارات' },
      { name: 'وكلاء تأمين', icon: Handshake, slug: 'وكلاء-تامين' },
      { name: 'مستشارون ماليون', icon: HandCoins, slug: 'مستشارون-ماليون' },
    ],
  },
  {
    title: 'تسوق',
    description: 'أفضل المتاجر وخدمات التسوق في منطقتك.',
    slug: 'تسوق',
    image: 'https://images.unsplash.com/photo-1664455340023-214c33a9d0bd?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    categories: [
      { name: 'سوبر ماركت', icon: ShoppingCart, slug: 'سوبر-ماركت' },
      { name: 'محلات ملابس', icon: Shirt, slug: 'ملابس' },
      { name: 'متاجر إلكترونيات', icon: Laptop, slug: 'الكترونيات' },
      { name: 'أثاث ومفروشات', icon: Sofa, slug: 'اثاث' },
      { name: 'هدايا وزهور', icon: Gift, slug: 'هدايا-وزهور' },
      { name: 'مكتبات', icon: BookOpen, slug: 'مكتبات' },
      { name: 'محلات مجوهرات', icon: Diamond, slug: 'مجوهرات' },
      { name: 'محلات ألعاب', icon: ToyBrick, slug: 'العاب' },
      { name: 'معدات رياضية', icon: Dumbbell, slug: 'معدات-رياضية' },
      { name: 'خياطة وتعديل ملابس', icon: Scissors, slug: 'خياطة' },
    ],
  },
  {
    title: 'مناسبات وترفيه',
    description: 'أفضل أماكن الترفيه وتنظيم المناسبات في منطقتك.',
    slug: 'مناسبات-وترفيه',
    image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1738&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    categories: [
      { name: 'قاعات أفراح ومناسبات', icon: PartyPopper, slug: 'قاعات-افراح' },
      { name: 'منظمو حفلات', icon: PartyPopper, slug: 'منظمو-حفلات' },
      { name: 'مصورون', icon: Camera, slug: 'مصورون' },
      { name: 'فرق موسيقية و DJ', icon: Music, slug: 'فرق-موسيقية' },
      { name: 'تأجير معدات للمناسبات', icon: Settings2, slug: 'تاجير-معدات' },
      { name: 'دور سينما ومسارح', icon: Clapperboard, slug: 'سينما-ومسارح' },
      { name: 'متاحف ومعارض فنية', icon: Palette, slug: 'متاحف-ومعارض' },
      { name: 'خدمة صف السيارات (فاليه)', icon: Car, slug: 'خدمة-صف-السيارات' },
    ],
  },
  {
    title: 'تعليم وتطوير',
    description: 'أفضل المؤسسات التعليمية والمدرسين في منطقتك.',
    slug: 'تعليم',
    image: 'https://images.unsplash.com/photo-1758685734622-3e0a002b2f53?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    categories: [
      { name: 'مدارس', icon: School, slug: 'مدارس' },
      { name: 'جامعات', icon: GraduationCap, slug: 'جامعات' },
      { name: 'مدرسون خصوصيون', icon: BookUser, slug: 'مدرسون-خصوصيون' },
      { name: 'مراكز تعليمية', icon: Library, slug: 'مراكز-تعليمية' },
      { name: 'مدارس لغات', icon: Languages, slug: 'مدارس-لغات' },
      { name: 'دروس موسيقى وفن', icon: Music, slug: 'دروس-موسيقى-وفن' },
      { name: 'مدربو حياة (لايف كوتش)', icon: Users, slug: 'مدربو-حياة' },
      { name: 'مخيمات صيفية', icon: PartyPopper, slug: 'مخيمات-صيفية' },
    ],
  },
  {
    title: 'تكنولوجيا وإعلام',
    description: 'أفضل شركات التكنولوجيا والإعلام في منطقتك.',
    slug: 'تكنولوجيا',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    categories: [
      { name: 'مطورون ويب وبرامج', icon: Code, slug: 'مطورون-ويب' },
      { name: 'مصممو جرافيك', icon: PenTool, slug: 'مصممو-جرافيك' },
      { name: 'وكالات تسويق رقمي', icon: Megaphone, slug: 'تسويق-رقمي' },
      { name: 'خدمات IT وتصليح حاسوب', icon: Laptop, slug: 'خدمات-IT' },
      { name: 'خدمات طباعة', icon: BookOpen, slug: 'خدمات-طباعة' },
      { name: 'استوديوهات تسجيل', icon: Music, slug: 'استوديوهات-تسجيل' },
      { name: 'شركات علاقات عامة', icon: Megaphone, slug: 'علاقات-عامة' },
    ],
  },
  {
    title: 'حيوانات أليفة',
    description: 'اكتشف أفضل خدمات الحيوانات الأليفة في منطقتك.',
    slug: 'حيوانات-اليفة',
    image: 'https://images.unsplash.com/photo-1623387641168-d9803ddd3f35?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    categories: [
      { name: 'أطباء بيطريون', icon: Stethoscope, slug: 'اطباء-بيطريون' },
      { name: 'محلات حيوانات أليفة', icon: Cat, slug: 'محلات-حيوانات-اليفة' },
      { name: 'العناية بالحيوانات الأليفة', icon: Dog, slug: 'عناية-بالحيوانات-الاليفة' },
      { name: 'فنادق حيوانات أليفة', icon: Bone, slug: 'فنادق-حيوانات-اليفة' },
      { name: 'مدربو حيوانات', icon: Bird, slug: 'مدربو-حيوانات' },
    ],
  },
  {
    title: 'رياضة ولياقة',
    description: 'اكتشف أفضل مراكز الرياضة واللياقة البدنية في منطقتك.',
    slug: 'رياضة',
    image: 'https://images.unsplash.com/photo-1527933053326-89d1746b76b9?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    categories: [
      { name: 'صالات رياضية (جيم)', icon: Dumbbell, slug: 'صالات-رياضية' },
      { name: 'مدربو رياضة شخصيون', icon: PersonStanding, slug: 'مدربون-شخصيون' },
      { name: 'نوادي رياضية', icon: Gamepad2, slug: 'نوادي-رياضية' },
      { name: 'استوديوهات يوجا وبيلاتس', icon: PersonStanding, slug: 'يوجا-وبيلاتس' },
      { name: 'فنون قتالية', icon: PersonStanding, slug: 'فنون-قتالية' },
    ],
  },
  {
    title: 'عقارات وأملاك',
    description: 'ابحث عن منزلك القادم أو استثمر في العقارات مع أفضل الخبراء.',
    slug: 'عقارات',
    image: 'https://images.unsplash.com/photo-1722487631997-cf1e0f92c2c4?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    categories: [
      { name: 'وكلاء عقارات', icon: Building, slug: 'وكلاء-عقارات' },
      { name: 'شقق للبيع', icon: HandCoins, slug: 'شقق-للبيع' },
      { name: 'شقق للإيجار', icon: KeyRound, slug: 'شقق-للايجار' },
      { name: 'إدارة الممتلكات', icon: ClipboardList, slug: 'ادارة-الممتلكات' },
      { name: 'مقاولات بناء', icon: HardHat, slug: 'مقاولات-بناء' },
      { name: 'مستشارون عقاريون', icon: Users, slug: 'مستشارون-عقاريون' },
    ],
  },
  {
    title: 'عائلتك وأطفالك',
    description: 'كل ما تحتاجه عائلتك من رعاية، تعليم، وترفيه للأطفال.',
    slug: 'عائلة',
    image: 'https://images.unsplash.com/photo-1632052998134-ee83afa9cced?q=80&w=1620&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    categories: [
      { name: 'حضانات ورياض أطفال', icon: School, slug: 'حضانات' },
      { name: 'جليسات أطفال', icon: PersonStanding, slug: 'جليسات-اطفال' },
      { name: 'مراكز ألعاب للأطفال', icon: ToyBrick, slug: 'مراكز-العاب' },
      { name: 'مستشارون أسريون', icon: Users, slug: 'مستشارون-اسريون' },
      { name: 'مخيمات صيفية', icon: PartyPopper, slug: 'مخيمات-صيفية' },
      { name: 'محلات ملابس أطفال', icon: Shirt, slug: 'ملابس-اطفال' },
    ],
  },
  {
    title: 'خدمات حكومية ومجتمعية',
    description: 'دليلك للوصول إلى الخدمات العامة والمؤسسات الحكومية بسهولة.',
    slug: 'خدمات-حكومية',
    image: 'https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    categories: [
      { name: 'مكاتب بريد', icon: Landmark, slug: 'بريد' },
      { name: 'مكتبات عامة', icon: Library, slug: 'مكتبات-عامة' },
      { name: 'جمعيات خيرية', icon: Handshake, slug: 'جمعيات-خيرية' },
      { name: 'مراكز مجتمعية', icon: Building, slug: 'مراكز-مجتمعية' },
      { name: 'سفارات وقنصليات', icon: Landmark, slug: 'سفارات' },
      { name: 'خدمات الطوارئ', icon: TriangleAlert, slug: 'طوارئ' },
    ],
  },
{
  title: 'أعراس ومناسبات خاصة',
  description: 'كل ما تحتاجه لتنظيم يومك المميز، من قاعات الأفراح إلى المصورين.',
  slug: 'اعراس',
  image: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  categories: [
    { name: 'قاعات أفراح', icon: PartyPopper, slug: 'قاعات-افراح' },
    { name: 'منظمو أعراس', icon: ClipboardList, slug: 'منظمو-اعراس' },
    { name: 'فساتين زفاف', icon: Shirt, slug: 'فساتين-زفاف' },
    { name: 'مصورو أعراس', icon: Camera, slug: 'مصورو-اعراس' },
    { name: 'بطاقات دعوة', icon: Mail, slug: 'بطاقات-دعوة' },
    { name: 'زهور للمناسبات', icon: Flower, slug: 'زهور' },
  ],
},
{
  title: 'تمويل وتأمين',
  description: 'خبراء لمساعدتك في إدارة أموالك، استثماراتك، وتأمين مستقبلك.',
  slug: 'تمويل-وتامين',
  image: 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  categories: [
    { name: 'بنوك ومصارف', icon: Landmark, slug: 'بنوك' },
    { name: 'شركات تأمين', icon: ShieldCheck, slug: 'تامين' },
    { name: 'شركات استثمار', icon: TrendingUp, slug: 'استثمار' },
    { name: 'رهن عقاري', icon: Home, slug: 'رهن-عقاري' },
    { name: 'صرافة', icon: Repeat, slug: 'صرافة' },
    { name: 'مستشارون ماليون', icon: HandCoins, slug: 'مستشارون-ماليون' },
  ],
},
{
  title: 'سفر وسياحة',
  description: 'خطط لرحلتك القادمة مع أفضل الفنادق، وكالات السفر، والجولات السياحية.',
  slug: 'سفر-وسياحة',
  image: 'https://images.unsplash.com/photo-1490430657723-4d607c1503fc?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  categories: [
    { name: 'فنادق ومنتجعات', icon: Hotel, slug: 'فنادق' },
    { name: 'وكالات سفر', icon: Plane, slug: 'وكالات-سفر' },
    { name: 'مرشدون سياحيون', icon: Map, slug: 'مرشدون-سياحيون' },
    { name: 'تأجير سيارات سياحية', icon: Car, slug: 'تاجير-سيارات' },
    { name: 'مناطق سياحية', icon: Ticket, slug: 'مناطق-سياحية' },
    { name: 'تأشيرات سفر', icon: Stamp, slug: 'تاشيرات-سفر' },
  ],
},
{
  title: 'صناعة وتجارة الجملة',
  description: 'كل ما تحتاجه أعمالك من موردين، معدات صناعية، وخدمات لوجستية.',
  slug: 'صناعة-وتجارة',
  image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  categories: [
    { name: 'موردون بالجملة', icon: Warehouse, slug: 'موردون' },
    { name: 'معدات صناعية', icon: Factory, slug: 'معدات-صناعية' },
    { name: 'خدمات لوجستية', icon: Truck, slug: 'خدمات-لوجستية' },
    { name: 'مواد بناء', icon: HardHat, slug: 'مواد-بناء' },
    { name: 'شركات طباعة', icon: Printer, slug: 'شركات-طباعة' },
    { name: 'آلات ومكائن', icon: Settings2, slug: 'الات-ومكائن' },
  ],
},
{
  title: 'فنون وحرف وثقافة',
  description: 'مساحة للفنانين، الحرفيين، وهواة الثقافة. اكتشف ورش عمل، معارض، ومراكز ثقافية.',
  slug: 'فنون-وثقافة',
  image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  categories: [
    { name: 'فنانون تشكيليون', icon: Palette, slug: 'فنانون' },
    { name: 'ورش عمل فنية', icon: Brush, slug: 'ورش-فنية' },
    { name: 'خزف وفخار', icon: Gem, slug: 'خزف-وفخار' },
    { name: 'مراكز ثقافية', icon: Landmark, slug: 'مراكز-ثقافية' },
    { name: 'حرف يدوية', icon: Scissors, slug: 'حرف-يدوية' },
    { name: 'مدارس تمثيل', icon: Drama, slug: 'مدارس-تمثيل' },
  ],
},
{
  title: 'زراعة وبيئة',
  description: 'مصادر للمزارعين، هواة الحدائق، وكل ما يتعلق بالاستدامة والخدمات البيئية.',
  slug: 'زراعة-وبيئة',
  image: 'https://images.unsplash.com/photo-1587316807833-7008b6d63a4e?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  categories: [
    { name: 'مشاتل ومستلزمات', icon: Sprout, slug: 'مشاتل' },
    { name: 'مهندسون زراعيون', icon: DraftingCompass, slug: 'مهندسون-زراعيون' },
    { name: 'مزارع عضوية', icon: Leaf, slug: 'مزارع-عضوية' },
    { name: 'خدمات بيئية', icon: Recycle, slug: 'خدمات-بيئية' },
    { name: 'تربية مواشي', icon: Beef, slug: 'تربية-مواشي' },
    { name: 'معدات زراعية', icon: Tractor, slug: 'معدات-زراعية' },
  ],
},
{
  title: 'خدمات شخصية ومتنوعة',
  description: 'لجميع الخدمات اليومية الأساسية التي تحتاجها، من التنظيف الجاف إلى التصليحات الدقيقة.',
  slug: 'خدمات-شخصية',
  image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  categories: [
    { name: 'تنظيف جاف وغسيل', icon: Shirt, slug: 'تنظيف-جاف' },
    { name: 'تصليح أحذية وحقائب', icon: Wrench, slug: 'تصليح-احذية' },
    { name: 'تصليح ساعات', icon: Watch, slug: 'تصليح-ساعات' },
    { name: 'تخزين شخصي', icon: Warehouse, slug: 'تخزين-شخصي' },
    { name: 'خدمات كبار السن', icon: Users, slug: 'خدمات-كبار-السن' },
    { name: 'خدمات جنازة', icon: Cross, slug: 'خدمات-جنازة' },
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

// Define the component props
type CategoryGridProps = {
  startExpanded?: boolean;
};

export default function CategoryGrid({ startExpanded = false }: CategoryGridProps) {
  // Initialize state based on the startExpanded prop
  const [openSections, setOpenSections] = useState<{[key: string]: boolean}>(() => {
    if (startExpanded) {
      return categorySections.reduce((acc, section) => ({...acc, [section.title]: true }), {});
    }
    return {};
  });

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
                          <motion.div key={category.name} variants={gridItemVariants}>
                            <Link
                              href={`/categories/${category.slug}`}
                              className="bg-[#1B2A41] p-4 rounded-lg text-center text-gray flex flex-col items-center justify-center gap-3 transition-all duration-300 shadow-lg hover:shadow-gold/20 hover:bg-gold hover:text-navy transform hover:-translate-y-1.5"
                            >
                              <div className="text-gold transition-colors duration-300">
                                <IconComponent size={32} />
                              </div>
                              <span className="text-base font-semibold">{category.name}</span>
                            </Link>
                          </motion.div>
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