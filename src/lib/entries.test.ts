import { describe, expect, it } from 'vitest'
import {
  emptyEntry,
  entryMap,
  isBlank,
  isComplete,
  isMood,
  isWritten,
  removeEntry,
  sortEntries,
  trace,
  upsertEntry,
  wordCount,
  years,
} from './entries.ts'
import type { Entry } from './types.ts'

const entry = (date: string, patch: Partial<Entry> = {}): Entry => ({
  ...emptyEntry(date),
  ...patch,
})

describe('emptyEntry', () => {
  it('ne porte rien', () => {
    expect(isBlank(emptyEntry('2026-08-12'))).toBe(true)
  })
})

describe('isMood', () => {
  it('n’accepte que les quatre mots du vocabulaire', () => {
    expect(isMood('clear')).toBe(true)
    expect(isMood('low')).toBe(true)
    expect(isMood('happy')).toBe(false)
    expect(isMood(3)).toBe(false)
  })
})

describe('isBlank', () => {
  it('ignore les blancs', () => {
    expect(isBlank(entry('2026-08-12', { text: '   \n ' }))).toBe(true)
  })

  it('compte le lieu comme une trace enregistrable', () => {
    // Il ne dessine rien dans la grille, mais il ne faut pas le perdre :
    // quelqu'un qui n'a noté qu'un lieu a écrit quelque chose.
    expect(isBlank(entry('2026-08-12', { place: 'Paris' }))).toBe(false)
  })
})

describe('trace', () => {
  it('donne une seule marque, la plus forte', () => {
    expect(trace(undefined)).toBe('none')
    expect(trace(entry('2026-08-12'))).toBe('none')
    expect(trace(entry('2026-08-12', { mood: 'clear' }))).toBe('mood')
    expect(trace(entry('2026-08-12', { note: 'x' }))).toBe('note')
    expect(trace(entry('2026-08-12', { text: 'x' }))).toBe('text')
    expect(trace(entry('2026-08-12', { text: 'x', note: 'y' }))).toBe('full')
  })

  it('laisse l’humeur derrière le texte', () => {
    expect(trace(entry('2026-08-12', { text: 'x', mood: 'low' }))).toBe('text')
  })

  it('ne dessine rien pour un lieu seul', () => {
    // Il n'y a rien à relire : la grille dirait le contraire.
    expect(trace(entry('2026-08-12', { place: 'Paris' }))).toBe('none')
    expect(isWritten(entry('2026-08-12', { place: 'Paris' }))).toBe(false)
  })
})

describe('isComplete', () => {
  it('demande les trois traces', () => {
    expect(
      isComplete(entry('2026-08-12', { text: 'x', note: 'y', mood: 'even' })),
    ).toBe(true)
    expect(isComplete(entry('2026-08-12', { text: 'x', note: 'y' }))).toBe(false)
  })
})

describe('wordCount', () => {
  it('découpe sur les blancs', () => {
    expect(wordCount('')).toBe(0)
    expect(wordCount('   ')).toBe(0)
    expect(wordCount('un')).toBe(1)
    expect(wordCount("aujourd'hui, deux pêches")).toBe(3)
    expect(wordCount('deux\nlignes  et trois')).toBe(4)
  })
})

describe('entryMap', () => {
  it('indexe par date', () => {
    const map = entryMap([entry('2026-08-11'), entry('2026-08-12')])
    expect(map.get('2026-08-12')?.date).toBe('2026-08-12')
    expect(map.has('2026-08-13')).toBe(false)
  })
})

describe('sortEntries', () => {
  it('trie du plus ancien au plus récent', () => {
    const sorted = sortEntries([
      entry('2026-08-12'),
      entry('2025-12-31'),
      entry('2026-01-01'),
    ])
    expect(sorted.map((e) => e.date)).toEqual([
      '2025-12-31',
      '2026-01-01',
      '2026-08-12',
    ])
  })

  it('ne mute pas la liste reçue', () => {
    const list = [entry('2026-08-12'), entry('2026-08-11')]
    sortEntries(list)
    expect(list[0]?.date).toBe('2026-08-12')
  })
})

describe('upsertEntry', () => {
  it('ajoute une entrée à sa place et pose l’heure', () => {
    const next = upsertEntry([], entry('2026-08-12', { text: 'x' }), '22:14')
    expect(next).toHaveLength(1)
    expect(next[0]?.writtenAt).toBe('22:14')
  })

  it('remplace l’entrée du même jour sans en créer une seconde', () => {
    const first = upsertEntry([], entry('2026-08-12', { text: 'x' }), '22:14')
    const second = upsertEntry(
      first,
      entry('2026-08-12', { text: 'corrigé' }),
      '09:00',
    )
    expect(second).toHaveLength(1)
    expect(second[0]?.text).toBe('corrigé')
  })

  it('garde l’heure de la première écriture', () => {
    // C'est l'heure où la journée a été racontée, pas celle de la dernière
    // correction : une relecture du lendemain ne la déplace pas.
    const first = upsertEntry([], entry('2026-08-12', { text: 'x' }), '22:14')
    const second = upsertEntry(
      first,
      entry('2026-08-12', { text: 'x y' }),
      '09:00',
    )
    expect(second[0]?.writtenAt).toBe('22:14')
  })

  it('retire l’entrée vidée plutôt que d’en garder la coquille', () => {
    const first = upsertEntry([], entry('2026-08-12', { text: 'x' }), '22:14')
    expect(upsertEntry(first, entry('2026-08-12'), '09:00')).toEqual([])
  })

  it('élague les blancs de bord', () => {
    const next = upsertEntry(
      [],
      entry('2026-08-12', { text: '  x  ', note: ' y ', place: ' Paris ' }),
      '22:14',
    )
    expect(next[0]).toMatchObject({ text: 'x', note: 'y', place: 'Paris' })
  })

  it('laisse la liste triée', () => {
    let list = upsertEntry([], entry('2026-08-12', { text: 'x' }), '22:14')
    list = upsertEntry(list, entry('2026-08-01', { text: 'y' }), '22:14')
    expect(list.map((e) => e.date)).toEqual(['2026-08-01', '2026-08-12'])
  })
})

describe('removeEntry', () => {
  it('n’enlève que le jour visé', () => {
    const list = [entry('2026-08-11'), entry('2026-08-12')]
    expect(removeEntry(list, '2026-08-12').map((e) => e.date)).toEqual([
      '2026-08-11',
    ])
  })
})

describe('years', () => {
  it('liste les années portées, la plus récente d’abord', () => {
    expect(years([entry('2024-05-01'), entry('2026-08-12')], 2026)).toEqual([
      2026, 2024,
    ])
  })

  it('inclut toujours l’année demandée, même vide', () => {
    // On doit pouvoir ouvrir une année sans entrée pour y écrire.
    expect(years([], 2026)).toEqual([2026])
  })
})
