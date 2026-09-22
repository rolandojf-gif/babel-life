/**
 * @vitest-environment jsdom
 *
 * The wall as a visitor meets it: twelve lives, the other fifteen, then all of
 * them — with nothing moving under their hands while they look.
 */

import { afterEach, describe, expect, it, vi } from 'vitest';
import { createWallOfLives } from '../src/views/WallOfLives';
import { copy } from '../src/content/copy';
import { catalog, wallBooks } from '../src/library/catalog';
import type { AppState } from '../src/library/model';
import * as locale from '../src/content/locale';

const SEED = 20260919n;

afterEach(() => {
  vi.restoreAllMocks();
});

function state(selection: AppState['wallSelection']): AppState {
  return {
    view: 'wall',
    wallSelection: selection,
    wallSeed: SEED,
    currentBookId: null,
    address: null,
    shelf: null,
  };
}

function mount() {
  const view = createWallOfLives(state('first'), {
    onSomethingStranger() {},
    onShowAll() {},
  });
  document.body.replaceChildren(view.element);
  return view;
}

function dealt(view: { element: HTMLElement }): string[] {
  return [...view.element.querySelectorAll('a.card')].map(
    (card) => card.getAttribute('href') ?? '',
  );
}

describe('the wall', () => {
  it('opens on twelve of the twenty-seven lives', () => {
    const view = mount();
    expect(dealt(view)).toHaveLength(12);
    expect(view.element.textContent).toContain('Twelve of twenty-seven books.');
  });

  it('leads with the premise of each life, and never with a title', () => {
    const view = mount();
    const hooks = [...view.element.querySelectorAll('.card__hook')].map((node) => node.textContent);
    expect(hooks).toEqual(wallBooks('first', SEED).map((book) => book.hook));

    // Structural, not textual: a premise may quote its own title, as 14 March
    // does. What the wall must not do is present one as a title.
    expect(view.element.querySelector('.card__title, .book__title')).toBeNull();
    for (const card of view.element.querySelectorAll('.card__eyebrow')) {
      expect(card.textContent).toBe(copy.cardEyebrow);
    }
  });

  it('shows the other fifteen when asked for something stranger', () => {
    const view = mount();
    const opening = dealt(view);
    view.update(state('second'));
    const stranger = dealt(view);

    expect(stranger).toHaveLength(15);
    expect(stranger.some((href) => opening.includes(href))).toBe(false);
  });

  it('opens out to all twenty-seven without moving a card', () => {
    const view = mount();
    const opening = dealt(view);
    view.update(state('second'));
    const stranger = dealt(view);

    view.update(state('all'));
    const everything = dealt(view);
    expect(everything).toHaveLength(27);
    expect(everything.slice(0, 12)).toEqual(opening);
    expect(everything.slice(12)).toEqual(stranger);
    expect(view.element.textContent).toContain('All twenty-seven books.');
  });

  it('deals the same wall for a visit, however often it is redrawn', () => {
    const view = mount();
    const opening = dealt(view);
    view.update(state('all'));
    view.update(state('first'));
    expect(dealt(view)).toEqual(opening);
  });

  it('puts an action away rather than disabling it', () => {
    const view = mount();
    const labels = () => [...view.element.querySelectorAll('button')].map((b) => b.textContent);
    expect(labels()).toEqual([copy.somethingStranger, copy.showAll]);

    view.update(state('second'));
    expect(labels()).toEqual([copy.showAll]);

    view.update(state('all'));
    expect(labels()).toEqual([]);
    expect(view.element.querySelectorAll('[disabled]')).toHaveLength(0);
  });

  it('sends every card to its own volume', () => {
    const view = mount();
    view.update(state('all'));
    const hrefs = dealt(view);
    expect(new Set(hrefs).size).toBe(27);
    for (const href of hrefs) expect(href).toMatch(/^#book=b\d{4}$/);
    const roots = catalog.books.filter((book) => book.kind === 'root').map((book) => book.id);
    expect(hrefs.map((href) => href.replace('#book=', '')).sort()).toEqual([...roots].sort());
  });

  it('focuses the first newly revealed card when the wall opens out', () => {
    const view = mount();
    const openingCount = dealt(view).length;
    view.update(state('all'));
    const cards = [...view.element.querySelectorAll('a.card')];

    view.focus('wallAppended');

    expect(document.activeElement).toBe(cards[openingCount]);
    expect(document.activeElement).not.toBe(cards[0]);
  });

  it('still focuses the first card when the stranger grid replaces the wall', () => {
    const view = mount();
    view.update(state('second'));
    view.focus('wallGrid');
    expect(document.activeElement).toBe(view.element.querySelector('a.card'));
  });

  it('speaks each scale figure as a power and hides the visual superscript from that reading', () => {
    const view = mount();
    const figures = [...view.element.querySelectorAll('.masthead__scale-value')];
    expect(figures).toHaveLength(2);

    const spoken = figures.map((figure) => figure.querySelector('.visually-hidden')?.textContent);
    expect(spoken).toEqual([
      '≈ 1.96 × 10 to the power of 1,834,097 books',
      '≈ 10 to the power of 80 atoms',
    ]);

    for (const figure of figures) {
      const visual = figure.querySelector('[aria-hidden="true"]');
      expect(visual?.querySelector('sup.masthead__scale-exponent')?.textContent).toMatch(/\d/);
      expect(figure.querySelector('.visually-hidden sup')).toBeNull();
      expect(visual?.textContent).not.toContain('to the power of');
    }
  });

  it('speaks the Spanish scale figures as elevated powers', () => {
    vi.spyOn(locale, 'getLocale').mockReturnValue('es');
    const view = mount();
    const spoken = [...view.element.querySelectorAll('.masthead__scale-value')].map(
      (figure) => figure.querySelector('.visually-hidden')?.textContent,
    );
    expect(spoken).toEqual([
      '≈ 1,96 × 10 elevado a 1.834.097 libros',
      '≈ 10 elevado a 80 átomos',
    ]);
  });
});
