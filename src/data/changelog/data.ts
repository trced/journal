/** Le journal des changements, bilingue — la même substance que
 *  CHANGELOG.md. Une entrée publiée n'est jamais réécrite.
 *  La version la plus récente en tête. */

import type { ChangelogVersion } from './types.ts'

export const changelogVersions: ChangelogVersion[] = [
  {
    version: '0.1.0',
    date: '2026-08-17',
    changes: {
      added: [
        {
          category: "l'année",
          categoryEn: 'the year',
          text: "L'année en douze lignes, un point par jour : un point pour une humeur seule, un cercle pour une note, un disque pour un texte, un disque cerclé pour les deux. Douze mois tiennent sur un écran de téléphone sans qu'aucune journée ait à disparaître. La cible tactile n'est jamais le point — c'est la ligne du mois, haute de 44 px, qui ouvre sa grille",
          textEn:
            'The year in twelve rows, one dot per day: a dot for a mood alone, a ring for a note, a disc for text, a ringed disc for both. Twelve months fit on a phone screen without a single day having to disappear. The touch target is never the dot — it is the month row, 44 px tall, that opens its grid',
        },
        {
          category: 'le mois',
          categoryEn: 'the month',
          text: 'Le mois en sept colonnes, une case de 44 px par jour : quantième et marque, et le jour se touche là. Les jours à venir sont posés mais ne sont pas des boutons — il n’y a rien à lire, et on n’écrit pas demain. Les suites de jours écoulés sans une seule trace sont repliées en une ligne sous la grille',
          textEn:
            'The month in seven columns, a 44 px cell per day: the date and its mark, and the day is tapped there. Days still to come are laid out but are not buttons — there is nothing to read, and tomorrow cannot be written. Runs of elapsed days with no mark at all are folded into one row below the grid',
        },
        {
          category: 'le jour',
          categoryEn: 'the day',
          text: "Le jour en plein écran : le texte d'abord, la note ensuite, puis quatre lignes de faits — humeur, mots, lieu, heure d'écriture. Les flèches passent d'un jour écrit au suivant en sautant les jours vides, parce qu'un journal se relit ainsi",
          textEn:
            'The day full screen: the text first, then the note, then four rows of facts — mood, words, place, time written. The arrows step from one written day to the next, skipping the empty ones, because that is how a journal is read',
        },
        {
          category: 'écrire',
          categoryEn: 'writing',
          text: "L'écriture en plein cadre : un texte sans longueur imposée, une note courte, une humeur en un mot parmi quatre, un lieu écrit à la main. Aucun champ n'est obligatoire, et une entrée de quatre mots est une entrée. Le compte de mots remplace l'aide du champ dès la première frappe",
          textEn:
            'Writing takes the whole frame: text with no imposed length, a short note, a mood in one word out of four, a place typed by hand. No field is required, and a four-word entry is an entry. The word count replaces the field’s hint from the first keystroke',
        },
        {
          category: 'le bilan',
          categoryEn: 'the summary',
          text: "Le bilan du mois : série en cours et record, jours écrits et part du mois, mots et mots par jour écrit, les quatre humeurs en filets de longueur relative, jours complets et jour le plus long. La série est une lecture, pas une chaîne à ne pas rompre : rien ne la rappelle, et rien ne prévient quand elle s'arrête",
          textEn:
            'The month’s summary: current run and best run, days written and the share of the month, words and words per day written, the four moods as bars of relative length, full days and the longest day. The run is a reading, not a chain to keep unbroken: nothing reminds you of it, and nothing warns you when it stops',
        },
        {
          category: 'réglages',
          categoryEn: 'settings',
          text: 'Réglages en feuille glissable : thème clair, sombre ou système ; français, anglais ou la langue du système ; semaine commençant le lundi ou le dimanche ; taille du texte relu ; humeur demandée ou non ; note courte ou non. Chaque ligne fait défiler ses valeurs au clic, et masquer un champ n’efface rien — ce qui a été écrit reste dans le fichier',
          textEn:
            'Settings in a draggable sheet: light, dark or system theme; French, English or the system language; week starting Monday or Sunday; reading text size; mood asked or not; short note or not. Each row cycles its values on click, and hiding a field erases nothing — whatever was written stays in the file',
        },
        {
          category: 'données',
          categoryEn: 'data',
          text: "Export et import du fichier journal.json, avec un choix entre fusionner et remplacer, et un effacement complet derrière une confirmation explicite. Fusionner n'écrase jamais un jour déjà écrit : deux appareils qui ont raconté le même 12 août n'ont pas écrit la même chose, et le programme n'a aucun moyen de choisir",
          textEn:
            'Export and import of the journal.json file, with a choice between merging and replacing, and a full erase behind an explicit confirmation. Merging never overwrites a day you have already written: two devices that told the same 12 August did not write the same thing, and the program has no way to choose',
        },
        {
          category: 'données',
          categoryEn: 'data',
          text: "Export en texte brut : un fichier, une entrée par jour, dans la langue de l'interface. Un journal doit pouvoir se relire sans le programme qui l'a écrit",
          textEn:
            'Plain-text export: one file, one entry per day, in the language of the interface. A journal must be readable without the program that wrote it',
        },
        {
          category: 'données',
          categoryEn: 'data',
          text: "« Envoyer vers » : le partage natif de l'appareil quand il sait recevoir un fichier, un téléchargement sinon. Le fichier ne quitte l'appareil que par ce geste, vers l'application choisie. Le projet n'a aucun serveur pour le recevoir",
          textEn:
            '“Send to”: the device’s native share when it can take a file, a download otherwise. The file only leaves the device through that gesture, towards the app you pick. The project has no server to receive it',
        },
        {
          text: 'Application web installable et utilisable hors ligne : tout est précaché au téléchargement, et il n’y a aucune requête réseau à l’usage',
          textEn:
            'Installable, offline-capable progressive web app: everything is precached on download, and there is no network request in use',
        },
        {
          text: 'Site de présentation en français et en anglais : page d’accueil avec l’application réelle incrustée, à propos, conditions d’utilisation, confidentialité, mentions légales et journal des changements',
          textEn:
            'Presentation site in French and English: home page with the real app embedded, about page, terms of use, privacy, legal notice and changelog',
        },
        {
          text: 'Mode exemple accessible depuis la présentation : une année remplie, calculée depuis aujourd’hui et tirée d’une graine fixe, qui n’écrit rien sur l’appareil',
          textEn:
            'Example mode reachable from the overview: a filled year, computed from today out of a fixed seed, writing nothing to the device',
        },
        {
          category: 'design system',
          categoryEn: 'design system',
          text: 'Le design system de la famille « . » 1.2.0 en tokens CSS : couleur, typographie, espace, forme, mouvement, et les composants partagés — bouton, champ, ligne de réglage, feuille, navigation de période, ligne de statistique, retours',
          textEn:
            'The “famille .” 1.2.0 design system as CSS tokens: colour, typography, space, shape, motion, and the shared components — button, field, setting row, sheet, period navigation, stat row, feedback',
        },
        {
          category: 'accessibilité',
          categoryEn: 'accessibility',
          text: 'Chaque case de mois est un bouton nommé en entier — « 12 août 2026, texte et note, ouvrir » — parce qu’une forme de trois pixels ne s’annonce pas. Cibles de 44 × 44 partout, anneau de focus visible de 2 px, focus piégé dans les feuilles puis restitué, flèches pour changer de période, T pour revenir à aujourd’hui, Échap pour refermer',
          textEn:
            'Every month cell is a button named in full — “12 August 2026, text and note, open” — because a three-pixel shape announces nothing. 44 × 44 targets everywhere, a visible 2 px focus ring, focus trapped in sheets then given back, arrows to change period, T to return to today, Escape to close',
        },
        {
          category: 'tests',
          categoryEn: 'tests',
          text: 'Tests unitaires de la couche pure — dates, grilles d’année et de mois, creux, séries, comptes, humeurs, import, fusion, stockage — et tests d’intégration des chemins réels : écrire une journée, la relire, la modifier, la supprimer',
          textEn:
            'Unit tests over the pure layer — dates, year and month grids, gaps, runs, counts, moods, import, merge, storage — and integration tests of the real paths: write a day, read it back, edit it, delete it',
        },
      ],
    },
  },
]
