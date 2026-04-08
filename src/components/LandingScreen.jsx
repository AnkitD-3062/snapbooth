import styles from './LandingScreen.module.css'

function FloatingCard({ style, rotation, emoji }) {
  return (
    <div className={styles.floatingCard} style={{ ...style, '--rot': rotation }}>
      <div className={styles.cardInner}>
        <div className={styles.cardPhoto} style={{ fontSize: '2rem' }}>{emoji}</div>
        <div className={styles.cardLine} />
      </div>
    </div>
  )
}

export default function LandingScreen({ onStart }) {
  return (
    <div className={styles.landing}>
      <div className={styles.grid} />
      <div className={styles.mesh} />
      <div className={styles.blob1} />
      <div className={styles.blob2} />
      <div className={styles.blob3} />

      <FloatingCard
        style={{ top: '12%', left: '6%', animationDelay: '0s' }}
        rotation="-8deg"
        emoji="*"
      />
      <FloatingCard
        style={{ top: '18%', right: '8%', animationDelay: '0.8s' }}
        rotation="6deg"
        emoji="+"
      />
      <FloatingCard
        style={{ bottom: '20%', left: '4%', animationDelay: '1.4s' }}
        rotation="4deg"
        emoji="o"
      />
      <FloatingCard
        style={{ bottom: '22%', right: '5%', animationDelay: '0.4s' }}
        rotation="-5deg"
        emoji="[]"
      />

      <div className={styles.heroShell}>
        <div className={`${styles.heroPanel} fade-up`}>
          <div className={styles.heroGlow} />

          <div className={styles.hero}>
            <div className={`${styles.badge} fade-up`}>
              Studio-Style Browser Photo Booth
            </div>

            <p className={`${styles.kicker} fade-up delay-1`}>
              Four portraits, one polished keepsake.
            </p>

            <h1 className={`${styles.headline} fade-up delay-2`}>
              Snap.<br />
              <span className={styles.accentWord}>Laugh.</span><br />
              Remember.
            </h1>

            <p className={`${styles.tagline} fade-up delay-3`}>
              A warmer, more editorial photo booth for quick portraits and instant strip
              downloads. Step in, choose a mood, and walk away with something worth saving.
            </p>

            <div className={`${styles.features} fade-up delay-4`}>
              <span className={styles.feature}><span>4x</span> auto burst</span>
              <span className={styles.featureDot}>/</span>
              <span className={styles.feature}><span>5</span> live filters</span>
              <span className={styles.featureDot}>/</span>
              <span className={styles.feature}><span>HD</span> strip export</span>
            </div>

            <div className={`${styles.ctaRow} fade-up delay-5`}>
              <button
                className={styles.ctaButton}
                onClick={onStart}
                aria-label="Start the photo booth"
              >
                <span>Open the Booth</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>

              <div className={styles.secondaryChip}>
                Camera in browser
                <span className={styles.secondaryChipDot} />
                Download instantly
              </div>
            </div>

            <div className={`${styles.metrics} fade-up delay-6`}>
              <div className={styles.metricCard}>
                <strong>4</strong>
                <span>curated frames</span>
              </div>
              <div className={styles.metricCard}>
                <strong>5</strong>
                <span>filter moods</span>
              </div>
              <div className={styles.metricCard}>
                <strong>1</strong>
                <span>clean keepsake strip</span>
              </div>
            </div>

            <p className={styles.subNote}>
              Camera access required. Works best on modern desktop and mobile browsers.
            </p>
          </div>
        </div>

        <div className={`${styles.heroPreview} fade-up delay-3`}>
          <div className={styles.previewBadge}>Preview strip</div>
          <div className={styles.previewStrip}>
            {['#f5c5b6', '#d4e7ff', '#d9f2dd', '#f8e2b6'].map((color, i) => (
              <div key={i} className={styles.previewShot} style={{ background: color }} />
            ))}
            <div className={styles.previewFooter}>
              <span>SnapBooth</span>
              <small>portrait memories</small>
            </div>
          </div>
        </div>
      </div>

      <div className={`${styles.stripPreview} fade-up delay-6`}>
        {['#FFD6D6', '#C8E6FF', '#D4F5E9', '#FFF3CC'].map((color, i) => (
          <div key={i} className={styles.previewFrame} style={{ background: color }} />
        ))}
        <div className={styles.previewLabel}>SnapBooth</div>
      </div>
    </div>
  )
}
