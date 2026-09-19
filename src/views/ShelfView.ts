import { copy } from '../content/copy';
import {
  coordinateAt,
  positionOf,
  SHELF_LENGTH,
  shelfOf,
  type ShelfCoordinate,
} from '../library/coordinates';
import { hashForShelf } from '../library/routing';
import { appendShelfIntro, createShelfList } from './shelfListing';
import { element, glyph, link, type ViewHandle } from './view';

/**
 * Thirty-two addresses in a row. The Library is mostly unreadable, and this is
 * where a visitor sees that: the volume they came from stands among thirty-one
 * addresses this edition cannot print.
 */
export function createShelfView(shelf: ShelfCoordinate): ViewHandle {
  const root = element('div', 'shelf');

  const back = link('#', 'backlink');
  back.append(glyph('backlink__arrow', '←'), document.createTextNode(copy.backToWall));

  appendShelfIntro(root, shelf, 'h1', -1);

  const list = createShelfList(shelf, 'page');
  root.append(list);

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

  root.prepend(back);
  root.append(actions, bottomRow);

  return {
    element: root,
    update(): void {},
    focus(): void {
      const focusTarget = root.querySelector('.shelf__address');
      if (focusTarget instanceof HTMLElement) focusTarget.focus();
    },
  };
}
