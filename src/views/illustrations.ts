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
  // Train doors, closing.
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
  // An open book.
  book: [
    { tag: 'path', attrs: { d: 'M60 22 q-14 -7 -32 -5 v36 q18 -2 32 5 z' } },
    { tag: 'path', attrs: { d: 'M60 22 q14 -7 32 -5 v36 q-18 -2 -32 5 z' } },
    { tag: 'line', attrs: { x1: '60', y1: '22', x2: '60', y2: '58' } },
    { tag: 'line', attrs: { x1: '20', y1: '64', x2: '100', y2: '64', 'stroke-dasharray': '3 5' } },
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
