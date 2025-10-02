// src/components/CategoryGrid.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, GripVertical, PlusCircle, Trash2, type LucideIcon } from 'lucide-react';
import TiltCard from './TiltCard';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy, rectSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CategoryModal, SubcategoryModal, ConfirmationModal, CategoryData, SubcategoryData } from './modals/AdminModals';

// --- Types ---
type Subcategory = { id: number; name: string; slug: string; icon: LucideIcon | string; category_id: number; };
type CategorySection = { id: number; name: string; title: string; description: string | null; slug: string; image: string | null; categories: Subcategory[]; };
type CategoryGridProps = { sections: (CategorySection | undefined)[]; isEditMode: boolean; openSections?: { [key: string]: boolean }; onToggleSection?: (title: string) => void; forceReload: () => void; };

// --- Draggable Subcategory Item ---
const SortableSubcategory = ({ category, isEditMode, onDeleteClick }: { category: Subcategory, isEditMode: boolean, onDeleteClick: () => void }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: category.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} {...attributes} className="relative">
      <Link href={isEditMode ? '#' : `/categories/${category.slug}`} className="group bg-[#1B2A41] p-4 rounded-lg text-center text-gray flex flex-col items-center justify-center gap-3 transition-all duration-300 shadow-lg hover:shadow-gold/20 hover:bg-gold hover:text-navy transform hover:-translate-y-1.5 overflow-hidden">
        {isEditMode && <div {...listeners} className="absolute top-1 right-1 p-1 text-gray-500 cursor-grab" style={{ touchAction: 'none' }}><GripVertical size={16} /></div>}
        <div className="relative text-gold transition-colors duration-300 group-hover:text-navy">
            {typeof category.icon !== 'string' && <category.icon size={32} />}
        </div>
        <span className="text-base font-semibold">{category.name}</span>
      </Link>
      {isEditMode && <button onClick={onDeleteClick} className="absolute top-0 left-0 p-1 bg-red-500/80 rounded-full transform -translate-x-1/2 -translate-y-1/2"><Trash2 size={12} className="text-white" /></button>}
    </div>
  );
};

// --- Draggable Category Section ---
const SortableSection = ({ section, isOpen, toggleSection, isEditMode, onSubcategoriesOrderChange, onAddSubClick, onDeleteCatClick, onDeleteSubClick }: { section: CategorySection; isOpen: boolean; toggleSection: (title: string) => void; isEditMode: boolean; onSubcategoriesOrderChange: (categoryId: number, newOrder: Subcategory[]) => void; onAddSubClick: () => void; onDeleteCatClick: () => void; onDeleteSubClick: (sub: Subcategory) => void; }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: section.id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = section.categories.findIndex(c => c.id === active.id);
      const newIndex = section.categories.findIndex(c => c.id === over.id);
      const newOrder = arrayMove(section.categories, oldIndex, newIndex);
      onSubcategoriesOrderChange(section.id, newOrder);
    }
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} className="mb-8">
      <TiltCard>
        <div className="relative group">
          <button onClick={() => !isEditMode && toggleSection(section.title)} disabled={isEditMode} className="w-full relative rounded-lg overflow-hidden shadow-xl" style={{ transformStyle: 'preserve-3d' }}>
            <div className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-110" style={{ transform: 'translateZ(8px)' }}><Image src={section.image || ''} alt={section.title} fill className="object-cover" /></div>
            <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/70 to-navy/50"></div>
            <div className="relative w-full p-6 md:p-8 text-center" style={{ transform: 'translateZ(40px)' }}>
                <h2 className="text-3xl md:text-4xl font-bold text-gold">{section.title}</h2>
                <p className="text-gray/80 text-base md:text-lg mt-2">{section.description}</p>
                {!isEditMode && <div className="absolute top-1/2 -translate-y-1/2 left-6 text-gold p-2 bg-black/20 rounded-full" style={{ transform: 'translateZ(20px)' }}><ChevronDown size={32} className={`transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`} /></div>}
            </div>
          </button>
          {isEditMode && (
            <>
              <div {...listeners} className="absolute top-1/2 -translate-y-1/2 right-6 text-white p-2 bg-black/50 rounded-full cursor-grab" style={{ touchAction: 'none' }}><GripVertical size={32} /></div>
              <button onClick={onDeleteCatClick} className="absolute top-0 right-0 p-2 bg-red-500/80 rounded-full transform translate-x-1/2 -translate-y-1/2"><Trash2 size={16} className="text-white" /></button>
            </>
          )}
        </div>
      </TiltCard>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={section.categories.map(c => c.id)} strategy={rectSortingStrategy}>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6 pt-6">
                  {section.categories.map((category) => <SortableSubcategory key={category.id} category={category} isEditMode={isEditMode} onDeleteClick={() => onDeleteSubClick(category)} />)}
                  {isEditMode && <button onClick={onAddSubClick} className="group bg-[#1B2A41]/50 border-2 border-dashed border-gray-600 p-4 rounded-lg text-center text-gray-500 flex flex-col items-center justify-center gap-3 transition-all duration-300 hover:border-gold hover:text-gold"><PlusCircle size={32} /><span className="text-base font-semibold">Add New</span></button>}
                </div>
              </SortableContext>
            </DndContext>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Main CategoryGrid Component ---
