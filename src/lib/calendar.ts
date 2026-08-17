/** Les grilles. L'année en douze lignes, le mois en semaines, et les creux
 *  d'un mois repliés en une ligne.
 *
 *  Rien n'est formaté ici : une case porte sa date ISO, son quantième et sa
 *  marque. Les noms de mois et les initiales de jour viennent de la locale,
 *  dans la vue. */

import {
  daysInMonth,
  dayOfWeek,
  monthKey,
  toISODate,
  addDays,
  parseISODate,
} from './format.ts'
import { trace } from './entries.ts'
import type { Entry, FirstDaySetting, Trace } from './types.ts'

export interface DayCell {
  /** AAAA-MM-JJ. */
  iso: string
  day: number
  mark: Trace
  /** Samedi ou dimanche. Le week-end s'atténue, il ne se colore pas. */
  weekend: boolean
  /** À venir : il n'y a rien à lire, et rien à reprocher. */
  future: boolean
}

export interface MonthLine {
  month: number
  /** Autant de cases que le mois a de jours — jamais trente et une. */
  days: DayCell[]
  /** Jours écrits dans le mois. */
  written: number
}

function cell(
  iso: string,
  entries: Map<string, Entry>,
  today: string,
): DayCell {
  const dow = dayOfWeek(iso)
  return {
    iso,
    day: Number(iso.slice(8, 10)),
    mark: trace(entries.get(iso)),
    weekend: dow === 0 || dow === 6,
    future: iso > today,
  }
}

/** Les jours d'un mois, du 1er au dernier. */
export function monthDays(
  year: number,
  month: number,
  entries: Map<string, Entry>,
  today: string,
): DayCell[] {
  const prefix = monthKey(year, month)
  return Array.from({ length: daysInMonth(year, month) }, (_, index) =>
    cell(`${prefix}-${String(index + 1).padStart(2, '0')}`, entries, today),
  )
}

/** L'année : douze lignes de longueur inégale. Février en a vingt-huit, et
 *  la ligne s'arrête là plutôt que de mimer trente et un jours. */
export function yearLines(
  year: number,
  entries: Map<string, Entry>,
  today: string,
): MonthLine[] {
  return Array.from({ length: 12 }, (_, month) => {
    const days = monthDays(year, month, entries, today)
    return {
      month,
      days,
      written: days.filter((day) => day.mark !== 'none').length,
    }
  })
}

/** Le mois en semaines, complété aux deux bouts.
 *
 *  Une case vide ne porte qu'un filet, et c'est à cela qu'elle sert : sans
 *  elle, le trait de la dernière semaine ne courrait que sous le 31 et se
 *  lirait comme une marque égarée. La grille est un rectangle parce qu'un
 *  tableau en est un. */
export function monthGrid(
  year: number,
  month: number,
  firstDay: FirstDaySetting,
  entries: Map<string, Entry>,
  today: string,
): (DayCell | null)[] {
  const days = monthDays(year, month, entries, today)
  const first = days[0]
  if (!first) return []
  const offset = firstDay === 'monday' ? 1 : 0
  const lead = (dayOfWeek(first.iso) - offset + 7) % 7
  const trail = (7 - ((lead + days.length) % 7)) % 7
  const empty = (length: number): (DayCell | null)[] =>
    Array.from({ length }, () => null)
  return empty(lead).concat(days, empty(trail))
}

/** L'ordre des colonnes du mois : 1 = lundi, ou 0 = dimanche. */
export function weekdayOrder(firstDay: FirstDaySetting): number[] {
  const offset = firstDay === 'monday' ? 1 : 0
  return Array.from({ length: 7 }, (_, index) => (index + offset) % 7)
}

export interface Gap {
  from: string
  to: string
  days: number
}

/** Les creux d'un mois : les suites de jours écoulés sans une seule trace.
 *
 *  Écoulés seulement. Un jour à venir n'est pas un jour manqué, et le
 *  replier avec les autres transformerait le reste du mois en dette. */
export function monthGaps(
  year: number,
  month: number,
  entries: Map<string, Entry>,
  today: string,
): Gap[] {
  const gaps: Gap[] = []
  let start: DayCell | null = null
  let last: DayCell | null = null

  for (const day of monthDays(year, month, entries, today)) {
    if (day.future) break
    if (day.mark === 'none') {
      start ??= day
      last = day
      continue
    }
    if (start && last) gaps.push({ from: start.iso, to: last.iso, days: run(start, last) })
    start = null
    last = null
  }
  if (start && last) gaps.push({ from: start.iso, to: last.iso, days: run(start, last) })
  return gaps
}

function run(start: DayCell, end: DayCell): number {
  return end.day - start.day + 1
}

/** Le jour suivant et le jour précédent, bornés à l'année en cours pour la
 *  navigation d'un mois : on ne quitte pas décembre par la droite. */
export function stepMonth(
  year: number,
  month: number,
  step: number,
): { year: number; month: number } {
  const date = new Date(year, month + step, 1)
  return { year: date.getFullYear(), month: date.getMonth() }
}

/** Le jour voisin écrit, s'il existe : la lecture d'un journal saute les
 *  jours vides plutôt que de les faire tourner à vide. */
export function neighbourWritten(
  entries: Entry[],
  iso: string,
  direction: -1 | 1,
): string | null {
  const written = entries.map((entry) => entry.date)
  if (direction === -1) {
    for (let index = written.length - 1; index >= 0; index--) {
      const date = written[index]
      if (date !== undefined && date < iso) return date
    }
    return null
  }
  for (const date of written) {
    if (date > iso) return date
  }
  return null
}

/** Le lendemain, jamais au-delà d'aujourd'hui : on n'écrit pas demain. */
export function nextDay(iso: string, today: string): string | null {
  const date = parseISODate(iso)
  if (!date) return null
  const next = toISODate(addDays(date, 1))
  return next > today ? null : next
}
