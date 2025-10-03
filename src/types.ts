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


// --- Category and Subcategory Types ---
export type Subcategory = {
  id: number;
  name: string;
  slug: string;
  icon: string; // The name of the lucide icon, e.g., "UtensilsCrossed"
  category_id: number;
};

export type CategorySection = {
  id: number;
  name: string;
  title: string;
  slug: string;
  image: string | null;
  description: string | null;
  categories: Subcategory[];
};

// --- Business Features & Services ---
export type ServiceItem = {
    name: string;
    description?: string;
    price?: string;
    icon?: string; // ✅ ADDED: Optional icon name (e.g., "Wifi", "Coffee")
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
  image: string | null;
  logo: string | null;
  description: string | null;
  phone: string | null;
  rating: number;
  distance: string;
  isOpen: boolean;
  category: string;
  subcategory: string;
  owner: string | null;
  status: BusinessStatus;
  subscription: SubscriptionPlan;
  category_id: number | null;
  subcategory_id: number | null;
  instagram: string | null;
  facebook: string | null;
  website: string | null;
  latitude: number | null;
  longitude: number | null;
  services: ServiceItem[] | null;
  amenities: string[] | null;
  gallery: string[] | null;
  video_url: string | null;
};

// Specific type for Restaurants
export type Restaurant = BusinessBase & {
  menu: MenuItem[] | null; 
  cuisine?: string;
  priceRange?: string;
};

// Specific type for Clinics or other non-restaurant businesses
export type Clinic = BusinessBase & {
  specialty: string;
};

// A single, unified Business type that can be a Restaurant or a Clinic
export type Business = Restaurant | Clinic;