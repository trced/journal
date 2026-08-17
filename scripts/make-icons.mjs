/**
 * Génère les icônes et l'image de partage, sans dépendance externe.
 *
 * La marque est le mot : « journal » devient « j. » — l'initiale
 * dans la fonte de l'interface, suivie du point « ● », seul signe que la
 * famille « . » possède en propre. L'image de partage porte le mot entier.
 *
 * Les tracés sont figés ci-dessous, relevés le 2026-08-17 dans
 * JetBrainsMonoNerdFont-Regular.ttf (hauteur d'x 14/32).
 *
 * Le dépôt régénère donc ses images sans la fonte et sans paquet :
 *
 *   node scripts/make-icons.mjs
 */

import { deflateSync } from 'node:zlib'
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'public')

const INK = [0x17, 0x18, 0x1a]
const PAPER = [0xf2, 0xf3, 0xf2]

/** Le mark sur la grille 32 : l'initiale, puis le point sur sa ligne de base. */
const MARK_PATH = 'M5.092 28.18L5.092 26.093L8.249 26.093Q9.827 26.093 10.705 25.227Q11.583 24.362 11.583 22.809L11.583 11.685L4.965 11.685L4.965 9.598L13.874 9.598L13.874 22.809Q13.874 25.278 12.347 26.729Q10.82 28.18 8.249 28.18L5.092 28.18L5.092 28.18ZM12.474 7.078Q11.634 7.078 11.151 6.645Q10.667 6.213 10.667 5.474Q10.667 4.711 11.151 4.265Q11.634 3.82 12.474 3.82Q13.314 3.82 13.798 4.265Q14.282 4.711 14.282 5.474Q14.282 6.213 13.798 6.645Q13.314 7.078 12.474 7.078L12.474 7.078Z'
const MARK_DOT = { cx: 24.947, cy: 21.511, r: 2.087 }

/** Le wordmark : le mot entier, origine à gauche, ligne de base à 0. */
const WORD_PATH = 'M2.291 4.582L2.291 2.495L5.447 2.495Q7.025 2.495 7.904 1.629Q8.782 0.764 8.782 -0.789L8.782 -11.913L2.164 -11.913L2.164 -14L11.073 -14L11.073 -0.789Q11.073 1.68 9.545 3.131Q8.018 4.582 5.447 4.582L2.291 4.582L2.291 4.582ZM9.673 -16.52Q8.833 -16.52 8.349 -16.953Q7.865 -17.385 7.865 -18.124Q7.865 -18.887 8.349 -19.333Q8.833 -19.778 9.673 -19.778Q10.513 -19.778 10.996 -19.333Q11.48 -18.887 11.48 -18.124Q11.48 -17.385 10.996 -16.953Q10.513 -16.52 9.673 -16.52L9.673 -16.52ZM22.145 0.204Q19.625 0.204 18.136 -1.273Q16.647 -2.749 16.647 -5.396L16.647 -8.604Q16.647 -11.276 18.124 -12.74Q19.6 -14.204 22.145 -14.204Q24.691 -14.204 26.167 -12.74Q27.644 -11.276 27.644 -8.604L27.644 -5.396Q27.644 -2.749 26.155 -1.273Q24.665 0.204 22.145 0.204L22.145 0.204ZM22.145 -1.833Q23.647 -1.833 24.5 -2.673Q25.353 -3.513 25.353 -5.142L25.353 -8.858Q25.353 -10.487 24.5 -11.327Q23.647 -12.167 22.145 -12.167Q20.669 -12.167 19.804 -11.327Q18.938 -10.487 18.938 -8.858L18.938 -5.142Q18.938 -3.513 19.804 -2.673Q20.669 -1.833 22.145 -1.833L22.145 -1.833ZM36.629 0.255Q34.211 0.255 32.76 -1.184Q31.309 -2.622 31.309 -5.091L31.309 -14L33.6 -14L33.6 -5.091Q33.6 -3.564 34.415 -2.66Q35.229 -1.756 36.629 -1.756Q38.055 -1.756 38.882 -2.66Q39.709 -3.564 39.709 -5.091L39.709 -14L42 -14L42 -5.091Q42 -2.622 40.524 -1.184Q39.047 0.255 36.629 0.255L36.629 0.255ZM46.378 0L46.378 -14L48.669 -14L48.669 -11.327L48.72 -11.327Q48.898 -12.676 49.865 -13.465Q50.833 -14.255 52.462 -14.255Q54.651 -14.255 55.835 -12.944Q57.018 -11.633 57.018 -9.215L57.018 -8.018L54.727 -8.018L54.727 -9.215Q54.727 -12.269 51.749 -12.269Q50.247 -12.269 49.458 -11.404Q48.669 -10.538 48.669 -8.909L48.669 0L46.378 0L46.378 0ZM60.378 0L60.378 -14L62.669 -14L62.669 -11.327L62.695 -11.327Q62.873 -12.727 63.84 -13.491Q64.807 -14.255 66.411 -14.255Q68.524 -14.255 69.771 -12.956Q71.018 -11.658 71.018 -9.418L71.018 0L68.727 0L68.727 -9.011Q68.727 -10.615 67.925 -11.467Q67.124 -12.32 65.749 -12.32Q64.324 -12.32 63.496 -11.429Q62.669 -10.538 62.669 -8.909L62.669 0L60.378 0L60.378 0ZM78.96 0.255Q76.796 0.255 75.524 -0.955Q74.251 -2.164 74.251 -4.124Q74.251 -5.422 74.836 -6.389Q75.422 -7.356 76.465 -7.904Q77.509 -8.451 78.858 -8.451L83.185 -8.451L83.185 -9.545Q83.185 -12.269 80.207 -12.269Q78.884 -12.269 78.069 -11.785Q77.255 -11.302 77.204 -10.436L74.913 -10.436Q75.04 -12.091 76.453 -13.173Q77.865 -14.255 80.207 -14.255Q82.753 -14.255 84.115 -13.033Q85.476 -11.811 85.476 -9.622L85.476 0L83.211 0L83.211 -2.545L83.16 -2.545Q82.956 -1.247 81.862 -0.496Q80.767 0.255 78.96 0.255L78.96 0.255ZM79.52 -1.68Q81.2 -1.68 82.193 -2.495Q83.185 -3.309 83.185 -4.709L83.185 -6.669L79.113 -6.669Q77.993 -6.669 77.293 -5.995Q76.593 -5.32 76.593 -4.2Q76.593 -3.029 77.369 -2.355Q78.145 -1.68 79.52 -1.68L79.52 -1.68ZM96.727 0Q94.869 0 93.762 -1.082Q92.655 -2.164 92.655 -3.945L92.655 -16.495L87.818 -16.495L87.818 -18.582L94.945 -18.582L94.945 -3.945Q94.945 -3.08 95.429 -2.584Q95.913 -2.087 96.727 -2.087L101.055 -2.087L101.055 0L96.727 0L96.727 0Z'
const WORD_DOT = { cx: 109.2, cy: -2.087, r: 2.087 }
const WORD_BOX = { x0: 2.164, y0: -19.778, width: 109.124, height: 24.36 }

