/**
 * The address space. Every expected value here was derived independently of the
 * module under test (plain modular arithmetic, worked out separately) so that a
 * formatter that drifts cannot quietly redefine what it is supposed to produce.
 */

import { describe, expect, it } from 'vitest';
import {
  accessionAt,
  coordinateAt,
  coordinateFields,
  coordinateFor,
  formatCoordinate,
  LAST_HEXAGON,
  positionFor,
  positionOf,
  SHELF_LENGTH,
  shelfFields,
  shelfOf,
  shelfVolumes,
  step,
  type Coordinate,
} from '../src/library/coordinates';
import { catalog } from '../src/library/catalog';

const MASK_64 = (1n << 64n) - 1n;
const MULTIPLIER = 11400714819323198485n;
const INCREMENT = 1442695040888963407n;

const bookIds = catalog.books.map((book) => book.id);

/** The published address of a volume, worked out without touching the module. */
function expectedPosition(accession: bigint): bigint {
  return (accession * MULTIPLIER + INCREMENT) & MASK_64;
}

/** An address inside a given hexagon, by its offset among the 640 positions. */
function addressAt(hexagon: string, offset: number): Coordinate {
  return {
    hexagon,
    wall: Math.floor(offset / 160) + 1,
    shelf: Math.floor((offset % 160) / 32) + 1,
    volume: (offset % 32) + 1,
  };
}

describe('the accession mapping', () => {
  it('places a volume where the published arithmetic says it does', () => {
    expect(positionFor('b0002')).toBe(5797380605825808761n);
    expect(positionFor('b0003')).toBe(17198095425149007246n);
    expect(positionFor('b0082')).toBe(13964106539913658377n);
  });

  it('agrees with the formula for every volume in the edition', () => {
    for (const id of bookIds) {
      const accession = BigInt(id.slice(1));
      expect(positionFor(id)).toBe(expectedPosition(accession));
    }
  });

  it('refuses anything that is not an accession number', () => {
    for (const bad of ['b3', 'b00003', 'B0003', '0003', 'b003x', '']) {
      expect(() => positionFor(bad)).toThrow(/Not an accession number/);
    }
  });
});

describe('the mapping read backwards', () => {
  it('returns every volume of the edition to its own accession number', () => {
    for (const id of bookIds) {
      expect(accessionAt(positionFor(id))).toBe(id);
    }
  });

  it('holds across the whole registry, printed or not', () => {
    for (let accession = 1n; accession <= 9999n; accession += 1n) {
      const id = `b${accession.toString().padStart(4, '0')}`;
      expect(accessionAt(expectedPosition(accession))).toBe(id);
    }
  });

  it('names no volume outside the registry', () => {
    expect(accessionAt(expectedPosition(0n))).toBeUndefined();
    expect(accessionAt(expectedPosition(10000n))).toBeUndefined();
    expect(accessionAt(expectedPosition(1n << 40n))).toBeUndefined();
  });
});

describe('the four fields', () => {
  it('reads the published address of a known volume', () => {
    expect(coordinateFor('b0002')).toEqual({
      hexagon: '2H6XQTFPPSA',
      wall: 1,
      shelf: 4,
      volume: 26,
    });
    expect(coordinateFor('b0003')).toEqual({
      hexagon: '7CLC5G73UUZ',
      wall: 4,
      shelf: 2,
      volume: 15,
    });
    expect(coordinateFor('b0082')).toEqual({
      hexagon: '5YU5RULON1V',
      wall: 1,
      shelf: 5,
      volume: 10,
    });
  });

  it('keeps every field of every volume inside its stated range', () => {
    for (const id of bookIds) {
      const address = coordinateFor(id);
      expect(address.hexagon).toMatch(/^[1-9A-Z][0-9A-Z]*$|^0$/);
      expect(address.wall).toBeGreaterThanOrEqual(1);
      expect(address.wall).toBeLessThanOrEqual(4);
      expect(address.shelf).toBeGreaterThanOrEqual(1);
      expect(address.shelf).toBeLessThanOrEqual(5);
      expect(address.volume).toBeGreaterThanOrEqual(1);
      expect(address.volume).toBeLessThanOrEqual(SHELF_LENGTH);
    }
  });

  it('gives the same volume the same address every time it is asked', () => {
    for (const id of bookIds) {
      expect(coordinateFor(id)).toEqual(coordinateFor(id));
    }
  });

  it('gives no two volumes the same address', () => {
    const printed = bookIds.map((id) => formatCoordinate(coordinateFor(id)));
    expect(new Set(printed).size).toBe(bookIds.length);
  });

  it('prints the address unpadded, in reading order', () => {
    expect(formatCoordinate(coordinateFor('b0003'))).toBe(
      'Hexagon 7CLC5G73UUZ · Wall 4 · Shelf 2 · Volume 15',
    );
    for (const id of bookIds) {
      expect(formatCoordinate(coordinateFor(id))).toMatch(
        /^Hexagon [0-9A-Z]+ · Wall [1-4] · Shelf [1-5] · Volume ([1-9]|[12]\d|3[0-2])$/,
      );
    }
  });

  it('hands the fields to a view in reading order', () => {
    expect(coordinateFields(coordinateFor('b0003')).map((field) => field.name)).toEqual([
      'Hexagon',
      'Wall',
      'Shelf',
      'Volume',
    ]);
    expect(shelfFields(shelfOf(coordinateFor('b0003')))).toEqual([
      { name: 'Hexagon', value: '7CLC5G73UUZ' },
      { name: 'Wall', value: '4' },
      { name: 'Shelf', value: '2' },
    ]);
  });
});

