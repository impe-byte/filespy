import React from 'react'
import { formatSize, resultsToCSV } from '../lib/analyzer.js'
import { CATEGORY_ICONS } from '../lib/signatures.js'

const MAIL_EXTS = ['.msg', '.eml', '.mbox', '.pst', '.ost']

export default function MultiResultTable({ results }) {
  const downloadCSV = () => {
    const csv = resultsToCSV(results)
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    const a = document.createElement('a')
    a.href = url; a.download = 'filespy_risultati.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      padding: '1.25rem 1.5rem',
      animation: 'fadeUp 0.3s ease',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 20, color: 'var(--text-primary)' }}>
            {results.length} file analizzati
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 2 }}>
            {results.filter(r => r.best).length} identificati · {results.filter(r => !r.best).length} non riconosciuti
          </div>
        </div>
        <button
          onClick={downloadCSV}
          style={{
            background: 'var(--accent-dim)', border: '1px solid rgba(232,255,90,0.2)',
            color: 'var(--accent)', borderRadius: 'var(--radius-sm)',
            padding: '8px 16px', fontSize: 12, fontFamily: 'var(--mono)',
            cursor: 'pointer', transition: 'all 0.15s',
          }}
          onMouseEnter={e => e.target.style.background = 'rgba(232,255,90,0.2)'}
          onMouseLeave={e => e.target.style.background = 'var(--accent-dim)'}
        >
          ⬇ Esporta CSV
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {/* Header */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 100px 1fr 80px',
          gap: 12, padding: '6px 0',
          fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text-tertiary)',
          letterSpacing: '0.08em', textTransform: 'uppercase',
          borderBottom: '1px solid var(--border)',
        }}>
          <span>File</span>
          <span>Estensione</span>
          <span>Descrizione</span>
          <span style={{ textAlign: 'right' }}>Dimensione</span>
        </div>

        {results.map((r, i) => {
          const b = r.best
          const isMail = b && MAIL_EXTS.includes(b.ext)
          return (
            <div key={i} style={{
              display: 'grid', gridTemplateColumns: '1fr 100px 1fr 80px',
              gap: 12, padding: '10px 0',
              borderBottom: '1px solid rgba(255,255,255,0.03)',
              alignItems: 'center',
              animation: `fadeUp 0.3s ease ${i * 0.04}s both`,
            }}>
              <span style={{
                fontSize: 13, color: 'var(--text-primary)',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>
                {CATEGORY_ICONS[r.category] || '❓'} {r.name}
              </span>
              <span style={{
                fontFamily: 'var(--mono)', fontSize: 12, fontWeight: 500,
                color: b ? (isMail ? 'var(--accent-mail)' : 'var(--accent)') : 'var(--danger)',
              }}>
                {b?.ext ?? '?'}
              </span>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                {b?.desc ?? 'Non riconosciuto'}
              </span>
              <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text-tertiary)', textAlign: 'right' }}>
                {formatSize(r.size)}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
