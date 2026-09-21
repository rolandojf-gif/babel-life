/**
 * @vitest-environment jsdom
 *
 * The homepage index is a structural fragment: thirty-two volumes, five
 * shelves, a wall, and one real address. It does not invent the rest.
 */

import { describe, expect, it } from 'vitest';
import { copy } from '../src/content/copy';
import { PINNED_ROOT_IDS, wallBooks } from '../src/library/catalog';
import {
  coordinateFor,
  formatCoordinate,
  SHELF_LENGTH,
  SHELVES_PER_WALL,
} from '../src/library/coordinates';
import {
  createLibraryIndex,
  INDEX_MARK_HEIGHT,
  INDEX_MARK_WIDTH,
  locatorPosition,
  NARROW_INDEX,
  updateLibraryIndex,
  wallWidth,
  WIDE_INDEX,
} from '../src/views/libraryIndex';
import { createWallOfLives } from '../src/views/WallOfLives';
import type { AppState } from '../src/library/model';

const SEED = 20260919n;
const OTHER_SEED = 7n;

const known = {
  hexagon: 'A',
  wall: 2,
  shelf: 3,
  volume: 8,
};

function locator(index: HTMLElement, which: 'wide' | 'narrow'): SVGGElement {
  const group = index.querySelector(`.library-index__svg--${which} .library-index__locator`);
  if (!(group instanceof SVGGElement)) throw new Error(`missing ${which} locator`);
  return group;
}

function locatorPlacement(
  index: HTMLElement,
  which: 'wide' | 'narrow',
): { x: number; y: number; wall: number; shelf: number; volume: number } {
  const group = locator(index, which);
  const match = /^translate\(([-\d.]+)px,\s*([-\d.]+)px\)$/.exec(group.style.transform);
  if (!match?.[1] || !match[2]) throw new Error(`unexpected transform: ${group.style.transform}`);
  return {
    x: Number(match[1]),
    y: Number(match[2]),
    wall: Number(group.getAttribute('data-wall')),
    shelf: Number(group.getAttribute('data-shelf')),
    volume: Number(group.getAttribute('data-volume')),
  };
}

function printed(node: Element | null): string {
  return (node?.textContent ?? '').replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();
}

function dealtHrefs(view: { element: HTMLElement }): string[] {
  return [...view.element.querySelectorAll('a.card')].map((card) => card.getAttribute('href') ?? '');
}

function wallState(seed: bigint, selection: AppState['wallSelection'] = 'first'): AppState {
  return {
    view: 'wall',
    wallSelection: selection,
    wallSeed: seed,
    currentBookId: null,
    address: null,
    shelf: null,
  };
}

