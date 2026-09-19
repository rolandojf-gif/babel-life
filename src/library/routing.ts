/**
 * Hash routes. The empty hash is the wall and `#book=b0003` is a volume by its
 * accession number; `#shelf=` and `#volume=` address the Library by position, so
 * a shelf can be walked whether or not this edition can print what stands on it.
 * Anything else is an address the Library does not have.
 */

import type { Coordinate, ShelfCoordinate } from './coordinates';

export type Route =
  | { kind: 'wall' }
  | { kind: 'book'; bookId: string }
  | { kind: 'shelf'; shelf: ShelfCoordinate }
  | { kind: 'address'; coordinate: Coordinate }
  | { kind: 'unknown' };

const BOOK_ROUTE = /^#book=(b\d{4})$/;
const SHELF_ROUTE = /^#shelf=([0-9A-Z]+)-(\d+)-(\d+)$/;
const VOLUME_ROUTE = /^#volume=([0-9A-Z]+)-(\d+)-(\d+)-(\d+)$/;

export function parseRoute(hash: string): Route {
  if (hash === '' || hash === '#') return { kind: 'wall' };

  const bookId = BOOK_ROUTE.exec(hash)?.[1];
  if (bookId !== undefined) return { kind: 'book', bookId };

  const shelf = SHELF_ROUTE.exec(hash);
  if (shelf?.[1] !== undefined && shelf[2] !== undefined && shelf[3] !== undefined) {
    return {
      kind: 'shelf',
      shelf: { hexagon: shelf[1], wall: Number(shelf[2]), shelf: Number(shelf[3]) },
    };
  }

  const volume = VOLUME_ROUTE.exec(hash);
  if (
    volume?.[1] !== undefined &&
    volume[2] !== undefined &&
    volume[3] !== undefined &&
    volume[4] !== undefined
  ) {
    return {
      kind: 'address',
      coordinate: {
        hexagon: volume[1],
        wall: Number(volume[2]),
        shelf: Number(volume[3]),
        volume: Number(volume[4]),
      },
    };
  }

  return { kind: 'unknown' };
}

export const WALL_HASH = '#';

export function hashForBook(bookId: string): string {
  return `#book=${bookId}`;
}

export function hashForShelf(shelf: ShelfCoordinate): string {
  return `#shelf=${shelf.hexagon}-${String(shelf.wall)}-${String(shelf.shelf)}`;
}

export function hashForAddress(coordinate: Coordinate): string {
  return `#volume=${coordinate.hexagon}-${String(coordinate.wall)}-${String(coordinate.shelf)}-${String(coordinate.volume)}`;
}
