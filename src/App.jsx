import React, { useState, useCallback } from 'react'
import DropZone from './components/DropZone.jsx'
import ResultCard from './components/ResultCard.jsx'
import MultiResultTable from './components/MultiResultTable.jsx'
import { analyzeFile } from './lib/analyzer.js'

const SUPPORTED_COUNT = '55+'

export default function App() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleFiles = useCallback(async (files) => {
    setLoading(true)
    setResults([])
    setProgress(0)

    const out = []
    for (let i = 0; i < files.length; i++) {
      const r = await analyzeFile(files[i])
      out.push(r)
      setProgress(Math.round(((i + 1) / files.length) * 100))
    }

    setResults(out)
    setLoading(false)
  }, [])

  const reset = () => { setResults([]); setProgress(0) }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{
        padding: '2rem 2rem 0',
        maxWidth: 760, margin: '0 auto', width: '100%',
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 6 }}>
          <span style={{
            fontFamily: 'var(--mono)', fontSize: 22, fontWeight: 500,
            color: 'var(--accent)', letterSpacing: '-0.02em',
          }}>FileSpy</span>
          <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text-tertiary)', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: 4 }}>
            v1.0
          </span>
        </div>
        <h1 style={{
          fontFamily: 'var(--serif)', fontStyle: 'italic',
          fontSize: 'clamp(28px, 5vw, 40px)', fontWeight: 400,
          color: 'var(--text-primary)', lineHeight: 1.2, marginBottom: 10,
        }}>
          Magic Byte<br />File Detector
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.7, maxWidth: 480 }}>
          Identifica l'estensione originale di qualsiasi file analizzando i <em>magic bytes</em> — la firma binaria nei primi byte.
          Supporto speciale per email <strong style={{ color: 'var(--accent-mail)' }}>.msg</strong> e <strong style={{ color: 'var(--accent-mail)' }}>.eml</strong>
          tramite OLE2 deep scan.
        </p>

        {/* Pills */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 16, marginBottom: 32 }}>
          {[
            { label: `${SUPPORTED_COUNT} formati`, color: 'var(--accent)' },
            { label: '100% locale', color: 'var(--success)' },
            { label: 'nessun upload', color: 'var(--success)' },
            { label: 'OLE2 deep scan', color: 'var(--accent-mail)' },
            { label: 'export CSV', color: 'var(--text-secondary)' },
          ].map(p => (
            <span key={p.label} style={{
              fontSize: 11, fontFamily: 'var(--mono)',
              color: p.color, border: `1px solid ${p.color}33`,
              background: `${p.color}11`,
              padding: '3px 10px', borderRadius: 4,
            }}>
              {p.label}
            </span>
          ))}
        </div>
      </header>

      {/* Main */}
      <main style={{ flex: 1, padding: '0 2rem 4rem', maxWidth: 760, margin: '0 auto', width: '100%' }}>
        <DropZone onFiles={handleFiles} />

        {/* Progress */}
        {loading && (
          <div style={{ marginTop: 20, animation: 'fadeUp 0.2s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>
              <span style={{ fontFamily: 'var(--mono)' }}>Analisi in corso...</span>
              <span style={{ fontFamily: 'var(--mono)' }}>{progress}%</span>
            </div>
            <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2 }}>
              <div style={{
                width: `${progress}%`, height: '100%',
                background: 'var(--accent)', borderRadius: 2,
                transition: 'width 0.2s ease',
              }} />
            </div>
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Risultati
              </div>
              <button
                onClick={reset}
                style={{
                  background: 'none', border: 'none', color: 'var(--text-tertiary)',
                  fontSize: 12, cursor: 'pointer', fontFamily: 'var(--mono)',
                }}
                onMouseEnter={e => e.target.style.color = 'var(--text-primary)'}
                onMouseLeave={e => e.target.style.color = 'var(--text-tertiary)'}
              >
                ✕ Ricomincia
              </button>
            </div>

            {results.length === 1
              ? <ResultCard result={results[0]} />
              : <MultiResultTable results={results} />
            }

            {/* Detail cards for multi-file */}
            {results.length > 1 && (
              <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {results.map((r, i) => (
                  <ResultCard key={i} result={r} style={{ animationDelay: `${i * 0.05}s` }} />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{
        padding: '1.5rem 2rem',
        borderTop: '1px solid var(--border)',
        maxWidth: 760, margin: '0 auto', width: '100%',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: 8,
      }}>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text-tertiary)' }}>
          FileSpy — nessun dato inviato a server
        </span>
        <div style={{ display: 'flex', gap: 16 }}>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text-tertiary)', textDecoration: 'none' }}>
            GitHub ↗
          </a>
        </div>
      </footer>
    </div>
  )
}
