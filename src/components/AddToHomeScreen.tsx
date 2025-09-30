'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X } from 'lucide-react'; // Corrected icon name

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
  // Use the new type for our state
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      // Cast the event to our custom type
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      // The 'choiceResult' is now correctly typed from our interface
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
          initial={{ y: 200, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 200, opacity: 0 }}
          className="fixed bottom-4 right-4 z-50 bg-gold text-navy p-4 rounded-lg shadow-2xl flex items-center gap-4"
        >
          <div className="flex-shrink-0">
            {/* Use the corrected icon */}
            <Download size={24} />
          </div>
          <div>
            <p className="font-bold">Get the Wen app!</p>
            <p className="text-sm">Add it to your home screen for the best experience.</p>
          </div>
          <button
            onClick={handleInstallClick}
            className="ml-4 bg-navy text-gold px-4 py-2 rounded-md font-semibold hover:bg-opacity-80"
          >
            Install
          </button>
          <button onClick={handleClose} className="text-navy hover:text-opacity-80">
            <X size={20} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}