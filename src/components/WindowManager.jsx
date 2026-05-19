import React, { createContext, useContext, useState, useCallback } from 'react'

const WMContext = createContext(null)

export function useWM() {
  return useContext(WMContext)
}

let zTop = 100

export function WindowManagerProvider({ children }) {
  // windows - список всех открытых окон. Сюда попадают и обычные приложения,
  // и динамические окна, например просмотр фото из проводника.
  const [windows, setWindows] = useState([])
  const [activeId, setActiveId] = useState(null)

  /* ── Focus (bring to front) ── */
  const focus = useCallback((id) => {
    setActiveId(id)
    setWindows(prev => {
      const target = prev.find(w => w.id === id)
      if (!target) return prev
      
      return prev.map(w => {
        if (w.id === id) {
          return { ...w, zIndex: zTop, minimized: false }
        }
        return w
      })
    })
  }, [])


  /* ── Open / Restore ── */
  const open = useCallback((id, meta) => {
    setWindows(prev => {
      const existing = prev.find(w => w.id === id)

      if (existing) {
        zTop++
        return prev.map(w =>
          w.id === id
            ? { ...w, minimized: false, zIndex: zTop }
            : w
        )
      }

      zTop++
      return [
        ...prev,
        {
          id,
          ...meta,
          minimized: false,
          zIndex: zTop,
        },
      ]
    })

    setActiveId(id)
  }, [])

  /* ── Close ── */
  const close = useCallback((id) => {
    setWindows(prev => prev.filter(w => w.id !== id))
    setActiveId(prev => (prev === id ? null : prev))
  }, [])

  /* ── Minimize ── */
  const minimize = useCallback((id) => {
    setWindows(prev =>
      prev.map(w =>
        w.id === id ? { ...w, minimized: true } : w
      )
    )
    setActiveId(null)
  }, [])

  return (
    <WMContext.Provider
      value={{ windows, activeId, open, close, focus, minimize }}
    >
      {children}
    </WMContext.Provider>
  )
}
