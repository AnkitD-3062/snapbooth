import { useState, useCallback, useRef } from 'react'

const TOTAL_SHOTS  = 4   // number of photos per session
const COUNTDOWN_FROM = 3  // seconds countdown before each shot
const DELAY_BETWEEN  = 1200 // ms pause after each capture before next countdown

export function useBoothSequencer({ capturePhoto, selectedFilter, onComplete }) {
  const [phase, setPhase]     = useState('idle')        // idle | countdown | flash | capturing | between | done
  const [countdown, setCountdown] = useState(COUNTDOWN_FROM)
  const [shotIndex, setShotIndex] = useState(0)
  const [photos, setPhotos]   = useState([])
  const [showFlash, setShowFlash] = useState(false)
  const timerRef = useRef(null)

  const clear = () => { if (timerRef.current) clearTimeout(timerRef.current) }

  // Plays a synthetic shutter click via Web Audio API
  const playShutter = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      const buf = ctx.createBuffer(1, ctx.sampleRate * 0.08, ctx.sampleRate)
      const data = buf.getChannelData(0)
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.02))
      }
      const src = ctx.createBufferSource()
      src.buffer = buf
      const gain = ctx.createGain()
      gain.gain.value = 0.4
      src.connect(gain)
      gain.connect(ctx.destination)
      src.start()
    } catch (_) { /* audio not supported, silently ignore */ }
  }

  const runCountdownForShot = useCallback((currentIndex, existingPhotos) => {
    setShotIndex(currentIndex)
    setPhase('countdown')
    let count = COUNTDOWN_FROM
    setCountdown(count)

    const tick = () => {
      count -= 1
      if (count > 0) {
        setCountdown(count)
        timerRef.current = setTimeout(tick, 1000)
      } else {
        // Countdown done → take the shot
        setPhase('flash')
        setShowFlash(true)
        playShutter()

        timerRef.current = setTimeout(() => {
          setShowFlash(false)

          const dataUrl = capturePhoto(selectedFilter)
          const newPhotos = [...existingPhotos, dataUrl]
          setPhotos(newPhotos)
          setPhase('capturing')

          if (newPhotos.length >= TOTAL_SHOTS) {
            // All shots done
            timerRef.current = setTimeout(() => {
              setPhase('done')
              onComplete(newPhotos, selectedFilter)
            }, 600)
          } else {
            // Brief pause before next countdown
            setPhase('between')
            timerRef.current = setTimeout(() => {
              runCountdownForShot(currentIndex + 1, newPhotos)
            }, DELAY_BETWEEN)
          }
        }, 120)
      }
    }

    timerRef.current = setTimeout(tick, 1000)
  }, [capturePhoto, selectedFilter, onComplete])

  const startSession = useCallback(() => {
    clear()
    setPhotos([])
    setShotIndex(0)
    runCountdownForShot(0, [])
  }, [runCountdownForShot])

  const reset = useCallback(() => {
    clear()
    setPhase('idle')
    setCountdown(COUNTDOWN_FROM)
    setShotIndex(0)
    setPhotos([])
    setShowFlash(false)
  }, [])

  return {
    phase,
    countdown,
    shotIndex,
    photos,
    showFlash,
    totalShots: TOTAL_SHOTS,
    startSession,
    reset,
  }
}
