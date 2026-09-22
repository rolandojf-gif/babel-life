/**
 * The Library address of a book, and the address space around it. The mapping of
 * an accession number to an address is a bijection over the full 64-bit space, so
 * it runs both ways: every address resolves to exactly one accession number, and
 * almost none of those numbers belongs to a volume this edition can print. One
 * pair of addresses is transposed by hand; see the shelfmark below.
 */

import { copy } from '../content/copy';

const MASK_64 = (1n << 64n) - 1n;
const MULTIPLIER = 11400714819323198485n;
const INCREMENT = 1442695040888963407n;
/** The multiplier is odd, so it is invertible mod 2^64. This is its inverse. */
const MULTIPLIER_INVERSE = 17428512612931826493n;

const VOLUMES_PER_SHELF = 32n;
export const SHELVES_PER_WALL = 5;
const WALLS_PER_HEXAGON = 4n;
const VOLUMES_PER_WALL = BigInt(SHELVES_PER_WALL) * VOLUMES_PER_SHELF; // 160
const POSITIONS_PER_HEXAGON = WALLS_PER_HEXAGON * VOLUMES_PER_WALL; // 640

export const SHELF_LENGTH = Number(VOLUMES_PER_SHELF);
export const LAST_HEXAGON = MASK_64 / POSITIONS_PER_HEXAGON;

export interface Coordinate {
  /** Uppercase base 36, unpadded. */
  hexagon: string;
  /** 1-4 */
  wall: number;
  /** 1-5 */
  shelf: number;
  /** 1-32 */
  volume: number;
}

/** An address with the volume left off: one shelf of thirty-two. */
export type ShelfCoordinate = Omit<Coordinate, 'volume'>;

const BASE_36 = /^[0-9A-Z]+$/;

/** Base 36 the way `toString(36)` writes it, read back into a BigInt. */
function parseBase36(text: string): bigint | undefined {
  if (!BASE_36.test(text)) return undefined;
  let value = 0n;
  for (const character of text) {
    const digit = BigInt(Number.parseInt(character, 36));
    value = value * 36n + digit;
  }
  // One address, one spelling: reject leading zeros and lower case.
  return value.toString(36).toUpperCase() === text ? value : undefined;
}

/** Parses the decimal accession number out of an ID of the form b0003. */
function accessionNumber(bookId: string): bigint {
  const digits = /^b(\d{4})$/.exec(bookId)?.[1];
  if (digits === undefined) throw new Error(`Not an accession number: ${bookId}`);
  return BigInt(digits);
}

/** Where the arithmetic alone puts an accession number. */
function scatter(accession: bigint): bigint {
  return (accession * MULTIPLIER + INCREMENT) & MASK_64;
}

/** Which accession number the arithmetic alone puts at an address. */
function unscatter(position: bigint): bigint {
  return ((position - INCREMENT) * MULTIPLIER_INVERSE) & MASK_64;
}

/** A volume moved to stand beside another, and the address it left behind. */
interface Shelfmark {
  readonly bookId: string;
  readonly beside: string;
  /** Places to the right of that volume; negative for the left. */
  readonly places: bigint;
}

/**
 * One shelf in this edition holds two volumes that can be read. The arithmetic
 * cannot produce that: it scatters eighty-one accession numbers across 2^64
 * addresses, and the chance of any two landing among the same thirty-two is
 * around one in 10^14. So it was done by hand, once, and frozen.
 *
 * Two volumes (b0071 and b0007) stand side by side for no reason but an
 * archivist's decision. They share no wording and no edge, so what a visitor
 * finds there is what the Library is like — nearby on the shelf and nearby in
 * the text have nothing to do with each other.
 */
const SHELFMARKS: readonly Shelfmark[] = [{ bookId: 'b0071', beside: 'b0007', places: 1n }];

/**
 * The shelfmarks as a transposition of the address space: each moved volume's
 * old address and its new one exchange occupants. Applied on the way in and on
 * the way out, so the mapping stays a bijection and every address still holds
 * exactly one volume — one of them now holding the unreadable volume that used
 * to stand where the moved one does.
 */
