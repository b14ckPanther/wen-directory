// src/app/api/admin/approve-request/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextResponse, NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    const { requestId } = await request.json();

    if (!requestId) {
      return NextResponse.json({ message: 'Request ID is required.' }, { status: 400 });
    }

    // 1. Fetch the original request data
    const { data: requestData, error: fetchError } = await supabaseAdmin
      .from('registration_requests')
      .select('*')
      .eq('id', requestId)
      .single();

    if (fetchError || !requestData) {
      throw new Error('Could not find the registration request.');
    }

    // 2. Create a new business from the request data
    const { error: businessError } = await supabaseAdmin
      .from('businesses')
      .insert({
        name: requestData.business_name,
        phone: requestData.phone,
        owner: requestData.name, // Still useful to have the name for reference
        status: 'مقبول', // Set status to 'Accepted'
        subscription: 'أساسي', // Default to 'Basic'
        // category_id and subcategory_id will need to be set manually by the admin later
      });

    if (businessError) {
      throw new Error(`Failed to create business: ${businessError.message}`);
    }

    // 3. Mark the original request as 'approved'
    const { error: updateError } = await supabaseAdmin
      .from('registration_requests')
      .update({ status: 'approved' })
      .eq('id', requestId);

    if (updateError) {
      // Log the error but don't fail the whole operation since the business was created
      console.error('Failed to update request status:', updateError.message);
    }

    return NextResponse.json({ message: 'Business approved and created successfully!' }, { status: 200 });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}