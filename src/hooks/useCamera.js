import { useRef, useState, useCallback, useEffect } from 'react'

// CSS filter strings mapped to filter IDs
export const FILTERS = {
  none:    { label: 'Normal',   css: 'none' },
  bw:      { label: 'B&W',      css: 'grayscale(100%) contrast(1.1)' },
  warm:    { label: 'Warm',     css: 'saturate(1.4) sepia(0.35) brightness(1.05)' },
  vintage: { label: 'Vintage',  css: 'sepia(0.6) contrast(0.9) brightness(1.05) saturate(0.8)' },
  cool:    { label: 'Cool',     css: 'saturate(0.9) hue-rotate(20deg) brightness(1.05)' },
}

export function useCamera() {
  const videoRef    = useRef(null)
  const canvasRef   = useRef(null)
  const streamRef   = useRef(null)

  const [cameraState, setCameraState] = useState('idle') // idle | requesting | active | error
  const [errorMessage, setErrorMessage] = useState('')

  const startCamera = useCallback(async () => {
    setCameraState('requesting')
    try {
      const constraints = {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user', // front camera
        },
        audio: false,
      }
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
        setCameraState('active')
      }
    } catch (err) {
      let msg = 'Camera access was denied.'
      if (err.name === 'NotFoundError')      msg = 'No camera was found on this device.'
      if (err.name === 'NotAllowedError')    msg = 'Camera permission was denied. Please allow camera access and try again.'
      if (err.name === 'NotSupportedError')  msg = 'Your browser does not support camera access. Try Chrome or Firefox.'
      if (err.name === 'OverconstrainedError') msg = 'Camera constraints could not be satisfied. Trying anyway…'
      setErrorMessage(msg)
      setCameraState('error')
    }
  }, [])

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setCameraState('idle')
  }, [])

  // Capture current video frame to a data URL, applying a CSS filter via canvas
  const capturePhoto = useCallback((filterId = 'none') => {
    const video  = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return null

    const w = video.videoWidth  || 640
    const h = video.videoHeight || 480
    canvas.width  = w
    canvas.height = h

    const ctx = canvas.getContext('2d')

    // Mirror horizontally (selfie-mode feel)
    ctx.save()
    ctx.translate(w, 0)
    ctx.scale(-1, 1)

    // Apply filter on canvas
    ctx.filter = FILTERS[filterId]?.css || 'none'
    ctx.drawImage(video, 0, 0, w, h)
    ctx.restore()

    return canvas.toDataURL('image/jpeg', 0.92)
  }, [])

  // Clean up on unmount
  useEffect(() => () => stopCamera(), [stopCamera])

  return { videoRef, canvasRef, cameraState, errorMessage, startCamera, stopCamera, capturePhoto }
}
