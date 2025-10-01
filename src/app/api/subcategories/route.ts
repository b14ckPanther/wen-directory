// src/app/api/subcategories/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const getSupabaseAdmin = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// POST: Create a new subcategory
export async function POST(request: Request) {
  const newSubcategory = await request.json();
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase.from('subcategories').insert(newSubcategory).select().single();
  
  if (error) {
    return NextResponse.json({ message: 'ما قدرنا نزيد الفئة الفرعية', error: error.message }, { status: 500 });
  }
  return NextResponse.json({ message: 'الفئة الفرعية انزادت!', data }, { status: 201 });
}

// PUT: Update an existing subcategory
export async function PUT(request: Request) {
  const { id, ...updatedSubcategory } = await request.json();
  const supabase = getSupabaseAdmin();
  
  const { data, error } = await supabase.from('subcategories').update(updatedSubcategory).eq('id', id).select().single();
  
  if (error) {
    return NextResponse.json({ message: 'ما قدرنا نعدّل الفئة الفرعية', error: error.message }, { status: 500 });
  }
  return NextResponse.json({ message: 'تعدّلت الفئة الفرعية بنجاح!', data }, { status: 200 });
}

// DELETE: Remove a subcategory
export async function DELETE(request: Request) {
  const { id } = await request.json();
  const supabase = getSupabaseAdmin();
  
  const { error } = await supabase.from('subcategories').delete().eq('id', id);
  
  if (error) {
    return NextResponse.json({ message: 'ما قدرنا نمحى الفئة الفرعية', error: error.message }, { status: 500 });
  }
  return NextResponse.json({ message: 'انمحت الفئة الفرعية!' }, { status: 200 });
}