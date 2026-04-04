import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export default function CreditCounter({ credits, plan, resetDate }) {
  const { t } = useTranslation()
  const isUnlimited = plan === 'teacher' || plan === 'school'
  const maxCredits = plan === 'family' ? 50 : 5
  const percentage = isUnlimited ? 100 : Math.round((credits / maxCredits) * 100)
  const formattedReset = resetDate
    ? new Date(resetDate).toLocaleDateString(undefined, { day: 'numeric', month: 'long' })
    : null

  return (
    <div className="bg-neutral-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-neutral-dark">{t('account.credits')}</span>
        <span className="bg-brand-blue text-white text-sm font-bold px-3 py-1 rounded-full">
          {isUnlimited ? '∞' : credits}
        </span>
      </div>

      {!isUnlimited && (
        <div className="w-full bg-gray-100 rounded-full h-2.5 mb-3">
          <div
            className="bg-brand-teal h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-neutral-dark/50">
        {isUnlimited ? (
          <span className="text-brand-teal font-medium">Coloriages illimités</span>
        ) : (
          <span>{credits} / {maxCredits} {t('plans.creditsPerMonth')}</span>
        )}
        {formattedReset && (
          <span>{t('account.renewal')} {formattedReset}</span>
        )}
      </div>

      {!isUnlimited && credits === 0 && (
        <Link
          to="/pricing"
          className="mt-3 block w-full text-center py-2 bg-brand-orange text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-all duration-200"
        >
          Obtenir plus de crédits
        </Link>
      )}
    </div>
  )
}
