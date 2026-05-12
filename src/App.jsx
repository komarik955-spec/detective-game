import './styles/desktop.css'
import { useState, useEffect } from 'react'
import LoginScreen from './components/LoginScreen'
import Loader from './components/Loader'
import Desktop from './components/Desktop'
import RegistrationScreen from './components/RegistrationScreen'
import './styles/login.css'

export default function App() {
  const [stage, setStage] = useState('loading')
  const [playerData, setPlayerData] = useState(null)

  useEffect(() => {
    setTimeout(() => {
      setStage('registration')
    }, 2000)
  }, [])

  const handleRegistration = (data) => {
    setPlayerData(data)
    setStage('login')
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
