// src/lib/supabase.ts

import { createClient } from '@supabase/supabase-js';

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Check if the environment variables are set
if (!supabaseUrl || !supabaseAnonKey) {
  // NOTE: In a real Next.js environment, this error is typically caught when the code runs
  // in the right context (Node.js/serverless function).
  console.error("Supabase URL and Anon Key must be defined. Falling back to dummy values.");
  // For safety in client-side bundling, you might handle this more gracefully or rely on Next.js to block the exposure.
}

// Initialize the Supabase client
export const supabase = createClient(supabaseUrl!, supabaseAnonKey!); // Using ! to assert non-null as per original code's intent

// Now other files (like your API routes) can import and use it:
// import { supabase } from '@/lib/supabase';