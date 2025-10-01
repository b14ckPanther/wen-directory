
import { NextResponse } from 'next/server';
import type { Business } from '@/types';
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

export async function POST(request: Request) {
  try {
    const newBusiness = await request.json();

    const payload = {
        name: newBusiness.name,
        owner: newBusiness.owner,
        subscription: newBusiness.subscription,
        image: newBusiness.image,
        logo: newBusiness.logo,
        category_id: newBusiness.category_id, // Use the new foreign key
        subcategory_id: newBusiness.subcategory_id, // Use the new foreign key
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


    const { data, error } = await supabase
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