export default function CategoryGrid(props: CategoryGridProps) {
  const { sections: initialSections, isEditMode, openSections, onToggleSection, forceReload } = props;
  const [sections, setSections] = useState<CategorySection[]>([]);
// Define a strict type for the modal state to replace 'any'
type ModalState = 
  | { type: 'add-cat'; data?: undefined }
  | { type: 'add-sub'; data: { categoryId: number } }
  | { type: 'delete-cat'; data: CategorySection }
  | { type: 'delete-sub'; data: Subcategory }
  | { type: null; data?: undefined };

const [modalState, setModalState] = useState<ModalState>({ type: null });
  useEffect(() => {
    setSections(initialSections.filter((s): s is CategorySection => !!s));
  }, [initialSections]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 10 } }));

  // --- API Handlers ---
  const handleSaveCategory = async (data: CategoryData) => {
    const method = data.id ? 'PUT' : 'POST';
    await fetch('/api/categories', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    setModalState({ type: null });
    forceReload();
  };

  const handleSaveSubcategory = async (data: SubcategoryData) => {
    const method = data.id ? 'PUT' : 'POST';
    await fetch('/api/subcategories', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    setModalState({ type: null });
    forceReload();
  };
  
  const handleDelete = async () => {
if (!modalState.data || !('id' in modalState.data)) return;
    const { type, data } = modalState;
    const table = type === 'delete-cat' ? 'categories' : 'subcategories';
    
    await fetch(`/api/${table}`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: data.id }) });
    
    setModalState({ type: null });
    forceReload();
  };

  const handleSubcategoriesOrderChange = (categoryId: number, newOrder: Subcategory[]) => {
    setSections(prevSections => prevSections.map(section => section.id === categoryId ? { ...section, categories: newOrder } : section));
    fetch('/api/reorder', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ table: 'subcategories', items: newOrder }) });
  };
  
  function handleSectionsDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = sections.findIndex(s => s.id === active.id);
      const newIndex = sections.findIndex(s => s.id === over.id);
      const newOrder = arrayMove(sections, oldIndex, newIndex);
      setSections(newOrder);
      fetch('/api/reorder', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ table: 'categories', items: newOrder }) });
    }
  }

  return (
    <section className="bg-navy py-12 md:py-16">
      <AnimatePresence>
        {modalState.type === 'add-cat' && <CategoryModal isOpen={true} onClose={() => setModalState({ type: null })} onSave={handleSaveCategory} />}
        {modalState.type === 'add-sub' && <SubcategoryModal isOpen={true} onClose={() => setModalState({ type: null })} onSave={handleSaveSubcategory} categoryId={modalState.data.categoryId} />}
        {(modalState.type === 'delete-cat' || modalState.type === 'delete-sub') && <ConfirmationModal isOpen={true} onClose={() => setModalState({ type: null })} onConfirm={handleDelete} itemName={modalState.data.name} />}
      </AnimatePresence>

      <div className="container mx-auto px-4">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleSectionsDragEnd}>
          <SortableContext items={sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
            {sections.map((section) => (
              <SortableSection 
                  key={section.id} 
                  section={section} 
                  isOpen={openSections ? openSections[section.title] : true} 
                  toggleSection={onToggleSection || (() => {})} 
                  isEditMode={isEditMode}
                  onSubcategoriesOrderChange={handleSubcategoriesOrderChange}
                  onAddSubClick={() => setModalState({ type: 'add-sub', data: { categoryId: section.id }})}
                  onDeleteCatClick={() => setModalState({ type: 'delete-cat', data: section })}
                  onDeleteSubClick={(sub) => setModalState({ type: 'delete-sub', data: sub })}
              />
            ))}
          </SortableContext>
        </DndContext>
        {isEditMode && <button onClick={() => setModalState({ type: 'add-cat' })} className="w-full mt-8 group bg-[#1B2A41]/50 border-2 border-dashed border-gray-600 p-8 rounded-lg text-center text-gray-500 flex flex-col items-center justify-center gap-3 transition-all duration-300 hover:border-gold hover:text-gold"><PlusCircle size={48} /><span className="text-xl font-semibold">Add New Category</span></button>}
      </div>
    </section>
  );
}