'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, MapPin } from 'lucide-react';

type RegionMap = {
  [key: string]: string[];
};

const locationsByRegion: RegionMap = {
  'الشمال': ["حيفا", "عكا", "الناصرة", "شفا عمرو", "طمرة", "سخنين", "عرابة", "كفركنا", "يافة الناصرة", "الرينة", "كفرياسيف", "ابو سنان", "جديدة المكر", "دير الاسد", "نحف", "البعنة", "مجد الكروم", "الرامة", "ساجور", "كابول", "الشيخ دنون", "ترشيحا", "معليا", "فسوطة", "حرفيش", "جولس", "يركا", "بيت جن", "البقيعة", "كوكب ابو الهيجا", "عبلين", "الكعبية", "ابطن", "عرب العرامشة", "عرب النعيم", "راس علي", "الهيب", "الزرازير", "الكمانة", "وادي سلامة"],
  'المركز والمثلث': ["يافا", "اللد", "الرملة", "الطيبة", "الطيرة", "قلنسوة", "كفر قاسم", "كفربرا", "جلجولية", "جت المثلث", "زيمر", "باقة الغربية", "ام الفحم", "عرعرة المثلث", "عارة", "كفرقرع", "معاوية", "مصمص", "سالم", "زلفة", "عين ابراهيم", "ام القطف", "ميسر", "برطعة"],
  'القدس': ["القدس", "ابو غوش", "العزير", "عين نقوبا"],
  'الجنوب والنقب': ["رهط", "تل السبع", "شقيب السلام", "اللقية", "حورة", "كسيفة", "عرعرة النقب"],
  'الكرمل': ["دالية الكرمل", "عسفيا"],
  'الجولان': ["مجدل شمس", "مسعدة", "بقعاتا", "عين قنية", "الغجر"],
  'المرج': ["اكسال", "دبورية", "الشبلي ام الغنم", "بستان المرج", "الناعورة", "نين", "طيبة الزعبية", "الدحي", "عيلوط", "كفر مصر", "منشية زبدة", "عين ماهل"],
};

type LocationSelectorProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (location: string) => void;
};

export default function LocationSelector({ isOpen, onClose, onSelect }: LocationSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [geoStatus, setGeoStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [geoError, setGeoError] = useState('');

  // Filtered regions
  const filteredRegions = useMemo(() => {
    if (!searchTerm) return locationsByRegion;

    return Object.keys(locationsByRegion).reduce((acc, region) => {
      const locations = locationsByRegion[region];
      const matchingLocations = locations.filter(location =>
        location.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (matchingLocations.length > 0) acc[region] = matchingLocations;
      return acc;
    }, {} as RegionMap);
  }, [searchTerm]);

  const handleSelect = (location: string) => {
    onSelect(location);
    onClose();
  };

  // 🔥 Get Current Location with Reverse Geocoding
  const handleGetCurrentLocation = () => {
    setGeoStatus('loading');
    setGeoError('');

    if (!navigator.geolocation) {
      setGeoStatus('error');
      setGeoError('متصفحك لا يدعم خدمة تحديد المواقع.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=ar`
          );
          const data = await response.json();

          const locationName =
            data.address.city ||
            data.address.town ||
            data.address.village ||
            data.address.hamlet ||
            data.display_name ||
            'موقع غير معروف';

          setGeoStatus('success');
          handleSelect(locationName);
        } catch (err) {
          console.error(err);
          setGeoStatus('error');
          setGeoError('تعذر تحديد اسم الموقع.');
        }
      },
      (error) => {
        setGeoStatus('error');
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setGeoError('لقد رفضت السماح بالوصول إلى موقعك.');
            break;
          case error.POSITION_UNAVAILABLE:
            setGeoError('معلومات الموقع غير متاحة حالياً.');
            break;
          case error.TIMEOUT:
            setGeoError('انتهت مهلة طلب تحديد الموقع.');
            break;
          default:
            setGeoError('حدث خطأ غير متوقع. حاول مرة أخرى.');
            break;
        }
      }
    );
  };

  // Close modal with ESC
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] bg-navy/90 backdrop-blur-xl flex justify-center items-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, y: -20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="bg-[#1B2A41] w-full max-w-2xl h-[90vh] max-h-[700px] rounded-2xl shadow-2xl flex flex-col border border-gold/20"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gold/10 flex-shrink-0">
              <h2 className="text-xl font-bold text-gold">اختر موقعك</h2>
              <button
                onClick={onClose}
                className="text-gray hover:text-gold transition-colors p-2 rounded-full hover:bg-gold/10"
              >
                <X size={28} />
              </button>
            </div>

            {/* Search + Current Location */}
            <div className="p-4 flex-shrink-0 space-y-4">
              <button
                onClick={handleGetCurrentLocation}
                disabled={geoStatus === 'loading'}
                className="w-full flex items-center justify-center gap-3 bg-gold/10 text-gold font-semibold py-3 px-4 rounded-lg border border-gold/20 hover:bg-gold/20 transition-colors disabled:opacity-50"
              >
                <MapPin size={20} />
                {geoStatus === 'loading' ? 'جاري التحديد...' : 'استخدام موقعي الحالي'}
              </button>
              {geoError && <p className="text-red-400 text-sm text-center">{geoError}</p>}

              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="أو ابحث عن مدينة أو قرية..."
                  className="w-full bg-[#0B132B] text-gray border-2 border-gold/30 rounded-full py-3 pr-12 pl-5 focus:outline-none focus:border-gold/80 transition-all"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gold/60">
                  <Search size={22} />
                </div>
              </div>
            </div>

            {/* Regions + Locations */}
            <div className="flex-grow overflow-y-auto p-4">
              {Object.entries(filteredRegions).map(([region, locations]) => (
                <div key={region} className="mb-4">
                  <h3 className="font-bold text-gold/80 mb-2 pr-2 border-r-2 border-gold/50">{region}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1">
                    {locations.map(location => (
                      <button
                        key={location}
                        onClick={() => handleSelect(location)}
                        className="w-full text-right p-2 rounded-lg text-gray hover:bg-gold/10 hover:text-gold transition-colors duration-200"
                      >
                        {location}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
