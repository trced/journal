import { describe, expect, it } from 'vitest'
import {
  monthDays,
  monthGaps,
  monthGrid,
  neighbourWritten,
  nextDay,
  stepMonth,
  weekdayOrder,
  yearLines,
} from './calendar.ts'
import { emptyEntry, entryMap } from './entries.ts'
import type { Entry } from './types.ts'

const TODAY = '2026-08-12'

const entry = (date: string, patch: Partial<Entry> = {}): Entry => ({
  ...emptyEntry(date),
  ...patch,
})

const written = (...dates: string[]): Entry[] =>
  dates.map((date) => entry(date, { text: 'x' }))

const map = (...dates: string[]) => entryMap(written(...dates))

describe('monthDays', () => {
  it('donne exactement les jours du mois', () => {
    expect(monthDays(2026, 1, map(), TODAY)).toHaveLength(28)
    expect(monthDays(2028, 1, map(), TODAY)).toHaveLength(29)
    expect(monthDays(2026, 7, map(), TODAY)).toHaveLength(31)
  })

  it('marque le week-end et l’avenir', () => {
    const days = monthDays(2026, 7, map('2026-08-12'), TODAY)
    // Le 1er août 2026 est un samedi.
    expect(days[0]).toMatchObject({ day: 1, weekend: true, future: false })
    expect(days[11]).toMatchObject({ day: 12, mark: 'text', future: false })
    expect(days[12]).toMatchObject({ day: 13, future: true, mark: 'none' })
  })
})

describe('yearLines', () => {
  it('rend douze lignes de longueur inégale', () => {
    const lines = yearLines(2026, map(), TODAY)
    expect(lines).toHaveLength(12)
    expect(lines.map((line) => line.days.length)).toEqual([
      31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31,
    ])
  })

  it('compte les jours écrits de chaque mois', () => {
    const lines = yearLines(
      2026,
      map('2026-08-01', '2026-08-12', '2026-03-04'),
      TODAY,
    )
    expect(lines[7]?.written).toBe(2)
    expect(lines[2]?.written).toBe(1)
    expect(lines[0]?.written).toBe(0)
  })
})

describe('monthGrid', () => {
  it('complète la première et la dernière semaine', () => {
    // Le 1er août 2026 est un samedi : cinq cases de tête en semaine lundi,
    // et six de queue pour fermer la sixième semaine.
    const cells = monthGrid(2026, 7, 'monday', map(), TODAY)
    expect(cells).toHaveLength(5 + 31 + 6)
    expect(cells.slice(0, 5).every((cell) => cell === null)).toBe(true)
    expect(cells[5]).toMatchObject({ day: 1 })
    expect(cells[35]).toMatchObject({ day: 31 })
    expect(cells.slice(36).every((cell) => cell === null)).toBe(true)
  })

  it('rend toujours des semaines entières', () => {
    for (const first of ['monday', 'sunday'] as const) {
      for (let month = 0; month < 12; month++) {
        const cells = monthGrid(2026, month, first, map(), TODAY)
        expect(cells.length % 7, `${first} ${month}`).toBe(0)
      }
    }
  })

  it('suit le premier jour de la semaine choisi', () => {
    // En semaine dimanche, le samedi est la sixième colonne.
    const cells = monthGrid(2026, 7, 'sunday', map(), TODAY)
    expect(cells).toHaveLength(6 + 31 + 5)
  })

  it('ne pose aucune case de tête quand le mois commence la semaine', () => {
    // Le 1er juin 2026 est un lundi, et juin fait trente jours : la grille
    // s'ouvre sur le 1er et se ferme par cinq cases vides.
    const cells = monthGrid(2026, 5, 'monday', map(), TODAY)
    expect(cells).toHaveLength(35)
    expect(cells[0]).toMatchObject({ day: 1 })
  })

  it('ne pose aucune case de queue quand le mois finit la semaine', () => {
    // Février 2026 : le 1er est un dimanche et le 28 un samedi.
    const cells = monthGrid(2026, 1, 'sunday', map(), TODAY)
    expect(cells).toHaveLength(28)
  })
})

describe('weekdayOrder', () => {
  it('démarre au jour choisi', () => {
    expect(weekdayOrder('monday')).toEqual([1, 2, 3, 4, 5, 6, 0])
    expect(weekdayOrder('sunday')).toEqual([0, 1, 2, 3, 4, 5, 6])
  })
})

describe('monthGaps', () => {
  it('replie les suites de jours écoulés sans trace', () => {
    const gaps = monthGaps(
      2026,
      7,
      map('2026-08-01', '2026-08-05', '2026-08-12'),
      TODAY,
    )
    expect(gaps).toEqual([
      { from: '2026-08-02', to: '2026-08-04', days: 3 },
      { from: '2026-08-06', to: '2026-08-11', days: 6 },
    ])
  })

  it('s’arrête à aujourd’hui', () => {
    // Un jour à venir n'est pas un jour manqué : le replier avec les autres
    // transformerait le reste du mois en dette.
    const gaps = monthGaps(2026, 7, map('2026-08-01'), '2026-08-03')
    expect(gaps).toEqual([{ from: '2026-08-02', to: '2026-08-03', days: 2 }])
  })

  it('rend un creux d’un seul jour', () => {
    const gaps = monthGaps(2026, 7, map('2026-08-01', '2026-08-03'), '2026-08-03')
    expect(gaps).toEqual([{ from: '2026-08-02', to: '2026-08-02', days: 1 }])
  })

  it('ne rend rien pour un mois entièrement à venir', () => {
    expect(monthGaps(2026, 11, map(), TODAY)).toEqual([])
  })
})

describe('stepMonth', () => {
  it('franchit l’année dans les deux sens', () => {
    expect(stepMonth(2026, 11, 1)).toEqual({ year: 2027, month: 0 })
    expect(stepMonth(2026, 0, -1)).toEqual({ year: 2025, month: 11 })
  })
})

describe('neighbourWritten', () => {
  const entries = written('2026-01-04', '2026-08-01', '2026-08-12')

  it('saute les jours vides', () => {
    expect(neighbourWritten(entries, '2026-08-12', -1)).toBe('2026-08-01')
    expect(neighbourWritten(entries, '2026-08-01', 1)).toBe('2026-08-12')
  })

  it('part d’un jour non écrit', () => {
    expect(neighbourWritten(entries, '2026-08-06', -1)).toBe('2026-08-01')
    expect(neighbourWritten(entries, '2026-08-06', 1)).toBe('2026-08-12')
  })

  it('rend null au bout du journal', () => {
    expect(neighbourWritten(entries, '2026-01-04', -1)).toBeNull()
    expect(neighbourWritten(entries, '2026-08-12', 1)).toBeNull()
  })
})

describe('nextDay', () => {
  it('ne dépasse pas aujourd’hui', () => {
    expect(nextDay('2026-08-11', TODAY)).toBe('2026-08-12')
    expect(nextDay('2026-08-12', TODAY)).toBeNull()
  })

  it('rend null sur une date illisible', () => {
    expect(nextDay('2026-02-30', TODAY)).toBeNull()
  })
})
