import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://ccqeocxanevjdivnlaoo.supabase.co';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjcWVvY3hhbmV2amRpdm5sYW9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyNjUzNDcsImV4cCI6MjA4OTg0MTM0N30.mycbp5YkeiOmGL2uP8dPPs5cKRtDd7D558EuyqQuyZ4';

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    storage: typeof window !== 'undefined' ? localStorage : undefined,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  global: {
    headers: {
      'x-client-info': 'farm2home-app'
    }
  }
});
