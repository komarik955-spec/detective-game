import React, { useState, useEffect } from 'react'

export default function Taskbar({
  openWindows,
  activeWindowId,
  onWindowFocus,
  onStartClick,
}) {
  const [time, setTime] = useState(getTime())

  useEffect(() => {
    const t = setInterval(() => setTime(getTime()), 1000)
    return () => clearInterval(t)
  }, [])

  function getTime() {
    return new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  return (
    <div className="taskbar">
      {/* Start button */}
      <div className="taskbar-start" onClick={onStartClick}>
        <span className="start-icon">⊞</span>
        <span className="taskbar-logo-text">Пуск</span>
      </div>

      {/* Open windows */}
      <div className="taskbar-windows">
        {openWindows.map(w => (
          <button
            key={w.id}
            className={`taskbar-btn ${
              w.id === activeWindowId && !w.minimized ? 'tb-active' : ''
            } ${w.minimized ? 'tb-minimized' : ''}`}
            onClick={() => onWindowFocus(w.id)}
            title={w.title}
          >
            <span className="tb-icon">{w.icon}</span>
            <span className="tb-label">{w.title}</span>
          </button>
        ))}
      </div>

      {/* System tray */}
      <div className="taskbar-tray">
        <span className="tray-item">📡</span>
        <span className="tray-item">🔊</span>
        <div className="tray-clock">{time}</div>
      </div>
    </div>
  )
}
