/**
 * What stands at an address this edition cannot print. The Library is complete:
 * every address holds a volume, and almost every one of them is unreadable. This
 * module produces the visible excerpt of such a volume — fixed for its address,
 * derived from nothing else, and an account of nothing at all.
 */

import { draws } from './scramble';

/**
 * Twenty-five orthographic symbols, as the story has them: twenty-two letters,
 * the space, the comma and the period. The twenty-two are the classical Latin
 * alphabet without J, U, W or Z. The story names none of them; this is an
 * editorial choice of this edition, frozen like any other.
 */
export const SYMBOLS = 'abcdefghiklmnopqrstvxy ,.';

/**
 * Canonical physical book mathematics from Borges' "The Library of Babel":
 * - 410 pages per book
 * - 40 lines per page
 * - 80 symbol positions per line
 * - 3,200 positions per complete physical page
 * - 1,312,000 positions per book
 *
 * Total possible books: 25^1,312,000 ≈ 1.96 × 10^1,834,097
 */
export const PAGES_PER_BOOK = 410;
export const LINES_PER_PAGE = 40;
export const SYMBOLS_PER_LINE = 80;
export const POSITIONS_PER_PAGE = LINES_PER_PAGE * SYMBOLS_PER_LINE; // 3,200
export const POSITIONS_PER_BOOK = PAGES_PER_BOOK * POSITIONS_PER_PAGE; // 1,312,000

/**
 * The visible application excerpt length.
 *
 * A complete physical page holds 3,200 symbols (40 lines of 80 characters), which
 * would create excessive vertical bulk in the reading-room layout. The application
 * displays a deterministic 1,280-symbol window into the unreadable page
 * (styled as 40 lines of 32 characters, echoing the shelf's 32-volume geometry).
 *
 * This 1,280-symbol block is an excerpt/window for presentation, NOT the canonical
 * physical page size (which is 3,200 positions).
 */
export const VISIBLE_EXCERPT_LENGTH = 1280;

/**
 * Log10 order of magnitude for the number of possible books (25^1,312,000):
 * floor(1,312,000 * log10(25)) = 1,834,097.
 */
export function calculateScaleExponent(
  symbolsCount: number = SYMBOLS.length,
  totalPositions: number = POSITIONS_PER_BOOK,
): number {
  return Math.floor(totalPositions * Math.log10(symbolsCount));
}

/**
 * The visible excerpt shelved at an unreadable position: the same symbols for
 * that address on every device and in every session, because the address is the
 * only thing it is made of. Nothing is stored, and nothing about the reader enters it.
 */
export function pageAt(position: bigint, length: number = VISIBLE_EXCERPT_LENGTH): string {
  const draw = draws(position);
  let page = '';
  for (let index = 0; index < length; index += 1) {
    page += SYMBOLS[Number(draw() % BigInt(SYMBOLS.length))] ?? '';
  }
  return page;
}
