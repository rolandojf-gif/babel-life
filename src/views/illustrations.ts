/**
 * Local symbolic illustrations. Line drawings on a 120x72 field, drawn in
 * currentColor so each card's tonal surface carries them. No external assets,
 * no icon dependency. They are decorative: the card's own words carry meaning.
 */

const NS = 'http://www.w3.org/2000/svg';

export interface Shape {
  tag: 'line' | 'path' | 'circle' | 'ellipse' | 'rect' | 'polyline';
  attrs: Record<string, string>;
}

/** Drawn once, used both ways round. */
const SOCKS: Shape[] = [
  { tag: 'path', attrs: { d: 'M52 12 H40 V40 H30 A6 6 0 0 0 30 52 H46 A6 6 0 0 0 52 46 Z' } },
  { tag: 'line', attrs: { x1: '40', y1: '18', x2: '52', y2: '18' } },
  { tag: 'path', attrs: { d: 'M68 12 H80 V40 H90 A6 6 0 0 1 90 52 H74 A6 6 0 0 1 68 46 Z', 'stroke-dasharray': '3 3' } },
  { tag: 'line', attrs: { x1: '68', y1: '18', x2: '80', y2: '18', 'stroke-dasharray': '3 3' } },
  { tag: 'line', attrs: { x1: '18', y1: '60', x2: '102', y2: '60' } },
];

