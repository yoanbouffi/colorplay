import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../hooks/useAuth'
import { generateColoring, downloadImageAsPng } from '../lib/fal'
import { supabase } from '../lib/supabase'
import jsPDF from 'jspdf'

const MAX_CHARS = 200

const SUGGESTIONS_FR = ['Animaux', 'Nature', 'Personnages', 'Fêtes', 'Espace', 'Océan']
const SUGGESTIONS_EN = ['Animals', 'Nature', 'Characters', 'Holidays', 'Space', 'Ocean']

const LEVELS = [
  { id: 'child', icon: '🧒', labelFr: 'Enfant', labelEn: 'Child' },
  { id: 'adult', icon: '👤', labelFr: 'Adulte', labelEn: 'Adult' },
  { id: 'mandala', icon: '🌀', labelFr: 'Mandala', labelEn: 'Mandala' },
]

const STYLES = [
  { id: 'simple', labelFr: 'Simple', labelEn: 'Simple' },
  { id: 'detailed', labelFr: 'Détaillé', labelEn: 'Detailed' },
  { id: 'manga', labelFr: 'Manga', labelEn: 'Manga' },
  { id: 'minimal', labelFr: 'Minimaliste', labelEn: 'Minimalist' },
]

const GENERATION_MESSAGES_FR = [
  'Interprétation de votre idée…',
  'Esquisse des contours…',
  'Affinement des détails…',
  'Vérification des lignes…',
  'Finalisation du coloriage…',
]
const GENERATION_MESSAGES_EN = [
  'Interpreting your idea…',
  'Sketching the outlines…',
  'Refining the details…',
  'Checking the lines…',
  'Finalizing your coloring page…',
]

