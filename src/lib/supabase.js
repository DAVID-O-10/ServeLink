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

if (import.meta.env.DEV && isSupabaseConfigured && supabase) {
  supabase
    .from('businesses')
    .select('id')
    .limit(1)
    .then(({ data, error }) => {
      if (error) {
        console.error('Supabase test error:', error);
      } else {
        console.log('Supabase test success:', data);
      }
    })
    .catch((e) => console.error('Supabase test exception:', e));
}
