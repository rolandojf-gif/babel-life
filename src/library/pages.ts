/**
 * What stands at an address this edition cannot print. The Library is complete:
 * every address holds a volume, and almost every one of them is unreadable. This
 * is a page of such a volume — fixed for its address, derived from nothing else,
 * and an account of nothing at all.
 */

import { draws } from './scramble';

/**
 * Twenty-five orthographic symbols, as the story has them: twenty-two letters,
 * the space, the comma and the period. The twenty-two are the classical Latin
 * alphabet without J, U, W or Z. The story names none of them; this is an
 * editorial choice of this edition, frozen like any other.
 */
export const SYMBOLS = 'abcdefghiklmnopqrstvxy ,.';

/** Symbols on the page a visitor is shown. The volume itself runs to 410 pages. */
export const PAGE_LENGTH = 192;

/**
 * The page shelved at a position: the same symbols for that address on every
 * device and in every session, because the address is the only thing it is made
 * of. Nothing is stored, and nothing about the reader enters it.
 */
export function pageAt(position: bigint, length: number = PAGE_LENGTH): string {
  const draw = draws(position);
  let page = '';
  for (let index = 0; index < length; index += 1) {
    page += SYMBOLS[Number(draw() % BigInt(SYMBOLS.length))] ?? '';
  }
  return page;
}
