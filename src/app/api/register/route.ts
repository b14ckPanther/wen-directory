// src/app/api/register/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    const { name, email, phone, businessName, businessType } = await request.json();

    // --- فحص إذا معبي كل إشي ---
    if (!name || !email || !businessName) {
      return NextResponse.json({ message: 'يا معلم، لازم تعبي اسمك والإيميل واسم المصلحة.' }, { status: 400 });
    }

    // --- فحص إذا الطلب مكرر ---
    // 1. بفحص إذا في طلب بنفس الإسم أو الإيميل وبعده بستنى موافقة
    const { data: existingRequest, error: requestError } = await supabaseAdmin
      .from('registration_requests')
      .select('id')
      .or(`business_name.eq.${businessName},email.eq.${email}`)
      .eq('status', 'pending')
      .maybeSingle();

    if (requestError) throw requestError;
    if (existingRequest) {
      return NextResponse.json({ message: 'شكله هاد الإيميل أو اسم المصلحة مسجل عنا وبستنى الموافقة.' }, { status: 409 }); // 409 Conflict
    }

    // 2. بفحص إذا المصلحة موجودة أصلاً بالجدول الرئيسي
    const { data: existingBusiness, error: businessCheckError } = await supabaseAdmin
      .from('businesses')
      .select('id')
      .eq('name', businessName)
      .maybeSingle();

    if (businessCheckError) throw businessCheckError;
    if (existingBusiness) {
      return NextResponse.json({ message: 'هاي المصلحة مسجلة عنا من قبل، فش حاجة تسجلها كمان مرة.' }, { status: 409 });
    }
    // --- خلصنا فحص ---


    const { data, error } = await supabaseAdmin
      .from('registration_requests')
      .insert({
        name,
        email,
        phone,
        business_name: businessName,
        business_type: businessType,
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ message: 'وصل طلبك! رح نحكي معك скоро.', data }, { status: 201 });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    console.error('Registration API Error:', errorMessage);
    return NextResponse.json({ message: 'صار في غلط واحنا بنشتغل على طلبك، جرب كمان شوي.' , error: errorMessage }, { status: 500 });
  }
}