import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../hooks/useAuth'
import { PLANS } from '../lib/stripe'
import CreditCounter from '../components/CreditCounter'

export default function Account() {
  const { t, i18n } = useTranslation()
  const { user, profile, signOut, refreshProfile } = useAuth()
  const navigate = useNavigate()
  const lang = i18n.language === 'en' ? 'en' : 'fr'

  const currentPlan = profile?.plan || 'free'
  const planInfo = PLANS[currentPlan]
  const isUnlimited = currentPlan === 'teacher' || currentPlan === 'school'
  const credits = profile?.credits_remaining ?? 0
  const maxCredits = planInfo?.credits === 9999 ? '∞' : planInfo?.credits
  const resetDate = profile?.credits_reset_date
    ? new Date(profile.credits_reset_date).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })
    : null

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const handleCancelPlan = async () => {
    if (!window.confirm(t('account.cancelConfirm'))) return
    alert('Pour annuler votre abonnement, contactez-nous à hello@colorplay.app')
  }

  const PLAN_COLORS = {
    free: 'bg-gray-100 text-gray-600',
    family: 'bg-brand-orange/15 text-brand-orange',
    teacher: 'bg-brand-blue/15 text-brand-blue',
    school: 'bg-brand-purple/15 text-brand-purple',
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold text-neutral-dark mb-8">{t('account.title')}</h1>

      {/* Profile card */}
      <div className="card mb-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-brand-blue to-brand-purple rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-sm">
            {(profile?.email || user?.email || '?')[0].toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-neutral-dark">{profile?.email || user?.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${PLAN_COLORS[currentPlan]}`}>
                {lang === 'en' ? planInfo?.nameEn : planInfo?.name}
              </span>
              {profile?.stripe_customer_id && (
                <span className="text-xs text-neutral-dark/40">Stripe ✓</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Credits */}
      <div className="mb-5">
        <CreditCounter
          credits={credits}
          plan={currentPlan}
          resetDate={resetDate}
        />
      </div>

      {/* Plan management */}
      <div className="card mb-5">
        <h2 className="font-bold text-neutral-dark mb-4">{t('account.plan')}</h2>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="font-semibold text-neutral-dark">
              {lang === 'en' ? planInfo?.nameEn : planInfo?.name}
              {planInfo?.price > 0 && (
                <span className="text-sm font-normal text-neutral-dark/50 ml-2">{planInfo?.price}€/mois</span>
              )}
            </p>
            {resetDate && (
              <p className="text-xs text-neutral-dark/40 mt-0.5">{t('account.renewal')} {resetDate}</p>
            )}
          </div>
          <Link
            to="/pricing"
            className="px-4 py-2 bg-brand-blue/10 text-brand-blue rounded-xl text-sm font-semibold hover:bg-brand-blue hover:text-white transition-all duration-200"
          >
            {t('account.changePlan')}
          </Link>
        </div>

        {currentPlan !== 'free' && (
          <button
            onClick={handleCancelPlan}
            className="text-sm text-red-400 hover:text-red-600 transition-colors font-medium"
          >
            {t('account.cancelPlan')}
          </button>
        )}
      </div>

      {/* Usage stats */}
      {!isUnlimited && (
        <div className="card mb-5">
          <h2 className="font-bold text-neutral-dark mb-4">{t('account.creditsUsed')}</h2>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-neutral-dark/60">Utilisés ce mois</span>
                <span className="font-semibold text-neutral-dark">
                  {(planInfo?.credits === 9999 ? 0 : (planInfo?.credits || 5)) - credits} / {maxCredits}
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="bg-brand-teal h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      100 - Math.round((credits / (planInfo?.credits || 5)) * 100),
                      100
                    )}%`
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick links */}
      <div className="card mb-5">
        <h2 className="font-bold text-neutral-dark mb-4">Raccourcis</h2>
        <div className="space-y-2">
          <Link
            to="/generator"
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-neutral-light transition-colors group"
          >
            <span className="text-xl">✨</span>
            <span className="text-sm font-medium text-neutral-dark/70 group-hover:text-neutral-dark">{t('nav.generate')}</span>
            <span className="ml-auto text-neutral-dark/30 group-hover:text-brand-blue">→</span>
          </Link>
          <Link
            to="/history"
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-neutral-light transition-colors group"
          >
            <span className="text-xl">🗂️</span>
            <span className="text-sm font-medium text-neutral-dark/70 group-hover:text-neutral-dark">{t('nav.history')}</span>
            <span className="ml-auto text-neutral-dark/30 group-hover:text-brand-blue">→</span>
          </Link>
          <a
            href="mailto:hello@colorplay.app"
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-neutral-light transition-colors group"
          >
            <span className="text-xl">✉️</span>
            <span className="text-sm font-medium text-neutral-dark/70 group-hover:text-neutral-dark">Contact support</span>
            <span className="ml-auto text-neutral-dark/30 group-hover:text-brand-blue">→</span>
          </a>
        </div>
      </div>

      {/* Sign out */}
      <button
        onClick={handleSignOut}
        className="w-full py-3 border-2 border-red-200 text-red-400 rounded-xl font-semibold text-sm hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-200"
      >
        {t('account.logout')}
      </button>
    </div>
  )
}