const MOTIFS: Record<string, Shape[]> = {
  // An empty platform: edge, tactile strip, lamp, and a carriage already leaving.
  platform: [
    { tag: 'line', attrs: { x1: '6', y1: '54', x2: '114', y2: '54' } },
    { tag: 'line', attrs: { x1: '6', y1: '48', x2: '78', y2: '48', 'stroke-dasharray': '3 4' } },
    { tag: 'line', attrs: { x1: '26', y1: '54', x2: '26', y2: '18' } },
    { tag: 'path', attrs: { d: 'M20 18 h12 v5 h-12 z' } },
    { tag: 'path', attrs: { d: 'M88 54 v-22 h26 v22' } },
    { tag: 'line', attrs: { x1: '95', y1: '38', x2: '95', y2: '48' } },
  ],
  // Two doors facing each other across a landing.
  doorway: [
    { tag: 'path', attrs: { d: 'M22 60 v-46 h34 v46' } },
    { tag: 'path', attrs: { d: 'M64 60 v-46 h34 v46' } },
    { tag: 'line', attrs: { x1: '60', y1: '12', x2: '60', y2: '62' , 'stroke-dasharray': '2 4' } },
    { tag: 'line', attrs: { x1: '30', y1: '26', x2: '48', y2: '26' } },
    { tag: 'line', attrs: { x1: '72', y1: '26', x2: '90', y2: '26' } },
    { tag: 'line', attrs: { x1: '14', y1: '62', x2: '106', y2: '62' } },
  ],
  // A cup, and the ring it left yesterday.
  cup: [
    { tag: 'path', attrs: { d: 'M44 24 h30 l-4 26 h-22 z' } },
    { tag: 'path', attrs: { d: 'M74 29 a7 7 0 0 1 0 14' } },
    { tag: 'line', attrs: { x1: '16', y1: '58', x2: '104', y2: '58' } },
    { tag: 'path', attrs: { d: 'M26 50 a8 3 0 1 0 16 0 a8 3 0 1 0 -16 0' } },
  ],
  // A photograph, slightly out of square.
  photograph: [
    { tag: 'rect', attrs: { x: '30', y: '16', width: '60', height: '48', rx: '1', transform: 'rotate(-4 60 40)' } },
    { tag: 'line', attrs: { x1: '36', y1: '48', x2: '84', y2: '45', transform: 'rotate(-4 60 40)' } },
    { tag: 'circle', attrs: { cx: '72', cy: '31', r: '5', transform: 'rotate(-4 60 40)' } },
    { tag: 'path', attrs: { d: 'M38 48 l10 -10 l9 8 l8 -6 l19 12', transform: 'rotate(-4 60 40)' } },
  ],
  // A kitchen window onto a yard.
  window: [
    { tag: 'rect', attrs: { x: '30', y: '12', width: '60', height: '46' } },
    { tag: 'line', attrs: { x1: '60', y1: '12', x2: '60', y2: '58' } },
    { tag: 'line', attrs: { x1: '30', y1: '35', x2: '90', y2: '35' } },
    { tag: 'line', attrs: { x1: '22', y1: '62', x2: '98', y2: '62' } },
    { tag: 'line', attrs: { x1: '38', y1: '46', x2: '52', y2: '46', 'stroke-dasharray': '2 4' } },
  ],
  // A clock, hands unremarkable.
  clock: [
    { tag: 'circle', attrs: { cx: '60', cy: '37', r: '25' } },
    { tag: 'line', attrs: { x1: '60', y1: '37', x2: '60', y2: '21' } },
    { tag: 'line', attrs: { x1: '60', y1: '37', x2: '73', y2: '43' } },
    { tag: 'line', attrs: { x1: '60', y1: '10', x2: '60', y2: '14' } },
    { tag: 'line', attrs: { x1: '87', y1: '37', x2: '83', y2: '37' } },
  ],
  // Two lives that pass within a few millimetres of each other.
  paths: [
    { tag: 'path', attrs: { d: 'M8 16 q28 18 52 20 q24 2 52 -16' } },
    { tag: 'path', attrs: { d: 'M8 64 q28 -18 52 -20 q24 -2 52 16' } },
    { tag: 'line', attrs: { x1: '60', y1: '36', x2: '60', y2: '44', 'stroke-dasharray': '2 2' } },
    { tag: 'circle', attrs: { cx: '8', cy: '16', r: '1.8' } },
    { tag: 'circle', attrs: { cx: '8', cy: '64', r: '1.8' } },
  ],
  // Two cots, a moment apart: the birth written down, and the nearly identical one.
  cot: [
    { tag: 'line', attrs: { x1: '16', y1: '24', x2: '16', y2: '58' } },
    { tag: 'line', attrs: { x1: '52', y1: '24', x2: '52', y2: '58' } },
    { tag: 'line', attrs: { x1: '16', y1: '28', x2: '52', y2: '28' } },
    { tag: 'line', attrs: { x1: '16', y1: '46', x2: '52', y2: '46' } },
    { tag: 'line', attrs: { x1: '25', y1: '28', x2: '25', y2: '46' } },
    { tag: 'line', attrs: { x1: '34', y1: '28', x2: '34', y2: '46' } },
    { tag: 'line', attrs: { x1: '43', y1: '28', x2: '43', y2: '46' } },
    { tag: 'line', attrs: { x1: '68', y1: '24', x2: '68', y2: '58', 'stroke-dasharray': '3 3' } },
    { tag: 'line', attrs: { x1: '104', y1: '24', x2: '104', y2: '58', 'stroke-dasharray': '3 3' } },
    { tag: 'line', attrs: { x1: '68', y1: '28', x2: '104', y2: '28', 'stroke-dasharray': '3 3' } },
    { tag: 'line', attrs: { x1: '68', y1: '46', x2: '104', y2: '46', 'stroke-dasharray': '3 3' } },
    { tag: 'line', attrs: { x1: '77', y1: '28', x2: '77', y2: '46', 'stroke-dasharray': '3 3' } },
    { tag: 'line', attrs: { x1: '86', y1: '28', x2: '86', y2: '46', 'stroke-dasharray': '3 3' } },
    { tag: 'line', attrs: { x1: '95', y1: '28', x2: '95', y2: '46', 'stroke-dasharray': '3 3' } },
  ],
  // The same page, and the pages behind it.
  calendar: [
    { tag: 'rect', attrs: { x: '30', y: '18', width: '64', height: '44', rx: '2' } },
    { tag: 'path', attrs: { d: 'M34 14 h64 v44', 'stroke-dasharray': '3 3' } },
    { tag: 'line', attrs: { x1: '30', y1: '30', x2: '94', y2: '30' } },
    { tag: 'line', attrs: { x1: '44', y1: '12', x2: '44', y2: '22' } },
    { tag: 'line', attrs: { x1: '80', y1: '12', x2: '80', y2: '22' } },
    { tag: 'line', attrs: { x1: '46', y1: '42', x2: '78', y2: '42' } },
    { tag: 'line', attrs: { x1: '46', y1: '50', x2: '66', y2: '50' } },
  ],
  // A drawer, open, with nothing taken out of it.
  drawer: [
    { tag: 'rect', attrs: { x: '28', y: '12', width: '64', height: '16', rx: '1' } },
    { tag: 'rect', attrs: { x: '28', y: '30', width: '64', height: '16', rx: '1' } },
    { tag: 'rect', attrs: { x: '20', y: '48', width: '80', height: '16', rx: '1' } },
    { tag: 'line', attrs: { x1: '54', y1: '20', x2: '66', y2: '20' } },
    { tag: 'line', attrs: { x1: '54', y1: '38', x2: '66', y2: '38' } },
    { tag: 'line', attrs: { x1: '52', y1: '56', x2: '68', y2: '56' } },
  ],
  // A ruled register, with one line read for another.
  record: [
    { tag: 'rect', attrs: { x: '22', y: '14', width: '76', height: '46', rx: '1' } },
    { tag: 'line', attrs: { x1: '22', y1: '26', x2: '98', y2: '26' } },
    { tag: 'line', attrs: { x1: '22', y1: '38', x2: '98', y2: '38' } },
    { tag: 'line', attrs: { x1: '22', y1: '50', x2: '98', y2: '50' } },
    { tag: 'line', attrs: { x1: '40', y1: '14', x2: '40', y2: '60' } },
    { tag: 'line', attrs: { x1: '48', y1: '32', x2: '90', y2: '32' } },
    { tag: 'line', attrs: { x1: '48', y1: '44', x2: '76', y2: '44' } },
    { tag: 'path', attrs: { d: 'M46 34 L92 29' } },
  ],
  // Something said, and nothing facing it.
  speech: [
    { tag: 'path', attrs: { d: 'M24 18 h52 a4 4 0 0 1 4 4 v20 a4 4 0 0 1 -4 4 h-34 l-12 10 v-10 h-6 a4 4 0 0 1 -4 -4 v-20 a4 4 0 0 1 4 -4 z' } },
    { tag: 'line', attrs: { x1: '34', y1: '28', x2: '68', y2: '28' } },
    { tag: 'line', attrs: { x1: '34', y1: '36', x2: '58', y2: '36' } },
    { tag: 'path', attrs: { d: 'M88 30 h12 a4 4 0 0 1 4 4 v14 a4 4 0 0 1 -4 4 h-12', 'stroke-dasharray': '3 3' } },
  ],
  // A table laid for a family, two of its places for people who may never come.
  table: [
    { tag: 'path', attrs: { d: 'M12 36 h96 v6 l-10 10 h-76 l-10 -10 z' } },
    { tag: 'line', attrs: { x1: '26', y1: '52', x2: '26', y2: '64' } },
    { tag: 'line', attrs: { x1: '94', y1: '52', x2: '94', y2: '64' } },
    { tag: 'circle', attrs: { cx: '30', cy: '29', r: '5' } },
    { tag: 'circle', attrs: { cx: '50', cy: '29', r: '5' } },
    { tag: 'circle', attrs: { cx: '70', cy: '29', r: '5', 'stroke-dasharray': '3 3' } },
    { tag: 'circle', attrs: { cx: '90', cy: '29', r: '5', 'stroke-dasharray': '3 3' } },
  ],
  // A mirror, and something in it that is not quite you.
  mirror: [
    { tag: 'rect', attrs: { x: '30', y: '10', width: '60', height: '52', rx: '2' } },
    { tag: 'line', attrs: { x1: '60', y1: '10', x2: '60', y2: '62', 'stroke-dasharray': '3 3' } },
    { tag: 'circle', attrs: { cx: '45', cy: '28', r: '6' } },
    { tag: 'path', attrs: { d: 'M36 52 a9 12 0 0 1 18 0' } },
    { tag: 'circle', attrs: { cx: '75', cy: '28', r: '6', 'stroke-dasharray': '3 3' } },
    { tag: 'path', attrs: { d: 'M66 52 a9 12 0 0 1 18 0', 'stroke-dasharray': '3 3' } },
  ],
  // An open book, its ribbon keeping the page being read now.
  book: [
    { tag: 'path', attrs: { d: 'M60 22 q-14 -7 -32 -5 v36 q18 -2 32 5 z' } },
    { tag: 'path', attrs: { d: 'M60 22 q14 -7 32 -5 v36 q-18 -2 -32 5 z' } },
    { tag: 'line', attrs: { x1: '60', y1: '22', x2: '60', y2: '58' } },
    { tag: 'path', attrs: { d: 'M72 18 V40 l3 -3 l3 3 V17.4' } },
    { tag: 'line', attrs: { x1: '20', y1: '64', x2: '100', y2: '64', 'stroke-dasharray': '3 5' } },
  ],
  // The house of a childhood: its door, and a lit window for each remembered room.
  house: [
    { tag: 'path', attrs: { d: 'M34 62 V32 L60 14 L86 32 V62' } },
    { tag: 'path', attrs: { d: 'M54 62 V46 h12 v16' } },
    { tag: 'rect', attrs: { x: '40', y: '36', width: '10', height: '8' } },
    { tag: 'rect', attrs: { x: '70', y: '36', width: '10', height: '8' } },
    { tag: 'line', attrs: { x1: '16', y1: '62', x2: '104', y2: '62' } },
  ],
  // A pedigree: two parents joined above a child who is not there yet.
  lineage: [
    { tag: 'rect', attrs: { x: '22', y: '12', width: '28', height: '12', rx: '1' } },
    { tag: 'rect', attrs: { x: '70', y: '12', width: '28', height: '12', rx: '1' } },
    { tag: 'path', attrs: { d: 'M36 24 V34 H84 V24' } },
    { tag: 'line', attrs: { x1: '60', y1: '34', x2: '60', y2: '46' } },
    { tag: 'rect', attrs: { x: '46', y: '46', width: '28', height: '12', rx: '1', 'stroke-dasharray': '3 3' } },
  ],
  // A cabin seat map, and one seat marked.
  seats: [
    { tag: 'path', attrs: { d: 'M18 64 V28 Q18 10 60 10 Q102 10 102 28 V64' } },
    ...[26, 38, 50].flatMap((y) =>
      [26, 37, 48, 63, 74, 85].map((x): Shape => ({
        tag: 'rect',
        attrs: { x: String(x), y: String(y), width: '9', height: '8', rx: '1.5' },
      })),
    ),
    { tag: 'circle', attrs: { cx: '30.5', cy: '30', r: '1.2' } },
  ],
  // A pair of socks: the left one first, the right one not yet.
  socks: SOCKS,
  // The same pair, the other way round: the right one first.
  socksRight: SOCKS.map((shape) => ({
    ...shape,
    attrs: { ...shape.attrs, transform: 'matrix(-1 0 0 1 120 0)' },
  })),
  // A bed with someone asleep in it, and the moon.
  night: [
    { tag: 'path', attrs: { d: 'M20 62 V32 M20 46 H100 M100 62 V42 M20 56 H100' } },
    { tag: 'path', attrs: { d: 'M25 46 q0 -6 7 -6 h8 q4 0 4 6' } },
    { tag: 'path', attrs: { d: 'M46 46 C56 36 80 37 98 46' } },
    { tag: 'path', attrs: { d: 'M86 10 a9 9 0 1 0 9 14 a7 7 0 1 1 -9 -14 z' } },
  ],
  // A road running to the horizon, through the passes.
  road: [
    { tag: 'line', attrs: { x1: '10', y1: '28', x2: '110', y2: '28' } },
    { tag: 'path', attrs: { d: 'M28 64 L56 28 M92 64 L64 28' } },
    { tag: 'line', attrs: { x1: '60', y1: '62', x2: '60', y2: '31', 'stroke-dasharray': '4 5' } },
    { tag: 'path', attrs: { d: 'M72 28 L84 18 L92 23 L101 15 L110 22' } },
  ],
  // Two covers carrying the same name; only the first is your book.
  covers: [
    { tag: 'rect', attrs: { x: '22', y: '12', width: '32', height: '46', rx: '1' } },
    { tag: 'rect', attrs: { x: '28', y: '22', width: '20', height: '8' } },
    { tag: 'line', attrs: { x1: '32', y1: '26', x2: '44', y2: '26' } },
    { tag: 'rect', attrs: { x: '66', y: '12', width: '32', height: '46', rx: '1', 'stroke-dasharray': '3 3' } },
    { tag: 'rect', attrs: { x: '72', y: '22', width: '20', height: '8' } },
    { tag: 'line', attrs: { x1: '76', y1: '26', x2: '88', y2: '26' } },
    { tag: 'line', attrs: { x1: '16', y1: '62', x2: '104', y2: '62' } },
  ],
  // A chair moved aside before sitting, and where it stood.
  chair: [
    { tag: 'path', attrs: { d: 'M32 38 V14 H52 V38 M42 16 V36 M28 38 H56 M31 38 V62 M53 38 V62', 'stroke-dasharray': '3 3' } },
    { tag: 'path', attrs: { d: 'M68 38 V14 H88 V38 M78 16 V36 M64 38 H92 M67 38 V62 M89 38 V62' } },
    { tag: 'line', attrs: { x1: '18', y1: '62', x2: '102', y2: '62' } },
  ],
  // Everyone alive: one life joined to one other, and loosely to a few more.
  crowd: [
    ...[
      [18, 20], [34, 12], [54, 20], [72, 12], [90, 20], [106, 12],
      [24, 40], [42, 34], [60, 42], [80, 32], [98, 40],
      [16, 58], [36, 56], [56, 62], [76, 54], [94, 60], [108, 50],
    ].map(([cx, cy]): Shape => ({
      tag: 'circle',
      attrs: { cx: String(cx), cy: String(cy), r: '1.8' },
    })),
    { tag: 'line', attrs: { x1: '42', y1: '34', x2: '60', y2: '42' } },
    { tag: 'path', attrs: { d: 'M42 34 L24 40 M42 34 L54 20 M42 34 L36 56', 'stroke-dasharray': '2 3' } },
  ],
  // Two figures no one could tell apart, thinking different things.
  interior: [
    { tag: 'circle', attrs: { cx: '40', cy: '28', r: '12' } },
    { tag: 'path', attrs: { d: 'M22 62 a18 16 0 0 1 36 0' } },
    { tag: 'circle', attrs: { cx: '40', cy: '28', r: '3' } },
    { tag: 'circle', attrs: { cx: '80', cy: '28', r: '12' } },
    { tag: 'path', attrs: { d: 'M62 62 a18 16 0 0 1 36 0' } },
    { tag: 'path', attrs: { d: 'M75 29 q2.5 -4 5 0 t5 0' } },
  ],
  // One choice, each branch multiplied by all the next.
  branching: [
    { tag: 'circle', attrs: { cx: '16', cy: '38', r: '2.2' } },
    ...[16, 38, 60].flatMap((y): Shape[] => [
      { tag: 'line', attrs: { x1: '18', y1: '38', x2: '50', y2: String(y) } },
      { tag: 'circle', attrs: { cx: '52', cy: String(y), r: '2' } },
      ...[-7, 0, 7].flatMap((dy): Shape[] => [
        { tag: 'line', attrs: { x1: '54', y1: String(y), x2: '92', y2: String(y + dy) } },
        { tag: 'circle', attrs: { cx: '94', cy: String(y + dy), r: '1.6' } },
      ]),
    ]),
  ],
  // A page of empty positions, and one comma.
  comma: [
    { tag: 'rect', attrs: { x: '30', y: '10', width: '60', height: '54', rx: '1' } },
    { tag: 'path', attrs: { d: 'M38 20 H82 M38 28 H82 M38 36 H56 M72 36 H82 M38 44 H82 M38 52 H82', 'stroke-dasharray': '0.1 4' } },
    { tag: 'circle', attrs: { cx: '64', cy: '36', r: '1.6', fill: 'currentColor' } },
    { tag: 'path', attrs: { d: 'M65.5 36.6 q0.3 3.4 -3 5.6' } },
  ],
  // Two windows across a street: a lamp lit in one, and someone at the other.
  facing: [
    { tag: 'rect', attrs: { x: '16', y: '14', width: '28', height: '36' } },
    { tag: 'path', attrs: { d: 'M26 40 h8 l-2 -6 h-4 z M30 40 V46' } },
    { tag: 'rect', attrs: { x: '76', y: '14', width: '28', height: '36' } },
    { tag: 'path', attrs: { d: 'M90 14 V50 M76 32 H104' } },
    { tag: 'line', attrs: { x1: '72', y1: '32', x2: '48', y2: '32', 'stroke-dasharray': '2 4' } },
    { tag: 'path', attrs: { d: 'M12 50 H48 M72 50 H108' } },
  ],
  // A school notebook: three pages written, and the rest of his life left blank.
  notebook: [
    { tag: 'rect', attrs: { x: '22', y: '14', width: '38', height: '46', rx: '1' } },
    { tag: 'rect', attrs: { x: '60', y: '14', width: '38', height: '46', rx: '1' } },
    ...[20, 28, 36, 44, 52].map((cy): Shape => ({
      tag: 'circle',
      attrs: { cx: '60', cy: String(cy), r: '1.8' },
    })),
    { tag: 'path', attrs: { d: 'M28 24 H54 M28 30 H54 M28 36 H48' } },
    { tag: 'path', attrs: { d: 'M66 24 H92 M66 30 H92 M66 36 H92 M66 42 H92 M66 48 H92', 'stroke-dasharray': '2 3' } },
  ],
  // A floor plan, and the one room this birth took place in.
  plan: [
    { tag: 'rect', attrs: { x: '18', y: '12', width: '84', height: '50' } },
    { tag: 'path', attrs: { d: 'M46 12 V34 M78 12 V34 M18 34 H102 M62 34 V62' } },
    { tag: 'circle', attrs: { cx: '82', cy: '48', r: '2.2' } },
  ],
  // The desk by the window, and the one in the next row.
  desks: [
    { tag: 'rect', attrs: { x: '14', y: '12', width: '20', height: '30' } },
    { tag: 'path', attrs: { d: 'M24 12 V42 M14 27 H34' } },
    { tag: 'path', attrs: { d: 'M40 36 H68 M43 36 V60 M65 36 V60' } },
    { tag: 'path', attrs: { d: 'M76 36 H104 M79 36 V60 M101 36 V60', 'stroke-dasharray': '3 3' } },
    { tag: 'line', attrs: { x1: '10', y1: '60', x2: '110', y2: '60' } },
  ],
  // Footsteps across a floor, and one more than usual.
  steps: [
    ...[0, 1, 2, 3, 4, 5, 6].map((i): Shape => {
      const cx = 22 + i * 13;
      const cy = i % 2 === 0 ? 24 : 40;
      return {
        tag: 'ellipse',
        attrs: {
          cx: String(cx),
          cy: String(cy),
          rx: '3',
          ry: '5.5',
          transform: `rotate(12 ${String(cx)} ${String(cy)})`,
          ...(i === 6 ? { 'stroke-dasharray': '2 2' } : {}),
        },
      };
    }),
    { tag: 'line', attrs: { x1: '10', y1: '58', x2: '110', y2: '58' } },
  ],
  // A bicycle on the road.
  bicycle: [
    { tag: 'circle', attrs: { cx: '36', cy: '46', r: '14' } },
    { tag: 'circle', attrs: { cx: '84', cy: '46', r: '14' } },
    { tag: 'path', attrs: { d: 'M36 46 L52 28 H76 L84 46 M52 28 L60 46 H36 M60 46 L76 28' } },
    { tag: 'path', attrs: { d: 'M52 28 L50 22 M45 22 H55 M76 28 L74 20 H80' } },
    { tag: 'line', attrs: { x1: '12', y1: '60', x2: '108', y2: '60' } },
  ],
  // A flight path over the horizon, and the aircraft on it.
  flight: [
    { tag: 'line', attrs: { x1: '10', y1: '58', x2: '110', y2: '58' } },
    { tag: 'path', attrs: { d: 'M14 56 Q60 8 106 56', 'stroke-dasharray': '3 4' } },
    { tag: 'path', attrs: { d: 'M46 32 H76 M66 32 L58 18 M66 32 L58 46 M49 32 L45 26 M49 32 L45 38' } },
  ],
  // A signature on its line.
  signature: [
    { tag: 'line', attrs: { x1: '18', y1: '52', x2: '102', y2: '52' } },
    { tag: 'path', attrs: { d: 'M20 43 l5 5 M25 43 l-5 5' } },
    { tag: 'path', attrs: { d: 'M34 48 c4 -16 10 -16 8 -2 c-2 10 6 4 10 -6 c3 -8 6 4 8 6 c3 3 8 -8 12 -10 c3 -1 2 8 6 8 c5 0 10 -6 16 -8' } },
  ],
};

