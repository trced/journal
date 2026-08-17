/** Le bilan. Des comptes, jamais des notes : rien ici ne se compare à un
 *  objectif, parce qu'il n'y en a pas.
 *
 *  La série est une lecture, pas une chaîne à ne pas rompre : elle est
 *  affichée là où on la cherche, et nulle part ailleurs. Rien ne la
 *  rappelle, rien ne prévient quand elle s'arrête. */

import { isWritten, wordCount } from './entries.ts'
import { shiftISO } from './format.ts'
import { MOODS } from './types.ts'
import type { Entry, Mood } from './types.ts'

export interface Streak {
  days: number
  /** Le premier jour de la série. Absent quand la série est vide. */
  since: string | null
}

/** La suite de jours écrits qui se termine à `iso`, en remontant. */
export function streakEndingAt(
  entries: Map<string, Entry>,
  iso: string,
): Streak {
  let days = 0
  let cursor = iso
  let since: string | null = null
  while (isWritten(entries.get(cursor))) {
    days++
    since = cursor
    cursor = shiftISO(cursor, -1)
  }
  return { days, since }
}

/** La série en cours. Si aujourd'hui n'est pas encore écrit, c'est celle
 *  qui se termine hier : la journée n'est pas finie, elle n'a rien rompu. */
export function currentStreak(
  entries: Map<string, Entry>,
  today: string,
): Streak {
  const ending = streakEndingAt(entries, today)
  if (ending.days > 0) return ending
  return streakEndingAt(entries, shiftISO(today, -1))
}

export interface Record_ {
  days: number
  from: string | null
  to: string | null
}

/** La plus longue suite de jours écrits, toute l'histoire confondue. */
export function longestStreak(entries: Entry[]): Record_ {
  let best: Record_ = { days: 0, from: null, to: null }
  let start: string | null = null
  let previous: string | null = null
  let days = 0

  for (const entry of entries) {
    if (!isWritten(entry)) continue
    const consecutive = previous !== null && shiftISO(previous, 1) === entry.date
    if (consecutive) {
      days++
    } else {
      start = entry.date
      days = 1
    }
    previous = entry.date
    if (days > best.days) best = { days, from: start, to: entry.date }
  }
  return best
}

export interface Totals {
  /** Jours portant au moins une trace. */
  written: number
  /** Jours portant du texte, une note et une humeur. */
  complete: number
  words: number
  /** Mots par jour écrit, arrondi. Nul quand rien n'est écrit. */
  wordsPerDay: number
}

export function totals(entries: Entry[]): Totals {
  let written = 0
  let complete = 0
  let words = 0
  for (const entry of entries) {
    if (!isWritten(entry)) continue
    written++
    if (entry.text.trim() !== '' && entry.note.trim() !== '' && entry.mood !== null) {
      complete++
    }
    words += wordCount(entry.text)
  }
  return {
    written,
    complete,
    words,
    wordsPerDay: written === 0 ? 0 : Math.round(words / written),
  }
}

export interface MoodCount {
  mood: Mood
  count: number
  /** Part du plus fréquent, de 0 à 1 — la longueur du filet. */
  share: number
}

/** Les humeurs d'une période. Les quatre sont toujours renvoyées, dans
 *  l'ordre du vocabulaire : une humeur absente se lit « 0 », elle ne
 *  disparaît pas de la liste. */
export function moodCounts(entries: Entry[]): MoodCount[] {
  const counts = new Map<Mood, number>(MOODS.map((mood) => [mood, 0]))
  for (const entry of entries) {
    if (entry.mood === null) continue
    counts.set(entry.mood, (counts.get(entry.mood) ?? 0) + 1)
  }
  const top = Math.max(...counts.values(), 0)
  return MOODS.map((mood) => {
    const count = counts.get(mood) ?? 0
    return { mood, count, share: top === 0 ? 0 : count / top }
  })
}

export interface LongestDay {
  date: string
  words: number
}

/** Le jour le plus long d'une période. À égalité, le plus récent : c'est
 *  celui dont on se souvient. */
export function longestDay(entries: Entry[]): LongestDay | null {
  let best: LongestDay | null = null
  for (const entry of entries) {
    const words = wordCount(entry.text)
    if (words === 0) continue
    if (!best || words >= best.words) best = { date: entry.date, words }
  }
  return best
}

/** Les entrées d'un préfixe de date : une année « 2026 », un mois
 *  « 2026-08 ». Le tri des dates ISO est celui du texte. */
export function inPeriod(entries: Entry[], prefix: string): Entry[] {
  return entries.filter((entry) => entry.date.startsWith(prefix))
}
