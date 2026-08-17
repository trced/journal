/** Le jour. Ce qui a été écrit, tel qu'il a été écrit.
 *
 *  Le texte est le sujet de l'écran : il vient avant toute donnée, et les
 *  quatre lignes de faits — humeur, mots, lieu, heure — le suivent au lieu
 *  de l'encadrer. Rien n'est calculé sur son contenu. */

import { Button } from '../../components/Button.tsx'
import { EmptyState } from '../../components/Feedback.tsx'
import { StaticRow } from '../../components/ToggleRow.tsx'
import { TraceMark } from '../Trace.tsx'
import { useI18n } from '../../i18n/index.tsx'
import { isComplete, trace, wordCount } from '../../lib/entries.ts'
import {
  dayOfYear,
  formatDayMonth,
  formatWeekdayDayMonth,
  monthName,
  monthOf,
} from '../../lib/format.ts'
import type { Entry } from '../../lib/types.ts'

export function DayView({
  date,
  entry,
  streak,
  future,
  prev,
  next,
  onBack,
  onEdit,
  onGo,
}: {
  date: string
  entry: Entry | undefined
  /** Rang du jour dans la série en cours, nul hors série. */
  streak: number
  future: boolean
  /** Jours écrits voisins — la lecture saute les jours vides. */
  prev: string | null
  next: string | null
  onBack: () => void
  onEdit: () => void
  onGo: (iso: string) => void
}) {
  const { t, tp, locale } = useI18n()
  const mark = trace(entry)
  const words = entry ? wordCount(entry.text) : 0
  const facts: [string, string][] = []
  if (entry?.mood) facts.push([t('app.day.mood'), t(`mood.${entry.mood}`)])
  if (words > 0) facts.push([t('app.day.words'), String(words)])
  if (entry?.place) facts.push([t('app.day.place'), entry.place])
  if (entry?.writtenAt) facts.push([t('app.day.writtenAt'), entry.writtenAt])

  const meta = [
    t('app.day.ofYear', { n: dayOfYear(date) ?? 0 }),
    streak > 0 ? tp('app.day.streak', streak) : '',
    entry && isComplete(entry) ? t('app.day.complete') : '',
  ]
    .filter(Boolean)
    .join(' · ')

  return (
    <section className="pane day" aria-label={formatWeekdayDayMonth(date, locale)}>
      <div className="day__topline">
        <Button variant="quiet" onClick={onBack}>
          {t('app.day.back', { month: monthName(monthOf(date), locale) })}
        </Button>
        <span className="t-meta t-dim">{t('app.day.label')}</span>
      </div>

      <div className="day__head">
        <div>
          <h2 className="t-title">{formatWeekdayDayMonth(date, locale)}</h2>
          <p className="t-meta t-muted day__meta">{meta}</p>
        </div>
        <TraceMark mark={mark} large />
      </div>

      {mark === 'none' ? (
        <EmptyState
          title={t('app.day.emptyTitle')}
          body={future ? t('app.day.emptyNote') : t('app.day.emptyBody')}
          {...(future
            ? {}
            : {
                action: (
                  <Button variant="primary" onClick={onEdit}>
                    {t('app.day.write')}
                  </Button>
                ),
              })}
        />
      ) : (
        <>
          <div className="day__body rule-strong-top">
            {entry?.text ? (
              <div className="day__block">
                <p className="section-label">{t('app.day.text')}</p>
                <p className="day__text">{entry.text}</p>
              </div>
            ) : null}
            {entry?.note ? (
              <div className="day__block">
                <p className="section-label">{t('app.day.note')}</p>
                <p className="t-body">{entry.note}</p>
              </div>
            ) : null}
          </div>

          {facts.length > 0 ? (
            <div className="day__facts rule-top">
              {facts.map(([name, value]) => (
                <StaticRow key={name} name={name} value={value} />
              ))}
            </div>
          ) : null}
        </>
      )}

      <div className="day__foot">
        {future ? <span /> : <Button onClick={onEdit}>{t('app.day.edit')}</Button>}
        <div className="day__steps">
          {prev ? (
            <Button
              variant="quiet"
              aria-label={t('app.day.prevAria', {
                date: formatDayMonth(prev, locale),
              })}
              onClick={() => onGo(prev)}
            >
              {t('app.day.prev', { date: formatDayMonth(prev, locale) })}
            </Button>
          ) : null}
          {next ? (
            <Button
              variant="quiet"
              aria-label={t('app.day.nextAria', {
                date: formatDayMonth(next, locale),
              })}
              onClick={() => onGo(next)}
            >
              {t('app.day.next', { date: formatDayMonth(next, locale) })}
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  )
}
