/**
 * The shipped catalog, checked against the invariants the reading experience
 * relies on. These re-derive the rules rather than calling the validator, so a
 * loosened validator cannot make a broken catalog look sound.
 */

import { describe, expect, it } from 'vitest';
import {
  anotherLifeAfter,
  catalog,
  catalogFor,
  PINNED_ROOT_IDS,
  findBook,
  rootBooks,
  TOTAL_BOOKS,
  TOTAL_ROOTS,
  wallBooks,
} from '../src/library/catalog';
import { LOCALES } from '../src/content/locale';
import { MOTIF_NAMES } from '../src/views/illustrations';

const books = catalog.books;
/** One visit's deal, fixed so the assertions are about order, not luck. */
const SEED = 20260919n;

/**
 * The short form, as editorial limits rather than as today's measurements.
 * Floor: a passage shorter than this is a stub, not a short passage. Ceiling:
 * 110 is below 113, the shortest passage of the long-form era, so a pass that
 * drifts back toward it fails rather than passing in silence.
 *
 * Each edition is held to these independently. There is deliberately no rule
 * about one edition's length relative to the other: English and Spanish are
 * native literary editions, not translations trimmed toward a matching count.
 */
const PASSAGE_FLOOR = 30;
const PASSAGE_CEILING = 110;

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
  it('is seventy-five volumes: twenty-five lives and fifty variations', () => {
    expect(TOTAL_BOOKS).toBe(75);
    expect(TOTAL_ROOTS).toBe(25);
    expect(roots).toHaveLength(25);
    expect(nearby).toHaveLength(50);
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

  /**
   * The short-form guardrail of the blueprint, section 3, rule 10. These are
   * editorial limits with declared headroom, not a record of today's extremes:
   * the floor only catches a stub, and the ceiling sits below the minimum of the
   * long-form era this edition left, so drifting back toward it fails here.
   */
  it('keeps every passage inside the short form, in both editions', () => {
    for (const locale of LOCALES) {
      for (const book of catalogFor(locale).books) {
        const words = wordCount(book.passage);
        expect(words, `${locale} ${book.id}`).toBeGreaterThanOrEqual(PASSAGE_FLOOR);
        expect(words, `${locale} ${book.id}`).toBeLessThanOrEqual(PASSAGE_CEILING);
      }
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
  it('shows a curated opening twelve and a stranger remainder, and nothing twice', () => {
    expect(catalog.wall.first).toHaveLength(12);
    expect(catalog.wall.second).toHaveLength(13);
    const walled = [...catalog.wall.first, ...catalog.wall.second];
    expect(new Set(walled).size).toBe(25);
  });

  it('is exactly the set of root lives', () => {
    const walled = [...catalog.wall.first, ...catalog.wall.second].sort();
    expect(walled).toEqual(roots.map((book) => book.id).sort());
  });

  it('never offers a variation as a card of its own', () => {
    for (const book of wallBooks('all', SEED)) expect(book.kind).toBe('root');
    expect(wallBooks('first', SEED)).toHaveLength(12);
    expect(wallBooks('second', SEED)).toHaveLength(13);
    expect(wallBooks('all', SEED)).toHaveLength(25);
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

  it('never moves a card when the wall opens out to all twenty-five', () => {
    // The one thing a shuffled wall must not do is make cards jump.
    expect(ids(wallBooks('all', SEED))).toEqual([
      ...ids(wallBooks('first', SEED)),
      ...ids(wallBooks('second', SEED)),
    ]);
  });

  it('pins the five editorial anchors at the start of every opening wall', () => {
    for (let seed = 0n; seed < 20n; seed += 1n) {
      expect(ids(wallBooks('first', seed)).slice(0, PINNED_ROOT_IDS.length)).toEqual([
        ...PINNED_ROOT_IDS,
      ]);
    }
  });

  it('shuffles the other twenty lives and splits them without overlap', () => {
    const first = ids(wallBooks('first', SEED));
    const second = ids(wallBooks('second', SEED));
    const pinned = new Set<string>(PINNED_ROOT_IDS);
    const expectedRemainder = roots.map((book) => book.id).filter((id) => !pinned.has(id)).sort();

    expect(first).toHaveLength(12);
    expect(second).toHaveLength(13);
    expect(first.slice(PINNED_ROOT_IDS.length).length).toBe(7);
    expect(new Set([...first, ...second]).size).toBe(25);
    expect([...first.slice(PINNED_ROOT_IDS.length), ...second].sort()).toEqual(expectedRemainder);
  });

  it('deals differently from one visit to the next while keeping the anchors fixed', () => {
    const deals = new Set<string>();
    for (let seed = 0n; seed < 40n; seed += 1n) deals.add(ids(wallBooks('first', seed)).join());
    expect(deals.size).toBeGreaterThan(30);
  });

  it('makes the stranger wall exactly the unseen remainder of that visit', () => {
    const first = ids(wallBooks('first', SEED));
    const second = ids(wallBooks('second', SEED));
    const all = ids(wallBooks('all', SEED));
    expect(all).toEqual([...first, ...second]);
    expect(second.some((id) => first.includes(id))).toBe(false);
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
    for (let step = 0; step < 25; step += 1) {
      current = anotherLifeAfter(current).id;
      visited.push(current);
    }
    expect(new Set(visited).size).toBe(25);
    expect(visited[24]).toBe(start?.id);
  });

  it('reaches the same next life from a variation as from its root', () => {
    for (const book of nearby) {
      expect(anotherLifeAfter(book.id).id).toBe(anotherLifeAfter(book.rootId).id);
    }
  });
});
