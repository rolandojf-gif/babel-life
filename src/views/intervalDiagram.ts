/**
 * A static diagram of two separate intervals for The 08:14: two seconds,
 * and thirty-one years. Deterministic, not a picture of a train.
 */

const NS = 'http://www.w3.org/2000/svg';

const WIDTH = 280;
const HEIGHT = 132;
const LEFT = 24;
const RIGHT = 256;
const SPAN = RIGHT - LEFT;

function node(tag: string, attrs: Record<string, string>, text?: string): SVGElement {
  const el = document.createElementNS(NS, tag);
  for (const [name, value] of Object.entries(attrs)) el.setAttribute(name, value);
  if (text !== undefined) el.textContent = text;
  return el;
}

/** Two seconds against thirty-one years, drawn as two unjoined scales. */
export function createIntervalDiagram(): SVGSVGElement {
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', `0 0 ${String(WIDTH)} ${String(HEIGHT)}`);
  svg.setAttribute('class', 'interval');
  svg.setAttribute('role', 'img');
  svg.setAttribute('focusable', 'false');
  svg.setAttribute('overflow', 'visible');
  svg.setAttribute('fill', 'none');
  svg.setAttribute(
    'aria-label',
    'Two seconds, from 08:14:00 to 08:14:02, set against thirty-one years. The two scales are separate.',
  );

  const upperY = 40;
  svg.append(node('line', { class: 'interval__line', x1: String(LEFT), y1: String(upperY), x2: String(RIGHT), y2: String(upperY) }));
  for (const step of [0, 1, 2]) {
    const x = LEFT + (SPAN * step) / 2;
    svg.append(
      node('line', {
        class: 'interval__tick',
        x1: String(x),
        y1: String(upperY - 8),
        x2: String(x),
        y2: String(upperY),
      }),
    );
  }
  svg.append(
    node('text', { class: 'interval__label', x: String(LEFT), y: '22', 'text-anchor': 'start', 'font-size': '8' }, '08:14:00'),
    node('text', { class: 'interval__label', x: String(RIGHT), y: '22', 'text-anchor': 'end', 'font-size': '8' }, '08:14:02'),
    node('circle', { class: 'interval__dot', cx: String(RIGHT), cy: String(upperY), r: '2.4' }),
  );

  const lowerY = 98;
  svg.append(node('line', { class: 'interval__line', x1: String(LEFT), y1: String(lowerY), x2: String(RIGHT), y2: String(lowerY) }));
  const years = 31;
  for (let index = 0; index < years; index += 1) {
    const x = LEFT + (SPAN * index) / (years - 1);
    svg.append(
      node('line', {
        class: 'interval__year',
        x1: String(x),
        y1: String(lowerY - 6),
        x2: String(x),
        y2: String(lowerY),
      }),
    );
  }
  svg.append(
    node(
      'text',
      { class: 'interval__caption', x: String(LEFT), y: '120', 'text-anchor': 'start', 'font-size': '8' },
      'thirty-one years',
    ),
  );

  return svg;
}
