import React, { useState } from 'react'

/* Procedurally-generated SVG crime scene (no external assets) */
function CrimeSceneSVG() {
  return (
    <svg viewBox="0 0 640 420" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <defs>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
          <feColorMatrix type="saturate" values="0"/>
          <feBlend in="SourceGraphic" mode="multiply" result="blend"/>
          <feComposite in="blend" in2="SourceGraphic" operator="in"/>
        </filter>
        <radialGradient id="spotlight" cx="45%" cy="40%" r="50%">
          <stop offset="0%"   stopColor="#3a3a2a" stopOpacity="1"/>
          <stop offset="100%" stopColor="#0a0a0a" stopOpacity="1"/>
        </radialGradient>
        <pattern id="asphalt" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
          <rect width="4" height="4" fill="#1a1a1a"/>
          <rect x="1" y="1" width="1" height="1" fill="#222" opacity="0.5"/>
        </pattern>
      </defs>

      {/* Background - night scene */}
      <rect width="640" height="420" fill="#080810"/>

      {/* Sky gradient */}
      <rect width="640" height="220" fill="url(#spotlight)"/>

      {/* Ground / parking lot */}
      <rect y="220" width="640" height="200" fill="url(#asphalt)"/>

      {/* Parking lot lines */}
      <g stroke="#2a2a2a" strokeWidth="1" opacity="0.6">
        <line x1="80"  y1="220" x2="80"  y2="420"/>
        <line x1="180" y1="220" x2="180" y2="420"/>
        <line x1="280" y1="220" x2="280" y2="420"/>
        <line x1="380" y1="220" x2="380" y2="420"/>
        <line x1="480" y1="220" x2="480" y2="420"/>
        <line x1="580" y1="220" x2="580" y2="420"/>
        <line x1="0"   y1="320" x2="640" y2="320"/>
      </g>

      {/* Building silhouette */}
      <rect x="0" y="60" width="640" height="160" fill="#0d0d18"/>
      <rect x="0" y="60" width="640" height="4"   fill="#1a1a2e"/>

      {/* Building windows - dark with occasional lit */}
      {[0,1,2,3,4,5,6,7].map(col =>
        [0,1,2].map(row => (
          <rect key={`w${col}${row}`}
            x={20 + col * 76} y={80 + row * 38}
            width={40} height={24}
            fill={col === 3 && row === 1 ? '#2a2a10' : '#0a0a12'}
            stroke="#111122" strokeWidth="1"
          />
        ))
      )}

      {/* One lit window with red tint - suspicious */}
      <rect x="248" y="118" width="40" height="24" fill="#1a0a0a" opacity="0.9"/>
      <rect x="248" y="118" width="40" height="24" fill="#ff2200" opacity="0.08"/>

      {/* NovaChem sign */}
      <rect x="220" y="62" width="200" height="28" fill="#0a0a18"/>
      <text x="320" y="81" textAnchor="middle" fill="#cc2211" fontSize="14" fontFamily="monospace" fontWeight="bold" letterSpacing="3">
        NOVACHEM CORP
      </text>

      {/* Street lamp */}
      <line x1="520" y1="60" x2="520" y2="280" stroke="#2a2a3a" strokeWidth="4"/>
      <ellipse cx="520" cy="62" rx="16" ry="5" fill="#3a3a1a"/>
      <ellipse cx="520" cy="62" rx="14" ry="4" fill="#ffee88" opacity="0.9"/>
      {/* Lamp glow cone */}
      <path d="M504 62 L440 280 L600 280 Z" fill="#ffee44" opacity="0.03"/>
      <circle cx="520" cy="62" r="40" fill="#ffee44" opacity="0.04"/>

      {/* Abandoned car */}
      <rect x="90" y="246" width="120" height="54" rx="6" fill="#1a1a2a"/>
      <rect x="98" y="250" width="104" height="30" rx="4" fill="#141420"/>
      {/* Windows */}
      <rect x="104" y="254" width="40" height="20" rx="2" fill="#0d1520" opacity="0.9"/>
      <rect x="152" y="254" width="40" height="20" rx="2" fill="#0d1520" opacity="0.9"/>
      {/* Wheels */}
      <circle cx="114" cy="300" r="10" fill="#111"/>
      <circle cx="186" cy="300" r="10" fill="#111"/>
      <circle cx="114" cy="300" r="5"  fill="#1a1a1a"/>
      <circle cx="186" cy="300" r="5"  fill="#1a1a1a"/>
      {/* Door line */}
      <line x1="147" y1="246" x2="147" y2="300" stroke="#222233" strokeWidth="1"/>
      {/* Keys in ignition highlight */}
      <circle cx="140" cy="268" r="3" fill="#ffcc00" opacity="0.6"/>

      {/* Evidence markers */}
      {[
        { x: 240, y: 300, n: 1, label: 'Drag marks' },
        { x: 310, y: 340, n: 2, label: 'Footprint A (sz11)' },
        { x: 360, y: 310, n: 3, label: 'NC-7 residue' },
        { x: 420, y: 290, n: 4, label: 'Footprint B (sz6)' },
      ].map(m => (
        <g key={m.n}>
          <rect x={m.x - 10} y={m.y - 10} width={20} height={20} fill="#cc2200" opacity="0.85" rx="2"/>
          <text x={m.x} y={m.y + 5} textAnchor="middle" fill="#fff" fontSize="11" fontFamily="monospace" fontWeight="bold">{m.n}</text>
        </g>
      ))}

      {/* Drag marks in the lot */}
      <g opacity="0.4">
        <line x1="230" y1="290" x2="450" y2="340" stroke="#885500" strokeWidth="2" strokeDasharray="6 3"/>
        <line x1="238" y1="296" x2="458" y2="346" stroke="#885500" strokeWidth="1" strokeDasharray="6 3"/>
      </g>

      {/* Police tape */}
      <line x1="60"  y1="360" x2="600" y2="340" stroke="#ffcc00" strokeWidth="3" opacity="0.8"/>
      <line x1="60"  y1="366" x2="600" y2="346" stroke="#1a1a00" strokeWidth="2" strokeDasharray="20 20" opacity="0.8"/>
      <text x="200" y="357" fill="#ffcc00" fontSize="8" fontFamily="monospace" letterSpacing="4" opacity="0.9">
        POLICE LINE вЂ” DO NOT CROSS вЂ” POLICE LINE
      </text>

      {/* Photo overlay: date stamp */}
      <text x="10" y="415" fill="#ffcc00" fontSize="10" fontFamily="monospace" opacity="0.8">
        2024-03-17 06:42:11  CAM-E4  ASHFORD PD FORENSICS
      </text>

      {/* VHS-style scan artifact */}
      <rect x="0" y="200" width="640" height="2" fill="#fff" opacity="0.03"/>

      {/* Film grain overlay */}
      <rect width="640" height="420" filter="url(#grain)" opacity="0.18"/>

      {/* Slight vignette */}
      <radialGradient id="vign" cx="50%" cy="50%" r="70%">
        <stop offset="0%"   stopColor="transparent"/>
        <stop offset="100%" stopColor="rgba(0,0,0,0.5)"/>
      </radialGradient>
      <rect width="640" height="420" fill="url(#vign)"/>
    </svg>
  )
}

