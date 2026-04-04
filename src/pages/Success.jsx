import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../hooks/useAuth'
import { PLANS } from '../lib/stripe'

export default function Success() {
  const { t, i18n } = useTranslation()
  const { profile, refreshProfile } = useAuth()
  const [searchParams] = useSearchParams()
  const lang = i18n.language === 'en' ? 'en' : 'fr'
  const [refreshed, setRefreshed] = useState(false)

  const planId = searchParams.get('plan') || profile?.plan || 'family'
  const plan = PLANS[planId] || PLANS.family

  useEffect(() => {
    // Refresh profile to get updated plan/credits
    const timer = setTimeout(async () => {
      await refreshProfile()
      setRefreshed(true)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  const credits = profile?.credits_remaining
  const isUnlimited = plan.credits === 9999

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        {/* Success animation */}
        <div className="relative mb-8">
          <div className="w-24 h-24 bg-brand-green/20 rounded-full flex items-center justify-center mx-auto mb-2 animate-bounce">
            <span className="text-5xl">🎉</span>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 border-4 border-brand-green/20 rounded-full animate-ping" />
          </div>
        </div>

        <h1 className="text-3xl font-extrabold text-neutral-dark mb-2">{t('success.title')}</h1>
        <p className="text-neutral-dark/60 mb-8">{t('success.subtitle')}</p>

        {/* Plan details */}
        <div className="card mb-6 text-left">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-brand-blue/10 rounded-xl flex items-center justify-center">
              <span className="text-2xl">✨</span>
            </div>
            <div>
              <p className="text-xs text-neutral-dark/40 uppercase tracking-wide font-medium">{t('success.newPlan')}</p>
              <p className="text-xl font-extrabold text-neutral-dark">
                {lang === 'en' ? plan.nameEn : plan.name}
              </p>
            </div>
          </div>

          <div className="bg-brand-green/10 rounded-xl px-4 py-3 flex items-center gap-3">
            <span className="text-brand-green text-xl">💚</span>
            <div>
              <p className="text-xs text-neutral-dark/40 font-medium">{t('success.credits')}</p>
              <p className="font-bold text-neutral-dark text-lg">
                {isUnlimited ? 'Illimité ∞' : (refreshed && credits !== undefined ? credits : plan.credits)}
              </p>
            </div>
          </div>
        </div>

        {/* Features recap */}
        <div className="card mb-6 text-left">
          <p className="text-xs font-semibold text-neutral-dark/40 uppercase tracking-wide mb-3">Inclus dans votre plan</p>
          <ul className="space-y-2">
            {(lang === 'en' ? plan.featuresEn : plan.features).map((feature, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-neutral-dark/70">
                <span className="text-brand-green font-bold">✓</span>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <Link
          to="/generator"
          className="w-full flex items-center justify-center gap-2 py-4 bg-brand-blue text-white rounded-xl font-bold text-lg hover:opacity-90 transition-all duration-300 shadow-sm mb-3"
        >
          <span>✨</span>
          {t('success.cta')}
        </Link>

        <Link to="/account" className="text-sm text-neutral-dark/50 hover:text-brand-blue transition-colors">
          {t('nav.account')} →
        </Link>
      </div>
    </div>
  )
}
