/** La marque d'un jour. Un point pour l'humeur, un cercle pour la note, un
 *  disque pour le texte, un disque cerclé pour les deux.
 *
 *  Toujours décoratif : ce que la marque dit est déjà dans le nom accessible
 *  de la case qui la porte. Une forme n'est jamais la seule information. */

import type { Trace } from '../lib/types.ts'

export function TraceMark({
  mark,
  large = false,
}: {
  mark: Trace
  /** Le cran du dessus, pour la tête d'une journée. */
  large?: boolean
}) {
  const classes = [
    'trace',
    `trace--${mark}`,
    large ? 'trace--lg' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <span className={classes} aria-hidden="true">
      {mark === 'full' ? <span className="trace__core" /> : null}
    </span>
  )
}

/** La légende. Les quatre marques et ce qu'elles veulent dire, en clair —
 *  elle ne disparaît jamais derrière une aide contextuelle. */
export function TraceLegend({
  labels,
}: {
  labels: { mark: Trace; label: string }[]
}) {
  return (
    <ul className="legend">
      {labels.map(({ mark, label }) => (
        <li key={mark} className="legend__item">
          <TraceMark mark={mark} />
          <span>{label}</span>
        </li>
      ))}
    </ul>
  )
}
