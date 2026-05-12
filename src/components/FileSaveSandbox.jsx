import React from 'react'
import './FileSaveSandbox.css'

/* ═══════════════════════════════════════
   UNIVERSAL FILE ACTIONS SYSTEM
   Generic download/open mechanism
═══════════════════════════════════════ */

// Universal file actions component
// Can be used anywhere: mail attachments, evidence files, etc.
// File object structure: { name, type, url, downloadable: true }
function FileActions({ file, onOpen, onDownload }) {
  if (!file.downloadable) {
    return null
  }

  const handleDownload = () => {
    console.log('Downloading file:', file.name)
    if (onDownload) onDownload(file)
  }

  const handleOpen = () => {
    console.log('Opening file:', file.name)
    if (onOpen) onOpen(file)
  }

  return (
    <div className="file-actions">
      <button className="file-action-btn open" onClick={handleOpen}>
        {file.type === 'image' ? 'Просмотреть' : 'Открыть'}
      </button>
      <button className="file-action-btn download" onClick={handleDownload}>
        Скачать
      </button>
    </div>
  )
}

// Compact file actions with icons
function FileActionsCompact({ file, onOpen, onDownload }) {
  if (!file.downloadable) {
    return null
  }

  const handleDownload = () => {
    console.log('Downloading file:', file.name)
    if (onDownload) onDownload(file)
  }

  const handleOpen = () => {
    console.log('Opening file:', file.name)
    if (onOpen) onOpen(file)
  }

  return (
    <div className="file-actions-compact">
      <button className="file-action-icon" onClick={handleOpen} title="Открыть">
        👁️
      </button>
      <button className="file-action-icon" onClick={handleDownload} title="Скачать">
        ⬇️
      </button>
    </div>
  )
}

export default function FileSaveSandbox() {
  // Test files - realistic examples
  const mailAttachment = {
    name: 'Case_Report_SB-2025-06-21.pdf',
    type: 'pdf',
    size: '2.4 МБ',
    url: '/assets/images/case-file.jpg',
    downloadable: true
  }

  const evidenceImage = {
    name: 'Evidence_Photo_Scene.jpg',
    type: 'image',
    size: '1.8 МБ',
    url: '/assets/images/phone_note_final.jpg',
    downloadable: true
  }

  const witnessStatement = {
    name: 'Witness_Statement_001.txt',
    type: 'text',
    size: '24 КБ',
    url: '#',
    downloadable: true
  }

  const nonDownloadable = {
    name: 'System_Log_Archive.zip',
    type: 'archive',
    size: '156 МБ',
    url: '#',
    downloadable: false
  }

  const handleOpen = (file) => {
    alert(`Opening: ${file.name}\nType: ${file.type}\nURL: ${file.url}`)
  }

  const handleDownload = (file) => {
    alert(`Downloading: ${file.name}\nType: ${file.type}\nURL: ${file.url}`)
  }

  return (
    <div className="file-save-sandbox">
      <div className="sandbox-header">
        <h1>UNIVERSAL FILE ACTIONS SYSTEM</h1>
        <p>Generic download/open mechanism - isolated testing</p>
      </div>

      <div className="sandbox-content">
        {/* Mail Attachment Style */}
        <div className="sandbox-section">
          <h2>MAIL ATTACHMENT STYLE</h2>
          <p className="section-desc">How files appear in email attachments</p>
          
          <div className="example-container">
            <div className="mail-attachment">
              <div className="attachment-icon">📄</div>
              <div className="attachment-info">
                <div className="attachment-name">{mailAttachment.name}</div>
                <div className="attachment-meta">{mailAttachment.size} · PDF</div>
              </div>
              <FileActions file={mailAttachment} onOpen={handleOpen} onDownload={handleDownload} />
            </div>

            <div className="mail-attachment">
              <div className="attachment-icon">🖼️</div>
              <div className="attachment-info">
                <div className="attachment-name">{evidenceImage.name}</div>
                <div className="attachment-meta">{evidenceImage.size} · Image</div>
              </div>
              <FileActions file={evidenceImage} onOpen={handleOpen} onDownload={handleDownload} />
            </div>

            <div className="mail-attachment">
              <div className="attachment-icon">📝</div>
              <div className="attachment-info">
                <div className="attachment-name">{witnessStatement.name}</div>
                <div className="attachment-meta">{witnessStatement.size} · Text</div>
              </div>
              <FileActions file={witnessStatement} onOpen={handleOpen} onDownload={handleDownload} />
            </div>

            <div className="mail-attachment">
              <div className="attachment-icon">📦</div>
              <div className="attachment-info">
                <div className="attachment-name">{nonDownloadable.name}</div>
                <div className="attachment-meta">{nonDownloadable.size} · Archive</div>
              </div>
              <FileActions file={nonDownloadable} onOpen={handleOpen} onDownload={handleDownload} />
            </div>
          </div>
        </div>

        {/* Evidence File Style */}
        <div className="sandbox-section">
          <h2>EVIDENCE FILE STYLE</h2>
          <p className="section-desc">How files appear in evidence database</p>
          
          <div className="example-container">
            <div className="evidence-file">
              <div className="evidence-header">
                <span className="evidence-id">EVI-001</span>
                <span className="evidence-type">Фото</span>
              </div>
              <div className="evidence-body">
                <h3>{evidenceImage.name}</h3>
                <p>Недавнее фото с места происшествия</p>
                <div className="evidence-meta">
                  <span>Размер: {evidenceImage.size}</span>
                  <span>Дело: SB-2025-06-21</span>
                </div>
              </div>
              <FileActionsCompact file={evidenceImage} onOpen={handleOpen} onDownload={handleDownload} />
            </div>

            <div className="evidence-file">
              <div className="evidence-header">
                <span className="evidence-id">EVI-002</span>
                <span className="evidence-type">Документ</span>
              </div>
              <div className="evidence-body">
                <h3>{mailAttachment.name}</h3>
                <p>Первоначальный отчет о происшествии</p>
                <div className="evidence-meta">
                  <span>Размер: {mailAttachment.size}</span>
                  <span>Дело: SB-2025-06-21</span>
                </div>
              </div>
              <FileActionsCompact file={mailAttachment} onOpen={handleOpen} onDownload={handleDownload} />
            </div>
          </div>
        </div>

        {/* Usage Instructions */}
        <div className="sandbox-section">
          <h2>USAGE</h2>
          <div className="usage-code">
            <pre>{`// Any file object with this structure:
const file = {
  name: 'document.pdf',
  type: 'pdf',
  url: '/path/to/file',
  downloadable: true
}

// Use FileActions component anywhere:
<FileActions 
  file={file} 
  onOpen={(f) => console.log('Open', f)}
  onDownload={(f) => console.log('Download', f)}
/>

// Or compact version with icons:
<FileActionsCompact 
  file={file} 
  onOpen={handleOpen}
  onDownload={handleDownload}
/>`}</pre>
          </div>
        </div>
      </div>
    </div>
  )
}
