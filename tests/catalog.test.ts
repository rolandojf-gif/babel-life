/**
 * The shipped catalog, checked against the invariants the reading experience
 * relies on. These re-derive the rules rather than calling the validator, so a
 * loosened validator cannot make a broken catalog look sound.
 */

import { describe, expect, it } from 'vitest';
import {
  anotherLifeAfter,
  catalog,
  findBook,
  rootBooks,
  TOTAL_BOOKS,
  TOTAL_ROOTS,
  wallBooks,
} from '../src/library/catalog';
import { MOTIF_NAMES } from '../src/views/illustrations';

const books = catalog.books;
/** One visit's deal, fixed so the assertions are about order, not luck. */
const SEED = 20260919n;

function ids(dealt: { id: string }[]): string[] {
  return dealt.map((book) => book.id);
}

const roots = books.filter((book) => book.kind === 'root');
const nearby = books.filter((book) => book.kind === 'nearby');

/** Paragraphs joined the way a reader meets them. */
function wordCount(passage: string[]): number {
  return passage.join(' ').split(/\s+/).filter(Boolean).length;
}

describe('the inventory', () => {
  it('is seventy-two volumes: twenty-four lives and forty-eight variations', () => {
    expect(TOTAL_BOOKS).toBe(72);
    expect(TOTAL_ROOTS).toBe(24);
    expect(roots).toHaveLength(24);
    expect(nearby).toHaveLength(48);
  });

  it('uses each accession number once, and never reuses a retired one', () => {
    // The numbering has gaps on purpose: IDs dropped in an earlier draft are
    // retired, not recycled, so an address published once never moves.
    const ids = books.map((book) => book.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^b\d{4}$/);
    const numbers = ids.map((id) => Number(id.slice(1))).sort((a, b) => a - b);
    expect(numbers[0]).toBeGreaterThanOrEqual(1);
    expect(new Set(numbers).size).toBe(numbers.length);
  });

  it('gives every life exactly two variations of its own', () => {
    for (const root of roots) {
      const variations = nearby.filter((book) => book.rootId === root.id);
      expect(variations).toHaveLength(2);
    }
    for (const book of nearby) {
      expect(findBook(book.rootId)?.kind).toBe('root');
      expect(book.rootId).not.toBe(book.id);
    }
  });

  it('draws every volume with an illustration that exists', () => {
    for (const book of books) {
      expect(MOTIF_NAMES).toContain(book.icon);
    }
  });
});

describe('the passages', () => {
  it('are authored text, never a placeholder', () => {
    for (const book of books) {
      expect(book.passage.length).toBeGreaterThan(0);
      for (const paragraph of book.passage) expect(paragraph.trim()).not.toBe('');
      expect(book.title.trim()).not.toBe('');
      expect(book.headline.trim()).not.toBe('');
      expect(book.aftertaste.trim()).not.toBe('');
    }
  });

  it('stay inside the editorial word count', () => {
    for (const book of books) {
      const words = wordCount(book.passage);
      expect(words).toBeGreaterThanOrEqual(70);
      expect(words).toBeLessThanOrEqual(160);
    }
  });

  it('never repeat: an identical account would be the same volume', () => {
    const passages = books.map((book) => book.passage.join('\n'));
    expect(new Set(passages).size).toBe(books.length);
    const titles = books.map((book) => book.title);
    expect(new Set(titles).size).toBe(books.length);
  });

  it('give each life on the wall its own premise', () => {
    const hooks = roots.map((book) => book.hook);
    expect(new Set(hooks).size).toBe(roots.length);
    for (const hook of hooks) expect(hook.trim()).not.toBe('');
  });
});

