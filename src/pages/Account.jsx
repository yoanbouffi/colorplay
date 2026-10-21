import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Account() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [signingOut, setSigningOut] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data?.user) { navigate('/login'); return }
      setUser(data.user)
      const { data: prof } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single()
      setProfile(prof)
      setLoading(false)
    })
  }, [navigate])

  const handleSignOut = async () => {
    setSigningOut(true)
    await supabase.auth.signOut()
    navigate('/')
  }

  if (loading) return (
    <div className="page-wrapper min-h-screen flex items-center justify-center">
      <div className="text-ink-secondary text-sm">Chargement…</div>
    </div>
  )

  const planLabels = { starter: 'Starter', pro: 'Pro', family: 'Famille' }
  const planColors = { starter: '#5B8DEF', pro: '#8B5CF6', family: '#EC4899' }
  const planColor = planColors[profile?.plan ?? 'starter']

  return (
    <div className="page-wrapper min-h-screen pt-24 pb-20 px-4">
      <div className="bg-blob" style={{ top: '60px', right: '-80px', width: '400px', height: '400px', background: 'radial-gradient(circle,rgba(139,92,246,0.1) 0%,transparent 70%)' }} />
      <div className="bg-dots" />

      <div className="relative z-10 max-w-xl mx-auto">
        {/* Avatar + info */}
        <div className="flex items-center gap-5 mb-8">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black text-white flex-shrink-0"
            style={{ background: 'linear-gradient(135deg,#5B8DEF,#EC4899)' }}
          >
            {user?.email?.[0]?.toUpperCase() ?? '?'}
          </div>
          <div>
            <h1 className="text-xl font-black text-ink-primary">{user?.email}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span
                className="text-xs font-bold px-2.5 py-0.5 rounded-full"
                style={{ background: `${planColor}22`, color: planColor, border: `1px solid ${planColor}44` }}
              >
                Plan {planLabels[profile?.plan ?? 'starter']}
              </span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="surface-card p-5 text-center">
            <div className="text-3xl font-black mb-1" style={{ color: '#8B5CF6' }}>
              {profile?.credits ?? 0}
            </div>
            <div className="text-xs" style={{ color: 'rgba(240,240,255,0.4)' }}>Crédits disponibles</div>
          </div>
          <div className="surface-card p-5 text-center">
            <div className="text-3xl font-black mb-1" style={{ color: '#5B8DEF' }}>
              {profile?.total_generated ?? 0}
            </div>
            <div className="text-xs" style={{ color: 'rgba(240,240,255,0.4)' }}>Coloriages générés</div>
          </div>
        </div>

        {/* Plan card */}
        <div className="surface-card p-6 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-ink-primary mb-0.5">Ton plan actuel</div>
              <div className="text-xs" style={{ color: 'rgba(240,240,255,0.4)' }}>Plan {planLabels[profile?.plan ?? 'starter']}</div>
            </div>
            <Link
              to="/pricing"
              className="text-sm font-bold px-4 py-2 rounded-xl transition-all"
              style={{
                background: 'rgba(139,92,246,0.15)',
                border: '1px solid rgba(139,92,246,0.3)',
                color: '#A78BFA',
              }}
            >
              Changer
            </Link>
          </div>
        </div>

        {/* History shortcut */}
        <Link to="/history" className="surface-card p-6 mb-4 flex items-center justify-between group hover:border-white/15 transition-colors block">
          <div>
            <div className="text-sm font-semibold text-ink-primary mb-0.5">Mes coloriages</div>
            <div className="text-xs" style={{ color: 'rgba(240,240,255,0.4)' }}>Voir l'historique complet</div>
          </div>
          <span style={{ color: 'rgba(240,240,255,0.3)' }}>→</span>
        </Link>

        {/* Sign out */}
        <button
          onClick={handleSignOut}
          className="w-full py-3.5 text-sm font-semibold rounded-xl transition-all duration-200"
          style={{
            border: '1px solid rgba(249,112,102,0.2)',
            color: 'rgba(249,112,102,0.7)',
            background: 'transparent',
          }}
          disabled={signingOut}
        >
          {signingOut ? 'Déconnexion…' : 'Se déconnecter'}
        </button>
      </div>
    </div>
  )
}
