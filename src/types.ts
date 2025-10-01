// src/types.ts

// --- Shared User & Auth Types ---
export type UserRole = 'admin' | 'owner' | 'user';
export type SubscriptionPlan = 'أساسي' | 'مميز' | 'ذهبي' | null;

export type User = {
  name: string;
  role: UserRole;
  subscription?: SubscriptionPlan;
  businessType?: 'products' | 'services';
};


// --- Shared Business & Product Types ---
export type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
};

// Define the possible statuses for a business
export type BusinessStatus = 'مقبول' | 'قيد المراجعة' | 'مرفوض';

// A base type with common properties for all businesses
type BusinessBase = {
  id: number;
  name: string;
  image: string;
  rating: number;
  distance: string;
  isOpen: boolean;
  // Add the missing properties here
  category: string;
  subcategory: string; // ✅ ADD THIS LINE
  owner: string;
  status: BusinessStatus;
  subscription: SubscriptionPlan;
};

// Specific type for Restaurants
export type Restaurant = BusinessBase & {
  description: string;
  logo: string;
  phone: string;
  menu: MenuItem[];
  cuisine?: string;
  priceRange?: string;
};

// Specific type for Clinics
export type Clinic = BusinessBase & {
  specialty: string;
};

// A single, unified Business type that can be a Restaurant or a Clinic
export type Business = Restaurant | Clinic;