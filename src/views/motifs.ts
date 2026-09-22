/**
 * Small motifs drawn in the same thin line language as the card illustrations:
 * the candle the reading room is lit by, and the marks beside the masthead's
 * scale figures. All are decorative only and hidden from assistive
 * technology. No external assets, no icon dependency.
 */

const NS = 'http://www.w3.org/2000/svg';

function svgDocument(classNames: string, viewBox: string): SVGSVGElement {
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', viewBox);
  svg.setAttribute('class', classNames);
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '1.4');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  return svg;
}

function shape(tag: string, attrs: Record<string, string>): SVGElement {
  const node = document.createElementNS(NS, tag);
  for (const [name, value] of Object.entries(attrs)) node.setAttribute(name, value);
  return node;
}

/** The candle the room is read by: flame, wick, rim, and body. */
export function createCandleGlyph(): SVGSVGElement {
  const svg = svgDocument('consulted__candle', '0 0 10 16');
  svg.append(
    shape('path', { d: 'M5 1.4 C6.6 3.2 6.6 4.8 5 5.8 C3.4 4.8 3.4 3.2 5 1.4 Z' }),
    shape('line', { x1: '5', y1: '5.8', x2: '5', y2: '7' }),
    shape('line', { x1: '2.6', y1: '7', x2: '7.4', y2: '7' }),
    shape('line', { x1: '2.6', y1: '7', x2: '2.6', y2: '14' }),
    shape('line', { x1: '7.4', y1: '7', x2: '7.4', y2: '14' }),
    shape('line', { x1: '2.6', y1: '14', x2: '7.4', y2: '14' }),
  );
  return svg;
}

/**
 * The Library's mark beside its scale figure: three spines on a board, the
 * middle one free to be drawn a hair out of the row.
 */
export function createSpinesMark(): SVGSVGElement {
  const svg = svgDocument('masthead__motif masthead__motif--library', '0 0 16 12');
  svg.append(
    shape('line', { x1: '1.5', y1: '11.2', x2: '14.5', y2: '11.2' }),
    shape('rect', { x: '3', y: '3.6', width: '2.4', height: '7.6', rx: '0.4' }),
    shape('rect', {
      class: 'masthead__motif-spine',
      x: '6.6',
      y: '1.6',
      width: '2.8',
      height: '9.6',
      rx: '0.4',
    }),
    shape('rect', {
      x: '11',
      y: '4.2',
      width: '2.2',
      height: '7',
      rx: '0.4',
      transform: 'rotate(-10 13.2 11.2)',
    }),
  );
  return svg;
}

/**
 * The observable universe's mark: a ringed planet as an old astronomical
 * plate draws it. The back of the ring passes behind the globe, the front
 * across it; the ring alone is free to turn.
 */
export function createPlanetMark(): SVGSVGElement {
  const svg = svgDocument('masthead__motif masthead__motif--universe', '0 0 16 12');
  const ring = document.createElementNS(NS, 'g');
  ring.setAttribute('class', 'masthead__motif-ring');
  ring.append(
    shape('path', { d: 'M1 6A7 2.1 0 0 1 5.47 4.04M10.53 4.04A7 2.1 0 0 1 15 6' }),
    shape('path', { d: 'M15 6A7 2.1 0 0 1 8 8.1A7 2.1 0 0 1 1 6' }),
  );
  svg.append(shape('circle', { cx: '8', cy: '6', r: '3.2' }), ring);
  return svg;
}
