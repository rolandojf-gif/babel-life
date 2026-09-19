/**
 * The page at an unreadable address. The fixtures below were produced by a
 * separate implementation of the same scramble, not by calling this module, so
 * a generator that drifts cannot certify its own output.
 */

import { describe, expect, it } from 'vitest';
import { PAGE_LENGTH, pageAt, SYMBOLS } from '../src/library/pages';

const MASK_64 = (1n << 64n) - 1n;

describe('the alphabet', () => {
  it('is the twenty-five orthographic symbols of the story', () => {
    expect(SYMBOLS).toHaveLength(25);
    expect(new Set(SYMBOLS).size).toBe(25);
    expect(SYMBOLS).toContain(' ');
    expect(SYMBOLS).toContain(',');
    expect(SYMBOLS).toContain('.');
    expect(SYMBOLS.replace(/[ ,.]/g, '')).toMatch(/^[a-z]{22}$/);
  });
});

describe('the page at an address', () => {
  it('is the page an independent scramble produces', () => {
    expect(pageAt(1n, 32)).toBe('qvqlm,xixanxk rpfrpsyvlbtkkmgem ');
    expect(pageAt(0n, 16)).toBe('laev qoq.qbbigsh');
  });

  it('runs to a hundred and ninety-two symbols by default', () => {
    expect(pageAt(1n)).toHaveLength(PAGE_LENGTH);
    expect(pageAt(1n)).toHaveLength(192);
    expect(pageAt(1n, 0)).toBe('');
  });

  it('is the same page every time that address is opened', () => {
    for (const position of [0n, 1n, 640n, 123456789n, MASK_64]) {
      expect(pageAt(position)).toBe(pageAt(position));
    }
  });

  it('spells nothing outside the alphabet', () => {
    for (const position of [0n, 7n, 1n << 40n, MASK_64]) {
      for (const symbol of pageAt(position)) expect(SYMBOLS).toContain(symbol);
    }
  });

  it('reads differently at every address', () => {
    const pages = new Set<string>();
    for (let position = 0n; position < 500n; position += 1n) pages.add(pageAt(position, 24));
    expect(pages.size).toBe(500);
  });

  it('reaches every symbol, none of them favoured out of all recognition', () => {
    const counts = new Map<string, number>();
    const page = pageAt(99n, 25000);
    for (const symbol of page) counts.set(symbol, (counts.get(symbol) ?? 0) + 1);
    expect(counts.size).toBe(25);
    for (const symbol of SYMBOLS) {
      const share = (counts.get(symbol) ?? 0) / page.length;
      expect(share).toBeGreaterThan(0.02);
      expect(share).toBeLessThan(0.06);
    }
  });

  it('is made of the address and nothing else', () => {
    // Same position, arrived at differently; and the space wraps rather than ends.
    expect(pageAt(640n * 2n)).toBe(pageAt(1280n));
    expect(pageAt(-1n)).toBe(pageAt(MASK_64));
  });
});
