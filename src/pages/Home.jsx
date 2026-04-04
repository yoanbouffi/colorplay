import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../hooks/useAuth'
import PlanCard from '../components/PlanCard'

const TYPED_TEXTS_FR = [
  'un lion dans la jungle',
  'une fée dans les bois',
  'un robot astronaute',
  'un château enchanté',
  'un dauphin dans l\'océan',
  'un dragon crachant des étoiles',
]
const TYPED_TEXTS_EN = [
  'a lion in the jungle',
  'a fairy in the forest',
  'a robot astronaut',
  'an enchanted castle',
  'a dolphin in the ocean',
  'a dragon breathing stars',
]

const TESTIMONIALS = [
  {
    name: 'Sophie M.',
    avatar: 'SM',
    roleKey: 'home.testimonials.role1',
    text: "ColorPlay a révolutionné mes cours d'arts plastiques ! Mes élèves adorent les coloriages personnalisés et sont tellement plus motivés.",
    textEn: "ColorPlay has revolutionized my art classes! My students love the personalized coloring pages and are so much more motivated.",
    stars: 5,
  },
  {
    name: 'Pierre & Marie D.',
    avatar: 'PM',
    roleKey: 'home.testimonials.role2',
    text: "Nos enfants passent des heures à colorier leurs créations. C'est magique de voir leur imagination prendre vie en quelques secondes !",
    textEn: "Our kids spend hours coloring their creations. It's magical to see their imagination come to life in seconds!",
    stars: 5,
  },
  {
    name: 'Claire L.',
    avatar: 'CL',
    roleKey: 'home.testimonials.role3',
    text: "Parfait pour occuper les enfants créativement. Les coloriages sont toujours adaptés à leur niveau et vraiment beaux.",
    textEn: "Perfect for keeping children creatively engaged. The coloring pages are always age-appropriate and really beautiful.",
    stars: 5,
  },
]

const HOW_IT_WORKS = [
  {
    icon: '✏️',
    bg: 'bg-brand-blue/15',
    titleFr: 'Décris',
    titleEn: 'Describe',
    descFr: 'Écris ce que tu veux voir dans ton coloriage en quelques mots simples',
    descEn: 'Write what you want to see in your coloring page in a few simple words',
  },
  {
    icon: '🤖',
    bg: 'bg-brand-green/15',
    titleFr: 'Génère',
    titleEn: 'Generate',
    descFr: 'Notre IA crée un coloriage unique parfaitement adapté en quelques secondes',
    descEn: 'Our AI creates a unique, perfectly adapted coloring page in seconds',
  },
  {
    icon: '🖨️',
    bg: 'bg-brand-orange/15',
    titleFr: 'Imprime',
    titleEn: 'Print',
    descFr: 'Télécharge en PDF haute qualité ou imprime directement depuis ton navigateur',
    descEn: 'Download as high-quality PDF or print directly from your browser',
  },
]

function TypingAnimation() {
  const { i18n } = useTranslation()
  const texts = i18n.language === 'en' ? TYPED_TEXTS_EN : TYPED_TEXTS_FR
  const [typedText, setTypedText] = useState('')
  const [textIndex, setTextIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const current = texts[textIndex % texts.length]
    const delay = isDeleting ? 40 : charIndex === current.length ? 2200 : 75

    const timer = setTimeout(() => {
      if (!isDeleting && charIndex < current.length) {
        setTypedText(current.substring(0, charIndex + 1))
        setCharIndex(c => c + 1)
      } else if (!isDeleting && charIndex === current.length) {
        setIsDeleting(true)
      } else if (isDeleting && charIndex > 0) {
        setTypedText(current.substring(0, charIndex - 1))
        setCharIndex(c => c - 1)
      } else {
        setIsDeleting(false)
        setTextIndex(i => (i + 1) % texts.length)
      }
    }, delay)

    return () => clearTimeout(timer)
  }, [charIndex, isDeleting, textIndex, texts])

  return (
    <span className="text-brand-blue italic">
      "{typedText}<span className="animate-pulse not-italic border-r-2 border-brand-blue ml-0.5">&nbsp;</span>"
    </span>
  )
}