/**
 * Sanguine marks, for nearby books only: the stroke that draws what differs
 * from the root, and nothing else. `tint` names strokes of the motif by
 * position, `drop` removes strokes the difference moves, `base` adds charcoal
 * strokes a moved element needs, and `add` draws new strokes in sanguine.
 * Where the difference is everything, or the drawing shows what stays the
 * same, the book has no entry and its motif stays wholly in charcoal.
 */
export interface Accent {
  tint?: number[];
  drop?: number[];
  base?: Shape[];
  add?: Shape[];
}

export const ACCENTS: Record<string, Accent> = {
  // The second cot, the nearly identical birth.
  b0022: { tint: [7, 8, 9, 10, 11, 12, 13] },
  // The one room among all of them.
  b0019: { tint: [2] },
  // The other childhood converging on this afternoon.
  b0016: { tint: [1, 4] },
  // The desk in the next row.
  b0018: { tint: [3] },
  // The line read for another: the same sentence in another language.
  b0032: { tint: [7] },
  // The pane of the room next door.
  b0020: { tint: [4] },
  // The other person the earlier conception brings.
  b0023: { tint: [4] },
  // The same parents, living otherwise.
  b0025: { tint: [0, 1] },
  // One parent changed.
  b0026: { tint: [1] },
  // The one afternoon that remains.
  b0027: { tint: [0, 1, 2, 3] },
  // A paper clip in the open drawer, for seventeen minutes.
  b0028: { add: [{ tag: 'path', attrs: { d: 'M76 57 H87 a2 2 0 0 0 0 -4 H78.5 a1.3 1.3 0 0 0 0 2.6 H85.5' } }] },
  // The step, twenty centimetres to the left.
  b0039: {
    drop: [2],
    add: [{ tag: 'line', attrs: { x1: '53', y1: '37', x2: '53', y2: '45', 'stroke-dasharray': '2 2' } }],
  },
  // One second more: the second hand.
  b0042: { add: [{ tag: 'path', attrs: { d: 'M62.5 32.5 L50 55' } }] },
  // The thirteenth step.
  b0043: { tint: [6] },
  // Someone else behind your door.
  b0046: { tint: [1, 4] },
  // Up to the last minute: the minute hand.
  b0049: { tint: [1] },
  // The one Tuesday: the front page.
  b0051: { tint: [0, 2, 5, 6] },
  // The right sock, first.
  b0052: { tint: [0, 1] },
  // One pause a second longer.
  b0054: {
    drop: [1],
    base: [{ tag: 'path', attrs: { d: 'M34 28 H46 M60 28 H68' } }],
    add: [{ tag: 'line', attrs: { x1: '49', y1: '28', x2: '57', y2: '28', 'stroke-dasharray': '0.1 3.5', 'stroke-width': '2.2' } }],
  },
  // The sleeper, turned the other way.
  b0057: { drop: [2], add: [{ tag: 'path', attrs: { d: 'M46 46 C64 37 88 36 98 46' } }] },
  // The reflection a millimetre apart.
  b0060: { tint: [4, 5] },
  // The same life on two wheels.
  b0063: { tint: [0, 1, 2, 3] },
  // The same life through the sky.
  b0064: { tint: [2] },
  // One day more: the hour hand.
  b0067: { tint: [2] },
  // The other covers under your name.
  b0070: { tint: [3, 4, 5] },
  // The thought that lasts three seconds.
  b0078: { tint: [5] },
  // The other window.
  b0087: { tint: [2, 3] },
  // The other life the crossing sits inside.
  b0088: { tint: [1, 4] },
  // The rest of his life, the pages he did not write.
  b0090: { tint: [8] },
  // The three pages someone else wrote.
  b0091: { tint: [7] },
};

