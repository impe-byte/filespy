import { SIGNATURES } from './signatures.js'

// ── OLE2 Deep Scan ────────────────────────────────────────────────────────────
export async function deepScanOLE2(buf) {
  const bytes = new Uint8Array(buf)
  try {
    const sectorSize = 1 << (bytes[30] | (bytes[31] << 8))
    const firstDirSector = bytes[48] | (bytes[49]<<8) | (bytes[50]<<16) | (bytes[51]<<24)
    const dirOffset = (firstDirSector + 1) * sectorSize

    const names = []
    for (let i = dirOffset; i < Math.min(dirOffset + sectorSize * 8, bytes.length - 64); i += 128) {
      const nameLen = bytes[i+64] | (bytes[i+65]<<8)
      if (nameLen > 0 && nameLen <= 64) {
        let name = ''
        for (let j = 0; j < nameLen - 2; j += 2) {
          const ch = bytes[i+j] | (bytes[i+j+1]<<8)
          if (ch > 0) name += String.fromCharCode(ch)
        }
        if (name) names.push(name)
      }
    }

    const has = (n) => names.some(s => s.toLowerCase().includes(n.toLowerCase()))

    if ((has('__properties_version1.0') && has('__nameid_version1.0')) || has('__substg1.0') || has('__attach_version')) {
      return { ext: '.msg', mime: 'application/vnd.ms-outlook', desc: 'Email Outlook MSG', category: 'mail', confidence: 100 }
    }
    if (has('WordDocument')) {
      return { ext: '.doc', mime: 'application/msword', desc: 'Word Document (DOC)', category: 'document', confidence: 100 }
    }
    if (has('Workbook') || has('Book')) {
      return { ext: '.xls', mime: 'application/vnd.ms-excel', desc: 'Excel Spreadsheet (XLS)', category: 'document', confidence: 100 }
    }
    if (has('PowerPoint Document')) {
      return { ext: '.ppt', mime: 'application/vnd.ms-powerpoint', desc: 'PowerPoint (PPT)', category: 'document', confidence: 100 }
    }
    if (has('VisioDocument')) {
      return { ext: '.vsd', mime: 'application/vnd.visio', desc: 'Visio Document', category: 'document', confidence: 95 }
    }
    return { ext: '.doc/.xls/.msg', mime: 'application/x-ole2', desc: 'OLE2 — sottotipo non determinato', category: 'document', confidence: 40 }
  } catch {
    return { ext: '.ole2', mime: 'application/x-ole2', desc: 'OLE2 Compound Document', category: 'document', confidence: 30 }
  }
}

// ── Text Heuristics ───────────────────────────────────────────────────────────
function isLikelyText(buf) {
  const bytes = new Uint8Array(buf.slice(0, 512))
  for (const b of bytes) if (b === 0) return false
  const printable = bytes.filter(b => (b >= 0x20 && b < 0x7F) || b === 0x09 || b === 0x0A || b === 0x0D).length
  return printable / bytes.length > 0.85
}

function detectTextType(buf) {
  const text = new TextDecoder('utf-8', { fatal: false }).decode(new Uint8Array(buf.slice(0, 512)))
  if (/^Return-Path:|^From |^Received:|^Date:|^Message-ID:|^MIME-Version:/m.test(text))
    return { ext: '.eml', mime: 'message/rfc822', desc: 'Email EML (header rilevato)', category: 'mail', confidence: 90 }
  if (text.trim().startsWith('<?xml') || /<\?xml/i.test(text))
    return { ext: '.xml', mime: 'text/xml', desc: 'XML File', category: 'document', confidence: 85 }
  if (/<!DOCTYPE html/i.test(text) || /<html/i.test(text))
    return { ext: '.html', mime: 'text/html', desc: 'HTML File', category: 'document', confidence: 85 }
  if ((text.trim().startsWith('{') || text.trim().startsWith('[')) && text.length > 2)
    return { ext: '.json', mime: 'application/json', desc: 'JSON File', category: 'document', confidence: 80 }
  if (text.startsWith('#!'))
    return { ext: '.sh', mime: 'text/x-shellscript', desc: 'Shell Script', category: 'executable', confidence: 75 }
  if (/^(import |from |def |class |async def )/m.test(text))
    return { ext: '.py', mime: 'text/x-python', desc: 'Python Script', category: 'executable', confidence: 70 }
  if (/^(function |const |let |var |import |export )/m.test(text))
    return { ext: '.js', mime: 'text/javascript', desc: 'JavaScript', category: 'executable', confidence: 65 }
  if (/@charset|body\s*\{|\.[\w-]+\s*\{/.test(text))
    return { ext: '.css', mime: 'text/css', desc: 'CSS Stylesheet', category: 'document', confidence: 65 }
  return { ext: '.txt', mime: 'text/plain', desc: 'Plain Text File', category: 'text', confidence: 50 }
}

// ── Magic Byte Matching ───────────────────────────────────────────────────────
function matchSignatures(buf) {
  const bytes = new Uint8Array(buf)
  const matches = []
  for (const sig of SIGNATURES) {
    if (sig.ole2) continue
    const off = sig.offset || 0
    if (bytes.length < off + sig.bytes.length) continue
    let ok = sig.bytes.every((b, i) => bytes[off + i] === b)
    if (ok && sig.extra) {
      const ex = sig.extra
      ok = bytes.length >= ex.offset + ex.bytes.length && ex.bytes.every((b, i) => bytes[ex.offset + i] === b)
    }
    if (ok) matches.push({ ...sig, confidence: 100 - matches.length * 5 })
  }
  return matches
}

function isOLE2(buf) {
  const b = new Uint8Array(buf)
  return b[0]===0xD0 && b[1]===0xCF && b[2]===0x11 && b[3]===0xE0 && b[4]===0xA1 && b[5]===0xB1 && b[6]===0x1A && b[7]===0xE1
}

export function toHex(buf, n = 32) {
  return Array.from(new Uint8Array(buf).slice(0, n))
    .map(b => b.toString(16).padStart(2, '0').toUpperCase())
    .join(' ')
}

// ── Main Analysis Function ────────────────────────────────────────────────────
export async function analyzeFile(file) {
  const READ_SIZE = 65536
  const buf = await file.slice(0, READ_SIZE).arrayBuffer()
  const hex = toHex(buf)

  let matches = []
  let wasOLE2 = false
  let ole2Result = null

  if (isOLE2(buf)) {
    wasOLE2 = true
    ole2Result = await deepScanOLE2(buf)
    matches = [ole2Result]
  } else {
    matches = matchSignatures(buf)
    if (matches.length === 0 && isLikelyText(buf)) {
      matches = [detectTextType(buf)]
    }
  }

  const best = matches[0] || null

  return {
    name: file.name || 'file senza nome',
    size: file.size,
    hex,
    matches,
    best,
    wasOLE2,
    category: best?.category || 'unknown',
    file, // keep ref for possible future use
  }
}

export function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

export function resultsToCSV(results) {
  const header = 'File,Estensione Rilevata,Descrizione,Categoria,MIME,Confidenza,Dimensione\n'
  const rows = results.map(r => {
    const b = r.best
    return [
      `"${r.name}"`,
      `"${b?.ext ?? '?'}"`,
      `"${b?.desc ?? '-'}"`,
      `"${b?.category ?? '-'}"`,
      `"${b?.mime ?? '-'}"`,
      `"${b?.confidence ?? 0}%"`,
      `"${formatSize(r.size)}"`,
    ].join(',')
  })
  return header + rows.join('\n')
}
