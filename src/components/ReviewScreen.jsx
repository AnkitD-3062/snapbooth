import { useState, useEffect } from 'react'
import { FILTERS } from '../hooks/useCamera'
import { renderPhotoStrip } from '../utils/stripRenderer'
import styles from './ReviewScreen.module.css'

export default function ReviewScreen({ photos, filter, onRetake, onHome }) {
  const [downloadUrl, setDownloadUrl] = useState(null)
  const [isRendering, setIsRendering] = useState(true)
  const [activeFilter, setActiveFilter] = useState(filter)

  useEffect(() => {
    let cancelled = false
    setIsRendering(true)

    renderPhotoStrip(photos, activeFilter, 'SnapBooth')
      .then(url => {
        if (!cancelled) {
          setDownloadUrl(prev => {
            if (prev) URL.revokeObjectURL(prev)
            return url
          })
          setIsRendering(false)
        }
      })
      .catch(err => {
        console.error('Strip render failed:', err)
        if (!cancelled) setIsRendering(false)
      })

    return () => { cancelled = true }
  }, [photos, activeFilter])

  const handleDownload = () => {
    if (!downloadUrl) return
    const a = document.createElement('a')
    a.href = downloadUrl
    a.download = `snapbooth-strip-${Date.now()}.jpg`
    a.click()
  }

  return (
    <div className={styles.review}>
      <div className={styles.bg}>
        <div className={styles.bgBlob1} />
        <div className={styles.bgBlob2} />
      </div>

      <header className={styles.header}>
        <button className={styles.backBtn} onClick={onHome} aria-label="Back to home">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Home
        </button>
        <div className={styles.logo}>SnapBooth</div>
        <div className={styles.headerSpacer} />
      </header>

      <main className={styles.main}>
        <div className={styles.stripSection}>
          <div className={`${styles.stripHeading} fade-up`}>
            <span className={styles.tada}>01</span>
            <div>
              <h1 className={styles.title}>Your Strip is Ready!</h1>
              <p className={styles.subtitle}>
                A softer, polished keepsake with room to tweak the mood before you save it.
              </p>
            </div>
          </div>

          <div className={`${styles.stripCard} fade-up delay-1`}>
            <div className={styles.stripShadow} />
            <div className={styles.stripInner}>
              <div className={styles.stripTop}>
                <span className={styles.stripBrand}>SnapBooth</span>
              </div>

              <div className={styles.photos}>
                {photos.map((photo, i) => (
                  <div key={i} className={`${styles.photoFrame} fade-up`} style={{ animationDelay: `${0.15 + i * 0.12}s` }}>
                    <img
                      src={photo}
                      alt={`Photo ${i + 1}`}
                      className={styles.photoImg}
                      style={{ filter: FILTERS[activeFilter]?.css || 'none' }}
                    />
                  </div>
                ))}
              </div>

              <div className={styles.stripFooter}>
                <span className={styles.stripFooterBrand}>SnapBooth</span>
                <span className={styles.stripFooterDate}>
                  {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
            </div>
          </div>
        </div>

        <aside className={`${styles.sidebar} fade-up delay-2`}>
          <div className={styles.sideCard}>
            <h2 className={styles.sideTitle}>Change Filter</h2>
            <p className={styles.sideIntro}>Try a different finish before exporting your final strip.</p>
            <div className={styles.filterGrid}>
              {Object.entries(FILTERS).map(([id, { label }]) => (
                <button
                  key={id}
                  className={`${styles.filterBtn} ${activeFilter === id ? styles.filterBtnActive : ''}`}
                  onClick={() => setActiveFilter(id)}
                  aria-pressed={activeFilter === id}
                >
                  <div
                    className={styles.filterPreview}
                    style={{ filter: FILTERS[id].css, backgroundImage: `url(${photos[0]})` }}
                  />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className={styles.actions}>
            <button
              className={styles.downloadBtn}
              onClick={handleDownload}
              disabled={isRendering || !downloadUrl}
              aria-label="Download photo strip"
            >
              {isRendering ? (
                <span className={styles.renderingLabel}>
                  <span className={styles.spinner} />
                  Rendering...
                </span>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                  </svg>
                  Download Strip
                </>
              )}
            </button>

            <button
              className={styles.retakeBtn}
              onClick={onRetake}
              aria-label="Retake photos"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 4v6h6M23 20v-6h-6" />
                <path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15" />
              </svg>
              Retake Session
            </button>
          </div>

          <div className={styles.summaryCard}>
            <span className={styles.summaryLabel}>Session notes</span>
            <div className={styles.summaryRow}>
              <strong>{photos.length} frames</strong>
              <span>{FILTERS[activeFilter]?.label ?? 'Normal'} filter</span>
            </div>
          </div>

          <p className={styles.shareNote}>
            Tip: Share your strip on Instagram Stories or print it as a keepsake.
          </p>
        </aside>
      </main>
    </div>
  )
}
