import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const CATEGORIES = [
  { label: '🦁 Animaux', color: '#F97066', bg: 'rgba(249,112,102,0.12)', border: 'rgba(249,112,102,0.3)' },
  { label: '🌿 Nature',  color: '#10B981', bg: 'rgba(16,185,129,0.12)',  border: 'rgba(16,185,129,0.3)' },
  { label: '🚀 Espace',  color: '#5B8DEF', bg: 'rgba(91,141,239,0.12)',  border: 'rgba(91,141,239,0.3)' },
  { label: '🧚 Fées',   color: '#8B5CF6', bg: 'rgba(139,92,246,0.12)', border: 'rgba(139,92,246,0.3)' },
  { label: '🎉 Fêtes',  color: '#F59E0B', bg: 'rgba(245,158,11,0.12)',  border: 'rgba(245,158,11,0.3)' },
]

const STATS = [
  { n: '2 400+', label: 'coloriages créés',   color: '#5B8DEF' },
  { n: '340+',   label: 'créateurs actifs',   color: '#A78BFA' },
  { n: '4.9 ★',  label: 'note moyenne',       color: '#EC4899' },
  { n: '100%',   label: 'imprimable HD',      color: '#10B981' },
]

// SVG previews inline
const CARDS = [
  {
    label: '🦁 Lion',
    accent: '#F97066',
    bg: 'rgba(249,112,102,0.08)',
    border: 'rgba(249,112,102,0.18)',
    hot: false,
    h: 110,
    svg: (
      <svg viewBox="0 0 72 72" className="w-16 h-16">
        <circle cx="36" cy="28" r="16" fill="none" stroke="rgba(249,112,102,0.65)" strokeWidth="1.8"/>
        <path d="M20 28 Q14 20 20 18 Q26 16 24 24" fill="none" stroke="rgba(249,112,102,0.5)" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M52 28 Q58 20 52 18 Q46 16 48 24" fill="none" stroke="rgba(249,112,102,0.5)" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M24 38 Q36 50 48 38" fill="none" stroke="rgba(249,112,102,0.5)" strokeWidth="1.8" strokeLinecap="round"/>
        <circle cx="30" cy="25" r="2.5" fill="rgba(249,112,102,0.65)"/>
        <circle cx="42" cy="25" r="2.5" fill="rgba(249,112,102,0.65)"/>
        <line x1="36" y1="44" x2="36" y2="58" stroke="rgba(249,112,102,0.4)" strokeWidth="1.5"/>
        <line x1="28" y1="58" x2="44" y2="58" stroke="rgba(249,112,102,0.4)" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: '🐉 Dragon',
    sub: '+180 impressions',
    accent: '#A78BFA',
    subColor: 'rgba(167,139,250,0.6)',
    bg: 'linear-gradient(135deg, rgba(91,141,239,0.12), rgba(139,92,246,0.12))',
    border: 'rgba(139,92,246,0.28)',
    hot: true,
    featured: true,
    h: 130,
    svg: (
      <svg viewBox="0 0 90 90" className="w-20 h-20">
        <path d="M45 8 Q65 14 72 34 Q78 52 62 66 Q50 76 38 66 Q18 54 18 34 Q22 12 45 8" fill="none" stroke="rgba(139,92,246,0.65)" strokeWidth="1.8"/>
        <path d="M28 38 Q36 28 45 24 Q54 28 62 38" fill="none" stroke="rgba(139,92,246,0.5)" strokeWidth="1.5"/>
        <path d="M35 50 Q45 58 55 50" fill="none" stroke="rgba(139,92,246,0.45)" strokeWidth="1.5"/>
        <path d="M30 18 Q22 8 16 12 Q24 16 26 22" fill="none" stroke="rgba(91,141,239,0.6)" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M60 18 Q68 8 74 12 Q66 16 64 22" fill="none" stroke="rgba(91,141,239,0.6)" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="38" cy="36" r="3" fill="rgba(139,92,246,0.6)"/>
        <circle cx="52" cy="36" r="3" fill="rgba(139,92,246,0.6)"/>
        <path d="M45 68 L42 80 M45 68 L48 80" stroke="rgba(236,72,153,0.5)" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: '🧚 Fée',
    accent: '#10B981',
    bg: 'rgba(16,185,129,0.08)',
    border: 'rgba(16,185,129,0.18)',
    hot: false,
    h: 110,
    svg: (
      <svg viewBox="0 0 72 72" className="w-16 h-16">
        <ellipse cx="36" cy="30" rx="10" ry="14" fill="none" stroke="rgba(16,185,129,0.65)" strokeWidth="1.8"/>
        <path d="M26 30 Q10 20 16 36 Q20 48 36 44" fill="none" stroke="rgba(16,185,129,0.45)" strokeWidth="1.5"/>
        <path d="M46 30 Q62 20 56 36 Q52 48 36 44" fill="none" stroke="rgba(16,185,129,0.45)" strokeWidth="1.5"/>
        <line x1="36" y1="44" x2="36" y2="58" stroke="rgba(16,185,129,0.5)" strokeWidth="1.5"/>
        <path d="M28 58 Q36 62 44 58" fill="none" stroke="rgba(16,185,129,0.4)" strokeWidth="1.5"/>
        <line x1="36" y1="16" x2="36" y2="10" stroke="rgba(245,158,11,0.7)" strokeWidth="1.5"/>
        <circle cx="36" cy="9" r="2" fill="rgba(245,158,11,0.7)"/>
        <circle cx="20" cy="22" r="1.5" fill="rgba(245,158,11,0.4)"/>
        <circle cx="52" cy="26" r="1" fill="rgba(245,158,11,0.4)"/>
      </svg>
    ),
  },
  {
    label: '🏰 Château',
    accent: '#F59E0B',
    bg: 'rgba(245,158,11,0.08)',
    border: 'rgba(245,158,11,0.18)',
    hot: false,
    h: 110,
    svg: (
      <svg viewBox="0 0 72 72" className="w-16 h-16">
        <rect x="22" y="28" width="28" height="36" rx="1" fill="none" stroke="rgba(245,158,11,0.6)" strokeWidth="1.8"/>
        <rect x="14" y="36" width="16" height="28" rx="1" fill="none" stroke="rgba(245,158,11,0.6)" strokeWidth="1.8"/>
        <rect x="42" y="36" width="16" height="28" rx="1" fill="none" stroke="rgba(245,158,11,0.6)" strokeWidth="1.8"/>
        <rect x="14" y="30" width="4" height="8" rx="1" fill="none" stroke="rgba(245,158,11,0.5)" strokeWidth="1.2"/>
        <rect x="20" y="30" width="4" height="8" rx="1" fill="none" stroke="rgba(245,158,11,0.5)" strokeWidth="1.2"/>
        <rect x="24" y="22" width="4" height="8" rx="1" fill="none" stroke="rgba(245,158,11,0.5)" strokeWidth="1.2"/>
        <rect x="30" y="22" width="4" height="8" rx="1" fill="none" stroke="rgba(245,158,11,0.5)" strokeWidth="1.2"/>
        <rect x="36" y="22" width="4" height="8" rx="1" fill="none" stroke="rgba(245,158,11,0.5)" strokeWidth="1.2"/>
        <rect x="44" y="30" width="4" height="8" rx="1" fill="none" stroke="rgba(245,158,11,0.5)" strokeWidth="1.2"/>
        <rect x="50" y="30" width="4" height="8" rx="1" fill="none" stroke="rgba(245,158,11,0.5)" strokeWidth="1.2"/>
        <path d="M31 64 L31 52 Q36 46 41 52 L41 64" fill="none" stroke="rgba(245,158,11,0.6)" strokeWidth="1.8"/>
      </svg>
    ),
  },
  {
    label: '🚀 Cosmos',
    accent: '#EC4899',
    bg: 'rgba(236,72,153,0.08)',
    border: 'rgba(236,72,153,0.18)',
    hot: false,
    h: 110,
    svg: (
      <svg viewBox="0 0 72 72" className="w-16 h-16">
        <ellipse cx="36" cy="36" rx="18" ry="10" fill="none" stroke="rgba(236,72,153,0.6)" strokeWidth="1.8"/>
        <circle cx="36" cy="36" r="7" fill="none" stroke="rgba(236,72,153,0.55)" strokeWidth="1.5"/>
        <circle cx="22" cy="20" r="2" fill="rgba(236,72,153,0.4)"/>
        <circle cx="54" cy="18" r="1.5" fill="rgba(139,92,246,0.4)"/>
        <circle cx="58" cy="48" r="2.5" fill="rgba(91,141,239,0.4)"/>
        <circle cx="14" cy="50" r="1.5" fill="rgba(245,158,11,0.4)"/>
        <path d="M30 14 L34 10 L38 14" fill="none" stroke="rgba(236,72,153,0.5)" strokeWidth="1.3" strokeLinejoin="round"/>
      </svg>
    ),
  },
]

export default function Home() {
  const { t } = useTranslation()

  return (
    <div className="page-wrapper">
      {/* BG decoration */}
      <div className="bg-blob" style={{ top: '-140px', left: '-100px', width: '560px', height: '560px', background: 'radial-gradient(circle,rgba(91,141,239,0.13) 0%,transparent 70%)' }} />
      <div className="bg-blob" style={{ top: '40px', right: '-80px', width: '480px', height: '480px', background: 'radial-gradient(circle,rgba(139,92,246,0.15) 0%,transparent 70%)' }} />
      <div className="bg-blob" style={{ bottom: '100px', left: '35%', width: '420px', height: '420px', background: 'radial-gradient(circle,rgba(236,72,153,0.09) 0%,transparent 70%)' }} />
      <div className="bg-blob" style={{ top: '60%', left: '-60px', width: '320px', height: '320px', background: 'radial-gradient(circle,rgba(16,185,129,0.07) 0%,transparent 70%)' }} />
      <div className="bg-dots" />

      {/* HERO */}
      <section className="relative z-10 flex flex-col items-center text-center pt-32 pb-8 px-4">

        {/* Category chips */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {CATEGORIES.map(cat => (
            <Link
              key={cat.label}
              to={`/generator?q=${encodeURIComponent(cat.label.replace(/^[^\s]+ /, ''))}`}
              className="chip text-xs"
              style={{ color: cat.color, background: cat.bg, borderColor: cat.border }}
            >
              {cat.label}
            </Link>
          ))}
        </div>

        {/* H1 */}
        <h1 className="font-black text-5xl sm:text-6xl lg:text-7xl leading-tight tracking-tight text-ink-primary mb-4 max-w-3xl" style={{ letterSpacing: '-2px' }}>
          Ton coloriage unique<br />
          <span className="text-gradient">généré par l'IA</span>
        </h1>
        <p className="text-ink-secondary text-lg mb-8 max-w-xl">
          Décris n'importe quelle scène — animaux, paysages, univers fantastiques. Prêt à imprimer en quelques secondes.
        </p>

        {/* Search bar */}
        <div
          className="flex w-full max-w-2xl rounded-2xl overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.10)',
            boxShadow: '0 0 50px rgba(91,141,239,0.10)',
          }}
        >
          <Link
            to="/generator"
            className="flex-1 px-6 py-4 text-base text-left font-sans"
            style={{ color: 'rgba(240,240,255,0.4)', background: 'transparent', textDecoration: 'none', display: 'flex', alignItems: 'center' }}
          >
            Un lion qui joue dans la jungle avec des flamants roses...
          </Link>
          <Link
            to="/generator"
            className="px-7 font-black text-sm text-white flex items-center gap-2 flex-shrink-0"
            style={{ background: 'linear-gradient(135deg,#5B8DEF,#8B5CF6,#EC4899)' }}
          >
            ✨ Générer
          </Link>
        </div>
        <p className="text-ink-muted text-xs mt-2.5 mb-6">3 coloriages gratuits · Pas de CB requise</p>

        {/* Stats */}
        <div
          className="flex flex-wrap justify-center gap-8 pt-5 w-full max-w-2xl"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          {STATS.map(s => (
            <div key={s.n} className="text-center">
              <div className="text-2xl font-black" style={{ color: s.color }}>{s.n}</div>
              <div className="text-xs mt-0.5" style={{ color: 'rgba(240,240,255,0.3)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Preview cards */}
      <section className="relative z-10 flex justify-center gap-4 px-4 pb-20 flex-wrap">
        {CARDS.map((card) => (
          <Link
            key={card.label}
            to="/generator"
            className="text-center rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1 relative block no-underline"
            style={{
              background: card.bg,
              border: `1px solid ${card.border}`,
              boxShadow: card.featured ? '0 14px 36px rgba(139,92,246,0.14)' : undefined,
              transform: card.featured ? 'translateY(-14px)' : undefined,
              width: card.featured ? '184px' : '160px',
            }}
          >
            {card.hot && (
              <div
                className="absolute -top-2.5 -right-2.5 text-white text-xs font-black px-2.5 py-1 rounded-xl"
                style={{ background: 'linear-gradient(135deg,#5B8DEF,#8B5CF6)' }}
              >
                ★ Populaire
              </div>
            )}
            <div
              className="rounded-xl flex items-center justify-center mb-2.5"
              style={{ height: `${card.h}px`, background: 'rgba(8,8,24,0.6)' }}
            >
              {card.svg}
            </div>
            <div className="text-xs font-bold" style={{ color: card.accent }}>{card.label}</div>
            {card.sub && <div className="text-xs mt-0.5" style={{ color: card.subColor }}>{card.sub}</div>}
          </Link>
        ))}
      </section>

      {/* How it works */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 pb-24">
        <div className="glow-line mb-12" />
        <h2 className="text-3xl font-black text-center mb-2 text-ink-primary">Comment ça marche ?</h2>
        <p className="text-center text-ink-secondary mb-12">3 étapes, moins de 30 secondes</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { step: '01', icon: '✍️', title: 'Décris ta scène', desc: 'Écris ce que tu imagines : un animal, un paysage, un personnage de conte.' },
            { step: '02', icon: '🤖', title: "L'IA génère", desc: "En quelques secondes, notre IA crée un coloriage unique en noir & blanc prêt à imprimer." },
            { step: '03', icon: '🖨️', title: 'Imprime & colorie', desc: "Télécharge ton coloriage en haute résolution et imprime-le. Simple comme bonjour." },
          ].map(item => (
            <div key={item.step} className="surface-card p-6 relative overflow-hidden group hover:border-violet-500/20 transition-colors duration-300" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.06) 0%, transparent 70%)' }}
              />
              <div className="relative">
                <div className="text-xs font-black mb-4 tracking-widest" style={{ color: 'rgba(139,92,246,0.5)' }}>ÉTAPE {item.step}</div>
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-lg mb-2 text-ink-primary">{item.title}</h3>
                <p className="text-sm leading-relaxed text-ink-secondary">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA banner */}
      <section className="relative z-10 max-w-3xl mx-auto px-4 pb-32">
        <div
          className="rounded-3xl p-10 text-center relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg,rgba(91,141,239,0.15),rgba(139,92,246,0.15),rgba(236,72,153,0.10))', border: '1px solid rgba(139,92,246,0.2)' }}
        >
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.12) 0%, transparent 60%)' }} />
          <div className="relative">
            <div className="badge-violet mb-5 mx-auto w-fit">✦ Gratuit pour commencer</div>
            <h2 className="text-3xl font-black mb-3 text-ink-primary">Prêt à créer ton premier coloriage ?</h2>
            <p className="text-ink-secondary mb-8">3 coloriages offerts dès l'inscription. Aucune carte bancaire requise.</p>
            <Link to="/register" className="btn-primary inline-block text-base px-8 py-4">
              Commencer gratuitement →
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
