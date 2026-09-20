import { copy, fill } from '../content/copy';
import { findBook } from '../library/catalog';
import {
  accessionAt,
  positionOf,
  SHELF_LENGTH,
  shelfOf,
  shelfVolumes,
  type Coordinate,
} from '../library/coordinates';
import { element } from './view';

const NS = 'http://www.w3.org/2000/svg';

const MARK_W = 5;
const MARK_GAP = 3;
const MARK_H = 22;
const CURRENT_EXTRA = 4;
const ROW_W = SHELF_LENGTH * MARK_W + (SHELF_LENGTH - 1) * MARK_GAP;

function svgNode(tag: string, attrs: Record<string, string>): SVGElement {
  const el = document.createElementNS(NS, tag);
  for (const [name, value] of Object.entries(attrs)) el.setAttribute(name, value);
  return el;
}

function legibleAt(address: Coordinate): boolean {
  const position = positionOf(address);
  if (position === undefined) return false;
  const accession = accessionAt(position);
  if (accession === undefined) return false;
  return findBook(accession) !== undefined;
}

function markX(volume: number): number {
  return (volume - 1) * (MARK_W + MARK_GAP);
}

function createShelfDiagram(coordinate: Coordinate): SVGSVGElement {
  const shelf = shelfOf(coordinate);
  const current = coordinate.volume;
  const markTop = MARK_H + CURRENT_EXTRA;
  const baselineY = markTop + 4;
  const labelY = baselineY + 11;
  const height = labelY + 2;

  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', `0 0 ${String(ROW_W)} ${String(height)}`);
  svg.setAttribute('class', 'shelf-locator__svg');
  svg.setAttribute('focusable', 'false');
  svg.setAttribute('overflow', 'visible');

  svg.append(
    svgNode('line', {
      class: 'shelf-locator__baseline',
      x1: '0',
      y1: String(baselineY),
      x2: String(ROW_W),
      y2: String(baselineY),
    }),
  );

  for (const address of shelfVolumes(shelf)) {
    const volume = address.volume;
    const x = markX(volume);
    const isCurrent = volume === current;
    const readable = legibleAt(address);
    const h = isCurrent ? MARK_H + CURRENT_EXTRA : MARK_H;
    const y = baselineY - h;

    if (isCurrent) {
      const cx = x + MARK_W / 2;
      svg.append(
        svgNode('polygon', {
          class: 'shelf-locator__pointer',
          points: `${String(cx - 2.5)},${String(y - 2)} ${String(cx + 2.5)},${String(y - 2)} ${String(cx)},${String(y + 2)}`,
        }),
        svgNode('rect', {
          class: 'shelf-locator__mark shelf-locator__mark--current',
          x: String(x),
          y: String(y),
          width: String(MARK_W),
          height: String(h),
        }),
      );
    } else if (readable) {
      svg.append(
        svgNode('rect', {
          class: 'shelf-locator__mark shelf-locator__mark--legible',
          x: String(x),
          y: String(y),
          width: String(MARK_W),
          height: String(h),
        }),
      );
    } else {
      svg.append(
        svgNode('rect', {
          class: 'shelf-locator__mark shelf-locator__mark--unreadable',
          x: String(x),
          y: String(y),
          width: String(MARK_W),
          height: String(h),
        }),
      );
    }
  }

  const startLabel = svgNode('text', {
    class: 'shelf-locator__end-label',
    x: '0',
    y: String(labelY),
    'text-anchor': 'start',
  });
  startLabel.textContent = '1';
  const endLabel = svgNode('text', {
    class: 'shelf-locator__end-label',
    x: String(ROW_W),
    y: String(labelY),
    'text-anchor': 'end',
  });
  endLabel.textContent = String(SHELF_LENGTH);
  svg.append(startLabel, endLabel);

  return svg;
}

/** Compact “you are here” map. Informational only: the shelf itself stands below. */
export function createShelfLocator(coordinate: Coordinate): HTMLDivElement {
  const shelf = shelfOf(coordinate);
  const otherLegible = shelfVolumes(shelf).some(
    (address) => address.volume !== coordinate.volume && legibleAt(address),
  );

  const root = element('div', 'shelf-locator');
  root.append(element('span', 'shelf-locator__heading', copy.locatorHeading));

  const diagram = element('span', 'shelf-locator__diagram');
  diagram.setAttribute('aria-hidden', 'true');
  diagram.append(createShelfDiagram(coordinate));
  root.append(diagram);

  root.append(
    element(
      'span',
      'shelf-locator__here',
      fill(copy.locatorHere, { n: String(coordinate.volume) }),
    ),
  );

  const key = element('span', 'shelf-locator__key');
  if (otherLegible) {
    key.append(
      element('span', 'shelf-locator__key-mark shelf-locator__key-mark--legible'),
      document.createTextNode(copy.locatorAlsoLegible),
    );
  } else {
    key.append(
      element('span', 'shelf-locator__key-mark shelf-locator__key-mark--solo'),
      document.createTextNode(copy.locatorSolo),
    );
  }
  root.append(key);

  return root;
}
