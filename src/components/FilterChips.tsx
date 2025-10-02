'use client';

// This component is no longer used on the category page, but we'll keep it for potential use elsewhere.
// I've translated the text to spoken Arabic for consistency.

import { SlidersHorizontal, Star, Zap } from 'lucide-react';
import React from 'react';

type FilterChipsProps = {
  onOpenFilterModal: () => void;
};

const FilterChips: React.FC<FilterChipsProps> = ({ onOpenFilterModal }) => {
  const quickFilters = [
    { label: 'الأعلى تقييماً', icon: Star },
    { label: 'فاتح هلأ', icon: Zap },
    { label: 'شرقي', icon: null },
    { label: 'إيطالي', icon: null },
    { label: 'أمريكي', icon: null },
  ];

  return (
    <div className="py-2">
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        <button
          onClick={onOpenFilterModal}
          className="flex-shrink-0 flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gold bg-gold/10 border border-gold/20 rounded-full hover:bg-gold/20 transition-colors"
        >
          <SlidersHorizontal size={16} />
          <span>كل الفلاتر</span>
        </button>

        {quickFilters.map((filter) => {
          const Icon = filter.icon;
          return (
            <button
              key={filter.label}
              className="flex-shrink-0 flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-200 bg-[#1B2A41] border border-gray-700 rounded-full hover:bg-gray-700 transition-colors"
            >
              {Icon && <Icon size={16} className="text-gold" />}
              <span>{filter.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default FilterChips;
