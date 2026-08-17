/** Parcours réels : écrire une journée, la relire, la modifier, la supprimer,
 *  et naviguer entre l'année, le mois et le bilan.
 *  Le test passe par l'interface, jamais par le magasin. */

import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { ReactNode } from 'react'
import { JournalApp } from './JournalApp.tsx'
import { I18nProvider } from '../i18n/index.tsx'
import { STORAGE_KEY, toFile } from '../lib/storage.ts'
import type { StoredState } from '../lib/storage.ts'
import { emptyEntry } from '../lib/entries.ts'
import { DEFAULT_SETTINGS } from '../lib/types.ts'
import type { Entry } from '../lib/types.ts'
import { StoreProvider, useStore } from '../state/store.tsx'

/** Mercredi 12 août 2026, 22 h 14. Le 1er août est un samedi : la grille du
 *  mois porte cinq cases de tête en semaine lundi. */
const TODAY = new Date(2026, 7, 12, 22, 14, 0)

function entry(date: string, patch: Partial<Entry> = {}): Entry {
  return { ...emptyEntry(date), ...patch }
}

function seed(entries: Entry[]): void {
  const state: StoredState = {
    entries,
    // Langue fixée : sans cela le test suivrait celle du navigateur simulé.
    settings: { ...DEFAULT_SETTINGS, lang: 'fr' },
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(toFile(state)))
}

function Localised({ children }: { children: ReactNode }) {
  const { lang } = useStore()
  return <I18nProvider lang={lang}>{children}</I18nProvider>
}

function renderApp() {
  return render(
    <StoreProvider>
      <Localised>
        <MemoryRouter>
          <JournalApp />
        </MemoryRouter>
      </Localised>
    </StoreProvider>,
  )
}

function stored(): { entries: Entry[] } {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}').data
}

const tab = (name: string) => screen.getByRole('button', { name })

