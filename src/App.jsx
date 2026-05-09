import './styles/desktop.css'
import { useState, useEffect } from 'react'
import LoginScreen from './components/LoginScreen'
import Loader from './components/Loader'
import Desktop from './components/Desktop'
import './styles/login.css'

export default function App() {
  // stage переключает главные экраны игры:
  // loading -> login -> desktop.
  const [stage, setStage] = useState('loading')

  useEffect(() => {
    setTimeout(() => {
      setStage('login')
    }, 2000)
  }, [])

  if (stage === 'loading') return <Loader />

  if (stage === 'login') {
    return <LoginScreen onLogin={() => setStage('desktop')} />
  }

  return <Desktop />
}
