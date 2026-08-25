/** English dictionary — a typed mirror of fr.ts.
 *  A missing or extra key fails the build. */

import type { MessageKey } from './fr.ts'

export const en: Record<MessageKey, string> = {
  // ————— common —————
  'common.brand': 'journal.',
  'common.tagline': 'one thing. done well.',
  'common.close': 'close',
  'common.cancel': 'cancel',
  'common.skipToContent': 'skip to content',

  // ————— the marks —————
  'trace.mood': 'mood',
  'trace.note': 'note',
  'trace.text': 'text',
  'trace.full': 'text + note',
  'trace.none': 'nothing',
  'trace.moodShape': 'a dot',
  'trace.noteShape': 'a ring',
  'trace.textShape': 'a disc',
  'trace.fullShape': 'a ringed disc',

  // ————— moods —————
  'mood.clear': 'clear',
  'mood.even': 'even',
  'mood.dense': 'dense',
  'mood.low': 'low',
  'mood.none': 'none',

  // ————— app · navigation —————
  'app.nav.home': 'back to today',
  'app.nav.views': 'Views',
  'app.nav.year': 'year',
  'app.nav.month': 'month',
  'app.nav.stats': 'summary',
  'app.nav.settings': 'settings',
  'app.nav.autosave': 'saved automatically',

  // ————— app · example mode —————
  'app.demo.label': 'example',
  'app.demo.note': 'nothing is saved on this device',
  'app.demo.leave': 'open my journal',
  'app.demo.text1':
    'Market early, two overripe peaches eaten standing up. Then two hours rereading June’s notes without changing a word. The wind picked up around six and I shut the windows one by one, and the house went quiet all at once.',
  'app.demo.text2':
    'Awake before dawn for no reason. Wrote three lines, then went back out and walked to the canal, where there was nobody. The rest of the day went to answering late messages.',
  'app.demo.text3':
    'Long phone call with R., over an hour. We talked about the move, the noise, and what she isn’t saying yet. Hung up thinking I should call more often.',
  'app.demo.text4':
    'A whole day on the same paragraph. Nothing came of it, and yet I think I understood what was wrong. Quiet evening, rice and an old film I know by heart.',
  'app.demo.text5':
    'It rained without stopping. Filed the insurance papers, changed a bulb, threw out two boxes. Days like this tell no story, but they lighten the load.',
  'app.demo.text6':
    'Back from the library with four books, of which I will probably read one. On the way out I ran into the upstairs neighbour, who told me about his week on the pavement, twenty minutes standing, and it did not feel long.',
  'app.demo.note1': 'Call Claire before Friday.',
  'app.demo.note2': 'Take the middle paragraph again, it doesn’t hold.',
  'app.demo.note3': 'Buy coffee.',
  'app.demo.note4': 'Don’t forget Tuesday’s appointment.',
  'app.demo.place1': 'Paris 19th',
  'app.demo.place2': 'at home',
  'app.demo.place3': 'night train',

  // ————— app · the year —————
  'app.year.prevAria': 'previous year',
  'app.year.nextAria': 'next year',
  'app.year.hint': 'back to the current year',
  'app.year.caption': '{written} / {total}',
  'app.year.captionAway': '{written} / {total} · back',
  'app.year.rowAria': '{month} {year}, {days}, open the month',
  'app.year.rowDays.one': '{n} day written',
  'app.year.rowDays.other': '{n} days written',
  'app.year.legendNote': 'tap a month row to open its grid.',
  'app.year.writeToday': '+ write today',
  'app.year.writtenToday': 'read today again',
  'app.year.grid': '{year}, one dot per day',

  // ————— app · the month —————
  'app.month.prevAria': 'previous month',
  'app.month.nextAria': 'next month',
  'app.month.hint': 'back to the current month',
  'app.month.caption.one': '{n} day of {total}',
  'app.month.caption.other': '{n} days of {total}',
  'app.month.grid': '{month} {year}',
  'app.month.dayAria': '{date}, {trace}, open',
  'app.month.dayAriaEmpty': '{date}, nothing written, write',
  'app.month.dayAriaFuture': '{date}, still to come',
  'app.month.legendNote': 'every cell is 44 px: the day is what you tap here.',
  'app.month.gap.one': '{n} day with nothing · {range}',
  'app.month.gap.other': '{n} days with nothing · {range}',
  'app.month.gapRange': '{from} to {to}',
  'app.month.gapDay': 'on {from}',
  'app.month.openToday': 'open {date}',

  // ————— app · the day —————
  'app.day.back': '‹ {month}',
  'app.day.label': 'day',
  'app.day.ofYear': 'day {n}',
  'app.day.streak.one': 'day {n} in a row',
  'app.day.streak.other': 'day {n} in a row',
  'app.day.complete': 'a full day',
  'app.day.text': 'text',
  'app.day.note': 'note',
  'app.day.mood': 'mood',
  'app.day.words': 'words',
  'app.day.place': 'place',
  'app.day.writtenAt': 'written at',
  'app.day.edit': 'edit',
  'app.day.write': 'write this day',
  'app.day.prev': '‹ {date}',
  'app.day.next': '{date} ›',
  'app.day.prevAria': 'previous written day: {date}',
  'app.day.nextAria': 'next written day: {date}',
  'app.day.emptyTitle': 'Nothing for this day.',
  'app.day.emptyBody':
    'A day without an entry stays a day without an entry. You can write it now, or later.',
  'app.day.emptyNote': 'Days still to come cannot be written in advance.',

  // ————— app · writing —————
  'app.entry.today': 'today',
  'app.entry.titleOther': 'write',
  'app.entry.editTitle': 'edit',
  'app.entry.back': '‹ cancel',
  'app.entry.draft': 'nothing is stored until you save',
  'app.entry.text': 'text',
  'app.entry.textHint': 'no length is ever imposed.',
  'app.entry.textHintWords.one': '{n} word',
  'app.entry.textHintWords.other': '{n} words',
  'app.entry.note': 'note',
  'app.entry.noteHint': 'what you are reminding yourself of.',
  'app.entry.mood': 'mood',
  'app.entry.place': 'place',
  'app.entry.placeHint': 'typed by hand · no location is ever requested.',
  'app.entry.clear': 'clear the note',
  'app.entry.save': 'save the day',
  'app.entry.saveEmpty': 'nothing to save',
  'app.entry.discard': 'discard the draft',
  'app.entry.delete': 'delete this day',
  'app.entry.deleteAsk': 'Delete the entry for {date}?',
  'app.entry.deleteBody.one':
    'Its text — {n} word — will be erased. Export first if you want to keep it.',
  'app.entry.deleteBody.other':
    'Its text — {n} words — will be erased. Export first if you want to keep it.',
  'app.entry.deleteConfirm': 'delete for good',

  // ————— app · summary —————
  'app.stats.streak': 'current run',
  'app.stats.streakValue.one': '{n} day',
  'app.stats.streakValue.other': '{n} days',
  'app.stats.streakSince': 'since {date}',
  'app.stats.streakNone': 'no day written just now',
  'app.stats.streakRecord.one': 'best {n}',
  'app.stats.streakRecord.other': 'best {n}',
  'app.stats.written': 'days written',
  'app.stats.writtenShare': '{percent} % of the month',
  'app.stats.writtenYear': '{n} in the year',
  'app.stats.words': 'words',
  'app.stats.wordsPerDay': '{n} per day written',
  'app.stats.moods': 'moods this month',
  'app.stats.moodsNone': 'no mood recorded this month.',
  'app.stats.complete': 'full days',
  'app.stats.longest': 'longest day',
  'app.stats.longestValue': '{date} · {n} words',
  'app.stats.empty': '—',
  'app.stats.note':
    'The run is a reading, not a chain to keep unbroken. Nothing will remind you of it.',

  // ————— app · empty state —————
  'app.first.legend': 'the year reads at a glance',
  'app.first.facts': 'free · no account · all local · no ads',
  'app.first.import': 'import an existing journal',
  'app.empty.action': 'write the first day',

  // ————— app · settings —————
  'app.settings.title': 'settings',
  'app.settings.display': 'display',
  'app.settings.writing': 'writing',
  'app.settings.data': 'data — local, never sent',
  'app.settings.about': 'about',
  'app.settings.cycleAria': '{name}: {value}, change',
  'app.settings.displayNote':
    'Each row cycles its values. The change applies straight away.',
  'app.settings.grabNote': 'drag the handle down to close.',

  'app.settings.theme': 'theme',
  'app.settings.theme.system': 'system',
  'app.settings.theme.light': 'light',
  'app.settings.theme.dark': 'dark',

  'app.settings.lang': 'language',
  'app.settings.lang.system': 'system',
  'app.settings.lang.fr': 'français',
  'app.settings.lang.en': 'english',

  'app.settings.firstDay': 'week starts',
  'app.settings.firstDay.monday': 'monday',
  'app.settings.firstDay.sunday': 'sunday',

  'app.settings.textSize': 'reading text size',
  'app.settings.textSize.small': 'small',
  'app.settings.textSize.medium': 'medium',
  'app.settings.textSize.large': 'large',

  'app.settings.mood': 'ask for a mood',
  'app.settings.mood.asked': 'yes',
  'app.settings.mood.hidden': 'no',

  'app.settings.note': 'short note',
  'app.settings.note.asked': 'yes',
  'app.settings.note.hidden': 'no',

  'app.settings.writingNote':
    'Hiding a field erases nothing: whatever was written stays in the file and can still be read.',

  'app.settings.export': 'export',
  'app.settings.exportValue': '{file}',
  'app.settings.exportText': 'export as text',
  'app.settings.exportTextValue.one': '{n} entry, one file',
  'app.settings.exportTextValue.other': '{n} entries, one file',
  'app.settings.send': 'send to',
  'app.settings.sendValue': 'share the file',
  'app.settings.import': 'import',
  'app.settings.importValue': 'choose a file',
  'app.settings.importNote':
    'Import validates the schema and warns before replacing anything. Merging never overwrites a day you have already written.',
  'app.settings.importFound.one': '{file} — {n} entry',
  'app.settings.importFound.other': '{file} — {n} entries',
  'app.settings.importExplainEmpty':
    'Your journal is empty: merging and replacing give the same result.',
  'app.settings.importExplain.one':
    'Merging adds the missing days; replacing erases your entry.',
  'app.settings.importExplain.other':
    'Merging adds the missing days; replacing erases your {n} entries.',
  'app.settings.merge': 'merge',
  'app.settings.replace': 'replace',

  'app.settings.erase': 'erase everything',
  'app.settings.eraseValue.one': '{n} entry',
  'app.settings.eraseValue.other': '{n} entries',
  'app.settings.eraseAsk.one': 'Erase {n} entry?',
  'app.settings.eraseAsk.other': 'Erase {n} entries?',
  'app.settings.eraseBody':
    'This cannot be undone. Export first if you want to keep a copy.',
  'app.settings.eraseConfirm': 'erase everything',

  'app.settings.storageNote.one':
    '{n} entry saved on this device, and nowhere else.',
  'app.settings.storageNote.other':
    '{n} entries saved on this device, and nowhere else.',
  'app.settings.storageUnavailable':
    'This browser refuses local storage: the session works, but nothing will be found again on the next launch. Export still works.',

  'app.settings.aboutApp': 'about',
  'app.settings.aboutValue': 'what journal. does',
  'app.settings.changelog': 'changelog',
  'app.settings.changelogValue': 'read',
  'app.settings.version': 'version',
  'app.settings.legal': 'notices and privacy',
  'app.settings.read': 'read',
  'app.settings.licence': 'licence',
  'app.settings.source': 'source code',
  'app.settings.sourceValue': 'github',
  'app.settings.offline': 'offline · installable',

  // ————— app · text export —————
  'app.text.title': 'journal',
  'app.text.mood': 'mood',
  'app.text.note': 'note',
  'app.text.place': 'place',
  'app.text.writtenAt': 'written at',
  'app.text.words': 'words',

  // ————— app · import —————
  'app.import.errorTitle': 'This file could not be read.',
  'app.import.errorUnreadable':
    'The contents are not JSON. Choose the journal.json file exported from the app.',
  'app.import.errorSchema':
    'The file is JSON, but not a journal export. Check that it is the one you meant.',
  'app.import.errorVersion':
    'This file comes from another version of the format. Export it again from the app that produced it.',
  'app.import.errorEmpty': 'The file contains no entry to import.',
  'app.import.retry': 'choose another file',

  // ————— app · passing confirmations —————
  'app.flash.saved': '{date} saved',
  'app.flash.deleted': 'entry for {date} deleted',
  'app.flash.discarded': 'draft discarded',
  'app.flash.exported.one': '{n} entry exported',
  'app.flash.exported.other': '{n} entries exported',
  'app.flash.exportedText': 'journal exported as text',
  'app.flash.shared': 'file sent',
  'app.flash.imported.one': '{n} entry imported',
  'app.flash.imported.other': '{n} entries imported',
  'app.flash.importedNone': 'everything was already there',
  'app.flash.replaced.one': '{n} entry in place',
  'app.flash.replaced.other': '{n} entries in place',
  'app.flash.erased': 'journal erased',

  // ————— site · frame —————
  'site.nav.home': 'overview',
  'site.nav.about': 'about',
  'site.nav.changelog': 'changelog',
  'site.nav.app': 'open the app',
  'site.nav.source': 'source code',
  'site.nav.lang': 'FR',
  'site.nav.langAria': 'passer en français',
  'site.footer.project': 'project',
  'site.footer.repo': 'repository',
  'site.footer.releases': 'releases',
  'site.footer.issues': 'report an issue',
  'site.footer.about': 'about',
  'site.footer.changelog': 'changelog',
  'site.footer.licence': 'licence',
  'site.footer.licenceName': 'AGPL-3.0-or-later',
  'site.footer.thirdParty': 'third-party licences',
  'site.footer.contribute': 'contribute',
  'site.footer.licenceNote':
    'Open source. Any modified version made available must be too.',
  'site.footer.legal': 'legal',
  'site.footer.terms': 'terms of use',
  'site.footer.privacy': 'privacy',
  'site.footer.notice': 'legal notice',
  'site.footer.contact': 'contact',
  'site.footer.version': 'version {version}',

  // ————— site · home —————
  'site.home.metaTitle': 'journal. — one year, one day at a time',
  'site.home.metaDescription':
    'journal. answers a single question: what was that day like? A local, offline daily journal with no account.',
  'site.home.title': 'One year, one day at a time.',
  'site.home.lede':
    'Each evening, one entry: what you write, a short note, a mood. The year reads at a glance, one dot per day. Nothing to tick, nothing to win.',
  'site.home.cta': 'open the app',
  'site.home.ctaNote': 'no account — the app opens straight away',
  'site.home.demo': 'see a filled example',
  'site.home.demoNote': 'nothing is saved on your device',
  'site.home.previewCaption': 'The real app, with a year of example entries.',
  'site.home.app': 'the app',
  'site.home.appBody':
    'This is not a screenshot: it is the app, filled with a year of example entries. Open a month, read a day, write one — nothing you do here is saved.',
  'site.home.appHint.year': 'tapping a month row opens its grid',
  'site.home.appHint.month': 'tapping a cell opens the day',
  'site.home.appHint.day': '“edit” reopens the day for writing',
  'site.home.appHint.settings': 'settings change the theme and the language',
  'site.home.ready': 'Ready to start?',
  'site.home.readyNote': 'One day is enough. The rest of the year can wait.',
  'site.home.start': 'open the app',

  'site.home.loop': 'the loop',
  'site.home.loop.write': 'write',
  'site.home.loop.writeBody':
    'in the evening, one entry. Three lines or three pages, nobody is counting.',
  'site.home.loop.mark': 'mark',
  'site.home.loop.markBody':
    'a mood in one word, a note not to forget. Both are optional.',
  'site.home.loop.look': 'look',
  'site.home.loop.lookBody':
    'the year in twelve rows, one dot per day. The gaps show, and that is the point.',

  'site.home.rules': 'what journal. does not do',
  'site.home.rule.notify': 'no notification, no evening reminder',
  'site.home.rule.score': 'no score, no mood average',
  'site.home.rule.prompt': 'no question of the day, no imposed exercise',
  'site.home.rule.ai': 'no automatic summary, no analysis of your writing',
  'site.home.rule.account': 'no account, no sync',
  'site.home.rule.track': 'no tracker, no advertising',
  'site.home.rulesNote':
    'A day left unwritten is not a failure. It is a day left unwritten.',

  'site.home.facts': 'in short',
  'site.home.fact.unit': 'unit',
  'site.home.fact.unitValue': 'one day, one entry: a text, a note, a mood',
  'site.home.fact.views': 'views',
  'site.home.fact.viewsValue': 'the year · the month · the day · the summary',
  'site.home.fact.data': 'data',
  'site.home.fact.dataValue': 'on your device, export as JSON and as plain text',
  'site.home.fact.langs': 'languages',
  'site.home.fact.langsValue': 'French, English, or the one your system asks for',
  'site.home.fact.install': 'install',
  'site.home.fact.installValue': 'progressive web app, offline once loaded',
  'site.home.fact.licence': 'licence',
  'site.home.fact.licenceValue': 'AGPL-3.0-or-later, open source',

  // ————— site · about —————
  'site.about.metaTitle': 'about — journal.',
  'site.about.metaDescription':
    'Why journal. shows the whole year and refuses reminders, scores and automatic analysis.',
  'site.about.title': 'About',
  'site.about.lede':
    'journal. is part of a family of micro-apps that each answer one question, and only one.',
  'site.about.whyTitle': 'Why the whole year',
  'site.about.whyBody':
    'A journal is kept over years, and what you want to see is not the latest entry: it is the shape of the whole. Twelve rows, one dot per day, and the year fits on a phone screen without shrinking anything into illegibility. Full months and empty months read side by side, with no figure to comment on them. The month opens as a grid, the day opens as text: three depths, two gestures.',
  'site.about.noTitle': 'What was left out',
  'site.about.noBody':
    'No evening reminder: an app that demands its entry turns a journal into homework, and the day you write for the reminder rather than the wish, what you wrote is worth nothing. No mood average either, and no curve: four words are not a scale, and a mood is not a measurement. And no automatic analysis of your writing — what you write does not have to be read by a program.',
  'site.about.dataTitle': 'Your data',
  'site.about.dataBody':
    'Everything is stored in your browser’s local storage. There is no server, no account, no sync — so there is nothing to intercept. The journal.json file you export contains everything the app knows about you, and the plain-text export can be read in any editor, without this program.',
  'site.about.familyTitle': 'The family',
  'site.about.familyBody':
    'Same design system, same principles: monospace, right angles, no illustration, no emoji. What matters is what is written — and here more than anywhere else.',
  'site.about.openTitle': 'Open source',
  'site.about.openBody':
    'journal. is published under the AGPL-3.0-or-later licence. The code can be read, modified and redistributed; any modified version made available to others must be too.',

  // ————— site · changelog —————
  'site.changelog.metaTitle': 'changelog — journal.',
  'site.changelog.metaDescription':
    'What changed in journal., version by version.',
  'site.changelog.title': 'Changelog',
  'site.changelog.lede':
    'Every version and what it brings. Published entries are never rewritten.',
  'site.changelog.type.added': 'added',
  'site.changelog.type.changed': 'changed',
  'site.changelog.type.fixed': 'fixed',
  'site.changelog.type.performance': 'performance',

  // ————— site · legal pages —————
  'site.legal.terms.metaTitle': 'terms of use — journal.',
  'site.legal.terms.metaDescription':
    'The terms of use of journal.: free software provided as is, with no account and no remote service.',
  'site.legal.terms.title': 'Terms of use',
  'site.legal.terms.updated': 'Last updated: {date}',
  'site.legal.terms.serviceTitle': 'What you are using',
  'site.legal.terms.serviceBody':
    'journal. is software that runs entirely in your browser. There is no account, no subscription and no remote service: nothing is transmitted, so there is nothing to rent and nothing to cancel.',
  'site.legal.terms.dataTitle': 'Your data is yours',
  'site.legal.terms.dataBody':
    'Your entries are stored in your browser’s local storage. Clearing the site data deletes them permanently. Export the journal.json file regularly if your journal matters to you: nobody else holds a copy.',
  'site.legal.terms.warrantyTitle': 'No warranty',
  'site.legal.terms.warrantyBody':
    'The software is provided “as is”, without warranty of any kind, to the extent permitted by law. The authors cannot be held liable for any loss of data, whatever the cause.',
  'site.legal.terms.licenceTitle': 'Licence',
  'site.legal.terms.licenceBody':
    'journal. is distributed under the GNU AGPL version 3 or later. You may use, study, modify and redistribute it in accordance with that licence.',

  'site.legal.privacy.metaTitle': 'privacy — journal.',
  'site.legal.privacy.metaDescription':
    'journal. collects no data: no account, no server, no tracker, no analytics.',
  'site.legal.privacy.title': 'Privacy',
  'site.legal.privacy.updated': 'Last updated: {date}',
  'site.legal.privacy.shortTitle': 'In one sentence',
  'site.legal.privacy.shortBody':
    'journal. collects nothing, sends nothing and sets no tracker. Your writing is read by nobody, and by no remote program.',
  'site.legal.privacy.collectTitle': 'What is collected',
  'site.legal.privacy.collectBody':
    'Nothing. No account, no identifier, no address, no analytics, no advertising cookie. The app makes no network request in use: once the page is loaded, it works offline.',
  'site.legal.privacy.storedTitle': 'What is stored, and where',
  'site.legal.privacy.storedBody':
    'Your entries — text, note, mood, place, time — and your settings, in your browser’s local storage, on your device. This data only leaves the device if you export the file yourself.',
  'site.legal.privacy.hostTitle': 'Hosting',
  'site.legal.privacy.hostBody':
    'The site is hosted by Vercel Inc., which keeps technical connection logs (IP address, user agent) to provide its service. Those logs are outside the project, which has no access to them.',
  'site.legal.privacy.rightsTitle': 'Your rights',
  'site.legal.privacy.rightsBody':
    'Since the project collects no personal data, there is nothing to request and nothing to have deleted. You keep control of your data at all times: Settings → export, or erase everything.',

  'site.legal.notice.metaTitle': 'legal notice — journal.',
  'site.legal.notice.metaDescription':
    'Publisher, hosting and licence of journal.',
  'site.legal.notice.title': 'Legal notice',
  'site.legal.notice.editorTitle': 'Publisher',
  'site.legal.notice.editorBody':
    'journal. is a free software project, published by its authors with no commercial entity. Contact: {contact}.',
  'site.legal.notice.hostTitle': 'Hosting',
  'site.legal.notice.hostBody':
    'Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, United States — vercel.com. The site is published there as a set of static files: the host holds no database for the project.',
  'site.legal.notice.propertyTitle': 'Intellectual property',
  'site.legal.notice.propertyBody':
    'The source code is available under the AGPL-3.0-or-later licence. The text you write stays yours and is never transmitted to the project.',

  // ————— site · not found —————
  'site.notfound.metaTitle': 'page not found — journal.',
  'site.notfound.metaDescription': 'This address matches no page.',
  'site.notfound.title': 'This page does not exist.',
  'site.notfound.body':
    'The address may be incomplete, or the page may have been removed.',
  'site.notfound.action': 'back to the overview',

  // ————— update —————
  'update.available': 'A new version is ready.',
  'update.action': 'reload',
}
