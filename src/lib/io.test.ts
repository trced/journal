import { describe, expect, it } from 'vitest'
import { emptyEntry } from './entries.ts'
import {
  exportFilename,
  mergeFile,
  parseFile,
  serializeFile,
  textFilename,
  toText,
} from './io.ts'
import { SCHEMA_VERSION } from './types.ts'
import type { Entry, JournalFile } from './types.ts'

const entry = (date: string, patch: Partial<Entry> = {}): Entry => ({
  ...emptyEntry(date),
  ...patch,
})

const file = (entries: Entry[]): JournalFile => ({
  schemaVersion: SCHEMA_VERSION,
  data: { entries },
  settings: {},
})

describe('noms de fichier', () => {
  it('portent la date pour ne pas se recouvrir', () => {
    expect(exportFilename('2026-08-12')).toBe('journal-2026-08-12.json')
    expect(textFilename('2026-08-12')).toBe('journal-2026-08-12.txt')
  })
})

describe('parseFile', () => {
  it('lit un fichier bien formé', () => {
    const raw = serializeFile(file([entry('2026-08-12', { text: 'x' })]))
    const result = parseFile(raw)
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.file.data.entries).toHaveLength(1)
  })

  it('distingue les trois causes de refus', () => {
    expect(parseFile('pas du json')).toEqual({
      ok: false,
      reason: 'unreadable',
    })
    expect(parseFile('{"data":{"entries":[]}}')).toEqual({
      ok: false,
      reason: 'schema',
    })
    expect(parseFile('{"schemaVersion":99,"data":{"entries":[]}}')).toEqual({
      ok: false,
      reason: 'version',
    })
  })

  it('refuse un JSON qui n’est pas un objet', () => {
    expect(parseFile('[1,2,3]').ok).toBe(false)
    expect(parseFile('"texte"').ok).toBe(false)
  })

  it('écarte une entrée cassée sans perdre les autres', () => {
    const raw = JSON.stringify({
      schemaVersion: SCHEMA_VERSION,
      data: {
        entries: [
          { date: '2026-02-30', text: 'jour inexistant' },
          { date: 'néant', text: 'sans date' },
          null,
          { date: '2026-08-12', text: 'gardée' },
        ],
      },
    })
    const result = parseFile(raw)
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.file.data.entries.map((e) => e.date)).toEqual(['2026-08-12'])
    }
  })

  it('écarte une entrée sans aucune trace', () => {
    const raw = JSON.stringify({
      schemaVersion: SCHEMA_VERSION,
      data: { entries: [{ date: '2026-08-12', text: '   ' }] },
    })
    const result = parseFile(raw)
    if (result.ok) expect(result.file.data.entries).toEqual([])
  })

  it('garde la première de deux entrées du même jour', () => {
    const raw = JSON.stringify({
      schemaVersion: SCHEMA_VERSION,
      data: {
        entries: [
          { date: '2026-08-12', text: 'première' },
          { date: '2026-08-12', text: 'seconde' },
        ],
      },
    })
    const result = parseFile(raw)
    if (result.ok) {
      expect(result.file.data.entries).toHaveLength(1)
      expect(result.file.data.entries[0]?.text).toBe('première')
    }
  })

  it('nettoie une humeur et une heure inconnues', () => {
    const raw = JSON.stringify({
      schemaVersion: SCHEMA_VERSION,
      data: {
        entries: [
          { date: '2026-08-12', text: 'x', mood: 'euphorique', writtenAt: '25:99' },
        ],
      },
    })
    const result = parseFile(raw)
    if (result.ok) {
      expect(result.file.data.entries[0]).toMatchObject({
        mood: null,
        writtenAt: null,
      })
    }
  })

  it('ne retient que les réglages qu’il connaît', () => {
    const raw = JSON.stringify({
      schemaVersion: SCHEMA_VERSION,
      data: { entries: [] },
      settings: { theme: 'dark', textSize: 'énorme', inventé: true },
    })
    const result = parseFile(raw)
    if (result.ok) expect(result.file.settings).toEqual({ theme: 'dark' })
  })

  it('rend les entrées triées', () => {
    const raw = JSON.stringify({
      schemaVersion: SCHEMA_VERSION,
      data: {
        entries: [
          { date: '2026-08-12', text: 'x' },
          { date: '2026-01-01', text: 'y' },
        ],
      },
    })
    const result = parseFile(raw)
    if (result.ok) {
      expect(result.file.data.entries.map((e) => e.date)).toEqual([
        '2026-01-01',
        '2026-08-12',
      ])
    }
  })
})

