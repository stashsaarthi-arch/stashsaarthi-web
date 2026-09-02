import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env["VITE_SUPABASE_URL"];
// Use PUBLISHABLE_KEY as fallback since that's what the existing project uses
const supabaseAnonKey = import.meta.env["VITE_SUPABASE_ANON_KEY"] || import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"];

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables! Check your .env file.');
}

export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);
