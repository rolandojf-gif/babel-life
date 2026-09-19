import { copy } from '../content/copy';
import { anotherLifeAfter, findBook } from '../library/catalog';
import { createBookCard, createCoordinateLine } from './BookCard';
import { createIllustration } from './illustrations';
import { createNearbyVolumes } from './NearbyVolumes';
import { element, glyph, link, type ViewHandle } from './view';

const TIMESTAMP = /^\d{2}:\d{2}(:\d{2})?$/;

/** A discovered volume: where it sits, what it says, and where it leads. */
export function createBookView(bookId: string): ViewHandle {
  const book = findBook(bookId);
  if (!book) throw new Error(`No such book: ${bookId}`);

  const root = element('article', 'book');

  const back = link('#', 'backlink');
  back.append(glyph('backlink__arrow', '←'), document.createTextNode(copy.backToWall));

  const marker = element('p', 'found', copy.found);

  const visual = element('div', 'book__visual');
  visual.append(createIllustration(book.icon));

  const title = element('h1', 'book__title', book.title);
  title.tabIndex = -1;

  const passage = element('div', 'passage');
  for (const paragraph of book.passage) {
    // A bare clock time opens several accounts; it is set as a stamp, not prose.
    const isStamp = TIMESTAMP.test(paragraph);
    passage.append(element('p', isStamp ? 'passage__stamp' : undefined, paragraph));
  }

  const aftertaste = element('p', 'aftertaste', book.aftertaste);

  const next = anotherLifeAfter(book.id);
  const anotherLink = link(`#book=${next.id}`, 'action action--primary', copy.anotherLife);
  const wallLink = link('#', 'action action--quiet');
  wallLink.append(glyph('backlink__arrow', '←'), document.createTextNode(copy.backToWall));

  const actions = element('div', 'book__actions');
  actions.append(anotherLink, wallLink);

  root.append(
    back,
    marker,
    createCoordinateLine(book.id),
    visual,
    title,
    passage,
    aftertaste,
    createNearbyVolumes(book),
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

export { createBookCard };
