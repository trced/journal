import { describe, expect, it } from 'vitest'
import { emptyEntry } from './entries.ts'
import {
  EMPTY_STATE,
  STORAGE_KEY,
  hasEntries,
  isStorageAvailable,
  loadState,
  saveState,
  toFile,
} from './storage.ts'
import { DEFAULT_SETTINGS, SCHEMA_VERSION } from './types.ts'
import type { Entry } from './types.ts'

const entry = (date: string, patch: Partial<Entry> = {}): Entry => ({
  ...emptyEntry(date),
  ...patch,
})

describe('la clé', () => {
  it('est unique et versionnée', () => {
    expect(STORAGE_KEY).toBe('journal.v1')
  })
})

describe('saveState et loadState', () => {
  it('font un aller-retour sans perte', () => {
    const state = {
      entries: [entry('2026-08-12', { text: 'x', mood: 'clear' as const })],
      settings: { ...DEFAULT_SETTINGS, theme: 'dark' as const },
    }
    saveState(state)
    const loaded = loadState()
    expect(loaded.entries).toHaveLength(1)
    expect(loaded.entries[0]?.mood).toBe('clear')
    expect(loaded.settings.theme).toBe('dark')
  })

  it('écrivent exactement le format du fichier d’export', () => {
    // Ce qui est lu par l'application est ce qui en sort : le stockage n'a
    // pas de forme à lui.
    saveState({ entries: [entry('2026-08-12', { text: 'x' })], settings: DEFAULT_SETTINGS })
    const raw = window.localStorage.getItem(STORAGE_KEY) ?? ''
    expect(JSON.parse(raw)).toMatchObject({
      schemaVersion: SCHEMA_VERSION,
      data: { entries: [{ date: '2026-08-12' }] },
    })
  })

  it('rendent l’état vide quand rien n’est stocké', () => {
    expect(loadState()).toEqual(EMPTY_STATE)
  })

  it('rendent l’état vide sur un contenu illisible', () => {
    window.localStorage.setItem(STORAGE_KEY, '{ cassé')
    expect(loadState()).toEqual(EMPTY_STATE)
  })

  it('complètent les réglages absents par leurs valeurs par défaut', () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        schemaVersion: SCHEMA_VERSION,
        data: { entries: [] },
        settings: { theme: 'dark' },
      }),
    )
    expect(loadState().settings).toEqual({ ...DEFAULT_SETTINGS, theme: 'dark' })
  })
})

describe('toFile', () => {
  it('déclare la version du schéma', () => {
    expect(toFile({ entries: [], settings: DEFAULT_SETTINGS })).toEqual({
      schemaVersion: SCHEMA_VERSION,
      data: { entries: [] },
      settings: DEFAULT_SETTINGS,
    })
  })
})

describe('hasEntries', () => {
  it('dit non sur un journal vide', () => {
    expect(hasEntries()).toBe(false)
  })

  it('dit oui dès la première entrée', () => {
    saveState({
      entries: [entry('2026-08-12', { text: 'x' })],
      settings: DEFAULT_SETTINGS,
    })
    expect(hasEntries()).toBe(true)
  })

  it('dit non sur un fichier illisible', () => {
    // La réponse prudente : on montre la présentation plutôt que d'envoyer
    // sur une application qu'on n'a pas su relire.
    window.localStorage.setItem(STORAGE_KEY, 'néant')
    expect(hasEntries()).toBe(false)
  })
})

describe('isStorageAvailable', () => {
  it('dit oui quand le navigateur accepte d’écrire', () => {
    expect(isStorageAvailable()).toBe(true)
  })

  it('ne laisse aucune sonde derrière elle', () => {
    isStorageAvailable()
    expect(window.localStorage.getItem('__journal_probe__')).toBeNull()
  })
})
