import { afterEach, describe, expect, it, vi } from 'vitest';
import { copyFor, getCopy } from '../src/content/copy';
import {
  getLocale,
  hrefForLocale,
  localeFromPathname,
} from '../src/content/locale';
import {
  catalogFor,
  findBook,
  getCatalog,
  validate,
} from '../src/library/catalog';
import { coordinateFields, coordinateFor, formatCoordinate } from '../src/library/coordinates';
import type { Book } from '../src/library/model';
import * as locale from '../src/content/locale';

const english = catalogFor('en');
const spanish = catalogFor('es');

function structure(book: Book) {
  return {
    id: book.id,
    rootId: book.rootId,
    kind: book.kind,
    icon: book.icon,
    neighbors: book.neighbors.map((edge) => edge.targetBookId),
  };
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('the locale', () => {
  it('defaults to English when no browser path exists', () => {
    expect(getLocale()).toBe('en');
    expect(getCopy()).toBe(copyFor('en'));
    expect(getCatalog()).toBe(english);
  });

  it('selects English at the root path', () => {
    expect(localeFromPathname('/')).toBe('en');
    expect(localeFromPathname('')).toBe('en');
    expect(catalogFor(localeFromPathname('/'))).toBe(english);
  });

  it('selects Spanish at /es/', () => {
    expect(localeFromPathname('/es/')).toBe('es');
    expect(localeFromPathname('/es')).toBe('es');
    expect(catalogFor(localeFromPathname('/es/'))).toBe(spanish);
  });
});

describe('the two catalogs', () => {
  it('contain the same eighty-one IDs in the same order', () => {
    expect(english.books.map((book) => book.id)).toEqual(spanish.books.map((book) => book.id));
    expect(english.books).toHaveLength(81);
    expect(spanish.books).toHaveLength(81);
  });

  it('keep structural fields identical across languages', () => {
    expect(english.schemaVersion).toBe(spanish.schemaVersion);
    expect(english.wall).toEqual(spanish.wall);
    expect(english.books.map(structure)).toEqual(spanish.books.map(structure));
  });

  it('both pass the catalog validator', () => {
    expect(validate(english)).toBe(english);
    expect(validate(spanish)).toBe(spanish);
  });

  it('selects the Spanish catalog in Spanish mode', () => {
    vi.spyOn(locale, 'getLocale').mockReturnValue('es');
    expect(getCatalog()).toBe(spanish);
    expect(findBook('b0007')?.title).toBe('La hora exacta');
  });

  it('keeps the English catalog selected in English mode', () => {
    expect(getCatalog()).toBe(english);
    expect(findBook('b0007')?.title).toBe('The Exact Time');
    expect(catalogFor('en').books.find((book) => book.id === 'b0007')?.title).toBe('The Exact Time');
  });
});

describe('language-switch URLs', () => {
  it('preserve the current hash route', () => {
    expect(hrefForLocale('es', '#book=b0053')).toBe('/es/#book=b0053');
    expect(hrefForLocale('en', '#book=b0053')).toBe('/#book=b0053');
    expect(hrefForLocale('en', '#shelf=ABC-2-4')).toBe('/#shelf=ABC-2-4');
    expect(hrefForLocale('es', '#shelf=ABC-2-4')).toBe('/es/#shelf=ABC-2-4');
    expect(hrefForLocale('en', '#volume=ABC-2-4-17')).toBe('/#volume=ABC-2-4-17');
    expect(hrefForLocale('es', '')).toBe('/es/');
    expect(hrefForLocale('en', '#')).toBe('/');
  });
});

describe('Spanish UI copy', () => {
  it('contains Spanish rather than English fallback', () => {
    const es = copyFor('es');
    const en = copyFor('en');
    expect(es.language).toBe('Idioma');
    expect(es.openThisLife).toBe('ABRIR ESTA VIDA');
    expect(es.backToWall).toBe('Muro de vidas');
    expect(es.nearbyVolumes).toBe('LIBROS CERCANOS');
    expect(es.coordHexagon).toBe('Hexágono');
    expect(es.coordWall).toBe('Pared');
    expect(es.coordShelf).toBe('Estantería');
    expect(es.coordVolume).toBe('Volumen');
    expect(es.days[0]).toBe('domingo');
    expect(es.consulted).toContain('Consultado');
    expect(es.heading).toContain('Biblioteca de Babel');
    expect(es.heading).not.toBe(en.heading);
    expect(es.openThisLife).not.toBe(en.openThisLife);
    expect(es.found).not.toBe(en.found);
    expect(es.locatorHeading).not.toBe(en.locatorHeading);
    expect(Object.keys(es).sort()).toEqual(Object.keys(en).sort());
    expect('intervalAria' in en).toBe(false);
    expect('intervalYears' in en).toBe(false);
    expect('lookInside' in en).toBe(false);
  });
});

describe('coordinates across locales', () => {
  it('keep the same values while translating only the labels', () => {
    const address = coordinateFor('b0003');
    expect(address).toEqual({
      hexagon: '7CLC5G73UUZ',
      wall: 4,
      shelf: 2,
      volume: 15,
    });
    expect(formatCoordinate(address)).toBe(
      'Hexagon 7CLC5G73UUZ · Wall 4 · Shelf 2 · Volume 15',
    );

    vi.spyOn(locale, 'getLocale').mockReturnValue('es');
    expect(coordinateFor('b0003')).toEqual(address);
    expect(coordinateFields(address).map((field) => field.value)).toEqual([
      '7CLC5G73UUZ',
      '4',
      '2',
      '15',
    ]);
    expect(formatCoordinate(address)).toBe(
      'Hexágono 7CLC5G73UUZ · Pared 4 · Estantería 2 · Volumen 15',
    );
  });
});
