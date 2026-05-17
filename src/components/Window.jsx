import React, { useRef, useState, useEffect, useCallback } from 'react'
import { useWM } from './WindowManager'

const MIN_W    = 280
const MIN_H    = 180
const TASKBAR  = 44
const MARGIN   = 12

function getViewport() {
  const isMobile = window.innerWidth <= 768
  return {
    w: window.innerWidth,
    h: Math.max(0, window.innerHeight - (isMobile ? 50 : TASKBAR)),
  }
}

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n))
}

function clampSize(width, height) {
  const vp = getViewport()
  const isMobile = window.innerWidth <= 768
  
  if (isMobile) {
    return { w: vp.w, h: vp.h }
  }

  const maxW = Math.max(MIN_W, Math.floor(vp.w - MARGIN * 2))
  const maxH = Math.max(MIN_H, Math.floor(vp.h - MARGIN * 2))
  return {
    w: clamp(Math.floor(width), MIN_W, maxW),
    h: clamp(Math.floor(height), MIN_H, maxH),
  }
}

function centerPos(w, h) {
  const vp = getViewport()
  const isMobile = window.innerWidth <= 768
  if (isMobile) return { x: 0, y: 0 }

  return {
    x: Math.floor((vp.w - w) / 2),
    y: Math.floor((vp.h - h) / 2),
  }
}

function clampPos(x, y, w, h) {
  const vp = getViewport()
  const isMobile = window.innerWidth <= 768
  if (isMobile) return { x: 0, y: 0 }

  return {
    x: clamp(Math.floor(x), 0, Math.max(0, vp.w - w)),
    y: clamp(Math.floor(y), 0, Math.max(0, vp.h - h)),
  }
}


