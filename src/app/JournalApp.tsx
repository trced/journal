/** journal. — l'application. Une année, un mois, un jour, un bilan.
 *
 *  Trois profondeurs et deux gestes : la ligne du mois ouvre sa grille, la
 *  case du jour ouvre son texte. La barre du bas nomme les quatre
 *  destinations en clair — pas de pictogramme, pas de pastille.
 *
 *  Le jour et l'écriture prennent tout le cadre : ce sont des écrans, pas
 *  des surfaces posées par-dessus. On en sort par le retour qui les a
 *  ouverts, jamais en devinant. */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router'
import { Button } from '../components/Button.tsx'
import { PeriodNav } from '../components/PeriodNav.tsx'
import { useI18n } from '../i18n/index.tsx'
import { entryMap, isWritten, trace } from '../lib/entries.ts'
import {
  monthGaps,
  monthGrid,
  neighbourWritten,
  stepMonth,
  yearLines,
} from '../lib/calendar.ts'
import {
  daysInMonth,
  daysInYear,
  formatDate,
  formatDayMonth,
  monthName,
  monthNameShort,
  monthOf,
  todayISO,
  yearOf,
} from '../lib/format.ts'
import {
  currentStreak,
  inPeriod,
  longestDay,
  longestStreak,
  moodCounts,
  streakEndingAt,
  totals,
} from '../lib/stats.ts'
import { monthKey } from '../lib/format.ts'
import type { Entry } from '../lib/types.ts'
import { useStore } from '../state/store.tsx'
import { TraceLegend, TraceMark } from './Trace.tsx'
import { DayView } from './views/DayView.tsx'
import { MonthView } from './views/MonthView.tsx'
import { StatsView } from './views/StatsView.tsx'
import { YearView } from './views/YearView.tsx'
import { EntrySheet } from './sheets/EntrySheet.tsx'
import { SettingsSheet } from './sheets/SettingsSheet.tsx'

const FLASH_MS = 3000

/** Les quatre destinations, dans l'ordre de la barre. « réglages » n'est pas
 *  une vue : c'est une feuille par-dessus celle qu'on lit. */
const TABS = ['year', 'month', 'stats'] as const
type Tab = (typeof TABS)[number]

/** L'ordre de la légende est celui de la force des marques : le point, le
 *  cercle, le disque, le disque cerclé. */
const MARKS = ['mood', 'note', 'text', 'full'] as const

