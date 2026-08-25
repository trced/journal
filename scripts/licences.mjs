/* ============================================================================
 * Les licences de ce qui voyage dans l'app publiée.
 *
 * Les paquets npm embarqués sont sous MIT — react, react-dom, react-router et
 * ce qu'ils emmènent. **JetBrains Mono, elle, est sous SIL Open Font License
 * 1.1**, qui n'est la licence ni du dépôt ni d'aucun de ces paquets, et qui
 * pose sa condition sur des fichiers qui ne sont pas du code : le logiciel de
 * fonte, modifié ou non, se distribue **avec le texte de sa licence et sa
 * notice de copyright**. Or les `.woff2` de `src/styles/fonts/` sont
 * empaquetés dans `dist/assets/` et servis à chaque visite, tandis que le
 * `LICENSE-JetBrainsMono.txt` posé à côté d'eux ne sort jamais du dépôt. Sans
 * ce fichier-ci, l'app distribuait une fonte sans sa licence.
 *
 * Le préambule qu'il porte sert une seconde fin : il nomme la licence de
 * l'app et l'adresse de sa source, dans un fichier servi avec elle. L'article
 * 13 de l'AGPL demande qu'un programme accessible par le réseau offre sa
 * source à qui s'en sert, et un `LICENSE` resté sur GitHub ne le fait pas.
 *
 * Il est **produit, jamais écrit à la main** : une seconde liste de licences
 * recopiée à côté du `node_modules` divergerait au premier `npm update`, et
 * c'est celle qu'on ne relit jamais qui resterait fausse. C'est la règle de
 * la version de l'app, lue sur `package.json` et nulle part ailleurs,
 * appliquée ici.
 *
 * La sortie vit dans `public/`, donc Vite la copie dans `dist/` : elle voyage
 * avec la fonte qu'elle couvre, ce qui est exactement ce que l'OFL demande.
 * En `.txt` et non en `.md` : un navigateur affiche l'un et télécharge
 * l'autre, et une licence qu'il faut télécharger pour lire n'est pas mise à
 * disposition.
 *
 * `npm run build` la régénère avant de construire — ce qui part en production
 * est donc à jour par construction. `--check` rejoue la génération sans
 * écrire et échoue si la copie commitée a pris du retard : c'est ce que la CI
 * appelle, pour que le dépôt ne mente pas non plus.
 * ==========================================================================*/

import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const OUT = 'public/licences-tierces.txt'
const APP = 'journal.'

/* L'adresse de la source, lue sur le manifeste et non recopiée : c'est l'offre
   que l'article 13 demande, et une URL fausse dans un fichier servi avec l'app
   serait pire que pas d'URL du tout. Le `git+` et le `.git` sont la forme que
   npm attend, pas celle qu'on ouvre dans un navigateur. */
const REPO_URL = JSON.parse(readFileSync('package.json', 'utf8'))
  .repository.url.replace(/^git\+/, '')
  .replace(/\.git$/, '')

/* La fonte n'arrive pas par npm : ses fichiers sont commités dans le dépôt, le
   texte de sa licence posé à côté d'eux. C'est donc ici qu'on va la chercher,
   et non dans la traversée de `node_modules`. */
const FONT_DIR = 'src/styles/fonts'
const FONT_NAME = 'JetBrains Mono'
const FONT_LICENCE_NAME = 'OFL-1.1'
const FONT_HOMEPAGE = 'https://github.com/JetBrains/JetBrainsMono'
const FONT_LICENCE_FILE = join(FONT_DIR, 'LICENSE-JetBrainsMono.txt')

/* Le nom du fichier de licence n'est normalisé nulle part : chaque paquet
   choisit sa casse, son extension — et son orthographe. On les essaie dans
   l'ordre du plus courant, et on échoue bruyamment plutôt que d'omettre une
   notice. */
const LICENCE_FILES = [
  'LICENSE',
  'LICENSE.md',
  'LICENSE.txt',
  'LICENCE',
  'LICENCE.md',
  'LICENCE.txt',
  'license',
  'license.md',
]

/**
 * Les paquets qui voyagent vraiment.
 *
 * Les `dependencies` du manifeste et, transitivement, les leurs : `react-dom`
 * embarque `scheduler`, `react-router` embarque `cookie-es`. Les
 * `devDependencies` sont exclues — elles construisent l'app, elles ne partent
 * pas avec elle, et les inscrire ferait passer pour distribué ce qui ne l'est
 * pas.
 */
function shippedPackages() {
  const root = JSON.parse(readFileSync('package.json', 'utf8'))
  const found = new Map()

  const visit = (name) => {
    if (found.has(name)) return
    const dir = join('node_modules', name)
    if (!existsSync(join(dir, 'package.json'))) {
      throw new Error(
        `Paquet absent de node_modules : ${name}. Lance « npm ci » d'abord.`,
      )
    }
    const manifest = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'))
    found.set(name, { dir, manifest })
    for (const dependency of Object.keys(manifest.dependencies ?? {})) {
      visit(dependency)
    }
  }

  for (const dependency of Object.keys(root.dependencies ?? {})) visit(dependency)
  return [...found.entries()].sort(([a], [b]) => a.localeCompare(b, 'en'))
}

