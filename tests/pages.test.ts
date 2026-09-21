/**
 * The page at an unreadable address. The fixtures below were produced by a
 * separate implementation of the same scramble, not by calling this module, so
 * a generator that drifts cannot certify its own output.
 */

import { describe, expect, it } from 'vitest';
import { copyFor } from '../src/content/copy';
import {
  calculateScaleExponent,
  LINES_PER_PAGE,
  pageAt,
  PAGES_PER_BOOK,
  POSITIONS_PER_BOOK,
  POSITIONS_PER_PAGE,
  SYMBOLS,
  SYMBOLS_PER_LINE,
  VISIBLE_EXCERPT_LENGTH,
} from '../src/library/pages';

const MASK_64 = (1n << 64n) - 1n;

describe('the canonical book model and scale', () => {
  it('defines the canonical 1,312,000-position physical book geometry', () => {
    expect(PAGES_PER_BOOK).toBe(410);
    expect(LINES_PER_PAGE).toBe(40);
    expect(SYMBOLS_PER_LINE).toBe(80);
    expect(POSITIONS_PER_PAGE).toBe(3200);
    expect(POSITIONS_PER_PAGE).toBe(LINES_PER_PAGE * SYMBOLS_PER_LINE);
    expect(POSITIONS_PER_BOOK).toBe(1312000);
    expect(POSITIONS_PER_BOOK).toBe(PAGES_PER_BOOK * POSITIONS_PER_PAGE);
  });

  it('calculates the 10^1,834,097 order of magnitude for 25 symbols', () => {
    expect(SYMBOLS).toHaveLength(25);
    const exponent = calculateScaleExponent(SYMBOLS.length, POSITIONS_PER_BOOK);
    expect(exponent).toBe(1834097);

    // Verify the mantissa rounding convention (floor of log10, mantissa from remainder):
    const exact = POSITIONS_PER_BOOK * Math.log10(SYMBOLS.length);
    const mantissa = Math.pow(10, exact - exponent);
    expect(mantissa.toFixed(2)).toBe('1.96');
  });

  it('keeps public scale copy consistent with canonical model constants', () => {
    const en = copyFor('en');
    const es = copyFor('es');

    expect(en.libraryScaleMeta).toContain(String(SYMBOLS.length));
    expect(en.libraryScaleMeta).toContain('1,312,000');
    expect(en.libraryScaleExponent).toBe('1,834,097');
    expect(en.libraryScaleMantissa).toContain('1.96');

    expect(es.libraryScaleMeta).toContain(String(SYMBOLS.length));
    expect(es.libraryScaleMeta).toContain('1.312.000');
    expect(es.libraryScaleExponent).toBe('1.834.097');
    expect(es.libraryScaleMantissa).toContain('1,96');
  });
});

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

describe('the visible excerpt at an address', () => {
  it('is the excerpt an independent scramble produces', () => {
    expect(pageAt(1n, 32)).toBe('qvqlm,xixanxk rpfrpsyvlbtkkmgem ');
    expect(pageAt(0n, 16)).toBe('laev qoq.qbbigsh');
  });

  it('runs to twelve hundred and eighty symbols by default for the reading room window', () => {
    expect(VISIBLE_EXCERPT_LENGTH).toBe(1280);
    expect(pageAt(1n)).toHaveLength(VISIBLE_EXCERPT_LENGTH);
    expect(pageAt(1n)).toHaveLength(1280);
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
