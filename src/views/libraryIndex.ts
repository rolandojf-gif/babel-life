/**
 * The index of this edition: every book it can print, standing on the shelves
 * of one small case. Each family stands together, its root between the two
 * nearby books that differ from it. The case is the edition, not a stretch of
 * the Library: the books are not neighbours there, so the one address printed
 * beneath is the real place of the book the locator stands on.
 */

import { copy, fill } from '../content/copy';
import { getLocale } from '../content/locale';
import { EDITION_FAMILIES, TOTAL_ROOTS, type EditionFamily } from '../library/catalog';
import { coordinateFields, coordinateFor } from '../library/coordinates';
import { element } from './view';

const NS = 'http://www.w3.org/2000/svg';

/** Families on one shelf of the case. */
export const FAMILIES_PER_SHELF = 9;

export const ROOT_SPINE_WIDTH = 4.5;
export const NEARBY_SPINE_WIDTH = 3.5;
/** Between the books of one family, and between one family and the next. */
const KIN_GAP = 1;
const FAMILY_GAP = 6;
/** Room either side of the case for the aisle, the leader's drop and the ladder. */
const AISLE = 22;
/** Baseline to baseline. The headroom above the tallest book carries the leader. */
const SHELF_PITCH = 34;
const TOP = 0;
const BOTTOM = 8;
const ROOT_HEIGHT = 20;
const NEARBY_HEIGHT = 17;
/** Above the baseline, clear of every book, below the board of the shelf above. */
const LEADER_RISE = 28;

export interface Spine {
  id: string;
  kind: 'root' | 'nearby';
  rootId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  baseline: number;
}

export interface EditionCase {
  width: number;
  height: number;
  shelves: number;
  caseLeft: number;
  caseRight: number;
  spines: Spine[];
}

/**
 * A book's height: uneven the way bound books are, but fixed by its number.
 * Roots run a little taller on the whole, not always, so no family repeats
 * the silhouette of the last.
 */
function spineHeight(id: string, kind: Spine['kind']): number {
  const accession = Number(/\d+/.exec(id)?.[0] ?? '0');
  const step = ((Math.imul(accession, 0x9e3779b1) >>> 0) >>> 24) % 6;
  return (kind === 'root' ? ROOT_HEIGHT : NEARBY_HEIGHT) + step;
}

/** A family stands nearby, root, nearby: the root between its two variations. */
function familyOrder(family: EditionFamily): { id: string; kind: Spine['kind'] }[] {
  const [first, ...rest] = family.nearbyIds;
  return [
    ...(first === undefined ? [] : [{ id: first, kind: 'nearby' as const }]),
    { id: family.rootId, kind: 'root' as const },
    ...rest.map((id) => ({ id, kind: 'nearby' as const })),
  ];
}

export function editionCase(families: readonly EditionFamily[] = EDITION_FAMILIES): EditionCase {
  const shelves = Math.max(1, Math.ceil(families.length / FAMILIES_PER_SHELF));
  const spines: Spine[] = [];
  let widest = 0;

  for (let shelf = 0; shelf < shelves; shelf += 1) {
    const baseline = TOP + (shelf + 1) * SHELF_PITCH;
    let x = AISLE;
    const row = families.slice(shelf * FAMILIES_PER_SHELF, (shelf + 1) * FAMILIES_PER_SHELF);
    for (const [index, family] of row.entries()) {
      if (index > 0) x += FAMILY_GAP;
      for (const [place, book] of familyOrder(family).entries()) {
        if (place > 0) x += KIN_GAP;
        const width = book.kind === 'root' ? ROOT_SPINE_WIDTH : NEARBY_SPINE_WIDTH;
        const height = spineHeight(book.id, book.kind);
        spines.push({
          id: book.id,
          kind: book.kind,
          rootId: family.rootId,
          x,
          y: baseline - height,
          width,
          height,
          baseline,
        });
        x += width;
      }
    }
    widest = Math.max(widest, x);
  }

  return {
    width: widest + AISLE,
    height: TOP + shelves * SHELF_PITCH + BOTTOM,
    shelves,
    caseLeft: AISLE,
    caseRight: widest,
    spines,
  };
}

const EDITION = editionCase();

function svgNode(tag: string, attrs: Record<string, string>): SVGElement {
  const node = document.createElementNS(NS, tag);
  for (const [name, value] of Object.entries(attrs)) node.setAttribute(name, value);
  return node;
}

function spineOf(bookId: string, edition: EditionCase = EDITION): Spine {
  const spine = edition.spines.find((entry) => entry.id === bookId);
  if (!spine) throw new Error(`No spine in this edition for ${bookId}`);
  return spine;
}

