/** Modèle de données de journal. Un jour, une entrée. Rien d'autre :
 *  pas de tag, pas de pièce jointe, pas de carnet, pas de dossier.
 *
 *  L'entrée porte trois traces, et la date est son identité : deux entrées
 *  ne peuvent pas partager un jour, et un jour sans entrée n'est pas écrit
 *  quelque part comme « vide » — il est simplement absent. */

/** Les humeurs sont nommées par un mot, jamais par un chiffre ni un visage.
 *
 *  Quatre, et dans cet ordre : il n'y a ni échelle ni note. « clair » n'est
 *  pas mieux que « bas », et rien dans l'application ne les additionne.
 *  Un fichier exporté en 2026 reste lisible par un vocabulaire révisé en
 *  2030 : ce sont des clés, les libellés vivent dans le dictionnaire. */
export const MOODS = ['clear', 'even', 'dense', 'low'] as const

export type Mood = (typeof MOODS)[number]

export interface Entry {
  /** ISO 8601, AAAA-MM-JJ — l'identité de l'entrée. */
  date: string
  /** Le texte du jour. Aucune longueur imposée, ni minimale ni maximale. */
  text: string
  /** La note courte : ce qu'on se rappelle à soi-même. */
  note: string
  /** Facultative, et jamais moyennée. */
  mood: Mood | null
  /** Un lieu écrit à la main. Aucune géolocalisation : l'application ne
   *  demande aucune permission et ne fait aucune requête. */
  place: string
  /** HH:MM local, l'heure de la première écriture. Une trace, pas un
   *  horodatage : elle ne bouge plus si l'entrée est modifiée. */
  writtenAt: string | null
}

/** Ce qu'un jour montre dans la grille. L'ordre est celui de la lecture :
 *  un disque cerclé dit « texte et note », un disque « texte », un cercle
 *  « note », un point « humeur seule ».
 *
 *  Une seule marque par jour, la plus forte : superposer les trois signes
 *  dans trois pixels ne se lirait pas. */
export type Trace = 'none' | 'mood' | 'note' | 'text' | 'full'

export type ThemeSetting = 'system' | 'light' | 'dark'
export type LangSetting = 'system' | 'fr' | 'en'
export type FirstDaySetting = 'monday' | 'sunday'
export type AskSetting = 'asked' | 'hidden'
export type TextSizeSetting = 'small' | 'medium' | 'large'

export interface Settings {
  theme: ThemeSetting
  lang: LangSetting
  firstDay: FirstDaySetting
  /** L'humeur est proposée à l'écriture, ou le champ n'existe pas. */
  mood: AskSetting
  /** La note courte est proposée, ou le champ n'existe pas. */
  note: AskSetting
  /** Le corps du texte relu — jamais celui de l'interface. */
  textSize: TextSizeSetting
}

export const DEFAULT_SETTINGS: Settings = {
  theme: 'system',
  lang: 'system',
  firstDay: 'monday',
  mood: 'asked',
  note: 'asked',
  textSize: 'medium',
}

export const SCHEMA_VERSION = 1

/** Le fichier journal.json — le seul format d'échange du projet.
 *  L'export en texte, lui, est une sortie : il ne se relit pas. */
export interface JournalFile {
  schemaVersion: number
  data: { entries: Entry[] }
  settings: Partial<Settings>
}
