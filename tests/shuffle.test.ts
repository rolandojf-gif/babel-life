/** The deal: a permutation fixed by its seed, and a fresh seed each visit. */

import { describe, expect, it } from 'vitest';
import { sessionSeed, shuffled } from '../src/library/shuffle';

const TWELVE = Array.from({ length: 12 }, (_, index) => index);

describe('a shuffle', () => {
  it('is fixed by its seed', () => {
    expect(shuffled(TWELVE, 7n)).toEqual(shuffled(TWELVE, 7n));
    expect(shuffled(TWELVE, 7n)).not.toEqual(shuffled(TWELVE, 8n));
  });

  it('keeps every item, and only those', () => {
    const dealt = shuffled(TWELVE, 99n);
    expect([...dealt].sort((a, b) => a - b)).toEqual(TWELVE);
  });

  it('leaves the original alone', () => {
    const original = [...TWELVE];
    shuffled(original, 3n);
    expect(original).toEqual(TWELVE);
  });

  it('has nothing to do with lists of one thing or none', () => {
    expect(shuffled([], 1n)).toEqual([]);
    expect(shuffled(['only'], 1n)).toEqual(['only']);
  });

  it('puts every item first about as often as any other', () => {
    const firsts = new Map<number, number>();
    for (let seed = 0n; seed < 1200n; seed += 1n) {
      const first = shuffled(TWELVE, seed)[0] ?? -1;
      firsts.set(first, (firsts.get(first) ?? 0) + 1);
    }
    expect(firsts.size).toBe(TWELVE.length);
    for (const count of firsts.values()) {
      expect(count).toBeGreaterThan(50);
      expect(count).toBeLessThan(160);
    }
  });
});

describe('a visit', () => {
  it('is dealt a seed of its own', () => {
    const seeds = new Set(Array.from({ length: 50 }, () => sessionSeed()));
    expect(seeds.size).toBe(50);
    for (const seed of seeds) {
      expect(seed).toBeGreaterThanOrEqual(0n);
      expect(seed).toBeLessThan(1n << 64n);
    }
  });
});
