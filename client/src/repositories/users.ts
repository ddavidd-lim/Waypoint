import { supabase } from "@/services/supabase";

export const initAuth = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return await supabase.auth.signInAnonymously();
  }
  
  return session;
};