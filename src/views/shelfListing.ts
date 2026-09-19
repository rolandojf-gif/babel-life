import { copy } from '../content/copy';
import { findBook } from '../library/catalog';
import {
  accessionAt,
  positionOf,
  shelfFields,
  shelfVolumes,
  type Coordinate,
  type ShelfCoordinate,
} from '../library/coordinates';
import { hashForAddress, hashForBook } from '../library/routing';
import type { Book } from '../library/model';
import { element, link } from './view';

const COUNT_WORDS = ['None', 'One', 'Two', 'Three', 'Four'];

export type ShelfListingMode = 'page' | 'embedded';

function bookAtAddress(address: Coordinate): Book | undefined {
  const position = positionOf(address);
  if (position === undefined) return undefined;
  const accession = accessionAt(position);
  if (accession === undefined) return undefined;
  return findBook(accession);
}

/** How many volumes on this shelf this edition can print. */
export function legibleCountOnShelf(shelf: ShelfCoordinate): number {
  let legible = 0;
  for (const address of shelfVolumes(shelf)) {
    if (bookAtAddress(address)) legible += 1;
  }
  return legible;
}

export function createShelfAddressHeading(
  shelf: ShelfCoordinate,
  tag: 'h1' | 'h2',
  tabIndex?: number,
): HTMLHeadingElement {
  const heading = element(tag, 'shelf__address');
  if (tabIndex !== undefined) heading.tabIndex = tabIndex;
  for (const [index, field] of shelfFields(shelf).entries()) {
    if (index > 0) heading.append(element('span', 'coordinate__separator', ' · '));
    heading.append(element('span', 'coordinate__field', `${field.name}\u00a0${field.value}`));
  }
  return heading;
}

/** Eyebrow, shelf address, and legibility count — shared by the shelf page and embedded shelf. */
export function appendShelfIntro(parent: HTMLElement, shelf: ShelfCoordinate, headingTag: 'h1' | 'h2', tabIndex?: number): void {
  parent.append(element('p', 'eyebrow', copy.shelfEyebrow));
  parent.append(createShelfAddressHeading(shelf, headingTag, tabIndex));
  const legible = legibleCountOnShelf(shelf);
  parent.append(
    element(
      'p',
      'shelf__count',
      copy.shelfHolds.replace('{legible}', COUNT_WORDS[legible] ?? String(legible)),
    ),
  );
}

/** Thirty-two shelf positions; page mode links every row to its address. */
export function createShelfList(shelf: ShelfCoordinate, mode: ShelfListingMode, currentBookId?: string): HTMLOListElement {
  const list = element('ol', 'shelf__list');
  list.setAttribute('aria-label', 'Volumes on this shelf');

  for (const address of shelfVolumes(shelf)) {
    const book = bookAtAddress(address);
    const item = element('li', 'shelf__item');
    const numberText = String(address.volume).padStart(2, '0');
    const spineText = book ? book.title : copy.notLegible;

    if (mode === 'page') {
      const anchor = link(hashForAddress(address), 'shelf__link');
      if (book) anchor.classList.add('shelf__link--legible');
      anchor.append(element('span', 'shelf__number', numberText), element('span', 'shelf__spine', spineText));
      anchor.setAttribute(
        'aria-label',
        `${copy.volumeLabel} ${String(address.volume)}: ${spineText}`,
      );
      item.append(anchor);
    } else if (book?.id === currentBookId) {
      const row = element('span', 'shelf__row shelf__row--current');
      row.setAttribute('aria-current', 'location');
      row.append(element('span', 'shelf__number', numberText), element('span', 'shelf__spine', spineText));
      item.append(row);
    } else if (book) {
      const anchor = link(hashForBook(book.id), 'shelf__link shelf__link--legible');
      anchor.append(element('span', 'shelf__number', numberText), element('span', 'shelf__spine', spineText));
      anchor.setAttribute('aria-label', `${copy.volumeLabel} ${String(address.volume)}: ${book.title}`);
      item.append(anchor);
    } else {
      const anchor = link(hashForAddress(address), 'shelf__link');
      anchor.append(element('span', 'shelf__number', numberText), element('span', 'shelf__spine', spineText));
      anchor.setAttribute(
        'aria-label',
        `${copy.volumeLabel} ${String(address.volume)}: ${copy.notLegible}`,
      );
      item.append(anchor);
    }

    list.append(item);
  }

  return list;
}

/** In-page target for the compact shelf locator on The 08:14. */
export const BOOK_EMBEDDED_SHELF_ID = 'book-shelf';

/** Full shelf context beside a book: address, count, and thirty-two positions. */
export function createEmbeddedShelf(shelf: ShelfCoordinate, currentBookId: string): HTMLElement {
  const aside = element('aside', 'book__shelf shelf shelf--embedded');
  aside.id = BOOK_EMBEDDED_SHELF_ID;
  aside.tabIndex = -1;
  aside.setAttribute('aria-label', copy.shelfEyebrow);
  appendShelfIntro(aside, shelf, 'h2');
  aside.append(createShelfList(shelf, 'embedded', currentBookId));
  return aside;
}
