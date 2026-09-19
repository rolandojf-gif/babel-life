import { copy } from '../content/copy';
import { findBook } from '../library/catalog';
import { coordinateFields, coordinateFor } from '../library/coordinates';
import { element, type ViewHandle } from './view';

interface BookActions {
  onLookForAnotherBook(): void;
}

/** The same view serves every book: a coordinate, one authored passage, and the way back. */
export function createBookView(bookId: string, actions: BookActions): ViewHandle {
  const book = findBook(bookId);
  if (!book) throw new Error(`No such book: ${bookId}`);

  const root = element('div', 'book');

  const coordinate = element('p', 'coordinate');
  for (const [index, field] of coordinateFields(coordinateFor(book.id)).entries()) {
    if (index > 0) coordinate.append(element('span', 'coordinate__separator', ' · '));
    // A no-break space keeps each field whole; the line breaks at the separators.
    coordinate.append(element('span', 'coordinate__field', `${field.name} ${field.value}`));
  }

  const label = element('h1', 'passage-label', copy.passageLabel);
  label.tabIndex = -1;

  const passage = element('div', 'passage');
  for (const paragraph of book.passage.split('\n\n')) {
    passage.append(element('p', undefined, paragraph));
  }

  const exists = element('p', 'book-exists', copy.bookExists);

  const rule = element('hr', 'rule');

  const anotherButton = element('button', 'action action--secondary', copy.lookForAnotherBook);
  anotherButton.type = 'button';
  anotherButton.addEventListener('click', () => {
    actions.onLookForAnotherBook();
  });

  const actionsRow = element('div', 'actions');
  actionsRow.append(anotherButton);

  root.append(coordinate, label, passage, exists, rule, actionsRow);

  return {
    element: root,
    // A book's text and coordinate never change; a different book is a different view.
    update(): void {},
    focus(): void {
      label.focus();
    },
  };
}
