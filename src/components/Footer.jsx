import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function Footer() {
  const { t, i18n } = useTranslation()

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language === 'fr' ? 'en' : 'fr')
  }

  return (
    <footer className="bg-neutral-dark text-white/70 py-10 mt-auto">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <img
              src="/assets/logo-full.svg"
              alt="ColorPlay"
              className="h-7 brightness-0 invert opacity-80"
              onError={(e) => { e.target.style.display = 'none' }}
            />
            <p className="text-xs text-white/40">{t('footer.tagline')}</p>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm">
            <Link to="/pricing" className="hover:text-white transition-colors">{t('nav.pricing')}</Link>
            <a href="#" className="hover:text-white transition-colors">{t('footer.terms')}</a>
            <a href="#" className="hover:text-white transition-colors">{t('footer.privacy')}</a>
            <a href="mailto:hello@colorplay.app" className="hover:text-white transition-colors">{t('footer.contact')}</a>
          </div>

          {/* Lang + copyright */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleLang}
              className="text-xs font-medium text-white/50 border border-white/20 rounded-lg px-2.5 py-1.5 hover:border-white/40 hover:text-white/80 transition-all duration-200"
            >
              {i18n.language === 'fr' ? '🇫🇷 FR' : '🇬🇧 EN'}
            </button>
            <p className="text-xs text-white/30">
              © {new Date().getFullYear()} ColorPlay — {t('footer.rights')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
