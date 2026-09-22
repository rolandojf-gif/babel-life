/** @vitest-environment jsdom */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createViewTransition,
  mobileHeroIndexDrift,
  MOBILE_HERO_DRIFT_SPAN,
  MOBILE_HERO_DRIFT_START,
  syncMobileHeroIndexDrift,
} from '../src/views/motion';
import { mountAppShell } from '../src/views/AppShell';
import { createController } from '../src/library/controller';
import { createShelfLocator } from '../src/views/shelfLocator';
import type { AppState } from '../src/library/model';

function preference(reduce: boolean): void {
  vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: reduce })));
}

function pendingTransition() {
  let finish!: () => void;
  const finished = new Promise<void>((resolve) => { finish = resolve; });
  return { ready: Promise.resolve(), finished, skipTransition: vi.fn(), finish };
}

beforeEach(() => {
  preference(false);
  vi.spyOn(document, 'hidden', 'get').mockReturnValue(false);
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
});

afterEach(() => {
  Reflect.deleteProperty(document, 'startViewTransition');
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  document.body.replaceChildren();
});

describe('navigation motion', () => {
  it('renders immediately on initial entry and without native transition support', () => {
    const update = vi.fn();
    const render = createViewTransition(document.createElement('main'));
    render(update, false);
    render(update, true);
    expect(update).toHaveBeenCalledTimes(2);
  });

  it('bypasses snapshots when reduced motion is requested or the document is hidden', () => {
    const start = vi.fn();
    Object.defineProperty(document, 'startViewTransition', { configurable: true, value: start });
    const update = vi.fn();
    const render = createViewTransition(document.createElement('main'));
    preference(true);
    render(update, true);
    preference(false);
    vi.spyOn(document, 'hidden', 'get').mockReturnValue(true);
    render(update, true);
    expect(start).not.toHaveBeenCalled();
    expect(update).toHaveBeenCalledTimes(2);
  });

  it('never lets a skipped, late callback overwrite the latest route', async () => {
    const callbacks: (() => void)[] = [];
    const transitions = [pendingTransition(), pendingTransition()];
    const start = vi.fn((update: () => void) => {
      callbacks.push(update);
      return transitions[callbacks.length - 1];
    });
    Object.defineProperty(document, 'startViewTransition', { configurable: true, value: start });
    const main = document.createElement('main');
    const render = createViewTransition(main);
    render(() => { main.textContent = 'old route'; }, true);
    render(() => { main.textContent = 'latest route'; }, true);
    callbacks[1]!();
    callbacks[0]!();
    transitions[0]!.finish();
    transitions[1]!.finish();
    await Promise.resolve();
    expect(transitions[0]!.skipTransition).toHaveBeenCalledOnce();
    expect(main.textContent).toBe('latest route');
    // Removing this flag would replay entrance motion after the native dissolve.
    expect(main.hasAttribute('data-view-transition')).toBe(true);
  });

  it('does not lose navigation if the browser rejects or throws during snapshot setup', async () => {
    const main = document.createElement('main');
    const render = createViewTransition(main);
    const update = vi.fn();
    const start = vi.fn(() => ({
      ready: Promise.reject(new Error('snapshot skipped')),
      finished: Promise.reject(new Error('snapshot skipped')),
      skipTransition: vi.fn(),
    }));
    Object.defineProperty(document, 'startViewTransition', { configurable: true, value: start });
    render(update, true);
    await Promise.resolve();
    expect(update).toHaveBeenCalledOnce();
    start.mockImplementation(() => { throw new Error('unavailable'); });
    render(update, true);
    expect(update).toHaveBeenCalledTimes(2);
  });

  it('can switch to immediate rendering while a native callback is still pending', async () => {
    let callback!: () => void;
    const transition = pendingTransition();
    Object.defineProperty(document, 'startViewTransition', { configurable: true, value: (update: () => void) => {
      callback = update;
      return transition;
    } });
    const main = document.createElement('main');
    const render = createViewTransition(main);
    render(() => { main.textContent = 'outdated'; }, true);
    preference(true);
    render(() => { main.textContent = 'immediate'; }, true);
    callback();
    transition.finish();
    await Promise.resolve();
    expect(main.textContent).toBe('immediate');
    expect(main.hasAttribute('data-view-transition')).toBe(false);
  });

  it('snapshots controller state and preserves title, focus and announcements when committing', async () => {
    const callbacks: (() => void)[] = [];
    const transitions: ReturnType<typeof pendingTransition>[] = [];
    Object.defineProperty(document, 'startViewTransition', { configurable: true, value: (update: () => void) => {
      callbacks.push(update);
      const transition = pendingTransition();
      transitions.push(transition);
      return transition;
    } });
    const root = document.createElement('div');
    document.body.append(root);
    const render = mountAppShell(root, createController(() => {}, 1n));
    const state: AppState = { view: 'wall', wallSelection: 'first', wallSeed: 1n,
      currentBookId: null, address: null, shelf: null };
    render(state, { focus: 'none' });
    state.view = 'book';
    state.currentBookId = 'b0007';
    render(state, { focus: 'view' });
    state.currentBookId = 'b0003'; // The queued view must not observe this later mutation.
    callbacks[0]!();
    expect(root.querySelector('h1')?.textContent).toBe('The Exact Time');
    expect(document.title).toBe('The Exact Time — Babel Life');
    expect(document.activeElement).toBe(root.querySelector('h1'));
    state.view = 'wall';
    state.currentBookId = null;
    state.wallSelection = 'all';
    render(state, { focus: 'wallGrid', announce: 'All twenty-seven lives.' });
    callbacks[1]!();
    expect(root.querySelectorAll('a.card')).toHaveLength(27);
    expect(document.activeElement).toBe(root.querySelector('a.card'));
    expect(root.querySelector('[role="status"]')?.textContent).toBe('All twenty-seven lives.');
    transitions.forEach((transition) => transition.finish());
    await Promise.resolve();
  });
});

