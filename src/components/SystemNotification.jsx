import { useEffect, useState } from 'react'

export default function SystemNotification({ title, text, onClick }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true)

      // Notification sound.
      const audio = new Audio('/assets/sounds/notification.mp3')
      audio.volume = 0.4
      audio.play().catch(() => {})
    }, 300)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      className={`sys-notif ${show ? 'show' : ''}`}
      onClick={onClick}
    >
      <div className="sys-notif-icon">📧</div>

      <div className="sys-notif-body">
        <div className="sys-notif-title">{title}</div>
        <div className="sys-notif-text">{text}</div>
      </div>

      <div className="sys-notif-time">
        {new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </div>
    </div>
  )
}
