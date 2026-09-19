import { copy } from '../content/copy';
import { coordinateFields, coordinateFor } from '../library/coordinates';
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

/** The full address, wrapping at its separators. */
export function createCoordinateLine(bookId: string): HTMLParagraphElement {
  const paragraph = element('p', 'coordinate');
  for (const [index, field] of coordinateFields(coordinateFor(bookId)).entries()) {
    if (index > 0) paragraph.append(element('span', 'coordinate__separator', ' · '));
    // A no-break space keeps each field whole; the line breaks at the separators.
    paragraph.append(element('span', 'coordinate__field', `${field.name} ${field.value}`));
  }
  return paragraph;
}
