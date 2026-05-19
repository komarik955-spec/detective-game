import React, { useState, useEffect, createContext, useContext } from 'react'

import SystemNotification from './SystemNotification'

import Browser from './Browser'

import DesktopIcon from './DesktopIcon'

import Taskbar from './Taskbar'

import Window from './Window'

import FileExplorer from './FileExplorer'

import { useWM, WindowManagerProvider } from './WindowManager'

import { getSavedFiles, removeSavedFile } from '../utils/fileActions'

import VesperCallSystem from './VesperCallSystem'

import DetectiveMap from '../apps/DetectiveMap'




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
    defaultWidth: 800,
    defaultHeight: 550,
  },

  recycle: {
    title: 'Recycle Bin',
    icon: '🗑️',

    content: <RecycleBinContent />,

    defaultWidth: 800,

    defaultHeight: 550,

  },



  case001: {

    title: 'Case 001 - The Vanishing',

    icon: '📁',

    content: <Case001Content />,

    defaultWidth: 1000,

    defaultHeight: 700,

  },



  

  browser: {

    title: 'Bhrome',

    icon: '🌐',

    content: (playerData) => <Browser playerData={playerData} />,

    defaultWidth: 1200,

    defaultHeight: 800,

  },



  case_file: {

    title: 'Case DT-2025-08-21-SB',

    icon: '📄',

    content: (

      <div className="pdf-image-viewer">

        <img src="/assets/images/case-file.jpg" alt="Case File" />

      </div>

    ),

    defaultWidth: 600,

    defaultHeight: 850,

  },




  password_note: {

    title: 'Заметка',

    icon: '📝',

    content: <PasswordNoteContent />,

    defaultWidth: 280,

    defaultHeight: 220,

  },

  map: {
    title: 'Geographic Analysis System',
    icon: '🗺️',
    content: <DetectiveMap />,
    defaultWidth: 2028,
    defaultHeight: 1457,
  },



}




/* =========================

   ICONS

========================= */



const DESKTOP_ICONS = [

  { id: 'mycomputer', icon: '🖥️', label: 'My Computer' },

  { id: 'recycle', icon: '🗑️', label: 'Recycle Bin' },

  { id: 'case001', icon: '📁', label: 'Case 001' },

  { id: 'browser', icon: '🌐', label: 'Bhrome' },

  { id: 'map', icon: '🗺️', label: 'Карта' },

  { id: 'password_note', icon: '📝', label: 'Заметка' },

]




/* =========================

   INNER

========================= */



function DesktopInner({ playerData }) {

  const { open, windows, activeId, focus } = useWM()

  

  // Fallback to prevent undefined errors

  const safePlayerData = playerData || { firstName: '', lastName: '', fullName: '', employeeId: '' }

  const [showNotif, setShowNotif] = useState(false)


  const [savedFiles, setSavedFiles] = useState([])

  const [vesperCallCompleted, setVesperCallCompleted] = useState(false)

  // Load saved files from sessionStorage
  useEffect(() => {
    const files = getSavedFiles()
    setSavedFiles(files)
  }, [])

  // Listen for changes to saved files (from other components)
  useEffect(() => {
    const handleStorageChange = () => {
      const files = getSavedFiles()
      setSavedFiles(files)
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('savedFilesChanged', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('savedFilesChanged', handleStorageChange)
    }
  }, [])



  const handleSecondMailArrived = () => {
    setShowNotif(true)
  }





  // Handle Vesper call completion
  const handleVesperCallComplete = () => {
    setVesperCallCompleted(true)
    // After endCall(): wait 2 seconds, then show existing OneMail notification
    setTimeout(() => {
      setShowNotif(true)
    }, 2000)
  }



  function openWindow(id) {

    const meta = WINDOW_REGISTRY[id]

    if (meta) open(id, meta)

  }

  // Function to open saved files
  function openSavedFile(file) {
    const windowId = `saved_file_${file.id}`
    
    // Check if window is already open
    if (windows.some(w => w.id === windowId)) {
      focus(windowId)
      return
    }

    // Create window metadata for saved file
    const fileWindowMeta = {
      title: file.name,
      icon: getFileIcon(file.type),
      defaultWidth: 600,
      defaultHeight: 500,
      content: (
        <div className="saved-file-viewer">
          <div className="file-viewer-header">
            <span className="file-name">{file.name}</span>
            <span className="file-size">{file.size}</span>
          </div>
          <div className="file-viewer-content">
            {file.type === 'image' ? (
              <img src={file.url} alt={file.name} style={{ maxWidth: '100%', maxHeight: '100%' }} />
            ) : (
              <div className="file-placeholder">
                <div className="placeholder-icon">{getFileIcon(file.type)}</div>
                <p>File: {file.name}</p>
                <p>Type: {file.type}</p>
                <p>Size: {file.size}</p>
              </div>
            )}
          </div>
        </div>
      )
    }

    open(windowId, fileWindowMeta)
  }

  // Helper to get file icon
  function getFileIcon(type) {
    const icons = {
      pdf: '📄',
      image: '🖼️',
      text: '📝',
      archive: '📦',
      video: '🎬',
      audio: '🎵'
    }
    return icons[type] || '📁'
  }

  // Function to delete saved file
  function deleteSavedFile(fileId) {
    if (removeSavedFile(fileId)) {
      const files = getSavedFiles()
      setSavedFiles(files)
    }
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

      

      {/* ИКОНКИ */}

      <div className="desktop-icons">

        {DESKTOP_ICONS.map(ic => (

          <DesktopIcon key={ic.id} {...ic} onOpen={openWindow} />

        ))}

        {/* Saved files icons */}

        {savedFiles.map(file => (

          <DesktopIcon

            key={file.id}

            id={`saved_${file.id}`}

            icon={getFileIcon(file.type)}

            label={file.name}

            onOpen={() => openSavedFile(file)}

            onDelete={() => deleteSavedFile(file.id)}

          />

        ))}

      </div>



      {/* ВОДЯНОЙ ЗНАК */}

      <div className="desktop-watermark">

        CLASSIFIED вЂ” DARK TRACE OS вЂ” CASE #001

      </div>

       {/* VESPER CALL */}
       <VesperCallSystem onCallComplete={handleVesperCallComplete} />



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

              {typeof meta.content === 'function' ? meta.content(safePlayerData) : meta.content}

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



      {/* Второе уведомление отключено по дизайну */}



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



export default function Desktop({ playerData }) {

  return (

    <WindowManagerProvider>

      <DesktopInner playerData={playerData} />

    </WindowManagerProvider>

  )

}