describe('the library index', () => {
  it('is not a control', () => {
    const index = createLibraryIndex(known);
    expect(index.querySelector('a, button, [href], [tabindex]')).toBeNull();
    expect(index.querySelector('.library-index__field')?.getAttribute('aria-hidden')).toBe('true');
    expect(index.querySelectorAll('svg[aria-hidden="true"]')).toHaveLength(2);
  });

  it('prints only the one real coordinate', () => {
    const index = createLibraryIndex(known);
    expect(printed(index.querySelector('.coordinate'))).toBe(formatCoordinate(known));
    expect(index.textContent).not.toContain(copy.lede);
  });

  it('marks the current volume on its shelf, and nowhere else', () => {
    const index = createLibraryIndex(known);
    const currents = [...index.querySelectorAll('.library-index__mark--current')];
    expect(currents).toHaveLength(2);
    expect(currents[0]?.getAttribute('width')).toBe(String(INDEX_MARK_WIDTH));
    expect(currents[0]?.getAttribute('height')).toBe(String(INDEX_MARK_HEIGHT));

    const wide = locatorPlacement(index, 'wide');
    const expected = locatorPosition(WIDE_INDEX, known);
    expect(wide).toEqual({ ...expected, wall: known.wall, shelf: known.shelf, volume: known.volume });
    expect(wide.x).toBeGreaterThan(locatorPosition(WIDE_INDEX, { ...known, wall: 1 }).x);

    const mobile = locatorPlacement(index, 'narrow');
    const onShelf = locatorPosition(NARROW_INDEX, known);
    expect(mobile).toEqual({ ...onShelf, wall: known.wall, shelf: known.shelf, volume: known.volume });
  });

  it('keeps the marker inside the three visible groups without changing the real address', () => {
    const index = createLibraryIndex({ hexagon: 'A', wall: 1, shelf: 1, volume: 1 });
    const xs = [1, 2, 3, 4].map((wall) => {
      const coordinate = { hexagon: 'A', wall, shelf: 1, volume: 1 };
      updateLibraryIndex(index, coordinate);
      const placed = locatorPlacement(index, 'wide');
      expect(placed.wall).toBe(wall);
      expect(placed).toMatchObject(locatorPosition(WIDE_INDEX, coordinate));
      return placed.x;
    });
    expect(xs[0]).toBeLessThan(xs[1] ?? Infinity);
    expect(xs[1]).toBeLessThan(xs[2] ?? Infinity);
    expect(xs[2]).toBe(xs[3]);
    expect(printed(index.querySelector('.coordinate'))).toContain('Wall 4');
  });

  it('moves the locator to another real coordinate without inventing one', () => {
    const index = createLibraryIndex(known);
    const next = { hexagon: 'Z', wall: 4, shelf: 5, volume: 32 };
    updateLibraryIndex(index, next);
    expect(printed(index.querySelector('.coordinate'))).toBe(formatCoordinate(next));
    expect(locatorPlacement(index, 'wide')).toEqual({
      ...locatorPosition(WIDE_INDEX, next),
      wall: next.wall,
      shelf: next.shelf,
      volume: next.volume,
    });
    expect(index.querySelector('a, button, [tabindex]')).toBeNull();
  });

  it('is built from thirty-two volumes and five shelves', () => {
    expect(SHELF_LENGTH).toBe(32);
    expect(SHELVES_PER_WALL).toBe(5);
    expect(wallWidth(WIDE_INDEX)).toBe(32 * INDEX_MARK_WIDTH + 31 * WIDE_INDEX.markGap);
    expect(WIDE_INDEX.columns).toBeGreaterThan(1);
    expect(WIDE_INDEX.rows).toBeGreaterThan(1);
    expect(NARROW_INDEX.columns).toBeGreaterThan(1);
    expect(NARROW_INDEX.rows).toBe(1);
    expect(WIDE_INDEX.columns).toBe(3);
    expect(WIDE_INDEX.width).toBe(354);
    expect(WIDE_INDEX.height).toBe(210);
    expect(NARROW_INDEX.height).toBe(112);
  });

  it('keeps an SVG fallback for the animated leader and avoids rebuilding an unchanged address', () => {
    const index = createLibraryIndex(known);
    const readout = index.querySelector('.coordinate')?.firstChild;
    updateLibraryIndex(index, known);
    expect(index.querySelector('.coordinate')?.firstChild).toBe(readout);
    updateLibraryIndex(index, { ...known, wall: 1, shelf: 5, volume: 32 });
    for (const leader of index.querySelectorAll<SVGElement>('.library-index__leader')) {
      expect(leader.style.getPropertyValue('d')).toBe(`path("${leader.getAttribute('d')}")`);
      expect(leader.getAttribute('d')).toMatch(/^M[\d.]+ [\d.]+H[\d.]+V[\d.]+$/);
    }
  });

  it('mirrors the leader line direction based on volume position within its wall', () => {
    const index = createLibraryIndex({ hexagon: 'A', wall: 1, shelf: 1, volume: 1 });

    function leaderDirection(which: 'wide' | 'narrow'): 'right' | 'left' {
      const svg = index.querySelector(`.library-index__svg--${which}`);
      const leader = svg?.querySelector('.library-index__leader');
      const d = leader?.getAttribute('d') ?? '';
      const parts = /^M([\d.]+) [\d.]+H([\d.]+)V[\d.]+$/.exec(d);
      if (!parts?.[1] || !parts[2]) throw new Error(`unexpected path: ${d}`);
      return Number(parts[2]) > Number(parts[1]) ? 'right' : 'left';
    }

    // Volume 1 is in the left half → leader should exit rightward.
    updateLibraryIndex(index, { hexagon: 'A', wall: 1, shelf: 1, volume: 1 });
    expect(leaderDirection('wide')).toBe('right');

    // Volume 32 is in the right half → leader should exit leftward.
    updateLibraryIndex(index, { hexagon: 'A', wall: 1, shelf: 1, volume: 32 });
    expect(leaderDirection('wide')).toBe('left');
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
    const address = coordinateFor(first.id);

    expect(view.element.querySelector('a.card')?.getAttribute('href')).toBe(`#book=${first.id}`);
    expect(printed(view.element.querySelector('.library-index .coordinate'))).toBe(
      formatCoordinate(address),
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
    expect(locatorPlacement(index, 'wide')).toMatchObject({
      wall: hovered.wall,
      shelf: hovered.shelf,
      volume: hovered.volume,
      ...locatorPosition(WIDE_INDEX, hovered),
    });

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
