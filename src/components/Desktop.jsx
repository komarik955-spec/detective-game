import React, { useState, useEffect, createContext, useContext } from 'react'
import SystemNotification from './SystemNotification'
import Browser from './Browser'
import DesktopIcon from './DesktopIcon'
import Taskbar from './Taskbar'
import Window from './Window'
import FileExplorer from './FileExplorer'
import { useWM, WindowManagerProvider } from './WindowManager'

export const SecondMailContext = createContext(null)


/* =========================
   CONTENT
========================= */

function MyComputerContent() {
  return (
    <div className="placeholder-content">
      <div className="placeholder-icon">🖥️</div>
      <h2>My Computer</h2>

      <div className="drive-list">
        <div className="drive-item">
          💾 <span>C:\ Local Disk</span><em>120 GB free</em>
        </div>
        <div className="drive-item">
          💿 <span>D:\ Evidence Drive</span><em>44 GB free</em>
        </div>
        <div className="drive-item">
          🗂️ <span>E:\ Case Archive</span><em>8 GB free</em>
        </div>
      </div>
    </div>
  )
}

function Case001Content() {
  return <FileExplorer rootId="case001" />
}

function RecycleBinContent() {
  return <FileExplorer rootId="recycle" />
}

function PasswordNoteContent() {
  return (
    <div className="password-note-content" style={{
      padding: '20px',
      background: '#fff9c4',
      height: '100%',
      fontFamily: "'Segoe UI', sans-serif"
    }}>
      <div style={{
        background: '#fffde7',
        padding: '16px',
        borderRadius: '4px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        border: '1px solid #f0e68c'
      }}>
        <h3 style={{ margin: '0 0 12px 0', color: '#5d4037', fontSize: '16px' }}>
          📝 Данные для входа
        </h3>
        <div style={{ color: '#333', fontSize: '14px', lineHeight: '1.6' }}>
          <p style={{ margin: '8px 0' }}>
            <strong>OneMail:</strong>
          </p>
          <p style={{ margin: '4px 0' }}>
            Логин: <code style={{ background: '#e8eaf6', padding: '2px 6px', borderRadius: '3px' }}>Detectiv</code>
          </p>
          <p style={{ margin: '4px 0' }}>
            Пароль: <code style={{ background: '#e8eaf6', padding: '2px 6px', borderRadius: '3px' }}>12345</code>
          </p>
        </div>
        <p style={{ margin: '16px 0 0 0', fontSize: '12px', color: '#666', fontStyle: 'italic' }}>
          
        </p>
      </div>
    </div>
  )
}

/* =========================
   WINDOWS
========================= */

export const WINDOW_REGISTRY = {
  // Здесь перечислены приложения/окна, которые можно открыть с рабочего стола.
  // Для нового ярлыка добавь объект сюда и id в DESKTOP_ICONS ниже.
  mycomputer: {
    title: 'My Computer',
    icon: '🖥️',
    content: <MyComputerContent />,
    defaultWidth: 600,
    defaultHeight: 400,
  },

  recycle: {
    title: 'Recycle Bin',
    icon: '🗑️',
    content: <RecycleBinContent />,
    defaultWidth: 700,
    defaultHeight: 500,
  },

  case001: {
    title: 'Case 001 - The Vanishing',
    icon: '📁',
    content: <Case001Content />,
    defaultWidth: 860,
    defaultHeight: 560,
  },

  browser: {
    title: 'Browser',
    icon: '🌐',
    content: <Browser />,
    defaultWidth: 1000,
    defaultHeight: 700,
  },

  case_file: {
    title: 'Case DT-2025-08-21-SB',
    icon: '📄',
    content: (
      <div className="pdf-image-viewer">
        <img src="/assets/images/case-file.jpg" alt="Case File" />
      </div>
    ),
    defaultWidth: 550,
    defaultHeight: 850,
  },

  password_note: {
    title: 'Заметка',
    icon: '📝',
    content: <PasswordNoteContent />,
    defaultWidth: 280,
    defaultHeight: 220,
  },
}

/* =========================
   ICONS
========================= */

