import React from 'react'
import { useTranslation } from 'react-i18next'
import { formatSize, resultsToCSV } from '../lib/analyzer.js'
import { CATEGORY_ICONS } from '../lib/signatures.js'

const MAIL_EXTS = ['.msg', '.eml', '.mbox', '.pst', '.ost']

export default function MultiResultTable({ results }) {
  const { t } = useTranslation()

  const downloadCSV = () => {
    const csv = resultsToCSV(results)
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    const a = document.createElement('a')
    a.href = url; a.download = 'filespy_results.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  const identifiedCount = results.filter(r => r.best).length
  const unrecognizedCount = results.filter(r => !r.best).length

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
          <div style={{ fontFamily: 'var(--sans)', fontWeight: 600, fontSize: 20, color: 'var(--text-primary)' }}>
            {t('results.analyzed', { count: results.length })}
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-tertiary)', marginTop: 2 }}>
            {t('results.identified', { count: identifiedCount })} · {t('results.notRecognized', { count: unrecognizedCount })}
          </div>
        </div>
        <button
          onClick={downloadCSV}
          style={{
            background: 'var(--accent-dim)', border: '1px solid rgba(55, 138, 221, 0.2)',
            color: 'var(--accent)', borderRadius: 'var(--radius-sm)',
            padding: '8px 16px', fontSize: 13, fontFamily: 'var(--mono)', fontWeight: 500,
            cursor: 'pointer', transition: 'all 0.15s',
          }}
          onMouseEnter={e => e.target.style.background = 'rgba(55, 138, 221, 0.2)'}
          onMouseLeave={e => e.target.style.background = 'var(--accent-dim)'}
        >
          {t('actions.exportCsv')}
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {/* Header */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 100px 1fr 80px',
          gap: 12, padding: '8px 0',
          fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text-tertiary)',
          letterSpacing: '0.08em', textTransform: 'uppercase',
          borderBottom: '1px solid var(--border)',
        }}>
          <span>{t('results.table.file')}</span>
          <span>{t('results.table.ext')}</span>
          <span>{t('results.table.desc')}</span>
          <span style={{ textAlign: 'right' }}>{t('results.table.size')}</span>
        </div>

        {results.map((r, i) => {
          const b = r.best
          const isMail = b && MAIL_EXTS.includes(b.ext)
          return (
            <div key={i} style={{
              display: 'grid', gridTemplateColumns: '1fr 100px 1fr 80px',
              gap: 12, padding: '12px 0',
              borderBottom: '1px solid var(--border)',
              alignItems: 'center',
              animation: `fadeUp 0.3s ease ${i * 0.04}s both`,
            }}>
              <span style={{
                fontSize: 13, color: 'var(--text-primary)', fontFamily: 'var(--mono)',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>
                {CATEGORY_ICONS[r.category] || '❓'} {r.name}
              </span>
              <span style={{
                fontFamily: 'var(--mono)', fontSize: 13, fontWeight: 500,
                color: b ? (isMail ? 'var(--accent-mail)' : 'var(--accent)') : 'var(--danger)',
              }}>
                {b?.ext ?? '?'}
              </span>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                {b?.desc ?? t('results.unknown')}
              </span>
              <span style={{ fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text-tertiary)', textAlign: 'right' }}>
                {formatSize(r.size)}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
