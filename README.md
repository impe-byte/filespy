# FileSpy — Magic Byte File Detector

> Identifica l'estensione originale di qualsiasi file analizzando i *magic bytes* — la firma binaria nei primi byte del file.

**🔒 100% privato** — tutto avviene nel browser, nessun file viene mai inviato a server.

---

## ✨ Funzionalità

- **Magic bytes analysis** — confronta i primi byte del file con un database di 55+ firme note
- **OLE2 deep scan** — per i file Compound Document (`.msg`, `.doc`, `.xls`, `.ppt`) analizza la struttura interna per distinguere il tipo esatto
- **Rilevamento email** — `.msg` (Outlook), `.eml`, `.mbox`, `.pst/.ost`
- **Analisi testuale euristica** — per file di testo senza magic bytes (JSON, Python, JS, HTML, CSS...)
- **Multi-file** — analizza più file contemporaneamente con progress bar
- **Export CSV** — scarica i risultati in formato tabellare

## 📦 Formati supportati

| Categoria | Formati |
|-----------|---------|
| **Mail** | `.msg` `.eml` `.mbox` `.pst` `.ost` |
| **Immagini** | `.jpg` `.png` `.gif` `.bmp` `.webp` `.tiff` `.ico` `.psd` `.heic` |
| **Documenti** | `.pdf` `.doc` `.xls` `.ppt` `.docx` `.xlsx` `.pptx` `.rtf` `.xml` `.html` |
| **Archivi** | `.zip` `.rar` `.7z` `.gz` `.bz2` `.xz` `.iso` |
| **Video** | `.mp4` `.mkv` `.avi` `.flv` `.wmv` |
| **Audio** | `.mp3` `.wav` `.flac` `.ogg` `.aac` |
| **Eseguibili** | `.exe` `.dll` `.elf` `.class` `.wasm` |
| **Database** | `.sqlite` |
| **Font** | `.ttf` `.otf` `.woff` `.woff2` |

---

## 🚀 Deploy rapido su Vercel

### 1. Fork / Clone

```bash
git clone https://github.com/impe-byte/filespy.git
cd filespy
```

### 2. Installa dipendenze

```bash
npm install
```

### 3. Sviluppo locale

```bash
npm run dev
# → http://localhost:5173
```

### 4. Deploy su Vercel

**Via CLI:**
```bash
npm i -g vercel
vercel
# segui le istruzioni interattive
```

**Via GitHub (consigliato):**
1. Pusha il repo su GitHub
2. Vai su [vercel.com](https://vercel.com) → **New Project**
3. Importa il repo GitHub
4. Vercel rileva automaticamente Vite → clicca **Deploy**
5. ✅ Done — URL pubblico in 60 secondi

---

## 🛠 Sviluppo

```
filespy/
├── src/
│   ├── lib/
│   │   ├── signatures.js   # Database magic bytes (55+ firme)
│   │   └── analyzer.js     # Logica analisi + OLE2 deep scan
│   ├── components/
│   │   ├── DropZone.jsx    # Drag & drop area
│   │   ├── ResultCard.jsx  # Card risultato singolo file
│   │   └── MultiResultTable.jsx  # Tabella multi-file + CSV export
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
│   └── favicon.svg
├── index.html
├── vite.config.js
├── vercel.json
└── package.json
```

### Aggiungere nuove firme

Apri `src/lib/signatures.js` e aggiungi alla lista `SIGNATURES`:

```js
{
  ext: '.xyz',
  mime: 'application/x-xyz',
  bytes: [0xAB, 0xCD, 0xEF],   // magic bytes (hex)
  desc: 'Descrizione formato',
  category: 'document',         // mail|image|document|archive|video|audio|executable|database|font|text
}
```

Per firme con offset o verifica extra:
```js
{
  ext: '.webp',
  bytes: [0x52,0x49,0x46,0x46],       // "RIFF" a offset 0
  extra: { offset: 8, bytes: [0x57,0x45,0x42,0x50] },  // "WEBP" a offset 8
  ...
}
```

---

## 🧠 Come funziona

### Magic bytes
Ogni formato di file ha una "firma" nei primi byte — indipendente dall'estensione. Ad esempio:
- `FF D8 FF` → JPEG
- `89 50 4E 47` → PNG
- `D0 CF 11 E0` → OLE2 Compound Document

### OLE2 Deep Scan
I file Office legacy (`.doc`, `.xls`, `.ppt`) e le email Outlook (`.msg`) condividono lo stesso magic byte OLE2. FileSpy analizza la struttura interna del Compound Document leggendo i directory entry e cercando stream-name caratteristici:
- `__properties_version1.0` + `__nameid_version1.0` → **`.msg`**
- `WordDocument` → **`.doc`**
- `Workbook` → **`.xls`**
- `PowerPoint Document` → **`.ppt`**

---

## 📄 Licenza

MIT — libero uso, modifica e redistribuzione.
