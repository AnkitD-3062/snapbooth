import { FILTERS } from '../hooks/useCamera'

/**
 * Renders a photo strip from an array of data URLs onto an offscreen canvas
 * and returns a download URL. The strip uses a classic white-border polaroid style.
 *
 * @param {string[]} photos  - Array of base64 image data URLs
 * @param {string}   filter  - Filter ID from FILTERS map
 * @param {string}   label   - Branding label for the strip footer
 * @returns {Promise<string>} Blob URL ready for download
 */
export async function renderPhotoStrip(photos, filter = 'none', label = 'SnapBooth') {
  const STRIP_WIDTH   = 400
  const PHOTO_WIDTH   = 340
  const PHOTO_HEIGHT  = 260
  const PADDING_X     = (STRIP_WIDTH - PHOTO_WIDTH) / 2
  const PADDING_TOP   = 28
  const PHOTO_GAP     = 18
  const FOOTER_HEIGHT = 64
  const STRIP_HEIGHT  =
    PADDING_TOP + photos.length * PHOTO_HEIGHT + (photos.length - 1) * PHOTO_GAP + FOOTER_HEIGHT

  const canvas = document.createElement('canvas')
  canvas.width  = STRIP_WIDTH * 2  // 2× for retina
  canvas.height = STRIP_HEIGHT * 2
  const ctx = canvas.getContext('2d')
  ctx.scale(2, 2)

  // Background
  ctx.fillStyle = '#FAFAFA'
  ctx.fillRect(0, 0, STRIP_WIDTH, STRIP_HEIGHT)

  // Subtle grain texture
  for (let i = 0; i < 4000; i++) {
    const x = Math.random() * STRIP_WIDTH
    const y = Math.random() * STRIP_HEIGHT
    ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.03})`
    ctx.fillRect(x, y, 1, 1)
  }

  // Load all images
  const loadImg = (src) => new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })

  const images = await Promise.all(photos.map(loadImg))

  // Draw each photo
  for (let i = 0; i < images.length; i++) {
    const y = PADDING_TOP + i * (PHOTO_HEIGHT + PHOTO_GAP)

    // Photo shadow
    ctx.save()
    ctx.shadowColor = 'rgba(0,0,0,0.12)'
    ctx.shadowBlur = 12
    ctx.shadowOffsetY = 4
    ctx.fillStyle = 'white'
    ctx.fillRect(PADDING_X, y, PHOTO_WIDTH, PHOTO_HEIGHT)
    ctx.restore()

    // Apply filter via globalCompositeOperation tricks or direct draw
    ctx.save()
    ctx.filter = FILTERS[filter]?.css || 'none'
    ctx.drawImage(images[i], PADDING_X, y, PHOTO_WIDTH, PHOTO_HEIGHT)
    ctx.filter = 'none'
    ctx.restore()

    // Thin border
    ctx.strokeStyle = 'rgba(0,0,0,0.07)'
    ctx.lineWidth = 1
    ctx.strokeRect(PADDING_X, y, PHOTO_WIDTH, PHOTO_HEIGHT)
  }

  // Footer branding
  const footerY = STRIP_HEIGHT - FOOTER_HEIGHT

  ctx.fillStyle = '#1A1A2E'
  ctx.fillRect(0, footerY, STRIP_WIDTH, FOOTER_HEIGHT)

  ctx.fillStyle = '#FF6B6B'
  ctx.font = 'bold 20px "Abril Fatface", Georgia, serif'
  ctx.textAlign = 'center'
  ctx.fillText(label, STRIP_WIDTH / 2, footerY + 28)

  ctx.fillStyle = 'rgba(255,255,255,0.4)'
  ctx.font = '500 10px "DM Sans", sans-serif'
  ctx.letterSpacing = '0.1em'
  ctx.fillText(new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase(), STRIP_WIDTH / 2, footerY + 48)

  return new Promise(resolve => canvas.toBlob(blob => resolve(URL.createObjectURL(blob)), 'image/jpeg', 0.95))
}
