// A single, reusable type for menu items
export type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
};

// A base type with common properties for all businesses
type BusinessBase = {
  id: number;
  name: string;
  image: string;
  rating: number;
  distance: string;
  isOpen: boolean;
};

// Specific type for Restaurants
export type Restaurant = BusinessBase & {
  description: string;
  logo: string;
  phone: string;
  menu: MenuItem[];
  cuisine?: string;
  priceRange?: string; // FIX: Added the missing property here
};

// Specific type for Clinics
export type Clinic = BusinessBase & {
  specialty: string;
};

// A single, unified Business type that can be a Restaurant or a Clinic
export type Business = Restaurant | Clinic;