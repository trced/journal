/** Les réglages : affichage, écriture, données, à propos.
 *
 *  Une feuille par le bas, glissable — pas un panneau plein cadre : les
 *  réglages sont un aparté, l'année reste derrière eux. Chaque ligne fait
 *  défiler ses valeurs au clic, et le changement s'applique aussitôt. */

import { useRef, useState } from 'react'
import { Button } from '../../components/Button.tsx'
import { Confirm } from '../../components/Feedback.tsx'
import { Sheet } from '../../components/Sheet.tsx'
import {
  ActionRow,
  LinkRow,
  StaticRow,
  ToggleRow,
} from '../../components/ToggleRow.tsx'
import { useI18n } from '../../i18n/index.tsx'
import type { MessageKey } from '../../i18n/index.tsx'
import { formatWeekdayDayMonth } from '../../lib/format.ts'
import {
  downloadFile,
  downloadText,
  exportFilename,
  parseFile,
  shareFile,
  toText,
} from '../../lib/io.ts'
import { LICENCE_URL, REPO } from '../../lib/links.ts'
import type { Entry, Settings } from '../../lib/types.ts'
import { APP_VERSION } from '../../lib/version.ts'
import { useStore } from '../../state/store.tsx'

/** Une ligne de réglage : les valeurs possibles, dans l'ordre du cycle. */
interface Cycle<K extends keyof Settings> {
  key: K
  /** La section qui la porte. Une seule liste : l'ordre du cycle et l'ordre
   *  d'affichage sont la même donnée, et rien ne peut les désaccorder. */
  group: 'display' | 'writing'
  labelKey: MessageKey
  values: readonly Settings[K][]
  valueKey: (value: Settings[K]) => MessageKey
}

const CYCLES = [
  {
    key: 'theme',
    group: 'display',
    labelKey: 'app.settings.theme',
    values: ['system', 'light', 'dark'],
    valueKey: (v) => `app.settings.theme.${v}` as MessageKey,
  } satisfies Cycle<'theme'>,
  {
    key: 'lang',
    group: 'display',
    labelKey: 'app.settings.lang',
    values: ['system', 'fr', 'en'],
    valueKey: (v) => `app.settings.lang.${v}` as MessageKey,
  } satisfies Cycle<'lang'>,
  {
    key: 'firstDay',
    group: 'display',
    labelKey: 'app.settings.firstDay',
    values: ['monday', 'sunday'],
    valueKey: (v) => `app.settings.firstDay.${v}` as MessageKey,
  } satisfies Cycle<'firstDay'>,
  {
    key: 'textSize',
    group: 'display',
    labelKey: 'app.settings.textSize',
    values: ['small', 'medium', 'large'],
    valueKey: (v) => `app.settings.textSize.${v}` as MessageKey,
  } satisfies Cycle<'textSize'>,
  {
    key: 'mood',
    group: 'writing',
    labelKey: 'app.settings.mood',
    values: ['asked', 'hidden'],
    valueKey: (v) => `app.settings.mood.${v}` as MessageKey,
  } satisfies Cycle<'mood'>,
  {
    key: 'note',
    group: 'writing',
    labelKey: 'app.settings.note',
    values: ['asked', 'hidden'],
    valueKey: (v) => `app.settings.note.${v}` as MessageKey,
  } satisfies Cycle<'note'>,
] as const

type Pending =
  | { state: 'idle' }
  | { state: 'ready'; filename: string; entries: Entry[] }
  | { state: 'error'; message: MessageKey }

const REASON_KEY = {
  unreadable: 'app.import.errorUnreadable',
  schema: 'app.import.errorSchema',
  version: 'app.import.errorVersion',
} as const

