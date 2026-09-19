/**
 * @vitest-environment jsdom
 *
 * The view for an address holding nothing legible: it offers the page, it never
 * opens it unasked, and what it shows is fixed for that address.
 */

import { beforeEach, describe, expect, it } from 'vitest';
import { createAddressView } from '../src/views/AddressView';
import { copy } from '../src/content/copy';
import { coordinateFor } from '../src/library/coordinates';
import { PAGE_LENGTH, SYMBOLS } from '../src/library/pages';
import { catalog } from '../src/library/catalog';

const known = catalog.books[0]!;
const address = coordinateFor(known.id);

/** An address on the same shelf, where this edition prints nothing. */
const illegible = { ...address, volume: address.volume === 1 ? 2 : 1 };

function mount() {
  const view = createAddressView(illegible);
  document.body.replaceChildren(view.element);
  return view;
}

beforeEach(() => {
  document.body.replaceChildren();
});

describe('an address with nothing legible at it', () => {
  it('says so, and is not an error', () => {
    const view = mount();
    expect(view.element.textContent).toContain(copy.noLegibleVolume);
    expect(view.element.textContent).toContain(copy.noLegibleNote);
  });

  it('offers the page without opening it', () => {
    const view = mount();
    expect(view.element.querySelector('.page__symbols')).toBeNull();
    const button = view.element.querySelector('button');
    expect(button?.textContent).toBe(copy.lookInside);
  });
});

describe('looking inside', () => {
  it('shows a page of symbols and puts the control away', () => {
    const view = mount();
    view.element.querySelector('button')?.click();

    const symbols = view.element.querySelector('.page__symbols');
    expect(symbols).not.toBeNull();
    expect(symbols?.textContent).toHaveLength(PAGE_LENGTH);
    for (const symbol of symbols?.textContent ?? '') expect(SYMBOLS).toContain(symbol);
    expect(view.element.querySelector('button')).toBeNull();
    expect(view.element.textContent).toContain(copy.pageOf);
  });

  it('gives a screen reader the page rather than a hundred and ninety-two symbols', () => {
    const view = mount();
    view.element.querySelector('button')?.click();

    expect(view.element.querySelector('.page__symbols')?.getAttribute('aria-hidden')).toBe('true');
    expect(view.element.querySelector('.visually-hidden')?.textContent).toBeTruthy();
    expect(view.element.textContent).toContain(copy.pageDescription);
  });

  it('moves focus to the page it just opened', () => {
    const view = mount();
    view.element.querySelector('button')?.click();
    expect(document.activeElement).toBe(view.element.querySelector('.page'));
  });

  it('shows the same page to anyone who opens that address again', () => {
    const first = mount();
    first.element.querySelector('button')?.click();
    const before = first.element.querySelector('.page__symbols')?.textContent;

    const second = mount();
    second.element.querySelector('button')?.click();
    expect(second.element.querySelector('.page__symbols')?.textContent).toBe(before);
    expect(before).not.toBe('');
  });
});
