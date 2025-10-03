// src/components/BusinessDetailModal.tsx
'use client';
import React, { useState, useMemo, ChangeEvent, useEffect } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import {
  X, ShoppingCart, ArrowLeft, Utensils, Phone, MapPin, Share2, Instagram, Facebook, Globe, Plus,
  ImageIcon, Building, Settings, UploadCloud, Wifi, Wind, Map, Video, Camera, FileText, ClipboardList, Sparkles
} from 'lucide-react';
import { Business, MenuItem, Restaurant, ServiceItem } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { LucideIcon } from 'lucide-react';
import DynamicIcon from './DynamicIcon'; // ✅ ADDED: Import your DynamicIcon component

type BusinessDetailModalProps = {
  business: Business | null;
  onClose: () => void;
};

// --- SUB-COMPONENTS ---

const MenuItemCard = ({ item, onAddToCart }: { item: MenuItem, onAddToCart: () => void }) => (
  <motion.div layout className="bg-[#1B2A41] rounded-lg p-3 flex items-center gap-4">
    <div className="w-20 h-20 rounded-md overflow-hidden relative flex-shrink-0 bg-[#0A1024]">
      {item.image ? (
        <Image src={item.image} alt={item.name} fill className="object-cover" />
      ) : (
        <div className="flex items-center justify-center h-full">
          <ImageIcon size={24} className="text-gray-600" />
        </div>
      )}
    </div>
    <div className="flex-1">
      <h3 className="font-bold text-gray-200">{item.name}</h3>
      <p className="text-sm text-gray-400">{item.description}</p>
      <p className="font-semibold text-gold mt-1">{item.price}₪</p>
    </div>
    <button onClick={onAddToCart} className="p-2 bg-gold/10 text-gold rounded-full hover:bg-gold/20 transition-colors">
      <Plus size={24} />
    </button>
  </motion.div>
);

const CartItemRow = ({ item, count }: { item: MenuItem, count: number }) => (
  <div className="flex justify-between items-center py-2 border-b border-gold/10">
    <div>
      <p className="font-semibold text-gray-200">{item.name} (x{count})</p>
      <p className="text-sm text-gray-400">{item.price}₪</p>
    </div>
    <p className="font-bold text-gold">{(parseFloat(item.price) * count).toFixed(2)}₪</p>
  </div>
);

const ServiceGridItem = ({ item }: { item: ServiceItem }) => (
    <div className="bg-[#1B2A41] p-4 rounded-lg border border-gold/10 flex flex-col items-center text-center">
        {item.icon && <DynamicIcon name={item.icon} size={28} className="text-gold mb-2" />}
        <h4 className="font-bold text-gray-200">{item.name}</h4>
        {item.description && <p className="text-sm text-gray-400 mt-1">{item.description}</p>}
        {item.price && <p className="font-semibold text-gold mt-2">{item.price}</p>}
    </div>
);


// --- ADMIN CONTROL CENTER ---
type AdminControlCenterProps = {
    business: Business;
    onClose: () => void;
    onSaveSuccess: (updatedBusiness: Business) => void;
};

