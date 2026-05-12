import { useState, useRef } from 'react'

export default function DesktopIcon({ id, icon, label, onOpen, onDelete }) {
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

  function handleDelete(e) {
    e.stopPropagation()
    if (onDelete) {
      onDelete(id)
    }
  }

  return (
    <div
      className={`desktop-icon ${selected ? 'selected' : ''} ${onDelete ? 'deletable' : ''}`}
      onClick={handleClick}
    >
      <div className="icon">{icon}</div>
      <div className="label">{label}</div>
      {onDelete && (
        <button className="delete-icon-btn" onClick={handleDelete} title="Удалить">
          ✕
        </button>
      )}
    </div>
  )
}