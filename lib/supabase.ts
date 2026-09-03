import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rabfdoxbgpgwobvkqsht.supabase.co';
const supabaseAnonKey = 'YOUR_PUBLISHABLE_ANON_KEY_HERE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);