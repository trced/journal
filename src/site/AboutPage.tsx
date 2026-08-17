/** À propos : pourquoi la semaine, ce qui a été laissé de côté, et où
 *  vivent les données. Une page de texte, pas une plaquette. */

import { Link } from 'react-router'
import { useI18n } from '../i18n/index.tsx'
import type { MessageKey } from '../i18n/index.tsx'
import { CONTACT, CONTACT_EMAIL, REPO } from '../lib/links.ts'
import { useDocumentMeta } from './SiteLayout.tsx'

const SECTIONS: [MessageKey, MessageKey][] = [
  ['site.about.whyTitle', 'site.about.whyBody'],
  ['site.about.noTitle', 'site.about.noBody'],
  ['site.about.dataTitle', 'site.about.dataBody'],
  ['site.about.familyTitle', 'site.about.familyBody'],
  ['site.about.openTitle', 'site.about.openBody'],
]

export function AboutPage() {
  useDocumentMeta('site.about.metaTitle', 'site.about.metaDescription')
  const { t } = useI18n()

  return (
    <>
      <section className="site__lede site__lede--split">
        <h1 className="site__h1">{t('site.about.title')}</h1>
        <p className="site__text">{t('site.about.lede')}</p>
      </section>

      <section>
        <ol>
          {SECTIONS.map(([title, body], index) => (
            <li key={title} className="numbered__item">
              <span className="numbered__index">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="numbered__stack">
                <strong className="numbered__name">{t(title)}</strong>
                <span className="numbered__body">{t(body)}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      <section className="closing">
        <div className="closing__text">
          <span className="t-body">{t('site.home.ready')}</span>
          <span className="t-meta t-muted">{t('site.home.readyNote')}</span>
        </div>
        <Link className="btn btn--primary" to="/app">
          {t('site.home.start')}
        </Link>
      </section>

      <section>
        <div className="section-label section-label--strong">
          {t('site.footer.contact')}
        </div>
        <div className="inline-links">
          <a href={CONTACT}>{CONTACT_EMAIL}</a>
          <a href={REPO} rel="noreferrer noopener" target="_blank">
            {t('site.nav.source')}
          </a>
          <Link to="/changelog">{t('site.nav.changelog')}</Link>
        </div>
      </section>
    </>
  )
}
