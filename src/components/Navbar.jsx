import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../hooks/useAuth'

export default function Navbar() {
  const { t, i18n } = useTranslation()
  const { user, profile, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const isActive = (path) => location.pathname === path

  const handleSignOut = async () => {
    await signOut()
    setDropdownOpen(false)
    navigate('/')
  }

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language === 'fr' ? 'en' : 'fr')
  }

  const credits = profile?.credits_remaining ?? 0
  const isUnlimited = profile?.plan === 'teacher' || profile?.plan === 'school'

  return (
    <nav className="bg-neutral-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src="/assets/logo-full.svg"
              alt="ColorPlay"
              className="h-8"
              onError={(e) => {
                e.target.style.display = 'none'
                e.target.nextSibling.style.display = 'block'
              }}
            />
            <span style={{ display: 'none' }} className="text-xl font-bold text-neutral-dark">
              Color<span className="text-brand-blue">Play</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {user && (
              <>
                <Link
                  to="/generator"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive('/generator')
                      ? 'bg-brand-blue/10 text-brand-blue'
                      : 'text-neutral-dark/70 hover:text-neutral-dark hover:bg-gray-100'
                  }`}
                >
                  {t('nav.generate')}
                </Link>
                <Link
                  to="/history"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive('/history')
                      ? 'bg-brand-blue/10 text-brand-blue'
                      : 'text-neutral-dark/70 hover:text-neutral-dark hover:bg-gray-100'
                  }`}
                >
                  {t('nav.history')}
                </Link>
              </>
            )}
            <Link
              to="/pricing"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive('/pricing')
                  ? 'bg-brand-blue/10 text-brand-blue'
                  : 'text-neutral-dark/70 hover:text-neutral-dark hover:bg-gray-100'
              }`}
            >
              {t('nav.pricing')}
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Language toggle */}
            <button
              onClick={toggleLang}
              className="hidden md:flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-brand-blue-dk border border-gray-200 rounded-lg hover:border-brand-blue hover:text-brand-blue transition-all duration-200"
            >
              {i18n.language === 'fr' ? '🇫🇷 FR' : '🇬🇧 EN'}
            </button>

            {user ? (
              <>
                {/* Credits badge */}
                <Link to="/account" className="hidden md:flex items-center gap-1.5 bg-brand-blue text-white text-xs font-semibold px-3 py-1.5 rounded-full hover:opacity-90 transition-all duration-200">
                  <span>✨</span>
                  <span>{isUnlimited ? '∞' : credits}</span>
                </Link>

                {/* User dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 transition-all duration-200"
                  >
                    <div className="w-8 h-8 bg-brand-purple/20 rounded-full flex items-center justify-center text-brand-blue-dk font-semibold text-sm">
                      {(profile?.email || user.email || '?')[0].toUpperCase()}
                    </div>
                    <svg className={`w-4 h-4 text-neutral-dark/50 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-neutral-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-100 mb-1">
                        <p className="text-xs text-neutral-dark/50 truncate">{profile?.email || user.email}</p>
                        <p className="text-xs font-semibold text-brand-blue capitalize">{profile?.plan || 'free'}</p>
                      </div>
                      <Link
                        to="/account"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-neutral-dark hover:bg-neutral-light transition-colors"
                      >
                        <span>👤</span> {t('nav.account')}
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <span>↩</span> {t('nav.logout')}
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-neutral-dark/70 hover:text-neutral-dark transition-colors"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-brand-blue text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-all duration-300"
                >
                  {t('nav.register')}
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5 text-neutral-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 py-3 space-y-1">
            {user && (
              <>
                <Link to="/generator" onClick={() => setMobileOpen(false)} className="block px-4 py-2.5 text-sm font-medium text-neutral-dark hover:bg-neutral-light rounded-xl transition-colors">{t('nav.generate')}</Link>
                <Link to="/history" onClick={() => setMobileOpen(false)} className="block px-4 py-2.5 text-sm font-medium text-neutral-dark hover:bg-neutral-light rounded-xl transition-colors">{t('nav.history')}</Link>
              </>
            )}
            <Link to="/pricing" onClick={() => setMobileOpen(false)} className="block px-4 py-2.5 text-sm font-medium text-neutral-dark hover:bg-neutral-light rounded-xl transition-colors">{t('nav.pricing')}</Link>
            <div className="flex items-center gap-3 px-4 py-2">
              <button onClick={toggleLang} className="text-xs font-medium text-brand-blue-dk border border-gray-200 rounded-lg px-2.5 py-1.5">
                {i18n.language === 'fr' ? '🇫🇷 FR' : '🇬🇧 EN'}
              </button>
              {user ? (
                <>
                  <span className="flex items-center gap-1 bg-brand-blue text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                    ✨ {isUnlimited ? '∞' : credits}
                  </span>
                  <button onClick={handleSignOut} className="text-sm text-red-500 font-medium">{t('nav.logout')}</button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="text-sm text-neutral-dark/70">{t('nav.login')}</Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)} className="px-4 py-1.5 bg-brand-blue text-white text-sm font-semibold rounded-xl">{t('nav.register')}</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Backdrop */}
      {dropdownOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
      )}
    </nav>
  )
}
