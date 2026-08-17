/** Dates. Tout est stocké en AAAA-MM-JJ et manipulé en heure locale : une
 *  entrée écrite le 12 août reste le 12 août quel que soit le fuseau.
 *
 *  Aucune date n'est produite par toISOString — qui bascule en UTC et
 *  décale d'un jour partout à l'est de Greenwich après 22 h. C'est le
 *  défaut qui compte le plus ici : quelqu'un qui écrit le soir écrirait
 *  systématiquement dans le lendemain. */

const ISO = /^(\d{4})-(\d{2})-(\d{2})$/
const TIME = /^([01]\d|2[0-3]):([0-5]\d)$/

export function toISODate(date: Date): string {
  const y = String(date.getFullYear()).padStart(4, '0')
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/** Rejette autant les formats invalides que les dates qui n'existent pas :
 *  « 2026-02-30 » se replierait sur le 2 mars sans ce contrôle. */
export function parseISODate(iso: string): Date | null {
  const match = ISO.exec(String(iso ?? ''))
  if (!match) return null
  const [, y, m, d] = match
  const year = Number(y)
  const month = Number(m)
  const day = Number(d)
  if (month < 1 || month > 12 || day < 1 || day > 31) return null
  const date = new Date(year, month - 1, day)
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null
  }
  return date
}

export function isISODate(value: unknown): value is string {
  return typeof value === 'string' && parseISODate(value) !== null
}

/** HH:MM sur 24 heures. L'heure d'écriture est une trace, pas un calcul :
 *  elle est stockée telle qu'elle a été lue, sans fuseau. */
export function isTime(value: unknown): value is string {
  return typeof value === 'string' && TIME.test(value)
}

export function nowTime(now = new Date()): string {
  const h = String(now.getHours()).padStart(2, '0')
  const m = String(now.getMinutes()).padStart(2, '0')
  return `${h}:${m}`
}

/** Décalage en jours. Passe par les composants plutôt que par les
 *  millisecondes : un changement d'heure ne fait ni sauter ni répéter un jour. */
export function addDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days)
}

/** Le même décalage, d'une date ISO à une autre. */
export function shiftISO(iso: string, days: number): string {
  const date = parseISODate(iso)
  return date ? toISODate(addDays(date, days)) : iso
}

export function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

/** Nombre de jours entre deux dates, en jours calendaires. Passe par midi
 *  pour absorber les changements d'heure : sans cela, une année contenant un
 *  passage à l'heure d'été compterait un jour de moins. */
export function daysBetween(fromISO: string, toISO: string): number | null {
  const from = parseISODate(fromISO)
  const to = parseISODate(toISO)
  if (!from || !to) return null
  const a = new Date(from.getFullYear(), from.getMonth(), from.getDate(), 12)
  const b = new Date(to.getFullYear(), to.getMonth(), to.getDate(), 12)
  return Math.round((b.getTime() - a.getTime()) / 86400000)
}

export function todayISO(): string {
  return toISODate(new Date())
}

/** L'année et le mois d'une date ISO, sans passer par un Date. */
export function yearOf(iso: string): number {
  return Number(iso.slice(0, 4))
}

export function monthOf(iso: string): number {
  return Number(iso.slice(5, 7)) - 1
}

export function dayOf(iso: string): number {
  return Number(iso.slice(8, 10))
}

/** « 2026-08 » — la clé d'un mois, celle qui trie. */
export function monthKey(year: number, month: number): string {
  return `${String(year).padStart(4, '0')}-${String(month + 1).padStart(2, '0')}`
}

/** Le jour de la semaine, 0 = dimanche — la convention de Date. */
export function dayOfWeek(iso: string): number {
  return parseISODate(iso)?.getDay() ?? 0
}

export function monthName(month: number, locale: string): string {
  return new Intl.DateTimeFormat(locale, { month: 'long' }).format(
    new Date(2026, month, 1),
  )
}

/** « août » abrégé — « août », « juil. ». La ligne de l'année en tient
 *  douze : c'est la forme courte qui décide de la largeur de sa colonne. */
export function monthNameShort(month: number, locale: string): string {
  return new Intl.DateTimeFormat(locale, { month: 'short' }).format(
    new Date(2026, month, 1),
  )
}

/** L'initiale du jour telle que la locale l'abrège. Jamais une lettre
 *  écrite en dur : « M » vaut mardi en français et lundi en anglais. */
export function weekdayInitial(dow: number, locale: string): string {
  // 2026-08-02 est un dimanche : le décalage donne le jour voulu.
  return new Intl.DateTimeFormat(locale, { weekday: 'narrow' }).format(
    new Date(2026, 7, 2 + dow),
  )
}

/** « 12 août 2026 » — la forme longue, pour les noms accessibles. */
export function formatDate(iso: string, locale: string): string {
  const date = parseISODate(iso)
  if (!date) return iso
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

/** « 12 août » — la date sans son année, quand l'année est déjà dite. */
export function formatDayMonth(iso: string, locale: string): string {
  const date = parseISODate(iso)
  if (!date) return iso
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
  }).format(date)
}

/** « mer. 12 août » — le titre d'un jour. Le jour de la semaine abrégé :
 *  en entier, il pousse la date hors de la ligne sur un téléphone. */
export function formatWeekdayDayMonth(iso: string, locale: string): string {
  const date = parseISODate(iso)
  if (!date) return iso
  return new Intl.DateTimeFormat(locale, {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
  }).format(date)
}

/** Le quantième dans l'année : 1 pour le 1er janvier. Sert au repère
 *  « jour 224 », qui dit la place dans l'année sans rien évaluer. */
export function dayOfYear(iso: string): number | null {
  const days = daysBetween(`${iso.slice(0, 4)}-01-01`, iso)
  return days === null ? null : days + 1
}

/** Le nombre de jours de l'année — 366 les années bissextiles. */
export function daysInYear(year: number): number {
  return new Date(year, 1, 29).getMonth() === 1 ? 366 : 365
}