const DESKTOP_ICONS = [
  { id: 'mycomputer', icon: '🖥️', label: 'My Computer' },
  { id: 'recycle', icon: '🗑️', label: 'Recycle Bin' },
  { id: 'case001', icon: '📁', label: 'Case 001' },
  { id: 'browser', icon: '🌐', label: 'Browser' },
  { id: 'password_note', icon: '📝', label: 'Заметка' },
]

/* =========================
   INNER
========================= */

function DesktopInner() {
  const { open, windows, activeId, focus } = useWM()
  const [showNotif, setShowNotif] = useState(false)
  const [showSecondNotif, setShowSecondNotif] = useState(false)

  const handleSecondMailArrived = () => {
    setShowSecondNotif(true)
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNotif(true)
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

  function openWindow(id) {
    const meta = WINDOW_REGISTRY[id]
    if (meta) open(id, meta)
  }

  function handleDesktopClick(e) {
    const isDesktop =
      e.target.classList.contains('desktop') ||
      e.target.classList.contains('desktop-overlay')

    if (isDesktop) {
      document
        .querySelectorAll('.desktop-icon')
        .forEach(el => el.classList.remove('selected'))
    }
  }

  // Панель задач строится из реально открытых окон, включая динамические окна фото.
  const taskbarItems = windows.map(w => {
    const meta = WINDOW_REGISTRY[w.id] ?? w

    return {
      id: w.id,
      title: meta.title ?? w.id,
      icon: meta.icon ?? '🪟',
      minimized: w.minimized,
    }
  })
  return (
    <SecondMailContext.Provider value={handleSecondMailArrived}>
      <div className="desktop" onClick={handleDesktopClick}>
      
      {/* РРљРћРќРљР */}
      <div className="desktop-icons">
        {DESKTOP_ICONS.map(ic => (
          <DesktopIcon key={ic.id} {...ic} onOpen={openWindow} />
        ))}
      </div>

      {/* Р’РћР”РЇРќРћР™ Р—РќРђРљ */}
      <div className="desktop-watermark">
        CLASSIFIED вЂ” DARK TRACE OS вЂ” CASE #001
      </div>

      {/* Открытые окна */}
      {windows
        .filter(w => !w.minimized)
        .map(w => {
          const meta = WINDOW_REGISTRY[w.id] ?? w
          if (!meta) return null

          return (
            <Window
              key={w.id}
              id={w.id}
              title={meta.title}
              icon={meta.icon}
              defaultWidth={meta.defaultWidth}
              defaultHeight={meta.defaultHeight}
            >
              {meta.content}
            </Window>
          )
        })}

      {/* РЈР’Р•Р”РћРњР›Р•РќРР• */}
      {showNotif && (
        <SystemNotification
          title="OneMail"
          text="Новое сообщение: Инструктаж по делу"
          onClick={() => {
            const audio = new Audio('/assets/sounds/notification.mp3')
            audio.play().catch(() => {})
            setShowNotif(false)
            open('browser', WINDOW_REGISTRY['browser'])
          }}
        />
      )}

      {/* Р’РўРћР РћР• РЈР’Р•Р”РћРњР›Р•РќРР• */}
      {showSecondNotif && (
        <SystemNotification
          title="OneMail"
          text="Новое сообщение: Срочная информация"
          onClick={() => {
            const audio = new Audio('/assets/sounds/notification.mp3')
            audio.play().catch(() => {})
            setShowSecondNotif(false)
            open('browser', WINDOW_REGISTRY['browser'])
          }}
        />
      )}

      {/* РўРђРЎРљР‘РђР  */}
      <Taskbar
        openWindows={taskbarItems}
        activeWindowId={activeId}
        onWindowFocus={(id) => {
          const w = windows.find(x => x.id === id)

          if (w?.minimized) {
            open(id, WINDOW_REGISTRY[id] ?? w)
          } else {
            focus(id)
          }
        }}
        onStartClick={() => {}}
      />
    </div>
    </SecondMailContext.Provider>
  )
}

/* =========================
   EXPORT
========================= */

export default function Desktop() {
  return (
    <WindowManagerProvider>
      <DesktopInner />
    </WindowManagerProvider>
  )
}
