import { describe, expect, it } from 'vitest'
import {
  addDays,
  dayOf,
  dayOfWeek,
  dayOfYear,
  daysBetween,
  daysInMonth,
  daysInYear,
  formatDate,
  formatDayMonth,
  isISODate,
  isTime,
  monthKey,
  monthNameShort,
  monthOf,
  nowTime,
  parseISODate,
  shiftISO,
  toISODate,
  weekdayInitial,
  yearOf,
} from './format.ts'

describe('toISODate', () => {
  it('lit les composants locaux, jamais UTC', () => {
    // 23 h 30 le 12 août : toISOString donnerait le 13 à Paris. C'est le
    // défaut qui compte le plus dans un journal — on écrit le soir.
    expect(toISODate(new Date(2026, 7, 12, 23, 30))).toBe('2026-08-12')
  })

  it('complète les mois et les jours d’un chiffre', () => {
    expect(toISODate(new Date(2026, 0, 5))).toBe('2026-01-05')
  })
})

describe('parseISODate', () => {
  it('rejette une date qui n’existe pas', () => {
    // Sans contrôle, new Date(2026, 1, 30) se replie sur le 2 mars.
    expect(parseISODate('2026-02-30')).toBeNull()
    expect(parseISODate('2026-13-01')).toBeNull()
    expect(parseISODate('2026-00-10')).toBeNull()
  })

  it('rejette ce qui n’est pas une date ISO', () => {
    expect(parseISODate('12/08/2026')).toBeNull()
    expect(parseISODate('')).toBeNull()
  })

  it('accepte le 29 février d’une année bissextile', () => {
    expect(parseISODate('2028-02-29')).not.toBeNull()
    expect(parseISODate('2027-02-29')).toBeNull()
  })
})

describe('isISODate', () => {
  it('ne dit oui qu’à une chaîne datée', () => {
    expect(isISODate('2026-08-12')).toBe(true)
    expect(isISODate(20260812)).toBe(false)
    expect(isISODate(null)).toBe(false)
  })
})

describe('isTime', () => {
  it('n’accepte que HH:MM sur 24 heures', () => {
    expect(isTime('00:00')).toBe(true)
    expect(isTime('23:59')).toBe(true)
    expect(isTime('24:00')).toBe(false)
    expect(isTime('9:05')).toBe(false)
    expect(isTime('22h14')).toBe(false)
  })
})

describe('nowTime', () => {
  it('formate l’heure locale sur deux chiffres', () => {
    expect(nowTime(new Date(2026, 7, 12, 9, 5))).toBe('09:05')
    expect(nowTime(new Date(2026, 7, 12, 22, 14))).toBe('22:14')
  })
})

describe('addDays et shiftISO', () => {
  it('franchissent un mois et une année', () => {
    expect(shiftISO('2026-08-31', 1)).toBe('2026-09-01')
    expect(shiftISO('2026-01-01', -1)).toBe('2025-12-31')
  })

  it('passent par les composants, pas par les millisecondes', () => {
    // Le dimanche du changement d'heure : en millisecondes, un jour de 23 h
    // ferait sauter ou répéter une date.
    const spring = new Date(2026, 2, 28)
    expect(toISODate(addDays(spring, 1))).toBe('2026-03-29')
    expect(toISODate(addDays(spring, 2))).toBe('2026-03-30')
  })

  it('rendent la date telle quelle si elle est illisible', () => {
    expect(shiftISO('pas-une-date', 1)).toBe('pas-une-date')
  })
})

describe('daysBetween', () => {
  it('compte en jours calendaires', () => {
    expect(daysBetween('2026-08-01', '2026-08-12')).toBe(11)
    expect(daysBetween('2026-08-12', '2026-08-12')).toBe(0)
    expect(daysBetween('2026-08-12', '2026-08-01')).toBe(-11)
  })

  it('absorbe un changement d’heure', () => {
    // Une année complète contient les deux bascules : passer par midi évite
    // qu'elle en perde un jour.
    expect(daysBetween('2026-01-01', '2027-01-01')).toBe(365)
  })

  it('renvoie null sur une date illisible', () => {
    expect(daysBetween('2026-02-30', '2026-03-01')).toBeNull()
  })
})

describe('découpage d’une date ISO', () => {
  it('lit l’année, le mois et le jour sans passer par un Date', () => {
    expect(yearOf('2026-08-12')).toBe(2026)
    expect(monthOf('2026-08-12')).toBe(7)
    expect(dayOf('2026-08-12')).toBe(12)
  })

  it('compose la clé d’un mois', () => {
    expect(monthKey(2026, 7)).toBe('2026-08')
    expect(monthKey(2026, 0)).toBe('2026-01')
  })
})

describe('dayOfWeek', () => {
  it('suit la convention de Date, 0 = dimanche', () => {
    expect(dayOfWeek('2026-08-02')).toBe(0)
    expect(dayOfWeek('2026-08-03')).toBe(1)
    expect(dayOfWeek('2026-08-01')).toBe(6)
  })
})

describe('daysInMonth et daysInYear', () => {
  it('connaissent les mois courts et les années bissextiles', () => {
    expect(daysInMonth(2026, 1)).toBe(28)
    expect(daysInMonth(2028, 1)).toBe(29)
    expect(daysInMonth(2026, 3)).toBe(30)
    expect(daysInYear(2026)).toBe(365)
    expect(daysInYear(2028)).toBe(366)
  })
})

describe('dayOfYear', () => {
  it('compte à partir de 1', () => {
    expect(dayOfYear('2026-01-01')).toBe(1)
    expect(dayOfYear('2026-12-31')).toBe(365)
    expect(dayOfYear('2028-12-31')).toBe(366)
  })
})

describe('formats localisés', () => {
  it('écrivent la date en entier', () => {
    expect(formatDate('2026-08-12', 'fr-FR')).toBe('12 août 2026')
    expect(formatDate('2026-08-12', 'en-GB')).toBe('12 August 2026')
  })

  it('omettent l’année quand elle est déjà dite', () => {
    expect(formatDayMonth('2026-08-12', 'fr-FR')).toBe('12 août')
  })

  it('rendent la chaîne telle quelle si elle n’est pas une date', () => {
    expect(formatDate('néant', 'fr-FR')).toBe('néant')
    expect(formatDayMonth('néant', 'fr-FR')).toBe('néant')
  })

  it('abrègent le mois selon la locale', () => {
    expect(monthNameShort(7, 'fr-FR')).toBe('août')
    expect(monthNameShort(6, 'en-GB')).toBe('Jul')
  })

  it('prennent l’initiale du jour dans la locale, jamais en dur', () => {
    // Lundi : « L » en français, « M » en anglais. Une lettre écrite en dur
    // serait fausse dans l'une des deux langues.
    expect(weekdayInitial(1, 'fr-FR')).toBe('L')
    expect(weekdayInitial(1, 'en-GB')).toBe('M')
  })
})
