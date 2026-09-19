import catalogData from '../content/catalog.json';
import type { Book, Catalog, Scenario } from './model';

const BOOK_ID = /^b\d{4}$/;
const SCENARIO_ID = /^s\d{2}$/;

/**
 * Rejects an unusable catalog at load time: bad ID syntax, duplicate identities,
 * unresolved references or empty passages. The complete graph check arrives with
 * the full catalog.
 */
function validate(data: Catalog): Catalog {
  if (data.schemaVersion !== 1) {
    throw new Error(`Unsupported catalog schemaVersion: ${String(data.schemaVersion)}`);
  }

  const books = new Map<string, Book>();
  for (const book of data.books) {
    if (!BOOK_ID.test(book.id)) throw new Error(`Invalid book id: ${book.id}`);
    if (books.has(book.id)) throw new Error(`Duplicate book id: ${book.id}`);
    if (book.passage.trim() === '') throw new Error(`Empty passage in book: ${book.id}`);
    books.set(book.id, book);
  }

  const scenarios = new Map<string, Scenario>();
  const orders = new Set<number>();
  for (const scenario of data.scenarios) {
    if (!SCENARIO_ID.test(scenario.id)) throw new Error(`Invalid scenario id: ${scenario.id}`);
    if (scenarios.has(scenario.id)) throw new Error(`Duplicate scenario id: ${scenario.id}`);
    if (scenario.depth !== 0 && scenario.depth !== 1 && scenario.depth !== 2) {
      throw new Error(`Invalid depth on scenario: ${scenario.id}`);
    }
    if (orders.has(scenario.order)) throw new Error(`Duplicate scenario order: ${scenario.order}`);
    orders.add(scenario.order);
    const base = books.get(scenario.baseBookId);
    if (!base) throw new Error(`Scenario ${scenario.id} points at unknown book ${scenario.baseBookId}`);
    if (base.scenarioId !== scenario.id) {
      throw new Error(`Book ${base.id} does not belong to scenario ${scenario.id}`);
    }
    scenarios.set(scenario.id, scenario);
  }

  for (const book of data.books) {
    if (!scenarios.has(book.scenarioId)) {
      throw new Error(`Book ${book.id} points at unknown scenario ${book.scenarioId}`);
    }
  }

  return data;
}

export const catalog: Catalog = validate(catalogData as Catalog);

export function findBook(id: string): Book | undefined {
  return catalog.books.find((book) => book.id === id);
}

export function findScenario(id: string): Scenario | undefined {
  return catalog.scenarios.find((scenario) => scenario.id === id);
}

/** Scenarios the visitor may currently choose, in the fixed editorial order. */
export function availableScenarios(): Scenario[] {
  return catalog.scenarios.filter((scenario) => scenario.depth === 0).sort((a, b) => a.order - b.order);
}

/** The next authored premise after the given one, or undefined at the end. */
export function nextScenarioAfter(id: string): Scenario | undefined {
  const scenarios = availableScenarios();
  const current = scenarios.find((scenario) => scenario.id === id);
  if (!current) return undefined;
  return scenarios.find((scenario) => scenario.order > current.order);
}

/** The scenario the site opens on: the 47-second football match. */
export const DEFAULT_SCENARIO_ID = 's03';
