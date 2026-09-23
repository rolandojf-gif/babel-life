/**
 * @vitest-environment jsdom
 *
 * The homepage index is the case of this edition: every readable book, root
 * and nearby, standing by family, with a locator on one of them and that
 * book's real Library address printed beneath. It counts from the catalogue
 * and does not pretend the books are neighbours in the Library.
 */

import { describe, expect, it, vi } from 'vitest';
import { copy } from '../src/content/copy';
import * as locale from '../src/content/locale';
import {
  catalog,
  EDITION_FAMILIES,
  PINNED_ROOT_IDS,
  TOTAL_BOOKS,
  TOTAL_ROOTS,
  wallBooks,
} from '../src/library/catalog';
import { coordinateFor, formatCoordinate } from '../src/library/coordinates';
import {
  aisleFor,
  createLibraryIndex,
  editionCase,
  FAMILIES_PER_SHELF,
  NEARBY_SPINE_WIDTH,
  ROOT_SPINE_WIDTH,
  updateLibraryIndex,
} from '../src/views/libraryIndex';
import { createWallOfLives } from '../src/views/WallOfLives';
import type { AppState } from '../src/library/model';

const SEED = 20260919n;
const OTHER_SEED = 7n;

const firstFamily = EDITION_FAMILIES[0]!;
const aRoot = firstFamily.rootId;
const aNearby = firstFamily.nearbyIds[1]!;

function locatedBook(index: Element): string | null {
  return index.querySelector('.library-index__locator')?.getAttribute('data-book') ?? null;
}

function printed(node: Element | null): string {
  return (node?.textContent ?? '').replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();
}

function address(bookId: string): string {
  return formatCoordinate(coordinateFor(bookId));
}

function dealtHrefs(view: { element: HTMLElement }): string[] {
  return [...view.element.querySelectorAll('a.card')].map((card) => card.getAttribute('href') ?? '');
}

function wallState(
  seed: bigint,
  selection: AppState['wallSelection'] = 'first',
  lastBookId: string | null = null,
): AppState {
  return {
    view: 'wall',
    wallSelection: selection,
    wallSeed: seed,
    currentBookId: null,
    lastBookId,
    address: null,
    shelf: null,
  };
}

describe('the edition’s families', () => {
  it('are the root books in wall order, each with its own nearby books', () => {
    const roots = catalog.books.filter((book) => book.kind === 'root');
    expect(EDITION_FAMILIES).toHaveLength(roots.length);
    expect(EDITION_FAMILIES.map((family) => family.rootId)).toEqual([
      ...catalog.wall.first,
      ...catalog.wall.second,
    ]);
    const counted = EDITION_FAMILIES.flatMap((family) => [family.rootId, ...family.nearbyIds]);
    expect(counted).toHaveLength(catalog.books.length);
    expect(new Set(counted).size).toBe(catalog.books.length);
    for (const family of EDITION_FAMILIES) {
      for (const id of family.nearbyIds) {
        const book = catalog.books.find((entry) => entry.id === id);
        expect(book?.kind).toBe('nearby');
        expect(book?.rootId).toBe(family.rootId);
      }
    }
  });
});

