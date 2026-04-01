import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function DropZone({ onFiles }) {
  const { t } = useTranslation()
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  const handle = (files) => {
    const arr = Array.from(files).filter(Boolean)
    if (arr.length) onFiles(arr)
  }

  return (
    <div
      className={`drop-zone ${dragging ? 'drag-over' : ''}`}
      onClick={() => inputRef.current?.click()}
      onDragOver={e => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={e => { e.preventDefault(); setDragging(false); handle(e.dataTransfer.files) }}
      style={{
        border: `1.5px dashed ${dragging ? 'var(--accent)' : 'var(--border)'}`,
        borderRadius: 'var(--radius)',
        padding: '3.5rem 2rem',
        textAlign: 'center',
        cursor: 'pointer',
        background: dragging ? 'var(--bg-hover)' : 'var(--bg-card)',
        transition: 'all 0.2s',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        style={{ display: 'none' }}
        onChange={e => handle(e.target.files)}
      />

      {/* Scan line animation */}
      {dragging && (
        <div style={{
          position: 'absolute', left: 0, right: 0, height: '2px',
          background: 'linear-gradient(90deg, transparent, var(--accent), transparent)',
          animation: 'scanline 1s linear infinite',
          top: 0,
        }} />
      )}

      <div style={{ fontSize: 40, marginBottom: 16 }}>
        {dragging ? '⬇' : '📂'}
      </div>
      <div style={{
        fontFamily: 'var(--sans)',
        fontWeight: 600,
        fontSize: 22,
        color: dragging ? 'var(--accent)' : 'var(--text-primary)',
        marginBottom: 8,
        transition: 'color 0.2s',
      }}>
        {dragging ? t('dropzone.drop') : t('dropzone.drag')}
      </div>
      <div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
        {t('dropzone.click')}
      </div>
      <div style={{ color: 'var(--text-tertiary)', fontSize: 11, marginTop: 8, fontFamily: 'var(--mono)' }}>
        {t('dropzone.formats')}
      </div>
    </div>
  )
}
