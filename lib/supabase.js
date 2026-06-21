import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ebwqunnqjwofqtqwbkkq.supabase.co';
const supabaseAnonKey = 'sb_publishable_QGW7-ptfJFGcKxF12vvs8w_SCNQa0G6';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
