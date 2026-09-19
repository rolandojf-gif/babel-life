import { copy } from '../content/copy';
import {
  coordinateFields,
  positionOf,
  shelfOf,
  step,
  type Coordinate,
} from '../library/coordinates';
import { hashForAddress, hashForShelf } from '../library/routing';
import { element, glyph, link, type ViewHandle } from './view';

/**
 * A real address holding nothing this edition can print. Not an error: the
 * Library is almost entirely unreadable, and the walk continues from here.
 */
export function createAddressView(coordinate: Coordinate): ViewHandle {
  const root = element('article', 'book address');

  const back = link('#', 'backlink');
  back.append(glyph('backlink__arrow', '←'), document.createTextNode(copy.backToWall));

  const marker = element('p', 'found found--absent', copy.noLegibleVolume);

  const shelfLink = link(hashForShelf(shelfOf(coordinate)), 'coordinate coordinate--link');
  for (const [index, field] of coordinateFields(coordinate).entries()) {
    if (index > 0) shelfLink.append(element('span', 'coordinate__separator', ' · '));
    shelfLink.append(element('span', 'coordinate__field', `${field.name} ${field.value}`));
  }
  shelfLink.append(element('span', 'visually-hidden', ` — ${copy.openThisShelf}`));

  const note = element('h1', 'address__note', copy.noLegibleNote);
  note.tabIndex = -1;

  const actions = element('div', 'book__actions');
  const previous = step(coordinate, -1n);
  const next = step(coordinate, 1n);
  if (previous && positionOf(previous) !== undefined) {
    const anchor = link(hashForAddress(previous), 'action action--quiet');
    anchor.append(glyph('backlink__arrow', '←'), document.createTextNode(copy.previousVolume));
    actions.append(anchor);
  }
  if (next && positionOf(next) !== undefined) {
    const anchor = link(hashForAddress(next), 'action action--quiet');
    anchor.append(document.createTextNode(copy.nextVolume), glyph('card__arrow', '→'));
    actions.append(anchor);
  }

  const shelfRow = element('div', 'book__actions');
  shelfRow.append(link(hashForShelf(shelfOf(coordinate)), 'action action--primary', copy.browseShelf));

  root.append(back, marker, shelfLink, note, actions, shelfRow);

  return {
    element: root,
    update(): void {},
    focus(): void {
      note.focus();
    },
  };
}
