'use client';
import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  X, ShoppingCart, ArrowLeft, Utensils, Phone, MapPin, Share2, Instagram, Facebook, Globe, Plus, 
  ImageIcon, Building 
} from 'lucide-react'; 
import { Business, MenuItem, Restaurant } from '@/types';


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

// --- MAIN MODAL COMPONENT ---
const BusinessDetailModal: React.FC<BusinessDetailModalProps> = ({ business, onClose }) => {
  const [view, setView] = useState<'info' | 'menu' | 'checkout'>('info');
  const [cart, setCart] = useState<MenuItem[]>([]);

  React.useEffect(() => {
    if (business) {
      setView('info');
      setCart([]);
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

  if (!business) return null;
  
  const isRestaurant = (b: Business): b is Restaurant => 'menu' in b;

  const handleAddToCart = (item: MenuItem) => {
    setCart(prev => [...prev, item]);
  };

  const handleSendToWhatsApp = () => {
    if (!isRestaurant(business)) return;
    let message = `مرحباً ${business.name}، أود أن أطلب:\n\n`;
    cartSummary.forEach(item => {
      message += `* ${item.name} (x${item.count}) - ${item.price}₪\n`;
    });
    message += `\n*الإجمالي: ${totalPrice}₪*`;
    const whatsappUrl = `https://wa.me/${business.phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const renderContent = () => {
    if (!isRestaurant(business)) {
      return (
        <div className="p-6 text-center">
            <p className="text-gray-400">لا تتوفر قائمة عرض حالياً لهذا النشاط.</p>
        </div>
      );
    }
    
    switch (view) {
      case 'info':
        return (
          <>
            <div className="p-6 text-center">
              <p className="text-gray-400">{business.description}</p>
            </div>
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
            <div className="p-6 mt-4">
              <button onClick={() => setView('menu')} className="w-full bg-gold text-navy font-bold py-3 px-8 rounded-full hover:bg-yellow-300 transition-all shadow-lg shadow-gold/20 flex items-center justify-center gap-2">
                <Utensils size={20} />
                عرض القائمة / المنتجات
              </button>
            </div>
          </>
        );
      
      case 'menu':
        return (
          <div className="p-4 space-y-4">
            {business.menu.map(item => (
              <MenuItemCard key={item.id} item={item} onAddToCart={() => handleAddToCart(item)} />
            ))}
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
    return business.name;
  };
  
  return (
    <AnimatePresence>
      {business && (
        <motion.div
          initial={{ y: '100%' }} animate={{ y: '0%' }} exit={{ y: '100%' }}
          transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
          className="fixed inset-0 bg-[#0B132B] z-50 flex flex-col"
        >
          <header className="relative flex-shrink-0">
            <div className="h-40 bg-[#0A1024]">
                {business.image ? (
                    <Image src={business.image} alt="Cover" fill className="object-cover opacity-30" />
                ) : (
                    <div className="flex items-center justify-center h-full w-full">
                        <ImageIcon size={48} className="text-gray-600 opacity-30" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B132B] to-transparent"></div>
            </div>

            <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 bg-black/30 rounded-full">
              <X size={28} className="text-white" />
            </button>
            {view !== 'info' && (
              <button onClick={() => setView(view === 'checkout' ? 'menu' : 'info')} className="absolute top-4 left-4 z-10 p-2 bg-black/30 rounded-full">
                <ArrowLeft size={28} className="text-white" />
              </button>
            )}
            
            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full border-4 border-[#0B132B] overflow-hidden bg-navy flex items-center justify-center">
              {isRestaurant(business) && business.logo ? (
                 <Image src={business.logo} alt="Logo" fill className="object-cover p-1" />
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
            {isRestaurant(business) && cart.length > 0 && view !== 'checkout' && (
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
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BusinessDetailModal;