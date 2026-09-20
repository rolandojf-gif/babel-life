/**
 * A fragment of the Library, drawn as shelves of upright spine marks. Only the
 * current volume is an address; everything around it is structure, not a map.
 */

import {
  coordinateFields,
  formatCoordinate,
  SHELF_LENGTH,
  SHELVES_PER_WALL,
  type Coordinate,
} from '../library/coordinates';
import { element } from './view';

const NS = 'http://www.w3.org/2000/svg';

export const INDEX_MARK_WIDTH = 2;
export const INDEX_MARK_HEIGHT = 6;

export interface IndexMetrics {
  className: string;
  width: number;
  height: number;
  markGap: number;
  shelfGap: number;
  wallGapX: number;
  wallGapY: number;
  originX: number;
  originY: number;
  columns: number;
  rows: number;
}

/** Three complete wall groups; no partial fourth group is allowed to peek in. */
export const WIDE_INDEX: IndexMetrics = {
  className: 'library-index__svg library-index__svg--wide',
  width: 354,
  height: 210,
  markGap: 1,
  shelfGap: 10,
  wallGapX: 32,
  wallGapY: 18,
  originX: 0,
  originY: 4,
  columns: 3,
  rows: 3,
};

/** One anchored wall, with the next group clipped at the right edge. */
export const NARROW_INDEX: IndexMetrics = {
  className: 'library-index__svg library-index__svg--narrow',
  width: 1060,
  height: 112,
  markGap: 6,
  shelfGap: 16,
  wallGapX: 20,
  wallGapY: 0,
  originX: 0,
  originY: 8,
  columns: 4,
  rows: 1,
};

export function wallWidth(metrics: IndexMetrics): number {
  return SHELF_LENGTH * INDEX_MARK_WIDTH + (SHELF_LENGTH - 1) * metrics.markGap;
}

export function wallHeight(metrics: IndexMetrics): number {
  return SHELVES_PER_WALL * INDEX_MARK_HEIGHT + (SHELVES_PER_WALL - 1) * metrics.shelfGap;
}

export function markPosition(
  metrics: IndexMetrics,
  volume: number,
  shelf: number,
  column = 0,
  row = 0,
): { x: number; y: number } {
  const x =
    metrics.originX +
    column * (wallWidth(metrics) + metrics.wallGapX) +
    (volume - 1) * (INDEX_MARK_WIDTH + metrics.markGap);
  const y =
    metrics.originY +
    row * (wallHeight(metrics) + metrics.wallGapY) +
    (shelf - 1) * (INDEX_MARK_HEIGHT + metrics.shelfGap);
  return { x, y };
}

/**
 * Keep the real address in the readout while constraining the decorative locator
 * to the wall groups that are actually visible.
 */
function visibleColumn(metrics: IndexMetrics, wall: number): number {
  return Math.min(Math.max(wall - 1, 0), metrics.columns - 1);
}

export function locatorPosition(metrics: IndexMetrics, coordinate: Coordinate): { x: number; y: number } {
  return markPosition(
    metrics,
    coordinate.volume,
    coordinate.shelf,
    visibleColumn(metrics, coordinate.wall),
    0,
  );
}

function svgNode(tag: string, attrs: Record<string, string>): SVGElement {
  const node = document.createElementNS(NS, tag);
  for (const [name, value] of Object.entries(attrs)) node.setAttribute(name, value);
  return node;
}

function ordinaryMarksPath(metrics: IndexMetrics): string {
  const parts: string[] = [];
  for (let row = 0; row < metrics.rows; row += 1) {
    for (let column = 0; column < metrics.columns; column += 1) {
      for (let shelf = 1; shelf <= SHELVES_PER_WALL; shelf += 1) {
        for (let volume = 1; volume <= SHELF_LENGTH; volume += 1) {
          const { x, y } = markPosition(metrics, volume, shelf, column, row);
          parts.push(`M${String(x)} ${String(y)}h${String(INDEX_MARK_WIDTH)}v${String(INDEX_MARK_HEIGHT)}h-${String(INDEX_MARK_WIDTH)}z`);
        }
      }
    }
  }
  return parts.join('');
}

function bracketPath(): string {
  const inset = 1.25;
  const tick = 2;
  const x0 = -inset;
  const y0 = -inset;
  const x1 = INDEX_MARK_WIDTH + inset;
  const y1 = INDEX_MARK_HEIGHT + inset;
  return [
    `M${String(x0 + tick)} ${String(y0)}H${String(x0)}V${String(y1)}H${String(x0 + tick)}`,
    `M${String(x1 - tick)} ${String(y0)}H${String(x1)}V${String(y1)}H${String(x1 - tick)}`,
  ].join('');
}

