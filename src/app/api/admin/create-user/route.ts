import { createClient } from '@supabase/supabase-js';
import { NextResponse, NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  // 1. Create an admin client with the service role key to perform protected operations
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // 2. Extract the authorization token from the request headers
  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.split('Bearer ')[1];

  if (!token) {
    return NextResponse.json({ message: 'Authentication token required.' }, { status: 401 });
  }

  // 3. Verify the token to get the user making the request
  const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);

  if (userError || !user) {
    return NextResponse.json({ message: 'Invalid token or user not found.' }, { status: 401 });
  }

  // 4. Check if the authenticated user has an 'admin' role in the 'profiles' table
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || profile.role !== 'admin') {
    return NextResponse.json({ message: 'Forbidden: Admins only.' }, { status: 403 });
  }

  // 5. If the user is a confirmed admin, proceed to process the request body
  const { email, password, username, business_id, subscription } = await request.json();

  if (!email || !password || !username || !business_id) {
    return NextResponse.json({ message: 'Email, password, username, and business ID are required.' }, { status: 400 });
  }

  // 6. Create the new user in the Supabase authentication system
  const { data: newUser, error: creationError } = await supabaseAdmin.auth.admin.createUser({
    email: email,
    password: password,
    email_confirm: true, // Auto-confirm the email since an admin is creating it
  });

  if (creationError) {
    console.error('Supabase user creation error:', creationError);
    return NextResponse.json({ message: creationError.message }, { status: 500 });
  }
  
  if (!newUser || !newUser.user) {
      return NextResponse.json({ message: 'Failed to create user.' }, { status: 500 });
  }

  // 7. If user creation is successful, create their corresponding profile
  const { error: profileError } = await supabaseAdmin.from('profiles').insert({
    id: newUser.user.id,
    username: username,
    role: 'owner', // All users created here are 'owners'
    business_id: business_id,
  });

  if (profileError) {
    console.error('Supabase profile creation error:', profileError);
    // If profile creation fails, delete the auth user to prevent orphaned accounts
    await supabaseAdmin.auth.admin.deleteUser(newUser.user.id);
    return NextResponse.json({ message: profileError.message }, { status: 500 });
  }
  
  // 8. Update the associated business with the new owner's ID and subscription plan
  if (business_id) {
    const { error: businessUpdateError } = await supabaseAdmin
        .from('businesses')
        .update({ owner_id: newUser.user.id, subscription: subscription })
        .eq('id', business_id);

    if (businessUpdateError) {
        // Log the error but don't block the response, as the user is already created
        console.error('Error updating business subscription:', businessUpdateError);
    }
  }

  return NextResponse.json({ message: 'User created successfully', user: newUser.user }, { status: 201 });
}

