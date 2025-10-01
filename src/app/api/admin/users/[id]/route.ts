// src/app/api/admin/users/[id]/route.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { NextResponse, NextRequest } from 'next/server';

// Helper function for admin check
async function checkAdmin(request: NextRequest, supabaseAdmin: SupabaseClient) {
  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.split('Bearer ')[1];
  if (!token) return { error: { message: 'Auth token required' }, status: 401 };
  
  const { data: { user } } = await supabaseAdmin.auth.getUser(token);
  if (!user) return { error: { message: 'Invalid token' }, status: 401 };

  const { data: profile } = await supabaseAdmin.from('profiles').select('role').eq('id', user.id).single();
  if (!profile || profile.role !== 'admin') {
    return { error: { message: 'Forbidden: Admins only' }, status: 403 };
  }
  return { user };
}


// --- PUT (Update) Function ---
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const userId = params.id;

  const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const { error: adminError, status } = await checkAdmin(request, supabaseAdmin);
  if (adminError) return NextResponse.json(adminError, { status });
  
  try {
    const { username, password, business_id, subscription } = await request.json();

    if (password) {
      const { error: authUpdateError } = await supabaseAdmin.auth.admin.updateUserById(userId, { password });
      if (authUpdateError) throw authUpdateError;
    }

    const { data: oldProfile } = await supabaseAdmin.from('profiles').select('business_id').eq('id', userId).single();
    const { error: profileError } = await supabaseAdmin.from('profiles').update({ username, business_id }).eq('id', userId);
    if (profileError) throw profileError;

    await supabaseAdmin.from('businesses').update({ owner: username, subscription }).eq('id', business_id);
    if (oldProfile && oldProfile.business_id && oldProfile.business_id !== business_id) {
        await supabaseAdmin.from('businesses').update({ owner: null, subscription: null }).eq('id', oldProfile.business_id);
    }
    
    return NextResponse.json({ message: 'User updated successfully' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred.';
    return NextResponse.json({ message }, { status: 500 });
  }
}

// --- DELETE Function ---
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const userId = params.id;

  const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const { error: adminError, status } = await checkAdmin(request, supabaseAdmin);
  if (adminError) return NextResponse.json(adminError, { status });

  try {
    const { data: profile } = await supabaseAdmin.from('profiles').select('business_id').eq('id', userId).single();
    
    if (profile && profile.business_id) {
      const { error: businessUpdateError } = await supabaseAdmin
        .from('businesses')
        .update({ owner: null, subscription: null })
        .eq('id', profile.business_id);
      if (businessUpdateError) throw businessUpdateError;
    }
    
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (deleteError) throw deleteError;

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred.';
    return NextResponse.json({ message }, { status: 500 });
  }
}