describe('serializeFile', () => {
  it('se relit lui-même', () => {
    const original = file([entry('2026-08-12', { text: 'x', mood: 'clear' })])
    const result = parseFile(serializeFile(original))
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.file.data.entries[0]?.mood).toBe('clear')
  })

  it('finit par une nouvelle ligne', () => {
    expect(serializeFile(file([]))).toMatch(/\n$/)
  })
})

describe('mergeFile', () => {
  it('ajoute les jours manquants', () => {
    const result = mergeFile(
      [entry('2026-08-01', { text: 'à moi' })],
      [entry('2026-08-02', { text: 'ailleurs' })],
    )
    expect(result.added).toBe(1)
    expect(result.entries.map((e) => e.date)).toEqual([
      '2026-08-01',
      '2026-08-02',
    ])
  })

  it('n’écrase jamais un jour déjà écrit', () => {
    // Deux appareils qui ont raconté le même 12 août n'ont pas écrit la même
    // chose, et le programme n'a aucun moyen de choisir.
    const result = mergeFile(
      [entry('2026-08-12', { text: 'à moi' })],
      [entry('2026-08-12', { text: 'ailleurs' })],
    )
    expect(result.added).toBe(0)
    expect(result.entries[0]?.text).toBe('à moi')
  })

  it('rend la liste triée', () => {
    const result = mergeFile(
      [entry('2026-08-12', { text: 'x' })],
      [entry('2026-01-01', { text: 'y' })],
    )
    expect(result.entries.map((e) => e.date)).toEqual([
      '2026-01-01',
      '2026-08-12',
    ])
  })

  it('ne compte pas deux fois un même jour entrant', () => {
    const result = mergeFile(
      [],
      [entry('2026-08-12', { text: 'x' }), entry('2026-08-12', { text: 'y' })],
    )
    expect(result.added).toBe(1)
  })
})

describe('toText', () => {
  const labels = {
    title: 'journal',
    mood: 'humeur',
    note: 'note',
    place: 'lieu',
    writtenAt: 'écrit à',
    words: 'mots',
  }
  const render = (entries: Entry[]): string =>
    toText(entries, labels, (e) => e.date, (mood) => mood)

  it('écrit une entrée par jour, la plus ancienne d’abord', () => {
    const text = render([
      entry('2026-08-12', { text: 'seconde' }),
      entry('2026-08-01', { text: 'première' }),
    ])
    expect(text.indexOf('2026-08-01')).toBeLessThan(text.indexOf('2026-08-12'))
  })

  it('porte les faits sur une seule ligne', () => {
    const text = render([
      entry('2026-08-12', {
        text: 'un deux',
        mood: 'clear',
        place: 'Paris',
        writtenAt: '22:14',
      }),
    ])
    expect(text).toContain('humeur : clear · lieu : Paris · écrit à : 22:14 · mots : 2')
  })

  it('n’écrit pas les champs vides', () => {
    const text = render([entry('2026-08-12', { text: 'x' })])
    expect(text).not.toContain('lieu')
    expect(text).not.toContain('note')
  })

  it('se relit sans le programme', () => {
    const text = render([entry('2026-08-12', { text: 'ligne un\nligne deux' })])
    expect(text).toContain('ligne un\nligne deux')
    expect(text).toMatch(/\n$/)
  })
})
