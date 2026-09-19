/**
 * @vitest-environment jsdom
 *
 * The shelf: thirty-two addresses, and what can be read among them. This is
 * where the shelfmark is meant to be felt — one shelf in the edition answers
 * "Two of them can be read." and the spines say which two.
 */

import { describe, expect, it } from 'vitest';
import { createShelfView } from '../src/views/ShelfView';
import { copy } from '../src/content/copy';
import { coordinateFor, shelfOf, SHELF_LENGTH } from '../src/library/coordinates';
import { findBook } from '../src/library/catalog';

const MOVED = 'b0071';
const BESIDE = 'b0007';

function spines(shelf: ReturnType<typeof shelfOf>): string[] {
  const view = createShelfView(shelf);
  return [...view.element.querySelectorAll('.shelf__spine')].map(
    (node) => node.textContent ?? '',
  );
}

describe('a shelf with one volume on it', () => {
  const shelf = shelfOf(coordinateFor('b0003'));

  it('stands thirty-two volumes, one of them readable', () => {
    const titles = spines(shelf);
    expect(titles).toHaveLength(SHELF_LENGTH);
    expect(titles.filter((title) => title !== copy.notLegible)).toEqual([
      findBook('b0003')?.title,
    ]);
  });

  it('says how many can be read', () => {
    const view = createShelfView(shelf);
    expect(view.element.textContent).toContain('One of them can be read.');
  });
});

describe('the shelfmarked shelf', () => {
  const shelf = shelfOf(coordinateFor(BESIDE));

  it('stands the two volumes next to each other', () => {
    const titles = spines(shelf);
    const readable = titles
      .map((title, index) => ({ title, volume: index + 1 }))
      .filter((entry) => entry.title !== copy.notLegible);

    expect(readable.map((entry) => entry.title)).toEqual([
      findBook(BESIDE)?.title,
      findBook(MOVED)?.title,
    ]);
    expect(readable[1]?.volume).toBe((readable[0]?.volume ?? 0) + 1);
  });

  it('says that two of them can be read', () => {
    const view = createShelfView(shelf);
    expect(view.element.textContent).toContain('Two of them can be read.');
  });

  it('links both spines to their volumes and the rest to their addresses', () => {
    const view = createShelfView(shelf);
    const legible = view.element.querySelectorAll('.shelf__link--legible');
    expect(legible).toHaveLength(2);
    expect(view.element.querySelectorAll('.shelf__link')).toHaveLength(SHELF_LENGTH);
  });
});
