/** Le mois. Sept colonnes, une case de 44 px par jour : c'est ici que le
 *  jour se touche.
 *
 *  Les jours à venir sont posés mais ne s'ouvrent pas — il n'y a rien à
 *  lire, et on n'écrit pas demain. Ce ne sont donc pas des boutons : rien à
 *  tabuler, rien à annoncer. */

import { TraceMark } from '../Trace.tsx'
import { GapRow } from '../../components/ListRow.tsx'
import { useI18n } from '../../i18n/index.tsx'
import { formatDate, formatDayMonth, weekdayInitial } from '../../lib/format.ts'
import { weekdayOrder } from '../../lib/calendar.ts'
import type { DayCell, Gap } from '../../lib/calendar.ts'
import type { FirstDaySetting } from '../../lib/types.ts'

const TRACE_LABEL = {
  mood: 'trace.mood',
  note: 'trace.note',
  text: 'trace.text',
  full: 'trace.full',
  none: 'trace.none',
} as const

export function MonthView({
  cells,
  gaps,
  firstDay,
  today,
  selected,
  label,
  onOpenDay,
}: {
  cells: (DayCell | null)[]
  gaps: Gap[]
  firstDay: FirstDaySetting
  today: string
  /** Le jour ouvert en dernier : il garde son filet, pour retrouver sa place. */
  selected: string | null
  label: string
  onOpenDay: (iso: string) => void
}) {
  const { t, tp, locale } = useI18n()

  return (
    <div className="month">
      {/* Décoratif : le nom accessible de chaque case porte la date entière,
          donc l'en-tête n'a rien à annoncer une seconde fois. */}
      <div className="month__weekdays" aria-hidden="true">
        {weekdayOrder(firstDay).map((dow) => (
          <span key={dow}>{weekdayInitial(dow, locale)}</span>
        ))}
      </div>

      <div className="month__grid" role="group" aria-label={label}>
        {cells.map((cell, index) =>
          cell === null ? (
            <div key={`pad-${index}`} className="month__cell month__pad" />
          ) : cell.future ? (
            <div
              key={cell.iso}
              className="month__cell month__cell--future"
              title={t('app.month.dayAriaFuture', {
                date: formatDate(cell.iso, locale),
              })}
            >
              <span className="month__num">{cell.day}</span>
              <TraceMark mark="none" />
            </div>
          ) : (
            <button
              key={cell.iso}
              type="button"
              className={[
                'month__cell',
                'month__cell--day',
                cell.weekend ? 'month__cell--weekend' : '',
                cell.iso === today ? 'month__cell--today' : '',
                cell.iso === selected ? 'month__cell--selected' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              aria-label={
                cell.mark === 'none'
                  ? t('app.month.dayAriaEmpty', {
                      date: formatDate(cell.iso, locale),
                    })
                  : t('app.month.dayAria', {
                      date: formatDate(cell.iso, locale),
                      trace: t(TRACE_LABEL[cell.mark]),
                    })
              }
              onClick={() => onOpenDay(cell.iso)}
            >
              <span className="month__num">{cell.day}</span>
              <TraceMark mark={cell.mark} />
            </button>
          ),
        )}
      </div>

      {gaps.length > 0 ? (
        <div className="month__gaps rule-top">
          {gaps.map((gap) => (
            <GapRow
              key={gap.from}
              label={tp('app.month.gap', gap.days, {
                range:
                  gap.from === gap.to
                    ? t('app.month.gapDay', {
                        from: formatDayMonth(gap.from, locale),
                      })
                    : t('app.month.gapRange', {
                        from: formatDayMonth(gap.from, locale),
                        to: formatDayMonth(gap.to, locale),
                      }),
              })}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}
