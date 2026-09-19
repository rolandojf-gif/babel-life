/** Hash routes: what the Library answers to, and what it does not. */

import { describe, expect, it } from 'vitest';
import {
  hashForAddress,
  hashForBook,
  hashForShelf,
  parseRoute,
  WALL_HASH,
} from '../src/library/routing';
import { coordinateFor, shelfOf } from '../src/library/coordinates';
import { catalog } from '../src/library/catalog';

describe('the routes the Library answers to', () => {
  it('reads an empty hash as the wall', () => {
    expect(parseRoute('')).toEqual({ kind: 'wall' });
    expect(parseRoute('#')).toEqual({ kind: 'wall' });
    expect(parseRoute(WALL_HASH)).toEqual({ kind: 'wall' });
  });

  it('reads a volume by its accession number', () => {
    expect(parseRoute('#book=b0003')).toEqual({ kind: 'book', bookId: 'b0003' });
  });

  it('reads a shelf by its three fields', () => {
    expect(parseRoute('#shelf=7CLC5G73UUZ-4-2')).toEqual({
      kind: 'shelf',
      shelf: { hexagon: '7CLC5G73UUZ', wall: 4, shelf: 2 },
    });
  });

  it('reads an address by its four', () => {
    expect(parseRoute('#volume=7CLC5G73UUZ-4-2-15')).toEqual({
      kind: 'address',
      coordinate: { hexagon: '7CLC5G73UUZ', wall: 4, shelf: 2, volume: 15 },
    });
  });
});

describe('the routes it does not', () => {
  it('rejects anything else as an address it does not have', () => {
    const strangers = [
      '#nowhere',
      '#book=',
      '#book=b3',
      '#book=b00003',
      '#book=B0003',
      '#book=b0003x',
      '#shelf=7CLC5G73UUZ-4',
      '#shelf=7clc5g73uuz-4-2',
      '#shelf=7CLC5G73UUZ-4-2-15',
      '#volume=7CLC5G73UUZ-4-2',
      '#volume=7CLC5G73UUZ-4-2-15-1',
      '#volume=7CLC5G73UUZ--2-15',
      '#real',
      '##',
    ];
    for (const hash of strangers) {
      expect(parseRoute(hash), hash).toEqual({ kind: 'unknown' });
    }
  });
});

describe('the hashes the views write', () => {
  it('round-trip through the parser for every volume of the edition', () => {
    for (const book of catalog.books) {
      expect(parseRoute(hashForBook(book.id))).toEqual({ kind: 'book', bookId: book.id });

      const address = coordinateFor(book.id);
      expect(parseRoute(hashForAddress(address))).toEqual({ kind: 'address', coordinate: address });

      const shelf = shelfOf(address);
      expect(parseRoute(hashForShelf(shelf))).toEqual({ kind: 'shelf', shelf });
    }
  });
});
