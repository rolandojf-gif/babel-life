import { copy } from '../content/copy';
import { findBook } from '../library/catalog';
import type { Book, NeighborEdge } from '../library/model';
import { element, glyph, link } from './view';

function nearbyOpen(): HTMLSpanElement {
  const span = element('span', 'nearby__open', copy.openNearby);
  span.append(glyph('nearby__arrow', '→'));
  return span;
}

/**
 * Rotate the family's three stable identities: R -> A -> B -> R.
 * The current book still supplies each edge's authored difference. A return
 * to the immediately preceding book is offered second, never removed.
 */
export function orderedNearbyEdges(book: Book, previousBookId: string | null = null): NeighborEdge[] {
  const root = findBook(book.rootId);
  if (!root || root.kind !== 'root') throw new Error(`Missing root book for ${book.id}`);
  const [a, b] = root.neighbors;
  if (!a || !b) throw new Error(`Missing family variants for ${root.id}`);

  const cycle = [root.id, a.targetBookId, b.targetBookId];
  const current = cycle.indexOf(book.id);
  if (current === -1) throw new Error(`Book ${book.id} is outside its root's family`);
  const nextIds = [cycle[(current + 1) % 3], cycle[(current + 2) % 3]];

  const edges = nextIds.map((id) => {
    const edge = book.neighbors.find((candidate) => candidate.targetBookId === id);
    if (!edge) throw new Error(`Book ${book.id} is missing its nearby edge to ${id}`);
    return edge;
  });

  if (edges[0]?.targetBookId === previousBookId) edges.reverse();
  return edges;
}

/**
 * The exploration mechanic: two to four lives one difference away, each one
 * naming the difference before the visitor commits to it. A crossing into
 * another narrative family comes last and says so before anything else.
 */
export function createNearbyVolumes(book: Book, previousBookId: string | null = null): HTMLElement {
  const section = element('section', 'nearby nearby--cinematic');
  const heading = element('h2', 'nearby__heading', copy.nearbyVolumes);
  heading.id = `nearby-${book.id}`;
  section.setAttribute('aria-labelledby', heading.id);

  const list = element('ul', 'nearby__list');
  const edges = [...orderedNearbyEdges(book, previousBookId), ...(book.crossings ?? [])];

  for (const [edgeIndex, edge] of edges.entries()) {
    const target = findBook(edge.targetBookId);
    if (!target) continue;
    const crossing = target.rootId !== book.rootId;

    const item = element('li', 'nearby__item');
    // Stagger index for the paired entrance; the two volumes arrive as one beat.
    item.style.setProperty('--i', String(edgeIndex));
    const anchor = link(`#book=${target.id}`, crossing ? 'nearby__link nearby__link--crossing' : 'nearby__link');
    anchor.setAttribute('data-nearby', 'true');
    if (crossing) anchor.append(element('span', 'nearby__family', copy.anotherFamily));
    const headline = element('span', 'nearby__headline', target.headline);
    if (!crossing && target.id === previousBookId) {
      headline.append(element('span', 'nearby__previous', copy.previousBook));
    }
    anchor.append(
      element('span', 'nearby__difference', edge.difference),
      headline,
      nearbyOpen(),
    );
    item.append(anchor);
    list.append(item);
  }

  section.append(heading, list);
  return section;
}
