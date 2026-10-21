import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'

export function useAuth() {
  // Initialise immédiatement depuis la session en cache — évite le flash de spinner
  const [user, setUser] = useState(() => {
    try {
      // Supabase stocke la session dans localStorage — on peut la lire de façon synchrone
      const stored = localStorage.getItem('sb-rtrkshbrvyrlrdpkwosv-auth-token')
      if (stored) {
        const parsed = JSON.parse(stored)
        return parsed?.user ?? null
      }
    } catch {}
    return null
  })
  const [profile, setProfile] = useState(null)
  // Si on a déjà un user en cache, pas besoin de spinner d'attente
  const [loading, setLoading] = useState(() => {
    try {
      const stored = localStorage.getItem('sb-rtrkshbrvyrlrdpkwosv-auth-token')
      return !stored
    } catch {}
    return true
  })

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      if (!error) setProfile(data)
    } catch (err) {
      console.error('Error fetching profile:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Vérifie la session réelle en arrière-plan (refresh token si besoin)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        await fetchProfile(session.user.id)
      } else {
        setProfile(null)
        setLoading(false)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const refreshProfile = async () => {
    if (user) await fetchProfile(user.id)
  }

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    return { data, error }
  }

  const signUp = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({ email, password })
    return { data, error }
  }

  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/generator` },
    })
    return { data, error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  return { user, profile, loading, signIn, signUp, signInWithGoogle, signOut, refreshProfile }
}
