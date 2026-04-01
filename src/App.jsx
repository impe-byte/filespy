import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import DropZone from './components/DropZone.jsx';
import ResultCard from './components/ResultCard.jsx';
import MultiResultTable from './components/MultiResultTable.jsx';
import { analyzeFile } from './lib/analyzer.js';

export default function App() {
  const { t, i18n } = useTranslation();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFiles = useCallback(async (files) => {
    setLoading(true);
    setResults([]);
    setProgress(0);

    const out = [];
    for (let i = 0; i < files.length; i++) {
      const r = await analyzeFile(files[i]);
      out.push(r);
      setProgress(Math.round(((i + 1) / files.length) * 100));
    }

    setResults(out);
    setLoading(false);
  }, []);

  const reset = () => { setResults([]); setProgress(0); };

  const switchLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{
        padding: '2rem 2rem 0',
        maxWidth: 760, margin: '0 auto', width: '100%',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          {/* Logo impe-byte */}
          <div style={{
            fontFamily: 'var(--mono)', fontSize: 24, fontWeight: 700,
            color: 'var(--text-primary)', letterSpacing: '-0.02em',
          }}>
            iB<span className="cursor-blink">_</span>
          </div>
          
          {/* Language Switcher */}
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => switchLanguage('en')} style={{
              background: 'transparent', border: 'none', 
              color: i18n.language.startsWith('en') ? 'var(--accent)' : 'var(--text-tertiary)',
              cursor: 'pointer', fontFamily: 'var(--mono)', fontSize: 13, fontWeight: 500
            }}>EN</button>
            <span style={{ color: 'var(--border)' }}>|</span>
            <button onClick={() => switchLanguage('it')} style={{
              background: 'transparent', border: 'none', 
              color: i18n.language.startsWith('it') ? 'var(--accent)' : 'var(--text-tertiary)',
              cursor: 'pointer', fontFamily: 'var(--mono)', fontSize: 13, fontWeight: 500
            }}>IT</button>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 8 }}>
          <span style={{
            fontFamily: 'var(--mono)', fontSize: 20, fontWeight: 500,
            color: 'var(--text-primary)', letterSpacing: '-0.02em',
          }}>FileSpy</span>
          <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text-tertiary)', background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '2px 8px', borderRadius: 4 }}>
            {t('app.version')}
          </span>
        </div>
        
        <h1 style={{
          fontFamily: 'var(--sans)',
          fontSize: 'clamp(28px, 5vw, 40px)', fontWeight: 600,
          color: 'var(--text-primary)', lineHeight: 1.2, marginBottom: 12,
        }}>
          {t('app.title')}
        </h1>
        
        <p style={{ color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.6, maxWidth: 540 }}>
          {t('app.description')}
        </p>

        {/* Pills */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 24, marginBottom: 40 }}>
          {[
            { label: t('app.badges.formats'), color: 'var(--accent)' },
            { label: t('app.badges.local'), color: 'var(--success)' },
            { label: t('app.badges.noupload'), color: 'var(--success)' },
            { label: t('app.badges.ole2'), color: 'var(--text-secondary)' },
            { label: t('app.badges.csv'), color: 'var(--border)' },
          ].map(p => (
            <span key={p.label} style={{
              fontSize: 12, fontFamily: 'var(--mono)',
              color: 'var(--text-primary)', border: `1px solid ${p.color}`,
              background: 'var(--bg-card)',
              padding: '4px 12px', borderRadius: 6,
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
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>
              <span style={{ fontFamily: 'var(--mono)' }}>{t('actions.analyzing')}</span>
              <span style={{ fontFamily: 'var(--mono)' }}>{progress}%</span>
            </div>
            <div style={{ height: 4, background: 'var(--bg-card)', borderRadius: 2, overflow: 'hidden' }}>
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
          <div style={{ marginTop: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                {t('actions.results')}
              </div>
              <button
                onClick={reset}
                style={{
                  background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)',
                  fontSize: 12, cursor: 'pointer', fontFamily: 'var(--mono)', padding: '6px 12px', borderRadius: 4,
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.color = 'var(--accent)'; }}
                onMouseLeave={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--text-primary)'; }}
              >
                {t('actions.restart')}
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
        padding: '2rem',
        borderTop: '1px solid var(--border)',
        maxWidth: 760, margin: '0 auto', width: '100%',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>iB<span style={{color: 'var(--accent)'}}>_</span></span>
          <span style={{ fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--text-tertiary)' }}>
            {t('app.footer')}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, fontFamily: 'var(--mono)', color: 'var(--text-tertiary)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = 'var(--accent)'} onMouseLeave={e => e.target.style.color = 'var(--text-tertiary)'}>
            {t('app.github')}
          </a>
        </div>
      </footer>
    </div>
  )
}
