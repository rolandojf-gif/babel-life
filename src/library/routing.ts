/**
 * Hash routes: the empty hash is the chooser, `#book=b0003` is a book. Anything
 * else is an address this edition does not contain.
 */

export type Route =
  | { kind: 'chooser' }
  | { kind: 'book'; bookId: string }
  | { kind: 'unknown' };

const BOOK_ROUTE = /^#book=(b\d{4})$/;

export function parseRoute(hash: string): Route {
  if (hash === '' || hash === '#') return { kind: 'chooser' };
  const bookId = BOOK_ROUTE.exec(hash)?.[1];
  if (bookId !== undefined) return { kind: 'book', bookId };
  return { kind: 'unknown' };
}

export const CHOOSER_HASH = '';

export function hashForBook(bookId: string): string {
  return `#book=${bookId}`;
}
