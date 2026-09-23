/**
 * @vitest-environment jsdom
 *
 * Sanguine accents: only nearby books carry them, each one names strokes that
 * exist in that book's own motif, and a book without an entry is drawn wholly
 * in charcoal.
 */

import { describe, expect, it } from 'vitest';
import { catalog, findBook } from '../src/library/catalog';
import { ACCENTS, createIllustration, motifStrokeCount } from '../src/views/illustrations';
import { createBookView } from '../src/views/BookView';

describe('sanguine accents', () => {
  it('belong to nearby books only', () => {
    for (const id of Object.keys(ACCENTS)) {
      expect(findBook(id)?.kind).toBe('nearby');
    }
  });

  it('name strokes that exist in the book’s own motif', () => {
    for (const [id, accent] of Object.entries(ACCENTS)) {
      const book = findBook(id);
      const count = motifStrokeCount(book?.icon ?? '');
      expect(count).toBeGreaterThan(0);
      for (const index of [...(accent.tint ?? []), ...(accent.drop ?? [])]) {
        expect(index).toBeGreaterThanOrEqual(0);
        expect(index).toBeLessThan(count);
      }
      expect((accent.tint?.length ?? 0) + (accent.add?.length ?? 0)).toBeGreaterThan(0);
    }
  });

  it('draw a sanguine group only where a book has an accent', () => {
    for (const book of catalog.books) {
      const svg = createIllustration(book.icon, ACCENTS[book.id]);
      const sanguine = svg.querySelector('.illustration__stroke--sanguine');
      expect(sanguine !== null).toBe(book.id in ACCENTS);
    }
  });

  it('reach the book’s plate', () => {
    const view = createBookView('b0039', null);
    expect(view.element.querySelector('.book__visual .illustration__stroke--sanguine')).not.toBeNull();
    const root = createBookView('b0038', null);
    expect(root.element.querySelector('.illustration__stroke--sanguine')).toBeNull();
  });
});
