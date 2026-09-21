/**
 * The blueprint's frozen editorial map against the shipped catalog. Section 4 is
 * the source of truth for what the Library contains; the catalog is its
 * printing. Nothing but this test keeps the two from drifting apart in silence.
 *
 * Every count here is derived from the catalog rather than written down, so the
 * test survives the edition growing. The map is written in English; the Spanish
 * edition is held to it by identity and order, which `catalog.ts` checks at load
 * time, not by line.
 */

import { describe, expect, it } from 'vitest';
import blueprint from '../docs/BLUEPRINT.md?raw';
import { catalog, findBook, rootBooks } from '../src/library/catalog';

function lines(label: string): string[] {
  return [...blueprint.matchAll(new RegExp(`^${label}: (.+)$`, 'gm'))].map((match) =>
    (match[1] ?? '').trim(),
  );
}

const mapTitles = lines('TITLE');
const mapHooks = lines('WALL HOOK');
const mapNearbyA = lines('NEARBY A');
const mapNearbyB = lines('NEARBY B');

/** Both differences of every root book, in the order the book offers them. */
const catalogDifferences = rootBooks.map((book) =>
  book.neighbors.map((edge) => edge.difference),
);

describe('the frozen editorial map', () => {
  it('has one entry per narrative family, with both its nearby books', () => {
    expect(mapTitles).toHaveLength(rootBooks.length);
    expect(mapHooks).toHaveLength(rootBooks.length);
    expect(mapNearbyA).toHaveLength(rootBooks.length);
    expect(mapNearbyB).toHaveLength(rootBooks.length);
  });

  it('titles the lives exactly as the wall orders them', () => {
    expect(mapTitles).toEqual(rootBooks.map((book) => book.title));
  });

  it('gives them the premises the wall shows', () => {
    expect(mapHooks).toEqual(rootBooks.map((book) => book.hook));
  });

  it('names the differences the book offers, in order', () => {
    // The map used to count these lines without reading them, so the catalog
    // could reword a difference and the map would go on saying something else.
    expect(mapNearbyA).toEqual(catalogDifferences.map((pair) => pair[0]));
    expect(mapNearbyB).toEqual(catalogDifferences.map((pair) => pair[1]));
  });

  it('accounts for every book the catalog prints', () => {
    const nearby = mapNearbyA.length + mapNearbyB.length;
    expect(mapTitles.length + nearby).toBe(catalog.books.length);
    // Each mapped difference leads to a complete book of its own, never back to
    // a root: one complete life is one book, on both sides of the edge.
    for (const root of rootBooks) {
      for (const edge of root.neighbors) {
        expect(findBook(edge.targetBookId)?.kind).toBe('nearby');
      }
    }
  });
});

describe('the blueprint prose', () => {
  it('states the inventory the catalog actually holds', () => {
    const numbers = catalog.books.map((book) => Number(book.id.slice(1)));
    const first = 'b' + String(Math.min(...numbers)).padStart(4, '0');
    const last = 'b' + String(Math.max(...numbers)).padStart(4, '0');
    const roots = rootBooks.length;
    const nearby = catalog.books.length - roots;

    expect(blueprint).toContain('**Total:** ' + String(catalog.books.length) + ' books');
    expect(blueprint).toContain('`' + first + '`');
    expect(blueprint).toContain('`' + last + '`');
    // One complete life is one book, so the inventory is counted in books; the
    // three-book unit is a narrative family and is never called a life.
    expect(blueprint).toContain('**' + String(roots) + ' NARRATIVE FAMILIES**');
    expect(blueprint).toContain('**' + String(roots) + ' ROOT BOOKS**');
    expect(blueprint).toContain('**' + String(nearby) + ' NEARBY BOOKS**');
  });

  it('names every accession number retired from the range', () => {
    // A retired ID is never reused, so the gaps are part of the inventory and
    // the blueprint has to list the ones it claims are deliberate.
    const numbers = new Set(catalog.books.map((book) => Number(book.id.slice(1))));
    const low = Math.min(...numbers);
    const high = Math.max(...numbers);
    for (let n = low; n <= high; n += 1) {
      if (numbers.has(n)) continue;
      expect(blueprint).toContain('`b' + String(n).padStart(4, '0') + '`');
    }
  });

  it('states the schema version the catalog carries', () => {
    expect(blueprint).toContain(`schemaVersion: ${String(catalog.schemaVersion)}`);
  });
});