/** Icône masquable : le mark tient dans la zone sûre de 80 %. */
const MASKABLE_ZOOM = 0.8

/** Image de partage : le format qu'attendent les aperçus de lien. */
const OG = { width: 1200, height: 630, measure: 0.62 }

const CRC_TABLE = (() => {
  const table = new Int32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    table[n] = c
  }
  return table
})()

function crc32(buffer) {
  let c = 0xffffffff
  for (const byte of buffer) c = CRC_TABLE[(c ^ byte) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const length = Buffer.alloc(4)
  length.writeUInt32BE(data.length)
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(body))
  return Buffer.concat([length, body, crc])
}

/** PNG truecolore 8 bits, sans transparence — l'image est toujours pleine. */
function encodePng(width, height, pixels) {
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8 // profondeur
  ihdr[9] = 2 // truecolor
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(pixels, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

/** « d » SVG (M/L/Q/Z uniquement) → polygones, courbes aplaties. */
function flatten(d, steps = 24) {
  const tokens = d.match(/[MLQZ][^MLQZ]*/gi) ?? []
  const polygons = []
  let current = null
  let start = null
  let cursor = { x: 0, y: 0 }

  const numbers = (s) => (s.match(/-?\d*\.?\d+(?:e[-+]?\d+)?/gi) ?? []).map(Number)

  for (const token of tokens) {
    const op = token[0].toUpperCase()
    const n = numbers(token.slice(1))

    if (op === 'M') {
      if (current && current.length > 2) polygons.push(current)
      cursor = { x: n[0], y: n[1] }
      start = cursor
      current = [cursor]
    } else if (op === 'L') {
      cursor = { x: n[0], y: n[1] }
      current.push(cursor)
    } else if (op === 'Q') {
      const c = { x: n[0], y: n[1] }
      const to = { x: n[2], y: n[3] }
      for (let i = 1; i <= steps; i++) {
        const t = i / steps
        const u = 1 - t
        current.push({
          x: u * u * cursor.x + 2 * u * t * c.x + t * t * to.x,
          y: u * u * cursor.y + 2 * u * t * c.y + t * t * to.y,
        })
      }
      cursor = to
    } else if (op === 'Z') {
      if (current && start) current.push(start)
      if (current && current.length > 2) polygons.push(current)
      current = null
    }
  }
  if (current && current.length > 2) polygons.push(current)
  return polygons
}

/** Cercle → polygone, dans les mêmes coordonnées. */
function circlePolygon({ cx, cy, r }, sides = 160) {
  const points = []
  for (let i = 0; i <= sides; i++) {
    const a = (i / sides) * Math.PI * 2
    points.push({ x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r })
  }
  return points
}

/** Met les polygones à l'échelle et les décale — vers des pixels. */
function place(polygons, { scale = 1, dx = 0, dy = 0 }) {
  return polygons.map((poly) => poly.map((p) => ({ x: p.x * scale + dx, y: p.y * scale + dy })))
}

/**
 * Couverture par balayage : remplissage non-zero, 4 sous-lignes par pixel,
 * couverture horizontale exacte. Les polygones sont déjà en pixels.
 */
function coverage(polygons, width, height) {
  const SUB = 4
  const cover = new Float32Array(width * height)

  const edges = []
  for (const poly of polygons) {
    for (let i = 0; i < poly.length - 1; i++) {
      const a = poly[i]
      const b = poly[i + 1]
      if (a.y === b.y) continue
      edges.push({ x0: a.x, y0: a.y, x1: b.x, y1: b.y, winding: b.y > a.y ? 1 : -1 })
    }
  }

  const crossings = []
  for (let sy = 0; sy < height * SUB; sy++) {
    const y = (sy + 0.5) / SUB
    crossings.length = 0

    for (const e of edges) {
      const top = Math.min(e.y0, e.y1)
      const bottom = Math.max(e.y0, e.y1)
      if (y < top || y >= bottom) continue
      const t = (y - e.y0) / (e.y1 - e.y0)
      crossings.push({ x: e.x0 + t * (e.x1 - e.x0), winding: e.winding })
    }
    if (crossings.length < 2) continue

    crossings.sort((a, b) => a.x - b.x)

    const row = Math.floor(sy / SUB) * width
    let winding = 0
    for (let i = 0; i < crossings.length - 1; i++) {
      winding += crossings[i].winding
      if (winding === 0) continue

      let xa = crossings[i].x
      let xb = crossings[i + 1].x
      if (xb <= 0 || xa >= width) continue
      if (xa < 0) xa = 0
      if (xb > width) xb = width

      const first = Math.floor(xa)
      const last = Math.min(Math.ceil(xb) - 1, width - 1)
      for (let px = first; px <= last; px++) {
        const left = Math.max(xa, px)
        const right = Math.min(xb, px + 1)
        if (right > left) cover[row + px] += (right - left) / SUB
      }
    }
  }
  return cover
}

/** Compose le PNG : fond plein, tracé dans la couleur opposée. */
function render(options) {
  const { width, height, polygons, background, foreground } = options
  const cover = coverage(polygons, width, height)
  const stride = width * 3 + 1
  const pixels = Buffer.alloc(stride * height)

  for (let y = 0; y < height; y++) {
    const row = y * stride
    pixels[row] = 0 // filtre « none »
    for (let x = 0; x < width; x++) {
      const alpha = Math.min(1, cover[y * width + x])
      const offset = row + 1 + x * 3
      for (let c = 0; c < 3; c++) {
        pixels[offset + c] = Math.round(
          background[c] + (foreground[c] - background[c]) * alpha,
        )
      }
    }
  }
  return encodePng(width, height, pixels)
}

const markPolygons = [...flatten(MARK_PATH), circlePolygon(MARK_DOT)]
const wordPolygons = [...flatten(WORD_PATH), circlePolygon(WORD_DOT)]

const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" fill="#17181a"/>
  <path d="${MARK_PATH}" fill="#f2f3f2"/>
  <circle cx="${MARK_DOT.cx}" cy="${MARK_DOT.cy}" r="${MARK_DOT.r}" fill="#f2f3f2"/>
</svg>
`

/** L'icône carrée : la grille 32 portée à la taille demandée. */
function icon(size, zoom = 1) {
  const scale = (size / 32) * zoom
  const shift = (size * (1 - zoom)) / 2
  return render({
    width: size,
    height: size,
    polygons: place(markPolygons, { scale, dx: shift, dy: shift }),
    background: INK,
    foreground: PAPER,
  })
}

/** L'image de partage : le mot, centré, sur toute la surface. */
function share() {
  const scale = (OG.width * OG.measure) / WORD_BOX.width
  return render({
    width: OG.width,
    height: OG.height,
    polygons: place(wordPolygons, {
      scale,
      dx: (OG.width - WORD_BOX.width * scale) / 2 - WORD_BOX.x0 * scale,
      dy: (OG.height - WORD_BOX.height * scale) / 2 - WORD_BOX.y0 * scale,
    }),
    background: INK,
    foreground: PAPER,
  })
}

mkdirSync(OUT, { recursive: true })

const files = [
  ['icon-192.png', icon(192)],
  ['icon-512.png', icon(512)],
  ['icon-maskable-512.png', icon(512, MASKABLE_ZOOM)],
  ['apple-touch-icon.png', icon(180)],
  ['og.png', share()],
  ['favicon.svg', Buffer.from(favicon, 'utf8')],
]

for (const [name, data] of files) {
  writeFileSync(join(OUT, name), data)
  console.log(`${name} — ${data.length} o`)
}
