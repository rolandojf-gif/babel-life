import { copy } from '../content/copy';
import { findBook } from '../library/catalog';
import type { Controller } from '../library/controller';
import type { AppState, RenderHint } from '../library/model';
import { createBookView } from './BookView';
import { createWallOfLives } from './WallOfLives';
import { element, link, type ViewHandle } from './view';

const SITE_TITLE = 'The Library of Lives';

/**
 * The page: paper, the reading column, the footer, the polite status region, and
 * the wiring between the controller and the three views. The invalid-address
 * fallback lives here too.
 */
export function mountAppShell(
  root: HTMLElement,
  controller: Controller,
): (state: AppState, hint: RenderHint) => void {
  root.textContent = '';

  const shell = element('div', 'shell');

  const grain = element('div', 'grain');
  grain.setAttribute('aria-hidden', 'true');

  const main = element('main', 'main');
  main.id = 'main';

  const status = element('div', 'visually-hidden');
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');

  const footer = element('footer', 'footer');
  footer.append(element('p', 'attribution', copy.attribution));
  const about = element('details', 'about');
  about.append(element('summary', undefined, copy.aboutHeading));
  about.append(element('p', undefined, copy.aboutBody));
  footer.append(about);

  shell.append(grain, main, footer, status);
  root.append(shell);

  let currentKey = '';
  let currentView: ViewHandle | null = null;

  function invalidAddressView(): ViewHandle {
    const view = element('div', 'invalid-address');
    const heading = element('h1', 'invalid-address__message', copy.invalidAddress);
    heading.tabIndex = -1;

    const enter = link('#', 'action action--primary', copy.enterTheLibrary);
    const actions = element('div', 'book__actions');
    actions.append(enter);

    view.append(
      element('p', 'eyebrow', copy.eyebrow),
      heading,
      element('p', 'invalid-address__note', copy.invalidAddressNote),
      actions,
    );

    return {
      element: view,
      update(): void {},
      focus(): void {
        heading.focus();
      },
    };
  }

  function build(state: AppState): ViewHandle {
    if (state.view === 'book' && state.currentBookId !== null) {
      return createBookView(state.currentBookId);
    }
    if (state.view === 'invalidAddress') return invalidAddressView();
    return createWallOfLives(state, {
      onSomethingStranger: () => {
        controller.showSomethingStranger();
      },
      onShowAll: () => {
        controller.showAll();
      },
    });
  }

  function documentTitle(state: AppState): string {
    if (state.view === 'book' && state.currentBookId !== null) {
      const book = findBook(state.currentBookId);
      if (book) return `${book.title} — ${SITE_TITLE}`;
    }
    return SITE_TITLE;
  }

  return function render(state: AppState, hint: RenderHint): void {
    const key = `${state.view}:${state.currentBookId ?? ''}`;
    let view = currentView;

    if (key !== currentKey || view === null) {
      currentKey = key;
      view = build(state);
      currentView = view;
      main.replaceChildren(view.element);
      document.title = documentTitle(state);
      if (hint.focus !== 'none') window.scrollTo(0, 0);
    } else {
      view.update(state);
    }

    if (hint.focus !== 'none') view.focus(hint.focus);
    if (hint.announce !== undefined) status.textContent = hint.announce;
  };
}
