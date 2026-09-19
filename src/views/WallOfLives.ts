import { copy } from '../content/copy';
import { TOTAL_BOOKS, wallBooks } from '../library/catalog';
import type { AppState } from '../library/model';
import { createBookCard } from './BookCard';
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
  const heading = element('h1', 'masthead__heading', copy.heading);
  heading.id = 'wall-heading';
  heading.tabIndex = -1;
  masthead.append(
    element('p', 'eyebrow', copy.eyebrow),
    heading,
    element('p', 'masthead__lede', copy.lede),
  );

  const grid = element('ul', 'wall__grid');
  grid.setAttribute('aria-labelledby', 'wall-heading');

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

  root.append(masthead, grid, count, actionsRow);

  function update(next: AppState): void {
    const books = wallBooks(next.wallSelection);
    grid.replaceChildren(...books.map((book, index) => createBookCard(book, index)));

    const word = COUNT_WORDS[books.length] ?? String(books.length);
    count.textContent =
      books.length === TOTAL_BOOKS
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
