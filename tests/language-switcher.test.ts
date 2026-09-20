/**
 * @vitest-environment jsdom
 */

import { describe, expect, it } from 'vitest';
import { createLanguageSwitcher } from '../src/views/LanguageSwitcher';

function hrefs(nav: HTMLElement): string[] {
  return [...nav.querySelectorAll('a')].map((anchor) => anchor.getAttribute('href') ?? '');
}

describe('the language switcher', () => {
  it('preserves the current hash on both language links', () => {
    window.location.hash = '#book=b0053';
    const nav = createLanguageSwitcher();
    expect(hrefs(nav)).toEqual(['/#book=b0053', '/es/#book=b0053']);
    expect(nav.querySelector('[aria-current="page"]')?.textContent).toBe('EN');
    expect(nav.getAttribute('aria-label')).toBe('Language');
  });

  it('updates the links when the hash route changes', () => {
    window.location.hash = '';
    const nav = createLanguageSwitcher();
    expect(hrefs(nav)).toEqual(['/', '/es/']);

    window.location.hash = '#shelf=ABC-2-4';
    window.dispatchEvent(new HashChangeEvent('hashchange'));
    expect(hrefs(nav)).toEqual(['/#shelf=ABC-2-4', '/es/#shelf=ABC-2-4']);
  });
});
