import './styles/desktop.css'
import { useState, useEffect } from 'react'
import LoginScreen from './components/LoginScreen'
import Loader from './components/Loader'
import Desktop from './components/Desktop'
import RegistrationScreen from './components/RegistrationScreen'
import './styles/login.css'
import CallPrototype from './prototype/CallPrototype'

export default function App() {
  const [stage, setStage] = useState('loading')
  const [playerData, setPlayerData] = useState(null)
  const [isPrototype, setIsPrototype] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      const baseWidth = 1920
      const currentWidth = window.innerWidth
      const scale = Math.min(Math.max(currentWidth / baseWidth, 0.6), 1.5)
      document.documentElement.style.setProperty('--app-scale', scale.toString())
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    // Check for prototype mode via URL parameter
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('prototype') === 'call') {
      setIsPrototype(true)
      return
    }

    setTimeout(() => {
      const saved = localStorage.getItem('dt_playerData')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          if (parsed?.fullName && parsed?.employeeId) {
            setPlayerData(parsed)
            setStage('login')
            return
          }
        } catch {}
      }

      setStage('registration')
    }, 2000)
  }, [])

  const handleRegistration = (data) => {
    setPlayerData(data)
    try {
      localStorage.setItem('dt_playerData', JSON.stringify(data))
    } catch {}
    setStage('login')
  }

  // Render prototype if activated
  if (isPrototype) {
    return <CallPrototype />
  }

  if (stage === 'loading') return <Loader />

  if (stage === 'registration') {
    return <RegistrationScreen onRegistration={handleRegistration} />
  }

  if (stage === 'login') {
    return <LoginScreen onLogin={() => setStage('desktop')} />
  }

  return <Desktop playerData={playerData} />
}