export default function ImageViewer({ file, initialZoom = 0.8 }) {
  const [zoom, setZoom] = useState(initialZoom)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  const hasSource = Boolean(file?.src)

  const handleWheel = (e) => {
    e.preventDefault()
    const zoomSpeed = 0.15
    const delta = e.deltaY > 0 ? -zoomSpeed : zoomSpeed
    const nextZoom = Math.min(5, Math.max(0.2, zoom + delta))
    setZoom(nextZoom)
  }

  const handlePointerDown = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    setIsDragging(true)
    setDragStart({
      x: e.clientX - offset.x,
      y: e.clientY - offset.y
    })
  }

  const handlePointerMove = (e) => {
    if (!isDragging) return
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    })
  }

  const handlePointerUp = (e) => {
    setIsDragging(false)
  }

  const resetView = () => {
    setZoom(initialZoom)
    setOffset({ x: 0, y: 0 })
  }

  return (
    <div className="img-viewer" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Toolbar */}
      <div className="viewer-toolbar">
        <span className="viewer-filename">{file.icon ?? '🖼️'} {file.name}</span>
        <div className="viewer-tools">
          <button className="viewer-btn" onClick={() => setZoom(z => Math.max(0.2, z - 0.2))}>-</button>
          <span className="viewer-meta">{Math.round(zoom * 100)}%</span>
          <button className="viewer-btn" onClick={() => setZoom(z => Math.min(5, z + 0.2))}>+</button>
          <button className="viewer-btn" onClick={resetView}>Reset</button>
        </div>
      </div>

      {file.caption && (
        <div className="img-caption">
          {file.caption}
        </div>
      )}

      {/* Forensic Viewport Area */}
      <div 
        className="img-viewport"
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{ 
          flex: 1,
          position: 'relative',
          overflow: 'hidden', // Clipping is handled here
          background: '#050508',
          cursor: isDragging ? 'grabbing' : 'grab',
          touchAction: 'none'
        }}
      >
        {/* Independent Transform Layer */}
        <div 
          className="img-transform-layer"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
            transition: isDragging ? 'none' : 'transform 0.1s ease-out',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none' // Events are handled by viewport
          }}
        >
          {hasSource ? (
            <img 
              src={file.src} 
              alt={file.name} 
              draggable={false}
              style={{
                display: 'block',
                maxWidth: 'none',
                maxHeight: 'none',
                // We don't use object-fit here to allow true independent scaling
                boxShadow: '0 0 40px rgba(0,0,0,0.8)',
                border: '1px solid rgba(181, 139, 99, 0.2)'
              }}
            />
          ) : (
            <div style={{ width: '640px', height: '420px' }}>
              <CrimeSceneSVG />
            </div>
          )}
        </div>
        
        {/* Viewport UI Overlay */}
        <div style={{
          position: 'absolute',
          bottom: '10px',
          left: '10px',
          pointerEvents: 'none',
          color: 'rgba(181, 139, 99, 0.4)',
          fontSize: '10px',
          fontFamily: 'monospace'
        }}>
          FORENSIC_VIEWPORT_ACTIVE [OFFSET_X: {Math.round(offset.x)} OFFSET_Y: {Math.round(offset.y)}]
        </div>
      </div>
    </div>
  )
}

