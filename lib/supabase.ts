import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rabfdoxbgpgwobvkqsht.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_m6HLWEs7NuVi9W_SAcToDA_stCtOoVp';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);