describe('the edition’s case', () => {
  it('stands one spine for every readable book, derived from the catalogue', () => {
    const edition = editionCase();
    expect(edition.spines).toHaveLength(TOTAL_BOOKS);
    expect(edition.spines.filter((spine) => spine.kind === 'root')).toHaveLength(TOTAL_ROOTS);
    expect(edition.spines.filter((spine) => spine.kind === 'nearby')).toHaveLength(
      TOTAL_BOOKS - TOTAL_ROOTS,
    );
    expect(edition.shelves).toBe(Math.ceil(TOTAL_ROOTS / FAMILIES_PER_SHELF));

    const index = createLibraryIndex(aRoot);
    expect(index.querySelectorAll('.library-index__spine')).toHaveLength(TOTAL_BOOKS);
    expect(index.querySelectorAll('.library-index__spine--root')).toHaveLength(TOTAL_ROOTS);
  });

  it('grows with the catalogue instead of holding a fixed count', () => {
    const more = [...EDITION_FAMILIES, { rootId: 'b9001', nearbyIds: ['b9002', 'b9003'] }];
    const edition = editionCase(more);
    expect(edition.spines).toHaveLength(TOTAL_BOOKS + 3);
    expect(edition.shelves).toBe(Math.ceil(more.length / FAMILIES_PER_SHELF));
  });

  it('keeps each family together, its root between its two nearby books', () => {
    const edition = editionCase();
    for (const family of EDITION_FAMILIES) {
      const spines = edition.spines.filter((spine) => spine.rootId === family.rootId);
      expect(spines.map((spine) => spine.id)).toEqual([
        family.nearbyIds[0],
        family.rootId,
        ...family.nearbyIds.slice(1),
      ]);
      expect(new Set(spines.map((spine) => spine.baseline)).size).toBe(1);
      const start = edition.spines.indexOf(spines[0]!);
      expect(edition.spines.slice(start, start + spines.length)).toEqual(spines);
    }
  });

  it('gives roots more presence without making nearby books marks', () => {
    for (const spine of editionCase().spines) {
      expect(spine.width).toBe(spine.kind === 'root' ? ROOT_SPINE_WIDTH : NEARBY_SPINE_WIDTH);
      expect(spine.height).toBeGreaterThan(spine.width * 3);
    }
    expect(ROOT_SPINE_WIDTH).toBeGreaterThan(NEARBY_SPINE_WIDTH);
  });

  it('labels itself as this edition, counting from the catalogue in both editions', () => {
    expect(printed(createLibraryIndex(aRoot).querySelector('.library-index__edition'))).toBe(
      `THIS EDITION · ${String(TOTAL_BOOKS)} books · ${String(TOTAL_ROOTS)} on the wall`,
    );
    vi.spyOn(locale, 'getLocale').mockReturnValue('es');
    expect(printed(createLibraryIndex(aRoot).querySelector('.library-index__edition'))).toBe(
      `ESTA EDICIÓN · ${String(TOTAL_BOOKS)} libros · ${String(TOTAL_ROOTS)} en el muro`,
    );
    vi.restoreAllMocks();
    for (const template of [copy.editionBooks, copy.editionOnWall]) {
      expect(template).toContain('{count}');
      expect(template).not.toMatch(/\d/);
    }
  });
});

