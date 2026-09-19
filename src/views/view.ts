import type { AppState } from '../library/model';

/** What the shell needs from every view: a node, a way to refresh it, and focus entry points. */
export interface ViewHandle {
  element: HTMLElement;
  update(state: AppState): void;
  focus(target: 'view' | 'shortcut' | 'find'): void;
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
