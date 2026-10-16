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
  it('orders every family as R:[A,B], A:[B,R], B:[R,A] for direct entries', () => {
    for (const root of catalog.books.filter((book) => book.kind === 'root')) {
      const aId = root.neighbors[0]!.targetBookId;
      const bId = root.neighbors[1]!.targetBookId;
      const a = findBook(aId)!;
      const b = findBook(bId)!;
      const destinations = (book: Book) =>
        [...createNearbyVolumes(book).querySelectorAll('.nearby__link:not(.nearby__link--crossing)')]
          .map((anchor) => anchor.getAttribute('href'));
      expect(destinations(root), root.id).toEqual([`#book=${aId}`, `#book=${bId}`]);
      expect(destinations(a), aId).toEqual([`#book=${bId}`, `#book=${root.id}`]);
      expect(destinations(b), bId).toEqual([`#book=${root.id}`, `#book=${aId}`]);
    }
  });

  it('moves an immediate return to the second position from either neighbor', () => {
    for (const book of catalog.books) {
      for (const edge of book.neighbors) {
        const section = createNearbyVolumes(book, edge.targetBookId);
        const links = [...section.querySelectorAll('.nearby__link:not(.nearby__link--crossing)')];
        expect(links).toHaveLength(2);
        expect(links[1]?.getAttribute('href'), book.id).toBe(`#book=${edge.targetBookId}`);
        expect(links[0]?.getAttribute('href')).not.toBe(`#book=${edge.targetBookId}`);
        expect(links[0]?.querySelector('.nearby__previous')).toBeNull();
        expect(links[1]?.querySelector('.nearby__previous')?.textContent).toBe('PREVIOUS');
      }
    }
  });

  it('never invents a previous mark on direct entry or on a cross-family jump', () => {
    const book = findBook('b0043')!;
    const direct = createNearbyVolumes(book);
    expect(direct.querySelector('.nearby__previous')).toBeNull();
    const remote = createNearbyVolumes(book, 'b0007');
    expect(remote.querySelector('.nearby__previous')).toBeNull();
    const crossings = [...remote.querySelectorAll('.nearby__link--crossing')];
    expect(crossings).toHaveLength(book.crossings?.length ?? 0);
  });

  it('retains the authored difference for every rotated neighbor', () => {
    for (const book of catalog.books) {
      const section = createNearbyVolumes(book, book.neighbors[0]!.targetBookId);
      const rows = [...section.querySelectorAll('.nearby__link:not(.nearby__link--crossing)')];
      for (const row of rows) {
        const id = row.getAttribute('href')?.slice('#book='.length);
        const edge = book.neighbors.find((item) => item.targetBookId === id);
        expect(edge, `${book.id} → ${id}`).toBeDefined();
        expect(row.querySelector('.nearby__difference')?.textContent).toBe(edge?.difference);
      }
    }
  });

});
