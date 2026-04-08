import { useState } from 'react'
import LandingScreen from './components/LandingScreen'
import BoothScreen from './components/BoothScreen'
import ReviewScreen from './components/ReviewScreen'

export default function App() {
  const [screen, setScreen] = useState('landing')
  const [capturedPhotos, setCapturedPhotos] = useState([])
  const [selectedFilter, setSelectedFilter] = useState('none')

  const handleStartBooth = () => setScreen('booth')

  const handlePhotosDone = (photos, filter) => {
    setCapturedPhotos(photos)
    setSelectedFilter(filter)
    setScreen('review')
  }

  const handleRetake = () => {
    setCapturedPhotos([])
    setSelectedFilter('none')
    setScreen('booth')
  }

  const handleHome = () => {
    setCapturedPhotos([])
    setSelectedFilter('none')
    setScreen('landing')
  }

  return (
    <div className="app">
      <div className={`screen-shell screen-${screen}`} key={screen}>
        {screen === 'landing' && (
          <LandingScreen onStart={handleStartBooth} />
        )}
        {screen === 'booth' && (
          <BoothScreen onComplete={handlePhotosDone} onHome={handleHome} />
        )}
        {screen === 'review' && (
          <ReviewScreen
            photos={capturedPhotos}
            filter={selectedFilter}
            onRetake={handleRetake}
            onHome={handleHome}
          />
        )}
      </div>
    </div>
  )
}
