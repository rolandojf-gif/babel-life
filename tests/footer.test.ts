/**
 * @vitest-environment jsdom
 *
 * The footer every page carries. It opens on the homage line, which took the
 * place of the old attribution, and the no-JavaScript pages carry the same line
 * by hand, so they are held to the copy here.
 */

import { afterEach, describe, expect, it, vi } from 'vitest';
import { mountAppShell } from '../src/views/AppShell';
import { createController } from '../src/library/controller';
import type { AppState } from '../src/library/model';
import { copyFor } from '../src/content/copy';
import * as locale from '../src/content/locale';
import englishPage from '../index.html?raw';
import spanishPage from '../es/index.html?raw';

const HOMAGE = {
  en: 'Babel Life is a humble homage to Jorge Luis Borges’ “The Library of Babel” (1941). An independent project: it does not reproduce the story and is not affiliated with his estate or publishers.',
  es: 'Babel Life es un humilde homenaje a «La biblioteca de Babel» (1941), de Jorge Luis Borges. Proyecto independiente: no reproduce el cuento ni está vinculado a sus herederos ni a sus editores.',
} as const;

/** The line the homage replaced, in each edition. */
const FORMER_ATTRIBUTION = {
  en: 'Inspired by Jorge Luis Borges.',
  es: 'Inspirado en Jorge Luis Borges.',
} as const;

afterEach(() => {
  vi.restoreAllMocks();
  document.body.replaceChildren();
});

function wallState(): AppState {
  return {
    view: 'wall',
    wallSelection: 'first',
    wallSeed: 1n,
    currentBookId: null,
    lastBookId: null,
    address: null,
    shelf: null,
  };
}

function mount(edition: 'en' | 'es') {
  vi.spyOn(locale, 'getLocale').mockReturnValue(edition);
  const root = document.createElement('div');
  document.body.append(root);
  const render = mountAppShell(root, createController(() => {}, 1n));
  render(wallState(), { focus: 'none' });
  return { root, render };
}

/** Text as a reader sees it: the hand-wrapped HTML lines joined back up. */
function flatten(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

describe('the homage line', () => {
  it('reads as written in each edition', () => {
    expect(copyFor('en').homage).toBe(HOMAGE.en);
    expect(copyFor('es').homage).toBe(HOMAGE.es);
  });

  it('writes the possessive as the rest of the English edition does', () => {
    expect(HOMAGE.en).toContain('Borges’ “The Library of Babel”');
    expect(HOMAGE.en).not.toContain('Borges’s');
  });

  it('quotes the story the Spanish way in the Spanish edition', () => {
    expect(HOMAGE.es).toContain('«La biblioteca de Babel»');
    expect(HOMAGE.es).not.toMatch(/["“”]/);
  });

  it('opens the footer where the attribution stood, before the copyright', () => {
    for (const edition of ['en', 'es'] as const) {
      const { root } = mount(edition);
      const footer = root.querySelector('footer');
      const homage = footer?.querySelector('.homage');
      expect(homage?.textContent).toBe(HOMAGE[edition]);
      expect(footer?.firstElementChild).toBe(homage);
      expect(homage?.nextElementSibling?.textContent).toBe(copyFor(edition).copyright);

      const lines = [...(footer?.querySelectorAll(':scope > p') ?? [])].map((p) => p.textContent);
      expect(lines).toEqual([HOMAGE[edition], copyFor(edition).copyright]);
      expect(footer?.textContent).not.toContain(FORMER_ATTRIBUTION[edition]);
      // The notes keep their place after the copyright.
      expect(homage?.nextElementSibling?.nextElementSibling?.tagName).toBe('DETAILS');

      document.body.replaceChildren();
      vi.restoreAllMocks();
    }
  });

  it('stays on every page the visitor moves to', () => {
    const { root, render } = mount('en');
    const views: Partial<AppState>[] = [
      { view: 'book', currentBookId: 'b0007' },
      { view: 'invalidAddress' },
      { view: 'wall' },
    ];
    for (const next of views) {
      render({ ...wallState(), ...next }, { focus: 'none' });
      expect(root.querySelectorAll('footer .homage')).toHaveLength(1);
    }
  });

  it('is carried the same way by the pages that load without JavaScript', () => {
    for (const [edition, page] of [['en', englishPage], ['es', spanishPage]] as const) {
      const footer = /<footer class="footer">([\s\S]*?)<\/footer>/.exec(page)?.[1] ?? '';
      const paragraphs = [...footer.matchAll(/<p class="([^"]+)">([\s\S]*?)<\/p>/g)]
        .slice(0, 2)
        .map((match) => [match[1], flatten(match[2] ?? '')]);
      expect(paragraphs).toEqual([
        ['homage', HOMAGE[edition]],
        ['attribution', copyFor(edition).copyright],
      ]);
      expect(footer).not.toContain(FORMER_ATTRIBUTION[edition]);
    }
  });
});
