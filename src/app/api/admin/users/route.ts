// src/app/api/admin/users/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  // Create an admin client with the service role key
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.split('Bearer ')[1];

  if (!token) {
    return NextResponse.json({ message: 'Authentication token required.' }, { status: 401 });
  }

  const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);

  if (userError || !user) {
    return NextResponse.json({ message: 'Invalid token or user not found.' }, { status: 401 });
  }

  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profileError || !profile || profile.role !== 'admin') {
    return NextResponse.json({ message: 'Forbidden: Admins only.' }, { status: 403 });
  }

  // --- Proceed to fetch all data ---
  const { data: profilesData, error: profilesFetchError } = await supabaseAdmin
    .from('profiles')
    .select('id, username, role, business_id, business:businesses ( name )');
  
  const { data: authUsersData, error: authUsersError } = await supabaseAdmin.auth.admin.listUsers();
  
  // ✅ FIX: Select 'owner' instead of 'owner_id'
  const { data: businessData, error: businessError } = await supabaseAdmin
    .from('businesses')
    .select('id, name, owner');

  if (profilesFetchError || authUsersError || businessError) {
      console.error("Error fetching data:", profilesFetchError || authUsersError || businessError);
      return NextResponse.json({ message: 'Failed to fetch initial data.', error: profilesFetchError || authUsersError || businessError }, { status: 500 });
  }
  
  if (!authUsersData?.users || !profilesData) {
      return NextResponse.json({ message: 'Could not retrieve user and profile data.' }, { status: 500 });
  }

  const combinedUsers = authUsersData.users.map(authUser => {
    const userProfile = profilesData.find(p => p.id === authUser.id);
    let businessName: string | null = null;
    
    if (userProfile?.business) {
      const biz = userProfile.business as { name: string } | { name: string }[];
      businessName = Array.isArray(biz) ? biz[0]?.name : biz.name;
    }

    return {
      id: authUser.id,
      email: authUser.email || 'N/A',
      username: userProfile?.username || 'N/A',
      role: userProfile?.role || 'user',
      business_id: userProfile?.business_id || null,
      business_name: businessName,
    };
  });

  return NextResponse.json({ users: combinedUsers, businesses: businessData || [] });
}