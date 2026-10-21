import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Success() {
  const { profile, refreshProfile } = useAuth()
  const [searchParams] = useSearchParams()
  const [refreshed, setRefreshed] = useState(false)

  const planId = searchParams.get('plan') || profile?.plan || 'pro'
  const planLabels = { starter: 'Starter', pro: 'Pro', family: 'Famille' }
  const planCredits = { starter: 5, pro: 50, family: 150 }

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (refreshProfile) await refreshProfile()
      setRefreshed(true)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  const credits = profile?.credits_remaining ?? planCredits[planId] ?? 50

  return (
    <div className="page-wrapper min-h-screen flex items-center justify-center px-4">
      <div className="bg-blob" style={{ top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '600px', height: '600px', background: 'radial-gradient(circle,rgba(16,185,129,0.08) 0%,transparent 70%)' }} />
      <div className="bg-dots" />

      <div className="relative z-10 w-full max-w-md text-center">
        {/* Animation */}
        <div className="relative mb-8 inline-block">
          <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto" style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)' }}>
            <span className="text-5xl">🎉</span>
          </div>
        </div>

        <h1 className="text-3xl font-black text-ink-primary mb-2">Paiement réussi !</h1>
        <p className="text-ink-secondary mb-8">Ton plan {planLabels[planId]} est maintenant actif.</p>

        {/* Credits */}
        <div className="surface-card p-6 mb-4 flex items-center justify-between">
          <div className="text-left">
            <p className="text-xs font-semibold mb-0.5" style={{ color: 'rgba(240,240,255,0.4)' }}>Plan activé</p>
            <p className="text-lg font-black text-ink-primary">{planLabels[planId]}</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-semibold mb-0.5" style={{ color: 'rgba(240,240,255,0.4)' }}>Crédits disponibles</p>
            <p className="text-2xl font-black" style={{ color: '#10B981' }}>
              {refreshed ? credits : planCredits[planId]}
            </p>
          </div>
        </div>

        <Link to="/generator" className="btn-primary w-full py-4 text-base flex items-center justify-center gap-2 mb-3">
          ✨ Générer mon premier coloriage
        </Link>
        <Link to="/account" className="text-sm" style={{ color: 'rgba(240,240,255,0.4)' }}>
          Voir mon compte →
        </Link>
      </div>
    </div>
  )
}
