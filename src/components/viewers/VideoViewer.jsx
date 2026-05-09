import React, { useState, useEffect, useRef } from 'react'

/* ── Simulated surveillance footage using animated SVG + Canvas ── */
function SurveillancePlayer({ playing, currentTime, duration }) {
  const canvasRef = useRef(null)
  const frameRef  = useRef(0)
  const rafRef    = useRef(null)

  // Scene objects that move
  const figureX = useRef(680)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    function drawFrame() {
      const w = canvas.width
      const h = canvas.height
      const t = frameRef.current

      // -- Background: dark parking lot --
      ctx.fillStyle = '#070710'
      ctx.fillRect(0, 0, w, h)

      // Ground
      ctx.fillStyle = '#0d0d15'
      ctx.fillRect(0, h * 0.55, w, h)

      // Building outline
      ctx.fillStyle = '#0a0a16'
      ctx.fillRect(0, 0, w, h * 0.58)
      ctx.fillStyle = '#111128'
      ctx.fillRect(0, h * 0.55, w, 3)

      // Windows
      for (let col = 0; col < 8; col++) {
        for (let row = 0; row < 3; row++) {
          const lit = (col === 3 && row === 1)
          ctx.fillStyle = lit
            ? `rgba(80,60,0,${0.4 + 0.1 * Math.sin(t * 0.05)})`
            : '#09090f'
          ctx.fillRect(30 + col * 80, 30 + row * 50, 44, 30)
        }
      }

      // NovaChem sign
      ctx.fillStyle = '#cc1100'
      ctx.font      = 'bold 13px monospace'
      ctx.fillText('NOVACHEM CORP', 230, 22)

      // Street lamp cone
      ctx.beginPath()
      ctx.moveTo(540, 0)
      ctx.lineTo(460, h)
      ctx.lineTo(620, h)
      ctx.closePath()
      ctx.fillStyle = 'rgba(255,240,100,0.025)'
      ctx.fill()

      // Lamp glow
      const grd = ctx.createRadialGradient(540, 8, 0, 540, 8, 60)
      grd.addColorStop(0,   'rgba(255,240,100,0.15)')
      grd.addColorStop(1,   'rgba(255,240,100,0)')
      ctx.fillStyle = grd
      ctx.beginPath()
      ctx.arc(540, 8, 60, 0, Math.PI * 2)
      ctx.fill()

      // Parked car (static)
      ctx.fillStyle = '#181828'
      ctx.beginPath()
      ctx.roundRect(80, h * 0.6, 130, 60, 6)
      ctx.fill()
      ctx.fillStyle = '#0d1018'
      ctx.fillRect(90, h * 0.62, 50, 28)
      ctx.fillRect(148, h * 0.62, 50, 28)

      // Moving figure (suspect)
      if (playing || t > 0) {
        figureX.current = Math.max(260, figureX.current - (playing ? 1.2 : 0))

        const fx = figureX.current
        const fy = h * 0.58

        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.4)'
        ctx.beginPath()
        ctx.ellipse(fx, fy + 62, 14, 5, 0, 0, Math.PI * 2)
        ctx.fill()

        // Body
        ctx.fillStyle = '#222232'
        ctx.fillRect(fx - 10, fy + 16, 20, 36)

        // Head
        ctx.fillStyle = '#2a2a3a'
        ctx.beginPath()
        ctx.arc(fx, fy + 12, 12, 0, Math.PI * 2)
        ctx.fill()

        // Arm swing
        const swing = Math.sin(t * 0.18) * 8
        ctx.strokeStyle = '#222232'
        ctx.lineWidth   = 5
        ctx.beginPath()
        ctx.moveTo(fx - 10, fy + 22)
        ctx.lineTo(fx - 18, fy + 40 + swing)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(fx + 10, fy + 22)
        ctx.lineTo(fx + 18, fy + 40 - swing)
        ctx.stroke()

        // Legs
        const legSwing = Math.sin(t * 0.18) * 6
        ctx.beginPath()
        ctx.moveTo(fx - 5, fy + 52)
        ctx.lineTo(fx - 8, fy + 68 + legSwing)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(fx + 5, fy + 52)
        ctx.lineTo(fx + 8, fy + 68 - legSwing)
        ctx.stroke()

        // Carried object glint
        if (fx < 400) {
          ctx.fillStyle = `rgba(200,200,255,${0.3 + 0.2 * Math.sin(t * 0.1)})`
          ctx.fillRect(fx + 14, fy + 28, 8, 12)
        }
      }

      // Timestamp
      const totalSecs = 85740 + Math.floor(currentTime)  // 23:49:00 base
      const hh = String(Math.floor(totalSecs / 3600) % 24).padStart(2, '0')
      const mm = String(Math.floor((totalSecs % 3600) / 60)).padStart(2, '0')
      const ss = String(totalSecs % 60).padStart(2, '0')
      ctx.fillStyle  = '#ffffff'
      ctx.font       = '11px monospace'
      ctx.globalAlpha = 0.75
      ctx.fillText(`2024-03-14  ${hh}:${mm}:${ss}`, 10, h - 28)
      ctx.fillText('CAM-E1  EAST ENTRANCE  REC●', 10, h - 14)
      ctx.fillText('NOVACHEM SECURITY SYSTEMS', w - 190, h - 14)
      ctx.globalAlpha = 1

      // Scan line
      const scanY = (t * 2) % h
      ctx.fillStyle = 'rgba(255,255,255,0.04)'
      ctx.fillRect(0, scanY, w, 1)

      // CRT vignette
      const vign = ctx.createRadialGradient(w/2, h/2, h*0.3, w/2, h/2, h*0.8)
      vign.addColorStop(0, 'transparent')
      vign.addColorStop(1, 'rgba(0,0,0,0.5)')
      ctx.fillStyle = vign
      ctx.fillRect(0, 0, w, h)

      // REC blink
      if (Math.floor(t / 30) % 2 === 0) {
        ctx.fillStyle = '#ff2200'
        ctx.beginPath()
        ctx.arc(w - 20, 14, 5, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = '#ffffff'
        ctx.font = '10px monospace'
        ctx.fillText('REC', w - 50, 18)
      }

      if (playing) frameRef.current++
      rafRef.current = requestAnimationFrame(drawFrame)
    }

    rafRef.current = requestAnimationFrame(drawFrame)
    return () => cancelAnimationFrame(rafRef.current)
  }, [playing, currentTime])

  return (
    <canvas
      ref={canvasRef}
      width={680}
      height={400}
      style={{ width: '100%', height: '100%', display: 'block' }}
    />
  )
}