describe('the library index', () => {
  it('is not a control', () => {
    const index = createLibraryIndex(aRoot);
    expect(index.querySelector('a, button, [href], [tabindex]')).toBeNull();
    expect(index.querySelector('.library-index__field')?.getAttribute('aria-hidden')).toBe('true');
    expect(index.querySelectorAll('svg[aria-hidden="true"]')).toHaveLength(1);
  });

  it('prints the real address of the book it stands on, and only that', () => {
    const index = createLibraryIndex(aRoot);
    expect(printed(index.querySelector('.library-index__coordinate'))).toBe(address(aRoot));
    expect(index.textContent).not.toContain(copy.lede);
  });

  it('stands the locator on a nearby book as readily as on a root', () => {
    const index = createLibraryIndex(aRoot);
    const spine = editionCase().spines.find((entry) => entry.id === aNearby)!;
    updateLibraryIndex(index, aNearby);
    const group = index.querySelector<SVGGElement>('.library-index__locator')!;
    expect(locatedBook(index)).toBe(aNearby);
    expect(group.getAttribute('data-kind')).toBe('nearby');
    expect(group.style.transform).toBe(`translate(${String(spine.x)}px, ${String(spine.y)}px)`);
    const mark = group.querySelector('.library-index__mark--current');
    expect(mark?.getAttribute('width')).toBe(String(spine.width));
    expect(mark?.getAttribute('height')).toBe(String(spine.height));
    expect(printed(index.querySelector('.library-index__coordinate'))).toBe(address(aNearby));
  });

  it('lets the rest of the current book’s family answer, and no other book', () => {
    const index = createLibraryIndex(aRoot);
    const kin = () =>
      [...index.querySelectorAll('.library-index__spine--kin')].map((node) => node.getAttribute('data-book'));
    expect(kin().sort()).toEqual([...firstFamily.nearbyIds].sort());
    updateLibraryIndex(index, aNearby);
    expect(kin().sort()).toEqual([aRoot, firstFamily.nearbyIds[0]].sort());
    const other = EDITION_FAMILIES[5]!;
    updateLibraryIndex(index, other.rootId);
    expect(kin().sort()).toEqual([...other.nearbyIds].sort());
  });

  it('runs the leader up, along to the nearer aisle and down, and stands the ladder there', () => {
    const edition = editionCase();
    const index = createLibraryIndex(aRoot);
    for (const spine of [edition.spines[0]!, edition.spines.at(-1)!, edition.spines[40]!]) {
      updateLibraryIndex(index, spine.id);
      const aisle = aisleFor(spine);
      const leader = index.querySelector<SVGElement>('.library-index__leader')!;
      const d = leader.getAttribute('d') ?? '';
      expect(d).toMatch(/^M[\d.]+ [\d.]+V[\d.]+H[\d.]+V[\d.]+$/);
      expect(leader.style.getPropertyValue('d')).toBe(`path("${d}")`);
      // The run clears every book on the shelf and stays below the board above.
      const tallest = Math.max(
        ...edition.spines.filter((entry) => entry.baseline === spine.baseline).map((entry) => entry.height),
      );
      expect(aisle.runY).toBeLessThan(spine.baseline - tallest);
      expect(aisle.runY).toBeGreaterThan(spine.baseline - 34);
      expect(aisle.gutterX < edition.caseLeft || aisle.gutterX > edition.caseRight).toBe(true);
      const ladder = index.querySelector<SVGGElement>('.library-index__ladder')!;
      expect(ladder.style.transform).toBe(
        `translate(${String(aisle.gutterX)}px, ${String(aisle.runY)}px) scaleX(${String(aisle.side)})`,
      );
    }
    expect(aisleFor(edition.spines[0]!).side).toBe(-1);
    expect(aisleFor(edition.spines.at(-1)!).side).toBe(1);
  });

  it('avoids rebuilding an unchanged book', () => {
    const index = createLibraryIndex(aRoot);
    const readout = index.querySelector('.library-index__coordinate')?.firstChild;
    updateLibraryIndex(index, aRoot);
    expect(index.querySelector('.library-index__coordinate')?.firstChild).toBe(readout);
  });
});

