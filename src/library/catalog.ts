import catalogData from '../content/catalog.json';
import type { Book, Catalog, Cluster, WallSelection } from './model';

const BOOK_ID = /^b\d{4}$/;

/**
 * Rejects an unusable catalog at load time: bad ID syntax, duplicate identities,
 * unresolved nearby edges, dead ends, or wall sets that do not partition the books.
 */
function validate(data: Catalog): Catalog {
  if (data.schemaVersion !== 2) {
    throw new Error(`Unsupported catalog schemaVersion: ${String(data.schemaVersion)}`);
  }

  const clusters = new Set<string>();
  for (const cluster of data.clusters) {
    if (clusters.has(cluster.id)) throw new Error(`Duplicate cluster id: ${cluster.id}`);
    clusters.add(cluster.id);
  }

  const books = new Map<string, Book>();
  for (const book of data.books) {
    if (!BOOK_ID.test(book.id)) throw new Error(`Invalid book id: ${book.id}`);
    if (books.has(book.id)) throw new Error(`Duplicate book id: ${book.id}`);
    if (!clusters.has(book.clusterId)) throw new Error(`Book ${book.id} has unknown cluster`);
    if (book.passage.length === 0 || book.passage.some((p) => p.trim() === '')) {
      throw new Error(`Empty paragraph in book: ${book.id}`);
    }
    if (book.hook.trim() === '') throw new Error(`Book ${book.id} has no wall hook`);
    if (book.headline.trim() === '') throw new Error(`Book ${book.id} has no headline`);
    books.set(book.id, book);
  }

  for (const book of data.books) {
    if (book.neighbors.length < 2 || book.neighbors.length > 4) {
      throw new Error(`Book ${book.id} offers ${String(book.neighbors.length)} nearby volumes`);
    }
    const targets = new Set<string>();
    for (const edge of book.neighbors) {
      if (edge.targetBookId === book.id) throw new Error(`Book ${book.id} links to itself`);
      if (targets.has(edge.targetBookId)) throw new Error(`Book ${book.id} repeats ${edge.targetBookId}`);
      if (!books.has(edge.targetBookId)) throw new Error(`Book ${book.id} links to unknown ${edge.targetBookId}`);
      if (edge.difference.trim() === '') throw new Error(`Book ${book.id} has an unlabelled edge`);
      targets.add(edge.targetBookId);
    }
  }

  const walled = [...data.wall.first, ...data.wall.second];
  if (new Set(walled).size !== walled.length) throw new Error('A book appears twice on the wall');
  if (walled.length !== books.size) throw new Error('The wall sets do not cover the catalog');
  for (const id of walled) {
    if (!books.has(id)) throw new Error(`The wall lists unknown book ${id}`);
  }

  return data;
}

export const catalog: Catalog = validate(catalogData as Catalog);

export function findBook(id: string): Book | undefined {
  return catalog.books.find((book) => book.id === id);
}

export function findCluster(id: string): Cluster | undefined {
  return catalog.clusters.find((cluster) => cluster.id === id);
}

/** The books the wall shows for a given selection, in their curated order. */
export function wallBooks(selection: WallSelection): Book[] {
  const ids =
    selection === 'first'
      ? catalog.wall.first
      : selection === 'second'
        ? catalog.wall.second
        : [...catalog.wall.first, ...catalog.wall.second];
  return ids.map((id) => {
    const book = findBook(id);
    if (!book) throw new Error(`The wall lists unknown book ${id}`);
    return book;
  });
}

export const TOTAL_BOOKS = catalog.books.length;

/**
 * The next life to offer from a book: the following volume in the wall order
 * whose cluster differs, so the visitor is never handed a near-identical page.
 * Deterministic, and it closes into a cycle rather than ending.
 */
export function anotherLifeAfter(bookId: string): Book {
  const order = wallBooks('all');
  const from = order.findIndex((book) => book.id === bookId);
  const current = from === -1 ? undefined : order[from];
  for (let step = 1; step <= order.length; step += 1) {
    const candidate = order[(Math.max(from, 0) + step) % order.length];
    if (candidate && candidate.clusterId !== current?.clusterId) return candidate;
  }
  const fallback = order[0];
  if (!fallback) throw new Error('The catalog is empty');
  return fallback;
}
