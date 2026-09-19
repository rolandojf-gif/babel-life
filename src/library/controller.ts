import { DEFAULT_SCENARIO_ID, availableScenarios, findBook, findScenario, nextScenarioAfter } from './catalog';
import type { AppState, RenderHint } from './model';
import { CHOOSER_HASH, hashForBook, parseRoute } from './routing';

export interface Controller {
  readonly state: AppState;
  start(): void;
  selectScenario(scenarioId: string): void;
  showSomethingStranger(): void;
  findTheBook(): void;
  lookForAnotherBook(): void;
  enterTheLibrary(): void;
}

type Render = (state: AppState, hint: RenderHint) => void;

/**
 * One small explicit controller. It owns the view state, reads and writes hash
 * routes, and asks the shell to render. It never touches the DOM itself.
 */
export function createController(render: Render): Controller {
  const state: AppState = {
    view: 'chooser',
    selectedScenarioId: DEFAULT_SCENARIO_ID,
    currentBookId: null,
  };

  /** The URL the current rendering corresponds to, so a repeat event is a no-op. */
  let renderedHref = '';

  function applyLocation(hint: RenderHint): void {
    const route = parseRoute(window.location.hash);

    if (route.kind === 'chooser') {
      state.view = 'chooser';
      state.currentBookId = null;
    } else if (route.kind === 'book') {
      const book = findBook(route.bookId);
      if (book) {
        state.view = 'book';
        state.currentBookId = book.id;
        // So that "Look for another book" returns to the premise just read.
        if (availableScenarios().some((scenario) => scenario.id === book.scenarioId)) {
          state.selectedScenarioId = book.scenarioId;
        }
      } else {
        state.view = 'invalidAddress';
        state.currentBookId = null;
      }
    } else {
      state.view = 'invalidAddress';
      state.currentBookId = null;
    }

    renderedHref = window.location.href;
    render(state, hint);
  }

  /** A deliberate view change: one history entry, unless the URL already matches. */
  function go(hash: string, hint: RenderHint): void {
    const target = new URL(window.location.pathname + window.location.search + hash, window.location.href);
    if (target.href !== window.location.href) {
      window.history.pushState(null, '', target.href);
    }
    applyLocation(hint);
  }

  function onLocationChange(): void {
    if (window.location.href === renderedHref) return;
    applyLocation({ focus: 'view' });
  }

  return {
    state,

    start(): void {
      window.addEventListener('popstate', onLocationChange);
      window.addEventListener('hashchange', onLocationChange);
      applyLocation({ focus: 'none' });
    },

    selectScenario(scenarioId: string): void {
      if (!findScenario(scenarioId)) return;
      if (state.selectedScenarioId === scenarioId) return;
      state.selectedScenarioId = scenarioId;
      render(state, { focus: 'none' });
    },

    showSomethingStranger(): void {
      const next = nextScenarioAfter(state.selectedScenarioId);
      if (!next) return;
      state.selectedScenarioId = next.id;
      const moreRemain = nextScenarioAfter(next.id) !== undefined;
      render(state, { focus: moreRemain ? 'shortcut' : 'find', announce: next.selectorText });
    },

    findTheBook(): void {
      const scenario = findScenario(state.selectedScenarioId);
      if (!scenario) return;
      go(hashForBook(scenario.baseBookId), { focus: 'view' });
    },

    lookForAnotherBook(): void {
      go(CHOOSER_HASH, { focus: 'view' });
    },

    enterTheLibrary(): void {
      go(CHOOSER_HASH, { focus: 'view' });
    },
  };
}
