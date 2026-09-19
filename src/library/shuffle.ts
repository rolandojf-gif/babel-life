/**
 * The order the wall is dealt in. It is shuffled once per visit and then held:
 * a visitor who opens a life and comes back finds the wall exactly as they left
 * it, and nothing about the order is remembered between visits.
 */

import { draws } from './scramble';

/**
 * A seed for this visit. Card order is not a secret, so an ordinary draw is
 * enough; nothing is stored, so a reload deals the wall again.
 */
export function sessionSeed(): bigint {
  const high = BigInt(Math.floor(Math.random() * 0x100000000));
  const low = BigInt(Math.floor(Math.random() * 0x100000000));
  return (high << 32n) | low;
}

/**
 * The same items in an order fixed by the seed. Each item is given a 64-bit key
 * and they are sorted by it, which is a uniform permutation: two keys colliding
 * would need about one chance in 10^19 per pair, and a collision would only
 * leave those two in their original order.
 */
export function shuffled<T>(items: readonly T[], seed: bigint): T[] {
  const draw = draws(seed);
  return items
    .map((item) => ({ item, key: draw() }))
    .sort((left, right) => (left.key < right.key ? -1 : left.key > right.key ? 1 : 0))
    .map((entry) => entry.item);
}
