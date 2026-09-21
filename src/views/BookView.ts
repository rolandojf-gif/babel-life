import { copy } from '../content/copy';
import { anotherLifeAfter, findBook } from '../library/catalog';
import { coordinateFor, shelfOf, step, type Coordinate } from '../library/coordinates';
import { hashForAddress, hashForShelf } from '../library/routing';
import type { Book } from '../library/model';
import { createIllustration } from './illustrations';
import { createCandleGlyph } from './motifs';
import { createNearbyVolumes } from './NearbyVolumes';
import { createEmbeddedShelf } from './shelfListing';
import { createShelfLocator } from './shelfLocator';
import { element, glyph, link, type ViewHandle } from './view';

const TIMESTAMP = /^\d{2}:\d{2}(:\d{2})?$/;

/**
 * The Library's note of this consultation: the clock on the reader's own device,
 * written down the way a reading room writes down that a volume was taken out.
 * It records the reading, and claims nothing whatever about the reader.
 */
function createConsultationLine(now: Date): HTMLParagraphElement {
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const day = copy.days[now.getDay()] ?? '';

  const stamp = element('time', 'consulted__time', `${hours}:${minutes}`);
  stamp.dateTime = `${hours}:${minutes}`;
  const [before, rest] = copy.consulted.split('{time}');
  const [between, after] = (rest ?? '').split('{day}');

  const line = element('p', 'consulted');
  // The consultation is read by the same candle as the wall's preamble.
  line.append(
    createCandleGlyph(),
    document.createTextNode(before ?? ''),
    stamp,
  );
  line.append(document.createTextNode(`${between ?? ''}${day}${after ?? ''}`));
  return line;
}

function createPassage(book: Book): HTMLDivElement {
  const passage = element('div', 'passage');
  for (const paragraph of book.passage) {
    // A bare clock time opens several accounts; it is set as a stamp, not prose.
    const isStamp = TIMESTAMP.test(paragraph);
    passage.append(element('p', isStamp ? 'passage__stamp' : undefined, paragraph));
  }
  return passage;
}

function createBookVisual(book: Book): HTMLDivElement {
  const visual = element('div', 'book__visual');
  visual.setAttribute('aria-hidden', 'true');
  visual.append(createIllustration(book.icon));
  return visual;
}

function createShelfWalk(coordinate: Coordinate): HTMLDivElement {
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
  return shelfWalk;
}

function createBookActions(book: Book): HTMLDivElement {
  const nextLife = anotherLifeAfter(book.id);
  const anotherLink = link(`#book=${nextLife.id}`, 'action action--primary', copy.anotherLife);
  const wallLink = link('#', 'action action--quiet');
  wallLink.append(glyph('backlink__arrow', '←'), document.createTextNode(copy.backToWall));
  const actions = element('div', 'book__actions');
  actions.append(anotherLink, wallLink);
  return actions;
}

function createBackLink(): HTMLAnchorElement {
  const back = link('#', 'backlink');
  back.append(glyph('backlink__arrow', '←'), document.createTextNode(copy.backToWall));
  return back;
}

/** A discovered volume: left leaf, narrative, and the shelf it stands on. */
export function createBookView(bookId: string, address: Coordinate | null): ViewHandle {
  const book = findBook(bookId);
  if (!book) throw new Error(`No such book: ${bookId}`);
  const coordinate = address ?? coordinateFor(book.id);

  const root = element('article', 'book book--spread');
  // Entrance choreography: the spread rises as one cinematic beat on arrival.
  root.setAttribute('data-book-entrance', '');

  const title = element('h1', 'book__title', book.title);
  title.tabIndex = -1;

  const header = element('div', 'book__header');
  header.append(title, createBookVisual(book));

  const verso = element('div', 'spread__verso');
  verso.append(
    element('p', 'found', copy.found),
    createShelfLocator(coordinate),
    createConsultationLine(new Date()),
  );

  const gutter = element('div', 'spread__gutter');
  gutter.setAttribute('aria-hidden', 'true');

  const recto = element('div', 'spread__recto');
  recto.append(
    header,
    element('p', 'already-here', copy.alreadyHere),
    createPassage(book),
    element('p', 'aftertaste', book.aftertaste),
  );

  const spread = element('div', 'spread');
  spread.append(verso, gutter, recto);

  const shelfGutter = element('div', 'book__shelf-gutter');
  shelfGutter.setAttribute('aria-hidden', 'true');

  root.append(
    createBackLink(),
    spread,
    shelfGutter,
    createEmbeddedShelf(shelfOf(coordinate), book.id),
    createNearbyVolumes(book),
    createShelfWalk(coordinate),
    createBookActions(book),
  );

  return {
    element: root,
    update(): void {},
    focus(): void {
      title.focus();
    },
  };
}
