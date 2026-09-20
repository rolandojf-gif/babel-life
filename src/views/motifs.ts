/**
 * Two quiet motifs of physical volumes, drawn in the same thin line language
 * as the shelf illustrations: a run of shelved spines on its board, and the
 * candle the reading room is lit by. Both are decorative only and hidden from
 * assistive technology. No external assets, no icon dependency.
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

/** A short run of shelved spines on its board, the last one leaning. */
export function createSpineShelf(): SVGSVGElement {
  const svg = svgDocument('card__neighbour-spines', '0 0 72 46');
  svg.append(
    // The shelf board itself.
    shape('line', { x1: '4', y1: '42', x2: '68', y2: '42' }),
    // Three upright volumes of uneven heights.
    shape('rect', { x: '10', y: '13', width: '6', height: '28' }),
    shape('rect', { x: '20', y: '8', width: '7', height: '33' }),
    shape('rect', { x: '31', y: '15', width: '6', height: '26' }),
    // The fourth leans against its neighbours.
    shape('rect', {
      x: '48',
      y: '12',
      width: '6',
      height: '29',
      transform: 'rotate(-16 54 41)',
    }),
  );
  return svg;
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