describe('the shelf locator', () => {
  it('is informational and does not jump to the embedded shelf', () => {
    const shelf = document.createElement('section');
    shelf.tabIndex = -1;
    shelf.scrollIntoView = vi.fn();
    const locator = createShelfLocator({ hexagon: 'A', wall: 1, shelf: 1, volume: 1 });
    document.body.append(locator, shelf);

    expect(locator.tagName).toBe('DIV');
    expect(locator.querySelector('a')).toBeNull();
    expect(locator.tabIndex).toBeLessThan(0);
    locator.click();
    expect(shelf.scrollIntoView).not.toHaveBeenCalled();
    expect(document.activeElement).not.toBe(shelf);
  });
});

describe('the mobile hero index', () => {
  const heroBottom = MOBILE_HERO_DRIFT_START + MOBILE_HERO_DRIFT_SPAN + 200;

  it('stays put until scrolling has begun, then settles and holds', () => {
    expect(mobileHeroIndexDrift(0, heroBottom, true)).toBe(0);
    expect(mobileHeroIndexDrift(MOBILE_HERO_DRIFT_START, heroBottom, true)).toBe(0);
    expect(mobileHeroIndexDrift(MOBILE_HERO_DRIFT_START + MOBILE_HERO_DRIFT_SPAN / 2, heroBottom, true)).toBe(0.5);
    expect(mobileHeroIndexDrift(MOBILE_HERO_DRIFT_START + MOBILE_HERO_DRIFT_SPAN, heroBottom, true)).toBe(1);
    expect(mobileHeroIndexDrift(heroBottom + 400, heroBottom, true)).toBe(1);
  });

  it('does not travel once the hero is too short to leave, or when motion is off', () => {
    expect(mobileHeroIndexDrift(200, MOBILE_HERO_DRIFT_START, true)).toBe(0);
    expect(mobileHeroIndexDrift(400, heroBottom, false)).toBe(0);
  });

  it('writes the drift only on a phone that has not asked for reduced motion', () => {
    const queries = { mobile: true, reduce: false };
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: query.includes('max-width') ? queries.mobile : queries.reduce,
      addEventListener() {},
    }));

    const hero = document.createElement('header');
    hero.className = 'masthead';
    const index = document.createElement('div');
    index.className = 'library-index';
    hero.append(index);
    document.body.append(hero);

    let scroll = 0;
    vi.spyOn(window, 'scrollY', 'get').mockImplementation(() => scroll);
    hero.getBoundingClientRect = () => ({
      top: 80 - scroll,
      height: 520,
      bottom: 80 - scroll + 520,
      left: 0,
      right: 0,
      width: 0,
      x: 0,
      y: 80 - scroll,
      toJSON() {
        return {};
      },
    });

    scroll = 0;
    syncMobileHeroIndexDrift();
    expect(index.style.getPropertyValue('--index-drift')).toBe('');

    scroll = MOBILE_HERO_DRIFT_START + MOBILE_HERO_DRIFT_SPAN / 2;
    syncMobileHeroIndexDrift();
    expect(index.style.getPropertyValue('--index-drift')).toBe('0.5000');

    scroll = heroBottom;
    syncMobileHeroIndexDrift();
    expect(index.style.getPropertyValue('--index-drift')).toBe('1.0000');

    queries.reduce = true;
    syncMobileHeroIndexDrift();
    expect(index.style.getPropertyValue('--index-drift')).toBe('');

    queries.reduce = false;
    queries.mobile = false;
    syncMobileHeroIndexDrift();
    expect(index.style.getPropertyValue('--index-drift')).toBe('');
  });
});
