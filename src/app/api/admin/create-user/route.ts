// src/app/api/admin/create-user/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextResponse, NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.split('Bearer ')[1];

  if (!token) {
    return NextResponse.json({ message: 'Authentication token required.' }, { status: 401 });
  }

  const { data: { user: adminUser }, error: userError } = await supabaseAdmin.auth.getUser(token);

  if (userError || !adminUser) {
    return NextResponse.json({ message: 'Invalid token or user not found.' }, { status: 401 });
  }

  const { data: profile } = await supabaseAdmin.from('profiles').select('role').eq('id', adminUser.id).single();

  if (!profile || profile.role !== 'admin') {
    return NextResponse.json({ message: 'Forbidden: Admins only.' }, { status: 403 });
  }

  const { email, password, username, business_id, subscription } = await request.json();

  if (!email || !password || !username || !business_id) {
    return NextResponse.json({ message: 'Email, password, username, and business ID are required.' }, { status: 400 });
  }

  const { data: newUser, error: creationError } = await supabaseAdmin.auth.admin.createUser({
    email: email,
    password: password,
    email_confirm: true,
  });

  if (creationError) {
    console.error('Supabase user creation error:', creationError);
    return NextResponse.json({ message: creationError.message }, { status: 500 });
  }
  
  if (!newUser || !newUser.user) {
      return NextResponse.json({ message: 'Failed to create user.' }, { status: 500 });
  }

  const { error: profileError } = await supabaseAdmin.from('profiles').insert({
    id: newUser.user.id,
    username: username,
    role: 'owner',
    business_id: business_id,
  });

  if (profileError) {
    console.error('Supabase profile creation error:', profileError);
    await supabaseAdmin.auth.admin.deleteUser(newUser.user.id);
    return NextResponse.json({ message: profileError.message }, { status: 500 });
  }
  
  if (business_id) {
    // ✅ FIX: Update the 'owner' text column with the new user's username
    const { error: businessUpdateError } = await supabaseAdmin
        .from('businesses')
        .update({ owner: username, subscription: subscription })
        .eq('id', business_id);

    if (businessUpdateError) {
        console.error('Error updating business owner name:', businessUpdateError);
    }
  }

  return NextResponse.json({ message: 'User created successfully', user: newUser.user }, { status: 201 });
}