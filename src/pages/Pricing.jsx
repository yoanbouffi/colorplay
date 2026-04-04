import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import PlanCard from '../components/PlanCard'
import { PLANS } from '../lib/stripe'

const FEATURES_COMPARE = [
  { key: 'Coloriages / mois', free: '5', family: '50', teacher: 'Illimité', school: 'Illimité' },
  { key: 'Résolution', free: 'Standard', family: 'Haute', teacher: 'Haute', school: 'Haute' },
  { key: 'Téléchargement PDF', free: false, family: true, teacher: true, school: true },
  { key: 'Impression optimisée', free: false, family: true, teacher: true, school: true },
  { key: 'Historique complet', free: false, family: true, teacher: true, school: true },
  { key: 'Support prioritaire', free: false, family: false, teacher: true, school: true },
  { key: 'Comptes enseignants', free: false, family: false, teacher: '1', school: '5' },
  { key: 'Facturation établissement', free: false, family: false, teacher: false, school: true },
]

export default function Pricing() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language === 'en' ? 'en' : 'fr'
  const [openFaq, setOpenFaq] = useState(null)

  const faqs = [
    { q: t('pricing.faq.q1'), a: t('pricing.faq.a1') },
    { q: t('pricing.faq.q2'), a: t('pricing.faq.a2') },
    { q: t('pricing.faq.q3'), a: t('pricing.faq.a3') },
    { q: t('pricing.faq.q4'), a: t('pricing.faq.a4') },
    { q: t('pricing.faq.q5'), a: t('pricing.faq.a5') },
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-neutral-dark mb-3">{t('pricing.title')}</h1>
        <p className="text-neutral-dark/60 text-lg max-w-xl mx-auto">{t('pricing.subtitle')}</p>
        <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-brand-green/15 rounded-xl text-sm text-brand-teal font-medium">
          <span>ℹ️</span> {t('pricing.note')}
        </div>
      </div>

      {/* Plan cards */}
      <PlanCard />

      {/* Comparison table */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-center text-neutral-dark mb-8">
          {lang === 'fr' ? 'Comparer les offres' : 'Compare plans'}
        </h2>
        <div className="bg-neutral-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-6 py-4 font-semibold text-neutral-dark/50 w-1/3">
                    {lang === 'fr' ? 'Fonctionnalité' : 'Feature'}
                  </th>
                  {['free', 'family', 'teacher', 'school'].map(planId => (
                    <th key={planId} className={`px-4 py-4 text-center font-bold ${planId === 'family' ? 'text-brand-orange' : 'text-neutral-dark'}`}>
                      <div>{lang === 'en' ? PLANS[planId].nameEn : PLANS[planId].name}</div>
                      <div className={`text-xs font-normal mt-0.5 ${planId === 'family' ? 'text-brand-orange/70' : 'text-neutral-dark/40'}`}>
                        {PLANS[planId].price === 0 ? (lang === 'fr' ? 'Gratuit' : 'Free') : `${PLANS[planId].price}€/mois`}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {FEATURES_COMPARE.map((row, i) => (
                  <tr key={i} className={`border-b border-gray-50 ${i % 2 === 0 ? 'bg-neutral-white' : 'bg-neutral-light/50'}`}>
                    <td className="px-6 py-3.5 text-neutral-dark/70 font-medium">{row.key}</td>
                    {['free', 'family', 'teacher', 'school'].map(planId => (
                      <td key={planId} className="px-4 py-3.5 text-center">
                        {row[planId] === true ? (
                          <span className="text-brand-green text-lg">✓</span>
                        ) : row[planId] === false ? (
                          <span className="text-gray-300 text-lg">—</span>
                        ) : (
                          <span className="font-semibold text-neutral-dark text-xs">{row[planId]}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-16 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-center text-neutral-dark mb-8">{t('pricing.faq.title')}</h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-neutral-white rounded-2xl border border-gray-100 overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-neutral-light/50 transition-colors"
              >
                <span className="font-semibold text-neutral-dark text-sm pr-4">{faq.q}</span>
                <span className={`text-brand-blue flex-shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>
              {openFaq === i && (
                <div className="px-6 pb-4 text-sm text-neutral-dark/60 leading-relaxed border-t border-gray-50">
                  <div className="pt-3">{faq.a}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="mt-16 text-center bg-gradient-to-r from-brand-blue/10 to-brand-purple/10 rounded-2xl p-10">
        <h3 className="text-2xl font-bold text-neutral-dark mb-2">
          {lang === 'fr' ? 'Des questions ?' : 'Any questions?'}
        </h3>
        <p className="text-neutral-dark/60 mb-4 text-sm">
          {lang === 'fr' ? 'Notre équipe est disponible pour vous aider.' : "Our team is available to help."}
        </p>
        <a
          href="mailto:hello@colorplay.app"
          className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-dark text-white rounded-xl font-semibold text-sm hover:opacity-90 transition-all duration-200"
        >
          ✉️ hello@colorplay.app
        </a>
      </div>
    </div>
  )
}
