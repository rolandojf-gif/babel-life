/**
 * @vitest-environment jsdom
 *
 * The view for an address holding nothing legible: it shows the fixed page
 * immediately, so opening an unreadable volume never requires a second click.
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

  it('shows its page immediately', () => {
    const view = mount();
    const symbols = view.element.querySelector('.page__symbols');

    expect(symbols).not.toBeNull();
    expect(view.element.querySelector('button')).toBeNull();
    expect(view.element.textContent).toContain(copy.pageOf);
  });
});

describe('the unreadable page', () => {
  it('contains only symbols from the Library alphabet', () => {
    const view = mount();
    const symbols = view.element.querySelector('.page__symbols');

    expect(symbols?.textContent).toHaveLength(PAGE_LENGTH);
    for (const symbol of symbols?.textContent ?? '') expect(SYMBOLS).toContain(symbol);
  });

  it('gives a screen reader the page description rather than the raw symbols', () => {
    const view = mount();

    expect(view.element.querySelector('.page__symbols')?.getAttribute('aria-hidden')).toBe('true');
    expect(view.element.querySelector('.visually-hidden')?.textContent).toBeTruthy();
    expect(view.element.textContent).toContain(copy.pageDescription);
  });

  it('shows the same page every time that address is opened', () => {
    const first = mount();
    const before = first.element.querySelector('.page__symbols')?.textContent;

    const second = mount();
    expect(second.element.querySelector('.page__symbols')?.textContent).toBe(before);
    expect(before).not.toBe('');
  });
});
