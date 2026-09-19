import { copy } from '../content/copy';
import { coordinateFields, coordinateFor, shelfOf, type Coordinate } from '../library/coordinates';
import { hashForShelf } from '../library/routing';
import type { RootBook } from '../library/model';
import { createIllustration } from './illustrations';
import { element, glyph, link } from './view';

/**
 * One life on the wall. The eyebrow is the same on every card, on purpose: it
 * says the volume is already shelved. The premise underneath is the whole hook,
 * so nothing has to be opened to be understood.
 */
export function createBookCard(book: RootBook, index: number): HTMLLIElement {
  const item = element('li', 'wall__cell');

  const card = link(`#book=${book.id}`, 'card');
  // Three warm surfaces, cycling, so the wall reads as an assembled page.
  card.dataset['tone'] = String(index % 3);

  const visual = element('span', 'card__visual');
  visual.append(createIllustration(book.icon));

  const body = element('span', 'card__body');
  const eyebrow = element('span', 'card__eyebrow', copy.cardEyebrow);
  // The hook completes the eyebrow's sentence, so both belong to the link's name.
  const hook = element('h2', 'card__hook', book.hook);

  const coordinate = coordinateFor(book.id);
  const volume = element(
    'span',
    'card__volume',
    `Hexagon ${coordinate.hexagon} · Volume ${String(coordinate.volume)}`,
  );

  const open = element('span', 'card__open');
  open.append(document.createTextNode(copy.openThisLife));
  open.append(glyph('card__arrow', '→'));

  body.append(eyebrow, hook, volume, open);
  card.append(visual, body);
  item.append(card);
  return item;
}

/** The full address, wrapping at its separators, and leading to its shelf. */
export function createCoordinateLine(coordinate: Coordinate): HTMLAnchorElement {
  const anchor = link(hashForShelf(shelfOf(coordinate)), 'coordinate coordinate--link');
  for (const [index, field] of coordinateFields(coordinate).entries()) {
    if (index > 0) anchor.append(element('span', 'coordinate__separator', ' · '));
    // A no-break space keeps each field whole; the line breaks at the separators.
    anchor.append(element('span', 'coordinate__field', `${field.name} ${field.value}`));
  }
  anchor.append(element('span', 'visually-hidden', ` — ${copy.openThisShelf}`));
  return anchor;
}
