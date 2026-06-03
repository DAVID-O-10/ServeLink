import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && key);

if (import.meta.env.DEV) {
  console.log('Supabase config:', { isSupabaseConfigured, url, hasKey: Boolean(key) });
}

export const supabase = isSupabaseConfigured
  ? createClient(url, key)
  : null;
