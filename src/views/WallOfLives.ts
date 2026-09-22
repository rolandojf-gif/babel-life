import { copy, fill } from '../content/copy';
import { TOTAL_ROOTS, wallBooks } from '../library/catalog';
import { coordinateFor } from '../library/coordinates';
import type { AppState } from '../library/model';
import { parseRoute } from '../library/routing';
import { createBookCard } from './BookCard';
import { createLibraryIndex, updateLibraryIndex } from './libraryIndex';
import { createCandleGlyph, createPlanetMark, createSpinesMark } from './motifs';
import { element, type ViewHandle } from './view';

interface WallActions {
  onSomethingStranger(): void;
  onShowAll(): void;
}

/** Cards in the opening deal. Show-all appends after these and does not reorder them. */
const OPENING_WALL = 12;

function createScaleLabel(text: string, motif: SVGSVGElement): HTMLParagraphElement {
  const label = element('p', 'masthead__scale-label');
  label.append(motif, document.createTextNode(text));
  return label;
}

function createScaleValue(mantissa: string, exponent: string, unit: string): HTMLParagraphElement {
  const value = element('p', 'masthead__scale-value');
  value.append(
    element(
      'span',
      'visually-hidden',
      fill(copy.scalePower, { mantissa, exponent, unit }),
    ),
  );

  const visual = element('span');
  visual.setAttribute('aria-hidden', 'true');
  visual.append(
    document.createTextNode(mantissa),
    element('sup', 'masthead__scale-exponent', exponent),
    document.createTextNode(` ${unit}`),
  );
  value.append(visual);
  return value;
}

/** The wall of lives: the whole site, understandable by looking at it. */
export function createWallOfLives(state: AppState, actions: WallActions): ViewHandle {
  const root = element('div', 'wall');

  const masthead = element('header', 'masthead');
  const copyBlock = element('div', 'masthead__copy');
  const heading = element('h1', 'masthead__heading', copy.heading);
  heading.id = 'wall-heading';
  heading.tabIndex = -1;

  const libraryValue = createScaleValue(
    copy.libraryScaleMantissa,
    copy.libraryScaleExponent,
    copy.libraryScaleUnit,
  );
  const universeValue = createScaleValue(
    copy.universeScaleMantissa,
    copy.universeScaleExponent,
    copy.universeScaleUnit,
  );

  const scale = element('div', 'masthead__scale');
  const libraryScale = element('div', 'masthead__scale-item');
  libraryScale.append(
    createScaleLabel(copy.libraryScaleLabel, createSpinesMark()),
    libraryValue,
    element('p', 'masthead__scale-meta', copy.libraryScaleMeta),
  );
  const universeScale = element('div', 'masthead__scale-item');
  universeScale.append(
    createScaleLabel(copy.universeScaleLabel, createPlanetMark()),
    universeValue,
  );
  scale.append(libraryScale, universeScale);

  copyBlock.append(
    element('p', 'eyebrow', copy.eyebrow),
    heading,
    element('p', 'masthead__dek', copy.dek),
    scale,
  );

  const preamble = element('p', 'wall__preamble');
  // One quiet sign of the reading room: a candle before the premise preamble.
  const candle = createCandleGlyph();
  preamble.append(candle, document.createTextNode(copy.cardEyebrow));
  preamble.setAttribute('aria-hidden', 'true');

  const opening = wallBooks('first', state.wallSeed);
  const firstRoot = opening[0];
  if (!firstRoot) throw new Error('The wall has no first volume');
  let defaultBookId = firstRoot.id;
  const index = createLibraryIndex(coordinateFor(defaultBookId));
  masthead.append(copyBlock, index);

  const grid = element('ul', 'wall__grid');
  grid.setAttribute('aria-labelledby', 'wall-heading');

  let pointerBookId: string | undefined;
  let focusBookId: string | undefined;

  function bookIdFrom(node: EventTarget | null): string | undefined {
    if (!(node instanceof Element)) return undefined;
    const card = node.closest('a.card');
    const href = card?.getAttribute('href');
    if (href === null || href === undefined) return undefined;
    const route = parseRoute(href);
    return route.kind === 'book' ? route.bookId : undefined;
  }

  function locate(): void {
    const id = pointerBookId ?? focusBookId ?? defaultBookId;
    updateLibraryIndex(index, coordinateFor(id));
  }

  grid.addEventListener('pointerover', (event) => {
    if (event.pointerType === 'touch') return;
    const id = bookIdFrom(event.target);
    if (id === undefined) return;
    pointerBookId = id;
    locate();
  });
  grid.addEventListener('pointerout', (event) => {
    if (bookIdFrom(event.target) === undefined || bookIdFrom(event.relatedTarget) !== undefined) {
      return;
    }
    pointerBookId = undefined;
    locate();
  });
  grid.addEventListener('focusin', (event) => {
    const id = bookIdFrom(event.target);
    if (id === undefined) return;
    pointerBookId = undefined;
    focusBookId = id;
    locate();
  });
  grid.addEventListener('focusout', (event) => {
    if (bookIdFrom(event.target) === undefined || bookIdFrom(event.relatedTarget) !== undefined) {
      return;
    }
    focusBookId = undefined;
    locate();
  });

  const count = element('p', 'wall__count');

  const strangerButton = element('button', 'action action--stranger', copy.somethingStranger);
  strangerButton.type = 'button';
  strangerButton.addEventListener('click', () => {
    actions.onSomethingStranger();
  });

  const allButton = element('button', 'action action--quiet', copy.showAll);
  allButton.type = 'button';
  allButton.addEventListener('click', () => {
    actions.onShowAll();
  });

  const actionsRow = element('div', 'wall__actions');

  root.append(masthead, preamble, grid, count, actionsRow);

  function update(next: AppState): void {
    const opening = wallBooks('first', next.wallSeed)[0];
    if (opening) defaultBookId = opening.id;
    pointerBookId = undefined;
    focusBookId = undefined;

    const books = wallBooks(next.wallSelection, next.wallSeed);
    grid.replaceChildren(...books.map((book, cardIndex) => createBookCard(book, cardIndex)));
    locate();

    // Spelled from the cards actually dealt and the roots in the catalogue, so
    // the line cannot drift from the wall.
    const total = (copy.countWords[TOTAL_ROOTS] ?? String(TOTAL_ROOTS)).toLowerCase();
    count.textContent =
      books.length === TOTAL_ROOTS
        ? fill(copy.wallCountAll, { total })
        : fill(copy.wallCountPartial, {
            count: copy.countWords[books.length] ?? String(books.length),
            total,
          });

    // No disabled placeholders: an action that has nothing left to do is absent.
    const showStranger = next.wallSelection === 'first';
    const showAll = next.wallSelection !== 'all';
    actionsRow.replaceChildren(
      ...(showStranger ? [strangerButton] : []),
      ...(showAll ? [allButton] : []),
    );
  }

  update(state);

  return {
    element: root,
    update,
    focus(target): void {
      if (target === 'stranger' && strangerButton.isConnected) {
        strangerButton.focus();
        return;
      }
      if (target === 'wallGrid') {
        const first = grid.querySelector<HTMLAnchorElement>('a.card');
        if (first) {
          first.focus();
          return;
        }
      }
      if (target === 'wallAppended') {
        const revealed = grid.querySelectorAll<HTMLAnchorElement>('a.card').item(OPENING_WALL);
        if (revealed) {
          revealed.focus();
          return;
        }
      }
      heading.focus();
    },
  };
}
