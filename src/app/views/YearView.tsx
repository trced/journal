/** L'année. Douze lignes, un point par jour.
 *
 *  La cible tactile n'est jamais le point — trois pixels ne se visent pas.
 *  C'est la ligne du mois, haute de 44 px, qui s'ouvre : le point informe,
 *  la ligne agit. */

import { TraceMark } from '../Trace.tsx'
import { useI18n } from '../../i18n/index.tsx'
import { monthNameShort } from '../../lib/format.ts'
import type { MonthLine } from '../../lib/calendar.ts'

export function YearView({
  year,
  lines,
  onOpenMonth,
}: {
  year: number
  lines: MonthLine[]
  onOpenMonth: (month: number) => void
}) {
  const { t, tp, locale } = useI18n()

  return (
    <ul className="year rule-strong-top" aria-label={t('app.year.grid', { year })}>
      {lines.map((line) => {
        const name = monthNameShort(line.month, locale)
        return (
          <li key={line.month}>
            <button
              type="button"
              className="year__row"
              aria-label={t('app.year.rowAria', {
                month: name,
                year,
                days: tp('app.year.rowDays', line.written),
              })}
              onClick={() => onOpenMonth(line.month)}
            >
              <span className="year__month">{name}</span>
              {/* Trente et une colonnes quel que soit le mois : février
                  s'arrête au vingt-huitième point plutôt que d'en simuler
                  trois de plus, et les mois restent alignés. */}
              <span className="year__days">
                {line.days.map((day) => (
                  <TraceMark key={day.iso} mark={day.mark} />
                ))}
              </span>
              <span className="year__chevron" aria-hidden="true">
                ›
              </span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
