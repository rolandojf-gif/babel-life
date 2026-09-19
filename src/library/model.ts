/** Logical shapes of the catalog and of the state the controller keeps in memory. */

/** Editorial shelf a scenario belongs to. Phase 1 only publishes the threshold. */
export type Depth = 0 | 1 | 2;

/** An ordered destination from one book to another. Phase 1 leaves these empty. */
export interface NeighborEdge {
  targetBookId: string;
  label: string;
  differenceNote: string;
}

/** One immutable book: a permanent accession number and one authored passage. */
export interface Book {
  id: string;
  scenarioId: string;
  passage: string;
  neighbors: NeighborEdge[];
}

/** A seed the chooser can offer. `category` is editorial metadata and never rendered. */
export interface Scenario {
  id: string;
  selectorText: string;
  category: string;
  depth: Depth;
  order: number;
  baseBookId: string;
}

export interface Catalog {
  schemaVersion: number;
  scenarios: Scenario[];
  books: Book[];
}

/** The views phase 1 can show. `realBook` arrives with the limit shelf. */
export type View = 'chooser' | 'book' | 'invalidAddress';

export interface AppState {
  view: View;
  selectedScenarioId: string;
  currentBookId: string | null;
}

/** Where focus should land after a render, and what to announce politely. */
export interface RenderHint {
  focus: 'none' | 'view' | 'shortcut' | 'find';
  announce?: string;
}
