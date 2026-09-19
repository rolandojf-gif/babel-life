import { copy } from '../content/copy';
import { findBook } from '../library/catalog';
import type { Book } from '../library/model';
import { element, glyph, link } from './view';

function nearbyOpen(): HTMLSpanElement {
  const span = element('span', 'nearby__open', 'OPEN');
  span.append(glyph('nearby__arrow', '→'));
  return span;
}

/**
 * The exploration mechanic: two to four lives one difference away, each one
 * naming the difference before the visitor commits to it.
 */
export function createNearbyVolumes(book: Book): HTMLElement {
  const section = element('section', 'nearby');
  const heading = element('h2', 'nearby__heading', copy.nearbyVolumes);
  heading.id = `nearby-${book.id}`;
  section.setAttribute('aria-labelledby', heading.id);

  const list = element('ul', 'nearby__list');

  for (const edge of book.neighbors) {
    const target = findBook(edge.targetBookId);
    if (!target) continue;

    const item = element('li', 'nearby__item');
    const anchor = link(`#book=${target.id}`, 'nearby__link');
    anchor.append(
      element('span', 'nearby__difference', edge.difference),
      element('span', 'nearby__headline', target.headline),
      nearbyOpen(),
    );
    item.append(anchor);
    list.append(item);
  }

  section.append(heading, list);
  return section;
}
