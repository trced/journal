import { describe, expect, it } from 'vitest'
import { emptyEntry, entryMap } from './entries.ts'
import {
  currentStreak,
  inPeriod,
  longestDay,
  longestStreak,
  moodCounts,
  streakEndingAt,
  totals,
} from './stats.ts'
import type { Entry } from './types.ts'

const entry = (date: string, patch: Partial<Entry> = {}): Entry => ({
  ...emptyEntry(date),
  ...patch,
})

const written = (...dates: string[]): Entry[] =>
  dates.map((date) => entry(date, { text: 'x' }))

describe('streakEndingAt', () => {
  it('remonte les jours consécutifs', () => {
    const map = entryMap(written('2026-08-10', '2026-08-11', '2026-08-12'))
    expect(streakEndingAt(map, '2026-08-12')).toEqual({
      days: 3,
      since: '2026-08-10',
    })
  })

  it('s’arrête au premier trou', () => {
    const map = entryMap(written('2026-08-08', '2026-08-11', '2026-08-12'))
    expect(streakEndingAt(map, '2026-08-12').days).toBe(2)
  })

  it('franchit un mois', () => {
    const map = entryMap(written('2026-07-31', '2026-08-01'))
    expect(streakEndingAt(map, '2026-08-01')).toEqual({
      days: 2,
      since: '2026-07-31',
    })
  })

  it('rend zéro sur un jour vide', () => {
    expect(streakEndingAt(entryMap([]), '2026-08-12')).toEqual({
      days: 0,
      since: null,
    })
  })
})

describe('currentStreak', () => {
  it('compte aujourd’hui quand il est écrit', () => {
    const map = entryMap(written('2026-08-11', '2026-08-12'))
    expect(currentStreak(map, '2026-08-12').days).toBe(2)
  })

  it('se termine hier quand aujourd’hui ne l’est pas encore', () => {
    // La journée n'est pas finie : elle n'a rien rompu.
    const map = entryMap(written('2026-08-10', '2026-08-11'))
    expect(currentStreak(map, '2026-08-12')).toEqual({
      days: 2,
      since: '2026-08-10',
    })
  })

  it('rend zéro après deux jours sans rien', () => {
    const map = entryMap(written('2026-08-09'))
    expect(currentStreak(map, '2026-08-12').days).toBe(0)
  })
})

describe('longestStreak', () => {
  it('trouve la plus longue suite de toute l’histoire', () => {
    const entries = written(
      '2026-01-01',
      '2026-01-02',
      '2026-01-03',
      '2026-05-10',
      '2026-08-11',
      '2026-08-12',
    )
    expect(longestStreak(entries)).toEqual({
      days: 3,
      from: '2026-01-01',
      to: '2026-01-03',
    })
  })

  it('garde la première à égalité', () => {
    const entries = written('2026-01-01', '2026-01-02', '2026-03-01', '2026-03-02')
    expect(longestStreak(entries).from).toBe('2026-01-01')
  })

  it('rend zéro sur un journal vide', () => {
    expect(longestStreak([])).toEqual({ days: 0, from: null, to: null })
  })
})

describe('totals', () => {
  it('compte jours, jours complets et mots', () => {
    const entries = [
      entry('2026-08-01', { text: 'un deux trois' }),
      entry('2026-08-02', { text: 'quatre cinq', note: 'x', mood: 'even' }),
      entry('2026-08-03', { mood: 'low' }),
    ]
    expect(totals(entries)).toEqual({
      written: 3,
      complete: 1,
      words: 5,
      wordsPerDay: 2,
    })
  })

  it('ne divise pas par zéro', () => {
    expect(totals([])).toEqual({
      written: 0,
      complete: 0,
      words: 0,
      wordsPerDay: 0,
    })
  })
})

describe('moodCounts', () => {
  it('rend toujours les quatre humeurs, dans l’ordre du vocabulaire', () => {
    const counts = moodCounts([
      entry('2026-08-01', { mood: 'clear' }),
      entry('2026-08-02', { mood: 'clear' }),
      entry('2026-08-03', { mood: 'low' }),
    ])
    expect(counts.map((c) => c.mood)).toEqual(['clear', 'even', 'dense', 'low'])
    expect(counts.map((c) => c.count)).toEqual([2, 0, 0, 1])
  })

  it('rapporte chaque part au plus fréquent, pas au total', () => {
    // Quatre mots ne font pas un tout : leur somme ne veut rien dire.
    const counts = moodCounts([
      entry('2026-08-01', { mood: 'clear' }),
      entry('2026-08-02', { mood: 'clear' }),
      entry('2026-08-03', { mood: 'low' }),
    ])
    expect(counts[0]?.share).toBe(1)
    expect(counts[3]?.share).toBeCloseTo(0.5)
  })

  it('ne divise pas par zéro sans aucune humeur', () => {
    const counts = moodCounts([entry('2026-08-01', { text: 'x' })])
    expect(counts.every((c) => c.share === 0)).toBe(true)
  })
})

describe('longestDay', () => {
  it('trouve le jour le plus bavard', () => {
    const entries = [
      entry('2026-08-01', { text: 'un deux' }),
      entry('2026-08-02', { text: 'un deux trois' }),
    ]
    expect(longestDay(entries)).toEqual({ date: '2026-08-02', words: 3 })
  })

  it('garde le plus récent à égalité', () => {
    const entries = [
      entry('2026-08-01', { text: 'un deux' }),
      entry('2026-08-02', { text: 'trois quatre' }),
    ]
    expect(longestDay(entries)?.date).toBe('2026-08-02')
  })

  it('ignore les jours sans texte', () => {
    expect(longestDay([entry('2026-08-01', { note: 'x' })])).toBeNull()
  })
})

describe('inPeriod', () => {
  const entries = written('2025-08-12', '2026-07-31', '2026-08-01', '2026-08-12')

  it('filtre une année', () => {
    expect(inPeriod(entries, '2026')).toHaveLength(3)
  })

  it('filtre un mois', () => {
    expect(inPeriod(entries, '2026-08')).toHaveLength(2)
  })
})
