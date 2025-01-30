import { supabase } from '@/lib/supabase';

export const addTweet = async (user_id, content) => {
  const { data, error } = await supabase.from('tweets').insert([
    { user_id, content }
  ]);
  return { data, error };
};
