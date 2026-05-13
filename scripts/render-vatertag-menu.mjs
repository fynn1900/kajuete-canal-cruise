import { Resvg } from '@resvg/resvg-js'
import { writeFileSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const repo = join(__dirname, '..')

// ── A4 hochkant @ 150 DPI = 1240 × 1754 px ────────────────────────────
const W = 1240
const H = 1754

const INK = '#14110d'
const PAPER = '#fffaf0'
const MUTED = '#4a4236'

// Innenrahmen-Geometrie
const outerX = 90, outerY = 90
const outerW = W - outerX * 2
const outerH = H - outerY * 2
const innerOffset = 22
const innerX = outerX + innerOffset
const innerY = outerY + innerOffset
const innerW = outerW - innerOffset * 2
const innerH = outerH - innerOffset * 2

// Mittelachse
const cx = W / 2

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg"
     width="${W}" height="${H}"
     viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${PAPER}"/>

  <!-- Doppelter Rahmen -->
  <rect x="${outerX}" y="${outerY}" width="${outerW}" height="${outerH}"
        fill="none" stroke="${INK}" stroke-width="2"/>
  <rect x="${innerX}" y="${innerY}" width="${innerW}" height="${innerH}"
        fill="none" stroke="${INK}" stroke-width="1"/>

  <!-- Kicker: Datum -->
  <text x="${cx}" y="230" text-anchor="middle"
        font-family="Liberation Sans, DejaVu Sans, sans-serif"
        font-size="22" letter-spacing="8" fill="${INK}">
    DONNERSTAG · 14. MAI 2026
  </text>

  <!-- Titel -->
  <text x="${cx}" y="350" text-anchor="middle"
        font-family="Liberation Serif, DejaVu Serif, serif"
        font-style="italic" font-size="120" fill="${INK}">
    Menü
  </text>
  <text x="${cx}" y="400" text-anchor="middle"
        font-family="Liberation Sans, DejaVu Sans, sans-serif"
        font-size="22" letter-spacing="12" fill="${INK}">
    ZUM
  </text>
  <text x="${cx}" y="520" text-anchor="middle"
        font-family="Liberation Serif, DejaVu Serif, serif"
        font-style="italic" font-size="120" fill="${INK}">
    Vatertag
  </text>

  <!-- Widmung -->
  <text x="${cx}" y="585" text-anchor="middle"
        font-family="Liberation Serif, DejaVu Serif, serif"
        font-style="italic" font-size="30" fill="${MUTED}">
    — für Papa, mit Liebe —
  </text>

  <!-- Zier-Linie -->
  ${diamondRule(cx, 645, 140)}

  <!-- ─────────── Vorspeise ─────────── -->
  ${courseBlock({
    y: 740,
    roman: 'I',
    label: 'VORSPEISE',
    name: 'Lieblinge & Nicht-Lieblinge',
    note: 'Eine kleine Auswahl an Köstlichkeiten —',
    note2: 'das eine oder andere darf liegen bleiben.',
  })}

  ${ornament(cx, 950)}

  <!-- ─────────── Hauptgang ─────────── -->
  ${courseBlock({
    y: 1030,
    roman: 'II',
    label: 'HAUPTGANG',
    name: 'Sansibars Lachsnudeln',
    note: 'Hausgemacht, mit ganz viel',
    note2: 'Herz aus der Küche.',
  })}

  ${ornament(cx, 1240)}

  <!-- ─────────── Nachtisch (zwei Desserts) ─────────── -->
  <text x="${cx}" y="1310" text-anchor="middle"
        font-family="Liberation Serif, DejaVu Serif, serif"
        font-style="italic" font-size="26" fill="${MUTED}">
    III
  </text>
  <text x="${cx}" y="1345" text-anchor="middle"
        font-family="Liberation Sans, DejaVu Sans, sans-serif"
        font-size="20" letter-spacing="10" fill="${INK}">
    NACHTISCH
  </text>
  <text x="${cx}" y="1400" text-anchor="middle"
        font-family="Liberation Serif, DejaVu Serif, serif"
        font-style="italic" font-size="42" fill="${INK}">
    Zitronenkuchen in Herzform
  </text>
  <text x="${cx}" y="1445" text-anchor="middle"
        font-family="Liberation Serif, DejaVu Serif, serif"
        font-style="italic" font-size="26" fill="${MUTED}">
    &amp;
  </text>
  <text x="${cx}" y="1495" text-anchor="middle"
        font-family="Liberation Serif, DejaVu Serif, serif"
        font-style="italic" font-size="42" fill="${INK}">
    Zitronen-Biskuit-Rolle
  </text>

  <!-- Fußzeile -->
  ${diamondRule(cx, 1540, 140)}
  <text x="${cx}" y="1585" text-anchor="middle"
        font-family="Liberation Serif, DejaVu Serif, serif"
        font-style="italic" font-size="30" fill="${INK}">
    Guten Appetit, lieber Papa
  </text>
  <text x="${cx}" y="1625" text-anchor="middle"
        font-family="Liberation Serif, DejaVu Serif, serif"
        font-size="28" fill="${INK}">
    ❦
  </text>
</svg>
`

function courseBlock({ y, roman, label, name, note, note2 }) {
  return `
  <text x="${cx}" y="${y}" text-anchor="middle"
        font-family="Liberation Serif, DejaVu Serif, serif"
        font-style="italic" font-size="26" fill="${MUTED}">
    ${roman}
  </text>
  <text x="${cx}" y="${y + 35}" text-anchor="middle"
        font-family="Liberation Sans, DejaVu Sans, sans-serif"
        font-size="20" letter-spacing="10" fill="${INK}">
    ${label}
  </text>
  <text x="${cx}" y="${y + 90}" text-anchor="middle"
        font-family="Liberation Serif, DejaVu Serif, serif"
        font-style="italic" font-size="48" fill="${INK}">
    ${escapeXml(name)}
  </text>
  <text x="${cx}" y="${y + 130}" text-anchor="middle"
        font-family="Liberation Serif, DejaVu Serif, serif"
        font-style="italic" font-size="24" fill="${MUTED}">
    ${escapeXml(note)}
  </text>
  <text x="${cx}" y="${y + 160}" text-anchor="middle"
        font-family="Liberation Serif, DejaVu Serif, serif"
        font-style="italic" font-size="24" fill="${MUTED}">
    ${escapeXml(note2)}
  </text>`
}

function ornament(cx, y) {
  const dashW = 90
  return `
  <line x1="${cx - dashW - 18}" y1="${y}" x2="${cx - 18}" y2="${y}" stroke="${INK}" stroke-width="1"/>
  <text x="${cx}" y="${y + 6}" text-anchor="middle"
        font-family="Liberation Sans, DejaVu Sans, sans-serif"
        font-size="14" fill="${INK}">◆</text>
  <line x1="${cx + 18}" y1="${y}" x2="${cx + dashW + 18}" y2="${y}" stroke="${INK}" stroke-width="1"/>`
}

function diamondRule(cx, y, width) {
  const half = width / 2
  const d = 7
  return `
  <line x1="${cx - half}" y1="${y}" x2="${cx + half}" y2="${y}" stroke="${INK}" stroke-width="1.5"/>
  <polygon points="${cx - half - d},${y} ${cx - half},${y - d} ${cx - half + d},${y} ${cx - half},${y + d}" fill="${INK}"/>
  <polygon points="${cx + half - d},${y} ${cx + half},${y - d} ${cx + half + d},${y} ${cx + half},${y + d}" fill="${INK}"/>`
}

function escapeXml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

// SVG schreiben (zum Anschauen / Bearbeiten)
const svgPath = join(repo, 'vatertag-menu.svg')
writeFileSync(svgPath, svg)
console.log('SVG geschrieben:', svgPath)

// PNG rendern
const resvg = new Resvg(svg, {
  fitTo: { mode: 'width', value: W },
  font: { loadSystemFonts: true },
  background: PAPER,
})
const pngData = resvg.render().asPng()
const pngPath = join(repo, 'vatertag-menu.png')
writeFileSync(pngPath, pngData)
console.log('PNG geschrieben:', pngPath, `(${(pngData.length / 1024).toFixed(0)} KB)`)
