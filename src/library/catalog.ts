import catalogData from '../content/catalog.json';
import type { Book, Catalog, RootBook, WallSelection } from './model';

const BOOK_ID = /^b\d{4}$/;

/** Exactly two nearby volumes hang off every root life. */
const NEARBY_PER_ROOT = 2;

/**
 * Rejects an unusable catalog at load time: bad ID syntax, duplicate identities,
 * unresolved or cross-family nearby edges, a root without its two variations, or
 * a wall that is not exactly the set of root lives.
 *
 * Exported so the rejection paths can be exercised against hand-built catalogs;
 * the application only ever calls it on the shipped one, below.
 */
export function validate(data: Catalog): Catalog {
  if (data.schemaVersion !== 3) {
    throw new Error(`Unsupported catalog schemaVersion: ${String(data.schemaVersion)}`);
  }

  const books = new Map<string, Book>();
  for (const book of data.books) {
    if (!BOOK_ID.test(book.id)) throw new Error(`Invalid book id: ${book.id}`);
    if (books.has(book.id)) throw new Error(`Duplicate book id: ${book.id}`);
    if (book.passage.length === 0 || book.passage.some((p) => p.trim() === '')) {
      throw new Error(`Empty paragraph in book: ${book.id}`);
    }
    if (book.headline.trim() === '') throw new Error(`Book ${book.id} has no headline`);
    if (book.title.trim() === '') throw new Error(`Book ${book.id} has no title`);
    if (book.aftertaste.trim() === '') throw new Error(`Book ${book.id} has no aftertaste`);
    if (book.kind === 'root') {
      if (book.rootId !== book.id) throw new Error(`Root ${book.id} is not its own root`);
      if (book.hook.trim() === '') throw new Error(`Root ${book.id} has no wall hook`);
    } else if (book.rootId === book.id) {
      throw new Error(`Nearby volume ${book.id} is its own root`);
    }
    books.set(book.id, book);
  }

  for (const book of data.books) {
    const root = books.get(book.rootId);
    if (!root || root.kind !== 'root') throw new Error(`Book ${book.id} has no root life`);

    if (book.neighbors.length !== NEARBY_PER_ROOT) {
      throw new Error(`Book ${book.id} offers ${String(book.neighbors.length)} nearby volumes`);
    }
    const targets = new Set<string>();
    for (const edge of book.neighbors) {
      const target = books.get(edge.targetBookId);
      if (edge.targetBookId === book.id) throw new Error(`Book ${book.id} links to itself`);
      if (targets.has(edge.targetBookId)) throw new Error(`Book ${book.id} repeats ${edge.targetBookId}`);
      if (!target) throw new Error(`Book ${book.id} links to unknown ${edge.targetBookId}`);
      // Adjacency, never thematic association: an edge stays inside one life.
      if (target.rootId !== book.rootId) {
        throw new Error(`Book ${book.id} links outside its root life to ${edge.targetBookId}`);
      }
      if (edge.difference.trim() === '') throw new Error(`Book ${book.id} has an unlabelled edge`);
      targets.add(edge.targetBookId);
    }
  }

  const roots = data.books.filter((book): book is RootBook => book.kind === 'root');
  for (const root of roots) {
    const variations = data.books.filter(
      (book) => book.kind === 'nearby' && book.rootId === root.id,
    );
    if (variations.length !== NEARBY_PER_ROOT) {
      throw new Error(`Root ${root.id} has ${String(variations.length)} nearby volumes`);
    }
  }

  const walled = [...data.wall.first, ...data.wall.second];
  if (new Set(walled).size !== walled.length) throw new Error('A book appears twice on the wall');
  if (walled.length !== roots.length) throw new Error('The wall is not the set of root lives');
  for (const id of walled) {
    const book = books.get(id);
    if (!book) throw new Error(`The wall lists unknown book ${id}`);
    // A variation is discovered from inside a book, never offered as its own card.
    if (book.kind !== 'root') throw new Error(`The wall lists nearby volume ${id}`);
  }

  return data;
}

export const catalog: Catalog = validate(catalogData as Catalog);

export function findBook(id: string): Book | undefined {
  return catalog.books.find((book) => book.id === id);
}

/** The root lives, in the canonical editorial order of the wall. */
export const rootBooks: RootBook[] = [...catalog.wall.first, ...catalog.wall.second].map((id) => {
  const book = findBook(id);
  if (!book || book.kind !== 'root') throw new Error(`The wall lists unknown root ${id}`);
  return book;
});

/** The root lives the wall shows for a given selection, in their curated order. */
export function wallBooks(selection: WallSelection): RootBook[] {
  if (selection === 'all') return rootBooks;
  const ids = selection === 'first' ? catalog.wall.first : catalog.wall.second;
  return ids.map((id) => {
    const book = findBook(id);
    if (!book || book.kind !== 'root') throw new Error(`The wall lists unknown root ${id}`);
    return book;
  });
}

export const TOTAL_BOOKS = catalog.books.length;
export const TOTAL_ROOTS = rootBooks.length;

/**
 * The next life to offer from a book: the root life following this one's own in
 * the wall order, so the visitor is never handed a variation of the same page.
 * Deterministic, and it closes into a cycle rather than ending.
 */
export function anotherLifeAfter(bookId: string): RootBook {
  const book = findBook(bookId);
  const from = book ? rootBooks.findIndex((root) => root.id === book.rootId) : -1;
  const next = rootBooks[(Math.max(from, 0) + 1) % rootBooks.length];
  if (!next) throw new Error('The catalog has no root lives');
  return next;
}
