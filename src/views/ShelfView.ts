import { copy } from '../content/copy';
import { findBook } from '../library/catalog';
import {
  accessionAt,
  positionOf,
  shelfFields,
  shelfVolumes,
  SHELF_LENGTH,
  coordinateAt,
  shelfOf,
  type ShelfCoordinate,
} from '../library/coordinates';
import { hashForAddress, hashForShelf } from '../library/routing';
import { element, glyph, link, type ViewHandle } from './view';

const COUNT_WORDS = ['None', 'One', 'Two', 'Three', 'Four'];

/**
 * Thirty-two addresses in a row. The Library is mostly unreadable, and this is
 * where a visitor sees that: the volume they came from stands among thirty-one
 * addresses this edition cannot print.
 */
export function createShelfView(shelf: ShelfCoordinate): ViewHandle {
  const root = element('div', 'shelf');

  const back = link('#', 'backlink');
  back.append(glyph('backlink__arrow', '←'), document.createTextNode(copy.backToWall));

  const heading = element('h1', 'shelf__address');
  heading.tabIndex = -1;
  for (const [index, field] of shelfFields(shelf).entries()) {
    if (index > 0) heading.append(element('span', 'coordinate__separator', ' · '));
    heading.append(element('span', 'coordinate__field', `${field.name} ${field.value}`));
  }

  const addresses = shelfVolumes(shelf);
  const list = element('ol', 'shelf__list');
  list.setAttribute('aria-label', 'Volumes on this shelf');

  let legible = 0;
  for (const address of addresses) {
    const position = positionOf(address);
    const accession = position === undefined ? undefined : accessionAt(position);
    const book = accession === undefined ? undefined : findBook(accession);
    if (book) legible += 1;

    const item = element('li', 'shelf__item');
    const anchor = link(hashForAddress(address), 'shelf__link');
    if (book) anchor.classList.add('shelf__link--legible');
    anchor.append(
      element('span', 'shelf__number', String(address.volume).padStart(2, '0')),
      element('span', 'shelf__spine', book ? book.title : copy.notLegible),
    );
    // Screen readers get the address, not just the spine.
    anchor.setAttribute(
      'aria-label',
      `${copy.volumeLabel} ${String(address.volume)}: ${book ? book.title : copy.notLegible}`,
    );
    item.append(anchor);
    list.append(item);
  }

  const count = element(
    'p',
    'shelf__count',
    copy.shelfHolds.replace('{legible}', COUNT_WORDS[legible] ?? String(legible)),
  );

  // The shelf either side, so the walk does not stop at thirty-two.
  const first = positionOf({ ...shelf, volume: 1 });
  const actions = element('div', 'book__actions');
  if (first !== undefined) {
    const stride = BigInt(SHELF_LENGTH);
    const previous = shelfOf(coordinateAt(first - stride));
    const next = shelfOf(coordinateAt(first + stride));
    const back1 = link(hashForShelf(previous), 'action action--quiet');
    back1.append(glyph('backlink__arrow', '←'), document.createTextNode(copy.previousShelf));
    const forward = link(hashForShelf(next), 'action action--quiet');
    forward.append(document.createTextNode(copy.nextShelf), glyph('card__arrow', '→'));
    actions.append(back1, forward);
  }

  const bottom = link('#', 'action action--primary');
  bottom.append(glyph('backlink__arrow', '←'), document.createTextNode(copy.backToWall));
  const bottomRow = element('div', 'book__actions');
  bottomRow.append(bottom);

  root.append(
    back,
    element('p', 'eyebrow', copy.shelfEyebrow),
    heading,
    count,
    list,
    actions,
    bottomRow,
  );

  return {
    element: root,
    update(): void {},
    focus(): void {
      heading.focus();
    },
  };
}