export default function Home() {
  const { t, i18n } = useTranslation()
  const { user } = useAuth()
  const lang = i18n.language === 'en' ? 'en' : 'fr'

  return (
    <div className="bg-neutral-light">

      {/* ── Hero ── */}
      <section className="bg-neutral-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-20 md:py-28">
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">

            {/* Left */}
            <div className="flex-1 text-center md:text-left">
              <img
                src="/assets/logo-full.svg"
                alt="ColorPlay"
                className="h-14 mx-auto md:mx-0 mb-8"
                onError={(e) => { e.target.style.display = 'none' }}
              />
              <h1 className="text-4xl md:text-5xl font-extrabold text-neutral-dark mb-4 leading-tight">
                {lang === 'fr'
                  ? <>Génère des coloriages<br /><span className="text-brand-blue">uniques avec l'IA</span></>
                  : <>Generate unique<br /><span className="text-brand-blue">AI coloring pages</span></>
                }
              </h1>
              <p className="text-lg text-neutral-dark/60 mb-6">{t('home.hero.subtitle')}</p>
              <div className="min-h-8 mb-8 text-base md:text-lg font-medium text-neutral-dark/70">
                <TypingAnimation />
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                <Link
                  to={user ? '/generator' : '/register'}
                  className="px-8 py-3.5 bg-brand-blue text-white rounded-xl font-bold text-lg hover:opacity-90 transition-all duration-300 shadow-sm"
                >
                  {t('home.hero.cta')}
                </Link>
                <Link
                  to="/pricing"
                  className="px-8 py-3.5 border-2 border-brand-blue text-brand-blue rounded-xl font-bold text-lg hover:bg-brand-blue/10 transition-all duration-300"
                >
                  {t('home.hero.viewPlans')}
                </Link>
              </div>
              <p className="text-sm text-neutral-dark/40 mt-3">{t('home.hero.ctaSubtext')}</p>
            </div>

            {/* Right — preview card */}
            <div className="flex-1 flex justify-center">
              <div className="relative w-64 h-80 md:w-72 md:h-96 bg-neutral-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex items-center justify-center">
                {/* Decorative background dots */}
                <div className="absolute inset-0 opacity-5">
                  {[...Array(16)].map((_, i) => (
                    <div key={i} className="absolute w-2 h-2 rounded-full bg-neutral-dark"
                      style={{ top: `${(i % 4) * 25 + 10}%`, left: `${Math.floor(i / 4) * 25 + 10}%` }} />
                  ))}
                </div>
                {/* Coloring preview SVG */}
                <svg viewBox="0 0 180 240" className="w-56 h-72 md:w-64 md:h-80">
                  {/* Sun */}
                  <circle cx="140" cy="30" r="18" fill="none" stroke="#1A1A2E" strokeWidth="2.5"/>
                  {[0,45,90,135,180,225,270,315].map((angle, i) => (
                    <line key={i}
                      x1={140 + 22 * Math.cos(angle * Math.PI / 180)}
                      y1={30 + 22 * Math.sin(angle * Math.PI / 180)}
                      x2={140 + 28 * Math.cos(angle * Math.PI / 180)}
                      y2={30 + 28 * Math.sin(angle * Math.PI / 180)}
                      stroke="#1A1A2E" strokeWidth="2.5" strokeLinecap="round"
                    />
                  ))}
                  {/* Cloud */}
                  <ellipse cx="50" cy="40" rx="20" ry="14" fill="none" stroke="#1A1A2E" strokeWidth="2.5"/>
                  <ellipse cx="70" cy="44" rx="16" ry="12" fill="none" stroke="#1A1A2E" strokeWidth="2.5"/>
                  <ellipse cx="32" cy="44" rx="12" ry="10" fill="none" stroke="#1A1A2E" strokeWidth="2.5"/>
                  {/* Tree trunk */}
                  <rect x="78" y="160" width="24" height="60" rx="4" fill="none" stroke="#1A1A2E" strokeWidth="2.5"/>
                  {/* Tree foliage */}
                  <ellipse cx="90" cy="100" rx="50" ry="60" fill="none" stroke="#1A1A2E" strokeWidth="2.5"/>
                  <ellipse cx="90" cy="85" rx="38" ry="48" fill="none" stroke="#1A1A2E" strokeWidth="1.5"/>
                  <ellipse cx="90" cy="70" rx="26" ry="36" fill="none" stroke="#1A1A2E" strokeWidth="1.5"/>
                  {/* Grass */}
                  {[20,40,60,80,100,120,140,160].map((x, i) => (
                    <path key={i} d={`M${x} 220 Q${x+5} 210 ${x+10} 220`} fill="none" stroke="#1A1A2E" strokeWidth="2"/>
                  ))}
                  {/* Ground line */}
                  <line x1="10" y1="222" x2="170" y2="222" stroke="#1A1A2E" strokeWidth="2"/>
                </svg>
                {/* Color palette decoration */}
                <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                  {['#8ebced','#fcac4c','#89e5b3','#be9fe2','#55c9a2'].map(c => (
                    <div key={c} className="w-5 h-5 rounded-full shadow-sm border-2 border-white" style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-20 max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-neutral-dark mb-3">{t('home.howItWorks.title')}</h2>
        <div className="w-12 h-1 bg-brand-blue rounded-full mx-auto mb-12"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {HOW_IT_WORKS.map((step, i) => (
            <div key={i} className="bg-neutral-white rounded-2xl p-8 text-center shadow-sm border border-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-md group">
              <div className={`w-16 h-16 ${step.bg} rounded-2xl flex items-center justify-center text-3xl mx-auto mb-5 group-hover:scale-110 transition-transform duration-300`}>
                {step.icon}
              </div>
              <div className="flex items-center justify-center gap-2 mb-3">
                <span className="w-6 h-6 bg-brand-blue text-white text-xs font-bold rounded-full flex items-center justify-center">{i + 1}</span>
                <h3 className="text-xl font-bold text-neutral-dark">{lang === 'en' ? step.titleEn : step.titleFr}</h3>
              </div>
              <p className="text-neutral-dark/60 text-sm leading-relaxed">{lang === 'en' ? step.descEn : step.descFr}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-16 bg-neutral-white border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-neutral-dark mb-3">{t('home.testimonials.title')}</h2>
          <div className="w-12 h-1 bg-brand-orange rounded-full mx-auto mb-12"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((item, i) => (
              <div key={i} className="bg-neutral-light rounded-2xl p-6 border border-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 bg-gradient-to-br from-brand-blue to-brand-purple rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm">
                    {item.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-neutral-dark text-sm">{item.name}</div>
                    <div className="text-xs text-brand-blue-dk">{t(item.roleKey)}</div>
                  </div>
                </div>
                <div className="flex mb-3 gap-0.5">
                  {[...Array(item.stars)].map((_, j) => (
                    <span key={j} className="text-brand-amber text-base">★</span>
                  ))}
                </div>
                <p className="text-neutral-dark/70 text-sm leading-relaxed italic">
                  "{lang === 'en' ? item.textEn : item.text}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing preview ── */}
      <section className="py-20 max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-neutral-dark mb-3">{t('home.pricing.title')}</h2>
        <div className="w-12 h-1 bg-brand-teal rounded-full mx-auto mb-3"></div>
        <p className="text-center text-sm text-neutral-dark/50 mb-12">{t('plans.note')}</p>
        <PlanCard preview />
        <div className="text-center mt-8">
          <Link to="/pricing" className="text-brand-blue font-medium hover:underline">
            {t('home.pricing.viewAll')}
          </Link>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="bg-gradient-to-br from-brand-blue to-brand-teal py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">{t('home.finalCta.title')}</h2>
          <p className="text-white/80 mb-8 text-lg">{t('home.finalCta.subtitle')}</p>
          <Link
            to={user ? '/generator' : '/register'}
            className="inline-block px-10 py-4 bg-white text-brand-blue rounded-xl font-bold text-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
          >
            {t('home.finalCta.cta')}
          </Link>
        </div>
      </section>
    </div>
  )
}