const TRANSPOSED: ReadonlyMap<bigint, bigint> = new Map(
  SHELFMARKS.flatMap((mark) => {
    const home = scatter(accessionNumber(mark.bookId));
    const shelved = (scatter(accessionNumber(mark.beside)) + mark.places) & MASK_64;
    return [
      [home, shelved],
      [shelved, home],
    ] as [bigint, bigint][];
  }),
);

/** The flat 64-bit position an accession number occupies. */
export function positionFor(bookId: string): bigint {
  const home = scatter(accessionNumber(bookId));
  return TRANSPOSED.get(home) ?? home;
}

export function coordinateAt(position: bigint): Coordinate {
  const x = position & MASK_64;
  const r = x % POSITIONS_PER_HEXAGON;
  return {
    hexagon: (x / POSITIONS_PER_HEXAGON).toString(36).toUpperCase(),
    wall: Number(r / VOLUMES_PER_WALL + 1n),
    shelf: Number((r % VOLUMES_PER_WALL) / VOLUMES_PER_SHELF + 1n),
    volume: Number((r % VOLUMES_PER_SHELF) + 1n),
  };
}

export function coordinateFor(bookId: string): Coordinate {
  return coordinateAt(positionFor(bookId));
}

/** Undefined when the parts do not name a real address in the space. */
export function positionOf(coordinate: Coordinate): bigint | undefined {
  const hexagon = parseBase36(coordinate.hexagon);
  if (hexagon === undefined || hexagon > LAST_HEXAGON) return undefined;
  const { wall, shelf, volume } = coordinate;
  if (!Number.isInteger(wall) || wall < 1 || wall > Number(WALLS_PER_HEXAGON)) return undefined;
  if (!Number.isInteger(shelf) || shelf < 1 || shelf > SHELVES_PER_WALL) return undefined;
  if (!Number.isInteger(volume) || volume < 1 || volume > SHELF_LENGTH) return undefined;
  return (
    hexagon * POSITIONS_PER_HEXAGON +
    BigInt(wall - 1) * VOLUMES_PER_WALL +
    BigInt(shelf - 1) * VOLUMES_PER_SHELF +
    BigInt(volume - 1)
  );
}

/**
 * The accession number shelved at an address. Every address has one; only the
 * handful inside this edition's range name a volume it can print.
 */
export function accessionAt(position: bigint): string | undefined {
  const n = unscatter(TRANSPOSED.get(position) ?? position);
  if (n < 1n || n > 9999n) return undefined;
  return `b${n.toString().padStart(4, '0')}`;
}

export function shelfOf(coordinate: Coordinate): ShelfCoordinate {
  return { hexagon: coordinate.hexagon, wall: coordinate.wall, shelf: coordinate.shelf };
}

/** The thirty-two addresses of a shelf, in order. */
export function shelfVolumes(shelf: ShelfCoordinate): Coordinate[] {
  return Array.from({ length: SHELF_LENGTH }, (_, index) => ({ ...shelf, volume: index + 1 }));
}

/** The address a given number of places along, wrapping around the whole space. */
export function step(coordinate: Coordinate, places: bigint): Coordinate | undefined {
  const position = positionOf(coordinate);
  if (position === undefined) return undefined;
  return coordinateAt((position + places) & MASK_64);
}

export interface CoordinateField {
  name: string;
  value: string;
}

/** The four fields in reading order, so the address can wrap at its separators. */
export function coordinateFields(coordinate: Coordinate): CoordinateField[] {
  return [
    { name: copy.coordHexagon, value: coordinate.hexagon },
    { name: copy.coordWall, value: String(coordinate.wall) },
    { name: copy.coordShelf, value: String(coordinate.shelf) },
    { name: copy.coordVolume, value: String(coordinate.volume) },
  ];
}

/** The three fields of a shelf, in reading order. */
export function shelfFields(shelf: ShelfCoordinate): CoordinateField[] {
  return [
    { name: copy.coordHexagon, value: shelf.hexagon },
    { name: copy.coordWall, value: String(shelf.wall) },
    { name: copy.coordShelf, value: String(shelf.shelf) },
  ];
}

export function formatCoordinate(coordinate: Coordinate): string {
  return coordinateFields(coordinate)
    .map((field) => `${field.name} ${field.value}`)
    .join(' · ');
}
