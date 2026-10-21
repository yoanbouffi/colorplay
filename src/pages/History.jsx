import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

function ColoringCard({ item }) {
  const [downloading, setDownloading] = useState(false)

  const handleDownload = async () => {
    setDownloading(true)
    try {
      const res = await fetch(item.image_url)
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `coloriage-${item.id}.svg`
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="surface-card overflow-hidden group transition-all duration-300 hover:-translate-y-1" style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.3)' }}>
      {/* Preview */}
      <div
        className="relative flex items-center justify-center"
        style={{ height: '200px', background: 'rgba(255,255,255,0.95)' }}
      >
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.prompt}
            className="max-w-full max-h-full object-contain p-4"
          />
        ) : (
          <div className="text-4xl opacity-20">🎨</div>
        )}
        {/* Hover overlay */}
        <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" style={{ background: 'rgba(8,8,24,0.6)' }}>
          <button
            onClick={handleDownload}
            className="btn-primary py-2 px-4 text-xs"
            disabled={downloading}
          >
            {downloading ? '…' : '⬇ Télécharger'}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-sm font-medium text-ink-primary truncate mb-1">{item.prompt}</p>
        <p className="text-xs" style={{ color: 'rgba(240,240,255,0.35)' }}>
          {new Date(item.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>
    </div>
  )
}

export default function History() {
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data?.user) { navigate('/login'); return }
      const { data: colorings } = await supabase
        .from('colorings')
        .select('*')
        .eq('user_id', data.user.id)
        .order('created_at', { ascending: false })
      setItems(colorings ?? [])
      setLoading(false)
    })
  }, [navigate])

  const filtered = items.filter(i =>
    i.prompt?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="page-wrapper min-h-screen pt-24 pb-20 px-4">
      <div className="bg-blob" style={{ top: '60px', left: '-60px', width: '400px', height: '400px', background: 'radial-gradient(circle,rgba(91,141,239,0.08) 0%,transparent 70%)' }} />
      <div className="bg-dots" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-ink-primary mb-1">Mes coloriages</h1>
            <p className="text-sm" style={{ color: 'rgba(240,240,255,0.4)' }}>
              {items.length} coloriage{items.length !== 1 ? 's' : ''} générés
            </p>
          </div>
          {items.length > 0 && (
            <input
              type="search"
              className="input-field max-w-xs"
              placeholder="Rechercher…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="text-ink-secondary text-sm">Chargement…</div>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-6xl mb-4 opacity-40">🎨</div>
            <h2 className="text-xl font-black text-ink-primary mb-2">Pas encore de coloriage</h2>
            <p className="text-ink-secondary text-sm mb-6">Génère ton premier coloriage unique !</p>
            <button
              onClick={() => navigate('/generator')}
              className="btn-primary px-8 py-3"
            >
              Générer mon premier coloriage →
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-ink-secondary text-sm">Aucun résultat pour « {search} »</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filtered.map(item => (
              <ColoringCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
