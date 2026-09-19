import { copy } from '../content/copy';
import { anotherLifeAfter, findBook } from '../library/catalog';
import { coordinateFor, shelfOf, step, type Coordinate } from '../library/coordinates';
import { hashForAddress, hashForShelf } from '../library/routing';
import { createCoordinateLine } from './BookCard';
import { createIllustration } from './illustrations';
import { createNearbyVolumes } from './NearbyVolumes';
import { element, glyph, link, type ViewHandle } from './view';

const TIMESTAMP = /^\d{2}:\d{2}(:\d{2})?$/;

const DAYS = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
];

/**
 * The Library's note of this consultation: the clock on the reader's own device,
 * written down the way a reading room writes down that a volume was taken out.
 * It records the reading, and claims nothing whatever about the reader.
 */
function createConsultationLine(now: Date): HTMLParagraphElement {
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const day = DAYS[now.getDay()] ?? '';

  const stamp = element('time', 'consulted__time', `${hours}:${minutes}`);
  stamp.dateTime = `${hours}:${minutes}`;
  const [before, rest] = copy.consulted.split('{time}');
  const [between, after] = (rest ?? '').split('{day}');

  const line = element('p', 'consulted');
  line.append(document.createTextNode(before ?? ''), stamp);
  line.append(document.createTextNode(`${between ?? ''}${day}${after ?? ''}`));
  return line;
}

/** A discovered volume: where it sits, what it says, and where it leads. */
export function createBookView(bookId: string, address: Coordinate | null): ViewHandle {
  const book = findBook(bookId);
  if (!book) throw new Error(`No such book: ${bookId}`);
  const coordinate = address ?? coordinateFor(book.id);

  const root = element('article', 'book');

  const back = link('#', 'backlink');
  back.append(glyph('backlink__arrow', '←'), document.createTextNode(copy.backToWall));

  const marker = element('p', 'found', copy.found);

  const visual = element('div', 'book__visual');
  visual.append(createIllustration(book.icon));

  const title = element('h1', 'book__title', book.title);
  title.tabIndex = -1;

  const header = element('div', 'book__header');
  header.append(title, visual);

  const passage = element('div', 'passage');
  for (const paragraph of book.passage) {
    // A bare clock time opens several accounts; it is set as a stamp, not prose.
    const isStamp = TIMESTAMP.test(paragraph);
    passage.append(element('p', isStamp ? 'passage__stamp' : undefined, paragraph));
  }

  const aftertaste = element('p', 'aftertaste', book.aftertaste);

  // The shelf this volume stands on, walkable in both directions.
  const shelfWalk = element('div', 'shelfwalk');
  const previous = step(coordinate, -1n);
  const next = step(coordinate, 1n);
  if (previous) {
    const anchor = link(hashForAddress(previous), 'shelfwalk__link');
    anchor.append(glyph('backlink__arrow', '←'), document.createTextNode(copy.previousVolume));
    shelfWalk.append(anchor);
  }
  shelfWalk.append(link(hashForShelf(shelfOf(coordinate)), 'shelfwalk__link', copy.browseShelf));
  if (next) {
    const anchor = link(hashForAddress(next), 'shelfwalk__link');
    anchor.append(document.createTextNode(copy.nextVolume), glyph('card__arrow', '→'));
    shelfWalk.append(anchor);
  }

  const nextLife = anotherLifeAfter(book.id);
  const anotherLink = link(`#book=${nextLife.id}`, 'action action--primary', copy.anotherLife);
  const wallLink = link('#', 'action action--quiet');
  wallLink.append(glyph('backlink__arrow', '←'), document.createTextNode(copy.backToWall));

  const actions = element('div', 'book__actions');
  actions.append(anotherLink, wallLink);

  root.append(
    back,
    marker,
    createCoordinateLine(coordinate),
    element('p', 'already-here', copy.alreadyHere),
    createConsultationLine(new Date()),
    header,
    passage,
    aftertaste,
    createNearbyVolumes(book),
    shelfWalk,
    actions,
  );

  return {
    element: root,
    // A book's text, coordinate and neighbours never change.
    update(): void {},
    focus(): void {
      title.focus();
    },
  };
}
