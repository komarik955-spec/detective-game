import React, { useState } from 'react'

export default function TextViewer({ file }) {
  const [copied, setCopied] = useState(false)

  function copy() {
    navigator.clipboard.writeText(file.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const lines = file.content.split('\n')

  return (
    <div className="txt-viewer">
      {/* Toolbar */}
      <div className="viewer-toolbar">
        <span className="viewer-filename">{file.icon ?? '📄'} {file.name}</span>
        <div className="viewer-tools">
          <span className="viewer-meta">{lines.length} lines</span>
          <button className="viewer-btn" onClick={copy}>
            {copied ? '✓ Copied' : '📋 Copy'}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="txt-body">
        <div className="txt-gutter">
          {lines.map((_, i) => (
            <span key={i} className="line-num">{i + 1}</span>
          ))}
        </div>
        <pre className="txt-content">
          {lines.map((line, i) => (
            <div
              key={i}
              className={`txt-line ${line.startsWith('!') ? 'txt-warn' : ''} ${line.startsWith('[') ? 'txt-meta' : ''}`}
            >
              {line || '\u00A0'}
            </div>
          ))}
        </pre>
      </div>
    </div>
  )
}
