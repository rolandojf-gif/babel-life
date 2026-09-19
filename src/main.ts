import { createController } from './library/controller';
import type { AppState, RenderHint } from './library/model';
import { mountAppShell } from './views/AppShell';

const root = document.querySelector<HTMLElement>('#app');
if (!root) throw new Error('Missing #app root element');

let render: ((state: AppState, hint: RenderHint) => void) | null = null;

const controller = createController((state, hint) => {
  render?.(state, hint);
});

render = mountAppShell(root, controller);
controller.start();
