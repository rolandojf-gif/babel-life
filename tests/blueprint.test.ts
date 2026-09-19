/**
 * The blueprint's frozen editorial map against the shipped catalog. Section 4 is
 * the source of truth for what the Library contains; the catalog is its
 * printing. Nothing but this test keeps the two from drifting apart in silence.
 */

import { describe, expect, it } from 'vitest';
import blueprint from '../docs/BLUEPRINT.md?raw';
import { catalog, rootBooks } from '../src/library/catalog';

function lines(label: string): string[] {
  return [...blueprint.matchAll(new RegExp(`^${label}: (.+)$`, 'gm'))].map((match) =>
    (match[1] ?? '').trim(),
  );
}

const mapTitles = lines('TITLE');
const mapHooks = lines('WALL HOOK');
const mapVariations = lines('NEARBY [AB]');

describe('the frozen editorial map', () => {
  it('names twenty-four lives and forty-eight variations', () => {
    expect(mapTitles).toHaveLength(24);
    expect(mapHooks).toHaveLength(24);
    expect(mapVariations).toHaveLength(48);
  });

  it('titles the lives exactly as the wall orders them', () => {
    expect(mapTitles).toEqual(rootBooks.map((book) => book.title));
  });

  it('gives them the premises the wall shows', () => {
    expect(mapHooks).toEqual(rootBooks.map((book) => book.hook));
  });

  it('accounts for every volume the catalog prints', () => {
    expect(mapTitles.length + mapVariations.length).toBe(catalog.books.length);
  });
});

describe('the blueprint prose', () => {
  it('states the inventory the catalog actually holds', () => {
    const numbers = catalog.books.map((book) => Number(book.id.slice(1)));
    const first = 'b' + String(Math.min(...numbers)).padStart(4, '0');
    const last = 'b' + String(Math.max(...numbers)).padStart(4, '0');

    expect(blueprint).toContain('**Total:** ' + String(catalog.books.length) + ' volumes');
    expect(blueprint).toContain('`' + first + '`');
    expect(blueprint).toContain('`' + last + '`');
    expect(blueprint).toContain('**24 ROOT LIVES**');
    expect(blueprint).toContain('**48 NEARBY VOLUMES**');
  });

  it('states the schema version the catalog carries', () => {
    expect(blueprint).toContain(`schemaVersion: ${String(catalog.schemaVersion)}`);
  });
});
