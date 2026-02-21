import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://vqdntgkbdhtkpgyjtprq.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_S2I7a515QoYehgA2sxSUsg_JGx4_Zy-';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);