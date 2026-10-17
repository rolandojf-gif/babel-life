/**
 * @vitest-environment jsdom
 *
 * BookView tests verifying standard spread rendering and regression protection
 * against obsolete 08:14 special-case handling.
 */

import { afterEach, describe, expect, it } from 'vitest';
import { createBookView } from '../src/views/BookView';
import { catalog } from '../src/library/catalog';
import { LOCALES } from '../src/content/locale';

afterEach(() => {
  window.history.replaceState(null, '', '/');
});

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

  it.each(LOCALES)('renders the authored ending without an empty screen/print block in %s', (locale) => {
    window.history.replaceState(null, '', locale === 'es' ? '/es/' : '/');
    expect(catalog.books.some((book) => book.aftertaste === '')).toBe(true);
    expect(catalog.books.some((book) => book.aftertaste !== '')).toBe(true);
    for (const book of catalog.books) {
      const view = createBookView(book.id, null);
      const recto = view.element.querySelector('.spread__recto')!;
      const passage = recto.querySelector('.passage')!;
      expect(Array.from(passage.children, (p) => p.textContent)).toEqual(book.passage);
      if (book.aftertaste === '') {
        expect(view.element.querySelector('.aftertaste')).toBeNull();
        expect(recto.lastElementChild).toBe(passage);
        expect(recto.children).toHaveLength(3);
      } else {
        const closing = recto.querySelector('.aftertaste');
        expect(closing?.textContent).toBe(book.aftertaste);
        expect(recto.lastElementChild).toBe(closing);
        expect(recto.querySelectorAll('.aftertaste')).toHaveLength(1);
      }
      expect(view.element.querySelector('.print-head')).not.toBeNull();
      expect(view.element.querySelectorAll('.nearby__item')).toHaveLength(
        book.neighbors.length + (book.crossings?.length ?? 0),
      );
    }
  });

  it('offers nearby lives immediately after the story, before the physical shelf', () => {
    const view = createBookView('b0007', null);
    const children = Array.from(view.element.children);
    const spreadIndex = children.findIndex((child) => child.classList.contains('spread'));
    const nearbyIndex = children.findIndex((child) => child.classList.contains('nearby'));
    const shelfIndex = children.findIndex((child) => child.classList.contains('book__shelf'));

    expect(spreadIndex).toBeGreaterThanOrEqual(0);
    expect(nearbyIndex).toBe(spreadIndex + 1);
    expect(shelfIndex).toBeGreaterThan(nearbyIndex);
    expect(view.element.querySelectorAll('.book__shelf .shelf__link').length).toBeGreaterThan(0);
  });

  it('structures the spread with verso carrying discovery marker, shelf locator, and consultation note', () => {
    const view = createBookView('b0007', null);
    const verso = view.element.querySelector('.spread__verso');
    expect(verso).not.toBeNull();
    expect(verso?.querySelector('.found')).not.toBeNull();
    expect(verso?.querySelector('.shelf-locator')).not.toBeNull();
    expect(verso?.querySelector('.consulted')).not.toBeNull();
    expect(verso?.querySelector('.book__visual .illustration')).not.toBeNull();

    const recto = view.element.querySelector('.spread__recto');
    expect(recto).not.toBeNull();
    expect(recto?.querySelector('.book__header')).not.toBeNull();
    expect(recto?.querySelector('.passage')).not.toBeNull();
    expect(recto?.querySelector('.aftertaste')).not.toBeNull();
    expect(recto?.querySelector('.consulted')).toBeNull();
    expect(recto?.querySelector('.book__visual')).toBeNull();
  });
});
