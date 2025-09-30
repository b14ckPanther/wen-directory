import { NextResponse } from 'next/server';
import type { Business, Restaurant, Clinic } from '@/types';

// In a real application, this data would come from a database.
const mockBusinesses: Business[] = [
  // Using the more detailed Restaurant and Clinic types for consistency
  {
    id: 1,
    name: 'مطعم القدس',
    category: 'مطاعم',
    owner: 'أحمد خليل',
    status: 'مقبول',
    subscription: 'مميز',
    description: 'أشهى المأكولات الشرقية التقليدية بأجواء أصيلة.',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1548&auto=format&fit=crop&ixlib.rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    logo: 'https://img.freepik.com/premium-vector/restaurant-logo-design-template_79169-56.jpg',
    rating: 4.5,
    distance: '2.1km',
    phone: '+972501234567',
    isOpen: true,
    cuisine: 'شرقي',
    priceRange: '$$',
    menu: [
      { id: 101, name: 'مشاوي مشكلة', description: 'كباب، شيش طاووق، وريش', price: '95.00', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1' },
      { id: 102, name: 'حمص باللحمة', description: 'حمص طازج مع قطع لحم غنم', price: '40.00', image: 'https://images.unsplash.com/photo-1598214886806-2c88b8509d17' },
    ]
  },
  {
    id: 2,
    name: 'صالون الملكة',
    category: 'جمال',
    owner: 'فاطمة علي',
    status: 'قيد المراجعة',
    subscription: 'أساسي',
    description: 'لأنك تستحقين الأفضل.',
    image: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?q=80&w=1740&auto=format&fit=crop&ixlib.rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    logo: '',
    rating: 4.8,
    distance: '3.5km',
    phone: '+972501234569',
    isOpen: true,
    cuisine: 'تجميل',
    priceRange: '$$$',
    menu: []
  },
  {
    id: 4,
    name: 'عيادة النور',
    category: 'صحة',
    owner: 'سارة إبراهيم',
    status: 'مقبول',
    subscription: 'مميز',
    image: 'https://images.unsplash.com/photo-1629424647321-278c1b353f4e?q=80&w=1740&auto=format&fit=crop&ixlib.rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    rating: 4.9,
    distance: '5.1km',
    specialty: 'أسنان',
    isOpen: true,
  } as Clinic,
];

// Handles GET requests to /api/businesses
export async function GET() {
  // In the future, you would fetch from your database here.
  // For now, we return the mock data.
  return NextResponse.json(mockBusinesses);
}

// Handles POST requests to /api/businesses
export async function POST(request: Request) {
  try {
    const newBusiness = await request.json();

    // Simulate adding the new business to our "database"
    // In a real DB, you'd get a new ID from the database
    const newId = Math.max(...mockBusinesses.map(b => b.id)) + 1;
    const businessToAdd = { ...newBusiness, id: newId, status: 'قيد المراجعة' };
    mockBusinesses.push(businessToAdd as Business); // Add type assertion

    console.log('New business added:', businessToAdd);

    // Return a success response
    return NextResponse.json({ message: 'Business added successfully', business: businessToAdd }, { status: 201 });

  } catch (error) {
    console.error('Failed to add business:', error);
    return NextResponse.json({ message: 'Error adding business' }, { status: 500 });
  }
}