function appendShape(parent: SVGElement, shape: Shape): void {
  const node = document.createElementNS(NS, shape.tag);
  for (const [name, value] of Object.entries(shape.attrs)) {
    node.setAttribute(name, value);
  }
  parent.append(node);
}

/** A decorative line drawing for a book, hidden from assistive technology. */
export function createIllustration(motif: string, accent?: Accent): SVGSVGElement {
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', '0 0 120 72');
  svg.setAttribute('class', 'illustration');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '1.4');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');

  // The strokes sit in one group so the charcoal hand can be laid over them.
  const stroke = document.createElementNS(NS, 'g');
  stroke.setAttribute('class', 'illustration__stroke');
  const sanguine = document.createElementNS(NS, 'g');
  sanguine.setAttribute('class', 'illustration__stroke illustration__stroke--sanguine');

  const tint = new Set(accent?.tint ?? []);
  const drop = new Set(accent?.drop ?? []);
  (MOTIFS[motif] ?? MOTIFS['book'] ?? []).forEach((shape, index) => {
    if (drop.has(index)) return;
    appendShape(tint.has(index) ? sanguine : stroke, shape);
  });
  for (const shape of accent?.base ?? []) appendShape(stroke, shape);
  for (const shape of accent?.add ?? []) appendShape(sanguine, shape);

  svg.append(stroke);
  if (sanguine.childElementCount > 0) svg.append(sanguine);

  return svg;
}

