import { copy } from '../content/copy';
import { findBook } from '../library/catalog';
import { formatCoordinate, shelfFields, type ShelfCoordinate } from '../library/coordinates';
import type { Controller } from '../library/controller';
import type { AppState, RenderHint } from '../library/model';
import { createAddressView } from './AddressView';
import { createBookView } from './BookView';
import { createShelfView } from './ShelfView';
import { createWallOfLives } from './WallOfLives';
import { createViewTransition } from './motion';
import { initAtmosphere, refreshReveals } from './atmosphere';
import { element, link, type ViewHandle } from './view';

const SITE_TITLE = 'Babel Life';
const HOME_TITLE = 'Babel Life — Possible Lives Inspired by Borges’ Library of Babel';

function formatShelf(shelf: ShelfCoordinate): string {
  return shelfFields(shelf)
    .map((field) => `${field.name} ${field.value}`)
    .join(' · ');
}

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
  footer.append(element('p', 'attribution', copy.copyright));

  const about = element('details', 'about');
  about.append(element('summary', undefined, copy.aboutHeading));
  about.append(element('p', undefined, copy.aboutBody));
  footer.append(about);

  const legal = element('details', 'about');
  legal.append(element('summary', undefined, copy.legalHeading));
  legal.append(element('p', undefined, copy.legalBody));
  legal.append(element('p', undefined, copy.legalOwner));
  footer.append(legal);

  shell.append(grain, main, footer, status);
  root.append(shell);
  initAtmosphere(shell);

  let currentKey = '';
  let currentView: ViewHandle | null = null;
  const transition = createViewTransition(main);

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
      return createBookView(state.currentBookId, state.address);
    }
    if (state.view === 'shelf' && state.shelf !== null) return createShelfView(state.shelf);
    if (state.view === 'address' && state.address !== null) return createAddressView(state.address);
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
    if (state.view === 'shelf' && state.shelf !== null) {
      return `${formatShelf(state.shelf)} — ${SITE_TITLE}`;
    }
    if (state.view === 'address' && state.address !== null) {
      return `${formatCoordinate(state.address)} — ${SITE_TITLE}`;
    }
    return state.view === 'wall' ? HOME_TITLE : SITE_TITLE;
  }

  return function render(state: AppState, hint: RenderHint): void {
    // The controller mutates its state in place; a transition commits asynchronously.
    const next = { ...state };
    transition(() => renderView(next, hint), currentView !== null);
  };

  function renderView(state: AppState, hint: RenderHint): void {
    const key = `${state.view}:${state.currentBookId ?? ''}:${
      state.address ? formatCoordinate(state.address) : ''
    }:${state.shelf ? formatShelf(state.shelf) : ''}`;
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
    refreshReveals(main);
  }
}
