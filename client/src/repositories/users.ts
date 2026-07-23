

// DEPRECATED: AuthProvider is a more mature implementation of auth

// export const initAuth = async () => {
//   const { data: { session } } = await supabase.auth.getSession();
//   if (!session) {
//     return await supabase.auth.signInAnonymously();
//   }
  
//   return session;
// };