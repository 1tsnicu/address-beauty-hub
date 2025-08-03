declare global {
  interface Window {
    supabase: any;
  }
}
import { createClient } from '@supabase/supabase-js';

// Înlocuiește cu cheile tale reale din Supabase Project Settings
const supabaseUrl = 'https://gijwzxyjmthwgxfrdfzr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdpand6eHlqbXRod2d4ZnJkZnpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2NTQwNDksImV4cCI6MjA2ODIzMDA0OX0.lXgJfeO0F6EoAMQXfByVY8MaMq6xYKaADKiA4YbXOFE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

if (typeof window !== 'undefined') {
  window.supabase = supabase;
}
