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
});
