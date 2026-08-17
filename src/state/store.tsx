/** État de l'application : les entrées et les réglages.
 *  Une seule source, persistée localement à chaque changement.
 *
 *  Le mode exemple ne duplique pas les réglages : il ne remplace que les
 *  entrées. Le thème choisi depuis la démonstration est donc un vrai
 *  réglage, mais le journal de l'utilisateur n'est jamais touché. */

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { ReactNode } from 'react'
import { removeEntry, upsertEntry } from '../lib/entries.ts'
import { nowTime, todayISO } from '../lib/format.ts'
import { mergeFile } from '../lib/io.ts'
import { sampleEntries } from '../lib/sample.ts'
import type { SampleText } from '../lib/sample.ts'
import {
  EMPTY_STATE,
  isStorageAvailable,
  loadState,
  saveState,
  toFile,
} from '../lib/storage.ts'
import type { StoredState } from '../lib/storage.ts'
import type { Entry, JournalFile, Settings } from '../lib/types.ts'
import { resolveLang } from '../i18n/index.tsx'
import type { Lang } from '../i18n/index.tsx'

export interface Store {
  entries: Entry[]
  settings: Settings
  lang: Lang
  /** Mode exemple : rien ne sort de l'onglet. */
  demo: boolean
  storageAvailable: boolean
  file: () => JournalFile
  /** Enregistre l'entrée à sa date. Une entrée vidée est supprimée. */
  saveEntry: (entry: Entry) => void
  deleteEntry: (date: string) => void
  replaceAll: (entries: Entry[]) => void
  /** Fusionne et renvoie le nombre de jours réellement ajoutés. */
  mergeIncoming: (entries: Entry[]) => number
  eraseAll: () => void
  setSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void
}

const StoreContext = createContext<Store | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoredState>(() =>
    typeof window === 'undefined' ? EMPTY_STATE : loadState(),
  )
  const [storageAvailable] = useState(
    () => typeof window !== 'undefined' && isStorageAvailable(),
  )

  // Une seule écriture, au même endroit : impossible d'oublier de persister.
  // Rien n'est écrit à la simple ouverture — seulement quand l'état change.
  const untouched = useRef(true)
  useEffect(() => {
    if (untouched.current) {
      untouched.current = false
      return
    }
    saveState(state)
  }, [state])

  const lang = useMemo(
    () => resolveLang(state.settings.lang),
    [state.settings.lang],
  )

  // Seul le magasin racine touche au document.
  useEffect(() => {
    const root = document.documentElement
    root.lang = lang
    if (state.settings.theme === 'system') root.removeAttribute('data-theme')
    else root.setAttribute('data-theme', state.settings.theme)
    root.setAttribute('data-text-size', state.settings.textSize)
  }, [lang, state.settings.theme, state.settings.textSize])

  const value = useMemo<Store>(
    () => ({
      entries: state.entries,
      settings: state.settings,
      lang,
      demo: false,
      storageAvailable,
      file: () => toFile(state),
      saveEntry: (entry) =>
        setState((s) => ({
          ...s,
          entries: upsertEntry(s.entries, entry, nowTime()),
        })),
      deleteEntry: (date) =>
        setState((s) => ({ ...s, entries: removeEntry(s.entries, date) })),
      replaceAll: (entries) => setState((s) => ({ ...s, entries })),
      mergeIncoming: (incoming) => {
        const result = mergeFile(state.entries, incoming)
        setState((s) => ({ ...s, entries: result.entries }))
        return result.added
      },
      eraseAll: () => setState((s) => ({ ...s, entries: [] })),
      setSetting: (key, val) =>
        setState((s) => ({ ...s, settings: { ...s.settings, [key]: val } })),
    }),
    [state, lang, storageAvailable],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

/** Surcouche exemple : mêmes réglages, entrées en mémoire seulement.
 *  Les textes viennent du dictionnaire — la démonstration parle la langue de
 *  qui la regarde. */
export function DemoStoreProvider({
  sample,
  children,
}: {
  sample: SampleText
  children: ReactNode
}) {
  const parent = useStore()
  const [entries, setEntries] = useState(() =>
    sampleEntries(todayISO(), sample),
  )

  const value = useMemo<Store>(
    () => ({
      ...parent,
      entries,
      demo: true,
      file: () => ({
        schemaVersion: parent.file().schemaVersion,
        data: { entries },
        settings: parent.settings,
      }),
      saveEntry: (entry) =>
        setEntries((current) => upsertEntry(current, entry, nowTime())),
      deleteEntry: (date) =>
        setEntries((current) => removeEntry(current, date)),
      replaceAll: (next) => setEntries(next),
      mergeIncoming: (incoming) => {
        const result = mergeFile(entries, incoming)
        setEntries(result.entries)
        return result.added
      },
      eraseAll: () => setEntries([]),
    }),
    [parent, entries],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore(): Store {
  const store = useContext(StoreContext)
  if (!store) throw new Error('useStore doit être utilisé dans un StoreProvider')
  return store
}
