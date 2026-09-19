import { copy } from '../content/copy';
import type { Controller } from '../library/controller';
import type { AppState, RenderHint } from '../library/model';
import { createBookView } from './BookView';
import { createScenarioChooser } from './ScenarioChooser';
import { element, type ViewHandle } from './view';

/**
 * The reading column, the footer, the polite status region, and the wiring between
 * the controller and the three views. The invalid-address fallback lives here too.
 */
export function mountAppShell(root: HTMLElement, controller: Controller): (state: AppState, hint: RenderHint) => void {
  root.textContent = '';

  const shell = element('div', 'shell');
  const main = element('main', 'column');
  main.id = 'main';

  const status = element('div', 'visually-hidden');
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');

  const footer = element('footer', 'column footer');
  footer.append(element('p', 'attribution', copy.attribution));

  const about = element('details', 'about');
  about.append(element('summary', undefined, copy.aboutHeading));
  about.append(element('p', undefined, copy.aboutBody));
  footer.append(about);

  shell.append(main, footer, status);
  root.append(shell);

  let currentKey = '';
  let currentView: ViewHandle | null = null;

  function invalidAddressView(): ViewHandle {
    const view = element('div', 'invalid-address');
    const heading = element('h1', 'invalid-address__message', copy.invalidAddress);
    heading.tabIndex = -1;

    const enter = element('button', 'action action--primary', copy.enterTheLibrary);
    enter.type = 'button';
    enter.addEventListener('click', () => {
      controller.enterTheLibrary();
    });

    const actions = element('div', 'actions');
    actions.append(enter);
    view.append(heading, actions);

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
      return createBookView(state.currentBookId, {
        onLookForAnotherBook: () => {
          controller.lookForAnotherBook();
        },
      });
    }
    if (state.view === 'invalidAddress') return invalidAddressView();
    return createScenarioChooser(state, {
      onSelect: (scenarioId) => {
        controller.selectScenario(scenarioId);
      },
      onFindTheBook: () => {
        controller.findTheBook();
      },
      onSomethingStranger: () => {
        controller.showSomethingStranger();
      },
    });
  }

  return function render(state: AppState, hint: RenderHint): void {
    const key = `${state.view}:${state.currentBookId ?? ''}`;
    if (key !== currentKey || currentView === null) {
      currentKey = key;
      currentView = build(state);
      main.replaceChildren(currentView.element);
    } else {
      currentView.update(state);
    }

    if (hint.focus !== 'none') currentView.focus(hint.focus);
    if (hint.announce !== undefined) status.textContent = hint.announce;
  };
}
