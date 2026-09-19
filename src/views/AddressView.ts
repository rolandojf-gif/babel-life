import { copy } from '../content/copy';
import {
  coordinateFields,
  positionOf,
  shelfOf,
  step,
  type Coordinate,
} from '../library/coordinates';
import { pageAt } from '../library/pages';
import { hashForAddress, hashForShelf } from '../library/routing';
import { element, glyph, link, type ViewHandle } from './view';

/**
 * One page of the volume standing here, the same page every time anyone looks.
 * The symbols are read by eye and by eye alone: a screen reader is told what the
 * page is instead of being made to spell out a hundred and ninety-two of them.
 */
function createPage(position: bigint): HTMLDivElement {
  const page = element('div', 'page');
  page.tabIndex = -1;

  const symbols = element('p', 'page__symbols', pageAt(position));
  symbols.setAttribute('aria-hidden', 'true');

  page.append(
    element('p', 'visually-hidden', copy.pageDescription),
    symbols,
    element('p', 'page__caption', copy.pageOf),
  );
  return page;
}

/**
 * A real address holding nothing this edition can print. Not an error: the
 * Library is almost entirely unreadable, and the walk continues from here.
 */
export function createAddressView(coordinate: Coordinate): ViewHandle {
  const root = element('article', 'book address');
  const position = positionOf(coordinate);

  const back = link('#', 'backlink');
  back.append(glyph('backlink__arrow', '←'), document.createTextNode(copy.backToWall));

  const marker = element('p', 'found found--absent', copy.noLegibleVolume);

  const shelfLink = link(hashForShelf(shelfOf(coordinate)), 'coordinate coordinate--link');
  for (const [index, field] of coordinateFields(coordinate).entries()) {
    if (index > 0) shelfLink.append(element('span', 'coordinate__separator', ' · '));
    shelfLink.append(element('span', 'coordinate__field', `${field.name} ${field.value}`));
  }
  shelfLink.append(element('span', 'visually-hidden', ` — ${copy.openThisShelf}`));

  const note = element('h1', 'address__note', copy.noLegibleNote);
  note.tabIndex = -1;

  // An unreadable volume opens directly on its fixed page: no second click required.
  const reveal = element('div', 'page__reveal');
  if (position !== undefined) reveal.append(createPage(position));

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

  root.append(back, marker, shelfLink, note, reveal, actions, shelfRow);

  return {
    element: root,
    update(): void {},
    focus(): void {
      note.focus();
    },
  };
}
