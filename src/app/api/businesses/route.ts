// src/app/api/businesses/route.ts

import { NextResponse } from 'next/server';
import type { Business } from '@/types';
import { createClient } from '@supabase/supabase-js';

// Create an admin client once to use for both GET and POST
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Handles GET requests to /api/businesses
export async function GET() {
  // Use the admin client to fetch businesses and join related category data
  const { data: businesses, error } = await supabaseAdmin
    .from('businesses')
    .select(`
      *,
      category: categories (name),
      subcategory: subcategories (name)
    `);

  if (error) {
    console.error('Supabase GET Error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch businesses from Supabase.', error: error.message },
      { status: 500 }
    );
  }
  
  // Flatten the category/subcategory objects for easier use on the frontend
  const formattedBusinesses = businesses.map(b => ({
    ...b,
    category: b.category?.name || 'N/A',
    subcategory: b.subcategory?.name || 'N/A'
  }));


  return NextResponse.json(formattedBusinesses as Business[]);
}

// POST function remains the same
export async function POST(request: Request) {
  try {
    const newBusiness = await request.json();

    const payload = {
        name: newBusiness.name,
        owner: newBusiness.owner,
        subscription: newBusiness.subscription,
        image: newBusiness.image,
        logo: newBusiness.logo,
        category_id: newBusiness.category_id,
        subcategory_id: newBusiness.subcategory_id,
        rating: 0,
        distance: '0km',
        is_open: true,
        description: '',
        phone: '',
        menu: null,
        price_range: newBusiness.subscription === 'أساسي' ? '$' : '$$$',
    };
    
     if (!payload.name) {
         return NextResponse.json({ message: 'Business name is required.' }, { status: 400 });
    }
     if (!payload.category_id || !payload.subcategory_id) {
         return NextResponse.json({ message: 'Category and Subcategory are required.' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('businesses')
      .insert([payload])
      .select();

    if (error) {
      console.error('Supabase POST Error:', error);
      return NextResponse.json(
        { message: 'Error adding business to Supabase.', error: error.message },
        { status: 500 }
      );
    }

    const insertedBusiness = data[0];

   return NextResponse.json(
      { message: 'Business added successfully', business: insertedBusiness },
      { status: 201 }
    );

  } catch (error) {
    console.error('Request processing error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return NextResponse.json({ message: 'Error processing request body.', error: errorMessage }, { status: 400 });
  }
}