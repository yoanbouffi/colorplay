import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'

export default function Navbar() {
  const { t } = useTranslation()
  const location = useLocation()
  const [user, setUser] = useState(null)
  const [credits, setCredits] = useState(null)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data?.user ?? null))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!user) return
    const fetchCredits = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('credits')
        .eq('id', user.id)
        .single()
      if (data) setCredits(data.credits)
    }
    fetchCredits()

    const channel = supabase
      .channel('credits-' + user.id)
      .on('postgres_changes', {
        event: 'UPDATE', schema: 'public', table: 'profiles', filter: `id=eq.${user.id}`
      }, payload => setCredits(payload.new.credits))
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [user])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isActive = (path) => location.pathname === path

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled
          ? 'rgba(8,8,24,0.85)'
          : 'rgba(8,8,24,0.6)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
            style={{ background: 'linear-gradient(135deg,#5B8DEF,#8B5CF6)' }}
          >
            🎨
          </div>
          <span
            className="font-black text-lg"
            style={{
              background: 'linear-gradient(90deg,#5B8DEF,#8B5CF6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            ColorPlay
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-7">
          <Link
            to="/generator"
            className="text-sm font-medium transition-colors duration-200"
            style={{ color: isActive('/generator') ? '#A78BFA' : 'rgba(240,240,255,0.5)' }}
          >
            {t('nav.generator', 'Générateur')}
          </Link>
          <Link
            to="/history"
            className="text-sm font-medium transition-colors duration-200"
            style={{ color: isActive('/history') ? '#A78BFA' : 'rgba(240,240,255,0.5)' }}
          >
            {t('nav.gallery', 'Galerie')}
          </Link>
          <Link
            to="/pricing"
            className="text-sm font-medium transition-colors duration-200"
            style={{ color: isActive('/pricing') ? '#A78BFA' : 'rgba(240,240,255,0.5)' }}
          >
            {t('nav.pricing', 'Tarifs')}
          </Link>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {credits !== null && (
                <div
                  className="hidden sm:flex items-center gap-1.5 text-sm font-bold rounded-full px-3.5 py-1.5"
                  style={{
                    background: 'rgba(139,92,246,0.15)',
                    border: '1px solid rgba(139,92,246,0.3)',
                    color: '#A78BFA',
                  }}
                >
                  ✦ {credits} {t('nav.credits', 'crédits')}
                </div>
              )}
              <Link to="/account">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-black text-white cursor-pointer"
                  style={{ background: 'linear-gradient(135deg,#5B8DEF,#EC4899)' }}
                  title={user.email}
                >
                  {user.email?.[0]?.toUpperCase() ?? '?'}
                </div>
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden sm:block text-sm font-medium transition-colors duration-200"
                style={{ color: 'rgba(240,240,255,0.5)' }}
              >
                {t('nav.login', 'Connexion')}
              </Link>
              <Link to="/register" className="btn-primary text-sm py-2 px-5">
                {t('nav.register', 'Commencer')}
              </Link>
            </>
          )}

          {/* Mobile burger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-1"
            onClick={() => setMenuOpen(o => !o)}
          >
            <span className="block w-5 h-0.5 bg-white/60 rounded"></span>
            <span className="block w-5 h-0.5 bg-white/60 rounded"></span>
            <span className="block w-5 h-0.5 bg-white/60 rounded"></span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="md:hidden px-6 pb-4 flex flex-col gap-3"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          <Link to="/generator" className="text-sm py-2" style={{ color: 'rgba(240,240,255,0.6)' }} onClick={() => setMenuOpen(false)}>Générateur</Link>
          <Link to="/history" className="text-sm py-2" style={{ color: 'rgba(240,240,255,0.6)' }} onClick={() => setMenuOpen(false)}>Galerie</Link>
          <Link to="/pricing" className="text-sm py-2" style={{ color: 'rgba(240,240,255,0.6)' }} onClick={() => setMenuOpen(false)}>Tarifs</Link>
          {!user && <Link to="/login" className="text-sm py-2" style={{ color: 'rgba(240,240,255,0.6)' }} onClick={() => setMenuOpen(false)}>Connexion</Link>}
        </div>
      )}
    </nav>
  )
}
