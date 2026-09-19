/**
 * The visible Library address of a book. It is a reversible display mapping of the
 * accession number, frozen for this edition: a symbolic index, not Borges' geometry.
 */

const MASK_64 = (1n << 64n) - 1n;
const MULTIPLIER = 11400714819323198485n;
const INCREMENT = 1442695040888963407n;

const VOLUMES_PER_SHELF = 32n;
const SHELVES_PER_WALL = 5n;
const WALLS_PER_HEXAGON = 4n;
const POSITIONS_PER_HEXAGON = WALLS_PER_HEXAGON * SHELVES_PER_WALL * VOLUMES_PER_SHELF; // 640

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

/** Parses the decimal accession number out of an ID of the form b0003. */
function accessionNumber(bookId: string): bigint {
  const digits = /^b(\d{4})$/.exec(bookId)?.[1];
  if (digits === undefined) throw new Error(`Not an accession number: ${bookId}`);
  return BigInt(digits);
}

export function coordinateFor(bookId: string): Coordinate {
  const n = accessionNumber(bookId);
  const x = (n * MULTIPLIER + INCREMENT) & MASK_64;

  const hexagon = x / POSITIONS_PER_HEXAGON;
  const r = x % POSITIONS_PER_HEXAGON;
  const wall = r / (SHELVES_PER_WALL * VOLUMES_PER_SHELF) + 1n;
  const shelf = (r % (SHELVES_PER_WALL * VOLUMES_PER_SHELF)) / VOLUMES_PER_SHELF + 1n;
  const volume = (r % VOLUMES_PER_SHELF) + 1n;

  return {
    hexagon: hexagon.toString(36).toUpperCase(),
    wall: Number(wall),
    shelf: Number(shelf),
    volume: Number(volume),
  };
}

export interface CoordinateField {
  name: string;
  value: string;
}

/** The four fields in reading order, so the address can wrap at its separators. */
export function coordinateFields(coordinate: Coordinate): CoordinateField[] {
  return [
    { name: 'Hexagon', value: coordinate.hexagon },
    { name: 'Wall', value: String(coordinate.wall) },
    { name: 'Shelf', value: String(coordinate.shelf) },
    { name: 'Volume', value: String(coordinate.volume) },
  ];
}

export function formatCoordinate(coordinate: Coordinate): string {
  return coordinateFields(coordinate)
    .map((field) => `${field.name} ${field.value}`)
    .join(' · ');
}