/** How many strokes a motif is drawn with, for checking accents against it. */
export function motifStrokeCount(motif: string): number {
  return MOTIFS[motif]?.length ?? 0;
}

export const CHARCOAL_FILTER_ID = 'charcoal-hand';

/**
 * The hand every motif is drawn with: a slight tremor along the line, the
 * tooth of the paper breaking it, a second lighter pass beside it, and a soft
 * smudge underneath. Defined once for the document; the region is fixed to
 * the motifs' shared 120x72 field so a lone horizontal stroke still renders.
 */
export function createCharcoalDefs(): SVGSVGElement {
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('class', 'charcoal-defs');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  svg.setAttribute('width', '0');
  svg.setAttribute('height', '0');

  const filter = document.createElementNS(NS, 'filter');
  filter.id = CHARCOAL_FILTER_ID;
  for (const [name, value] of Object.entries({
    filterUnits: 'userSpaceOnUse',
    x: '-10',
    y: '-10',
    width: '140',
    height: '92',
    'color-interpolation-filters': 'sRGB',
  })) {
    filter.setAttribute(name, value);
  }

  const primitives: Array<[string, Record<string, string>, Array<[string, Record<string, string>]>?]> = [
    ['feTurbulence', { type: 'fractalNoise', baseFrequency: '0.03', numOctaves: '2', seed: '4', result: 'tremor' }],
    ['feDisplacementMap', { in: 'SourceGraphic', in2: 'tremor', scale: '3', xChannelSelector: 'R', yChannelSelector: 'G', result: 'line' }],
    ['feTurbulence', { type: 'fractalNoise', baseFrequency: '0.9', numOctaves: '2', seed: '9', result: 'tooth' }],
    ['feColorMatrix', { in: 'tooth', type: 'matrix', values: '0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.1 1.45', result: 'toothAlpha' }],
    ['feComposite', { in: 'line', in2: 'toothAlpha', operator: 'in', result: 'broken' }],
    ['feDisplacementMap', { in: 'SourceGraphic', in2: 'tremor', scale: '7', xChannelSelector: 'G', yChannelSelector: 'R', result: 'secondPass' }],
    ['feComponentTransfer', { in: 'secondPass', result: 'second' }, [['feFuncA', { type: 'linear', slope: '0.28' }]]],
    ['feGaussianBlur', { in: 'line', stdDeviation: '2.4', result: 'blur' }],
    ['feComponentTransfer', { in: 'blur', result: 'smudge' }, [['feFuncA', { type: 'linear', slope: '0.22' }]]],
    ['feMerge', {}, [['feMergeNode', { in: 'smudge' }], ['feMergeNode', { in: 'second' }], ['feMergeNode', { in: 'broken' }]]],
  ];
  for (const [tag, attrs, children] of primitives) {
    const node = document.createElementNS(NS, tag);
    for (const [name, value] of Object.entries(attrs)) node.setAttribute(name, value);
    for (const [childTag, childAttrs] of children ?? []) {
      const child = document.createElementNS(NS, childTag);
      for (const [name, value] of Object.entries(childAttrs)) child.setAttribute(name, value);
      node.append(child);
    }
    filter.append(node);
  }

  svg.append(filter);
  return svg;
}

export const MOTIF_NAMES = Object.keys(MOTIFS);
