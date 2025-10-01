// src/app/api/businesses/route.ts

import { NextResponse, NextRequest } from 'next/server';
import type { Business } from '@/types';
import { createClient } from '@supabase/supabase-js';

// Create an admin client once to use for all operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Handles GET requests
export async function GET() {
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
  
  const formattedBusinesses = businesses.map(b => ({
    ...b,
    category: b.category?.name || 'N/A',
    subcategory: b.subcategory?.name || 'N/A'
  }));

  return NextResponse.json(formattedBusinesses as Business[]);
}

// Handles POST requests (Create)
export async function POST(request: Request) {
  try {
    const newBusiness = await request.json();

    // ... (validation logic remains the same)
    if (!newBusiness.name || !newBusiness.category_id || !newBusiness.subcategory_id) {
         return NextResponse.json({ message: 'Name, Category and Subcategory are required.' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('businesses')
      .insert([newBusiness])
      .select();

    if (error) {
      console.error('Supabase POST Error:', error);
      return NextResponse.json({ message: 'Error adding business.', error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Business added successfully', business: data[0] }, { status: 201 });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return NextResponse.json({ message: 'Error processing request body.', error: errorMessage }, { status: 400 });
  }
}

// ✅ NEW: Handles PUT requests (Update)
export async function PUT(request: NextRequest) {
  try {
    const { id, ...businessData } = await request.json();

    if (!id) {
      return NextResponse.json({ message: 'Business ID is required for updating.' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('businesses')
      .update(businessData)
      .eq('id', id)
      .select();

    if (error) {
      console.error('Supabase PUT Error:', error);
      return NextResponse.json({ message: 'Error updating business.', error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Business updated successfully', business: data[0] }, { status: 200 });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return NextResponse.json({ message: 'Error processing request.', error: errorMessage }, { status: 400 });
  }
}


// ✅ NEW: Handles DELETE requests
export async function DELETE(request: NextRequest) {
    const { id } = await request.json();

    if (!id) {
        return NextResponse.json({ message: 'Business ID is required' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
        .from('businesses')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Supabase DELETE Error:', error);
        return NextResponse.json({ message: 'Error deleting business', error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Business deleted successfully' });
}