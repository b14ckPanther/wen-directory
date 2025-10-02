// src/components/EditModeToggle.tsx
'use client';

import { Edit, X } from 'lucide-react';

type EditModeToggleProps = {
  isEditMode: boolean;
  setIsEditMode: (isEditMode: boolean) => void;
};

export default function EditModeToggle({ isEditMode, setIsEditMode }: EditModeToggleProps) {
  return (
    <button
      onClick={() => setIsEditMode(!isEditMode)}
      className="fixed bottom-5 left-5 z-50 bg-gold text-navy p-4 rounded-full shadow-lg hover:scale-105 transition-transform"
      aria-label={isEditMode ? 'Exit Edit Mode' : 'Enter Edit Mode'}
    >
      {isEditMode ? <X size={24} /> : <Edit size={24} />}
    </button>
  );
}