describe('the wall’s index', () => {
  it('anchors to the first root of this visit’s shuffled deal', () => {
    const view = createWallOfLives(wallState(SEED), {
      onSomethingStranger() {},
      onShowAll() {},
    });
    const first = wallBooks('first', SEED)[0];
    if (!first) throw new Error('expected a first root');

    expect(view.element.querySelector('a.card')?.getAttribute('href')).toBe(`#book=${first.id}`);
    expect(printed(view.element.querySelector('.library-index .coordinate'))).toBe(
      address(first.id),
    );
  });

  it('holds still when the rest of the wall is asked for', () => {
    const view = createWallOfLives(wallState(SEED), {
      onSomethingStranger() {},
      onShowAll() {},
    });
    const opening = printed(view.element.querySelector('.library-index .coordinate'));
    view.update(wallState(SEED, 'second'));
    view.update(wallState(SEED, 'all'));
    expect(printed(view.element.querySelector('.library-index .coordinate'))).toBe(opening);
    expect(view.element.querySelector('.library-index a')).toBeNull();
  });

  it('follows a hovered or focused card, then returns to the opening volume', () => {
    const view = createWallOfLives(wallState(SEED), {
      onSomethingStranger() {},
      onShowAll() {},
    });
    document.body.replaceChildren(view.element);

    const books = wallBooks('first', SEED);
    const first = books[0];
    const other = books[3];
    if (!first || !other) throw new Error('expected a dealt wall');
    const cards = [...view.element.querySelectorAll('a.card')];
    const otherCard = cards[3];
    if (!(otherCard instanceof HTMLAnchorElement)) throw new Error('expected a card');

    const index = view.element.querySelector('.library-index');
    if (!(index instanceof HTMLElement)) throw new Error('expected an index');

    expect(printed(index.querySelector('.coordinate'))).toBe(formatCoordinate(coordinateFor(first.id)));

    otherCard.dispatchEvent(new PointerEvent('pointerover', { bubbles: true }));
    const hovered = coordinateFor(other.id);
    expect(printed(index.querySelector('.coordinate'))).toBe(formatCoordinate(hovered));
    expect(locatedBook(index)).toBe(other.id);

    otherCard.dispatchEvent(
      new PointerEvent('pointerout', { bubbles: true, relatedTarget: document.body }),
    );
    expect(printed(index.querySelector('.coordinate'))).toBe(formatCoordinate(coordinateFor(first.id)));

    otherCard.focus();
    expect(printed(index.querySelector('.coordinate'))).toBe(formatCoordinate(hovered));
    otherCard.blur();
    expect(printed(index.querySelector('.coordinate'))).toBe(formatCoordinate(coordinateFor(first.id)));

    expect(dealtHrefs(view)).toEqual(books.map((book) => `#book=${book.id}`));
  });

  it('rests on the book the visitor last closed, a nearby one included', () => {
    const view = createWallOfLives(wallState(SEED, 'first', aNearby), {
      onSomethingStranger() {},
      onShowAll() {},
    });
    document.body.replaceChildren(view.element);
    const index = view.element.querySelector('.library-index')!;
    expect(locatedBook(index)).toBe(aNearby);
    expect(printed(index.querySelector('.coordinate'))).toBe(address(aNearby));

    const card = view.element.querySelectorAll<HTMLAnchorElement>('a.card')[2]!;
    card.focus();
    expect(locatedBook(index)).toBe(wallBooks('first', SEED)[2]!.id);
    card.blur();
    expect(locatedBook(index)).toBe(aNearby);
    // The wall itself is untouched: still only root cards.
    expect(dealtHrefs(view)).toEqual(wallBooks('first', SEED).map((book) => `#book=${book.id}`));
  });

  it('rests on the opening volume the anchors pin there, whatever the deal', () => {
    // The five pinned anchors open every wall, so the resting address is the
    // same on every visit by design. What the index must not do is invent an
    // address of its own: it prints the first card of this visit's deal.
    for (const seed of [SEED, OTHER_SEED, 0n]) {
      const view = createWallOfLives(wallState(seed), {
        onSomethingStranger() {},
        onShowAll() {},
      });
      const opening = wallBooks('first', seed)[0];
      if (!opening) throw new Error('expected a dealt wall');
      expect(opening.id).toBe(PINNED_ROOT_IDS[0]);
      expect(printed(view.element.querySelector('.library-index .coordinate'))).toBe(
        formatCoordinate(coordinateFor(opening.id)),
      );
    }
  });

  it('follows a different deal past the anchors on another visit', () => {
    const slot = PINNED_ROOT_IDS.length;
    const here = wallBooks('first', SEED)[slot];
    const there = wallBooks('first', OTHER_SEED)[slot];
    if (!here || !there) throw new Error('expected a dealt wall');
    // The first unpinned slot is what the shuffle actually decides.
    expect(here.id).not.toBe(there.id);

    const view = createWallOfLives(wallState(SEED), {
      onSomethingStranger() {},
      onShowAll() {},
    });
    document.body.replaceChildren(view.element);
    const card = view.element.querySelectorAll<HTMLAnchorElement>('a.card')[slot];
    if (!card) throw new Error('expected a card');
    card.focus();
    expect(printed(view.element.querySelector('.library-index .coordinate'))).toBe(
      formatCoordinate(coordinateFor(here.id)),
    );
  });

  it('gives keyboard focus precedence over a resting pointer and ignores touch hover', () => {
    const view = createWallOfLives(wallState(SEED), {
      onSomethingStranger() {}, onShowAll() {},
    });
    document.body.replaceChildren(view.element);
    const cards = view.element.querySelectorAll<HTMLAnchorElement>('a.card');
    const readout = () => printed(view.element.querySelector('.library-index .coordinate'));
    const opening = readout();
    cards[1]!.dispatchEvent(new PointerEvent('pointerover', { bubbles: true, pointerType: 'touch' }));
    expect(readout()).toBe(opening);
    cards[1]!.dispatchEvent(new PointerEvent('pointerover', { bubbles: true, pointerType: 'mouse' }));
    cards[2]!.focus();
    expect(readout()).toBe(formatCoordinate(coordinateFor(wallBooks('first', SEED)[2]!.id)));
  });
});
