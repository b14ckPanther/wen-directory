'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X } from 'lucide-react';

// Define a type for the BeforeInstallPromptEvent to avoid using 'any'
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function AddToHomeScreen() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // To prevent the prompt from showing immediately on page load, 
    // we can add a small delay. You can adjust or remove this timeout.
    const timer = setTimeout(() => {
      const handleBeforeInstallPrompt = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e as BeforeInstallPromptEvent);
        setShowPrompt(true);
      };

      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      };
    }, 2000); // 2-second delay

    return () => clearTimeout(timer);
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt');
        } else {
          console.log('User dismissed the A2HS prompt');
        }
        setDeferredPrompt(null);
        setShowPrompt(false);
      });
    }
  };

  const handleClose = () => {
    setShowPrompt(false);
  };

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          // Animation: Start above the screen (-150px) and animate to y: 0
          initial={{ y: -150, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -150, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          // Positioning: Fixed to the top, centered horizontally
          className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-lg bg-gold text-navy p-4 rounded-xl shadow-2xl flex items-center gap-4"
        >
          <div className="flex-shrink-0">
            <Download size={24} />
          </div>
          <div className="flex-grow">
            <p className="font-bold">ثبّت تطبيق Wen!</p>
            <p className="text-sm">أضفه إلى شاشتك الرئيسية للحصول على أفضل تجربة.</p>
          </div>
          <button
            onClick={handleInstallClick}
            className="ml-4 bg-navy text-gold px-4 py-2 rounded-lg font-semibold hover:bg-opacity-80 flex-shrink-0"
          >
            تثبيت
          </button>
          <button onClick={handleClose} className="text-navy hover:text-opacity-80">
            <X size={20} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}