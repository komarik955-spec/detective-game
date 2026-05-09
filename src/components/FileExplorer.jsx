import React, { useState } from 'react'
import { FILE_SYSTEM, getChildren } from '../data/fileSystem'
import TextViewer from './viewers/TextViewer'
import ImageViewer from './viewers/ImageViewer'
import VideoViewer from './viewers/VideoViewer'
import { useWM } from './WindowManager'

const ICON_MAP = { folder: '📁', txt: '📄', image: '🖼️', img: '🖼️', video: '🎬' }

function getIcon(file) {
  return file?.icon ?? ICON_MAP[file?.type] ?? '📄'
}

export default function FileExplorer({ rootId = 'case001', unlockedFiles = [] }) {
  // Current folder path, for example: ['case001', 'profiles'].
  const [path, setPath] = useState([rootId])

  // Text files open inside Explorer. Images open in a separate Photos window.
  const [openFile, setOpenFile] = useState(null)
  const { open } = useWM()

  const currentId = path[path.length - 1]
  const current = FILE_SYSTEM[currentId]
  const children = current?.type === 'folder' ? getChildren(currentId) : []

  function navigate(id) {
    const node = FILE_SYSTEM[id]
    if (!node) return

    if (node.type === 'folder') {
      setPath(p => [...p, id])
      setOpenFile(null)
      return
    }

    openFileNode(id, node)
  }

  function openFileNode(id, node) {
    if (node.locked && !unlockedFiles.includes(id)) {
      setOpenFile({ id, file: null, locked: true })
      return
    }

    // Images open in a separate window, like on a normal PC.
    if (node.type === 'image' || node.type === 'img') {
      open(`photos-${id}`, {
        title: node.name,
        icon: getIcon(node),
        content: <ImageViewer file={node} initialZoom={0.8} />,
        defaultWidth: 840,
        defaultHeight: 1000,
      })
      return
    }

    setOpenFile({ id, file: node })
  }

  function goBack() {
    if (path.length <= 1) return
    setPath(p => p.slice(0, -1))
    setOpenFile(null)
  }

  function goUp() {
    goBack()
  }

  const breadcrumb = path.map((id, i) => ({
    id,
    name: FILE_SYSTEM[id]?.name ?? id,
    isLast: i === path.length - 1,
  }))

  function renderViewer() {
    if (!openFile) return null

    if (openFile.locked) {
      return (
        <div className="file-locked">
          <div className="file-locked-icon">🔒</div>
          <h3>Access Denied</h3>
          <p>This file is encrypted or restricted.</p>
          <p className="dimtext">Investigate more to unlock it.</p>
        </div>
      )
    }

    const f = openFile.file
    if (f.type === 'txt') return <TextViewer file={f} />
    if (f.type === 'image' || f.type === 'img') return <ImageViewer file={f} />
    if (f.type === 'video') return <VideoViewer file={f} />

    return <div className="placeholder-content"><p>Unsupported file type.</p></div>
  }

  return (
    <div className="explorer">
      {/* Address bar */}
      <div className="explorer-bar">
        <button className="ex-nav-btn" onClick={goBack} disabled={path.length <= 1}>Back</button>
        <button className="ex-nav-btn" onClick={goUp} disabled={path.length <= 1}>Up</button>

        <div className="ex-breadcrumb">
          {breadcrumb.map((b, i) => (
            <span key={b.id}>
              <button
                className={`ex-crumb ${b.isLast ? 'ex-crumb-active' : ''}`}
                onClick={() => {
                  if (!b.isLast) setPath(path.slice(0, i + 1))
                  setOpenFile(null)
                }}
              >
                {getIcon(FILE_SYSTEM[b.id])} {b.name}
              </button>
              {!b.isLast && <span className="ex-sep">/</span>}
            </span>
          ))}
        </div>

        <span className="ex-count">{children.length} item{children.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="explorer-body">
        {/* Sidebar */}
        <div className="explorer-sidebar">
          <div className="sidebar-section">CASE FILES</div>
          {getChildren('case001').map(f => (
            <div
              key={f.id}
              className={`sidebar-item ${openFile?.id === f.id ? 'sidebar-active' : ''} ${f.locked && !unlockedFiles.includes(f.id) ? 'sidebar-locked' : ''}`}
              onClick={() => openFileNode(f.id, f)}
            >
              <span>{getIcon(f)}</span>
              <span className="sidebar-name">{f.name}</span>
              {f.locked && !unlockedFiles.includes(f.id) && <span className="sidebar-lock">🔒</span>}
            </div>
          ))}
        </div>

        {/* Main pane */}
        <div className="explorer-main">
          {openFile ? (
            <div className="explorer-viewer">
              {renderViewer()}
            </div>
          ) : (
            <div className="explorer-grid">
              {children.map(f => (
                <div
                  key={f.id}
                  className={`file-tile ${f.locked && !unlockedFiles.includes(f.id) ? 'file-locked-tile' : ''}`}
                  onDoubleClick={() => navigate(f.id)}
                >
                  <div className="file-tile-icon">
                    {f.locked && !unlockedFiles.includes(f.id) ? '🔒' : getIcon(f)}
                  </div>
                  <span className="file-tile-name">{f.name}</span>
                  <span className="file-tile-type">{f.type?.toUpperCase()}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
