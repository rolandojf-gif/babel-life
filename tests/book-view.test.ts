/**
 * @vitest-environment jsdom
 *
 * BookView tests verifying standard spread rendering and regression protection
 * against obsolete 08:14 special-case handling.
 */

import { describe, expect, it } from 'vitest';
import { createBookView } from '../src/views/BookView';
import { catalog } from '../src/library/catalog';

describe('BookView', () => {
  it('treats b0007 as a normal book without obsolete 0814 classes or elements', () => {
    const view = createBookView('b0007', null);
    expect(view.element.className).toBe('book book--spread');
    expect(view.element.classList.contains('book--0814')).toBe(false);
    expect(view.element.querySelector('.interval')).toBeNull();
  });

  it('renders all catalog books with standard spread classes', () => {
    for (const book of catalog.books) {
      const view = createBookView(book.id, null);
      expect(view.element.className).toBe('book book--spread');
      expect(view.element.classList.contains('book--0814')).toBe(false);
    }
  });

  it('structures the spread with verso carrying discovery marker, shelf locator, and consultation note', () => {
    const view = createBookView('b0007', null);
    const verso = view.element.querySelector('.spread__verso');
    expect(verso).not.toBeNull();
    expect(verso?.querySelector('.found')).not.toBeNull();
    expect(verso?.querySelector('.shelf-locator')).not.toBeNull();
    expect(verso?.querySelector('.consulted')).not.toBeNull();

    const recto = view.element.querySelector('.spread__recto');
    expect(recto).not.toBeNull();
    expect(recto?.querySelector('.book__header')).not.toBeNull();
    expect(recto?.querySelector('.passage')).not.toBeNull();
    expect(recto?.querySelector('.aftertaste')).not.toBeNull();
    expect(recto?.querySelector('.consulted')).toBeNull();
  });
});