const INSET = 1.25;

function bracketPath(width: number, height: number): string {
  const tick = 2;
  const x0 = -INSET;
  const y0 = -INSET;
  const x1 = width + INSET;
  const y1 = height + INSET;
  return [
    `M${String(x0 + tick)} ${String(y0)}H${String(x0)}V${String(y1)}H${String(x0 + tick)}`,
    `M${String(x1 - tick)} ${String(y0)}H${String(x1)}V${String(y1)}H${String(x1 - tick)}`,
  ].join('');
}

/**
 * Where the reader's line leaves the book: up into the headroom of its shelf,
 * along to the nearer aisle, and down it (+1 right, -1 left).
 */
export interface Aisle {
  startX: number;
  startY: number;
  runY: number;
  gutterX: number;
  side: 1 | -1;
}

export function aisleFor(spine: Spine, edition: EditionCase = EDITION): Aisle {
  const centre = spine.x + spine.width / 2;
  const side = centre < (edition.caseLeft + edition.caseRight) / 2 ? -1 : 1;
  return {
    startX: centre,
    startY: spine.y - INSET,
    runY: spine.baseline - LEADER_RISE,
    gutterX: side === -1 ? edition.caseLeft - AISLE / 2 : edition.caseRight + AISLE / 2,
    side,
  };
}

export function leaderPath(aisle: Aisle, edition: EditionCase = EDITION): string {
  return `M${String(aisle.startX)} ${String(aisle.startY)}V${String(aisle.runY)}H${String(aisle.gutterX)}V${String(edition.height)}`;
}

/** Spacing of the ladder: rail to rail, rung to rung. */
export const LADDER_WIDTH = 3;
const LADDER_RUNG = 3.5;

/**
 * A library ladder standing in the aisle. The leader's drop is its near rail;
 * this draws the far rail, the rungs, and one small reader at the top reaching
 * back along the leader toward the book. Drawn in local units with the near
 * rail at x = 0, the leader's height at y = 0, and the far rail at +x. The
 * rails run past the floor and are clipped there, so moving the ladder is a
 * single transform whatever the shelf.
 */
function createLadder(edition: EditionCase): SVGGElement {
  const ladder = document.createElementNS(NS, 'g');
  ladder.setAttribute('class', 'library-index__ladder');

  const floor = edition.height + LADDER_RUNG * 2;
  const rungs: string[] = [];
  for (let y = 2; y < floor; y += LADDER_RUNG) {
    rungs.push(`M0 ${String(y)}H${String(LADDER_WIDTH)}`);
  }
  ladder.append(
    svgNode('path', {
      class: 'library-index__ladder-frame',
      d: `M${String(LADDER_WIDTH)} -1.5V${String(floor)}${rungs.join('')}`,
    }),
    // The reader, as old plates add a figure for scale: a small robed
    // silhouette on the top rungs, one arm out past the near rail to meet the
    // leader on its way to the book.
    svgNode('path', {
      class: 'library-index__reader',
      d: 'M0.85 -0.75H2.15L2.75 4.7H0.25Z',
    }),
    svgNode('circle', { class: 'library-index__reader', cx: '1.5', cy: '-1.85', r: '0.95' }),
    svgNode('path', {
      class: 'library-index__reader-limb',
      d: 'M1.2 -0.35L-1.3 0M1.05 4.7V5.5M1.95 4.7V5.5',
    }),
  );
  return ladder;
}

function placeLocator(svg: Element, bookId: string): void {
  const locator = svg.querySelector('.library-index__locator');
  const current = svg.querySelector('.library-index__mark--current');
  const bracket = svg.querySelector('.library-index__bracket');
  const leader = svg.querySelector('.library-index__leader');
  const ladder = svg.querySelector('.library-index__ladder');
  if (!locator || !current || !bracket || !leader || !ladder) return;

  const spine = spineOf(bookId);
  (locator as SVGGElement).style.transform = `translate(${String(spine.x)}px, ${String(spine.y)}px)`;
  locator.setAttribute('data-book', spine.id);
  locator.setAttribute('data-kind', spine.kind);
  current.setAttribute('width', String(spine.width));
  current.setAttribute('height', String(spine.height));
  bracket.setAttribute('d', bracketPath(spine.width, spine.height));

  // The rest of its family answers quietly: three books, one life apart each.
  for (const node of svg.querySelectorAll('.library-index__spine')) {
    const kin = node.getAttribute('data-root') === spine.rootId && node.getAttribute('data-book') !== spine.id;
    node.classList.toggle('library-index__spine--kin', kin);
  }

  const aisle = aisleFor(spine);
  const path = leaderPath(aisle);
  leader.setAttribute('d', path);
  // Identical path commands let CSS interpolate the line with the marker. The
  // SVG attribute remains the fallback in browsers without the CSS d property.
  (leader as SVGElement).style.setProperty('d', `path("${path}")`);
  // The reader faces the book, so the ladder mirrors with the leader.
  (ladder as SVGGElement).style.transform =
    `translate(${String(aisle.gutterX)}px, ${String(aisle.runY)}px) scaleX(${String(aisle.side)})`;
}

