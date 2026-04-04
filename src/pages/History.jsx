import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import ColoringCard from '../components/ColoringCard'

const PAGE_SIZE = 12

export default function History() {
  const { t } = useTranslation()
  const { user } = useAuth()

  const [colorings, setColorings] = useState([])
  const [loading, setLoading] = useState(true)
  const [levelFilter, setLevelFilter] = useState('all')
  const [styleFilter, setStyleFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  const LEVEL_FILTERS = [
    { id: 'all', label: t('history.filter.all') },
    { id: 'child', label: t('history.filter.child') },
    { id: 'adult', label: t('history.filter.adult') },
    { id: 'mandala', label: t('history.filter.mandala') },
  ]
  const STYLE_FILTERS = [
    { id: 'all', label: t('history.filter.all') },
    { id: 'simple', label: 'Simple' },
    { id: 'detailed', label: 'Détaillé' },
    { id: 'manga', label: 'Manga' },
    { id: 'minimal', label: 'Minimal' },
  ]

  const fetchColorings = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      let query = supabase
        .from('colorings')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1)

      if (levelFilter !== 'all') query = query.eq('level', levelFilter)
      if (styleFilter !== 'all') query = query.eq('style', styleFilter)

      const { data, count, error } = await query
      if (error) throw error
      setColorings(data || [])
      setTotal(count || 0)
    } catch (err) {
      console.error('Fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [user, page, levelFilter, styleFilter])

  useEffect(() => {
    fetchColorings()
  }, [fetchColorings])

  // Reset page on filter change
  useEffect(() => {
    setPage(1)
  }, [levelFilter, styleFilter])

  const handleDelete = async (id) => {
    await supabase.from('colorings').delete().eq('id', id)
    setColorings(prev => prev.filter(c => c.id !== id))
    setTotal(prev => prev - 1)
  }

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-neutral-dark">{t('history.title')}</h1>
          {total > 0 && <p className="text-neutral-dark/40 text-sm mt-1">{total} coloriage{total > 1 ? 's' : ''}</p>}
        </div>
        <Link
          to="/generator"
          className="px-5 py-2.5 bg-brand-blue text-white rounded-xl font-semibold text-sm hover:opacity-90 transition-all duration-200 flex items-center gap-2"
        >
          <span>+</span>
          {t('nav.generate')}
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        {/* Level filter */}
        <div className="flex items-center gap-1.5 bg-neutral-white rounded-xl border border-gray-100 p-1">
          {LEVEL_FILTERS.map(f => (
            <button
              key={f.id}
              onClick={() => setLevelFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                levelFilter === f.id
                  ? 'bg-brand-purple/20 text-brand-blue-dk'
                  : 'text-neutral-dark/50 hover:text-neutral-dark'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Style filter */}
        <div className="flex items-center gap-1.5 bg-neutral-white rounded-xl border border-gray-100 p-1">
          {STYLE_FILTERS.map(f => (
            <button
              key={f.id}
              onClick={() => setStyleFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                styleFilter === f.id
                  ? 'bg-brand-purple/20 text-brand-blue-dk'
                  : 'text-neutral-dark/50 hover:text-neutral-dark'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-neutral-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
              <div className="aspect-[3/4] bg-gray-100" />
              <div className="p-4 space-y-2">
                <div className="h-3 bg-gray-100 rounded w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : colorings.length === 0 ? (
        <div className="text-center py-24">
          <div className="w-20 h-20 bg-neutral-white rounded-2xl flex items-center justify-center mx-auto mb-4 text-4xl border border-gray-100">🎨</div>
          <h3 className="text-xl font-bold text-neutral-dark mb-2">{t('history.empty')}</h3>
          <p className="text-neutral-dark/50 text-sm mb-6">
            {levelFilter !== 'all' || styleFilter !== 'all'
              ? 'Aucun coloriage ne correspond à ces filtres.'
              : 'Commence à créer des coloriages pour les retrouver ici.'}
          </p>
          <Link
            to="/generator"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-blue text-white rounded-xl font-semibold hover:opacity-90 transition-all duration-200"
          >
            ✨ {t('history.emptyCta')}
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {colorings.map(coloring => (
              <ColoringCard
                key={coloring.id}
                coloring={coloring}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 text-sm font-medium bg-neutral-white border border-gray-200 rounded-xl text-neutral-dark/70 hover:border-brand-blue hover:text-brand-blue disabled:opacity-40 transition-all duration-200"
              >
                ← Préc.
              </button>

              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`w-9 h-9 text-sm font-medium rounded-lg transition-all duration-200 ${
                      page === i + 1
                        ? 'bg-brand-blue text-white'
                        : 'text-neutral-dark/60 hover:bg-neutral-light'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 text-sm font-medium bg-neutral-white border border-gray-200 rounded-xl text-neutral-dark/70 hover:border-brand-blue hover:text-brand-blue disabled:opacity-40 transition-all duration-200"
              >
                Suiv. →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