describe('the nearby edges', () => {
  it('offer exactly two destinations from every volume', () => {
    for (const book of books) expect(book.neighbors).toHaveLength(2);
  });

  it('stay inside one life, and say what differs', () => {
    for (const book of books) {
      const targets = book.neighbors.map((edge) => edge.targetBookId);
      expect(new Set(targets).size).toBe(targets.length);
      for (const edge of book.neighbors) {
        const target = findBook(edge.targetBookId);
        expect(target, `${book.id} → ${edge.targetBookId}`).toBeDefined();
        expect(edge.targetBookId).not.toBe(book.id);
        expect(target?.rootId).toBe(book.rootId);
        expect(edge.difference.trim()).not.toBe('');
      }
    }
  });

  it('let every volume of a life be reached from its root', () => {
    for (const root of roots) {
      const seen = new Set<string>();
      const queue = [root.id];
      while (queue.length > 0) {
        const id = queue.pop();
        if (id === undefined || seen.has(id)) continue;
        seen.add(id);
        for (const edge of findBook(id)?.neighbors ?? []) queue.push(edge.targetBookId);
      }
      const family = books.filter((book) => book.rootId === root.id).map((book) => book.id);
      expect([...seen].sort()).toEqual([...family].sort());
    }
  });
});

describe('the wall', () => {
  it('shows two curated sets of twelve, and nothing twice', () => {
    expect(catalog.wall.first).toHaveLength(12);
    expect(catalog.wall.second).toHaveLength(12);
    const walled = [...catalog.wall.first, ...catalog.wall.second];
    expect(new Set(walled).size).toBe(24);
  });

  it('is exactly the set of root lives', () => {
    const walled = [...catalog.wall.first, ...catalog.wall.second].sort();
    expect(walled).toEqual(roots.map((book) => book.id).sort());
  });

  it('never offers a variation as a card of its own', () => {
    for (const book of wallBooks('all', SEED)) expect(book.kind).toBe('root');
    expect(wallBooks('first', SEED)).toHaveLength(12);
    expect(wallBooks('second', SEED)).toHaveLength(12);
    expect(wallBooks('all', SEED)).toHaveLength(24);
    expect(ids(wallBooks('all', SEED)).sort()).toEqual(roots.map((book) => book.id).sort());
  });

  it('keeps the curated order, whatever the wall is dealt', () => {
    expect(rootBooks.map((book) => book.id)).toEqual([
      ...catalog.wall.first,
      ...catalog.wall.second,
    ]);
  });
});

describe('the order the wall is dealt in', () => {
  it('is the same every time it is asked for, within a visit', () => {
    expect(ids(wallBooks('first', SEED))).toEqual(ids(wallBooks('first', SEED)));
    expect(ids(wallBooks('all', SEED))).toEqual(ids(wallBooks('all', SEED)));
  });

  it('never moves a card when the wall opens out to all twenty-four', () => {
    // The one thing a shuffled wall must not do is make cards jump.
    expect(ids(wallBooks('all', SEED))).toEqual([
      ...ids(wallBooks('first', SEED)),
      ...ids(wallBooks('second', SEED)),
    ]);
  });

  it('shuffles inside each curated set and never between them', () => {
    expect(ids(wallBooks('first', SEED)).sort()).toEqual([...catalog.wall.first].sort());
    expect(ids(wallBooks('second', SEED)).sort()).toEqual([...catalog.wall.second].sort());
  });

  it('deals differently from one visit to the next', () => {
    const deals = new Set<string>();
    for (let seed = 0n; seed < 40n; seed += 1n) deals.add(ids(wallBooks('first', seed)).join());
    expect(deals.size).toBeGreaterThan(30);
  });

  it('says nothing about the second set from the first', () => {
    const first = ids(wallBooks('first', SEED));
    const shifted = ids(wallBooks('first', SEED + 1n));
    expect(ids(wallBooks('second', SEED))).not.toEqual(shifted);
    expect(first).not.toEqual(shifted);
  });
});

describe('another life', () => {
  it('always leads out of the life the visitor is reading', () => {
    for (const book of books) {
      expect(anotherLifeAfter(book.id).rootId).not.toBe(book.rootId);
    }
  });

  it('walks every life once and closes into a cycle', () => {
    const start = rootBooks[0];
    expect(start).toBeDefined();
    const visited: string[] = [];
    let current = start?.id ?? '';
    for (let step = 0; step < 24; step += 1) {
      current = anotherLifeAfter(current).id;
      visited.push(current);
    }
    expect(new Set(visited).size).toBe(24);
    expect(visited[23]).toBe(start?.id);
  });

  it('reaches the same next life from a variation as from its root', () => {
    for (const book of nearby) {
      expect(anotherLifeAfter(book.id).id).toBe(anotherLifeAfter(book.rootId).id);
    }
  });
});
