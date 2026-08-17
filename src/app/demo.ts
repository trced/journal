/** Les textes de la démonstration, tirés du dictionnaire : l'exemple parle
 *  la langue de qui le regarde.
 *
 *  Ici plutôt que dans lib/ : lib/ ne connaît pas l'i18n, et l'exemple est
 *  une affaire d'interface — le générateur, lui, reste pur. */

import type { Translator } from '../i18n/index.tsx'
import type { SampleText } from '../lib/sample.ts'

export function demoSample(t: Translator['t']): SampleText {
  return {
    texts: [
      t('app.demo.text1'),
      t('app.demo.text2'),
      t('app.demo.text3'),
      t('app.demo.text4'),
      t('app.demo.text5'),
      t('app.demo.text6'),
    ],
    notes: [
      t('app.demo.note1'),
      t('app.demo.note2'),
      t('app.demo.note3'),
      t('app.demo.note4'),
    ],
    places: [
      t('app.demo.place1'),
      t('app.demo.place2'),
      t('app.demo.place3'),
    ],
  }
}
