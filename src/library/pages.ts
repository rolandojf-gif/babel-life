/**
 * What stands at an address this edition cannot print. The Library is complete:
 * every address holds a volume, and almost every one of them is unreadable. This
 * is a page of such a volume — fixed for its address, derived from nothing else,
 * and an account of nothing at all.
 */

/**
 * Twenty-five orthographic symbols, as the story has them: twenty-two letters,
 * the space, the comma and the period. The twenty-two are the classical Latin
 * alphabet without J, U, W or Z. The story names none of them; this is an
 * editorial choice of this edition, frozen like any other.
 */
export const SYMBOLS = 'abcdefghiklmnopqrstvxy ,.';

/** Symbols on the page a visitor is shown. The volume itself runs to 410 pages. */
export const PAGE_LENGTH = 192;

const MASK_64 = (1n << 64n) - 1n;
const GOLDEN_GAMMA = 0x9e3779b97f4a7c15n;
const MIX_A = 0xbf58476d1ce4e5b9n;
const MIX_B = 0x94d049bb133111ebn;

/** splitmix64's finalizer: a fixed scramble, with no clock and no state kept. */
function mix(value: bigint): bigint {
  let z = value;
  z = ((z ^ (z >> 30n)) * MIX_A) & MASK_64;
  z = ((z ^ (z >> 27n)) * MIX_B) & MASK_64;
  return z ^ (z >> 31n);
}

/**
 * The page shelved at a position: the same symbols for that address on every
 * device and in every session, because the address is the only thing it is made
 * of. Nothing is stored, and nothing about the reader enters it.
 */
export function pageAt(position: bigint, length: number = PAGE_LENGTH): string {
  let counter = position & MASK_64;
  let page = '';
  for (let index = 0; index < length; index += 1) {
    counter = (counter + GOLDEN_GAMMA) & MASK_64;
    page += SYMBOLS[Number(mix(counter) % BigInt(SYMBOLS.length))] ?? '';
  }
  return page;
}
