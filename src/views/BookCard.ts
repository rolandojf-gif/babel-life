import { copy, fill } from '../content/copy';
import { coordinateFor } from '../library/coordinates';
import type { RootBook } from '../library/model';
import { ACCENTS, createIllustration } from './illustrations';
import { element, glyph, link } from './view';

const FEATURED_SLOTS = new Set([1, 4, 11, 16, 21]);

/**
 * One life on the wall. Featured emphasis follows display position in the
 * shuffled deal, not the identity of the book. The shared eyebrow is shown
 * once above the grid; each card keeps it for the link's accessible name.
 */
export function createBookCard(book: RootBook, index: number): HTMLLIElement {
  const featured = FEATURED_SLOTS.has(index + 1);
  const item = element('li', featured ? 'wall__cell wall__cell--featured' : 'wall__cell');
  // Stagger index drives the entrance choreography; capping keeps delays tight
  // when all twenty-seven volumes stand on the wall.
  item.style.setProperty('--i', String(index % 12));

  const card = link(`#book=${book.id}`, featured ? 'card card--featured' : 'card');

  const body = element('span', 'card__body');
  const eyebrow = element('span', 'card__eyebrow visually-hidden', copy.cardEyebrow);
  // The hook completes the eyebrow's sentence, so both belong to the link's name.
  const hook = element('h2', 'card__hook', book.hook);

  const visual = element('span', 'card__visual');
  visual.append(createIllustration(book.icon, ACCENTS[book.id]));

  const coordinate = coordinateFor(book.id);
  const volume = element(
    'span',
    'card__volume',
    fill(copy.cardAddress, {
      hexagon: coordinate.hexagon,
      volume: String(coordinate.volume),
    }),
  );

  const open = element('span', 'card__open');
  open.append(document.createTextNode(copy.openThisLife));
  open.append(glyph('card__arrow', '→'));

  body.append(eyebrow, hook, visual, volume, open);
  card.append(body);
  item.append(card);
  return item;
}
