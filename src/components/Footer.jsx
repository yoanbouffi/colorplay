import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer
      style={{
        background: '#080818',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base" style={{ background: 'linear-gradient(135deg,#5B8DEF,#8B5CF6)' }}>🎨</div>
              <span className="font-black" style={{ background: 'linear-gradient(90deg,#5B8DEF,#8B5CF6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ColorPlay</span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: 'rgba(240,240,255,0.35)' }}>
              Des coloriages uniques générés par l'IA, pour toute la famille.
            </p>
          </div>

          {/* Product */}
          <div>
            <div className="text-xs font-bold mb-3 uppercase tracking-wider" style={{ color: 'rgba(240,240,255,0.3)' }}>Produit</div>
            <ul className="flex flex-col gap-2">
              {[['Générateur', '/generator'], ['Galerie', '/history'], ['Tarifs', '/pricing']].map(([label, href]) => (
                <li key={href}>
                  <Link to={href} className="text-sm transition-colors" style={{ color: 'rgba(240,240,255,0.45)' }}
                    onMouseEnter={e => e.target.style.color = '#A78BFA'}
                    onMouseLeave={e => e.target.style.color = 'rgba(240,240,255,0.45)'}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Compte */}
          <div>
            <div className="text-xs font-bold mb-3 uppercase tracking-wider" style={{ color: 'rgba(240,240,255,0.3)' }}>Compte</div>
            <ul className="flex flex-col gap-2">
              {[['Connexion', '/login'], ['Créer un compte', '/register'], ['Mon compte', '/account']].map(([label, href]) => (
                <li key={href}>
                  <Link to={href} className="text-sm transition-colors" style={{ color: 'rgba(240,240,255,0.45)' }}
                    onMouseEnter={e => e.target.style.color = '#A78BFA'}
                    onMouseLeave={e => e.target.style.color = 'rgba(240,240,255,0.45)'}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Légal */}
          <div>
            <div className="text-xs font-bold mb-3 uppercase tracking-wider" style={{ color: 'rgba(240,240,255,0.3)' }}>Légal</div>
            <ul className="flex flex-col gap-2">
              {[['Mentions légales', '/legal'], ['Confidentialité', '/privacy'], ['CGU', '/terms']].map(([label, href]) => (
                <li key={href}>
                  <Link to={href} className="text-sm transition-colors" style={{ color: 'rgba(240,240,255,0.45)' }}
                    onMouseEnter={e => e.target.style.color = '#A78BFA'}
                    onMouseLeave={e => e.target.style.color = 'rgba(240,240,255,0.45)'}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="glow-line mb-6" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs" style={{ color: 'rgba(240,240,255,0.25)' }}>
            © {new Date().getFullYear()} ColorPlay · Tous droits réservés
          </p>
          <p className="text-xs" style={{ color: 'rgba(240,240,255,0.2)' }}>
            Fait avec ❤️ et l'IA
          </p>
        </div>
      </div>
    </footer>
  )
}
