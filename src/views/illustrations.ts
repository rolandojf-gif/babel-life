/**
 * Local symbolic illustrations. Line drawings on a 120x72 field, drawn in
 * currentColor so each card's tonal surface carries them. No external assets,
 * no icon dependency. They are decorative: the card's own words carry meaning.
 */

const NS = 'http://www.w3.org/2000/svg';

interface Shape {
  tag: 'line' | 'path' | 'circle' | 'rect' | 'polyline';
  attrs: Record<string, string>;
}

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
  // A penalty area and a ball.
  pitch: [
    { tag: 'path', attrs: { d: 'M10 58 h100' } },
    { tag: 'path', attrs: { d: 'M34 58 v-26 h52 v26' } },
    { tag: 'path', attrs: { d: 'M50 58 v-11 h20 v11' } },
    { tag: 'path', attrs: { d: 'M46 32 a14 10 0 0 0 28 0' } },
    { tag: 'circle', attrs: { cx: '60', cy: '48', r: '3.5' } },
  ],
  // A single light, and something small underneath it.
  spotlight: [
    { tag: 'circle', attrs: { cx: '60', cy: '12', r: '5' } },
    { tag: 'path', attrs: { d: 'M56 16 L38 58' } },
    { tag: 'path', attrs: { d: 'M64 16 L82 58' } },
    { tag: 'line', attrs: { x1: '14', y1: '58', x2: '106', y2: '58' } },
    { tag: 'circle', attrs: { cx: '60', cy: '54', r: '3.5' } },
  ],
  // A cup, and the ring it left yesterday.
  cup: [
    { tag: 'path', attrs: { d: 'M44 24 h30 l-4 26 h-22 z' } },
    { tag: 'path', attrs: { d: 'M74 29 a7 7 0 0 1 0 14' } },
    { tag: 'line', attrs: { x1: '16', y1: '58', x2: '104', y2: '58' } },
    { tag: 'path', attrs: { d: 'M26 50 a8 3 0 1 0 16 0 a8 3 0 1 0 -16 0' } },
  ],
  // An envelope.
  letter: [
    { tag: 'rect', attrs: { x: '26', y: '20', width: '68', height: '44', rx: '1' } },
    { tag: 'path', attrs: { d: 'M26 22 L60 46 L94 22' } },
    { tag: 'line', attrs: { x1: '26', y1: '62', x2: '50', y2: '42' } },
    { tag: 'line', attrs: { x1: '94', y1: '62', x2: '70', y2: '42' } },
  ],
  // A photograph, slightly out of square.
  photograph: [
    { tag: 'rect', attrs: { x: '30', y: '16', width: '60', height: '48', rx: '1', transform: 'rotate(-4 60 40)' } },
    { tag: 'line', attrs: { x1: '36', y1: '48', x2: '84', y2: '45', transform: 'rotate(-4 60 40)' } },
    { tag: 'circle', attrs: { cx: '72', cy: '31', r: '5', transform: 'rotate(-4 60 40)' } },
    { tag: 'path', attrs: { d: 'M38 48 l10 -10 l9 8 l8 -6 l19 12', transform: 'rotate(-4 60 40)' } },
  ],
  // A river under a footbridge.
  river: [
    { tag: 'path', attrs: { d: 'M8 46 q13 -7 26 0 t26 0 t26 0 t26 0' } },
    { tag: 'path', attrs: { d: 'M8 56 q13 -7 26 0 t26 0 t26 0 t26 0' } },
    { tag: 'line', attrs: { x1: '16', y1: '30', x2: '104', y2: '30' } },
    { tag: 'line', attrs: { x1: '28', y1: '30', x2: '28', y2: '40' } },
    { tag: 'line', attrs: { x1: '92', y1: '30', x2: '92', y2: '40' } },
    { tag: 'line', attrs: { x1: '16', y1: '24', x2: '104', y2: '24', 'stroke-dasharray': '3 5' } },
  ],
  // A kitchen window onto a yard.
  window: [
    { tag: 'rect', attrs: { x: '30', y: '12', width: '60', height: '46' } },
    { tag: 'line', attrs: { x1: '60', y1: '12', x2: '60', y2: '58' } },
    { tag: 'line', attrs: { x1: '30', y1: '35', x2: '90', y2: '35' } },
    { tag: 'line', attrs: { x1: '22', y1: '62', x2: '98', y2: '62' } },
    { tag: 'line', attrs: { x1: '38', y1: '46', x2: '52', y2: '46', 'stroke-dasharray': '2 4' } },
  ],
  // A screen containing a screen.
  screen: [
    { tag: 'rect', attrs: { x: '20', y: '12', width: '80', height: '42', rx: '2' } },
    { tag: 'line', attrs: { x1: '60', y1: '54', x2: '60', y2: '62' } },
    { tag: 'line', attrs: { x1: '44', y1: '62', x2: '76', y2: '62' } },
    { tag: 'rect', attrs: { x: '40', y: '22', width: '40', height: '22', rx: '1' } },
    { tag: 'rect', attrs: { x: '52', y: '29', width: '16', height: '9', rx: '1', 'stroke-dasharray': '2 3' } },
  ],
  // A clock, hands unremarkable.
  clock: [
    { tag: 'circle', attrs: { cx: '60', cy: '37', r: '25' } },
    { tag: 'line', attrs: { x1: '60', y1: '37', x2: '60', y2: '21' } },
    { tag: 'line', attrs: { x1: '60', y1: '37', x2: '73', y2: '43' } },
    { tag: 'line', attrs: { x1: '60', y1: '10', x2: '60', y2: '14' } },
    { tag: 'line', attrs: { x1: '87', y1: '37', x2: '83', y2: '37' } },
  ],
  // A telephone, waiting to be answered.
  telephone: [
    { tag: 'path', attrs: { d: 'M34 48 h52 l-6 -12 h-40 z' } },
    { tag: 'path', attrs: { d: 'M38 28 h44' } },
    { tag: 'path', attrs: { d: 'M38 28 a5 5 0 0 0 -5 -5 h-4' } },
    { tag: 'path', attrs: { d: 'M82 28 a5 5 0 0 1 5 -5 h4' } },
    { tag: 'path', attrs: { d: 'M60 48 q-4 6 0 10 t0 6' } },
    { tag: 'line', attrs: { x1: '24', y1: '64', x2: '96', y2: '64' } },
  ],
  // A coat on a hook, with the pocket still in it.
  coat: [
    { tag: 'path', attrs: { d: 'M55 13 a5 5 0 1 1 10 0' } },
    { tag: 'path', attrs: { d: 'M60 18 L51 22 L60 31 L69 22 Z' } },
    { tag: 'path', attrs: { d: 'M51 22 L41 28 L39 62 h42 L79 28 L69 22' } },
    { tag: 'path', attrs: { d: 'M41 28 L31 48 L38 51' } },
    { tag: 'path', attrs: { d: 'M79 28 L89 48 L82 51' } },
    { tag: 'line', attrs: { x1: '60', y1: '31', x2: '60', y2: '62' } },
    { tag: 'line', attrs: { x1: '65', y1: '45', x2: '75', y2: '45' } },
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
  // A microphone on a stand.
  microphone: [
    { tag: 'rect', attrs: { x: '52', y: '10', width: '16', height: '26', rx: '8' } },
    { tag: 'path', attrs: { d: 'M44 32 a16 16 0 0 0 32 0' } },
    { tag: 'line', attrs: { x1: '60', y1: '48', x2: '60', y2: '56' } },
    { tag: 'line', attrs: { x1: '46', y1: '56', x2: '74', y2: '56' } },
    { tag: 'line', attrs: { x1: '22', y1: '64', x2: '98', y2: '64', 'stroke-dasharray': '3 5' } },
  ],
  // Rain, and a word for it.
  rain: [
    { tag: 'circle', attrs: { cx: '46', cy: '32', r: '10' } },
    { tag: 'circle', attrs: { cx: '62', cy: '27', r: '13' } },
    { tag: 'circle', attrs: { cx: '78', cy: '33', r: '9' } },
    { tag: 'line', attrs: { x1: '46', y1: '50', x2: '42', y2: '62' } },
    { tag: 'line', attrs: { x1: '60', y1: '50', x2: '56', y2: '62' } },
    { tag: 'line', attrs: { x1: '74', y1: '50', x2: '70', y2: '62' } },
  ],
  // A dry-stone wall, where somebody put it.
  stones: [
    { tag: 'rect', attrs: { x: '18', y: '26', width: '26', height: '11' } },
    { tag: 'rect', attrs: { x: '48', y: '26', width: '20', height: '11' } },
    { tag: 'rect', attrs: { x: '72', y: '26', width: '30', height: '11' } },
    { tag: 'rect', attrs: { x: '18', y: '41', width: '18', height: '11' } },
    { tag: 'rect', attrs: { x: '40', y: '41', width: '30', height: '11' } },
    { tag: 'rect', attrs: { x: '74', y: '41', width: '28', height: '11' } },
    { tag: 'line', attrs: { x1: '14', y1: '58', x2: '106', y2: '58' } },
  ],
  // A signal arriving, and the outermost arc never sent back.
  antenna: [
    { tag: 'circle', attrs: { cx: '60', cy: '58', r: '3' } },
    { tag: 'path', attrs: { d: 'M46 54 a18 18 0 0 1 28 0' } },
    { tag: 'path', attrs: { d: 'M38 44 a30 30 0 0 1 44 0' } },
    { tag: 'path', attrs: { d: 'M30 34 a42 42 0 0 1 60 0', 'stroke-dasharray': '4 4' } },
    { tag: 'line', attrs: { x1: '18', y1: '64', x2: '102', y2: '64' } },
  ],
  // A stack of envelopes, none of them stamped.
  stack: [
    { tag: 'rect', attrs: { x: '26', y: '40', width: '68', height: '18', rx: '1' } },
    { tag: 'path', attrs: { d: 'M26 41 L60 54 L94 41' } },
    { tag: 'rect', attrs: { x: '30', y: '30', width: '60', height: '12', rx: '1', 'stroke-dasharray': '3 3' } },
    { tag: 'rect', attrs: { x: '34', y: '22', width: '52', height: '10', rx: '1', 'stroke-dasharray': '3 3' } },
    { tag: 'line', attrs: { x1: '18', y1: '62', x2: '102', y2: '62' } },
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
  socks: [
    { tag: 'path', attrs: { d: 'M52 12 H40 V40 H30 A6 6 0 0 0 30 52 H46 A6 6 0 0 0 52 46 Z' } },
    { tag: 'line', attrs: { x1: '40', y1: '18', x2: '52', y2: '18' } },
    { tag: 'path', attrs: { d: 'M68 12 H80 V40 H90 A6 6 0 0 1 90 52 H74 A6 6 0 0 1 68 46 Z', 'stroke-dasharray': '3 3' } },
    { tag: 'line', attrs: { x1: '68', y1: '18', x2: '80', y2: '18', 'stroke-dasharray': '3 3' } },
    { tag: 'line', attrs: { x1: '18', y1: '60', x2: '102', y2: '60' } },
  ],
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
};

/** A decorative line drawing for a book, hidden from assistive technology. */
export function createIllustration(motif: string): SVGSVGElement {
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

  for (const shape of MOTIFS[motif] ?? MOTIFS['book'] ?? []) {
    const node = document.createElementNS(NS, shape.tag);
    for (const [name, value] of Object.entries(shape.attrs)) {
      node.setAttribute(name, value);
    }
    svg.append(node);
  }

  return svg;
}

export const MOTIF_NAMES = Object.keys(MOTIFS);
