/** The two public languages of this edition. English is the default. */
export type Locale = 'en' | 'es';

export const LOCALES: readonly Locale[] = ['en', 'es'];

/**
 * Locale from a URL pathname. `/es` and `/es/…` are Spanish; everything else
 * is English. The URL is the source of truth — never the browser language.
 */
export function localeFromPathname(pathname: string): Locale {
  const withSlash = pathname.endsWith('/') ? pathname : `${pathname}/`;
  return withSlash === '/es/' || withSlash.startsWith('/es/') ? 'es' : 'en';
}

/** Active locale from the address bar, or English when there is no window. */
export function getLocale(): Locale {
  if (typeof window === 'undefined' || window.location === undefined) return 'en';
  return localeFromPathname(window.location.pathname);
}

/**
 * A same-origin language URL that keeps the current hash route. English lives
 * at `/`; Spanish at `/es/`. An empty hash is omitted so the public URLs stay
 * `/` and `/es/` rather than `/#`.
 */
export function hrefForLocale(locale: Locale, hash = ''): string {
  const path = locale === 'es' ? '/es/' : '/';
  if (hash === '' || hash === '#') return path;
  return `${path}${hash.startsWith('#') ? hash : `#${hash}`}`;
}
