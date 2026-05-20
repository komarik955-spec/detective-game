import React, { useState } from 'react'
import { FILE_SYSTEM, getChildren } from '../data/fileSystem'
import TextViewer from './viewers/TextViewer'
import ImageViewer from './viewers/ImageViewer'
import VideoViewer from './viewers/VideoViewer'
import { useWM } from './WindowManager'
import { useInvestigation, ENVELOPE_FILE_IDS } from '../utils/investigationSystem'

const ICON_MAP = { folder: '📁', txt: '📄', image: '🖼️', img: '🖼️', video: '🎬' }

function getIcon(file) {
  return file?.icon ?? ICON_MAP[file?.type] ?? '📄'
}

export default function FileExplorer({ rootId = 'case001', unlockedFiles = [] }) {
  const [path, setPath] = useState([rootId])
  const [openFile, setOpenFile] = useState(null)
  const { open } = useWM()
  const { markFileAsReviewed, isEnvelopeUnlocked, isFileNew } = useInvestigation()

  const currentId = path[path.length - 1]
  const current = FILE_SYSTEM[currentId]
  const children = current?.type === 'folder' ? getChildren(currentId) : []

  function navigate(id) {
    const node = FILE_SYSTEM[id]
    if (!node) return

    if (node.type === 'folder') {
      if (node.locked && id === 'envelope1' && !isEnvelopeUnlocked) {
        setOpenFile({ id, file: null, locked: true })
        return
      }
      setPath(p => [...p, id])
      setOpenFile(null)
      return
    }

    openFileNode(id, node)
  }

  function openFileNode(id, node) {
    if (node.locked && id === 'envelope1' && !isEnvelopeUnlocked) {
      setOpenFile({ id, file: null, locked: true })
      return
    }
    if (node.locked && !unlockedFiles.includes(id)) {
      setOpenFile({ id, file: null, locked: true })
      return
    }

    if (node.type === 'txt' && ENVELOPE_FILE_IDS.includes(id)) {
      markFileAsReviewed(id)
    }

    if (node.type === 'image' || node.type === 'img') {
      markFileAsReviewed(id)
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

  function renderNewBadge(fileId) {
    if (!isFileNew(fileId)) return null
    return <span className="file-new-badge">НОВЫЙ МАТЕРИАЛ</span>
  }

  function isItemLocked(f) {
    if (f.id === 'envelope1') return f.locked && !isEnvelopeUnlocked
    return f.locked && !unlockedFiles.includes(f.id)
  }

  function renderViewer() {
    if (!openFile) return null

    if (openFile.locked) {
      return (
        <div className="file-locked">
          <div className="file-locked-icon">🔒</div>
          <h3>Доступ закрыт</h3>
          <p>
            {openFile.id === 'envelope1'
              ? 'Конверт №1 будет доступен после промежуточного отчёта и звонка куратора.'
              : 'Файл зашифрован или ограничен.'}
          </p>
          <p className="dimtext">Продолжайте расследование на портале Dark Trace.</p>
        </div>
      )
    }

    const f = openFile.file
    if (f.type === 'txt') return <TextViewer file={f} />
    if (f.type === 'image' || f.type === 'img') return <ImageViewer file={f} />
    if (f.type === 'video') return <VideoViewer file={f} />

    return (
      <div className="placeholder-content">
        <p>Unsupported file type.</p>
      </div>
    )
  }

  return (
    <div className="explorer">
      <div className="explorer-bar">
        <button className="ex-nav-btn" onClick={goBack} disabled={path.length <= 1}>
          Back
        </button>
        <button className="ex-nav-btn" onClick={goUp} disabled={path.length <= 1}>
          Up
        </button>

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

        <span className="ex-count">
          {children.length} item{children.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="explorer-body">
        <div className="explorer-sidebar">
          <div className="sidebar-section">CASE FILES</div>
          {getChildren('case001').map(f => (
            <div
              key={f.id}
              className={`sidebar-item ${openFile?.id === f.id ? 'sidebar-active' : ''} ${isItemLocked(f) ? 'sidebar-locked' : ''}`}
              onClick={() => {
                if (f.type === 'folder') {
                  setPath(['case001', f.id])
                  setOpenFile(null)
                } else {
                  openFileNode(f.id, f)
                }
              }}
            >
              <span>{getIcon(f)}</span>
              <span className="sidebar-name">{f.name}</span>
              {renderNewBadge(f.id)}
              {isItemLocked(f) && <span className="sidebar-lock">🔒</span>}
            </div>
          ))}
        </div>

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
                  className={`file-tile ${isItemLocked(f) ? 'file-locked-tile' : ''}`}
                  onDoubleClick={() => navigate(f.id)}
                >
                  <div className="file-tile-icon">
                    {isItemLocked(f) ? '🔒' : getIcon(f)}
                  </div>
                  <span className="file-tile-name">{f.name}</span>
                  {renderNewBadge(f.id)}
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
