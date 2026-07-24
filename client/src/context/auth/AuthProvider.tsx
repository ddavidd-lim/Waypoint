import { supabase } from '@/services/supabase'
import type { Session } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import { AuthContext } from './authContext'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        const { data, error } = await supabase.auth.signInAnonymously()
        if (!error) setSession(data.session)
      } else {
        setSession(session)
      }
      setLoading(false)
    }

    init()

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session) {
        const { data, error } = await supabase.auth.signInAnonymously()
        if (!error) setSession(data.session)
      } else {
        setSession(session)
      }
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ user: session?.user ?? null, session, loading }}>
      {children}
    </AuthContext.Provider>
  )
}