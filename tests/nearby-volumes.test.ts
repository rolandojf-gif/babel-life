/**
 * @vitest-environment jsdom
 *
 * The nearby list: the two lives of the family, and a crossing into another
 * family marked as such before anything else is read.
 */

import { describe, expect, it } from 'vitest';
import { catalog, findBook } from '../src/library/catalog';
import type { Book } from '../src/library/model';
import { createNearbyVolumes } from '../src/views/NearbyVolumes';

function bookOutside(book: Book): Book {
  const other = catalog.books.find((candidate) => candidate.rootId !== book.rootId);
  if (!other) throw new Error('The catalog has a single family');
  return other;
}

describe('NearbyVolumes', () => {
  it('marks exactly the crossings each shipped book opens', () => {
    for (const book of catalog.books) {
      const section = createNearbyVolumes(book);
      expect(section.querySelectorAll('.nearby__link')).toHaveLength(
        book.neighbors.length + (book.crossings?.length ?? 0),
      );
      const crossings = book.crossings?.length ?? 0;
      expect(section.querySelectorAll('.nearby__family')).toHaveLength(crossings);
    }
  });

  it('labels a crossing and puts it after the two nearby lives', () => {
    const book = findBook('b0062')!;
    const other = bookOutside(book);
    const section = createNearbyVolumes({
      ...book,
      crossings: [{ targetBookId: other.id, difference: 'A passage out.' }],
    });
    const links = [...section.querySelectorAll('.nearby__link')];
    expect(links).toHaveLength(3);
    expect(links.slice(0, 2).every((link) => !link.querySelector('.nearby__family'))).toBe(true);
    const crossing = links[2]!;
    expect(crossing.classList.contains('nearby__link--crossing')).toBe(true);
    expect(crossing.getAttribute('href')).toBe(`#book=${other.id}`);
    expect(crossing.firstElementChild?.className).toBe('nearby__family');
    expect(crossing.querySelector('.nearby__family')?.textContent).toBe('ANOTHER FAMILY');
  });
});
