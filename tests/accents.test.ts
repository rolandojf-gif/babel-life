/**
 * @vitest-environment jsdom
 *
 * Sanguine accents: every root carries its point of contingency, nearby books
 * carry what they change, each accent names strokes that exist in that book's
 * own motif, and a book without an entry is drawn wholly in charcoal.
 */

import { describe, expect, it } from 'vitest';
import { catalog, findBook, rootBooks } from '../src/library/catalog';
import { ACCENTS, createIllustration, motifStrokeCount } from '../src/views/illustrations';
import { createBookView } from '../src/views/BookView';

describe('sanguine accents', () => {
  it('belong to books in the catalogue', () => {
    for (const id of Object.keys(ACCENTS)) {
      expect(findBook(id)).toBeDefined();
    }
  });

  it('mark a point of contingency on every root', () => {
    for (const root of rootBooks) {
      expect(ACCENTS[root.id]).toBeDefined();
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

  /**
   * The root marks where its life could turn; a nearby book marks what turned.
   * Compared as drawn, so a repeated mark is caught whether it comes from the
   * same motif stroke tinted twice or from a stroke added again by hand.
   */
  it('never repeat on a nearby book the stroke its root marks', () => {
    const marks = (id: string): string[] => {
      const book = findBook(id);
      const svg = createIllustration(book?.icon ?? '', ACCENTS[id]);
      const group = svg.querySelector('.illustration__stroke--sanguine');
      return [...(group?.children ?? [])].map((stroke) => stroke.outerHTML);
    };
    for (const book of catalog.books) {
      if (book.kind !== 'nearby' || !(book.id in ACCENTS)) continue;
      const rootMarks = new Set(marks(book.rootId));
      for (const mark of marks(book.id)) {
        expect(rootMarks.has(mark), `${book.id} repeats ${book.rootId}: ${mark}`).toBe(false);
      }
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
    const plain = createBookView('b0040', null);
    expect(plain.element.querySelector('.illustration__stroke--sanguine')).toBeNull();
  });
});