export function SettingsSheet({
  onClose,
  onFlash,
}: {
  onClose: () => void
  onFlash: (message: string) => void
}) {
  const { t, tp, locale } = useI18n()
  const store = useStore()
  const fileInput = useRef<HTMLInputElement>(null)
  const [pending, setPending] = useState<Pending>({ state: 'idle' })
  const [askErase, setAskErase] = useState(false)

  const count = store.entries.length

  const cycle = <K extends keyof Settings>(entry: Cycle<K>): void => {
    const values = entry.values
    const index = values.indexOf(store.settings[entry.key])
    const next = values[(index + 1) % values.length]
    if (next !== undefined) store.setSetting(entry.key, next)
    setPending({ state: 'idle' })
    setAskErase(false)
  }

  /** Les lignes d'une section. Le `never` est le prix de la liste unique :
   *  chaque entrée sait lire sa propre valeur, TypeScript ne peut pas le
   *  vérifier sur l'union — mais `satisfies Cycle<K>` l'a déjà fait, une par
   *  une, à la déclaration. */
  const rows = (group: Cycle<keyof Settings>['group']) =>
    CYCLES.filter((entry) => entry.group === group).map((entry) => {
      const value = t(entry.valueKey(store.settings[entry.key] as never))
      const name = t(entry.labelKey)
      return (
        <ToggleRow
          key={entry.key}
          name={name}
          value={value}
          ariaLabel={t('app.settings.cycleAria', { name, value })}
          onCycle={() => cycle(entry as Cycle<keyof Settings>)}
        />
      )
    })

  const onExport = (): void => {
    downloadFile(store.file())
    onFlash(tp('app.flash.exported', count))
    onClose()
  }

  /** L'export en texte : un fichier qui se relit sans ce programme.
   *  Les libellés viennent du dictionnaire — le fichier est dans la langue
   *  de l'interface. */
  const onExportText = (): void => {
    downloadText(
      toText(
        store.entries,
        {
          title: t('app.text.title'),
          mood: t('app.text.mood'),
          note: t('app.text.note'),
          place: t('app.text.place'),
          writtenAt: t('app.text.writtenAt'),
          words: t('app.text.words'),
        },
        (entry) => formatWeekdayDayMonth(entry.date, locale),
        (mood) => t(`mood.${mood}`),
      ),
    )
    onFlash(t('app.flash.exportedText'))
    onClose()
  }

  const onSend = async (): Promise<void> => {
    const result = await shareFile(store.file())
    if (result === 'cancelled') return
    onFlash(
      result === 'shared'
        ? t('app.flash.shared')
        : tp('app.flash.exported', count),
    )
    onClose()
  }

  const onPickFile = async (file: File): Promise<void> => {
    const text = await file.text()
    const result = parseFile(text)
    if (!result.ok) {
      setPending({ state: 'error', message: REASON_KEY[result.reason] })
      return
    }
    if (result.file.data.entries.length === 0) {
      setPending({ state: 'error', message: 'app.import.errorEmpty' })
      return
    }
    setPending({
      state: 'ready',
      filename: file.name,
      entries: result.file.data.entries,
    })
  }

  const openPicker = (): void => {
    setAskErase(false)
    setPending({ state: 'idle' })
    fileInput.current?.click()
  }

  return (
    <Sheet label={t('app.settings.title')} onClose={onClose}>
      <div className="sheet__head">
        <span className="t-brand">{t('app.settings.title')}</span>
        <Button variant="quiet" onClick={onClose}>
          {t('common.close')}
        </Button>
      </div>
      {/* La mention est ici, juste sous la poignée qu'elle décrit — et non en
          bas de feuille : la barre d'actions de la famille est collante sur
          téléphone, et une note collante recouvrirait les réglages. */}
      <p className="settings__note">{t('app.settings.grabNote')}</p>

      <section>
        <div className="section-label">{t('app.settings.display')}</div>
        {rows('display')}
        <p className="settings__note">{t('app.settings.displayNote')}</p>
      </section>

      <section>
        <div className="section-label">{t('app.settings.writing')}</div>
        {rows('writing')}
        <p className="settings__note">{t('app.settings.writingNote')}</p>
      </section>

      <section>
        <div className="section-label">{t('app.settings.data')}</div>

        <ActionRow
          name={t('app.settings.export')}
          value={t('app.settings.exportValue', { file: exportFilename() })}
          onClick={onExport}
        />

        <ActionRow
          name={t('app.settings.exportText')}
          value={tp('app.settings.exportTextValue', count)}
          onClick={onExportText}
        />

        <ActionRow
          name={t('app.settings.send')}
          value={t('app.settings.sendValue')}
          onClick={() => void onSend()}
        />

        <input
          ref={fileInput}
          type="file"
          accept="application/json,.json"
          className="visually-hidden"
          onChange={(event) => {
            const file = event.target.files?.[0]
            event.target.value = ''
            if (file) void onPickFile(file)
          }}
        />

        {pending.state === 'ready' ? (
          <div className="confirm">
            <p className="confirm__title">
              {tp('app.settings.importFound', pending.entries.length, {
                file: pending.filename,
              })}
            </p>
            <p className="confirm__body">
              {count === 0
                ? t('app.settings.importExplainEmpty')
                : tp('app.settings.importExplain', count)}
            </p>
            <div className="confirm__actions">
              <Button
                variant="quiet"
                onClick={() => setPending({ state: 'idle' })}
              >
                {t('common.cancel')}
              </Button>
              <Button
                onClick={() => {
                  const added = store.mergeIncoming(pending.entries)
                  setPending({ state: 'idle' })
                  onFlash(
                    added === 0
                      ? t('app.flash.importedNone')
                      : tp('app.flash.imported', added),
                  )
                  onClose()
                }}
              >
                {t('app.settings.merge')}
              </Button>
              <Button
                variant="destructive"
                strong
                onClick={() => {
                  store.replaceAll(pending.entries)
                  setPending({ state: 'idle' })
                  onFlash(tp('app.flash.replaced', pending.entries.length))
                  onClose()
                }}
              >
                {t('app.settings.replace')}
              </Button>
            </div>
          </div>
        ) : pending.state === 'error' ? (
          <div className="confirm" role="alert">
            <p className="confirm__title t-danger">
              {t('app.import.errorTitle')}
            </p>
            <p className="confirm__body">{t(pending.message)}</p>
            <div className="confirm__actions">
              <Button onClick={openPicker}>{t('app.import.retry')}</Button>
            </div>
          </div>
        ) : (
          <ActionRow
            name={t('app.settings.import')}
            value={t('app.settings.importValue')}
            onClick={openPicker}
          />
        )}

        {askErase ? (
          <Confirm
            title={tp('app.settings.eraseAsk', count)}
            body={t('app.settings.eraseBody')}
          >
            <Button variant="quiet" onClick={() => setAskErase(false)}>
              {t('common.cancel')}
            </Button>
            <Button
              variant="destructive"
              strong
              onClick={() => {
                store.eraseAll()
                setAskErase(false)
                onFlash(t('app.flash.erased'))
                onClose()
              }}
            >
              {t('app.settings.eraseConfirm')}
            </Button>
          </Confirm>
        ) : (
          <ActionRow
            danger
            name={t('app.settings.erase')}
            value={tp('app.settings.eraseValue', count)}
            onClick={() => {
              setPending({ state: 'idle' })
              setAskErase(true)
            }}
          />
        )}

        <p className="settings__note">
          {store.storageAvailable
            ? tp('app.settings.storageNote', count)
            : t('app.settings.storageUnavailable')}
        </p>
        <p className="settings__note">{t('app.settings.importNote')}</p>
      </section>

      <section>
        <div className="section-label">{t('app.settings.about')}</div>
        <LinkRow
          to="/about"
          name={t('app.settings.aboutApp')}
          value={t('app.settings.aboutValue')}
        />
        <LinkRow
          to="/changelog"
          name={t('app.settings.changelog')}
          value={t('app.settings.changelogValue')}
        />
        <StaticRow name={t('app.settings.version')} value={APP_VERSION} />
        <LinkRow
          to="/legal/terms"
          name={t('app.settings.legal')}
          value={t('app.settings.read')}
        />
        <LinkRow
          external
          to={LICENCE_URL}
          name={t('app.settings.licence')}
          value="AGPL-3.0"
        />
        {/* L'AGPL demande qu'une application offre son code source depuis son
            interface : c'est ici que l'utilisateur le trouve. */}
        <LinkRow
          external
          to={REPO}
          name={t('app.settings.source')}
          value={t('app.settings.sourceValue')}
        />
        <p className="settings__note">{t('app.settings.offline')}</p>
      </section>
    </Sheet>
  )
}
