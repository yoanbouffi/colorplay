import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { jsPDF } from 'jspdf'

const SUGGESTIONS = [
  'Un lion majestueux dans la savane',
  'Une fée dans une forêt enchantée',
  'Un dragon crachant des flammes',
  'Un château médiéval au coucher de soleil',
  'Un cosmos avec des étoiles et planètes',
  "Une pieuvre géante dans l'océan",
  'Un renard dans la neige',
  'Une licorne volante avec des nuages',
]

const STYLES = [
  { id: 'simple', label: 'Simple', emoji: '✏️', desc: 'Idéal pour les enfants' },
  { id: 'detailed', label: 'Détaillé', emoji: '🖊️', desc: 'Lignes fines et précises' },
  { id: 'mandala', label: 'Mandala', emoji: '🔮', desc: 'Motifs géométriques' },
]

export default function Generator() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [credits, setCredits] = useState(null)
  const [prompt, setPrompt] = useState('')
  const [style, setStyle] = useState('simple')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data?.user) return
      setUser(data.user)
      const { data: prof } = await supabase
        .from('profiles').select('credits_remaining').eq('id', data.user.id).single()
      if (prof) setCredits(prof.credits_remaining)
    })
  }, [])

  const handleGenerate = async (e) => {
    e.preventDefault()
    if (!user) { navigate('/login'); return }
    if (!prompt.trim()) return
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const { data, error: fnError } = await supabase.functions.invoke('generate-coloring', {
        body: { prompt: prompt.trim(), style },
      })
      if (fnError) throw fnError
      setResult(data)
      if (data?.credits_remaining !== undefined) setCredits(data.credits_remaining)
    } catch (err) {
      setError(err?.message ?? 'Une erreur est survenue. Réessaie.')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (format = 'png') => {
    if (!result?.svg_url && !result?.svg) return
    setDownloading(format)
    try {
      const imageUrl = result.svg_url
      // Load image into canvas
      const img = new Image()
      img.crossOrigin = 'anonymous'
      await new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = reject
        img.src = imageUrl
      })
      const canvas = document.createElement('canvas')
      canvas.width = img.naturalWidth || 1024
      canvas.height = img.naturalHeight || 1024
      const ctx = canvas.getContext('2d')
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0)

      const filename = `coloriage-${Date.now()}`

      if (format === 'pdf') {
        const dataUrl = canvas.toDataURL('image/jpeg', 0.95)
        const pdf = new jsPDF({
          orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
          unit: 'mm',
          format: 'a4',
        })
        const pageW = pdf.internal.pageSize.getWidth()
        const pageH = pdf.internal.pageSize.getHeight()
        const margin = 10
        const maxW = pageW - margin * 2
        const maxH = pageH - margin * 2
        const ratio = Math.min(maxW / canvas.width, maxH / canvas.height)
        const imgW = canvas.width * ratio
        const imgH = canvas.height * ratio
        const x = (pageW - imgW) / 2
        const y = (pageH - imgH) / 2
        pdf.addImage(dataUrl, 'JPEG', x, y, imgW, imgH)
        pdf.save(`${filename}.pdf`)
      } else {
        const mimeType = format === 'jpg' ? 'image/jpeg' : 'image/png'
        const quality = format === 'jpg' ? 0.92 : undefined
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `${filename}.${format}`
          a.click()
          URL.revokeObjectURL(url)
        }, mimeType, quality)
      }
    } catch (err) {
      // Fallback: direct download
      const a = document.createElement('a')
      a.href = result.svg_url
      a.download = `coloriage-${Date.now()}.png`
      a.target = '_blank'
      a.click()
    } finally {
      setDownloading(null)
    }
  }

  const handleSuggestion = (s) => setPrompt(s)
  const handleNew = () => { setResult(null); setPrompt(''); setError(null) }

  return (
    <div className="page-wrapper min-h-screen pt-24 pb-20 px-4">
      <div className="bg-blob" style={{ top: '40px', left: '50%', transform: 'translateX(-50%)', width: '700px', height: '400px', background: 'radial-gradient(ellipse,rgba(139,92,246,0.08) 0%,transparent 70%)' }} />
      <div className="bg-dots" />

      <div className="relative z-10 max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-ink-primary mb-2">
            Génère ton coloriage
          </h1>
          <p className="text-ink-secondary text-base">
            Décris ce que tu veux et l'IA crée un coloriage unique en quelques secondes.
          </p>
          {user && credits !== null && (
            <div
              className="inline-flex items-center gap-1.5 mt-3 text-sm font-bold rounded-full px-4 py-1.5"
              style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)', color: '#A78BFA' }}
            >
              ✦ {credits} crédit{credits !== 1 ? 's' : ''} restant{credits !== 1 ? 's' : ''}
            </div>
          )}
        </div>

        {!result ? (
          <div className="surface-card p-7" style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.35)' }}>
            <form onSubmit={handleGenerate} className="flex flex-col gap-5">
              {/* Prompt */}
              <div>
                <label className="block text-xs font-semibold mb-2" style={{ color: 'rgba(240,240,255,0.5)' }}>
                  Décris ton coloriage
                </label>
                <textarea
                  className="input-field resize-none"
                  style={{ minHeight: '100px' }}
                  placeholder="Ex : Un lion majestueux dans la savane au coucher de soleil…"
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  required
                  maxLength={400}
                />
                <div className="flex justify-end mt-1">
                  <span className="text-xs" style={{ color: 'rgba(240,240,255,0.25)' }}>{prompt.length}/400</span>
                </div>
              </div>

              {/* Suggestions */}
              <div>
                <div className="text-xs font-semibold mb-2" style={{ color: 'rgba(240,240,255,0.35)' }}>Idées rapides</div>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTIONS.slice(0, 4).map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => handleSuggestion(s)}
                      className="text-xs px-3 py-1.5 rounded-full transition-all duration-200 hover:-translate-y-0.5"
                      style={{
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: 'rgba(240,240,255,0.55)',
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Style */}
              <div>
                <label className="block text-xs font-semibold mb-2" style={{ color: 'rgba(240,240,255,0.5)' }}>Style</label>
                <div className="grid grid-cols-3 gap-2">
                  {STYLES.map(s => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setStyle(s.id)}
                      className="flex flex-col items-center gap-1 py-3 px-2 rounded-xl transition-all duration-200 text-center"
                      style={{
                        border: `1px solid ${style === s.id ? 'rgba(139,92,246,0.5)' : 'rgba(255,255,255,0.07)'}`,
                        background: style === s.id ? 'rgba(139,92,246,0.12)' : 'rgba(255,255,255,0.02)',
                      }}
                    >
                      <span className="text-xl">{s.emoji}</span>
                      <span className="text-xs font-bold" style={{ color: style === s.id ? '#A78BFA' : 'rgba(240,240,255,0.6)' }}>{s.label}</span>
                      <span className="text-xs" style={{ color: 'rgba(240,240,255,0.3)', fontSize: '10px' }}>{s.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="rounded-xl px-4 py-3 text-sm" style={{ background: 'rgba(249,112,102,0.1)', border: '1px solid rgba(249,112,102,0.25)', color: '#F97066' }}>
                  {error}
                </div>
              )}

              {!user ? (
                <div className="text-center py-2">
                  <p className="text-sm mb-3" style={{ color: 'rgba(240,240,255,0.45)' }}>Connecte-toi pour générer ton coloriage</p>
                  <div className="flex gap-3 justify-center">
                    <button type="button" onClick={() => navigate('/login')} className="btn-secondary py-2.5 px-5 text-sm">Se connecter</button>
                    <button type="button" onClick={() => navigate('/register')} className="btn-primary py-2.5 px-5 text-sm">Créer un compte</button>
                  </div>
                </div>
              ) : credits === 0 ? (
                <div className="text-center py-2">
                  <p className="text-sm mb-3" style={{ color: 'rgba(240,240,255,0.45)' }}>Tu n'as plus de crédits</p>
                  <button type="button" onClick={() => navigate('/pricing')} className="btn-primary py-2.5 px-6 text-sm">Acheter des crédits</button>
                </div>
              ) : (
                <button
                  type="submit"
                  className="btn-primary w-full py-4 text-base flex items-center justify-center gap-2"
                  disabled={loading || !prompt.trim()}
                >
                  {loading ? (
                    <>
                      <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Génération en cours…
                    </>
                  ) : '✨ Générer mon coloriage'}
                </button>
              )}
            </form>
          </div>
        ) : (
          /* Result */
          <div className="flex flex-col items-center gap-6">
            <div className="w-full surface-card overflow-hidden" style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.4)' }}>
              {/* SVG preview */}
              <div
                className="flex items-center justify-center p-8"
                style={{ background: 'rgba(255,255,255,0.97)', minHeight: '380px' }}
              >
                {result.svg ? (
                  <div
                    className="w-full max-w-sm"
                    dangerouslySetInnerHTML={{ __html: result.svg }}
                  />
                ) : result.svg_url ? (
                  <img src={result.svg_url} alt={prompt} className="max-w-full max-h-80 object-contain" />
                ) : (
                  <div className="text-gray-300 text-6xl">🎨</div>
                )}
              </div>

              <div className="p-5">
                <p className="text-sm font-medium text-ink-primary mb-1 truncate">{prompt}</p>
                <p className="text-xs" style={{ color: 'rgba(240,240,255,0.4)' }}>
                  Style : {STYLES.find(s => s.id === style)?.label ?? style}
                </p>
              </div>
            </div>

            <div className="flex gap-2 w-full">
              <button
                onClick={() => handleDownload('png')}
                className="btn-primary flex-1 py-3.5 flex items-center justify-center gap-1.5 text-sm font-bold"
                disabled={!!downloading}
              >
                {downloading === 'png' ? '…' : '⬇ PNG'}
              </button>
              <button
                onClick={() => handleDownload('jpg')}
                className="btn-primary flex-1 py-3.5 flex items-center justify-center gap-1.5 text-sm font-bold"
                disabled={!!downloading}
                style={{ background: 'rgba(139,92,246,0.7)' }}
              >
                {downloading === 'jpg' ? '…' : '⬇ JPG'}
              </button>
              <button
                onClick={() => handleDownload('pdf')}
                className="btn-primary flex-1 py-3.5 flex items-center justify-center gap-1.5 text-sm font-bold"
                disabled={!!downloading}
                style={{ background: 'rgba(139,92,246,0.5)' }}
              >
                {downloading === 'pdf' ? '…' : '⬇ PDF'}
              </button>
              <button onClick={handleNew} className="btn-secondary py-3.5 px-4 text-sm">
                ✨ Nouveau
              </button>
            </div>

            {credits !== null && (
              <p className="text-xs" style={{ color: 'rgba(240,240,255,0.3)' }}>
                Il te reste {credits} crédit{credits !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
