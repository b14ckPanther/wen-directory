// src/app/api/businesses/route.ts

import { NextResponse, NextRequest } from 'next/server';
import type { Business } from '@/types';
import { createClient } from '@supabase/supabase-js';

// No client initialization here anymore

// Handles GET requests
export async function GET() {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: businesses, error } = await supabaseAdmin
    .from('businesses')
    .select(`*, category: categories (name), subcategory: subcategories (name)`);

  if (error) {
    console.error('Supabase GET Error:', error);
    return NextResponse.json({ message: 'Failed to fetch businesses.', error: error.message }, { status: 500 });
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
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  try {
    const { requestId, ...newBusinessData } = await request.json();

    if (!newBusinessData.name || !newBusinessData.category_id || !newBusinessData.subcategory_id) {
         return NextResponse.json({ message: 'Name, Category and Subcategory are required.' }, { status: 400 });
    }
    
    // Remove owner info from business payload as it's not in the 'businesses' table schema
    delete newBusinessData.owner_name;
    delete newBusinessData.owner_email;

    const { data, error } = await supabaseAdmin
      .from('businesses')
      .insert([newBusinessData])
      .select()
      .single(); // Use single() as we expect one record back

    if (error) {
      console.error('Supabase POST Error:', error);
      return NextResponse.json({ message: 'Error adding business.', error: error.message }, { status: 500 });
    }
    
    // If the business was created successfully AND it came from a request, update the request status
    if (data && requestId) {
        const { error: updateError } = await supabaseAdmin
            .from('registration_requests')
            .update({ status: 'approved' })
            .eq('id', requestId);

        if (updateError) {
            console.error('Error updating registration request status:', updateError);
            // Don't fail the whole request, just log it. The business was still created.
        }
    }

    return NextResponse.json({ message: 'Business added successfully', business: data }, { status: 201 });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return NextResponse.json({ message: 'Error processing request body.', error: errorMessage }, { status: 400 });
  }
}

// Handles PUT requests (Update)
export async function PUT(request: NextRequest) {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  try {
    const { id, ...businessData } = await request.json();

    if (!id) {
      return NextResponse.json({ message: 'Business ID is required for updating.' }, { status: 400 });
    }
    
    // Remove owner info from business payload
    delete businessData.owner_name;
    delete businessData.owner_email;


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

// --- DELETE Function (Updated Logic) ---
export async function DELETE(request: NextRequest) {
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const { id } = await request.json();

    if (!id) {
        return NextResponse.json({ message: 'Business ID is required' }, { status: 400 });
    }

    try {
        const { error: profileUpdateError } = await supabaseAdmin
            .from('profiles')
            .update({ business_id: null })
            .eq('business_id', id);

        if (profileUpdateError) throw profileUpdateError;

        const { error: deleteError } = await supabaseAdmin
            .from('businesses')
            .delete()
            .eq('id', id);

        if (deleteError) throw deleteError;

        return NextResponse.json({ message: 'Business deleted successfully' });

    } catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        console.error('Supabase DELETE Error:', message);
        return NextResponse.json({ message: `Error deleting business: ${message}` }, { status: 500 });
    }
  }