/**
 * Un texte de licence, ses fins de ligne ramenées au LF.
 *
 * Quelques paquets publient la leur en CRLF. Git, lui, normalise ce
 * fichier-ci en LF au moment de le commiter : sans cette lecture-là, la copie
 * du dépôt et celle que la génération produit ne coïncideraient jamais, et
 * `--check` échouerait sur une différence que personne ne voit à l'écran.
 */
function readText(path) {
  return readFileSync(path, 'utf8').replace(/\r\n/g, '\n').trimEnd()
}

/** Le fichier de licence posé à la racine d'un dossier, s'il y en a un. */
function licenceFileIn(dir) {
  for (const file of LICENCE_FILES) {
    const path = join(dir, file)
    if (existsSync(path)) return readText(path)
  }
  return null
}

function licenceTextOf(dir, name) {
  const own = licenceFileIn(dir)
  /* Aucun repli : une notice manquante est le problème que ce fichier existe
     pour régler, et la remplacer par « voir le paquet » ne la rend pas. */
  if (own === null) {
    throw new Error(`Aucun fichier de licence trouvé pour ${name} dans ${dir}.`)
  }
  return own
}

/** Les fichiers de fonte que la notice OFL couvre, nommés un par un : « la
 *  fonte » est une abstraction, ce sont ces quatre fichiers-là qui partent. */
function fontFiles() {
  const files = readdirSync(FONT_DIR)
    .filter((file) => file.endsWith('.woff2'))
    .sort((a, b) => a.localeCompare(b, 'en'))
  if (files.length === 0) {
    throw new Error(`Aucune fonte dans ${FONT_DIR} : la notice n'aurait rien à couvrir.`)
  }
  return files
}

const RULE = '='.repeat(78)

function render(packages) {
  const fonts = fontFiles()
  const lines = [
    `Licences des composants tiers — ${APP}`,
    RULE,
    '',
    `${APP} est publié sous licence GNU Affero General Public License, version 3`,
    'ou ultérieure. Le texte intégral est dans le fichier LICENSE du dépôt, et la',
    'source complète du programme tel qu’il tourne est ici :',
    '',
    `  ${REPO_URL}`,
    '',
    'Les composants ci-dessous sont l’œuvre de tiers, portent leur propre licence,',
    'et voyagent dans la version publiée de l’app : leur code ou leurs fichiers de',
    'fonte sont servis au navigateur de qui l’ouvre.',
    '',
    `Le premier — la fonte ${FONT_NAME} — est sous SIL Open Font License 1.1,`,
    'qui demande que le logiciel de fonte soit distribué avec sa licence et sa',
    'notice de copyright. C’est la raison première de ce fichier.',
    '',
    'Il est produit par « npm run licences », jamais écrit à la main : « npm run',
    'build » le régénère avant de construire, et « npm run licences:check » échoue',
    's’il a pris du retard.',
    '',
    RULE,
    '',
    `  ${FONT_NAME} — ${FONT_LICENCE_NAME}`,
  ]

  for (const [name, { manifest }] of packages) {
    lines.push(`  ${name} ${manifest.version} — ${manifest.license ?? 'licence non déclarée'}`)
  }

  lines.push(
    '',
    '',
    RULE,
    FONT_NAME,
    `Licence déclarée : ${FONT_LICENCE_NAME}`,
    `Page du projet : ${FONT_HOMEPAGE}`,
    `Fichiers servis : ${fonts.join(', ')}`,
    RULE,
    '',
    readText(FONT_LICENCE_FILE),
    '',
  )

  for (const [name, { dir, manifest }] of packages) {
    lines.push(
      '',
      RULE,
      `${name} ${manifest.version}`,
      `Licence déclarée : ${manifest.license ?? 'non déclarée'}`,
      ...(typeof manifest.homepage === 'string' ? [`Page du projet : ${manifest.homepage}`] : []),
      RULE,
      '',
      licenceTextOf(dir, name),
      '',
    )
  }

  return `${lines.join('\n').trimEnd()}\n`
}

const expected = render(shippedPackages())

if (process.argv.includes('--check')) {
  const actual = existsSync(OUT) ? readFileSync(OUT, 'utf8') : ''
  if (actual !== expected) {
    console.error(
      `${OUT} n’est plus à jour. Lance « npm run licences » et commite le résultat.`,
    )
    process.exit(1)
  }
  console.log(`${OUT} — à jour.`)
} else {
  writeFileSync(OUT, expected)
  console.log(`${OUT} — écrit.`)
}
