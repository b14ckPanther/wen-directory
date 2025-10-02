// src/app/api/reorder/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const getSupabaseAdmin = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// POST: Update the order of items (categories or subcategories)
export async function POST(request: Request) {
  const { items, table } = await request.json();
  const supabase = getSupabaseAdmin();

  if (!items || !Array.isArray(items) || (table !== 'categories' && table !== 'subcategories')) {
    return NextResponse.json({ message: 'Invalid payload.' }, { status: 400 });
  }

  try {
    const updates = items.map((item, index) =>
      supabase.from(table).update({ position: index }).eq('id', item.id)
    );

    const results = await Promise.all(updates);
    
    // Check for errors in any of the update promises
    for (const result of results) {
      if (result.error) {
        throw result.error;
      }
    }

    return NextResponse.json({ message: `${table} reordered successfully!` }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return NextResponse.json({ message: `Failed to reorder ${table}.`, error: errorMessage }, { status: 500 });
  }
}