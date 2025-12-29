import { SupabaseClient } from '@supabase/supabase-js';

declare global {
  interface Window {
    supabase: SupabaseClient;
  }
}
import { createClient } from '@supabase/supabase-js';

// Configurare Supabase din variabile de mediu
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://gijwzxyjmthwgxfrdfzr.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdpand6eHlqbXRod2d4ZnJkZnpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2NTQwNDksImV4cCI6MjA2ODIzMDA0OX0.lXgJfeO0F6EoAMQXfByVY8MaMq6xYKaADKiA4YbXOFE';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

if (typeof window !== 'undefined') {
  window.supabase = supabase;
}
