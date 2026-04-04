import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import jsPDF from 'jspdf'

export default function ColoringCard({ coloring, onDelete }) {
  const { t } = useTranslation()
  const [deleting, setDeleting] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [imgError, setImgError] = useState(false)

  const levelColors = {
    child: 'bg-brand-green/20 text-brand-teal',
    adult: 'bg-brand-blue/20 text-brand-blue-dk',
    mandala: 'bg-brand-purple/20 text-brand-purple',
  }
  const styleColors = {
    simple: 'bg-brand-amber/20 text-brand-amber',
    detailed: 'bg-brand-orange/20 text-brand-orange',
    manga: 'bg-brand-teal/20 text-brand-teal',
    minimal: 'bg-brand-blue/20 text-brand-blue-dk',
  }

  const handleDownloadPDF = async () => {
    setDownloading(true)
    try {
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      const img = new Image()
      img.crossOrigin = 'anonymous'
      await new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = reject
        img.src = coloring.image_url
      })
      doc.addImage(img, 'PNG', 10, 10, 190, 277)
      const safeName = coloring.prompt.replace(/[^a-z0-9]/gi, '-').substring(0, 30)
      doc.save(`colorplay-${safeName}.pdf`)
    } catch (err) {
      console.error('PDF error:', err)
    } finally {
      setDownloading(false)
    }
  }

  const handlePrint = () => {
    const printWindow = window.open('', '_blank')
    if (!printWindow) return
    printWindow.document.write(`
      <!DOCTYPE html><html><head>
        <title>ColorPlay — ${coloring.prompt}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { background: white; }
          img { width: 100%; height: auto; display: block; }
        </style>
      </head><body>
        <img src="${coloring.image_url}" onload="window.print(); setTimeout(() => window.close(), 500);" />
      </body></html>
    `)
    printWindow.document.close()
  }

  const handleDelete = async () => {
    if (!window.confirm(t('history.deleteConfirm'))) return
    setDeleting(true)
    try {
      await onDelete(coloring.id)
    } catch (err) {
      console.error('Delete error:', err)
      setDeleting(false)
    }
  }

  const formattedDate = new Date(coloring.created_at).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  return (
    <div className="bg-neutral-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group">
      {/* Image */}
      <div className="relative aspect-[3/4] bg-gray-50 overflow-hidden">
        {imgError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-dark/30">
            <span className="text-4xl mb-2">🖼️</span>
            <span className="text-xs">Image indisponible</span>
          </div>
        ) : (
          <img
            src={coloring.image_url}
            alt={coloring.prompt}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
          />
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-neutral-dark/0 group-hover:bg-neutral-dark/10 transition-all duration-300" />
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-sm font-medium text-neutral-dark line-clamp-2 mb-3" title={coloring.prompt}>
          {coloring.prompt}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${levelColors[coloring.level] || 'bg-gray-100 text-gray-600'}`}>
            {coloring.level}
          </span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${styleColors[coloring.style] || 'bg-gray-100 text-gray-600'}`}>
            {coloring.style}
          </span>
        </div>

        <p className="text-xs text-neutral-dark/40 mb-3">{formattedDate}</p>

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="flex-1 flex items-center justify-center gap-1 py-2 text-xs font-medium bg-brand-blue/10 text-brand-blue rounded-lg hover:bg-brand-blue hover:text-white transition-all duration-200 disabled:opacity-40"
            title={t('history.actions.download')}
          >
            {downloading ? (
              <span className="animate-spin h-3 w-3 border border-brand-blue border-t-transparent rounded-full" />
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {t('history.actions.download')}
              </>
            )}
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-1 py-2 text-xs font-medium bg-brand-teal/10 text-brand-teal rounded-lg hover:bg-brand-teal hover:text-white transition-all duration-200"
            title={t('history.actions.print')}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            {t('history.actions.print')}
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="p-2 text-xs font-medium bg-red-50 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all duration-200 disabled:opacity-40"
            title={t('history.actions.delete')}
          >
            {deleting ? (
              <span className="animate-spin h-3 w-3 border border-red-400 border-t-transparent rounded-full block" />
            ) : (
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
