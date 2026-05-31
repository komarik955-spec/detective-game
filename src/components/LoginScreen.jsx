import { useState, useEffect } from 'react'

export default function LoginScreen({ onLogin }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [stage, setStage] = useState('lock')
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()

    if (password === '1234') {
      setLoading(true)

      const audio = new Audio('/assets/sounds/login.mp3')
      audio.play()

      setTimeout(() => {
        onLogin()
      }, 1200)
    } else {
      setError(true)
      setTimeout(() => setError(false), 1200)
    }
  }

  const formatTime = (date) =>
    date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    })

  const formatDate = (date) =>
    date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
    })

  return (
    <div className="login-screen">

      {/* LOCK SCREEN */}
      {stage === 'lock' && (
        <div className="lock-screen" onClick={() => setStage('login')}>
          <div className="time">{formatTime(time)}</div>
          <div className="date">{formatDate(time)}</div>
        </div>
      )}

      {/* LOGIN */}
      {stage === 'login' && (
        <div className={`login-box ${loading ? 'fade-out' : ''}`}>
          
          <img src="/assets/logo.png" alt="Dark Trace" className="logo" />

          <h2 className="title">Dark Trace</h2>

          <form onSubmit={handleSubmit}>
            <input
              type="password"
              placeholder="Введите пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={error ? 'error shake' : ''}
              autoFocus
            />
          </form>

        </div>
      )}

    </div>
  )
}