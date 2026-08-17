/** Dictionnaire français — référence. en.ts en est le miroir typé :
 *  une clé manquante ou en trop échoue à la compilation.
 *  Convention de clé : domaine.composant.clé. */

export const fr = {
  // ————— commun —————
  'common.brand': 'journal.',
  'common.tagline': 'une chose. bien faite.',
  'common.close': 'fermer',
  'common.cancel': 'annuler',
  'common.skipToContent': 'aller au contenu',

  // ————— vocabulaire des traces —————
  // Une marque par jour, la plus forte. Les mots sont ceux de la légende :
  // ils décrivent ce qu'on voit, pas ce qu'on vaut.
  'trace.mood': 'humeur',
  'trace.note': 'note',
  'trace.text': 'texte',
  'trace.full': 'texte + note',
  'trace.none': 'rien',
  'trace.moodShape': 'un point',
  'trace.noteShape': 'un cercle',
  'trace.textShape': 'un disque',
  'trace.fullShape': 'un disque cerclé',

  // ————— humeurs —————
  // Quatre mots, aucune échelle : « clair » n'est pas mieux que « bas », et
  // rien dans l'application ne les additionne.
  'mood.clear': 'clair',
  'mood.even': 'égal',
  'mood.dense': 'dense',
  'mood.low': 'bas',
  'mood.none': 'aucune',

  // ————— application · navigation —————
  'app.nav.home': "revenir à aujourd'hui",
  'app.nav.views': 'Vues',
  'app.nav.year': 'année',
  'app.nav.month': 'mois',
  'app.nav.stats': 'bilan',
  'app.nav.settings': 'réglages',
  'app.nav.autosave': 'enregistré automatiquement',

  // ————— application · mode exemple —————
  'app.demo.label': 'exemple',
  'app.demo.note': "rien n'est enregistré sur cet appareil",
  'app.demo.leave': 'ouvrir mon journal',
  // Les entrées de la démonstration : des journées ordinaires, rien de
  // remarquable. Un journal n'est pas un récit d'exploits.
  'app.demo.text1':
    "Marché de bon matin, deux pêches trop mûres mangées debout. Ensuite deux heures à relire les notes de juin sans rien y changer. Le vent s'est levé vers dix-huit heures et j'ai fermé les fenêtres une par une, et la maison est redevenue silencieuse d'un coup.",
  'app.demo.text2':
    "Réveil avant l'aube sans raison. J'ai écrit trois lignes puis je suis ressorti marcher jusqu'au canal, où il n'y avait personne. Le reste de la journée s'est passé à répondre à des messages en retard.",
  'app.demo.text3':
    "Longue conversation avec R. au téléphone, plus d'une heure. On a parlé de son déménagement, du bruit, de ce qu'elle ne dit pas encore. J'ai raccroché en me disant qu'il fallait rappeler plus souvent.",
  'app.demo.text4':
    "Journée entière sur le même paragraphe. Rien n'en est sorti, et pourtant je crois avoir compris ce qui n'allait pas. Soir tranquille, riz et un vieux film que je connais par cœur.",
  'app.demo.text5':
    "Il a plu sans discontinuer. J'ai rangé les papiers d'assurance, changé une ampoule, jeté deux cartons. Ces journées-là ne racontent rien mais elles allègent.",
  'app.demo.text6':
    "Retour de la bibliothèque avec quatre livres dont je ne lirai probablement qu'un. En sortant j'ai croisé le voisin du dessus qui m'a raconté sa semaine sur le trottoir, vingt minutes debout, et je n'ai pas trouvé cela long.",
  'app.demo.note1': 'Rappeler Claire avant vendredi.',
  'app.demo.note2': "Reprendre le paragraphe du milieu, il ne tient pas.",
  'app.demo.note3': 'Acheter du café.',
  'app.demo.note4': 'Ne pas oublier le rendez-vous de mardi.',
  'app.demo.place1': 'Paris 19ᵉ',
  'app.demo.place2': 'à la maison',
  'app.demo.place3': 'train de nuit',

  // ————— application · année —————
  'app.year.prevAria': 'année précédente',
  'app.year.nextAria': 'année suivante',
  'app.year.hint': "revenir à l'année en cours",
  'app.year.caption': '{written} / {total}',
  'app.year.captionAway': '{written} / {total} · revenir',
  // « août 2026, 12 jours écrits, ouvrir le mois »
  'app.year.rowAria': '{month} {year}, {days}, ouvrir le mois',
  'app.year.rowDays.one': '{n} jour écrit',
  'app.year.rowDays.other': '{n} jours écrits',
  'app.year.legendNote': 'toucher une ligne de mois pour ouvrir sa grille.',
  'app.year.writeToday': "+ écrire aujourd'hui",
  'app.year.writtenToday': "relire aujourd'hui",
  'app.year.grid': 'Année {year}, un point par jour',

  // ————— application · mois —————
  'app.month.prevAria': 'mois précédent',
  'app.month.nextAria': 'mois suivant',
  'app.month.hint': 'revenir au mois en cours',
  'app.month.caption.one': '{n} jour sur {total}',
  'app.month.caption.other': '{n} jours sur {total}',
  'app.month.grid': 'Mois de {month} {year}',
  // « 12 août 2026, texte et note, ouvrir »
  'app.month.dayAria': '{date}, {trace}, ouvrir',
  'app.month.dayAriaEmpty': '{date}, rien écrit, écrire',
  'app.month.dayAriaFuture': '{date}, à venir',
  'app.month.legendNote': 'chaque case fait 44 px : c’est le jour qu’on touche ici.',
  'app.month.gap.one': '{n} jour sans rien · {range}',
  'app.month.gap.other': '{n} jours sans rien · {range}',
  'app.month.gapRange': 'du {from} au {to}',
  'app.month.gapDay': 'le {from}',
  'app.month.openToday': 'ouvrir le {date}',

  // ————— application · jour —————
  'app.day.back': '‹ {month}',
  'app.day.label': 'jour',
  'app.day.ofYear': 'jour {n}',
  'app.day.streak.one': '{n}ᵉʳ jour de suite',
  'app.day.streak.other': '{n}ᵉ jour de suite',
  'app.day.complete': 'jour complet',
  'app.day.text': 'texte',
  'app.day.note': 'note',
  'app.day.mood': 'humeur',
  'app.day.words': 'mots',
  'app.day.place': 'lieu',
  'app.day.writtenAt': 'écrit à',
  'app.day.edit': 'modifier',
  'app.day.write': 'écrire cette journée',
  'app.day.prev': '‹ {date}',
  'app.day.next': '{date} ›',
  'app.day.prevAria': 'jour écrit précédent : {date}',
  'app.day.nextAria': 'jour écrit suivant : {date}',
  'app.day.emptyTitle': 'Rien pour ce jour.',
  'app.day.emptyBody':
    'Un jour sans entrée reste un jour sans entrée. Vous pouvez l’écrire maintenant, ou plus tard.',
  'app.day.emptyNote': "Les jours à venir ne s'écrivent pas d'avance.",

  // ————— application · écrire —————
  'app.entry.today': "aujourd'hui",
  'app.entry.titleOther': 'écrire',
  'app.entry.editTitle': 'modifier',
  'app.entry.back': '‹ annuler',
  'app.entry.draft': 'rien n’est écrit avant d’enregistrer',
  'app.entry.text': 'texte',
  'app.entry.textHint': 'jamais de longueur imposée.',
  'app.entry.textHintWords.one': '{n} mot',
  'app.entry.textHintWords.other': '{n} mots',
  'app.entry.note': 'note',
  'app.entry.noteHint': 'ce que vous vous rappelez à vous-même.',
  'app.entry.mood': 'humeur',
  'app.entry.place': 'lieu',
  'app.entry.placeHint': 'écrit à la main · aucune localisation n’est demandée.',
  'app.entry.clear': 'effacer la note',
  'app.entry.save': 'enregistrer la journée',
  'app.entry.saveEmpty': 'rien à enregistrer',
  'app.entry.discard': 'jeter le brouillon',
  'app.entry.delete': 'supprimer cette journée',
  'app.entry.deleteAsk': 'Supprimer l’entrée du {date} ?',
  'app.entry.deleteBody.one':
    'Son texte — {n} mot — sera effacé. Exportez d’abord si vous voulez le garder.',
  'app.entry.deleteBody.other':
    'Son texte — {n} mots — sera effacé. Exportez d’abord si vous voulez le garder.',
  'app.entry.deleteConfirm': 'supprimer définitivement',

  // ————— application · bilan —————
  'app.stats.streak': 'série en cours',
  'app.stats.streakValue.one': '{n} jour',
  'app.stats.streakValue.other': '{n} jours',
  'app.stats.streakSince': 'depuis le {date}',
  'app.stats.streakNone': 'aucune journée écrite en ce moment',
  'app.stats.streakRecord.one': 'record {n}',
  'app.stats.streakRecord.other': 'record {n}',
  'app.stats.written': 'jours écrits',
  'app.stats.writtenShare': '{percent} % du mois',
  'app.stats.writtenYear': '{n} dans l’année',
  'app.stats.words': 'mots',
  'app.stats.wordsPerDay': '{n} par jour écrit',
  'app.stats.moods': 'humeurs du mois',
  'app.stats.moodsNone': 'aucune humeur notée ce mois-ci.',
  'app.stats.complete': 'jours complets',
  'app.stats.longest': 'jour le plus long',
  'app.stats.longestValue': '{date} · {n} mots',
  'app.stats.empty': '—',
  'app.stats.note':
    'La série est une lecture, pas une chaîne à ne pas rompre. Rien ne vous la rappellera.',

  // ————— application · état vide —————
  'app.first.legend': 'l’année se lit d’un coup d’œil',
  'app.first.facts': 'gratuit · sans compte · tout en local · sans pub',
  'app.first.import': 'importer un journal existant',
  'app.empty.action': 'écrire le premier jour',

  // ————— application · réglages —————
  'app.settings.title': 'réglages',
  'app.settings.display': 'affichage',
  'app.settings.writing': 'écriture',
  'app.settings.data': 'données — locales, jamais envoyées',
  'app.settings.about': 'à propos',
  'app.settings.cycleAria': '{name} : {value}, changer',
  'app.settings.displayNote':
    "Chaque ligne fait défiler ses valeurs. Le changement s'applique immédiatement.",
  'app.settings.grabNote': 'glisser la poignée vers le bas pour refermer.',

  'app.settings.theme': 'thème',
  'app.settings.theme.system': 'système',
  'app.settings.theme.light': 'clair',
  'app.settings.theme.dark': 'sombre',

  'app.settings.lang': 'langue',
  'app.settings.lang.system': 'système',
  'app.settings.lang.fr': 'français',
  'app.settings.lang.en': 'english',

  'app.settings.firstDay': 'premier jour',
  'app.settings.firstDay.monday': 'lundi',
  'app.settings.firstDay.sunday': 'dimanche',

  'app.settings.textSize': 'taille du texte relu',
  'app.settings.textSize.small': 'petite',
  'app.settings.textSize.medium': 'moyenne',
  'app.settings.textSize.large': 'grande',

  'app.settings.mood': 'humeur demandée',
  'app.settings.mood.asked': 'oui',
  'app.settings.mood.hidden': 'non',

  'app.settings.note': 'note courte',
  'app.settings.note.asked': 'oui',
  'app.settings.note.hidden': 'non',

  'app.settings.writingNote':
    "Un champ masqué n'efface rien : ce qui a déjà été écrit reste dans le fichier et se relit.",

  'app.settings.export': 'exporter',
  'app.settings.exportValue': '{file}',
  'app.settings.exportText': 'exporter en texte',
  'app.settings.exportTextValue.one': '{n} entrée, un fichier',
  'app.settings.exportTextValue.other': '{n} entrées, un fichier',
  'app.settings.send': 'envoyer vers',
  'app.settings.sendValue': 'partager le fichier',
  'app.settings.import': 'importer',
  'app.settings.importValue': 'choisir un fichier',
  'app.settings.importNote':
    "L'import vérifie le schéma et prévient avant tout remplacement. Fusionner n'écrase jamais un jour déjà écrit.",
  'app.settings.importFound.one': '{file} — {n} entrée',
  'app.settings.importFound.other': '{file} — {n} entrées',
  'app.settings.importExplainEmpty':
    'Votre journal est vide : fusionner et remplacer donnent le même résultat.',
  'app.settings.importExplain.one':
    'Fusionner ajoute les jours qui manquent ; remplacer efface votre entrée.',
  'app.settings.importExplain.other':
    'Fusionner ajoute les jours qui manquent ; remplacer efface vos {n} entrées.',
  'app.settings.merge': 'fusionner',
  'app.settings.replace': 'remplacer',

  'app.settings.erase': 'tout effacer',
  'app.settings.eraseValue.one': '{n} entrée',
  'app.settings.eraseValue.other': '{n} entrées',
  'app.settings.eraseAsk.one': 'Effacer {n} entrée ?',
  'app.settings.eraseAsk.other': 'Effacer {n} entrées ?',
  'app.settings.eraseBody':
    "Cette action est définitive. Exportez d'abord si vous voulez en garder une trace.",
  'app.settings.eraseConfirm': 'tout effacer',

  'app.settings.storageNote.one':
    '{n} entrée enregistrée sur cet appareil, et nulle part ailleurs.',
  'app.settings.storageNote.other':
    '{n} entrées enregistrées sur cet appareil, et nulle part ailleurs.',
  'app.settings.storageUnavailable':
    "Ce navigateur refuse le stockage local : la session fonctionne, mais rien ne sera retrouvé au prochain lancement. L'export reste possible.",

  'app.settings.aboutApp': 'à propos',
  'app.settings.aboutValue': 'ce que fait journal.',
  'app.settings.changelog': 'journal des changements',
  'app.settings.changelogValue': 'voir',
  'app.settings.version': 'version',
  'app.settings.legal': 'mentions et confidentialité',
  'app.settings.read': 'lire',
  'app.settings.licence': 'licence',
  'app.settings.source': 'code source',
  'app.settings.sourceValue': 'github',
  'app.settings.offline': 'hors ligne · installable',

  // ————— application · export en texte —————
  'app.text.title': 'journal',
  'app.text.mood': 'humeur',
  'app.text.note': 'note',
  'app.text.place': 'lieu',
  'app.text.writtenAt': 'écrit à',
  'app.text.words': 'mots',

  // ————— application · import —————
  'app.import.errorTitle': "Ce fichier n'a pas pu être lu.",
  'app.import.errorUnreadable':
    "Le contenu n'est pas du JSON. Choisissez le fichier journal.json exporté depuis l'application.",
  'app.import.errorSchema':
    "Le fichier est du JSON, mais pas un export journal. Vérifiez que c'est bien celui que vous vouliez.",
  'app.import.errorVersion':
    "Ce fichier vient d'une autre version du format. Exportez-le à nouveau depuis l'application qui l'a produit.",
  'app.import.errorEmpty': 'Le fichier ne contient aucune entrée à importer.',
  'app.import.retry': 'choisir un autre fichier',

  // ————— application · confirmations passagères —————
  'app.flash.saved': 'journée du {date} enregistrée',
  'app.flash.deleted': 'entrée du {date} supprimée',
  'app.flash.discarded': 'brouillon jeté',
  'app.flash.exported.one': '{n} entrée exportée',
  'app.flash.exported.other': '{n} entrées exportées',
  'app.flash.exportedText': 'journal exporté en texte',
  'app.flash.shared': 'fichier envoyé',
  'app.flash.imported.one': '{n} entrée importée',
  'app.flash.imported.other': '{n} entrées importées',
  'app.flash.importedNone': 'tout était déjà là',
  'app.flash.replaced.one': '{n} entrée en place',
  'app.flash.replaced.other': '{n} entrées en place',
  'app.flash.erased': 'journal effacé',

  // ————— site · charpente —————
  'site.nav.home': 'présentation',
  'site.nav.about': 'à propos',
  'site.nav.changelog': 'journal',
  'site.nav.app': "ouvrir l'application",
  'site.nav.source': 'code source',
  'site.nav.lang': 'EN',
  'site.nav.langAria': 'switch to English',
  'site.footer.project': 'projet',
  'site.footer.repo': 'dépôt',
  'site.footer.releases': 'versions',
  'site.footer.issues': 'signaler',
  'site.footer.about': 'à propos',
  'site.footer.changelog': 'journal des changements',
  'site.footer.licence': 'licence',
  'site.footer.licenceName': 'AGPL-3.0-or-later',
  'site.footer.contribute': 'contribuer',
  'site.footer.licenceNote':
    'Code ouvert. Toute version modifiée mise à disposition doit l’être aussi.',
  'site.footer.legal': 'légal',
  'site.footer.terms': "conditions d'utilisation",
  'site.footer.privacy': 'confidentialité',
  'site.footer.notice': 'mentions légales',
  'site.footer.contact': 'contact',
  'site.footer.version': 'version {version}',

  // ————— site · accueil —————
  'site.home.metaTitle': 'journal. — une année, un jour à la fois',
  'site.home.metaDescription':
    "journal. répond à une seule question : qu'est-ce que j'ai vécu ce jour-là ? Journal quotidien local, hors ligne, sans compte.",
  'site.home.title': 'Une année, un jour à la fois.',
  'site.home.lede':
    "Chaque soir, une entrée : ce que vous écrivez, une note courte, une humeur. L'année se lit d'un coup d'œil, un point par jour. Rien à cocher, rien à gagner.",
  'site.home.cta': "ouvrir l'application",
  'site.home.ctaNote': "aucun compte — l'application s'ouvre directement",
  'site.home.demo': 'voir un exemple rempli',
  'site.home.demoNote': "rien n'est enregistré sur votre appareil",
  'site.home.previewCaption': "L'application réelle, avec une année d'exemple.",
  'site.home.app': "l'application",
  'site.home.appBody':
    "Ce n'est pas une capture d'écran : c'est l'application, remplie d'une année d'exemple. Ouvrez un mois, lisez un jour, écrivez-en un — rien de ce que vous ferez ici n'est enregistré.",
  'site.home.appHint.year': 'toucher une ligne de mois ouvre sa grille',
  'site.home.appHint.month': 'toucher une case ouvre le jour',
  'site.home.appHint.day': '« modifier » rouvre la journée en écriture',
  'site.home.appHint.settings': 'les réglages changent le thème et la langue',
  'site.home.ready': 'Prêt à commencer ?',
  'site.home.readyNote': 'Un jour suffit. Le reste de l’année attendra.',
  'site.home.start': "ouvrir l'application",

  'site.home.loop': 'la boucle',
  'site.home.loop.write': 'écrire',
  'site.home.loop.writeBody':
    'le soir, une entrée. Trois lignes ou trois pages, personne ne compte.',
  'site.home.loop.mark': 'marquer',
  'site.home.loop.markBody':
    'une humeur en un mot, une note à ne pas oublier. Les deux sont facultatives.',
  'site.home.loop.look': 'regarder',
  'site.home.loop.lookBody':
    "l'année en douze lignes, un point par jour. Les trous se voient, et c'est le propos.",

  'site.home.rules': 'ce que journal. ne fait pas',
  'site.home.rule.notify': 'aucune notification, aucun rappel du soir',
  'site.home.rule.score': 'aucun score, aucune moyenne d’humeur',
  'site.home.rule.prompt': 'aucune question du jour, aucun exercice imposé',
  'site.home.rule.ai': 'aucun résumé automatique, aucune analyse de vos textes',
  'site.home.rule.account': 'aucun compte, aucune synchronisation',
  'site.home.rule.track': 'aucun traceur, aucune publicité',
  'site.home.rulesNote':
    "Un jour non écrit n'est pas un échec. C'est un jour non écrit.",

  'site.home.facts': 'en bref',
  'site.home.fact.unit': 'unité',
  'site.home.fact.unitValue': 'un jour, une entrée : un texte, une note, une humeur',
  'site.home.fact.views': 'vues',
  'site.home.fact.viewsValue': "l'année · le mois · le jour · le bilan",
  'site.home.fact.data': 'données',
  'site.home.fact.dataValue':
    'sur votre appareil, export en JSON et en texte brut',
  'site.home.fact.langs': 'langues',
  'site.home.fact.langsValue': 'français, anglais, ou celle du système',
  'site.home.fact.install': 'installation',
  'site.home.fact.installValue': 'application web, hors ligne une fois chargée',
  'site.home.fact.licence': 'licence',
  'site.home.fact.licenceValue': 'AGPL-3.0-or-later, code source ouvert',

  // ————— site · à propos —————
  'site.about.metaTitle': 'à propos — journal.',
  'site.about.metaDescription':
    'Pourquoi journal. montre l’année entière et refuse les rappels, les scores et l’analyse automatique.',
  'site.about.title': 'À propos',
  'site.about.lede':
    "journal. fait partie d'une famille de micro-applications qui répondent chacune à une question, et à une seule.",
  'site.about.whyTitle': "Pourquoi l'année entière",
  'site.about.whyBody':
    "Un journal se tient sur des années, et ce qu'on veut voir n'est pas la dernière entrée : c'est la forme de l'ensemble. Douze lignes, un point par jour, et l'année tient sur un écran de téléphone sans rien réduire à l'illisible. Les mois pleins et les mois vides se lisent côte à côte, sans qu'aucun chiffre ait à les commenter. Le mois s'ouvre en grille, le jour s'ouvre en texte : trois profondeurs, deux gestes.",
  'site.about.noTitle': 'Ce qui a été laissé de côté',
  'site.about.noBody':
    "Pas de rappel du soir : une application qui réclame son entrée transforme un journal en devoir, et le jour où l'on cède au rappel plutôt qu'à l'envie, ce qui est écrit ne vaut plus rien. Pas de moyenne d'humeur non plus, ni de courbe : quatre mots ne font pas une échelle, et une humeur n'est pas une mesure. Et aucune analyse automatique de vos textes — ce que vous écrivez n'a pas à être relu par un programme.",
  'site.about.dataTitle': 'Vos données',
  'site.about.dataBody':
    "Tout est enregistré dans le stockage local de votre navigateur. Il n'y a pas de serveur, pas de compte, pas de synchronisation — donc rien à intercepter. Le fichier journal.json que vous exportez contient l'intégralité de ce que l'application sait de vous, et l'export en texte brut se relit dans n'importe quel éditeur, sans ce programme.",
  'site.about.familyTitle': 'La famille',
  'site.about.familyBody':
    "Même design system, mêmes principes : monospace, angles droits, aucune illustration, aucun emoji. Ce qui compte est ce qui est écrit — et ici, plus qu'ailleurs.",
  'site.about.openTitle': 'Code ouvert',
  'site.about.openBody':
    "journal. est publié sous licence AGPL-3.0-or-later. Le code est lisible, modifiable et redistribuable ; toute version modifiée mise à disposition d'autrui doit l'être aussi.",

  // ————— site · journal des changements —————
  'site.changelog.metaTitle': 'journal des changements — journal.',
  'site.changelog.metaDescription':
    'Ce qui a changé dans journal., version par version.',
  'site.changelog.title': 'Journal des changements',
  'site.changelog.lede':
    "Chaque version et ce qu'elle apporte. Les entrées publiées ne sont jamais réécrites.",
  'site.changelog.type.added': 'ajouté',
  'site.changelog.type.changed': 'modifié',
  'site.changelog.type.fixed': 'corrigé',
  'site.changelog.type.performance': 'performance',

  // ————— site · pages légales —————
  'site.legal.terms.metaTitle': "conditions d'utilisation — journal.",
  'site.legal.terms.metaDescription':
    "Les conditions d'utilisation de journal. : un logiciel libre fourni tel quel, sans compte ni service distant.",
  'site.legal.terms.title': "Conditions d'utilisation",
  'site.legal.terms.updated': 'Dernière mise à jour : {date}',
  'site.legal.terms.serviceTitle': 'Ce que vous utilisez',
  'site.legal.terms.serviceBody':
    "journal. est un logiciel qui s'exécute entièrement dans votre navigateur. Il n'y a ni compte, ni abonnement, ni service distant : rien n'est transmis, donc il n'y a rien à louer et rien à résilier.",
  'site.legal.terms.dataTitle': 'Vos données vous appartiennent',
  'site.legal.terms.dataBody':
    "Vos entrées sont enregistrées dans le stockage local de votre navigateur. Effacer les données du site les supprime définitivement. Exportez régulièrement le fichier journal.json si vous tenez à votre journal : personne d'autre n'en détient de copie.",
  'site.legal.terms.warrantyTitle': 'Aucune garantie',
  'site.legal.terms.warrantyBody':
    "Le logiciel est fourni « tel quel », sans garantie d'aucune sorte, dans les limites permises par la loi. Les auteurs ne peuvent être tenus responsables d'une perte de données, quelle qu'en soit la cause.",
  'site.legal.terms.licenceTitle': 'Licence',
  'site.legal.terms.licenceBody':
    "journal. est distribué sous licence GNU AGPL version 3 ou ultérieure. Vous pouvez l'utiliser, l'étudier, le modifier et le redistribuer dans le respect de cette licence.",

  'site.legal.privacy.metaTitle': 'confidentialité — journal.',
  'site.legal.privacy.metaDescription':
    "journal. ne collecte aucune donnée : ni compte, ni serveur, ni traceur, ni mesure d'audience.",
  'site.legal.privacy.title': 'Confidentialité',
  'site.legal.privacy.updated': 'Dernière mise à jour : {date}',
  'site.legal.privacy.shortTitle': 'En une phrase',
  'site.legal.privacy.shortBody':
    "journal. ne collecte rien, n'envoie rien et ne dépose aucun traceur. Vos textes ne sont lus par personne, et par aucun programme distant.",
  'site.legal.privacy.collectTitle': 'Ce qui est collecté',
  'site.legal.privacy.collectBody':
    "Rien. Aucun compte, aucun identifiant, aucune adresse, aucune mesure d'audience, aucun cookie publicitaire. L'application ne fait aucune requête réseau à l'usage : une fois la page chargée, elle fonctionne hors ligne.",
  'site.legal.privacy.storedTitle': 'Ce qui est enregistré, et où',
  'site.legal.privacy.storedBody':
    "Vos entrées — texte, note, humeur, lieu, heure — et vos réglages, dans le stockage local de votre navigateur, sur votre appareil. Ces données ne quittent l'appareil que si vous exportez le fichier vous-même.",
  'site.legal.privacy.hostTitle': 'Hébergement',
  'site.legal.privacy.hostBody':
    "Les fichiers de l'application sont servis par un hébergeur statique, qui peut conserver des journaux techniques de connexion pour la sécurité de son service. Ces journaux ne sont ni exploités ni consultés par le projet.",
  'site.legal.privacy.rightsTitle': 'Vos droits',
  'site.legal.privacy.rightsBody':
    "Puisqu'aucune donnée personnelle n'est collectée par le projet, il n'y a rien à demander ni à faire supprimer. Vous gardez à tout moment la maîtrise de vos données : Réglages → exporter, ou tout effacer.",

  'site.legal.notice.metaTitle': 'mentions légales — journal.',
  'site.legal.notice.metaDescription':
    'Éditeur, hébergement et licence de journal.',
  'site.legal.notice.title': 'Mentions légales',
  'site.legal.notice.editorTitle': 'Éditeur',
  'site.legal.notice.editorBody':
    'journal. est un projet libre, publié par ses auteurs sans structure commerciale. Contact : {contact}.',
  'site.legal.notice.hostTitle': 'Hébergement',
  'site.legal.notice.hostBody':
    "Le site est publié comme un ensemble de fichiers statiques. L'hébergeur retenu ne dispose d'aucune base de données du projet.",
  'site.legal.notice.propertyTitle': 'Propriété intellectuelle',
  'site.legal.notice.propertyBody':
    'Le code source est disponible sous licence AGPL-3.0-or-later. Les textes que vous écrivez restent les vôtres et ne sont jamais transmis au projet.',

  // ————— site · page absente —————
  'site.notfound.metaTitle': 'page introuvable — journal.',
  'site.notfound.metaDescription': 'Cette adresse ne correspond à aucune page.',
  'site.notfound.title': 'Cette page n’existe pas.',
  'site.notfound.body':
    "L'adresse est peut-être incomplète, ou la page a été retirée.",
  'site.notfound.action': 'revenir à la présentation',

  // ————— mise à jour —————
  // La version en attente ne s'installe pas d'elle-même : le bandeau annonce,
  // il ne prévient pas d'un fait accompli. Ici plus qu'ailleurs — un
  // rechargement au milieu d'une entrée emporterait la journée.
  'update.available': 'Une nouvelle version est prête.',
  'update.action': 'recharger',
} as const

export type MessageKey = keyof typeof fr