function leaderPath(metrics: IndexMetrics, x: number, y: number, wall: number): string {
  const inset = 1.25;
  const runY = y - inset;
  const column = visibleColumn(metrics, wall);
  const ww = wallWidth(metrics);
  const wallOriginX = metrics.originX + column * (ww + metrics.wallGapX);
  const volumeCentreX = x + INDEX_MARK_WIDTH / 2;
  const wallCentreX = wallOriginX + ww / 2;

  if (volumeCentreX > wallCentreX) {
    // Right half of the wall: leader exits left, runs to the left gutter.
    const x0 = x - inset;
    const leftGutterX = column > 0
      ? wallOriginX - metrics.wallGapX * 0.5
      : Math.max(metrics.originX - 4, 0);
    const gutterX = Math.max(leftGutterX, 0);
    return `M${String(x0)} ${String(runY)}H${String(gutterX)}V${String(metrics.height)}`;
  }

  // Left half (or centre): leader exits right, runs to the right gutter.
  const x1 = x + INDEX_MARK_WIDTH + inset;
  const naturalGutterX =
    metrics.originX + (column + 1) * (ww + metrics.wallGapX) - metrics.wallGapX * 0.5;
  const gutterX = Math.min(naturalGutterX, metrics.width - 4);
  return `M${String(x1)} ${String(runY)}H${String(gutterX)}V${String(metrics.height)}`;
}

function metricsFor(svg: Element): IndexMetrics {
  return svg.classList.contains('library-index__svg--wide') ? WIDE_INDEX : NARROW_INDEX;
}

function placeLocator(
  locator: Element,
  leader: Element,
  metrics: IndexMetrics,
  coordinate: Coordinate,
): void {
  const { x, y } = locatorPosition(metrics, coordinate);
  (locator as HTMLElement).style.transform = `translate(${String(x)}px, ${String(y)}px)`;
  locator.setAttribute('data-wall', String(coordinate.wall));
  locator.setAttribute('data-shelf', String(coordinate.shelf));
  locator.setAttribute('data-volume', String(coordinate.volume));
  const path = leaderPath(metrics, x, y, coordinate.wall);
  leader.setAttribute('d', path);
  // Identical path commands let CSS interpolate the line with the marker. The
  // SVG attribute remains the fallback in browsers without the CSS d property.
  (leader as SVGElement).style.setProperty('d', `path("${path}")`);
}

function fillCoordinateReadout(line: HTMLElement, coordinate: Coordinate): void {
  line.replaceChildren();
  for (const [index, field] of coordinateFields(coordinate).entries()) {
    if (index > 0) line.append(element('span', 'coordinate__separator', ' · '));
    line.append(element('span', 'coordinate__field', `${field.name}\u00a0${field.value}`));
  }
}

function createField(metrics: IndexMetrics, current: Coordinate): SVGSVGElement {
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', `0 0 ${String(metrics.width)} ${String(metrics.height)}`);
  svg.setAttribute('class', metrics.className);
  svg.setAttribute('focusable', 'false');
  svg.setAttribute('aria-hidden', 'true');

  const locator = document.createElementNS(NS, 'g');
  locator.setAttribute('class', 'library-index__locator');
  locator.append(
    svgNode('rect', {
      class: 'library-index__mark library-index__mark--current',
      x: '0',
      y: '0',
      width: String(INDEX_MARK_WIDTH),
      height: String(INDEX_MARK_HEIGHT),
    }),
    svgNode('path', {
      class: 'library-index__bracket',
      d: bracketPath(),
    }),
  );

  const leader = svgNode('path', { class: 'library-index__leader' });
  placeLocator(locator, leader, metrics, current);

  svg.append(
    svgNode('path', {
      class: 'library-index__marks',
      d: ordinaryMarksPath(metrics),
    }),
    locator,
    leader,
  );

  return svg;
}

function createCoordinateReadout(coordinate: Coordinate): HTMLParagraphElement {
  const line = element('p', 'coordinate library-index__coordinate');
  fillCoordinateReadout(line, coordinate);
  return line;
}

/** Move the locator and printed address to a real coordinate. */
export function updateLibraryIndex(root: HTMLElement, coordinate: Coordinate): void {
  const address = formatCoordinate(coordinate);
  if (root.dataset.coordinate === address) return;
  root.dataset.coordinate = address;
  for (const svg of root.querySelectorAll('svg')) {
    const locator = svg.querySelector('.library-index__locator');
    const leader = svg.querySelector('.library-index__leader');
    if (!locator || !leader) continue;
    placeLocator(locator, leader, metricsFor(svg), coordinate);
  }
  const readout = root.querySelector('.library-index__coordinate');
  if (readout instanceof HTMLElement) fillCoordinateReadout(readout, coordinate);
}

/** Decorative index field plus the one real address it is anchored to. */
export function createLibraryIndex(coordinate: Coordinate): HTMLDivElement {
  const root = element('div', 'library-index');
  root.dataset.coordinate = formatCoordinate(coordinate);

  const field = element('div', 'library-index__field');
  field.setAttribute('aria-hidden', 'true');
  field.append(createField(WIDE_INDEX, coordinate), createField(NARROW_INDEX, coordinate));

  root.append(field, createCoordinateReadout(coordinate));
  return root;
}
