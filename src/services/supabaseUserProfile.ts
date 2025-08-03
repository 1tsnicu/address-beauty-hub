import { supabase } from '@/lib/supabaseClient';

export const insertUserProfile = async (userProfile: {
  id: string;
  name: string;
  email: string;
  phone: string;
  birthdate: string;
  experience: 'beginner' | 'experienced' | 'trainer';
  instagram?: string;
  country: string;
  city: string;
  village?: string;
  address: string;
}) => {
  return await supabase.from('users').insert([userProfile]);
};

export const getUserProfile = async (id?: string, email?: string) => {
  let query = supabase.from('users').select('*');
  if (id) {
    query = query.eq('id', id);
  }
  if (email) {
    query = query.eq('email', email);
  }
  const { data, error } = await query;
  return { data, error };
};
