import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: '0€',
    period: '',
    credits: 5,
    color: 'rgba(91,141,239,0.2)',
    borderColor: 'rgba(91,141,239,0.25)',
    accent: '#5B8DEF',
    features: ['5 crédits offerts', 'Coloriages SVG HD', 'Téléchargement inclus', 'Support communauté'],
    cta: 'Commencer gratuitement',
    ctaLink: '/register',
    featured: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '4,99€',
    period: '/mois',
    credits: 50,
    color: 'rgba(139,92,246,0.15)',
    borderColor: 'rgba(139,92,246,0.4)',
    accent: '#8B5CF6',
    features: ['50 crédits / mois', 'Coloriages SVG HD', 'Téléchargement inclus', 'Historique illimité', 'Support prioritaire'],
    cta: 'Choisir Pro',
    ctaLink: '/checkout?plan=pro',
    featured: true,
    badge: '⚡ Populaire',
  },
  {
    id: 'family',
    name: 'Famille',
    price: '9,99€',
    period: '/mois',
    credits: 150,
    color: 'rgba(236,72,153,0.1)',
    borderColor: 'rgba(236,72,153,0.25)',
    accent: '#EC4899',
    features: ['150 crédits / mois', 'Coloriages SVG HD', 'Téléchargement inclus', 'Historique illimité', '3 comptes enfants', 'Support dédié'],
    cta: 'Choisir Famille',
    ctaLink: '/checkout?plan=family',
    featured: false,
  },
]

function PlanCard({ plan, currentPlan }) {
  const isOwned = currentPlan === plan.id

  return (
    <div
      className="relative flex flex-col rounded-2xl p-7 transition-all duration-300"
      style={{
        background: plan.featured ? 'rgba(139,92,246,0.1)' : plan.color,
        border: `1px solid ${plan.borderColor}`,
        boxShadow: plan.featured ? '0 8px 40px rgba(139,92,246,0.2)' : '0 4px 24px rgba(0,0,0,0.3)',
        transform: plan.featured ? 'scale(1.03)' : 'scale(1)',
      }}
    >
      {plan.badge && (
        <div
          className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-black px-4 py-1 rounded-full text-white"
          style={{ background: 'linear-gradient(135deg,#8B5CF6,#EC4899)' }}
        >
          {plan.badge}
        </div>
      )}

      <div className="mb-6">
        <h3 className="font-black text-lg text-ink-primary mb-1">{plan.name}</h3>
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-black" style={{ color: plan.accent }}>{plan.price}</span>
          {plan.period && <span className="text-sm" style={{ color: 'rgba(240,240,255,0.4)' }}>{plan.period}</span>}
        </div>
        <div className="text-xs mt-1" style={{ color: 'rgba(240,240,255,0.4)' }}>
          {plan.credits} crédit{plan.credits > 1 ? 's' : ''} {plan.period ? 'par mois' : 'pour commencer'}
        </div>
      </div>

      <ul className="flex flex-col gap-2.5 mb-8 flex-1">
        {plan.features.map(f => (
          <li key={f} className="flex items-center gap-2.5 text-sm" style={{ color: 'rgba(240,240,255,0.75)' }}>
            <span style={{ color: plan.accent }}>✓</span>
            {f}
          </li>
        ))}
      </ul>

      {isOwned ? (
        <div className="w-full py-3 text-center rounded-xl font-bold text-sm" style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(240,240,255,0.4)', border: '1px solid rgba(255,255,255,0.1)' }}>
          Plan actuel
        </div>
      ) : plan.id === 'starter' ? (
        <Link to={plan.ctaLink} className="btn-secondary w-full py-3 text-center text-sm font-bold block">
          {plan.cta}
        </Link>
      ) : (
        <Link
          to={plan.ctaLink}
          className="w-full py-3 text-center rounded-xl font-bold text-sm text-white block transition-all duration-200 hover:-translate-y-0.5"
          style={{
            background: plan.featured
              ? 'linear-gradient(135deg,#8B5CF6,#EC4899)'
              : `linear-gradient(135deg,${plan.accent}88,${plan.accent})`,
            boxShadow: `0 4px 16px ${plan.accent}33`,
          }}
        >
          {plan.cta}
        </Link>
      )}
    </div>
  )
}

export default function Pricing() {
  const [currentPlan, setCurrentPlan] = useState(null)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data?.user) return
      const { data: profile } = await supabase
        .from('profiles')
        .select('plan')
        .eq('id', data.user.id)
        .single()
      if (profile) setCurrentPlan(profile.plan ?? 'starter')
    })
  }, [])

  return (
    <div className="page-wrapper min-h-screen pt-24 pb-20 px-4">
      <div className="bg-blob" style={{ top: '0', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '400px', background: 'radial-gradient(ellipse,rgba(139,92,246,0.1) 0%,transparent 70%)' }} />
      <div className="bg-dots" />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="badge-violet mb-5 inline-flex">✦ Tarifs transparents</div>
          <h1 className="text-4xl md:text-5xl font-black text-ink-primary mb-4">
            Choisis ton plan
          </h1>
          <p className="text-ink-secondary text-lg max-w-xl mx-auto">
            Des coloriages uniques générés par l'IA, pour tous les budgets.
          </p>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center mb-16">
          {PLANS.map(plan => (
            <PlanCard key={plan.id} plan={plan} currentPlan={currentPlan} />
          ))}
        </div>

        {/* Credits FAQ */}
        <div className="surface-card p-8 mb-10">
          <h2 className="text-xl font-black text-ink-primary mb-2">💡 Comment fonctionnent les crédits ?</h2>
          <p className="text-ink-secondary text-sm leading-relaxed">
            Chaque génération de coloriage coûte <strong className="text-ink-primary">1 crédit</strong>. Les crédits mensuels se renouvellent chaque mois — les crédits non utilisés ne sont pas reportés. Les crédits offerts (plan Starter) n'expirent jamais.
          </p>
        </div>

        {/* Guarantee */}
        <div className="text-center" style={{ color: 'rgba(240,240,255,0.4)' }}>
          <p className="text-sm">🔒 Paiement sécurisé par Stripe · Annulation à tout moment</p>
        </div>
      </div>
    </div>
  )
}
