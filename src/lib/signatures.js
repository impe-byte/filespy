// Magic bytes signature database
export const SIGNATURES = [
  // ── MAIL ─────────────────────────────────────────────────────────
  { ext: '.eml',  mime: 'message/rfc822',          bytes: [0x52,0x65,0x74,0x75,0x72,0x6E],                  desc: 'EML Email (Return-Path)',        category: 'mail' },
  { ext: '.eml',  mime: 'message/rfc822',          bytes: [0x46,0x72,0x6F,0x6D,0x20],                       desc: 'EML Email (From header)',         category: 'mail' },
  { ext: '.eml',  mime: 'message/rfc822',          bytes: [0x44,0x61,0x74,0x65,0x3A],                       desc: 'EML Email (Date header)',         category: 'mail' },
  { ext: '.eml',  mime: 'message/rfc822',          bytes: [0x4D,0x49,0x4D,0x45,0x2D],                       desc: 'EML Email (MIME header)',         category: 'mail' },
  { ext: '.mbox', mime: 'application/mbox',        bytes: [0x46,0x72,0x6F,0x6D,0x20],                       desc: 'MBOX Mailbox',                   category: 'mail' },
  { ext: '.pst',  mime: 'application/vnd.ms-outlook-pst', bytes: [0x21,0x42,0x44,0x4E],                    desc: 'Outlook PST/OST',                category: 'mail' },
  // ── IMAGES ───────────────────────────────────────────────────────
  { ext: '.jpg',  mime: 'image/jpeg',              bytes: [0xFF,0xD8,0xFF],                                  desc: 'JPEG Image',                     category: 'image' },
  { ext: '.png',  mime: 'image/png',               bytes: [0x89,0x50,0x4E,0x47,0x0D,0x0A],                 desc: 'PNG Image',                      category: 'image' },
  { ext: '.gif',  mime: 'image/gif',               bytes: [0x47,0x49,0x46,0x38],                            desc: 'GIF Image',                      category: 'image' },
  { ext: '.bmp',  mime: 'image/bmp',               bytes: [0x42,0x4D],                                      desc: 'BMP Image',                      category: 'image' },
  { ext: '.webp', mime: 'image/webp',              bytes: [0x52,0x49,0x46,0x46], extra: { offset:8, bytes:[0x57,0x45,0x42,0x50] }, desc: 'WebP Image', category: 'image' },
  { ext: '.tiff', mime: 'image/tiff',              bytes: [0x49,0x49,0x2A,0x00],                            desc: 'TIFF Image',                     category: 'image' },
  { ext: '.tiff', mime: 'image/tiff',              bytes: [0x4D,0x4D,0x00,0x2A],                            desc: 'TIFF Image (Big Endian)',         category: 'image' },
  { ext: '.ico',  mime: 'image/x-icon',            bytes: [0x00,0x00,0x01,0x00],                            desc: 'ICO Icon',                       category: 'image' },
  { ext: '.psd',  mime: 'image/vnd.adobe.photoshop', bytes: [0x38,0x42,0x50,0x53],                         desc: 'Photoshop PSD',                  category: 'image' },
  { ext: '.heic', mime: 'image/heic',              bytes: [0x66,0x74,0x79,0x70,0x68,0x65,0x69], offset:4,  desc: 'HEIC Image',                     category: 'image' },
  // ── DOCUMENTS ────────────────────────────────────────────────────
  { ext: '.pdf',  mime: 'application/pdf',         bytes: [0x25,0x50,0x44,0x46],                            desc: 'PDF Document',                   category: 'document' },
  { ext: '.ole2', mime: 'application/x-ole2',      bytes: [0xD0,0xCF,0x11,0xE0,0xA1,0xB1,0x1A,0xE1],      desc: 'OLE2 Compound Document',         category: 'document', ole2: true },
  { ext: '.xml',  mime: 'text/xml',                bytes: [0x3C,0x3F,0x78,0x6D,0x6C],                      desc: 'XML File',                       category: 'document' },
  { ext: '.html', mime: 'text/html',               bytes: [0x3C,0x21,0x44,0x4F,0x43,0x54],                 desc: 'HTML File',                      category: 'document' },
  { ext: '.rtf',  mime: 'application/rtf',         bytes: [0x7B,0x5C,0x72,0x74,0x66],                      desc: 'Rich Text Format',               category: 'document' },
  // ── ARCHIVES ─────────────────────────────────────────────────────
  { ext: '.zip',  mime: 'application/zip',         bytes: [0x50,0x4B,0x03,0x04],                            desc: 'ZIP Archive',                    category: 'archive' },
  { ext: '.rar',  mime: 'application/x-rar',       bytes: [0x52,0x61,0x72,0x21,0x1A,0x07],                 desc: 'RAR Archive',                    category: 'archive' },
  { ext: '.7z',   mime: 'application/x-7z',        bytes: [0x37,0x7A,0xBC,0xAF,0x27,0x1C],                 desc: '7-Zip Archive',                  category: 'archive' },
  { ext: '.gz',   mime: 'application/gzip',        bytes: [0x1F,0x8B],                                      desc: 'GZIP Archive',                   category: 'archive' },
  { ext: '.bz2',  mime: 'application/x-bzip2',     bytes: [0x42,0x5A,0x68],                                 desc: 'BZIP2 Archive',                  category: 'archive' },
  { ext: '.xz',   mime: 'application/x-xz',        bytes: [0xFD,0x37,0x7A,0x58,0x5A,0x00],                 desc: 'XZ Archive',                     category: 'archive' },
  { ext: '.iso',  mime: 'application/x-iso9660',   bytes: [0x43,0x44,0x30,0x30,0x31], offset:32769,         desc: 'ISO Disc Image',                 category: 'archive' },
  // ── VIDEO ────────────────────────────────────────────────────────
  { ext: '.mp4',  mime: 'video/mp4',               bytes: [0x66,0x74,0x79,0x70], offset:4,                  desc: 'MP4 Video',                      category: 'video' },
  { ext: '.mkv',  mime: 'video/x-matroska',        bytes: [0x1A,0x45,0xDF,0xA3],                            desc: 'MKV Video',                      category: 'video' },
  { ext: '.avi',  mime: 'video/x-msvideo',         bytes: [0x52,0x49,0x46,0x46], extra: { offset:8, bytes:[0x41,0x56,0x49,0x20] }, desc: 'AVI Video', category: 'video' },
  { ext: '.flv',  mime: 'video/x-flv',             bytes: [0x46,0x4C,0x56,0x01],                            desc: 'Flash Video',                    category: 'video' },
  { ext: '.wmv',  mime: 'video/x-ms-wmv',          bytes: [0x30,0x26,0xB2,0x75,0x8E,0x66],                 desc: 'WMV Video',                      category: 'video' },
  // ── AUDIO ────────────────────────────────────────────────────────
  { ext: '.mp3',  mime: 'audio/mpeg',              bytes: [0xFF,0xFB],                                      desc: 'MP3 Audio',                      category: 'audio' },
  { ext: '.mp3',  mime: 'audio/mpeg',              bytes: [0x49,0x44,0x33],                                 desc: 'MP3 Audio (ID3 tag)',             category: 'audio' },
  { ext: '.wav',  mime: 'audio/wav',               bytes: [0x52,0x49,0x46,0x46], extra: { offset:8, bytes:[0x57,0x41,0x56,0x45] }, desc: 'WAV Audio', category: 'audio' },
  { ext: '.flac', mime: 'audio/flac',              bytes: [0x66,0x4C,0x61,0x43],                            desc: 'FLAC Audio',                     category: 'audio' },
  { ext: '.ogg',  mime: 'audio/ogg',               bytes: [0x4F,0x67,0x67,0x53],                            desc: 'OGG Audio',                      category: 'audio' },
  { ext: '.aac',  mime: 'audio/aac',               bytes: [0xFF,0xF1],                                      desc: 'AAC Audio',                      category: 'audio' },
  // ── EXECUTABLES ──────────────────────────────────────────────────
  { ext: '.exe',  mime: 'application/x-msdownload', bytes: [0x4D,0x5A],                                    desc: 'Windows Executable / DLL',       category: 'executable' },
  { ext: '.elf',  mime: 'application/x-elf',       bytes: [0x7F,0x45,0x4C,0x46],                           desc: 'ELF Binary (Linux/macOS)',        category: 'executable' },
  { ext: '.class',mime: 'application/java-vm',     bytes: [0xCA,0xFE,0xBA,0xBE],                           desc: 'Java Class File',                category: 'executable' },
  { ext: '.wasm', mime: 'application/wasm',        bytes: [0x00,0x61,0x73,0x6D],                           desc: 'WebAssembly Module',             category: 'executable' },
  // ── DATABASE / FONT / OTHER ───────────────────────────────────────
  { ext: '.sqlite', mime: 'application/x-sqlite3', bytes: [0x53,0x51,0x4C,0x69,0x74,0x65],                 desc: 'SQLite Database',                category: 'database' },
  { ext: '.ttf',  mime: 'font/ttf',               bytes: [0x00,0x01,0x00,0x00,0x00],                       desc: 'TrueType Font',                  category: 'font' },
  { ext: '.otf',  mime: 'font/otf',               bytes: [0x4F,0x54,0x54,0x4F],                            desc: 'OpenType Font',                  category: 'font' },
  { ext: '.woff', mime: 'font/woff',              bytes: [0x77,0x4F,0x46,0x46],                            desc: 'WOFF Font',                      category: 'font' },
  { ext: '.woff2',mime: 'font/woff2',             bytes: [0x77,0x4F,0x46,0x32],                            desc: 'WOFF2 Font',                     category: 'font' },
];

export const CATEGORY_ICONS = {
  mail:       '✉',
  image:      '🖼',
  document:   '📄',
  archive:    '📦',
  video:      '🎬',
  audio:      '🎵',
  executable: '⚙',
  database:   '🗄',
  font:       '🔤',
  text:       '📝',
  unknown:    '❓',
};
