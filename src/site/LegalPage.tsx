/** Pages légales : conditions, confidentialité, mentions.
 *  Trois pages, une seule charpente — le contenu tient dans le dictionnaire. */

import { Link } from 'react-router'
import { useI18n } from '../i18n/index.tsx'
import type { MessageKey } from '../i18n/index.tsx'
import { CONTACT, CONTACT_EMAIL } from '../lib/links.ts'
import { formatDate } from '../lib/format.ts'
import { useDocumentMeta } from './SiteLayout.tsx'

/** Date de dernière révision des textes légaux. Elle est écrite ici, et
 *  nulle part ailleurs : une page qui daterait du jour de la visite ne
 *  dirait rien de la version qu'on lit. */
const UPDATED = '2026-08-17'

interface LegalPageProps {
  metaTitle: MessageKey
  metaDescription: MessageKey
  title: MessageKey
  updated?: MessageKey
  sections: [MessageKey, MessageKey][]
}

function LegalPage({
  metaTitle,
  metaDescription,
  title,
  updated,
  sections,
}: LegalPageProps) {
  useDocumentMeta(metaTitle, metaDescription)
  const { t, locale } = useI18n()

  return (
    <>
      <section className="site__lede">
        <div className="legal__head">
          <h1 className="site__h1">{t(title)}</h1>
          {updated ? (
            <span className="t-meta t-muted">
              {t(updated, { date: formatDate(UPDATED, locale) })}
            </span>
          ) : null}
        </div>
      </section>

      {sections.map(([heading, body]) => (
        <section key={heading}>
          <h2 className="site__h2">{t(heading)}</h2>
          <p className="site__intro">
            {t(body, { contact: CONTACT_EMAIL })}
          </p>
        </section>
      ))}

      <section>
        <div className="section-label">{t('site.footer.legal')}</div>
        <div className="legal__links">
          <Link to="/legal/terms">{t('site.footer.terms')}</Link>
          <Link to="/legal/privacy">{t('site.footer.privacy')}</Link>
          <Link to="/legal/notice">{t('site.footer.notice')}</Link>
          <a href={CONTACT}>{CONTACT_EMAIL}</a>
        </div>
      </section>
    </>
  )
}

export function TermsPage() {
  return (
    <LegalPage
      metaTitle="site.legal.terms.metaTitle"
      metaDescription="site.legal.terms.metaDescription"
      title="site.legal.terms.title"
      updated="site.legal.terms.updated"
      sections={[
        ['site.legal.terms.serviceTitle', 'site.legal.terms.serviceBody'],
        ['site.legal.terms.dataTitle', 'site.legal.terms.dataBody'],
        ['site.legal.terms.warrantyTitle', 'site.legal.terms.warrantyBody'],
        ['site.legal.terms.licenceTitle', 'site.legal.terms.licenceBody'],
      ]}
    />
  )
}

export function PrivacyPage() {
  return (
    <LegalPage
      metaTitle="site.legal.privacy.metaTitle"
      metaDescription="site.legal.privacy.metaDescription"
      title="site.legal.privacy.title"
      updated="site.legal.privacy.updated"
      sections={[
        ['site.legal.privacy.shortTitle', 'site.legal.privacy.shortBody'],
        ['site.legal.privacy.collectTitle', 'site.legal.privacy.collectBody'],
        ['site.legal.privacy.storedTitle', 'site.legal.privacy.storedBody'],
        ['site.legal.privacy.hostTitle', 'site.legal.privacy.hostBody'],
        ['site.legal.privacy.rightsTitle', 'site.legal.privacy.rightsBody'],
      ]}
    />
  )
}

export function NoticePage() {
  return (
    <LegalPage
      metaTitle="site.legal.notice.metaTitle"
      metaDescription="site.legal.notice.metaDescription"
      title="site.legal.notice.title"
      sections={[
        ['site.legal.notice.editorTitle', 'site.legal.notice.editorBody'],
        ['site.legal.notice.hostTitle', 'site.legal.notice.hostBody'],
        [
          'site.legal.notice.propertyTitle',
          'site.legal.notice.propertyBody',
        ],
      ]}
    />
  )
}
