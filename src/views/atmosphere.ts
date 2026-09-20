import { prefersReducedMotion } from './motion';

/**
 * The reading-room atmosphere: lamp glow, drifting dust, scroll-driven reveals,
 * and a pointer-driven tilt on the wall cards. Everything here is decorative —
 * content is fully legible with or without it, and reduced-motion readers get
 * stillness instead.
 */

/** Elements that settle into view as the reader scrolls to them. */
const REVEAL_SELECTOR =
  '.wall__cell, .nearby__item, .shelf__item, .aftertaste, .book__actions, .shelfwalk, .masthead__scale-item';

let observer: IntersectionObserver | null | undefined;
const observed = new WeakSet<Element>();

function reveal(element: Element): void {
  element.classList.add('is-in');
  observer?.unobserve(element);
}

function getObserver(): IntersectionObserver | null {
  if (observer !== undefined) return observer;
  if (typeof IntersectionObserver === 'undefined') {
    observer = null;
    return observer;
  }
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) reveal(entry.target);
      }
    },
    { rootMargin: '0px 0px -6% 0px', threshold: 0.1 },
  );
  return observer;
}

/** Watch freshly rendered targets; without intersection support, show them at once. */
export function refreshReveals(scope: ParentNode): void {
  const io = getObserver();
  const targets = scope.querySelectorAll(REVEAL_SELECTOR);
  for (const target of targets) {
    if (observed.has(target)) continue;
    observed.add(target);
    if (io) io.observe(target);
    else target.classList.add('is-in');
  }
}

/** A slow pointer tilt plus a travelling sheen on the wall cards. Delegated once. */
function initTilt(): void {
  if (window.matchMedia?.('(hover: none)')?.matches) return;
  if (prefersReducedMotion()) return;

  document.addEventListener('pointermove', (event) => {
    if (!(event.target instanceof Element)) return;
    const card = event.target.closest('a.card');
    if (!(card instanceof HTMLElement)) return;
    const rect = card.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.setProperty('--ry', `${(px * 2).toFixed(2)}deg`);
    card.style.setProperty('--rx', `${(-py * 2).toFixed(2)}deg`);
    card.style.setProperty('--mx', `${(px * 100 + 50).toFixed(1)}%`);
    card.style.setProperty('--my', `${(py * 100 + 50).toFixed(1)}%`);
  });

  document.addEventListener('pointerout', (event) => {
    if (!(event.target instanceof Element)) return;
    const card = event.target.closest('a.card');
    if (!(card instanceof HTMLElement)) return;
    if (event.relatedTarget instanceof Node && card.contains(event.relatedTarget)) return;
    card.style.removeProperty('--rx');
    card.style.removeProperty('--ry');
    card.style.removeProperty('--mx');
    card.style.removeProperty('--my');
  });
}

function layer(className: string): HTMLDivElement {
  const node = document.createElement('div');
  node.className = className;
  node.setAttribute('aria-hidden', 'true');
  return node;
}

/** Fixed lamp glow, vignette, and one breath of drifting dust. Runs once. */
export function initAtmosphere(shell: HTMLElement): void {
  const documentElement = document.documentElement;
  if (documentElement.classList.contains('js-cinematic')) return;
  documentElement.classList.add('js-cinematic');
  if (prefersReducedMotion()) return;

  shell.prepend(layer('lamp'), layer('vignette'));

  const dust = layer('dust');
  for (let index = 0; index < 14; index += 1) {
    const mote = document.createElement('i');
    const size = 2 + Math.random() * 3;
    mote.style.left = `${(Math.random() * 100).toFixed(2)}%`;
    mote.style.top = '100%';
    mote.style.width = `${size.toFixed(1)}px`;
    mote.style.height = `${size.toFixed(1)}px`;
    mote.style.animationDuration = `${(18 + Math.random() * 22).toFixed(1)}s`;
    mote.style.animationDelay = `${(-Math.random() * 40).toFixed(1)}s`;
    dust.append(mote);
  }
  shell.prepend(dust);

  initTilt();
}
