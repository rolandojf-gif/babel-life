import type { AppState } from '../library/model';

/** What the shell needs from every view: a node, a way to refresh it, focus entry points. */
export interface ViewHandle {
  element: HTMLElement;
  update(state: AppState): void;
  focus(target: 'view' | 'stranger' | 'wallGrid'): void;
}

export function element<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className !== undefined) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

/** A decorative glyph: visible, but never part of a control's accessible name. */
export function glyph(className: string, character: string): HTMLSpanElement {
  const node = element('span', className, character);
  node.setAttribute('aria-hidden', 'true');
  return node;
}

/** A link that navigates by hash, so the browser owns the history entry. */
export function link(href: string, className?: string, text?: string): HTMLAnchorElement {
  const node = element('a', className, text);
  node.href = href;
  return node;
}
