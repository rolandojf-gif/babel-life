/** Logical shapes of the catalog and of the state the controller keeps in memory. */

/** An ordered destination from one book to a nearby life in the Library. */
export interface NeighborEdge {
  targetBookId: string;
  /** The exact thing that differs in the destination, stated from here. */
  difference: string;
}

/** One immutable book: a permanent accession number, a card, and one authored account. */
export interface Book {
  id: string;
  clusterId: string;
  /** Key into the local illustration set. */
  icon: string;
  /** Short label, used where a destination needs naming rather than describing. */
  headline: string;
  /** The wall hook: one complete life premise, completing the card's eyebrow. */
  hook: string;
  /** Story headline on the book page. */
  title: string;
  /** The authored narrative, one string per paragraph. */
  passage: string[];
  /** One restrained line under the narrative. */
  aftertaste: string;
  neighbors: NeighborEdge[];
}

/** Editorial grouping of nearby lives. Names are internal and never rendered. */
export interface Cluster {
  id: string;
  name: string;
}

/** The two curated sets of twelve the wall shows. */
export interface WallSets {
  first: string[];
  second: string[];
}

export interface Catalog {
  schemaVersion: number;
  clusters: Cluster[];
  wall: WallSets;
  books: Book[];
}

export type View = 'wall' | 'book' | 'invalidAddress';

/** Which curated selection the wall is currently showing. */
export type WallSelection = 'first' | 'second' | 'all';

export interface AppState {
  view: View;
  wallSelection: WallSelection;
  currentBookId: string | null;
}

/** Where focus should land after a render, and what to announce politely. */
export interface RenderHint {
  focus: 'none' | 'view' | 'stranger' | 'wallGrid';
  announce?: string;
}
