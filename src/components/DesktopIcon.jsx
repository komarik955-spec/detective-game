import { useState, useRef } from 'react'

export default function DesktopIcon({ id, icon, label, onOpen }) {
  const [selected, setSelected] = useState(false)
  const clickTimer = useRef(null)

  function handleClick(e) {
    e.stopPropagation()

    // второй клик → открыть
    if (clickTimer.current) {
      clearTimeout(clickTimer.current)
      clickTimer.current = null
      onOpen(id)
      return
    }

    // первый клик → выделение
    setSelected(true)

    clickTimer.current = setTimeout(() => {
      clickTimer.current = null
    }, 250)
  }

  return (
    <div
      className={`desktop-icon ${selected ? 'selected' : ''}`}
      onClick={handleClick}
    >
      <div className="icon">{icon}</div>
      <div className="label">{label}</div>
    </div>
  )
}