// src/components/modals/ManageHomepageModal.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, GripVertical, Trash2, Save } from 'lucide-react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { CategorySection } from '@/types';

// Sortable Item Component for the drag-and-drop list
const SortableCategoryItem = ({ category, onRemove }: { category: CategorySection, onRemove: () => void }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: category.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center justify-between bg-[#0A1024] p-3 rounded-lg border border-gray-700">
      <div className="flex items-center gap-3">
        <div {...listeners} {...attributes} className="cursor-grab text-gray-500" style={{ touchAction: 'none' }}>
          <GripVertical size={20} />
        </div>
        <span className="text-white">{category.name}</span>
      </div>
      <button onClick={onRemove} className="text-red-400 hover:text-red-300">
        <Trash2 size={18} />
      </button>
    </div>
  );
};

// Main Modal Component
type ManageHomepageModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  allCategories: CategorySection[];
  currentHomepageCategories: CategorySection[];
};

export const ManageHomepageModal: React.FC<ManageHomepageModalProps> = ({ isOpen, onClose, onSave, allCategories, currentHomepageCategories }) => {
  const [selectedCategories, setSelectedCategories] = useState<CategorySection[]>([]);
  const [addableCategoryId, setAddableCategoryId] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  useEffect(() => {
    if (isOpen) {
      setSelectedCategories(currentHomepageCategories);
    }
  }, [isOpen, currentHomepageCategories]);

  const availableToAdd = allCategories.filter(
    (cat) => !selectedCategories.some((selected) => selected.id === cat.id)
  );

  const handleAdd = () => {
    if (addableCategoryId) {
      const categoryToAdd = allCategories.find((cat) => cat.id === Number(addableCategoryId));
      if (categoryToAdd) {
        setSelectedCategories((prev) => [...prev, categoryToAdd]);
        setAddableCategoryId('');
      }
    }
  };

  const handleRemove = (idToRemove: number) => {
    setSelectedCategories((prev) => prev.filter((cat) => cat.id !== idToRemove));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = selectedCategories.findIndex((c) => c.id === active.id);
      const newIndex = selectedCategories.findIndex((c) => c.id === over.id);
      setSelectedCategories(arrayMove(selectedCategories, oldIndex, newIndex));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    const categoryIds = selectedCategories.map(cat => cat.id);
    try {
      const response = await fetch('/api/homepage-categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryIds),
      });
      if (!response.ok) throw new Error('Failed to save.');
      onSave();
    } catch (error) {
      console.error(error);
      alert('Error saving homepage categories.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-navy/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-[#1B2A41] w-full max-w-lg rounded-2xl p-6 border border-gold/20 flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center mb-4 flex-shrink-0">
              <h2 className="text-xl font-bold text-gold">Manage Homepage Categories</h2>
              <button onClick={onClose}><X className="text-gray-400" /></button>
            </div>

            <div className="flex-grow overflow-y-auto pr-2 space-y-2">
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={selectedCategories.map(c => c.id)} strategy={verticalListSortingStrategy}>
                  {selectedCategories.map(cat => (
                    <SortableCategoryItem key={cat.id} category={cat} onRemove={() => handleRemove(cat.id)} />
                  ))}
                </SortableContext>
              </DndContext>
            </div>

            <div className="flex-shrink-0 pt-4 space-y-4">
              <div className="flex gap-2">
                <select value={addableCategoryId} onChange={(e) => setAddableCategoryId(e.target.value)} className="w-full bg-[#0A1024] border border-gray-700 rounded-lg py-2 px-4 text-white">
                  <option value="">-- Add a category --</option>
                  {availableToAdd.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                <button onClick={handleAdd} disabled={!addableCategoryId} className="bg-gold/80 text-navy p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed">
                  <Plus size={24} />
                </button>
              </div>
              <div className="flex justify-end gap-4">
                <button onClick={onClose} className="bg-gray-700 text-white font-bold py-2 px-6 rounded-lg">Cancel</button>
                <button onClick={handleSave} disabled={isSaving} className="bg-gold text-navy font-bold py-2 px-6 rounded-lg flex items-center gap-2 disabled:opacity-50">
                  <Save size={18} /> {isSaving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
