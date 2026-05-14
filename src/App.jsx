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
    // Check for prototype mode via URL parameter
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('prototype') === 'call') {
      setIsPrototype(true)
      return
    }

    setTimeout(() => {
      setStage('registration')
    }, 2000)
  }, [])

  const handleRegistration = (data) => {
    setPlayerData(data)
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
