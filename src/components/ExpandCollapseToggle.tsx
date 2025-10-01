// src/components/ExpandCollapseToggle.tsx (Corrected Colors)
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { UnfoldVertical, FoldVertical } from 'lucide-react';

type ExpandCollapseButtonProps = {
  isExpanded: boolean;
  onToggle: () => void;
};

export default function ExpandCollapseToggle({ isExpanded, onToggle }: ExpandCollapseButtonProps) {
  return (
    <motion.button
      onClick={onToggle}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className={`
        relative mx-auto my-8 flex items-center justify-center gap-3
        w-64 h-14 rounded-full
        font-semibold shadow-lg shadow-gold/20
        transition-colors duration-300 ease-out
        ${isExpanded
          // ✅ Style for EXPANDED state (Solid Gold)
          ? 'bg-gold text-navy'
          // ✅ Style for COLLAPSED state (Dark Transparent)
          : 'bg-navy/50 backdrop-blur-lg border-2 border-gold/30 text-gold'
        }
      `}
    >
      {/* Animated Icon */}
      <div className="relative h-6 w-6">
        <AnimatePresence>
          <motion.div
            key={isExpanded ? 'fold' : 'unfold'}
            initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {isExpanded ? <FoldVertical size={22} /> : <UnfoldVertical size={22} />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Animated Text */}
      <div className="relative h-6 w-[100px] overflow-hidden text-left">
        <AnimatePresence>
          <motion.span
            key={isExpanded ? 'collapse' : 'expand'}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {isExpanded ? ' اخفاء الكل' : 'عرض الكل'}
          </motion.span>
        </AnimatePresence>
      </div>
    </motion.button>
  );
}