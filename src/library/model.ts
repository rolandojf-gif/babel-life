/** Logical shapes of the catalog and of the state the controller keeps in memory. */

import type { Coordinate, ShelfCoordinate } from './coordinates';

/** An ordered destination from one book to a nearby life in the Library. */
export interface NeighborEdge {
  targetBookId: string;
  /** The exact thing that differs in the destination, stated from here. */
  difference: string;
}

/** What every volume carries, root or nearby alike. */
interface BookBase {
  id: string;
  /** The root life this volume belongs to. A root's rootId is its own id. */
  rootId: string;
  /** Key into the local illustration set. */
  icon: string;
  /** Short label, used where a destination needs naming rather than describing. */
  headline: string;
  /** Literary title. It belongs inside the book, never on a wall card. */
  title: string;
  /** The authored narrative, one string per paragraph. */
  passage: string[];
  /** One restrained line under the narrative. */
  aftertaste: string;
  neighbors: NeighborEdge[];
}

/** One of the twenty-four lives on the wall. Only a root carries a wall hook. */
export interface RootBook extends BookBase {
  kind: 'root';
  /** One complete life premise, completing the card's eyebrow. */
  hook: string;
}

/** A counterfactual variation, reachable only from inside its root's book page. */
export interface NearbyBook extends BookBase {
  kind: 'nearby';
}

export type Book = RootBook | NearbyBook;

/** The two curated sets of twelve root lives the wall shows. */
export interface WallSets {
  first: string[];
  second: string[];
}

export interface Catalog {
  schemaVersion: number;
  wall: WallSets;
  books: Book[];
}

export type View = 'wall' | 'book' | 'shelf' | 'address' | 'invalidAddress';

/** Which curated selection the wall is currently showing. */
export type WallSelection = 'first' | 'second' | 'all';

export interface AppState {
  view: View;
  wallSelection: WallSelection;
  /** The order the wall is dealt in, fixed for this visit and never stored. */
  wallSeed: bigint;
  currentBookId: string | null;
  /** The address being looked at, when the visitor came in by one. */
  address: Coordinate | null;
  /** The shelf being walked. */
  shelf: ShelfCoordinate | null;
}

/** Where focus should land after a render, and what to announce politely. */
export interface RenderHint {
  focus: 'none' | 'view' | 'stranger' | 'wallGrid';
  announce?: string;
}
