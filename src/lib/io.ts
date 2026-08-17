/** journal.json — lecture, écriture, fusion, partage. Et la sortie en texte,
 *  qui n'est pas un format d'échange mais une porte : un journal doit pouvoir
 *  se relire sans ce programme.
 *
 *  L'import est validé contre le schéma, jamais écrasé en silence. */

import { isISODate, isTime, todayISO } from './format.ts'
import { isMood, sortEntries, wordCount } from './entries.ts'
import { SCHEMA_VERSION } from './types.ts'
import type { Entry, JournalFile, Mood, Settings } from './types.ts'

/** « journal-2026-08-12.json » : deux exports du même appareil ne se
 *  recouvrent pas dans le dossier de téléchargement. */
export function exportFilename(date = todayISO()): string {
  return `journal-${date}.json`
}

export function textFilename(date = todayISO()): string {
  return `journal-${date}.txt`
}

export type ParseResult =
  | { ok: true; file: JournalFile }
  | { ok: false; reason: 'unreadable' | 'schema' | 'version' }

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function asString(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

function asMood(value: unknown): Mood | null {
  return isMood(value) ? value : null
}

/** Une entrée sans date valide n'a pas de jour où s'afficher : elle est
 *  écartée seule, sans faire échouer le reste du fichier. */
function asEntry(value: unknown): Entry | null {
  if (!isRecord(value)) return null
  const date = asString(value.date)
  if (!isISODate(date)) return null
  const writtenAt = asString(value.writtenAt)
  const entry: Entry = {
    date,
    text: asString(value.text).trim(),
    note: asString(value.note).trim(),
    mood: asMood(value.mood),
    place: asString(value.place).trim(),
    writtenAt: isTime(writtenAt) ? writtenAt : null,
  }
  if (
    entry.text === '' &&
    entry.note === '' &&
    entry.mood === null &&
    entry.place === ''
  ) {
    return null
  }
  return entry
}

/** Deux entrées pour le même jour ne peuvent pas coexister : la première
 *  lue gagne, et le doublon est écarté plutôt que de recouvrir. */
function asEntries(value: unknown): Entry[] {
  if (!Array.isArray(value)) return []
  const seen = new Set<string>()
  const out: Entry[] = []
  for (const raw of value) {
    const entry = asEntry(raw)
    if (!entry || seen.has(entry.date)) continue
    seen.add(entry.date)
    out.push(entry)
  }
  return sortEntries(out)
}

function asSettings(value: unknown): Partial<Settings> {
  if (!isRecord(value)) return {}
  const out: Partial<Settings> = {}
  const pick = <K extends keyof Settings>(
    key: K,
    allowed: readonly Settings[K][],
  ): void => {
    const v = value[key]
    if (allowed.includes(v as Settings[K])) out[key] = v as Settings[K]
  }
  pick('theme', ['system', 'light', 'dark'])
  pick('lang', ['system', 'fr', 'en'])
  pick('firstDay', ['monday', 'sunday'])
  pick('mood', ['asked', 'hidden'])
  pick('note', ['asked', 'hidden'])
  pick('textSize', ['small', 'medium', 'large'])
  return out
}

export function parseFile(text: string): ParseResult {
  let raw: unknown
  try {
    raw = JSON.parse(text)
  } catch {
    return { ok: false, reason: 'unreadable' }
  }
  if (!isRecord(raw)) return { ok: false, reason: 'schema' }

  const version = Number(raw.schemaVersion)
  if (!Number.isFinite(version)) return { ok: false, reason: 'schema' }
  if (version !== SCHEMA_VERSION) return { ok: false, reason: 'version' }

  const data = isRecord(raw.data) ? raw.data : null
  if (!data || !Array.isArray(data.entries)) {
    return { ok: false, reason: 'schema' }
  }

  return {
    ok: true,
    file: {
      schemaVersion: SCHEMA_VERSION,
      data: { entries: asEntries(data.entries) },
      settings: asSettings(raw.settings),
    },
  }
}

export function serializeFile(file: JournalFile): string {
  return `${JSON.stringify(file, null, 2)}\n`
}

export interface MergeResult {
  entries: Entry[]
  /** Jours réellement ajoutés. */
  added: number
}

/** Fusionner n'écrase jamais un jour déjà écrit.
 *
 *  Le jour est l'identité de l'entrée : deux appareils qui ont raconté le
 *  même 12 août n'ont pas écrit la même chose, et le programme n'a aucun
 *  moyen de choisir. Il garde donc ce qui est là et compte ce qu'il a
 *  ajouté ; celui qui veut l'autre version remplace, en le sachant. */
export function mergeFile(current: Entry[], incoming: Entry[]): MergeResult {
  const known = new Set(current.map((entry) => entry.date))
  const added: Entry[] = []
  for (const entry of incoming) {
    if (known.has(entry.date)) continue
    known.add(entry.date)
    added.push(entry)
  }
  return { entries: sortEntries(current.concat(added)), added: added.length }
}

/** Le journal en texte brut : une entrée par jour, séparées par un filet.
 *
 *  Un seul fichier, et non trois cent soixante-cinq : l'application n'a
 *  aucune dépendance, donc aucun moyen d'écrire une archive. Un fichier que
 *  n'importe quel éditeur ouvre valait mieux qu'un format compressé écrit à
 *  la main, et il se découpe d'un coup d'œil.
 *
 *  Les libellés viennent de l'appelant : le fichier est dans la langue de
 *  l'interface, pas dans celle du code. */
export interface TextLabels {
  title: string
  mood: string
  note: string
  place: string
  writtenAt: string
  words: string
}

export function toText(
  entries: Entry[],
  labels: TextLabels,
  heading: (entry: Entry) => string,
  moodLabel: (mood: Mood) => string,
): string {
  const lines: string[] = [labels.title, '']
  for (const entry of sortEntries(entries)) {
    lines.push(heading(entry))
    lines.push('—'.repeat(Math.max(8, heading(entry).length)))
    const facts: string[] = []
    if (entry.mood) facts.push(`${labels.mood} : ${moodLabel(entry.mood)}`)
    if (entry.place) facts.push(`${labels.place} : ${entry.place}`)
    if (entry.writtenAt) facts.push(`${labels.writtenAt} : ${entry.writtenAt}`)
    if (entry.text) facts.push(`${labels.words} : ${wordCount(entry.text)}`)
    if (facts.length > 0) lines.push(facts.join(' · '))
    if (entry.text) lines.push('', entry.text)
    if (entry.note) lines.push('', `${labels.note} : ${entry.note}`)
    lines.push('', '')
  }
  return `${lines.join('\n').trimEnd()}\n`
}

function blob(text: string, type: string): Blob {
  return new Blob([text], { type })
}

/** Déclenche le téléchargement. Aucun réseau : un Blob local. */
export function download(text: string, filename: string, type: string): void {
  const url = URL.createObjectURL(blob(text, type))
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

export function downloadFile(
  file: JournalFile,
  filename = exportFilename(),
): void {
  download(serializeFile(file), filename, 'application/json')
}

export function downloadText(text: string, filename = textFilename()): void {
  download(text, filename, 'text/plain')
}

/** Envoyer vers : le partage natif quand l'appareil sait recevoir un
 *  fichier, le téléchargement sinon. Le contenu ne quitte l'appareil que par
 *  ce geste, vers l'application choisie — jamais vers un serveur du projet,
 *  il n'y en a pas. */
export async function shareFile(
  file: JournalFile,
  filename = exportFilename(),
): Promise<'shared' | 'downloaded' | 'cancelled'> {
  const nav = typeof navigator === 'undefined' ? null : navigator
  if (nav && typeof nav.share === 'function' && typeof File === 'function') {
    const payload = new File([serializeFile(file)], filename, {
      type: 'application/json',
    })
    const canShare = nav.canShare?.({ files: [payload] }) ?? false
    if (canShare) {
      try {
        await nav.share({ files: [payload], title: filename })
        return 'shared'
      } catch (error) {
        // Refus de l'utilisateur : ce n'est pas une panne, on n'enchaîne pas
        // sur un téléchargement qu'il n'a pas demandé.
        if (error instanceof DOMException && error.name === 'AbortError') {
          return 'cancelled'
        }
      }
    }
  }
  downloadFile(file, filename)
  return 'downloaded'
}
