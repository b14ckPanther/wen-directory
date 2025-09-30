// src/app/api/businesses/route.ts

import { NextResponse } from 'next/server';
import type { Business } from '@/types'; 
// Import the initialized Supabase client
import { supabase } from '@/lib/supabase';

// Handles GET requests to /api/businesses
export async function GET() {
  const { data: businesses, error } = await supabase
    .from('businesses')
    .select('*');

  if (error) {
    console.error('Supabase GET Error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch businesses from Supabase.', error: error.message }, 
      { status: 500 }
    );
  }

  return NextResponse.json(businesses as Business[]);
}

// Handles POST requests to /api/businesses (for adding a new business)
export async function POST(request: Request) {
  try {
    const newBusiness = await request.json();

    // The Payload structure explicitly sets values, ensuring the DB receives
    // data for fields that don't have a value from the front-end form.
    const payload = {
        name: newBusiness.name,
        category: newBusiness.mainCategory,
        owner: newBusiness.owner,
        subscription: newBusiness.subscription,
        image: newBusiness.image,
        logo: newBusiness.logo,
        
        // Map subcategory to the relevant columns
        cuisine: newBusiness.subcategory, 
        specialty: newBusiness.subcategory,
        
        // Explicitly set safe defaults for fields not provided by the form
        rating: 0, 
        distance: '0km', 
        is_open: true, 
        description: '', // Text fields require a value, even if empty string
        phone: '', 
        menu: null, // JSONB field
        price_range: newBusiness.subscription === 'أساسي' ? '$' : '$$$',
    };
    
    if (!payload.name) {
         return NextResponse.json({ message: 'Business name is required.' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('businesses')
      .insert([payload])
      .select(); 

    if (error) {
      console.error('Supabase POST Error:', error);
      // Return the error message from Supabase to the frontend for debugging
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