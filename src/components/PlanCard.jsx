import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { PLANS, createCheckoutSession } from '../lib/stripe'
import { useAuth } from '../hooks/useAuth'
import { useState } from 'react'

export default function PlanCard({ preview = false, currentPlan = null }) {
  const { t, i18n } = useTranslation()
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  const [loadingPlan, setLoadingPlan] = useState(null)

  const plans = preview ? ['free', 'family', 'teacher'] : ['free', 'family', 'teacher', 'school']
  const lang = i18n.language === 'en' ? 'en' : 'fr'
  const activePlan = currentPlan || profile?.plan || null

  const handleSelectPlan = async (planId) => {
    if (!user) {
      navigate('/register')
      return
    }
    if (planId === 'free' || planId === activePlan) return

    setLoadingPlan(planId)
    try {
      await createCheckoutSession(planId, user.id)
    } catch (err) {
      console.error(err)
      alert('Erreur lors de la redirection vers le paiement. Veuillez réessayer.')
    } finally {
      setLoadingPlan(null)
    }
  }

  return (
    <div className={`grid gap-4 ${preview ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'}`}>
      {plans.map((planId) => {
        const plan = PLANS[planId]
        const isActive = activePlan === planId
        const isUnlimited = plan.credits === 9999

        return (
          <div
            key={planId}
            className={`relative bg-neutral-white rounded-2xl border-2 p-6 flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
              plan.popular
                ? 'border-brand-orange shadow-md'
                : isActive
                ? 'border-brand-blue shadow-md'
                : 'border-gray-100'
            }`}
          >
            {/* Popular badge */}
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-brand-orange text-white text-xs font-bold px-3 py-1 rounded-full">
                  {t('plans.popular')}
                </span>
              </div>
            )}

            {/* Active badge */}
            {isActive && !plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-brand-blue text-white text-xs font-bold px-3 py-1 rounded-full">
                  {t('plans.current')}
                </span>
              </div>
            )}

            {/* Plan name */}
            <div className="mb-4">
              <h3 className="text-lg font-bold text-neutral-dark">
                {lang === 'en' ? plan.nameEn : plan.name}
              </h3>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-extrabold text-neutral-dark">
                  {plan.price === 0 ? t('plans.free') : `${plan.price}€`}
                </span>
                {plan.price > 0 && (
                  <span className="text-sm text-neutral-dark/50">{t('plans.month')}</span>
                )}
              </div>
            </div>

            {/* Credits highlight */}
            <div className="bg-neutral-light rounded-xl px-3 py-2 mb-4 text-center">
              <span className="text-sm font-bold text-brand-blue">
                {isUnlimited ? t('plans.unlimited') : plan.credits}
              </span>
              <span className="text-xs text-neutral-dark/60"> {t('plans.creditsPerMonth')}</span>
            </div>

            {/* Features */}
            <ul className="space-y-2 mb-6 flex-1">
              {(lang === 'en' ? plan.featuresEn : plan.features).map((feature, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-neutral-dark/70">
                  <span className="text-brand-green font-bold mt-0.5">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <button
              onClick={() => handleSelectPlan(planId)}
              disabled={isActive || loadingPlan === planId}
              className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
                isActive
                  ? 'bg-gray-100 text-neutral-dark/40 cursor-default'
                  : plan.popular
                  ? 'bg-brand-orange text-white hover:opacity-90'
                  : planId === 'free'
                  ? 'bg-neutral-light text-brand-blue border border-brand-blue hover:bg-brand-blue/10'
                  : 'bg-brand-blue text-white hover:opacity-90'
              }`}
            >
              {loadingPlan === planId ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  Chargement...
                </span>
              ) : isActive ? (
                t('plans.current')
              ) : planId === 'free' ? (
                t('plans.getStarted')
              ) : (
                t('plans.upgrade')
              )}
            </button>
          </div>
        )
      })}
    </div>
  )
}
