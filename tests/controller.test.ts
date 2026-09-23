/**
 * @vitest-environment jsdom
 *
 * The controller reads the location and decides what the shell renders. These
 * cases are the routing table in section 2 of the blueprint, stated as
 * behaviour: a legible address opens a book, an illegible one is not an error,
 * and an address outside the space is.
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createController } from '../src/library/controller';
import { accessionAt, coordinateFor, positionOf, shelfOf } from '../src/library/coordinates';
import { catalog, findBook, wallBooks } from '../src/library/catalog';
import * as locale from '../src/content/locale';
import { hashForAddress, hashForShelf } from '../src/library/routing';
import type { AppState, RenderHint } from '../src/library/model';

const known = catalog.books[0]!;
const address = coordinateFor(known.id);

/** A real address on the same shelf, holding nothing this edition can print. */
const illegible = { ...address, volume: address.volume === 1 ? 2 : 1 };

function mount(hash: string) {
  window.location.hash = hash;
  const renders: { state: AppState; hint: RenderHint }[] = [];
  const render = vi.fn((state: AppState, hint: RenderHint) => {
    renders.push({ state: structuredClone(state), hint });
  });
  const controller = createController(render);
  controller.start();
  return { controller, render, renders };
}

/** A deliberate navigation, the way a link in the page makes one. */
function navigate(hash: string): void {
  window.location.hash = hash;
  window.dispatchEvent(new window.HashChangeEvent('hashchange'));
}

beforeEach(() => {
  window.location.hash = '';
});

describe('entering the Library', () => {
  it('opens on the wall', () => {
    const { controller, render } = mount('');
    expect(controller.state.view).toBe('wall');
    expect(controller.state.wallSelection).toBe('first');
    expect(render).toHaveBeenCalledTimes(1);
    expect(render.mock.calls[0]?.[1]).toEqual({ focus: 'none' });
  });

  it('opens a volume named by its accession number', () => {
    const { controller } = mount(`#book=${known.id}`);
    expect(controller.state.view).toBe('book');
    expect(controller.state.currentBookId).toBe(known.id);
    expect(controller.state.address).toBeNull();
  });

  it('refuses an accession number this edition does not print', () => {
    const { controller } = mount('#book=b9999');
    expect(controller.state.view).toBe('invalidAddress');
    expect(controller.state.currentBookId).toBeNull();
  });
});

describe('walking by address', () => {
  it('opens the shelf a volume stands on', () => {
    const shelf = shelfOf(address);
    const { controller } = mount(hashForShelf(shelf));
    expect(controller.state.view).toBe('shelf');
    expect(controller.state.shelf).toEqual(shelf);
  });

  it('opens the book when the address holds a legible volume', () => {
    const { controller } = mount(hashForAddress(address));
    expect(controller.state.view).toBe('book');
    expect(controller.state.currentBookId).toBe(known.id);
    expect(controller.state.address).toEqual(address);
    expect(controller.state.shelf).toEqual(shelfOf(address));
  });

  it('shows the address itself when nothing there can be read', () => {
    const position = positionOf(illegible);
    expect(position).toBeDefined();
    const accession = accessionAt(position ?? 0n);
    expect(accession === undefined || findBook(accession) === undefined).toBe(true);

    const { controller } = mount(hashForAddress(illegible));
    expect(controller.state.view).toBe('address');
    expect(controller.state.currentBookId).toBeNull();
    expect(controller.state.address).toEqual(illegible);
  });

  it('refuses an address outside the space', () => {
    expect(mount('#shelf=ZZZZZZZZZZZZ-1-1').controller.state.view).toBe('invalidAddress');
    expect(mount('#volume=ZZZZZZZZZZZZ-1-1-1').controller.state.view).toBe('invalidAddress');
    expect(mount(`#volume=${address.hexagon}-9-1-1`).controller.state.view).toBe('invalidAddress');
    expect(mount('#somewhere-else').controller.state.view).toBe('invalidAddress');
  });
});

describe('moving between views', () => {
  it('follows a link and asks for focus to move', () => {
    const { controller, renders } = mount('');
    navigate(`#book=${known.id}`);
    expect(controller.state.view).toBe('book');
    expect(controller.state.currentBookId).toBe(known.id);
    expect(renders.at(-1)?.hint).toEqual({ focus: 'view' });
  });

  it('clears what the previous view was looking at', () => {
    const { controller } = mount(hashForAddress(address));
    expect(controller.state.address).toEqual(address);
    navigate('');
    expect(controller.state.view).toBe('wall');
    expect(controller.state.address).toBeNull();
    expect(controller.state.shelf).toBeNull();
    expect(controller.state.currentBookId).toBeNull();
  });

  it('remembers the book the visitor last closed, nearby books included', () => {
    const nearby = catalog.books.find((book) => book.kind === 'nearby')!;
    const { controller } = mount(`#book=${known.id}`);
    expect(controller.state.lastBookId).toBeNull();
    navigate(`#book=${nearby.id}`);
    expect(controller.state.lastBookId).toBe(known.id);
    navigate('');
    expect(controller.state.view).toBe('wall');
    expect(controller.state.currentBookId).toBeNull();
    expect(controller.state.lastBookId).toBe(nearby.id);
  });

  it('does not render again for the location it is already showing', () => {
    const { render } = mount(`#book=${known.id}`);
    expect(render).toHaveBeenCalledTimes(1);
    window.dispatchEvent(new window.HashChangeEvent('hashchange'));
    window.dispatchEvent(new window.PopStateEvent('popstate'));
    expect(render).toHaveBeenCalledTimes(1);
  });
});

describe('the wall selection', () => {
  it('swaps to the stranger remainder, then to all of them', () => {
    const { controller, render, renders } = mount('');
    controller.showSomethingStranger();
    expect(controller.state.wallSelection).toBe('second');
    expect(renders.at(-1)?.hint).toEqual({ focus: 'wallGrid', announce: 'Fifteen other lives.' });

    controller.showAll();
    expect(controller.state.wallSelection).toBe('all');
    expect(renders.at(-1)?.hint).toEqual({
      focus: 'wallAppended',
      announce: 'All twenty-seven lives.',
    });
    expect(render).toHaveBeenCalledTimes(3);
  });

  it('announces the number of lives the stranger control actually adds', () => {
    const { controller, renders } = mount('');
    controller.showSomethingStranger();
    const shown = wallBooks('second', controller.state.wallSeed);
    expect(shown).toHaveLength(15);
    expect(renders.at(-1)?.hint.announce).toBe('Fifteen other lives.');
  });

  it('announces the same count in the Spanish edition', () => {
    vi.spyOn(locale, 'getLocale').mockReturnValue('es');
    const { controller, renders } = mount('');
    controller.showSomethingStranger();
    expect(renders.at(-1)?.hint.announce).toBe('Quince vidas más.');
    vi.restoreAllMocks();
  });

  it('is left alone when it is already what was asked for', () => {
    const { controller, render } = mount('');
    controller.showAll();
    controller.showAll();
    expect(render).toHaveBeenCalledTimes(2);
  });

  it('survives opening a book and coming back', () => {
    const { controller } = mount('');
    controller.showAll();
    navigate(`#book=${known.id}`);
    navigate('');
    expect(controller.state.view).toBe('wall');
    expect(controller.state.wallSelection).toBe('all');
  });
});
