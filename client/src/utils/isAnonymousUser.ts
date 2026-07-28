import { queryClient } from "@/lib/queryClient"
import type { User } from "@supabase/supabase-js"

export function isAnonymousUser(): boolean {
  const user = queryClient.getQueryData<User>(['current-user'])
  return !!user?.is_anonymous
}