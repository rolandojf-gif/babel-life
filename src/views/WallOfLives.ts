import { copy } from '../content/copy';
import { TOTAL_ROOTS, wallBooks } from '../library/catalog';
import { coordinateFor } from '../library/coordinates';
import type { AppState } from '../library/model';
import { parseRoute } from '../library/routing';
import { createBookCard } from './BookCard';
import { createLibraryIndex, updateLibraryIndex } from './libraryIndex';
import { element, type ViewHandle } from './view';

interface WallActions {
  onSomethingStranger(): void;
  onShowAll(): void;
}

const COUNT_WORDS: Record<number, string> = { 12: 'Twelve', 24: 'All twenty-four' };

/** The wall of lives: the whole site, understandable by looking at it. */
export function createWallOfLives(state: AppState, actions: WallActions): ViewHandle {
  const root = element('div', 'wall');

  const masthead = element('header', 'masthead');
  const copyBlock = element('div', 'masthead__copy');
  const heading = element('h1', 'masthead__heading', copy.heading);
  heading.id = 'wall-heading';
  heading.tabIndex = -1;

  const libraryValue = element('p', 'masthead__scale-value');
  libraryValue.append(
    document.createTextNode(copy.libraryScaleMantissa),
    element('sup', 'masthead__scale-exponent', copy.libraryScaleExponent),
    document.createTextNode(` ${copy.libraryScaleUnit}`),
  );

  const universeValue = element('p', 'masthead__scale-value');
  universeValue.append(
    document.createTextNode(copy.universeScaleMantissa),
    element('sup', 'masthead__scale-exponent', copy.universeScaleExponent),
    document.createTextNode(` ${copy.universeScaleUnit}`),
  );

  const scale = element('div', 'masthead__scale');
  const libraryScale = element('div', 'masthead__scale-item');
  libraryScale.append(
    element('p', 'masthead__scale-label', copy.libraryScaleLabel),
    libraryValue,
    element('p', 'masthead__scale-meta', copy.libraryScaleMeta),
  );
  const universeScale = element('div', 'masthead__scale-item');
  universeScale.append(
    element('p', 'masthead__scale-label', copy.universeScaleLabel),
    universeValue,
  );
  scale.append(libraryScale, universeScale);

  copyBlock.append(
    element('p', 'eyebrow', copy.eyebrow),
    heading,
    element('p', 'masthead__dek', copy.dek),
    scale,
  );

  const opening = wallBooks('first', state.wallSeed);
  const firstRoot = opening[0];
  if (!firstRoot) throw new Error('The wall has no first volume');
  let defaultBookId = firstRoot.id;
  const index = createLibraryIndex(coordinateFor(defaultBookId));
  masthead.append(copyBlock, index);

  const preamble = element('p', 'wall__preamble', copy.cardEyebrow);
  preamble.setAttribute('aria-hidden', 'true');

  const grid = element('ul', 'wall__grid');
  grid.setAttribute('aria-labelledby', 'wall-heading');

  let pointerBookId: string | undefined;
  let focusBookId: string | undefined;

  function bookIdFrom(node: EventTarget | null): string | undefined {
    if (!(node instanceof Element)) return undefined;
    const card = node.closest('a.card');
    const href = card?.getAttribute('href');
    if (href === null || href === undefined) return undefined;
    const route = parseRoute(href);
    return route.kind === 'book' ? route.bookId : undefined;
  }

  function locate(): void {
    const id = pointerBookId ?? focusBookId ?? defaultBookId;
    updateLibraryIndex(index, coordinateFor(id));
  }

  grid.addEventListener('pointerover', (event) => {
    const id = bookIdFrom(event.target);
    if (id === undefined) return;
    pointerBookId = id;
    locate();
  });
  grid.addEventListener('pointerout', (event) => {
    if (bookIdFrom(event.target) === undefined || bookIdFrom(event.relatedTarget) !== undefined) {
      return;
    }
    pointerBookId = undefined;
    locate();
  });
  grid.addEventListener('focusin', (event) => {
    const id = bookIdFrom(event.target);
    if (id === undefined) return;
    focusBookId = id;
    locate();
  });
  grid.addEventListener('focusout', (event) => {
    if (bookIdFrom(event.target) === undefined || bookIdFrom(event.relatedTarget) !== undefined) {
      return;
    }
    focusBookId = undefined;
    locate();
  });

  const count = element('p', 'wall__count');

  const strangerButton = element('button', 'action action--stranger', copy.somethingStranger);
  strangerButton.type = 'button';
  strangerButton.addEventListener('click', () => {
    actions.onSomethingStranger();
  });

  const allButton = element('button', 'action action--quiet', copy.showAll);
  allButton.type = 'button';
  allButton.addEventListener('click', () => {
    actions.onShowAll();
  });

  const actionsRow = element('div', 'wall__actions');

  root.append(masthead, preamble, grid, count, actionsRow);

  function update(next: AppState): void {
    const opening = wallBooks('first', next.wallSeed)[0];
    if (opening) defaultBookId = opening.id;
    pointerBookId = undefined;
    focusBookId = undefined;

    const books = wallBooks(next.wallSelection, next.wallSeed);
    grid.replaceChildren(...books.map((book, cardIndex) => createBookCard(book, cardIndex)));
    locate();

    const word = COUNT_WORDS[books.length] ?? String(books.length);
    count.textContent =
      books.length === TOTAL_ROOTS
        ? `${word} volumes.`
        : `${word} of twenty-four volumes.`;

    // No disabled placeholders: an action that has nothing left to do is absent.
    const showStranger = next.wallSelection === 'first';
    const showAll = next.wallSelection !== 'all';
    actionsRow.replaceChildren(
      ...(showStranger ? [strangerButton] : []),
      ...(showAll ? [allButton] : []),
    );
  }

  update(state);

  return {
    element: root,
    update,
    focus(target): void {
      if (target === 'stranger' && strangerButton.isConnected) {
        strangerButton.focus();
        return;
      }
      if (target === 'wallGrid') {
        const first = grid.querySelector<HTMLAnchorElement>('a.card');
        if (first) {
          first.focus();
          return;
        }
      }
      heading.focus();
    },
  };
}
