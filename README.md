# FileSpy by impe-byte

[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=black)](#)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite&logoColor=white)](#)
[![Deploy on Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?logo=vercel&logoColor=white)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](#)

> **Where IT Infrastructure meets Intelligent Automation** — *impe-byte*

FileSpy is a minimalist, professional, 100% client-side web application designed to reliably identify files using "Magic Bytes" analysis.

## Value Proposition
- **Privacy First:** 100% local processing. Files never leave your machine; there are zero server uploads.
- **Accuracy:** Circumvents manipulated file extensions by reading the actual binary signatures.
- **Enterprise Ready:** Clean, minimal UI aligned with the **impe-byte** brand identity. Deep Navy and Signal Blue aesthetics.
- **Multilingual Support:** Auto-detects user locale (EN/IT) to instantly adapt the interface.

## Core Features
1. **Magic Bytes Detection:** Compares the hex dumps of the first few bytes against a robust database of over 55+ file formats.
2. **OLE2 Deep Scan Architecture:** 
   Our unique engine doesn't just parse standard headers. For Microsoft Office and Email formats (`.msg`), FileSpy implements a Deep Scan mechanism capable of penetrating OLE2 (Compound File Binary Format) structures to determine the exact sub-type of the payload with high precision.
3. **Batch Analysis:** Drag and drop folders or multiple files simultaneously.
4. **Export to CSV:** Obtain audit-ready format reports.

## Supported Formats
| Category | Formats |
| --- | --- |
| **Documents / Office** | `pdf`, `doc`, `docx`, `xls`, `xlsx`, `ppt`, `pptx` |
| **Emails** | `eml`, `msg` (Full OLE2 parse) |
| **Images** | `jpeg`, `png`, `gif`, `webp`, `bmp`, `ico`, `tiff`, `heic` |
| **Media** | `mp4`, `mkv`, `avi`, `mp3`, `flac`, `wav`, `ogg` |
| **Archives** | `zip`, `rar`, `7z`, `tar`, `gz` |
| **Executables** | `exe`, `elf`, `macho`, `dll` |

## Technical Explanation: Magic Bytes Engine
Most operating systems map files to specific applications based merely on their string extension (e.g. `.pdf`). FileSpy bypasses this weak association by directly reading the file header stream using the `FileReader` API and `Uint8Array`.
Every file contains a magic number (or file signature) at offset `0x00`. For example, all `PDF` files start with `25 50 44 46` (`%PDF`). The analytic engine chunks the beginning of the binary stream, converts it into hex variables, and matches those against an internal multi-layered decision tree, resulting in high-performance identification that is immune to basic spoofing.

## Local Development
Clone the repository and install dependencies:
```bash
git clone https://github.com/impe-byte/filespy.git
cd filespy
npm install
npm run dev
```

## Deployment
FileSpy is fully optimized to be built as a static site.
```bash
npm run build
```
The resulting `dist/` directory can be easily deployed via Vercel, Netlify, or any static file-server.
