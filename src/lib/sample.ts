/** Les données de l'exemple. Une année en cours, calculée depuis
 *  aujourd'hui : la démonstration ne vieillit pas.
 *
 *  Le tirage est déterministe — la même graine donne la même année, donc la
 *  page de présentation ne change pas de visage à chaque rechargement, et
 *  une capture d'écran reste valable. */

import { dayOfYear, monthKey, daysInMonth, nowTime } from './format.ts'
import { MOODS } from './types.ts'
import type { Entry, Mood } from './types.ts'

/** Les textes viennent du dictionnaire : la démonstration parle la langue de
 *  qui la regarde. */
export interface SampleText {
  texts: string[]
  notes: string[]
  places: string[]
}

/** Générateur congruentiel linéaire. Trois lignes, aucune dépendance, et
 *  reproductible d'une exécution à l'autre — ce que Math.random n'est pas. */
function random(seed: number): () => number {
  let state = seed
  return () => {
    state = (state * 1103515245 + 12345) % 2147483648
    return state / 2147483648
  }
}

/** Une année d'entrées jusqu'à aujourd'hui inclus.
 *
 *  Sept jours sur dix, pas dix sur dix : un journal réel a des trous, et les
 *  montrer est le propos de la grille. Une année pleine ne dirait rien de ce
 *  qu'on vient y lire — et elle ressemblerait à un score.
 *
 *  Le tirage décide d'abord si le jour est écrit, puis ce qu'il porte : ainsi
 *  la densité de la grille et le mélange des quatre marques se règlent
 *  séparément, au lieu de dépendre l'un de l'autre. */
export function sampleEntries(today: string, sample: SampleText): Entry[] {
  const year = Number(today.slice(0, 4))
  const last = dayOfYear(today) ?? 1
  const rnd = random(7)
  const entries: Entry[] = []

  for (let month = 0; month < 12; month++) {
    const prefix = monthKey(year, month)
    for (let day = 1; day <= daysInMonth(year, month); day++) {
      const iso = `${prefix}-${String(day).padStart(2, '0')}`
      if ((dayOfYear(iso) ?? 0) > last) break

      if (rnd() > 0.7) continue

      const hasText = rnd() > 0.24
      const hasNote = rnd() > 0.62
      const hasPlace = rnd() > 0.82
      // L'humeur seule est une marque à part entière : elle porte les jours
      // où rien d'autre n'a été noté, sinon le point ne se verrait jamais.
      const hasMood = rnd() > 0.4 || (!hasText && !hasNote)

      entries.push({
        date: iso,
        text: hasText ? pick(sample.texts, rnd) : '',
        note: hasNote ? pick(sample.notes, rnd) : '',
        mood: hasMood ? (pick([...MOODS], rnd) as Mood) : null,
        place: hasPlace ? pick(sample.places, rnd) : '',
        writtenAt: `${String(20 + Math.floor(rnd() * 3)).padStart(2, '0')}:${String(
          Math.floor(rnd() * 60),
        ).padStart(2, '0')}`,
      })
    }
  }
  return entries
}

function pick<T>(list: T[], rnd: () => number): T {
  const value = list[Math.floor(rnd() * list.length)]
  // La liste vient du dictionnaire et n'est jamais vide ; le repli existe
  // pour que le type le dise aussi.
  return value ?? (list[0] as T)
}

/** L'entrée du jour dans l'exemple, quand aujourd'hui n'a rien : la
 *  démonstration doit pouvoir montrer l'écriture, pas seulement la lecture. */
export function sampleToday(today: string, sample: SampleText): Entry {
  return {
    date: today,
    text: sample.texts[0] ?? '',
    note: sample.notes[0] ?? '',
    mood: 'clear',
    place: sample.places[0] ?? '',
    writtenAt: nowTime(),
  }
}
