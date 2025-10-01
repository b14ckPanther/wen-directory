// src/app/api/categories/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Function to create an admin client
const getSupabaseAdmin = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// POST: Create a new category
export async function POST(request: Request) {
  const newCategory = await request.json();
  const supabase = getSupabaseAdmin();
  
  const { data, error } = await supabase.from('categories').insert(newCategory).select().single();
  
  if (error) {
    return NextResponse.json({ message: 'ما قدرنا نزيد القسم', error: error.message }, { status: 500 });
  }
  return NextResponse.json({ message: 'القسم انزاد بنجاح!', data }, { status: 201 });
}

// PUT: Update an existing category
export async function PUT(request: Request) {
  const { id, ...updatedCategory } = await request.json();
  const supabase = getSupabaseAdmin();
  
  const { data, error } = await supabase.from('categories').update(updatedCategory).eq('id', id).select().single();
  
  if (error) {
    return NextResponse.json({ message: 'ما قدرنا نعدّل القسم', error: error.message }, { status: 500 });
  }
  return NextResponse.json({ message: 'تعدّل القسم بنجاح!', data }, { status: 200 });
}

// DELETE: Remove a category
export async function DELETE(request: Request) {
  const { id } = await request.json();
  const supabase = getSupabaseAdmin();

  // Check if there are any subcategories linked to this category
  const { data: subcategories, error: checkError } = await supabase.from('subcategories').select('id').eq('category_id', id);

  if (checkError) {
    return NextResponse.json({ message: 'صار في غلط واحنا بنفحص', error: checkError.message }, { status: 500 });
  }

  if (subcategories && subcategories.length > 0) {
    return NextResponse.json({ message: 'ما بنقدر نمحى هاد القسم لأنه مربوط بفئات فرعية. امحى الفئات الفرعية بالأول.' }, { status: 400 });
  }

  // If no subcategories, proceed with deletion
  const { error } = await supabase.from('categories').delete().eq('id', id);

  if (error) {
    return NextResponse.json({ message: 'ما قدرنا نمحى القسم', error: error.message }, { status: 500 });
  }
  return NextResponse.json({ message: 'انمحى القسم بنجاح!' }, { status: 200 });
}