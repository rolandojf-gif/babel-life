import { copy } from '../content/copy';
import { getLocale, hrefForLocale, LOCALES, type Locale } from '../content/locale';
import { element, link } from './view';

const LABELS: Record<Locale, string> = { en: 'EN', es: 'ES' };

/**
 * Permanent language links. Real anchors, not buttons: the URL is the source of
 * truth, and a full navigation to the other edition is intentional.
 */
export function createLanguageSwitcher(): HTMLElement {
  const nav = element('nav', 'lang');

  const links = new Map<Locale, HTMLAnchorElement>();
  for (const [index, locale] of LOCALES.entries()) {
    if (index > 0) {
      const rule = element('span', 'lang__rule', '/');
      rule.setAttribute('aria-hidden', 'true');
      nav.append(rule);
    }
    const anchor = link(hrefForLocale(locale), 'lang__link', LABELS[locale]);
    links.set(locale, anchor);
    nav.append(anchor);
  }

  function sync(): void {
    const current = getLocale();
    const hash = window.location.hash;
    nav.setAttribute('aria-label', copy.language);
    for (const [locale, anchor] of links) {
      anchor.setAttribute('href', hrefForLocale(locale, hash));
      if (locale === current) anchor.setAttribute('aria-current', 'page');
      else anchor.removeAttribute('aria-current');
    }
  }

  sync();
  window.addEventListener('hashchange', sync);
  return nav;
}
