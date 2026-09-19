/**
 * splitmix64: the one scramble this edition uses. A fixed arithmetic shuffle of
 * a 64-bit number, with no clock, no entropy and no state beyond its counter, so
 * the same seed always yields the same sequence.
 */

export const MASK_64 = (1n << 64n) - 1n;

const GOLDEN_GAMMA = 0x9e3779b97f4a7c15n;
const MIX_A = 0xbf58476d1ce4e5b9n;
const MIX_B = 0x94d049bb133111ebn;

/** The finalizer: bits in, the same bits thoroughly stirred out. */
export function mix(value: bigint): bigint {
  let z = value;
  z = ((z ^ (z >> 30n)) * MIX_A) & MASK_64;
  z = ((z ^ (z >> 27n)) * MIX_B) & MASK_64;
  return z ^ (z >> 31n);
}

/** A sequence of draws from a seed. Two nearby seeds give unrelated sequences. */
export function draws(seed: bigint): () => bigint {
  let counter = seed & MASK_64;
  return () => {
    counter = (counter + GOLDEN_GAMMA) & MASK_64;
    return mix(counter);
  };
}
