import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Register() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) { setError(error.message); setLoading(false) }
    else setSuccess(true)
  }

  if (success) return (
    <div className="page-wrapper min-h-screen flex flex-col items-center justify-center px-4">
      <div className="bg-dots" />
      <div className="relative z-10 w-full max-w-md text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-2xl font-black text-ink-primary mb-2">Compte créé !</h1>
        <p className="text-ink-secondary text-sm mb-6">Vérifie ton email pour confirmer ton compte, puis connecte-toi.</p>
        <Link to="/login" className="btn-primary inline-block px-8 py-3">Se connecter →</Link>
      </div>
    </div>
  )

  return (
    <div className="page-wrapper min-h-screen flex flex-col items-center justify-center px-4">
      <div className="bg-blob" style={{ top: '-80px', right: '-80px', width: '400px', height: '400px', background: 'radial-gradient(circle,rgba(139,92,246,0.12) 0%,transparent 70%)' }} />
      <div className="bg-blob" style={{ bottom: '-60px', left: '-60px', width: '360px', height: '360px', background: 'radial-gradient(circle,rgba(236,72,153,0.1) 0%,transparent 70%)' }} />
      <div className="bg-dots" />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: 'linear-gradient(135deg,#5B8DEF,#8B5CF6)' }}>🎨</div>
            <span className="font-black text-xl" style={{ background: 'linear-gradient(90deg,#5B8DEF,#8B5CF6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ColorPlay</span>
          </Link>
          <h1 className="text-2xl font-black text-ink-primary mb-1">Crée ton compte</h1>
          <p className="text-ink-secondary text-sm">5 crédits offerts pour commencer ✨</p>
        </div>

        {/* Perks */}
        <div className="flex justify-center gap-4 mb-6 flex-wrap">
          {['5 crédits gratuits', 'SVG haute qualité', 'Impression facile'].map(p => (
            <div key={p} className="badge-violet text-xs">{p}</div>
          ))}
        </div>

        <div className="surface-card p-8" style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.4)' }}>
          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'rgba(240,240,255,0.5)' }}>Email</label>
              <input
                type="email"
                className="input-field"
                placeholder="toi@exemple.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'rgba(240,240,255,0.5)' }}>Mot de passe</label>
              <input
                type="password"
                className="input-field"
                placeholder="8 caractères minimum"
                value={password}
                onChange={e => setPassword(e.target.value)}
                minLength={8}
                required
              />
            </div>

            {error && (
              <div className="rounded-xl px-4 py-3 text-sm" style={{ background: 'rgba(249,112,102,0.1)', border: '1px solid rgba(249,112,102,0.25)', color: '#F97066' }}>
                {error}
              </div>
            )}

            <button type="submit" className="btn-primary w-full py-3.5 text-base mt-1" disabled={loading}>
              {loading ? 'Création...' : 'Créer mon compte →'}
            </button>

            <p className="text-center text-xs" style={{ color: 'rgba(240,240,255,0.3)' }}>
              En créant un compte, tu acceptes nos conditions d'utilisation.
            </p>
          </form>
        </div>

        <p className="text-center text-sm mt-5" style={{ color: 'rgba(240,240,255,0.4)' }}>
          Déjà un compte ?{' '}
          <Link to="/login" className="font-semibold" style={{ color: '#A78BFA' }}>Se connecter</Link>
        </p>
      </div>
    </div>
  )
}