export default function Window({
  id, title, icon, children,
  defaultWidth = 640, defaultHeight = 460,
  defaultX, defaultY,
}) {
  const { close, minimize, focus, activeId, windows } = useWM()
  const winData  = windows.find(w => w.id === id)
  const zIndex   = winData?.zIndex ?? 100
  const isActive = activeId === id

 /* Position + size */
const [size, setSize] = useState(() => clampSize(defaultWidth, defaultHeight))

const [pos, setPos] = useState(() => {
  const s = clampSize(defaultWidth, defaultHeight)
  const desired = (defaultX != null && defaultY != null)
    ? { x: defaultX, y: defaultY }
    : centerPos(s.w, s.h)
  return clampPos(desired.x, desired.y, s.w, s.h)
})

const [maximized, setMaximized] = useState(false)
const [prevSnap, setPrevSnap] = useState(null)
const [minimizing, setMinimizing] = useState(false)

/* Initialize / re-center on open */
useEffect(() => {
  const s = clampSize(defaultWidth, defaultHeight)
  setSize(s)

  const desired = (defaultX != null && defaultY != null)
    ? { x: defaultX, y: defaultY }
    : centerPos(s.w, s.h)
  setPos(clampPos(desired.x, desired.y, s.w, s.h))
}, [defaultWidth, defaultHeight, defaultX, defaultY])

/* Keep window inside viewport on resize */
useEffect(() => {
  function onResize() {
    if (maximized) return
    setSize(prev => {
      const next = clampSize(prev.w, prev.h)
      setPos(p => clampPos(p.x, p.y, next.w, next.h))
      return next
    })
  }

  window.addEventListener('resize', onResize)
  return () => window.removeEventListener('resize', onResize)
}, [maximized])

  /* Interaction refs */
  const dragging   = useRef(false)
  const dragOff    = useRef({ x: 0, y: 0 })
  const resizing   = useRef(false)
  const resizeDir  = useRef('')
  const startMouse = useRef({ x: 0, y: 0 })
  const startRect  = useRef({ x: 0, y: 0, w: 0, h: 0 })
  const sizeRef    = useRef(size)
  sizeRef.current  = size

  /* Drag: title bar */
  const onTitleDown = useCallback((e) => {
    if (maximized) return
    if (e.target.closest('.win-controls')) return
    dragging.current = true
    dragOff.current  = { x: e.clientX - pos.x, y: e.clientY - pos.y }
    focus(id)
    e.preventDefault()
  }, [maximized, pos, id, focus])

  /* Resize: edge handles */
  const onResizeDown = useCallback((e, dir) => {
    if (maximized) return
    resizing.current   = true
    resizeDir.current  = dir
    startMouse.current = { x: e.clientX, y: e.clientY }
    startRect.current  = { x: pos.x, y: pos.y, w: size.w, h: size.h }
    focus(id)
    e.preventDefault()
    e.stopPropagation()
  }, [maximized, pos, size, id, focus])

  /* Global mouse move / up */
  useEffect(() => {
    function onMove(e) {
      if (dragging.current) {
        const sw = sizeRef.current.w
        const sh = sizeRef.current.h
        setPos({
          x: Math.min(Math.max(0, e.clientX - dragOff.current.x), window.innerWidth  - sw),
          y: Math.min(Math.max(0, e.clientY - dragOff.current.y), window.innerHeight - sh - TASKBAR),
        })
        return
      }
      if (!resizing.current) return

      const dx  = e.clientX - startMouse.current.x
      const dy  = e.clientY - startMouse.current.y
      const dir = resizeDir.current
      const { x: ox, y: oy, w: ow, h: oh } = startRect.current

      let nx = ox, ny = oy, nw = ow, nh = oh

      if (dir.includes('e')) nw = Math.max(MIN_W, ow + dx)
      if (dir.includes('s')) nh = Math.max(MIN_H, oh + dy)
      if (dir.includes('w')) { nw = Math.max(MIN_W, ow - dx); nx = ox + ow - nw }
      if (dir.includes('n')) { nh = Math.max(MIN_H, oh - dy); ny = oy + oh - nh }

      const cs = clampSize(nw, nh)
      const cp = clampPos(nx, ny, cs.w, cs.h)
      setPos(cp)
      setSize(cs)
    }

    function onUp() {
      dragging.current = false
      resizing.current = false
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup',   onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup',   onUp)
    }
  }, [])

  /* Maximize / restore */
  function toggleMax() {
    if (maximized) {
      const s = clampSize(prevSnap.w, prevSnap.h)
      const p = clampPos(prevSnap.x, prevSnap.y, s.w, s.h)
      setPos(p)
      setSize(s)
      setMaximized(false)
    } else {
      setPrevSnap({ ...pos, ...size })
      setMaximized(true)
    }
  }

  const style = (maximized || window.innerWidth <= 768)
    ? { left: 0, top: 0, width: '100vw', height: `calc(100vh - ${window.innerWidth <= 768 ? 44 : TASKBAR}px)`, zIndex, borderRadius: 0 }
    : { left: pos.x, top: pos.y, width: size.w, height: size.h, zIndex }


  const handles = ['n','ne','e','se','s','sw','w','nw']


  return (
  <div
  className={`window ${isActive ? 'window-active' : 'window-inactive'} ${minimizing ? 'win-minimizing' : ''}`}
  style={style}
  onMouseDown={() => focus(id)}
>
      {/* Resize handles */}
      {(!maximized && window.innerWidth > 768) && handles.map(dir => (
        <div key={dir} className={`rh rh-${dir}`} onMouseDown={e => onResizeDown(e, dir)} />
      ))}


  {/* Title bar */}
<div
  className="win-titlebar"
  onMouseDown={(e) => {
    // РЅРµ РґР°С‘Рј С‚СЏРЅСѓС‚СЊ РѕРєРЅРѕ РїСЂРё РєР»РёРєРµ РЅР° РєРЅРѕРїРєРё
    if (e.target.closest('.win-controls')) return
    onTitleDown(e)
  }}
>
  <div
    className="win-focus-bar"
    style={{ opacity: isActive ? 1 : 0 }}
  />

  <div className="win-title">
    <span className="win-title-icon">{icon}</span>
    <span className="win-title-text">{title}</span>
  </div>

  <div className="win-controls">
  <button
  className="win-btn win-min"
  onClick={(e) => {
    e.stopPropagation()

    setMinimizing(true)

    setTimeout(() => {
      minimize(id)
      setMinimizing(false)
    }, 250)
  }}
>
  -
</button>

    <button
      className="win-btn win-max"
      onClick={(e) => {
        e.stopPropagation()
        toggleMax()
      }}
    >
      {maximized ? '[]' : '[ ]'}
    </button>

    <button
      className="win-btn win-cls"
      onClick={(e) => {
        e.stopPropagation()
        close(id)
      }}
    >
      x
    </button>
  </div>
</div>

      {/* Content */}
      <div className="win-body">{children}</div>
    </div>
  )
}
