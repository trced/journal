/** Le bilan du mois. Des comptes, et rien qui ressemble à une note.
 *
 *  Les humeurs sont des filets de longueur relative, pas des parts d'un
 *  camembert : quatre mots ne font pas un tout, et leur somme ne veut rien
 *  dire. Le plus fréquent tient toute la largeur, les autres s'y rapportent. */

import { StatRow, SummaryRow } from '../../components/StatRow.tsx'
import { useI18n } from '../../i18n/index.tsx'
import { formatDayMonth } from '../../lib/format.ts'
import type { MoodCount, Record_, Streak, Totals } from '../../lib/stats.ts'
import type { LongestDay } from '../../lib/stats.ts'

export function StatsView({
  streak,
  record,
  month,
  monthDays,
  yearWritten,
  moods,
  longest,
}: {
  streak: Streak
  record: Record_
  month: Totals
  /** Jours du mois : le dénominateur de la part écrite. */
  monthDays: number
  yearWritten: number
  moods: MoodCount[]
  longest: LongestDay | null
}) {
  const { t, tp, n, locale } = useI18n()
  const share = monthDays === 0 ? 0 : Math.round((month.written / monthDays) * 100)
  const anyMood = moods.some((entry) => entry.count > 0)

  return (
    <div className="stats">
      <div className="stats__rows rule-strong-top">
        <StatRow
          label={t('app.stats.streak')}
          value={
            streak.days === 0
              ? t('app.stats.empty')
              : tp('app.stats.streakValue', streak.days)
          }
          empty={streak.days === 0}
          context={
            streak.since
              ? t('app.stats.streakSince', {
                  date: formatDayMonth(streak.since, locale),
                })
              : t('app.stats.streakNone')
          }
          {...(record.days > 0
            ? { aside: tp('app.stats.streakRecord', record.days) }
            : {})}
        />
        <StatRow
          label={t('app.stats.written')}
          value={n(month.written)}
          empty={month.written === 0}
          context={t('app.stats.writtenShare', { percent: share })}
          aside={t('app.stats.writtenYear', { n: n(yearWritten) })}
        />
        <StatRow
          label={t('app.stats.words')}
          value={n(month.words)}
          empty={month.words === 0}
          context={t('app.stats.wordsPerDay', { n: n(month.wordsPerDay) })}
        />
      </div>

      <div className="stats__moods rule-top">
        <p className="section-label">{t('app.stats.moods')}</p>
        {anyMood ? (
          <ul className="mood">
            {moods.map((entry) => (
              <li key={entry.mood} className="mood__row">
                <span className="mood__label">{t(`mood.${entry.mood}`)}</span>
                {/* Le filet est décoratif : le compte est écrit à côté. */}
                <span className="mood__track" aria-hidden="true">
                  <span
                    className="mood__fill"
                    style={{ width: `${Math.round(entry.share * 100)}%` }}
                  />
                </span>
                <span className="mood__value">{n(entry.count)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="pane__legend">{t('app.stats.moodsNone')}</p>
        )}
      </div>

      <div className="stats__summary rule-top">
        <SummaryRow label={t('app.stats.complete')} value={n(month.complete)} />
        <SummaryRow
          label={t('app.stats.longest')}
          value={
            longest
              ? t('app.stats.longestValue', {
                  date: formatDayMonth(longest.date, locale),
                  n: n(longest.words),
                })
              : t('app.stats.empty')
          }
        />
      </div>

      <p className="pane__legend">{t('app.stats.note')}</p>
    </div>
  )
}