/* ── Main VideoViewer component ── */
export default function VideoViewer({ file }) {
  const [playing,  setPlaying]  = useState(false)
  const [time,     setTime]     = useState(0)
  const [duration] = useState(120)   // 2-minute clip
  const intervalRef = useRef(null)

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setTime(t => {
          if (t >= duration) { setPlaying(false); return duration }
          return t + 0.25
        })
      }, 250)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [playing, duration])

  function toggle()  { setPlaying(p => !p) }
  function restart() { setTime(0); setPlaying(false) }

  const pct = (time / duration) * 100

  // Seek
  function seek(e) {
    const rect = e.currentTarget.getBoundingClientRect()
    const x    = e.clientX - rect.left
    setTime((x / rect.width) * duration)
  }

  function fmtTime(s) {
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${String(sec).padStart(2, '0')}`
  }

  return (
    <div className="video-viewer">
      <div className="viewer-toolbar">
        <span className="viewer-filename">{file.icon} {file.name}</span>
        <span className="viewer-meta">{file.caption}</span>
      </div>

      {/* Player */}
      <div className="video-screen">
        <SurveillancePlayer playing={playing} currentTime={time} duration={duration} />
      </div>

      {/* Controls */}
      <div className="video-controls">
        <button className="video-btn" onClick={toggle}>
          {playing ? '⏸' : '▶'}
        </button>
        <button className="video-btn" onClick={restart}>⏮</button>

        {/* Scrub bar */}
        <div className="video-scrub" onClick={seek}>
          <div className="video-scrub-fill" style={{ width: `${pct}%` }} />
          <div className="video-scrub-thumb" style={{ left: `${pct}%` }} />
        </div>

        <span className="video-time">
          {fmtTime(time)} / {fmtTime(duration)}
        </span>
      </div>

      {/* Hint: key clue timestamp */}
      {time >= 45 && time < 50 && (
        <div className="video-clue-banner">
          ⚠ OBJECT IDENTIFIED — possible chemical container — frame {Math.floor(time * 4)}
        </div>
      )}
    </div>
  )
}
