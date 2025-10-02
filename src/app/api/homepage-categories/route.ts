// src/app/api/homepage-categories/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const getSupabaseAdmin = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET: Fetch the ordered list of homepage category IDs
export async function GET() {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('homepage_categories')
    .select('category_id')
    .order('position', { ascending: true });

  if (error) {
    console.error("Error fetching homepage categories:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Return just an array of the category IDs
  return NextResponse.json(data.map(item => item.category_id));
}

// POST: Overwrite the homepage categories with a new ordered list
export async function POST(request: Request) {
  const supabase = getSupabaseAdmin();
  const categoryIds: number[] = await request.json();

  // Step 1: Delete all existing entries. This is a simple way to handle reordering and removal.
  const { error: deleteError } = await supabase
    .from('homepage_categories')
    .delete()
    .neq('id', -1); // A condition that is always true to delete all rows

  if (deleteError) {
    console.error("Error clearing homepage categories:", deleteError);
    return NextResponse.json({ error: `Failed to clear old categories: ${deleteError.message}` }, { status: 500 });
  }

  // Step 2: Insert the new list of categories with their new positions.
  if (categoryIds.length > 0) {
    const newRows = categoryIds.map((id, index) => ({
      category_id: id,
      position: index,
    }));

    const { error: insertError } = await supabase
      .from('homepage_categories')
      .insert(newRows);

    if (insertError) {
      console.error("Error inserting new homepage categories:", insertError);
      return NextResponse.json({ error: `Failed to insert new categories: ${insertError.message}` }, { status: 500 });
    }
  }

  return NextResponse.json({ message: 'Homepage categories updated successfully.' });
}
