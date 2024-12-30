import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://keqcfrpqctyfxpfoxrkp.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtlcWNmcnBxY3R5ZnhwZm94cmtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU1NjQ3MTYsImV4cCI6MjA1MTE0MDcxNn0.cfhiPshi4gZ1PVFuh6sfr6hroQtM7ithvP-VUtpaQXY";

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  }
);