function ProgressBar({ active }) {
  const [progress, setProgress] = useState(0)
  const [msgIndex, setMsgIndex] = useState(0)
  const { i18n } = useTranslation()
  const lang = i18n.language === 'en' ? 'en' : 'fr'
  const messages = lang === 'en' ? GENERATION_MESSAGES_EN : GENERATION_MESSAGES_FR

  useEffect(() => {
    if (!active) {
      setProgress(0)
      setMsgIndex(0)
      return
    }
    const duration = 15000 // 15s estimated
    const interval = 100
    const step = (interval / duration) * 100
    let current = 0
    const timer = setInterval(() => {
      current = Math.min(current + step * (1 + Math.random() * 0.5), 92)
      setProgress(current)
      setMsgIndex(Math.min(Math.floor((current / 100) * messages.length), messages.length - 1))
    }, interval)
    return () => clearInterval(timer)
  }, [active, messages.length])

  if (!active) return null

  return (
    <div className="mt-4 w-full">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs text-neutral-dark/50 italic">{messages[msgIndex]}</span>
        <span className="text-xs font-semibold text-brand-blue">{Math.round(progress)}%</span>
      </div>
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-brand-blue to-brand-teal rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

export default function Generator() {
  const { t, i18n } = useTranslation()
  const { user, profile, refreshProfile } = useAuth()
  const lang = i18n.language === 'en' ? 'en' : 'fr'

  const [prompt, setPrompt] = useState('')
  const [level, setLevel] = useState('child')
  const [style, setStyle] = useState('simple')
  const [generating, setGenerating] = useState(false)
  const [imageUrl, setImageUrl] = useState(null)
  const [error, setError] = useState(null)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [savedToHistory, setSavedToHistory] = useState(false)
  const [downloadingPdf, setDownloadingPdf] = useState(false)
  const [downloadingPng, setDownloadingPng] = useState(false)
  const [copied, setCopied] = useState(false)

  const credits = profile?.credits_remaining ?? 0
  const isUnlimited = profile?.plan === 'teacher' || profile?.plan === 'school'
  const hasCredits = isUnlimited || credits > 0

  const SUGGESTIONS = lang === 'en' ? SUGGESTIONS_EN : SUGGESTIONS_FR

  const handleSuggestion = (s) => {
    const base = prompt.trim()
    setPrompt(base ? `${base}, ${s.toLowerCase()}` : s)
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    if (!hasCredits) {
      setShowUpgradeModal(true)
      return
    }

    setGenerating(true)
    setError(null)
    setSavedToHistory(false)
    setImageUrl(null)
    const prevCredits = credits

    try {
      // Deduct credit upfront (refund on failure)
      if (!isUnlimited) {
        await supabase
          .from('profiles')
          .update({ credits_remaining: credits - 1 })
          .eq('id', user.id)
      }

      // Generate via fal.ai
      const url = await generateColoring(prompt.trim(), style, level)
      setImageUrl(url)

      // Save to colorings table
      await supabase.from('colorings').insert({
        user_id: user.id,
        prompt: prompt.trim(),
        style,
        level,
        image_url: url,
      })

      setSavedToHistory(true)
      await refreshProfile()
    } catch (err) {
      console.error('Generation error:', err)
      setError(t('generator.error'))
      // Refund credit on error
      if (!isUnlimited) {
        await supabase
          .from('profiles')
          .update({ credits_remaining: prevCredits })
          .eq('id', user.id)
        await refreshProfile()
      }
    } finally {
      setGenerating(false)
    }
  }

  const handleDownloadPDF = async () => {
    if (!imageUrl) return
    setDownloadingPdf(true)
    try {
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      const img = new Image()
      img.crossOrigin = 'anonymous'
      await new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = reject
        img.src = imageUrl
      })
      const ratio = img.height / img.width
      const w = 190
      const h = Math.min(w * ratio, 277)
      doc.addImage(img, 'PNG', 10, 10, w, h)
      doc.save(`colorplay-${Date.now()}.pdf`)
    } catch (err) {
      console.error('PDF error:', err)
    } finally {
      setDownloadingPdf(false)
    }
  }

  const handleDownloadPng = async () => {
    if (!imageUrl) return
    setDownloadingPng(true)
    await downloadImageAsPng(imageUrl, `colorplay-${prompt.slice(0, 20).replace(/\s+/g, '-')}`)
    setDownloadingPng(false)
  }

  const handleShare = async () => {
    if (!imageUrl) return
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Mon coloriage ColorPlay', url: imageUrl })
      } catch (_) {}
    } else {
      await navigator.clipboard.writeText(imageUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handlePrint = () => {
    if (!imageUrl) return
    const win = window.open('', '_blank')
    if (!win) return
    win.document.write(`
      <!DOCTYPE html><html><head>
        <title>ColorPlay — ${prompt}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { background: white; display: flex; justify-content: center; align-items: flex-start; min-height: 100vh; }
          img { max-width: 100%; height: auto; display: block; }
        </style>
      </head><body>
        <img src="${imageUrl}" onload="window.print(); setTimeout(() => window.close(), 800);" />
      </body></html>
    `)
    win.document.close()
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-neutral-dark">{t('generator.title')}</h1>
        <p className="text-neutral-dark/50 mt-1 text-sm">
          {isUnlimited ? (
            <span className="text-brand-teal font-medium">✨ Coloriages illimités</span>
          ) : (
            <span className={credits === 0 ? 'text-red-400' : 'text-brand-blue-dk'}>
              ✨ {credits} {t('generator.credits')}
            </span>
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Left — Controls */}
        <div className="space-y-5">

          {/* Prompt */}
          <div className="card">
            <label className="block text-sm font-semibold text-neutral-dark mb-2">
              {lang === 'fr' ? 'Décris ton coloriage' : 'Describe your coloring'}
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value.slice(0, MAX_CHARS))}
              placeholder={t('generator.placeholder')}
              rows={3}
              className="input-field resize-none text-sm"
            />
            <div className="flex items-center justify-between mt-1.5">
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSuggestion(s)}
                    className="text-xs px-2.5 py-1 bg-brand-purple/15 text-brand-blue-dk rounded-full hover:bg-brand-purple/35 transition-all duration-200 font-medium"
                  >
                    {s}
                  </button>
                ))}
              </div>
              <span className={`text-xs ml-2 flex-shrink-0 ${prompt.length > MAX_CHARS * 0.9 ? 'text-brand-orange' : 'text-neutral-dark/30'}`}>
                {prompt.length}/{MAX_CHARS}
              </span>
            </div>
          </div>

          {/* Level */}
          <div className="card">
            <label className="block text-sm font-semibold text-neutral-dark mb-3">{t('generator.level.title')}</label>
            <div className="grid grid-cols-3 gap-2">
              {LEVELS.map((l) => (
                <button
                  key={l.id}
                  onClick={() => setLevel(l.id)}
                  className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 font-medium text-sm transition-all duration-200 ${
                    level === l.id
                      ? 'bg-brand-blue text-white border-brand-blue shadow-sm'
                      : 'border-gray-200 text-neutral-dark/70 hover:border-brand-blue/40'
                  }`}
                >
                  <span className="text-2xl">{l.icon}</span>
                  <span className="text-xs">{lang === 'en' ? l.labelEn : l.labelFr}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Style */}
          <div className="card">
            <label className="block text-sm font-semibold text-neutral-dark mb-3">{t('generator.style.title')}</label>
            <div className="grid grid-cols-2 gap-2">
              {STYLES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setStyle(s.id)}
                  className={`py-2.5 rounded-xl border-2 font-medium text-sm transition-all duration-200 ${
                    style === s.id
                      ? 'bg-brand-teal text-white border-brand-teal shadow-sm'
                      : 'border-gray-200 text-neutral-dark/70 hover:border-brand-teal/40'
                  }`}
                >
                  {lang === 'en' ? s.labelEn : s.labelFr}
                </button>
              ))}
            </div>
          </div>

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            disabled={generating || !prompt.trim() || (!hasCredits)}
            className="w-full py-4 bg-brand-blue text-white rounded-xl font-bold text-lg hover:opacity-90 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-sm"
          >
            {generating ? (
              <>
                <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                {t('generator.generating')}
              </>
            ) : (
              <>
                <span>✨</span>
                {t('generator.generate')}
              </>
            )}
          </button>

          {!hasCredits && (
            <button
              onClick={() => setShowUpgradeModal(true)}
              className="w-full py-3 bg-brand-orange text-white rounded-xl font-semibold text-sm hover:opacity-90 transition-all duration-200"
            >
              Obtenir plus de crédits →
            </button>
          )}
        </div>

        {/* Right — Result */}
        <div className="space-y-4">
          <div className="card min-h-96 flex flex-col">
            {!imageUrl && !generating && !error && (
              <div className="flex-1 flex flex-col items-center justify-center text-center text-neutral-dark/30 py-12">
                <div className="w-20 h-20 bg-neutral-light rounded-2xl flex items-center justify-center mb-4 text-4xl">🎨</div>
                <p className="font-medium">{lang === 'fr' ? 'Ton coloriage apparaîtra ici' : 'Your coloring will appear here'}</p>
                <p className="text-sm mt-1">{lang === 'fr' ? 'Décris ce que tu veux et clique sur Générer' : 'Describe what you want and click Generate'}</p>
              </div>
            )}

            {generating && (
              <div className="flex-1 flex flex-col items-center justify-center py-12">
                <div className="relative mb-6">
                  <div className="w-24 h-24 rounded-2xl bg-brand-blue/10 flex items-center justify-center">
                    <span className="text-5xl animate-bounce">🤖</span>
                  </div>
                  <div className="absolute -bottom-2 -right-2 animate-spin h-6 w-6 border-2 border-brand-blue border-t-transparent rounded-full"></div>
                </div>
                <p className="text-brand-blue font-semibold">{t('generator.generating')}</p>
                <ProgressBar active={generating} />
              </div>
            )}

            {error && (
              <div className="flex-1 flex flex-col items-center justify-center py-8 text-center">
                <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-3 text-3xl">⚠️</div>
                <p className="text-red-500 font-medium">{error}</p>
                <button onClick={handleGenerate} disabled={generating || !hasCredits} className="mt-4 px-4 py-2 bg-brand-blue text-white rounded-xl text-sm font-medium hover:opacity-90">
                  {lang === 'fr' ? 'Réessayer' : 'Retry'}
                </button>
              </div>
            )}

            {imageUrl && !generating && (
              <>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-neutral-dark text-sm">{t('generator.result.title')}</h3>
                  {savedToHistory && (
                    <span className="text-xs text-brand-green font-medium bg-brand-green/10 px-2 py-1 rounded-full">
                      {t('generator.result.saved')}
                    </span>
                  )}
                </div>

                <div className="rounded-xl overflow-hidden border border-gray-100 flex-1 mb-4">
                  <img
                    src={imageUrl}
                    alt={prompt}
                    className="w-full h-auto object-contain"
                  />
                </div>

                {/* Action buttons — 2x2 grid */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleDownloadPDF}
                    disabled={downloadingPdf}
                    className="flex items-center justify-center gap-1.5 py-2.5 bg-brand-blue text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-all duration-200 disabled:opacity-50"
                  >
                    {downloadingPdf ? (
                      <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    )}
                    PDF
                  </button>

                  <button
                    onClick={handleDownloadPng}
                    disabled={downloadingPng}
                    className="flex items-center justify-center gap-1.5 py-2.5 bg-brand-purple text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-all duration-200 disabled:opacity-50"
                  >
                    {downloadingPng ? (
                      <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    )}
                    PNG
                  </button>

                  <button
                    onClick={handlePrint}
                    className="flex items-center justify-center gap-1.5 py-2.5 bg-brand-teal text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-all duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    {t('generator.result.print')}
                  </button>

                  <button
                    onClick={handleShare}
                    className="flex items-center justify-center gap-1.5 py-2.5 border-2 border-brand-orange text-brand-orange rounded-xl text-sm font-semibold hover:bg-brand-orange hover:text-white transition-all duration-200"
                  >
                    {copied ? (
                      <><span>✓</span> {lang === 'fr' ? 'Copié !' : 'Copied!'}</>
                    ) : (
                      <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                      {lang === 'fr' ? 'Partager' : 'Share'}</>
                    )}
                  </button>
                </div>

                {/* Regenerate link */}
                <button
                  onClick={handleGenerate}
                  disabled={generating || !hasCredits}
                  className="w-full mt-2 py-2 text-xs text-neutral-dark/50 hover:text-brand-blue transition-colors disabled:opacity-40"
                >
                  ↻ {lang === 'fr' ? 'Régénérer (−1 crédit)' : 'Regenerate (−1 credit)'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 0 credits modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-neutral-dark/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-white rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center">
            <div className="w-16 h-16 bg-brand-orange/15 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">✨</div>
            <h3 className="text-xl font-bold text-neutral-dark mb-2">{t('generator.upgrade.title')}</h3>
            <p className="text-neutral-dark/60 text-sm mb-6">{t('generator.upgrade.description')}</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="flex-1 py-2.5 border-2 border-gray-200 text-neutral-dark/60 rounded-xl font-medium text-sm hover:border-gray-300"
              >
                {t('generator.upgrade.close')}
              </button>
              <Link
                to="/pricing"
                onClick={() => setShowUpgradeModal(false)}
                className="flex-1 py-2.5 bg-brand-orange text-white rounded-xl font-bold text-sm hover:opacity-90 transition-all duration-200 flex items-center justify-center"
              >
                {t('generator.upgrade.cta')} →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
