/** Écrire une journée. Un panneau plein cadre : c'est l'écran, pas un
 *  incident au-dessus de l'écran.
 *
 *  Le texte d'abord, la note ensuite, l'humeur en dernier — dans l'ordre où
 *  on les pense. Aucun champ n'est obligatoire, et aucune longueur n'est
 *  attendue : une entrée de quatre mots est une entrée. */

import { useState } from 'react'
import { Button } from '../../components/Button.tsx'
import { Confirm } from '../../components/Feedback.tsx'
import { Sheet } from '../../components/Sheet.tsx'
import {
  SelectField,
  TextAreaField,
  TextField,
} from '../../components/TextField.tsx'
import { useI18n } from '../../i18n/index.tsx'
import { emptyEntry, isBlank, wordCount } from '../../lib/entries.ts'
import { formatWeekdayDayMonth } from '../../lib/format.ts'
import { MOODS } from '../../lib/types.ts'
import type { Entry, Mood, Settings } from '../../lib/types.ts'

export function EntrySheet({
  date,
  entry,
  today,
  settings,
  onClose,
  onDiscard,
  onSave,
  onDelete,
}: {
  date: string
  /** L'entrée existante, ou rien : le formulaire est le même. */
  entry: Entry | undefined
  today: string
  settings: Settings
  onClose: () => void
  /** Jeter un brouillon ferme la feuille, mais le dit : ce qui est parti
   *  n'était enregistré nulle part, et le silence laisserait un doute. */
  onDiscard: () => void
  onSave: (entry: Entry) => void
  onDelete: () => void
}) {
  const { t, tp, locale } = useI18n()
  const [draft, setDraft] = useState<Entry>(() => entry ?? emptyEntry(date))
  const [askDelete, setAskDelete] = useState(false)

  const words = wordCount(draft.text)
  const empty = isBlank(draft)
  const existed = entry !== undefined
  const patch = (change: Partial<Entry>): void =>
    setDraft((current) => ({ ...current, ...change }))

  const moodOptions = [
    { value: '', label: t('mood.none') },
    ...MOODS.map((mood) => ({ value: mood, label: t(`mood.${mood}`) })),
  ]

  return (
    <Sheet full label={t('app.entry.editTitle')} onClose={onClose}>
      <div className="settings__head">
        <Button variant="quiet" onClick={onClose}>
          {t('app.entry.back')}
        </Button>
        <span className="t-meta t-dim">{t('app.entry.draft')}</span>
      </div>

      <div className="settings__body">
        <div className="entry__head">
          <h2 className="t-title">
            {date === today ? t('app.entry.today') : t('app.entry.titleOther')}
          </h2>
          <span className="t-meta t-muted">
            {formatWeekdayDayMonth(date, locale)}
          </span>
        </div>

        <div className="entry__form rule-strong-top">
          <TextAreaField
            label={t('app.entry.text')}
            value={draft.text}
            onValueChange={(text) => patch({ text })}
            rows={8}
            hint={
              words === 0
                ? t('app.entry.textHint')
                : tp('app.entry.textHintWords', words)
            }
          />

          {/* Un champ masqué n'efface rien : ce qui a déjà été écrit reste
              dans le fichier, et se relit dans la vue du jour. */}
          {settings.note === 'asked' ? (
            <TextField
              label={t('app.entry.note')}
              value={draft.note}
              onValueChange={(note) => patch({ note })}
              hint={t('app.entry.noteHint')}
              clearable
              clearLabel={t('app.entry.clear')}
              onClear={() => patch({ note: '' })}
            />
          ) : null}

          {settings.mood === 'asked' ? (
            <SelectField
              label={t('app.entry.mood')}
              value={draft.mood ?? ''}
              onValueChange={(value) =>
                patch({ mood: value === '' ? null : (value as Mood) })
              }
              options={moodOptions}
            />
          ) : null}

          <TextField
            label={t('app.entry.place')}
            value={draft.place}
            onValueChange={(place) => patch({ place })}
            hint={t('app.entry.placeHint')}
          />
        </div>

        {askDelete ? (
          <Confirm
            boxed
            title={t('app.entry.deleteAsk', {
              date: formatWeekdayDayMonth(date, locale),
            })}
            body={tp('app.entry.deleteBody', wordCount(entry?.text ?? ''))}
          >
            <Button variant="quiet" onClick={() => setAskDelete(false)}>
              {t('common.cancel')}
            </Button>
            <Button variant="destructive" strong onClick={onDelete}>
              {t('app.entry.deleteConfirm')}
            </Button>
          </Confirm>
        ) : (
          <div className="entry__actions">
            <Button
              variant="primary"
              block
              disabled={empty}
              onClick={() => onSave(draft)}
            >
              {empty ? t('app.entry.saveEmpty') : t('app.entry.save')}
            </Button>
            {existed ? (
              <Button variant="destructive" onClick={() => setAskDelete(true)}>
                {t('app.entry.delete')}
              </Button>
            ) : (
              <Button variant="quiet" onClick={onDiscard}>
                {t('app.entry.discard')}
              </Button>
            )}
          </div>
        )}
      </div>
    </Sheet>
  )
}