const AdminControlCenter: React.FC<AdminControlCenterProps> = ({ business, onClose, onSaveSuccess }) => {
    const [formData, setFormData] = useState({
        description: business.description || '',
        phone: business.phone || '',
        instagram: business.instagram || '',
        facebook: business.facebook || '',
        website: business.website || '',
        latitude: business.latitude || '',
        longitude: business.longitude || '',
        video_url: business.video_url || '',
        amenities: business.amenities?.join(', ') || '',
        services: business.services ? JSON.stringify(business.services, null, 2) : '[]',
    });
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [coverPreview, setCoverPreview] = useState<string | null>(business.image);
    const [logoPreview, setLogoPreview] = useState<string | null>(business.logo);
    const [isSaving, setIsSaving] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>, type: 'cover' | 'logo') => {
        const file = e.target.files?.[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            if (type === 'cover') {
                setCoverFile(file);
                setCoverPreview(previewUrl);
            } else {
                setLogoFile(file);
                setLogoPreview(previewUrl);
            }
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            let coverUrl = business.image;
            if (coverFile) {
                const filePath = `public/${Date.now()}-cover-${coverFile.name.replace(/\s/g, '_')}`;
                await supabase.storage.from('business-assets').upload(filePath, coverFile);
                coverUrl = supabase.storage.from('business-assets').getPublicUrl(filePath).data.publicUrl;
            }

            let logoUrl = business.logo;
            if (logoFile) {
                const filePath = `public/${Date.now()}-logo-${logoFile.name.replace(/\s/g, '_')}`;
                await supabase.storage.from('business-assets').upload(filePath, logoFile);
                logoUrl = supabase.storage.from('business-assets').getPublicUrl(filePath).data.publicUrl;
            }

            let parsedServices: ServiceItem[] | null = null;
            try {
                if (formData.services.trim() === '' || formData.services.trim() === '[]') {
                    parsedServices = [];
                } else {
                    parsedServices = JSON.parse(formData.services);
                    if (!Array.isArray(parsedServices)) {
                        throw new Error("Services must be a JSON array.");
                    }
                }
            } catch (jsonError) {
                alert(`خطأ في تنسيق JSON للخدمات. يرجى استخدام التنسيق الصحيح: [{"name": "اسم الخدمة", "description": "وصف", "price": "السعر", "icon": "IconName"}]`);
                setIsSaving(false);
                return;
            }

            const updatePayload = {
                description: formData.description,
                phone: formData.phone,
                instagram: formData.instagram,
                facebook: formData.facebook,
                website: formData.website,
                latitude: formData.latitude ? parseFloat(String(formData.latitude)) : null,
                longitude: formData.longitude ? parseFloat(String(formData.longitude)) : null,
                video_url: formData.video_url,
                amenities: formData.amenities.split(',').map(s => s.trim()).filter(Boolean),
                services: parsedServices,
                image: coverUrl,
                logo: logoUrl,
            };

            const { data, error } = await supabase.from('businesses').update(updatePayload).eq('id', business.id).select().single();

            if (error) throw error;

            onSaveSuccess(data as Business);
            onClose();
        } catch (error) {
            console.error("Failed to save business details:", error);
            alert(`Failed to save changes. Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <motion.div
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 400, damping: 40 }}
            className="absolute inset-0 bg-[#080F22] z-20 flex flex-col"
        >
            <header className="flex-shrink-0 p-4 border-b border-gold/20 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gold">لوحة تحكم الأدمن</h2>
                <button onClick={onClose} className="p-2 rounded-full hover:bg-gold/10"><X size={24} className="text-gray-400" /></button>
            </header>

            <main className="flex-1 overflow-y-auto p-6 space-y-6">
                <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-400"><FileText size={16} />الوصف</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full mt-2 bg-[#0A1024] border border-gray-700 rounded-lg p-2 text-white" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-semibold text-gray-400 mb-2 block">صورة الغلاف</label>
                        <label htmlFor="admin-cover-upload" className="cursor-pointer bg-[#0A1024] border-2 border-dashed border-gray-700 rounded-lg p-4 text-center hover:border-gold flex items-center justify-center h-24 relative">
                            {coverPreview ? <Image src={coverPreview} alt="Cover" layout="fill" className="object-contain rounded-md" /> : <UploadCloud className="text-gray-500" />}
                        </label>
                        <input id="admin-cover-upload" type="file" className="sr-only" onChange={e => handleFileChange(e, 'cover')} accept="image/*" />
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-gray-400 mb-2 block">اللوغو</label>
                        <label htmlFor="admin-logo-upload" className="cursor-pointer bg-[#0A1024] border-2 border-dashed border-gray-700 rounded-lg p-4 text-center hover:border-gold flex items-center justify-center h-24 relative">
                            {logoPreview ? <Image src={logoPreview} alt="Logo" layout="fill" className="object-contain rounded-md" /> : <UploadCloud className="text-gray-500" />}
                        </label>
                        <input id="admin-logo-upload" type="file" className="sr-only" onChange={e => handleFileChange(e, 'logo')} accept="image/*" />
                    </div>
                </div>

                <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-400"><Phone size={16} />رقم الهاتف</label>
                    <input name="phone" placeholder="e.g., +972501234567" value={formData.phone} onChange={handleChange} className="w-full mt-2 bg-[#0A1024] border border-gray-700 rounded-lg p-2 text-white" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div>
                         <label className="flex items-center gap-2 text-sm font-semibold text-gray-400"><MapPin size={16} />Latitude</label>
                         <input name="latitude" type="number" step="any" placeholder="e.g., 32.0853" value={formData.latitude} onChange={handleChange} className="w-full mt-2 bg-[#0A1024] border border-gray-700 rounded-lg p-2 text-white" />
                    </div>
                    <div>
                         <label className="flex items-center gap-2 text-sm font-semibold text-gray-400"><MapPin size={16} />Longitude</label>
                         <input name="longitude" type="number" step="any" placeholder="e.g., 34.7818" value={formData.longitude} onChange={handleChange} className="w-full mt-2 bg-[#0A1024] border border-gray-700 rounded-lg p-2 text-white" />
                    </div>
                </div>

                <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-400"><Share2 size={16} />روابط التواصل</label>
                    <div className="space-y-2 mt-2">
                        <input name="instagram" placeholder="رابط انستجرام" value={formData.instagram} onChange={handleChange} className="w-full bg-[#0A1024] border border-gray-700 rounded-lg p-2 text-white" />
                        <input name="facebook" placeholder="رابط فيسبوك" value={formData.facebook} onChange={handleChange} className="w-full bg-[#0A1024] border border-gray-700 rounded-lg p-2 text-white" />
                        <input name="website" placeholder="رابط الموقع" value={formData.website} onChange={handleChange} className="w-full bg-[#0A1024] border border-gray-700 rounded-lg p-2 text-white" />
                    </div>
                </div>

                 <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-400"><Sparkles size={16} />المميزات (مفصولة بفاصلة)</label>
                    <input name="amenities" placeholder="e.g., Free WiFi, Shisha, Live Music" value={formData.amenities} onChange={handleChange} className="w-full mt-2 bg-[#0A1024] border border-gray-700 rounded-lg p-2 text-white" />
                </div>

                 <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-400"><Video size={16} />رابط الفيديو (Trailer)</label>
                    <input name="video_url" placeholder="e.g., https://youtube.com/watch?v=..." value={formData.video_url} onChange={handleChange} className="w-full mt-2 bg-[#0A1024] border border-gray-700 rounded-lg p-2 text-white" />
                </div>

        <div>
  <label className="flex items-center gap-2 text-sm font-semibold text-gray-400">
    <ClipboardList size={16} />
    الخدمات / المنتجات المميزة (JSON format)
  </label>

  <textarea
    name="services"
    value={formData.services}
    onChange={handleChange}
    rows={6}
    className="w-full mt-2 bg-[#0A1024] border border-gray-700 rounded-lg p-2 text-white font-mono text-sm"
  />

  <p className="text-xs text-gray-500 mt-1">
    Use this format:{" "}
    <code>[{"{\"name\": \"Coffee\", \"icon\": \"Coffee\", \"price\": \"10₪\"}"}]</code>
  </p>
</div>

            </main>

            <footer className="flex-shrink-0 p-4 border-t border-gold/20">
                <button onClick={handleSave} disabled={isSaving} className="w-full bg-gold text-navy font-bold py-3 rounded-lg disabled:opacity-50">
                    {isSaving ? "جاري الحفظ..." : "حفظ التغييرات"}
                </button>
            </footer>
        </motion.div>
    );
};


// --- MAIN MODAL COMPONENT ---
const BusinessDetailModal: React.FC<BusinessDetailModalProps> = ({ business, onClose }) => {
  const [currentBusiness, setCurrentBusiness] = useState(business);
  const [view, setView] = useState<'info' | 'menu' | 'checkout'>('info');
  const [cart, setCart] = useState<MenuItem[]>([]);
  const { user } = useAuth();
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);

  useEffect(() => {
    if (business) {
      setCurrentBusiness(business);
      setView('info');
      setCart([]);
      setIsAdminPanelOpen(false);
    }
  }, [business]);
  
  const cartSummary = useMemo(() => {
    const summary = cart.reduce((acc, item) => {
      acc[item.id] = (acc[item.id] || { ...item, count: 0 });
      acc[item.id].count++;
      return acc;
    }, {} as Record<number, MenuItem & { count: number }>);
    return Object.values(summary);
  }, [cart]);
  
  const totalPrice = useMemo(() => 
    cart.reduce((total, item) => total + parseFloat(item.price), 0).toFixed(2),
  [cart]);
  
  const isRestaurant = (b: Business | null): b is Restaurant => b !== null && 'menu' in b;

  const handleAddToCart = (item: MenuItem) => {
    setCart(prev => [...prev, item]);
  };

  const handleSendToWhatsApp = () => {
    if (!currentBusiness || !isRestaurant(currentBusiness)) return;
    let message = `مرحباً ${currentBusiness.name}، أود أن أطلب:\n\n`;
    cartSummary.forEach(item => {
      message += `* ${item.name} (x${item.count}) - ${item.price}₪\n`;
    });
    message += `\n*الإجمالي: ${totalPrice}₪*`;
    const whatsappUrl = `https://wa.me/${currentBusiness.phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleSaveSuccess = (updatedBusiness: Business) => {
      setCurrentBusiness(updatedBusiness);
  };

  if (!currentBusiness) return null;
  
  const amenityIcons: { [key: string]: LucideIcon } = {
    'Free WiFi': Wifi,
    'Shisha': Wind,
  };

  const renderContent = () => {
    const hasMenu = isRestaurant(currentBusiness) && Array.isArray(currentBusiness.menu) && currentBusiness.menu.length > 0;
    const hasServices = Array.isArray(currentBusiness.services) && currentBusiness.services.length > 0;
    const hasVideo = currentBusiness.video_url;

    switch (view) {
      case 'info':
        return (
          <>
            <div className="p-6 text-center">
              <p className="text-gray-400">{currentBusiness.description}</p>
            </div>
            
            {currentBusiness.amenities && currentBusiness.amenities.length > 0 && (
                <div className="px-6 mb-6">
                    <h3 className="font-bold text-lg text-gold mb-3 border-b-2 border-gold/20 pb-2">المميزات</h3>
                    <div className="flex flex-wrap gap-3">
                        {currentBusiness.amenities.map(amenity => {
                            const Icon = amenityIcons[amenity] || Utensils;
                            return (
                                <div key={amenity} className="flex items-center gap-2 bg-gold/10 text-gold text-sm font-semibold px-3 py-1 rounded-full">
                                    <Icon size={16} />
                                    <span>{amenity}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
            
            {hasServices && (
                <div className="px-6 mb-6">
                    <h3 className="font-bold text-lg text-gold mb-3 border-b-2 border-gold/20 pb-2">خدمات ومنتجات مميزة</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {currentBusiness.services?.map((item, index) => <ServiceGridItem key={index} item={item} />)}
                    </div>
                </div>
            )}

            {hasVideo && (
                <div className="px-6 mb-6">
                    <h3 className="font-bold text-lg text-gold mb-3 border-b-2 border-gold/20 pb-2">فيديو تعريفي</h3>
                    <div className="aspect-video rounded-lg overflow-hidden border-2 border-gold/20">
                        <iframe
                            className="w-full h-full"
                            src={`https://www.youtube.com/embed/${new URLSearchParams(new URL(currentBusiness.video_url!).search).get('v')}`}
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            )}
            
            <div className="grid grid-cols-3 gap-4 px-6">
              {[
                { icon: Phone, label: 'الهاتف' }, { icon: MapPin, label: 'الخريطة' }, { icon: Share2, label: 'مشاركة' },
                { icon: Instagram, label: 'انستجرام' }, { icon: Facebook, label: 'فيسبوك' }, { icon: Globe, label: 'الموقع الإلكتروني' }
              ].map(btn => (
                <button key={btn.label} className="flex flex-col items-center justify-center gap-2 bg-[#1B2A41] p-4 rounded-lg text-gold hover:bg-gold/10 transition-colors">
                  <btn.icon size={24} />
                  <span className="text-xs font-semibold">{btn.label}</span>
                </button>
              ))}
            </div>
            {hasMenu ? (
              <div className="p-6 mt-4">
                <button onClick={() => setView('menu')} className="w-full bg-gold text-navy font-bold py-3 px-8 rounded-full hover:bg-yellow-300 transition-all shadow-lg shadow-gold/20 flex items-center justify-center gap-2">
                  <Utensils size={20} />
                  عرض القائمة / المنتجات
                </button>
              </div>
            ) : (
                !hasServices && (
                    <div className="p-6 text-center">
                        <p className="text-gray-400">لا تتوفر قائمة عرض حالياً لهذا النشاط.</p>
                    </div>
                )
            )}
          </>
        );
      
      case 'menu':
        return (
          <div className="p-4 space-y-4">
            {hasMenu ? (
              (currentBusiness as Restaurant).menu?.map(item => (
                <MenuItemCard key={item.id} item={item} onAddToCart={() => handleAddToCart(item)} />
              ))
            ) : (
              <div className="p-6 text-center">
                <p className="text-gray-400">القائمة فارغة حاليًا أو غير متوفرة.</p>
              </div>
            )}
          </div>
        );

      case 'checkout':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gold mb-4">ملخص الطلب</h2>
            <div className="space-y-2 mb-6">
              {cartSummary.map(item => <CartItemRow key={item.id} item={item} count={item.count} />)}
            </div>
            <div className="flex justify-between font-bold text-lg text-gray-200 border-t-2 border-gold/20 pt-4">
              <span>الإجمالي</span>
              <span>{totalPrice}₪</span>
            </div>
          </div>
        )
    }
  };

  const getTitle = () => {
    if (view === 'menu') return 'القائمة';
    if (view === 'checkout') return 'الدفع';
    return currentBusiness.name;
  };
  
  return (
    <AnimatePresence>
      {currentBusiness && (
        <motion.div
          initial={{ y: '100%' }} animate={{ y: '0%' }} exit={{ y: '100%' }}
          transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
          className="fixed inset-0 bg-[#0B132B] z-50 flex flex-col overflow-hidden"
        >
          <header className="relative flex-shrink-0">
            <div className="h-40 bg-[#0A1024]">
                {currentBusiness.image ? (
                    <Image src={currentBusiness.image} alt="Cover" fill className="object-cover opacity-30" />
                ) : (
                    <div className="flex items-center justify-center h-full w-full">
                        <ImageIcon size={48} className="text-gray-600 opacity-30" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B132B] to-transparent"></div>
            </div>

            <button onClick={onClose} className="absolute top-4 right-4 z-30 p-2 bg-black/30 rounded-full">
              <X size={28} className="text-white" />
            </button>
            {view !== 'info' && (
              <button onClick={() => setView(view === 'checkout' ? 'menu' : 'info')} className="absolute top-4 left-4 z-30 p-2 bg-black/30 rounded-full">
                <ArrowLeft size={28} className="text-white" />
              </button>
            )}

            {user?.role === 'admin' && (
              <button onClick={() => setIsAdminPanelOpen(true)} className="absolute top-4 left-16 z-30 p-2 bg-black/30 rounded-full text-white hover:bg-blue-500/50 transition-colors">
                  <Settings size={28} />
              </button>
            )}
            
            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full border-4 border-[#0B132B] overflow-hidden bg-navy flex items-center justify-center">
              {isRestaurant(currentBusiness) && currentBusiness.logo ? (
                 <Image src={currentBusiness.logo} alt="Logo" fill className="object-cover p-1" />
              ) : (
                <Building size={32} className="text-gray-500"/>
              )}
            </div>
          </header>

          <div className="mt-16 text-center px-4">
            <h1 className="text-3xl font-bold text-gold">{getTitle()}</h1>
          </div>

          <main className="flex-1 overflow-y-auto mt-6">
            {renderContent()}
          </main>

          <AnimatePresence>
            {isRestaurant(currentBusiness) && cart.length > 0 && view !== 'checkout' && (
              <motion.div 
                initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }}
                className="absolute bottom-0 left-0 right-0 p-4 bg-navy/80 backdrop-blur-sm border-t border-gold/20"
              >
                <button 
                  onClick={() => setView('checkout')}
                  className="w-full flex items-center justify-between bg-gold text-navy font-bold py-3 px-6 rounded-full shadow-lg"
                >
                  <div className="flex items-center gap-2">
                    <ShoppingCart size={20} />
                    <span>{cart.length} منتجات ({totalPrice}₪)</span>
                  </div>
                  <span>الدفع</span>
                </button>
              </motion.div>
            )}
            {view === 'checkout' && (
                 <div className="p-4 bg-navy border-t border-gold/20">
                    <button onClick={handleSendToWhatsApp} className="w-full bg-emerald-500 text-white font-bold py-3 px-8 rounded-full flex items-center justify-center gap-2">
                        إرسال الطلب عبر WhatsApp
                    </button>
                 </div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {isAdminPanelOpen && currentBusiness && (
              <AdminControlCenter 
                business={currentBusiness} 
                onClose={() => setIsAdminPanelOpen(false)}
                onSaveSuccess={handleSaveSuccess}
              />
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BusinessDetailModal;