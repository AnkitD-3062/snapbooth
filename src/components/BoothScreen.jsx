import { useState, useEffect } from 'react'
import { useCamera, FILTERS } from '../hooks/useCamera'
import { useBoothSequencer } from '../hooks/useBoothSequencer'
import styles from './BoothScreen.module.css'

function ShotStrip({ photos, totalShots }) {
  return (
    <div className={styles.shotStrip}>
      {Array.from({ length: totalShots }).map((_, i) => (
        <div
          key={i}
          className={`${styles.shotSlot} ${photos[i] ? styles.shotFilled : ''}`}
        >
          {photos[i]
            ? <img src={photos[i]} alt={`Shot ${i + 1}`} />
            : <span>{i + 1}</span>}
        </div>
      ))}
    </div>
  )
}

function FilterBar({ selected, onChange }) {
  return (
    <div className={styles.filterBar} role="group" aria-label="Photo filters">
      {Object.entries(FILTERS).map(([id, { label }]) => (
        <button
          key={id}
          className={`${styles.filterPill} ${selected === id ? styles.filterActive : ''}`}
          onClick={() => onChange(id)}
          aria-pressed={selected === id}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

export default function BoothScreen({ onComplete, onHome }) {
  const [selectedFilter, setSelectedFilter] = useState('none')
  const { videoRef, canvasRef, cameraState, errorMessage, startCamera, stopCamera, capturePhoto } = useCamera()

  const { phase, countdown, shotIndex, photos, showFlash, totalShots, startSession, reset } =
    useBoothSequencer({
      capturePhoto,
      selectedFilter,
      onComplete: (capturedPhotos, filter) => {
        stopCamera()
        onComplete(capturedPhotos, filter)
      },
    })

  useEffect(() => {
    startCamera()
  }, [startCamera])

  const isRunning = phase !== 'idle'
  const isMirrored = true

  return (
    <div className={styles.booth}>
      <div className={styles.bgAura} />
      <div className={styles.bgGrid} />

      {showFlash && <div className={styles.flashOverlay} aria-hidden="true" />}

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
        <div className={styles.viewportWrapper}>
          <div className={styles.stageHeader}>
            <div>
              <p className={styles.stageEyebrow}>Live session</p>
              <h1 className={styles.stageTitle}>Compose your shot like a studio set.</h1>
            </div>
            <div className={styles.stageMeta}>
              <span>{totalShots} shots</span>
              <span className={styles.stageMetaDot} />
              <span>{FILTERS[selectedFilter]?.label ?? 'Normal'} mood</span>
            </div>
          </div>

          <div className={`${styles.viewport} ${cameraState === 'active' ? styles.viewportActive : ''}`}>
            {cameraState === 'requesting' && (
              <div className={styles.cameraMessage}>
                <div className={styles.loadingDots}>
                  <span /><span /><span />
                </div>
                <p>Requesting camera access...</p>
              </div>
            )}

            {cameraState === 'error' && (
              <div className={styles.cameraMessage}>
                <div className={styles.errorIcon}>CAM</div>
                <p className={styles.errorText}>{errorMessage}</p>
                <button className={styles.retryBtn} onClick={startCamera}>Try Again</button>
              </div>
            )}

            <video
              ref={videoRef}
              className={styles.video}
              style={{
                transform: isMirrored ? 'scaleX(-1)' : 'none',
                filter: FILTERS[selectedFilter]?.css || 'none',
                display: cameraState === 'active' ? 'block' : 'none',
              }}
              playsInline
              muted
              autoPlay
            />

            {phase === 'countdown' && (
              <div className={styles.countdownOverlay} aria-live="assertive" aria-label={`Photo ${shotIndex + 1} in ${countdown}`}>
                <div className={styles.countdownBubble}>
                  <span className={styles.countdownNum}>{countdown}</span>
                  <span className={styles.countdownLabel}>Shot {shotIndex + 1} of {totalShots}</span>
                </div>
              </div>
            )}

            {phase === 'flash' && (
              <div className={styles.captureFlash} aria-hidden="true">
                <span className={styles.snapText}>SNAP</span>
              </div>
            )}

            <div className={styles.cornerTL} />
            <div className={styles.cornerTR} />
            <div className={styles.cornerBL} />
            <div className={styles.cornerBR} />
          </div>

          <ShotStrip photos={photos} totalShots={totalShots} />
        </div>

        <aside className={styles.controls}>
          <div className={styles.controlsInner}>
            <div className={styles.sectionLabel}>Filter</div>
            <FilterBar selected={selectedFilter} onChange={v => { if (!isRunning) setSelectedFilter(v) }} />

            <div className={styles.divider} />

            <div className={styles.sectionLabel}>Session</div>

            <div className={styles.sessionStats}>
              <div className={styles.sessionStat}>
                <strong>{photos.length}</strong>
                <span>captured</span>
              </div>
              <div className={styles.sessionStat}>
                <strong>{totalShots}</strong>
                <span>planned</span>
              </div>
            </div>

            {!isRunning ? (
              <button
                className={styles.startBtn}
                onClick={startSession}
                disabled={cameraState !== 'active'}
                aria-label="Start photo session"
              >
                <span className={styles.startBtnIcon}>GO</span>
                <span>Start Session</span>
              </button>
            ) : (
              <div className={styles.runningState}>
                <div className={styles.pulse} />
                <span>
                  {phase === 'countdown' && 'Get ready...'}
                  {phase === 'flash' && 'Click!'}
                  {phase === 'between' && 'Nice one!'}
                  {phase === 'capturing' && 'Processing...'}
                </span>
              </div>
            )}

            {isRunning && (
              <button className={styles.cancelBtn} onClick={reset}>
                Cancel
              </button>
            )}

            <div className={styles.instructions}>
              <p>{totalShots} photos will be taken automatically with a countdown before each shot.</p>
            </div>

            <div className={styles.tipCard}>
              <span className={styles.tipLabel}>Best results</span>
              <p>Keep your face centered, step into soft light, and hold your pose through the flash.</p>
            </div>
          </div>
        </aside>
      </main>

      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  )
}
