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

// --- Data for category sections remains the same ---
const categorySections = [
    {
    title: 'مطاعم ومأكولات',
    description: 'اكتشف أفضل المطاعم وخدمات الطعام في منطقتك.',
    slug: 'food',
    image: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?q=80&w=1548&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    categories: [
      { name: 'مطاعم', icon: UtensilsCrossed, slug: 'restaurants' },
      { name: 'مقاهي', icon: Coffee, slug: 'cafes' },
      { name: 'مخابز وحلويات', icon: Cake, slug: 'bakeries' },
      { name: 'توصيل طعام', icon: CookingPot, slug: 'food-delivery' },
      { name: 'شاحنات طعام', icon: Truck, slug: 'food-trucks' },
      { name: 'جزارون (لحوم)', icon: Beef, slug: 'butchers' },
      { name: 'محلات أطعمة خاصة', icon: ShoppingBasket, slug: 'specialty-food' },
      { name: 'خدمات تقديم طعام (كاترينج)', icon: PartyPopper, slug: 'catering' },
    ],
  },
  {
    title: 'صحة وعافية',
    description: 'أفضل مقدمي الرعاية الصحية والخدمات الطبية في منطقتك.',
    slug: 'health',
    image: 'https://images.unsplash.com/photo-1758691463354-055e4d72e5fc?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    categories: [
      { name: 'أطباء', icon: Stethoscope, slug: 'doctors' },
      { name: 'مستشفيات وعيادات', icon: Hospital, slug: 'clinics' },
      { name: 'عيادات أسنان', icon: HeartPulse, slug: 'dentists' },
      { name: 'صيدليات', icon: Pill, slug: 'pharmacies' },
      { name: 'علاج طبيعي', icon: Dna, slug: 'physiotherapy' },
      { name: 'أخصائيو تغذية', icon: Bot, slug: 'nutritionists' },
      { name: 'صحة نفسية', icon: Scale, slug: 'mental-health' },
      { name: 'أخصائيو بصريات', icon: Handshake, slug: 'opticians' },
      { name: 'مراكز أشعة', icon: HeartPulse, slug: 'radiology-centers' },
      { name: 'مختبرات طبية', icon: HeartPulse, slug: 'medical-labs' },
      { name: 'علاج النطق', icon: Bot, slug: 'speech-therapy' },
      { name: 'طب بديل', icon: Sparkles, slug: 'alternative-medicine' },
    ],
  },
  {
    title: 'جمال وعناية شخصية',
    description: 'اكتشف أفضل صالونات التجميل وخدمات العناية الشخصية في منطقتك.',
    slug: 'beauty',
    image: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    categories: [
      { name: 'صالونات تجميل', icon: Scissors, slug: 'beauty-salons' },
      { name: 'حلاقون', icon: Scissors, slug: 'barbershops' },
      { name: 'سبا ومنتجعات صحية', icon: Sparkles, slug: 'spa' },
      { name: 'فنانو مكياج', icon: Paintbrush, slug: 'makeup-artists' },
      { name: 'إزالة شعر', icon: SprayCan, slug: 'hair-removal' },
      { name: 'صالونات أظافر', icon: PersonStanding, slug: 'nail-salons' },
      { name: 'مراكز العناية بالبشرة', icon: Droplet, slug: 'skincare-centers' },
      { name: 'وشم (تاتو) وثقب الجسم', icon: Diamond, slug: 'tattoo-piercing' },
    ],
  },
  {
    title: 'منزل وبناء',
    description: 'اكتشف أفضل خدمات المنزل والبناء في منطقتك.',
    slug: 'home-construction',
    image: 'https://images.unsplash.com/photo-1516216628859-9bccecab13ca?q=80&w=1738&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    categories: [
      { name: 'مقاولون', icon: HardHat, slug: 'contractors' },
      { name: 'سباكون', icon: Wrench, slug: 'plumbers' },
      { name: 'كهربائيون', icon: Zap, slug: 'electricians' },
      { name: 'نجارون', icon: Hammer, slug: 'carpenters' },
      { name: 'دهان (طلاء)', icon: PaintRoller, slug: 'painters' },
      { name: 'تصميم داخلي', icon: Ruler, slug: 'interior-design' },
      { name: 'خدمات تنظيف', icon: SprayCan, slug: 'cleaning-services' },
      { name: 'تنسيق حدائق', icon: SprayCan, slug: 'landscaping' },
      { name: 'مكافحة حشرات', icon: Bug, slug: 'pest-control' },
      { name: 'إصلاح أجهزة منزلية', icon: Wrench, slug: 'appliance-repair' },
      { name: 'أقفال ومفاتيح', icon: Wrench, slug: 'locksmiths' },
      { name: 'أنظمة أمنية وكاميرات', icon: Camera, slug: 'security-systems' },
      { name: 'نقل أثاث', icon: Truck, slug: 'movers' },
      { name: 'تركيب ألواح شمسية', icon: Zap, slug: 'solar-installation' },
    ],
  },
  {
    title: 'سيارات ونقل',
    description: 'اكتشف أفضل خدمات السيارات والنقل في منطقتك.',
    slug: 'auto',
    image: 'https://images.unsplash.com/photo-1639927676452-984f8210befc?q=80&w=928&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    categories: [
      { name: 'ميكانيكي سيارات', icon: Wrench, slug: 'auto-mechanics' },
      { name: 'غسيل وتفصيل سيارات', icon: Sparkles, slug: 'car-wash' },
      { name: 'تأجير سيارات', icon: KeyRound, slug: 'car-rental' },
      { name: 'بيع سيارات', icon: HandCoins, slug: 'car-dealers' },
      { name: 'قطع غيار سيارات', icon: Settings2, slug: 'auto-parts' },
      { name: 'خدمات القطر (الجر)', icon: TriangleAlert, slug: 'towing-services' },
      { name: 'محلات إطارات', icon: Settings2, slug: 'tire-shops' },
      { name: 'تعليم قيادة', icon: GraduationCap, slug: 'driving-schools' },
      { name: 'خدمات نقل وشحن', icon: Truck, slug: 'shipping-services' },
      { name: 'سائقو سيارات أجرة', icon: CarTaxiFront, slug: 'taxi-services' },
      { name: 'دراجات نارية', icon: Bike, slug: 'motorcycles' },
      { name: 'قوارب ويخوت', icon: Sailboat, slug: 'boats-yachts' },
      { name: 'مواقف سيارات', icon: ParkingCircle, slug: 'parking' },
    ],
  },
  {
    title: 'خدمات مهنية وقانونية',
    description: 'أفضل الخدمات المهنية والقانونية في منطقتك.',
    slug: 'professional-services',
    image: 'https://images.unsplash.com/photo-1707902665498-a202981fb5ac?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    categories: [
      { name: 'محامون', icon: Landmark, slug: 'lawyers' },
      { name: 'محاسبون ومدققون', icon: Calculator, slug: 'accountants' },
      { name: 'مهندسون', icon: DraftingCompass, slug: 'engineers' },
      { name: 'مستشارون', icon: Users, slug: 'consultants' },
      { name: 'خدمات ترجمة', icon: Languages, slug: 'translation-services' },
      { name: 'كاتب عدل', icon: PenTool, slug: 'notary' },
      { name: 'وكلاء عقارات', icon: Building, slug: 'real-estate-agents' },
      { name: 'وكلاء تأمين', icon: Handshake, slug: 'insurance-agents' },
      { name: 'مستشارون ماليون', icon: HandCoins, slug: 'financial-advisors' },
    ],
  },
  {
    title: 'تسوق',
    description: 'أفضل المتاجر وخدمات التسوق في منطقتك.',
    slug: 'shopping',
    image: 'https://images.unsplash.com/photo-1664455340023-214c33a9d0bd?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    categories: [
      { name: 'سوبر ماركت', icon: ShoppingCart, slug: 'supermarkets' },
      { name: 'محلات ملابس', icon: Shirt, slug: 'clothing-stores' },
      { name: 'متاجر إلكترونيات', icon: Laptop, slug: 'electronics-stores' },
      { name: 'أثاث ومفروشات', icon: Sofa, slug: 'furniture-stores' },
      { name: 'هدايا وزهور', icon: Gift, slug: 'gift-shops' },
      { name: 'مكتبات', icon: BookOpen, slug: 'bookstores' },
      { name: 'محلات مجوهرات', icon: Diamond, slug: 'jewelry-stores' },
      { name: 'محلات ألعاب', icon: ToyBrick, slug: 'toy-stores' },
      { name: 'معدات رياضية', icon: Dumbbell, slug: 'sports-equipment' },
      { name: 'خياطة وتعديل ملابس', icon: Scissors, slug: 'tailors' },
    ],
  },
  {
    title: 'مناسبات وترفيه',
    description: 'أفضل أماكن الترفيه وتنظيم المناسبات في منطقتك.',
    slug: 'events-entertainment',
    image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1738&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    categories: [
      { name: 'قاعات أفراح ومناسبات', icon: PartyPopper, slug: 'event-halls' },
      { name: 'منظمو حفلات', icon: PartyPopper, slug: 'event-planners' },
      { name: 'مصورون', icon: Camera, slug: 'photographers' },
      { name: 'فرق موسيقية و DJ', icon: Music, slug: 'musicians-djs' },
      { name: 'تأجير معدات للمناسبات', icon: Settings2, slug: 'event-rentals' },
      { name: 'دور سينما ومسارح', icon: Clapperboard, slug: 'cinemas-theaters' },
      { name: 'متاحف ومعارض فنية', icon: Palette, slug: 'museums-galleries' },
      { name: 'خدمة صف السيارات (فاليه)', icon: Car, slug: 'valet-parking' },
    ],
  },
  {
    title: 'تعليم وتطوير',
    description: 'أفضل المؤسسات التعليمية والمدرسين في منطقتك.',
    slug: 'education',
    image: 'https://images.unsplash.com/photo-1758685734622-3e0a002b2f53?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    categories: [
      { name: 'مدارس', icon: School, slug: 'schools' },
      { name: 'جامعات', icon: GraduationCap, slug: 'universities' },
      { name: 'مدرسون خصوصيون', icon: BookUser, slug: 'private-tutors' },
      { name: 'مراكز تعليمية', icon: Library, slug: 'learning-centers' },
      { name: 'مدارس لغات', icon: Languages, slug: 'language-schools' },
      { name: 'دروس موسيقى وفن', icon: Music, slug: 'music-art-lessons' },
      { name: 'مدربو حياة (لايف كوتش)', icon: Users, slug: 'life-coaches' },
      { name: 'مخيمات صيفية', icon: PartyPopper, slug: 'summer-camps' },
    ],
  },
  {
    title: 'تكنولوجيا وإعلام',
    description: 'أفضل شركات التكنولوجيا والإعلام في منطقتك.',
    slug: 'tech-media',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    categories: [
      { name: 'مطورون ويب وبرامج', icon: Code, slug: 'web-developers' },
      { name: 'مصممو جرافيك', icon: PenTool, slug: 'graphic-designers' },
      { name: 'وكالات تسويق رقمي', icon: Megaphone, slug: 'digital-marketing' },
      { name: 'خدمات IT وتصليح حاسوب', icon: Laptop, slug: 'it-services' },
      { name: 'خدمات طباعة', icon: BookOpen, slug: 'printing-services' },
      { name: 'استوديوهات تسجيل', icon: Music, slug: 'recording-studios' },
      { name: 'شركات علاقات عامة', icon: Megaphone, slug: 'pr-agencies' },
    ],
  },
  {
    title: 'حيوانات أليفة',
    description: 'اكتشف أفضل خدمات الحيوانات الأليفة في منطقتك.',
    slug: 'pets',
    image: 'https://images.unsplash.com/photo-1623387641168-d9803ddd3f35?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    categories: [
      { name: 'أطباء بيطريون', icon: Stethoscope, slug: 'vets' },
      { name: 'محلات حيوانات أليفة', icon: Cat, slug: 'pet-stores' },
      { name: 'العناية بالحيوانات الأليفة', icon: Dog, slug: 'pet-grooming' },
      { name: 'فنادق حيوانات أليفة', icon: Bone, slug: 'pet-boarding' },
      { name: 'مدربو حيوانات', icon: Bird, slug: 'pet-trainers' },
    ],
  },
  {
    title: 'رياضة ولياقة',
    description: 'اكتشف أفضل مراكز الرياضة واللياقة البدنية في منطقتك.',
    slug: 'sports-fitness',
    image: 'https://images.unsplash.com/photo-1527933053326-89d1746b76b9?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    categories: [
      { name: 'صالات رياضية (جيم)', icon: Dumbbell, slug: 'gyms' },
      { name: 'مدربو رياضة شخصيون', icon: PersonStanding, slug: 'personal-trainers' },
      { name: 'نوادي رياضية', icon: Gamepad2, slug: 'sports-clubs' },
      { name: 'استوديوهات يوجا وبيلاتس', icon: PersonStanding, slug: 'yoga-pilates' },
      { name: 'فنون قتالية', icon: PersonStanding, slug: 'martial-arts' },
    ],
  },
  {
    title: 'عقارات وأملاك',
    description: 'ابحث عن منزلك القادم أو استثمر في العقارات مع أفضل الخبراء.',
    slug: 'real-estate',
    image: 'https://images.unsplash.com/photo-1722487631997-cf1e0f92c2c4?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    categories: [
      { name: 'وكلاء عقارات', icon: Building, slug: 'real-estate-agents' },
      { name: 'شقق للبيع', icon: HandCoins, slug: 'apartments-for-sale' },
      { name: 'شقق للإيجار', icon: KeyRound, slug: 'apartments-for-rent' },
      { name: 'إدارة الممتلكات', icon: ClipboardList, slug: 'property-management' },
      { name: 'مقاولات بناء', icon: HardHat, slug: 'construction' },
      { name: 'مستشارون عقاريون', icon: Users, slug: 'real-estate-consultants' },
    ],
  },
  {
    title: 'عائلتك وأطفالك',
    description: 'كل ما تحتاجه عائلتك من رعاية، تعليم، وترفيه للأطفال.',
    slug: 'family-kids',
    image: 'https://images.unsplash.com/photo-1632052998134-ee83afa9cced?q=80&w=1620&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    categories: [
      { name: 'حضانات ورياض أطفال', icon: School, slug: 'daycare-kindergarten' },
      { name: 'جليسات أطفال', icon: PersonStanding, slug: 'babysitters' },
      { name: 'مراكز ألعاب للأطفال', icon: ToyBrick, slug: 'play-centers' },
      { name: 'مستشارون أسريون', icon: Users, slug: 'family-counselors' },
      { name: 'مخيمات صيفية', icon: PartyPopper, slug: 'summer-camps' },
      { name: 'محلات ملابس أطفال', icon: Shirt, slug: 'kids-clothing' },
    ],
  },
  {
    title: 'خدمات حكومية ومجتمعية',
    description: 'دليلك للوصول إلى الخدمات العامة والمؤسسات الحكومية بسهولة.',
    slug: 'government-community',
    image: 'https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    categories: [
      { name: 'مكاتب بريد', icon: Landmark, slug: 'post-offices' },
      { name: 'مكتبات عامة', icon: Library, slug: 'public-libraries' },
      { name: 'جمعيات خيرية', icon: Handshake, slug: 'charities' },
      { name: 'مراكز مجتمعية', icon: Building, slug: 'community-centers' },
      { name: 'سفارات وقنصليات', icon: Landmark, slug: 'embassies' },
      { name: 'خدمات الطوارئ', icon: TriangleAlert, slug: 'emergency-services' },
    ],
  },
{
  title: 'أعراس ومناسبات خاصة',
  description: 'كل ما تحتاجه لتنظيم يومك المميز، من قاعات الأفراح إلى المصورين.',
  slug: 'weddings-events',
  image: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  categories: [
    { name: 'قاعات أفراح', icon: PartyPopper, slug: 'wedding-halls' },
    { name: 'منظمو أعراس', icon: ClipboardList, slug: 'wedding-planners' },
    { name: 'فساتين زفاف', icon: Shirt, slug: 'wedding-dresses' },
    { name: 'مصورو أعراس', icon: Camera, slug: 'wedding-photographers' },
    { name: 'بطاقات دعوة', icon: Mail, slug: 'invitations' },
    { name: 'زهور للمناسبات', icon: Flower, slug: 'florists' },
  ],
},
{
  title: 'تمويل وتأمين',
  description: 'خبراء لمساعدتك في إدارة أموالك، استثماراتك، وتأمين مستقبلك.',
  slug: 'finance-insurance',
  image: 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  categories: [
    { name: 'بنوك ومصارف', icon: Landmark, slug: 'banks' },
    { name: 'شركات تأمين', icon: ShieldCheck, slug: 'insurance' },
    { name: 'شركات استثمار', icon: TrendingUp, slug: 'investment' },
    { name: 'رهن عقاري', icon: Home, slug: 'mortgage' },
    { name: 'صرافة', icon: Repeat, slug: 'exchange' },
    { name: 'مستشارون ماليون', icon: HandCoins, slug: 'financial-advisors' },
  ],
},
{
  title: 'سفر وسياحة',
  description: 'خطط لرحلتك القادمة مع أفضل الفنادق، وكالات السفر، والجولات السياحية.',
  slug: 'travel-tourism',
  image: 'https://images.unsplash.com/photo-1490430657723-4d607c1503fc?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  categories: [
    { name: 'فنادق ومنتجعات', icon: Hotel, slug: 'hotels' },
    { name: 'وكالات سفر', icon: Plane, slug: 'travel-agencies' },
    { name: 'مرشدون سياحيون', icon: Map, slug: 'tour-guides' },
    { name: 'تأجير سيارات سياحية', icon: Car, slug: 'car-rental' },
    { name: 'مناطق سياحية', icon: Ticket, slug: 'tourist-attractions' },
    { name: 'تأشيرات سفر', icon: Stamp, slug: 'visa-services' },
  ],
},
{
  title: 'صناعة وتجارة الجملة',
  description: 'كل ما تحتاجه أعمالك من موردين، معدات صناعية، وخدمات لوجستية.',
  slug: 'industry-wholesale',
  image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  categories: [
    { name: 'موردون بالجملة', icon: Warehouse, slug: 'wholesalers' },
    { name: 'معدات صناعية', icon: Factory, slug: 'industrial-equipment' },
    { name: 'خدمات لوجستية', icon: Truck, slug: 'logistics' },
    { name: 'مواد بناء', icon: HardHat, slug: 'building-materials' },
    { name: 'شركات طباعة', icon: Printer, slug: 'printing-companies' },
    { name: 'آلات ومكائن', icon: Settings2, slug: 'machinery' },
  ],
},
{
  title: 'فنون وحرف وثقافة',
  description: 'مساحة للفنانين، الحرفيين، وهواة الثقافة. اكتشف ورش عمل، معارض، ومراكز ثقافية.',
  slug: 'arts-culture',
  image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  categories: [
    { name: 'فنانون تشكيليون', icon: Palette, slug: 'artists' },
    { name: 'ورش عمل فنية', icon: Brush, slug: 'art-workshops' },
    { name: 'خزف وفخار', icon: Gem, slug: 'ceramics-pottery' },
    { name: 'مراكز ثقافية', icon: Landmark, slug: 'cultural-centers' },
    { name: 'حرف يدوية', icon: Scissors, slug: 'handicrafts' },
    { name: 'مدارس تمثيل', icon: Drama, slug: 'acting-schools' },
  ],
},
{
  title: 'زراعة وبيئة',
  description: 'مصادر للمزارعين، هواة الحدائق، وكل ما يتعلق بالاستدامة والخدمات البيئية.',
  slug: 'agriculture-environment',
  image: 'https://images.unsplash.com/photo-1587316807833-7008b6d63a4e?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  categories: [
    { name: 'مشاتل ومستلزمات', icon: Sprout, slug: 'nurseries' },
    { name: 'مهندسون زراعيون', icon: DraftingCompass, slug: 'agricultural-engineers' },
    { name: 'مزارع عضوية', icon: Leaf, slug: 'organic-farms' },
    { name: 'خدمات بيئية', icon: Recycle, slug: 'environmental-services' },
    { name: 'تربية مواشي', icon: Beef, slug: 'livestock' },
    { name: 'معدات زراعية', icon: Tractor, slug: 'agricultural-equipment' },
  ],
},
{
  title: 'خدمات شخصية ومتنوعة',
  description: 'لجميع الخدمات اليومية الأساسية التي تحتاجها، من التنظيف الجاف إلى التصليحات الدقيقة.',
  slug: 'personal-services',
  image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  categories: [
    { name: 'تنظيف جاف وغسيل', icon: Shirt, slug: 'dry-cleaning' },
    { name: 'تصليح أحذية وحقائب', icon: Wrench, slug: 'shoe-bag-repair' },
    { name: 'تصليح ساعات', icon: Watch, slug: 'watch-repair' },
    { name: 'تخزين شخصي', icon: Warehouse, slug: 'storage' },
    { name: 'خدمات كبار السن', icon: Users, slug: 'elderly-care' },
    { name: 'خدمات جنازة', icon: Cross, slug: 'funeral-services' },
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