// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://zzniaqyoofvnharqqdzu.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6bmlhcXlvb2Z2bmhhcnFxZHp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYyMDYwODgsImV4cCI6MjA1MTc4MjA4OH0.EoA5D3LLCQ3u5R0RwprRYs5oHRI6KAAkd0MK1fFgw2o";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);