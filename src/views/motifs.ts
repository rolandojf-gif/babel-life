/**
 * Two quiet motifs of physical volumes, drawn in the same thin line language
 * as the shelf illustrations: a run of shelved spines on its board, and the
 * candle the reading room is lit by. Both are decorative only and hidden from
 * assistive technology. No external assets, no icon dependency.
 *
 * The spine shelf shares the 120×72 field and stroke conventions of the main
 * illustrations so the two feel like one drawing language when composed.
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

/**
 * A short run of shelved spines on its board, drawn in the same 120×72
 * field as the main illustrations. Varied heights, slight rounding, one
 * volume leaning — the same hand that drew the main motifs.
 */
export function createSpineShelf(): SVGSVGElement {
  const svg = svgDocument('card__neighbour-spines', '0 0 120 72');
  svg.append(
    // The shelf board: a quiet line, not ruler-straight to the edge.
    shape('line', { x1: '14', y1: '62', x2: '106', y2: '62' }),
    // Five upright volumes of uneven heights and widths.
    shape('rect', { x: '22', y: '24', width: '8', height: '37', rx: '1' }),
    shape('rect', { x: '34', y: '16', width: '10', height: '45', rx: '1' }),
    shape('rect', { x: '48', y: '28', width: '7', height: '33', rx: '1' }),
    shape('rect', { x: '59', y: '20', width: '9', height: '41', rx: '1' }),
    // The last one leans against its neighbours.
    shape('rect', {
      x: '80',
      y: '18',
      width: '8',
      height: '43',
      rx: '1',
      transform: 'rotate(-12 88 61)',
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