export function JournalApp({ embedded = false }: { embedded?: boolean }) {
  const { t, tp, n, locale } = useI18n()
  const store = useStore()
  const root = useRef<HTMLDivElement>(null)
  const scroll = useRef<HTMLDivElement>(null)
  const flashTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const today = useMemo(() => todayISO(), [])
  const [tab, setTab] = useState<Tab>('year')
  const [year, setYear] = useState(() => yearOf(today))
  const [anchor, setAnchor] = useState(() => ({
    year: yearOf(today),
    month: monthOf(today),
  }))
  const [day, setDay] = useState<string | null>(null)
  const [editing, setEditing] = useState<string | null>(null)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [flash, setFlash] = useState('')

  const showFlash = useCallback((message: string) => {
    clearTimeout(flashTimer.current)
    setFlash(message)
    flashTimer.current = setTimeout(() => setFlash(''), FLASH_MS)
  }, [])

  useEffect(() => () => clearTimeout(flashTimer.current), [])

  useEffect(() => {
    if (embedded) return
    document.title = `${t('common.brand')} — ${t('site.home.title')}`
  }, [embedded, t])

  // Passer d'une vue à l'autre repart du haut : on ne reprend pas la lecture
  // d'un mois à la hauteur où l'on avait laissé l'année.
  useEffect(() => {
    if (scroll.current) scroll.current.scrollTop = 0
  }, [tab, day])

  const entries = store.entries
  const byDate = useMemo(() => entryMap(entries), [entries])
  const { firstDay } = store.settings

  const lines = useMemo(
    () => yearLines(year, byDate, today),
    [year, byDate, today],
  )
  const yearWritten = useMemo(
    () => lines.reduce((sum, line) => sum + line.written, 0),
    [lines],
  )
  const cells = useMemo(
    () => monthGrid(anchor.year, anchor.month, firstDay, byDate, today),
    [anchor, firstDay, byDate, today],
  )
  const gaps = useMemo(
    () => monthGaps(anchor.year, anchor.month, byDate, today),
    [anchor, byDate, today],
  )

  const monthTotal = daysInMonth(anchor.year, anchor.month)
  const monthWritten = useMemo(
    () =>
      inPeriod(entries, monthKey(anchor.year, anchor.month)).filter(isWritten)
        .length,
    [entries, anchor],
  )

  const goToday = useCallback(() => {
    setYear(yearOf(today))
    setAnchor({ year: yearOf(today), month: monthOf(today) })
    setDay(null)
  }, [today])

  const shift = useCallback(
    (step: number) => {
      if (day !== null) {
        const target = neighbourWritten(entries, day, step < 0 ? -1 : 1)
        if (target) setDay(target)
        return
      }
      if (tab === 'year') {
        setYear((current) => current + step)
        return
      }
      setAnchor((current) => stepMonth(current.year, current.month, step))
    },
    [day, entries, tab],
  )

  // Raccourcis clavier — actifs seulement quand le focus est dans
  // l'application, et jamais par-dessus une feuille ou un champ de saisie.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!root.current?.contains(document.activeElement)) return
      if (settingsOpen || editing !== null) return
      const target = event.target
      if (
        target instanceof HTMLElement &&
        ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)
      ) {
        return
      }
      if (event.key.toLowerCase() === 't') goToday()
      else if (event.key === 'ArrowLeft') shift(-1)
      else if (event.key === 'ArrowRight') shift(1)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [settingsOpen, editing, goToday, shift])

  const openMonth = (month: number): void => {
    setAnchor({ year, month })
    setTab('month')
  }

  const saveEntry = (entry: Entry): void => {
    store.saveEntry(entry)
    setDay(entry.date)
    setEditing(null)
    showFlash(t('app.flash.saved', { date: formatDayMonth(entry.date, locale) }))
  }

  const deleteEntry = (date: string): void => {
    store.deleteEntry(date)
    setEditing(null)
    showFlash(t('app.flash.deleted', { date: formatDayMonth(date, locale) }))
  }

  const monthTitle = `${monthName(anchor.month, locale)} ${anchor.year}`
  const atYear = year === yearOf(today)
  const atMonth =
    anchor.year === yearOf(today) && anchor.month === monthOf(today)

  const monthNav = (
    <PeriodNav
      title={monthTitle}
      prevLabel={monthNameShort(stepMonth(anchor.year, anchor.month, -1).month, locale)}
      nextLabel={monthNameShort(stepMonth(anchor.year, anchor.month, 1).month, locale)}
      prevAria={t('app.month.prevAria')}
      nextAria={t('app.month.nextAria')}
      caption={tp('app.month.caption', monthWritten, { total: monthTotal })}
      captionHint={t('app.month.hint')}
      onPrev={() => shift(-1)}
      onNext={() => shift(1)}
      onToday={goToday}
    />
  )

  /** La légende accompagne les deux grilles, sans jamais se replier derrière
   *  une aide contextuelle : quatre formes de sept pixels ne se devinent pas. */
  const legend = (
    <TraceLegend
      labels={MARKS.map((mark) => ({ mark, label: t(`trace.${mark}`) }))}
    />
  )

  const firstRun = (
    <section className="pane first">
      <h2 className="t-display first__title">{t('site.home.title')}</h2>
      <p className="t-body t-measure first__lede">{t('site.home.lede')}</p>
      <div className="first__legend rule-strong-top">
        <p className="section-label">{t('app.first.legend')}</p>
        <ul className="first__rows">
          {(['mood', 'note', 'text', 'full'] as const).map((mark) => (
            <li key={mark} className="first__row rule-bottom">
              <span className="first__mark">
                <TraceMark mark={mark} large={mark === 'full'} />
              </span>
              <span className="t-body">{t(`trace.${mark}`)}</span>
              <span className="t-meta t-dim">{t(`trace.${mark}Shape`)}</span>
            </li>
          ))}
        </ul>
      </div>
      <p className="t-meta t-dim first__facts">{t('app.first.facts')}</p>
      <div className="first__actions">
        <Button variant="primary" block onClick={() => setEditing(today)}>
          {t('app.empty.action')}
        </Button>
        <Button onClick={() => setSettingsOpen(true)}>
          {t('app.first.import')}
        </Button>
      </div>
    </section>
  )

  const yearPane =
    entries.length === 0 && atYear ? (
      firstRun
    ) : (
      <section className="pane" aria-label={t('app.year.grid', { year })}>
        <PeriodNav
          title={String(year)}
          prevLabel={String(year - 1)}
          nextLabel={String(year + 1)}
          prevAria={t('app.year.prevAria')}
          nextAria={t('app.year.nextAria')}
          caption={t(atYear ? 'app.year.caption' : 'app.year.captionAway', {
            written: n(yearWritten),
            total: n(daysInYear(year)),
          })}
          captionHint={t('app.year.hint')}
          onPrev={() => shift(-1)}
          onNext={() => shift(1)}
          onToday={goToday}
        />
        <YearView year={year} lines={lines} onOpenMonth={openMonth} />
        {legend}
        <p className="pane__legend">{t('app.year.legendNote')}</p>
        <div className="pane__actions">
          <Button variant="primary" block onClick={() => setEditing(today)}>
            {isWritten(byDate.get(today))
              ? t('app.year.writtenToday')
              : t('app.year.writeToday')}
          </Button>
        </div>
        <p className="pane__note" role="status">
          {flash || t('app.nav.autosave')}
        </p>
      </section>
    )

  const monthPane = (
    <section
      className="pane"
      aria-label={t('app.month.grid', {
        month: monthName(anchor.month, locale),
        year: anchor.year,
      })}
    >
      {monthNav}
      <div className="rule-strong-top pane__grid">
        <MonthView
          cells={cells}
          gaps={gaps}
          firstDay={firstDay}
          today={today}
          selected={day}
          label={t('app.month.grid', {
            month: monthName(anchor.month, locale),
            year: anchor.year,
          })}
          onOpenDay={setDay}
        />
      </div>
      {legend}
      <p className="pane__legend">{t('app.month.legendNote')}</p>
      {atMonth ? (
        <div className="pane__actions">
          <Button variant="primary" block onClick={() => setDay(today)}>
            {t('app.month.openToday', { date: formatDayMonth(today, locale) })}
          </Button>
        </div>
      ) : null}
    </section>
  )

  const statsPane = (
    <section className="pane" aria-label={t('app.nav.stats')}>
      {monthNav}
      <StatsView
        streak={currentStreak(byDate, today)}
        record={longestStreak(entries)}
        month={totals(inPeriod(entries, monthKey(anchor.year, anchor.month)))}
        monthDays={monthTotal}
        yearWritten={inPeriod(entries, String(anchor.year)).filter(isWritten).length}
        moods={moodCounts(inPeriod(entries, monthKey(anchor.year, anchor.month)))}
        longest={longestDay(inPeriod(entries, monthKey(anchor.year, anchor.month)))}
      />
    </section>
  )

  const dayPane =
    day === null ? null : (
      <DayView
        date={day}
        entry={byDate.get(day)}
        streak={isWritten(byDate.get(day)) ? streakEndingAt(byDate, day).days : 0}
        future={day > today}
        prev={neighbourWritten(entries, day, -1)}
        next={neighbourWritten(entries, day, 1)}
        onBack={() => {
          setAnchor({ year: yearOf(day), month: monthOf(day) })
          setDay(null)
          setTab('month')
        }}
        onEdit={() => setEditing(day)}
        onGo={setDay}
      />
    )

  return (
    <div
      ref={root}
      className={`app ${embedded ? 'app--embedded' : 'app--page'}`}
    >
      {store.demo && !embedded ? (
        <div className="app__demo">
          <span>
            {t('app.demo.label')} — {t('app.demo.note')}
          </span>
          <Link className="t-meta" to="/app">
            {t('app.demo.leave')}
          </Link>
        </div>
      ) : null}

      <div className="app__head">
        <button
          type="button"
          className="app__brand"
          aria-label={t('app.nav.home')}
          onClick={goToday}
        >
          {t('common.brand')}
        </button>
        <span className="t-meta t-dim">{t('common.tagline')}</span>
      </div>

      <div ref={scroll} className="app__scroll">
        {day !== null
          ? dayPane
          : tab === 'year'
            ? yearPane
            : tab === 'month'
              ? monthPane
              : statsPane}
      </div>

      {/* Le jour et l'écriture sont des écrans pleins : la barre les
          quitterait sans que le retour ait servi, et le fil de lecture se
          perdrait. Elle revient dès qu'on remonte d'un cran. */}
      {day === null ? (
        <nav className="app__nav" aria-label={t('app.nav.views')}>
          {TABS.map((name) => (
            <button
              key={name}
              type="button"
              className={`app__navtab${
                tab === name && !settingsOpen ? ' app__navtab--current' : ''
              }`}
              aria-current={tab === name && !settingsOpen ? 'page' : undefined}
              onClick={() => {
                setSettingsOpen(false)
                setTab(name)
              }}
            >
              {t(`app.nav.${name}`)}
            </button>
          ))}
          <button
            type="button"
            className={`app__navtab${settingsOpen ? ' app__navtab--current' : ''}`}
            aria-expanded={settingsOpen}
            onClick={() => setSettingsOpen((open) => !open)}
          >
            {t('app.nav.settings')}
          </button>
        </nav>
      ) : null}

      {editing !== null ? (
        <EntrySheet
          date={editing}
          entry={byDate.get(editing)}
          today={today}
          settings={store.settings}
          onClose={() => setEditing(null)}
          onDiscard={() => {
            setEditing(null)
            showFlash(t('app.flash.discarded'))
          }}
          onSave={saveEntry}
          onDelete={() => deleteEntry(editing)}
        />
      ) : null}

      {settingsOpen ? (
        <SettingsSheet
          onClose={() => setSettingsOpen(false)}
          onFlash={showFlash}
        />
      ) : null}

      {/* Lu par l'assistance seulement : la date entière du jour ouvert, que
          le titre abrège. */}
      {day !== null ? (
        <span className="visually-hidden" role="status">
          {formatDate(day, locale)} · {t(`trace.${trace(byDate.get(day))}`)}
        </span>
      ) : null}
    </div>
  )
}
