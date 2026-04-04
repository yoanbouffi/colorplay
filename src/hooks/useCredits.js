import { useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useCredits(userId) {
  const [credits, setCredits] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchCredits = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('credits_remaining, plan, credits_reset_date')
        .eq('id', userId)
        .single()

      if (!error) setCredits(data)
    } catch (err) {
      console.error('Error fetching credits:', err)
    } finally {
      setLoading(false)
    }
  }, [userId])

  const decrementCredit = async (currentCredits) => {
    if (!userId || currentCredits <= 0) return false

    const { error } = await supabase
      .from('profiles')
      .update({ credits_remaining: currentCredits - 1 })
      .eq('id', userId)

    if (!error) {
      setCredits(prev => prev ? { ...prev, credits_remaining: prev.credits_remaining - 1 } : null)
      return true
    }
    return false
  }

  const refundCredit = async (currentCredits) => {
    if (!userId) return
    await supabase
      .from('profiles')
      .update({ credits_remaining: currentCredits })
      .eq('id', userId)
  }

  return { credits, loading, fetchCredits, decrementCredit, refundCredit }
}