describe('an address read from the URL', () => {
  it('resolves to the position it names, and back again', () => {
    for (const position of [0n, 1n, 159n, 160n, 639n, 640n, 123456789n, MASK_64]) {
      const address = coordinateAt(position);
      expect(positionOf(address)).toBe(position);
    }
  });

  it('accepts one spelling of a hexagon and no other', () => {
    const address = coordinateFor('b0003');
    expect(positionOf(address)).toBeDefined();
    expect(positionOf({ ...address, hexagon: address.hexagon.toLowerCase() })).toBeUndefined();
    expect(positionOf({ ...address, hexagon: `0${address.hexagon}` })).toBeUndefined();
    expect(positionOf({ ...address, hexagon: '' })).toBeUndefined();
    expect(positionOf({ ...address, hexagon: '7CLC5G73UU!' })).toBeUndefined();
  });

  it('refuses a field outside the shape of the Library', () => {
    const address = coordinateFor('b0003');
    for (const broken of [
      { wall: 0 },
      { wall: 5 },
      { shelf: 0 },
      { shelf: 6 },
      { volume: 0 },
      { volume: 33 },
      { wall: 1.5 },
      { volume: Number.NaN },
    ]) {
      expect(positionOf({ ...address, ...broken })).toBeUndefined();
    }
  });

  it('refuses a hexagon past the end of the space', () => {
    const beyond = (LAST_HEXAGON + 1n).toString(36).toUpperCase();
    expect(positionOf({ hexagon: beyond, wall: 1, shelf: 1, volume: 1 })).toBeUndefined();
  });
});

describe('walking the shelves', () => {
  it('steps one address at a time', () => {
    const address = coordinateFor('b0003');
    const position = positionOf(address);
    expect(position).toBeDefined();
    expect(step(address, 1n)).toEqual(coordinateAt((position ?? 0n) + 1n));
    expect(step(address, -1n)).toEqual(coordinateAt((position ?? 0n) - 1n));
  });

  it('wraps at both ends of the space rather than falling off it', () => {
    expect(step(coordinateAt(0n), -1n)).toEqual(coordinateAt(MASK_64));
    expect(step(coordinateAt(MASK_64), 1n)).toEqual(coordinateAt(0n));
  });

  it('lays out thirty-two addresses on a shelf, in order', () => {
    const shelf = shelfOf(coordinateFor('b0003'));
    const addresses = shelfVolumes(shelf);
    expect(addresses).toHaveLength(SHELF_LENGTH);
    expect(addresses.map((address) => address.volume)).toEqual(
      Array.from({ length: SHELF_LENGTH }, (_, index) => index + 1),
    );
    for (const address of addresses) {
      expect(shelfOf(address)).toEqual(shelf);
    }
  });

  it('leaves every printed volume standing alone on its shelf', () => {
    // The shelf view says "One of them can be read." This is why that is true.
    for (const id of bookIds) {
      const legible = shelfVolumes(shelfOf(coordinateFor(id)))
        .map((address) => positionOf(address))
        .filter((position) => position !== undefined)
        .map((position) => accessionAt(position))
        .filter((accession) => accession !== undefined && bookIds.includes(accession));
      expect(legible).toEqual([id]);
    }
  });
});

describe('the final hexagon', () => {
  const lastHexagon = '7VSWWONAMAU';

  it('is the last one the space reaches', () => {
    expect(LAST_HEXAGON.toString(36).toUpperCase()).toBe(lastHexagon);
    expect(coordinateAt(MASK_64)).toEqual({
      hexagon: lastHexagon,
      wall: 2,
      shelf: 3,
      volume: 32,
    });
  });

  it('holds 256 of its 640 positions', () => {
    for (let offset = 0; offset < 256; offset += 1) {
      const position = positionOf(addressAt(lastHexagon, offset));
      expect(position).toBeDefined();
      expect(position ?? 0n).toBeLessThanOrEqual(MASK_64);
    }
  });

  it('shelves nothing printable in the 384 addresses past the end', () => {
    // A documented quirk: those addresses are accepted and read as illegible
    // rather than rejected outright. No volume of the edition hides there.
    for (let offset = 256; offset < 640; offset += 1) {
      const position = positionOf(addressAt(lastHexagon, offset));
      expect(position).toBeDefined();
      const accession = accessionAt(position ?? 0n);
      expect(accession === undefined || !bookIds.includes(accession)).toBe(true);
    }
  });
});
