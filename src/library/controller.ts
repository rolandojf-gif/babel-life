import { copy, fill } from '../content/copy';
import { findBook, wallBooks } from './catalog';
import { accessionAt, positionOf, shelfOf } from './coordinates';
import type { AppState, RenderHint, WallSelection } from './model';
import { parseRoute } from './routing';
import { sessionSeed } from './shuffle';

export interface Controller {
  readonly state: AppState;
  start(): void;
  showSomethingStranger(): void;
  showAll(): void;
}

type Render = (state: AppState, hint: RenderHint) => void;

/**
 * One small explicit controller. Views navigate with ordinary hash links, so the
 * browser owns the history stack; the controller reads the location, keeps the
 * wall's current selection and this visit's card order in memory, and asks the
 * shell to render. The order is drawn once, so nothing on the wall moves while
 * the visitor is reading.
 */
export function createController(render: Render, seed: bigint = sessionSeed()): Controller {
  const state: AppState = {
    view: 'wall',
    wallSelection: 'first',
    wallSeed: seed,
    currentBookId: null,
    address: null,
    shelf: null,
  };

  /** The URL the current rendering corresponds to, so a repeat event is a no-op. */
  let renderedHref = '';

  function applyLocation(hint: RenderHint): void {
    const route = parseRoute(window.location.hash);
    state.currentBookId = null;
    state.address = null;
    state.shelf = null;

    if (route.kind === 'book') {
      const book = findBook(route.bookId);
      if (book) {
        state.view = 'book';
        state.currentBookId = book.id;
      } else {
        state.view = 'invalidAddress';
      }
    } else if (route.kind === 'shelf') {
      // A shelf is real when its first volume addresses somewhere in the space.
      state.view = positionOf({ ...route.shelf, volume: 1 }) === undefined ? 'invalidAddress' : 'shelf';
      state.shelf = state.view === 'shelf' ? route.shelf : null;
    } else if (route.kind === 'address') {
      const position = positionOf(route.coordinate);
      if (position === undefined) {
        state.view = 'invalidAddress';
      } else {
        // Every address holds a volume; this edition can print eighty-one of them.
        const bookId = accessionAt(position);
        const book = bookId === undefined ? undefined : findBook(bookId);
        state.address = route.coordinate;
        state.shelf = shelfOf(route.coordinate);
        state.view = book ? 'book' : 'address';
        state.currentBookId = book?.id ?? null;
      }
    } else if (route.kind === 'wall') {
      state.view = 'wall';
    } else {
      state.view = 'invalidAddress';
    }

    renderedHref = window.location.href;
    render(state, hint);
  }

  function onLocationChange(): void {
    if (window.location.href === renderedHref) return;
    applyLocation({ focus: 'view' });
  }

  function setWall(selection: WallSelection, hint: RenderHint): void {
    if (state.wallSelection === selection) return;
    state.wallSelection = selection;
    render(state, hint);
  }

  return {
    state,

    start(): void {
      window.addEventListener('hashchange', onLocationChange);
      window.addEventListener('popstate', onLocationChange);
      applyLocation({ focus: 'none' });
    },

    showSomethingStranger(): void {
      // Spoken from the lives this deal actually adds, like the wall's own count.
      const shown = wallBooks('second', state.wallSeed).length;
      const announce = fill(copy.announceStranger, {
        count: copy.countWords[shown] ?? String(shown),
      });
      setWall('second', { focus: 'wallGrid', announce });
    },

    showAll(): void {
      setWall('all', { focus: 'wallAppended', announce: copy.announceAll });
    },
  };
}