describe('JournalApp', () => {
  beforeEach(() => {
    // Seule Date est simulée : les délais du composant restent réels, donc
    // userEvent n'a pas à piloter les minuteries.
    vi.useFakeTimers({ now: TODAY, toFake: ['Date'] })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('présente son vocabulaire au premier lancement, une seule fois', () => {
    seed([])
    const view = renderApp()

    expect(screen.getByText('un disque cerclé')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'écrire le premier jour' }),
    ).toBeInTheDocument()

    view.unmount()
    seed([entry('2026-08-12', { text: 'un deux trois' })])
    renderApp()
    expect(screen.queryByText('un disque cerclé')).not.toBeInTheDocument()
  })

  it('ouvre sur l’année courante et compte ses jours écrits', () => {
    seed([
      entry('2026-08-12', { text: 'x' }),
      entry('2026-03-04', { note: 'y' }),
    ])
    renderApp()

    expect(screen.getByText('2026')).toBeInTheDocument()
    expect(screen.getByText('2 / 365')).toBeInTheDocument()
    // Douze lignes, une par mois, et chacune dit son compte en entier.
    expect(
      screen.getByRole('button', { name: 'août 2026, 1 jour écrit, ouvrir le mois' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'janv. 2026, 0 jour écrit, ouvrir le mois' }),
    ).toBeInTheDocument()
  })

  it('ouvre un mois depuis sa ligne d’année, puis un jour depuis sa case', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    seed([entry('2026-08-12', { text: 'un deux trois', note: 'rappeler' })])
    renderApp()

    await user.click(
      screen.getByRole('button', { name: /^août 2026, 1 jour écrit/ }),
    )
    expect(screen.getByText('août 2026')).toBeInTheDocument()
    expect(screen.getByText('1 jour sur 31')).toBeInTheDocument()

    // Le nom de la case dit ce que la marque montre : une forme de trois
    // pixels ne s'annonce pas.
    await user.click(
      screen.getByRole('button', { name: '12 août 2026, texte + note, ouvrir' }),
    )
    expect(screen.getByText('un deux trois')).toBeInTheDocument()
    expect(screen.getByText('rappeler')).toBeInTheDocument()
  })

  it('écrit une journée et l’enregistre aussitôt, avec son heure', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    seed([entry('2026-01-04', { text: 'ancienne' })])
    renderApp()

    await user.click(tab("+ écrire aujourd'hui"))
    await user.type(screen.getByLabelText('texte'), 'trois mots ici')
    await user.click(tab('enregistrer la journée'))

    const saved = stored().entries.find((e) => e.date === '2026-08-12')
    expect(saved).toMatchObject({ text: 'trois mots ici', writtenAt: '22:14' })
    // Enregistrer ouvre la journée : on relit ce qu'on vient d'écrire.
    expect(screen.getByText('trois mots ici')).toBeInTheDocument()
    expect(screen.getByText('mots')).toBeInTheDocument()
  })

  it('refuse d’enregistrer une entrée vide plutôt que d’écrire une coquille', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    seed([])
    renderApp()

    await user.click(tab('écrire le premier jour'))
    expect(tab('rien à enregistrer')).toBeDisabled()

    await user.type(screen.getByLabelText('texte'), 'un')
    expect(tab('enregistrer la journée')).toBeEnabled()
  })

  it('remplace l’aide du champ par le compte de mots dès la première frappe', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    seed([])
    renderApp()

    await user.click(tab('écrire le premier jour'))
    expect(screen.getByText('jamais de longueur imposée.')).toBeInTheDocument()

    await user.type(screen.getByLabelText('texte'), 'un deux')
    expect(screen.getByText('2 mots')).toBeInTheDocument()
  })

  it('modifie une journée existante sans déplacer son heure d’écriture', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    seed([entry('2026-08-12', { text: 'première', writtenAt: '06:30' })])
    renderApp()

    await user.click(screen.getByRole('button', { name: /^août 2026/ }))
    await user.click(screen.getByRole('button', { name: /^12 août 2026/ }))
    await user.click(tab('modifier'))
    await user.clear(screen.getByLabelText('texte'))
    await user.type(screen.getByLabelText('texte'), 'corrigée')
    await user.click(tab('enregistrer la journée'))

    expect(stored().entries[0]).toMatchObject({
      text: 'corrigée',
      writtenAt: '06:30',
    })
  })

  it('supprime une journée derrière une confirmation qui dit ce qui part', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    seed([entry('2026-08-12', { text: 'un deux trois' })])
    renderApp()

    await user.click(screen.getByRole('button', { name: /^août 2026/ }))
    await user.click(screen.getByRole('button', { name: /^12 août 2026/ }))
    await user.click(tab('modifier'))
    await user.click(tab('supprimer cette journée'))

    expect(screen.getByText(/3 mots — sera effacé/)).toBeInTheDocument()
    await user.click(tab('supprimer définitivement'))

    expect(stored().entries).toEqual([])
  })

  it('ne propose pas d’écrire un jour à venir', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    seed([entry('2026-08-12', { text: 'x' })])
    renderApp()

    await user.click(screen.getByRole('button', { name: /^août 2026/ }))
    // Le 13 août est demain : posé, lisible, mais pas un bouton.
    expect(
      screen.queryByRole('button', { name: /^13 août 2026/ }),
    ).not.toBeInTheDocument()
  })

  it('saute les jours vides d’un jour écrit au précédent', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    seed([
      entry('2026-08-01', { text: 'le premier' }),
      entry('2026-08-12', { text: 'le douze' }),
    ])
    renderApp()

    await user.click(screen.getByRole('button', { name: /^août 2026/ }))
    await user.click(screen.getByRole('button', { name: /^12 août 2026/ }))
    await user.click(
      screen.getByRole('button', { name: 'jour écrit précédent : 1 août' }),
    )
    expect(screen.getByText('le premier')).toBeInTheDocument()
  })

  it('replie les jours écoulés sans rien en une seule ligne', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    seed([entry('2026-08-01', { text: 'x' }), entry('2026-08-12', { text: 'y' })])
    renderApp()

    await user.click(screen.getByRole('button', { name: /^août 2026/ }))
    expect(
      screen.getByText('10 jours sans rien · du 2 août au 11 août'),
    ).toBeInTheDocument()
  })

  it('compte la série en cours sans la réclamer', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    seed([
      entry('2026-08-10', { text: 'x' }),
      entry('2026-08-11', { text: 'y' }),
      entry('2026-08-12', { text: 'z' }),
    ])
    renderApp()

    await user.click(tab('bilan'))
    expect(screen.getByText('série en cours')).toBeInTheDocument()
    expect(screen.getByText('3 jours')).toBeInTheDocument()
    expect(screen.getByText('depuis le 10 août')).toBeInTheDocument()
    expect(
      screen.getByText(/pas une chaîne à ne pas rompre/),
    ).toBeInTheDocument()
  })

  it('rend les quatre humeurs, même celles à zéro', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    seed([
      entry('2026-08-10', { text: 'x', mood: 'clear' }),
      entry('2026-08-11', { text: 'y', mood: 'clear' }),
      entry('2026-08-12', { text: 'z', mood: 'low' }),
    ])
    renderApp()

    await user.click(tab('bilan'))
    for (const mood of ['clair', 'égal', 'dense', 'bas']) {
      expect(screen.getByText(mood)).toBeInTheDocument()
    }
  })

  it('masque le champ d’humeur sans effacer ce qui a été écrit', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    seed([entry('2026-08-12', { text: 'x', mood: 'clear' })])
    renderApp()

    await user.click(tab('réglages'))
    await user.click(
      screen.getByRole('button', { name: 'humeur demandée : oui, changer' }),
    )
    await user.click(tab('fermer'))

    await user.click(screen.getByRole('button', { name: /^août 2026/ }))
    await user.click(screen.getByRole('button', { name: /^12 août 2026/ }))
    // La valeur se relit toujours dans la vue du jour.
    expect(screen.getByText('clair')).toBeInTheDocument()

    await user.click(tab('modifier'))
    expect(screen.queryByLabelText('humeur')).not.toBeInTheDocument()
    expect(stored().entries[0]?.mood).toBe('clear')
  })

  it('change d’année avec les flèches et revient avec T', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    seed([entry('2026-08-12', { text: 'x' })])
    renderApp()

    await user.click(screen.getByRole('button', { name: 'année précédente' }))
    expect(screen.getByText('2025')).toBeInTheDocument()
    expect(screen.getByText('0 / 365 · revenir')).toBeInTheDocument()

    await user.keyboard('{ArrowRight}')
    expect(screen.getByText('2026')).toBeInTheDocument()

    await user.keyboard('{ArrowLeft}')
    await user.keyboard('t')
    expect(screen.getByText('2026')).toBeInTheDocument()
  })

  it('nomme la destination courante à l’assistance', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    seed([entry('2026-08-12', { text: 'x' })])
    renderApp()

    const nav = screen.getByRole('navigation', { name: 'Vues' })
    expect(within(nav).getByRole('button', { name: 'année' })).toHaveAttribute(
      'aria-current',
      'page',
    )

    await user.click(within(nav).getByRole('button', { name: 'mois' }))
    expect(within(nav).getByRole('button', { name: 'mois' })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })

  it('retire la barre des destinations sur un jour, et la rend au retour', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    seed([entry('2026-08-12', { text: 'x' })])
    renderApp()

    await user.click(screen.getByRole('button', { name: /^août 2026/ }))
    await user.click(screen.getByRole('button', { name: /^12 août 2026/ }))
    expect(screen.queryByRole('navigation', { name: 'Vues' })).not.toBeInTheDocument()

    await user.click(tab('‹ août'))
    expect(screen.getByRole('navigation', { name: 'Vues' })).toBeInTheDocument()
  })
})
