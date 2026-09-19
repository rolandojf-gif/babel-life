import { copy } from '../content/copy';
import { availableScenarios, nextScenarioAfter } from '../library/catalog';
import type { AppState } from '../library/model';
import { element, type ViewHandle } from './view';

interface ChooserActions {
  onSelect(scenarioId: string): void;
  onFindTheBook(): void;
  onSomethingStranger(): void;
}

/**
 * The threshold: one opening line, the complete authored premises in a native
 * select, the primary find action, and the quiet curiosity shortcut.
 */
export function createScenarioChooser(state: AppState, actions: ChooserActions): ViewHandle {
  const root = element('div', 'chooser');

  const openingLine = element('h1', 'opening-line', copy.openingLine);
  openingLine.id = 'opening-line';
  openingLine.tabIndex = -1;

  const select = element('select', 'scenario-select');
  select.id = 'scenario-select';
  select.setAttribute('aria-labelledby', 'opening-line');
  for (const scenario of availableScenarios()) {
    const option = element('option', undefined, scenario.selectorText);
    option.value = scenario.id;
    select.append(option);
  }
  select.addEventListener('change', () => {
    actions.onSelect(select.value);
  });

  // The native select truncates long premises on narrow screens, so the chosen
  // one is repeated in full below it. Assistive technology already has it.
  const premise = element('p', 'premise');
  premise.setAttribute('aria-hidden', 'true');

  const findButton = element('button', 'action action--primary', copy.findTheBook);
  findButton.type = 'button';
  findButton.addEventListener('click', () => {
    actions.onFindTheBook();
  });

  const strangerButton = element('button', 'action action--quiet', copy.somethingStranger);
  strangerButton.type = 'button';
  strangerButton.addEventListener('click', () => {
    actions.onSomethingStranger();
  });

  const actionsRow = element('div', 'actions');
  actionsRow.append(findButton);

  root.append(openingLine, select, premise, actionsRow);

  function update(next: AppState): void {
    const scenario = availableScenarios().find((candidate) => candidate.id === next.selectedScenarioId);
    if (!scenario) return;
    if (select.value !== scenario.id) select.value = scenario.id;
    premise.textContent = scenario.selectorText;

    // No disabled placeholder: the shortcut is simply absent at the last premise.
    const hasNext = nextScenarioAfter(scenario.id) !== undefined;
    if (hasNext && !strangerButton.isConnected) {
      actionsRow.append(strangerButton);
    } else if (!hasNext && strangerButton.isConnected) {
      strangerButton.remove();
    }
  }

  update(state);

  return {
    element: root,
    update,
    focus(target): void {
      if (target === 'shortcut' && strangerButton.isConnected) strangerButton.focus();
      else if (target === 'find') findButton.focus();
      else openingLine.focus();
    },
  };
}
