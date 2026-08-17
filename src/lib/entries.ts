/** Opérations sur les entrées. Pur : aucun React, aucun DOM, aucune date
 *  implicite — le jour et l'heure sont toujours passés par l'appelant. */

import { MOODS } from './types.ts'
import type { Entry, Mood, Trace } from './types.ts'

/** Une entrée du jour, vide. Rien n'est écrit tant qu'elle le reste. */
export function emptyEntry(date: string): Entry {
  return { date, text: '', note: '', mood: null, place: '', writtenAt: null }
}

export function isMood(value: unknown): value is Mood {
  return MOODS.includes(value as Mood)
}

/** Une entrée sans aucune trace. Elle n'est pas enregistrée : l'absence est
 *  l'état « rien écrit ce jour-là », et une année jamais ouverte ne pèse rien. */
export function isBlank(entry: Entry): boolean {
  return (
    entry.text.trim() === '' &&
    entry.note.trim() === '' &&
    entry.mood === null &&
    entry.place.trim() === ''
  )
}

/** Les trois traces réunies. Le mot « complet » ne juge rien : il décrit
 *  un jour qui porte du texte, une note et une humeur. */
export function isComplete(entry: Entry): boolean {
  return entry.text.trim() !== '' && entry.note.trim() !== '' && entry.mood !== null
}

/** La marque d'un jour dans la grille — une seule, la plus forte.
 *
 *  Le lieu ne dessine rien : il qualifie une entrée, il n'en est pas une.
 *  Une entrée qui ne porterait qu'un lieu se lit donc comme un jour vide,
 *  ce qui est exact — il n'y a rien à relire. */
export function trace(entry: Entry | undefined): Trace {
  if (!entry) return 'none'
  const text = entry.text.trim() !== ''
  const note = entry.note.trim() !== ''
  if (text && note) return 'full'
  if (text) return 'text'
  if (note) return 'note'
  if (entry.mood !== null) return 'mood'
  return 'none'
}

/** Un jour compte comme écrit dès qu'il porte une trace. */
export function isWritten(entry: Entry | undefined): boolean {
  return trace(entry) !== 'none'
}

/** Les mots d'un texte. Découpe sur les blancs plutôt que sur les
 *  caractères : « aujourd'hui » est un mot, et un texte japonais n'en
 *  compterait qu'un — c'est la limite assumée d'un compte de mots. */
export function wordCount(text: string): number {
  const trimmed = text.trim()
  if (trimmed === '') return 0
  return trimmed.split(/\s+/).length
}

/** Les entrées par date. La carte est reconstruite à chaque changement du
 *  magasin, jamais mutée : c'est elle que lisent les grilles. */
export function entryMap(entries: Entry[]): Map<string, Entry> {
  return new Map(entries.map((entry) => [entry.date, entry]))
}

/** Du plus ancien au plus récent. Les dates ISO se trient comme du texte. */
export function sortEntries(entries: Entry[]): Entry[] {
  return [...entries].sort((a, b) => a.date.localeCompare(b.date))
}

/** Enregistre une entrée à sa date. Une entrée vidée est retirée plutôt que
 *  gardée en coquille : le fichier ne conserve pas les jours qu'on efface.
 *
 *  `writtenAt` est posé une fois, à la première écriture, et n'est plus
 *  touché : c'est l'heure où la journée a été racontée, pas celle de la
 *  dernière correction. */
export function upsertEntry(
  entries: Entry[],
  entry: Entry,
  now: string,
): Entry[] {
  const rest = entries.filter((existing) => existing.date !== entry.date)
  if (isBlank(entry)) return sortEntries(rest)
  const previous = entries.find((existing) => existing.date === entry.date)
  const kept: Entry = {
    ...entry,
    text: entry.text.trim(),
    note: entry.note.trim(),
    place: entry.place.trim(),
    writtenAt: previous?.writtenAt ?? entry.writtenAt ?? now,
  }
  return sortEntries(rest.concat([kept]))
}

export function removeEntry(entries: Entry[], date: string): Entry[] {
  return entries.filter((entry) => entry.date !== date)
}

/** Les années qui portent au moins une entrée, de la plus récente à la plus
 *  ancienne, avec l'année demandée toujours dedans — on doit pouvoir ouvrir
 *  une année vide pour y écrire. */
export function years(entries: Entry[], include: number): number[] {
  const set = new Set(entries.map((entry) => Number(entry.date.slice(0, 4))))
  set.add(include)
  return [...set].sort((a, b) => b - a)
}
