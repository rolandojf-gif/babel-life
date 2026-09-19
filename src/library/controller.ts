import { findBook } from './catalog';
import type { AppState, RenderHint, WallSelection } from './model';
import { parseRoute } from './routing';

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
 * wall's current selection in memory, and asks the shell to render.
 */
export function createController(render: Render): Controller {
  const state: AppState = {
    view: 'wall',
    wallSelection: 'first',
    currentBookId: null,
  };

  /** The URL the current rendering corresponds to, so a repeat event is a no-op. */
  let renderedHref = '';

  function applyLocation(hint: RenderHint): void {
    const route = parseRoute(window.location.hash);

    if (route.kind === 'book') {
      const book = findBook(route.bookId);
      if (book) {
        state.view = 'book';
        state.currentBookId = book.id;
      } else {
        state.view = 'invalidAddress';
        state.currentBookId = null;
      }
    } else if (route.kind === 'wall') {
      state.view = 'wall';
      state.currentBookId = null;
    } else {
      state.view = 'invalidAddress';
      state.currentBookId = null;
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
      setWall('second', { focus: 'wallGrid', announce: 'Twelve other lives.' });
    },

    showAll(): void {
      setWall('all', { focus: 'wallGrid', announce: 'All twenty-four lives.' });
    },
  };
}