function createCase(bookId: string): SVGSVGElement {
  const edition = EDITION;
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', `0 0 ${String(edition.width)} ${String(edition.height)}`);
  svg.setAttribute('class', 'library-index__svg');
  svg.setAttribute('focusable', 'false');
  svg.setAttribute('aria-hidden', 'true');

  const boards: string[] = [];
  for (let shelf = 1; shelf <= edition.shelves; shelf += 1) {
    const y = TOP + shelf * SHELF_PITCH + 0.6;
    boards.push(`M${String(edition.caseLeft - 3)} ${String(y)}H${String(edition.caseRight + 3)}`);
  }

  const books = document.createElementNS(NS, 'g');
  books.setAttribute('class', 'library-index__books');
  for (const spine of edition.spines) {
    books.append(
      svgNode('rect', {
        class: `library-index__spine library-index__spine--${spine.kind}`,
        'data-book': spine.id,
        'data-root': spine.rootId,
        x: String(spine.x),
        y: String(spine.y),
        width: String(spine.width),
        height: String(spine.height),
        rx: '0.5',
      }),
    );
  }

  const locator = document.createElementNS(NS, 'g');
  locator.setAttribute('class', 'library-index__locator');
  locator.append(
    svgNode('rect', { class: 'library-index__mark library-index__mark--current', x: '0', y: '0', rx: '0.5' }),
    svgNode('path', { class: 'library-index__bracket' }),
  );

  svg.append(
    svgNode('path', { class: 'library-index__boards', d: boards.join('') }),
    books,
    locator,
    createLadder(edition),
    svgNode('path', { class: 'library-index__leader' }),
  );
  placeLocator(svg, bookId);
  return svg;
}

function fillCoordinateReadout(line: HTMLElement, bookId: string): void {
  line.replaceChildren();
  for (const [index, field] of coordinateFields(coordinateFor(bookId)).entries()) {
    if (index > 0) line.append(element('span', 'coordinate__separator', ' · '));
    line.append(element('span', 'coordinate__field', `${field.name} ${field.value}`));
  }
}

/** The case's own label: what this edition holds, counted from the catalogue. */
function createEditionLine(): HTMLParagraphElement {
  const locale = getLocale();
  const books = EDITION.spines.length;
  const line = element('p', 'library-index__edition');
  const separator = (): HTMLSpanElement => {
    const dot = element('span', 'library-index__edition-separator', ' · ');
    dot.setAttribute('aria-hidden', 'true');
    return dot;
  };
  line.append(
    element('span', 'library-index__edition-label', copy.editionLabel),
    separator(),
    element('span', 'library-index__edition-count', fill(copy.editionBooks, { count: books.toLocaleString(locale) })),
    separator(),
    element('span', 'library-index__edition-count', fill(copy.editionOnWall, { count: TOTAL_ROOTS.toLocaleString(locale) })),
  );
  return line;
}

/** Move the locator and the printed address to another book of this edition. */
export function updateLibraryIndex(root: HTMLElement, bookId: string): void {
  if (root.dataset.book === bookId) return;
  root.dataset.book = bookId;
  for (const svg of root.querySelectorAll('svg')) placeLocator(svg, bookId);
  const readout = root.querySelector('.library-index__coordinate');
  if (readout instanceof HTMLElement) fillCoordinateReadout(readout, bookId);
}

/** The edition's case, the book the locator stands on, and that book's real address. */
export function createLibraryIndex(bookId: string): HTMLDivElement {
  const root = element('div', 'library-index');
  root.dataset.book = bookId;

  const field = element('div', 'library-index__field');
  field.setAttribute('aria-hidden', 'true');
  field.append(createCase(bookId));

  const readout = element('p', 'coordinate library-index__coordinate');
  fillCoordinateReadout(readout, bookId);

  root.append(createEditionLine(), field, readout);
  return root;
}

