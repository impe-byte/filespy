import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { formatSize } from '../lib/analyzer.js'
import { CATEGORY_ICONS } from '../lib/signatures.js'

const MAIL_EXTS = ['.msg', '.eml', '.mbox', '.pst', '.ost']

function Badge({ ext, category }) {
  const isMail = MAIL_EXTS.includes(ext)
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      fontFamily: 'var(--mono)', fontSize: 13, fontWeight: 500,
      padding: '4px 12px', borderRadius: 'var(--radius-sm)',
      background: isMail ? 'var(--accent-mail-dim)' : 'var(--accent-dim)',
      color: isMail ? 'var(--accent-mail)' : 'var(--accent)',
      border: `1px solid ${isMail ? 'rgba(55, 138, 221, 0.2)' : 'rgba(55, 138, 221, 0.2)'}`,
    }}>
      {CATEGORY_ICONS[category] || '❓'} {ext}
    </span>
  )
}

function ConfBar({ confidence, index }) {
  const color = index === 0 ? 'var(--success)' : index === 1 ? 'var(--warning)' : 'var(--danger)'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderBottom: '1px solid var(--border)' }}>
      <span style={{ fontFamily: 'var(--mono)', fontSize: 13, minWidth: 90, color: index === 0 ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
        {confidence.ext}
      </span>
      <div style={{ flex: 1, height: 4, background: 'var(--bg-hover)', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ width: `${confidence.confidence || 80}%`, height: '100%', background: color, borderRadius: 2, transition: 'width 0.6s ease' }} />
      </div>
      <span style={{ fontSize: 11, color: 'var(--text-tertiary)', minWidth: 90 }}>{confidence.desc}</span>
      <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text-tertiary)', minWidth: 32, textAlign: 'right' }}>{confidence.confidence || 80}%</span>
    </div>
  )
}

export default function ResultCard({ result, style }) {
  const { t } = useTranslation()
  const [hexExpanded, setHexExpanded] = useState(false)
  const { name, size, hex, matches, best, wasOLE2 } = result

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      padding: '1.25rem 1.5rem',
      animation: 'fadeUp 0.3s ease',
      ...style,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 14, fontWeight: 500, color: 'var(--text-primary)',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            marginBottom: 3,
            fontFamily: 'var(--mono)'
          }}>{name}</div>
          <div style={{ fontSize: 12, color: 'var(--text-tertiary)', fontFamily: 'var(--mono)' }}>
            {formatSize(size)}
            {wasOLE2 && <span style={{ marginLeft: 10, color: 'var(--accent)' }}>· OLE2 deep scan</span>}
          </div>
        </div>
        {best ? <Badge ext={best.ext} category={best.category} /> : (
          <span style={{ fontSize: 12, color: 'var(--danger)', background: 'var(--danger-dim)', padding: '4px 10px', borderRadius: 'var(--radius-sm)' }}>
            {t('results.unknown')}
          </span>
        )}
      </div>

      {/* Matches */}
      {matches.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text-tertiary)', letterSpacing: '0.1em', marginBottom: 8, textTransform: 'uppercase' }}>
            {t('results.matches')}
          </div>
          {matches.slice(0, 4).map((m, i) => <ConfBar key={i} confidence={m} index={i} />)}
        </div>
      )}

      {/* Hex dump */}
      <div>
        <div
          onClick={() => setHexExpanded(v => !v)}
          style={{
            fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text-tertiary)',
            letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6,
          }}
        >
          {t('results.magicBytes')} <span style={{ fontSize: 9 }}>{hexExpanded ? '▲' : '▼'}</span>
        </div>
        <div style={{
          fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text-tertiary)',
          wordBreak: 'break-all', lineHeight: 1.8,
          maxHeight: hexExpanded ? 'none' : 32,
          overflow: 'hidden',
          transition: 'max-height 0.3s',
        }}>
          {hex}
        </div>
      </div>

      {/* MIME */}
      {best && (
        <div style={{ marginTop: 12, fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text-tertiary)' }}>
          MIME: <span style={{ color: 'var(--text-secondary)' }}>{best.mime}</span>
        </div>
      )}
    </div>
  )
}
