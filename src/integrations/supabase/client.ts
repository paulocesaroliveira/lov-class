import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://zzniaqyoofvnharqqdzu.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6bmlhcXlvb2Z2bmhhcnFxZHp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYyMDYwODgsImV4cCI6MjA1MTc4MjA4OH0.EoA5D3LLCQ3u5R0RwprRYs5oHRI6KAAkd0MK1fFgw2o";

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      storage: localStorage
    }
  }
);