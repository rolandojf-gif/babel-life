/**
 * The load-time validator, exercised against catalogs built to be wrong. The
 * shipped catalog proves the happy path; these prove the refusals, which is the
 * half that only ever runs when someone is about to ship a broken edition.
 */

import { describe, expect, it } from 'vitest';
import { validate } from '../src/library/catalog';
import type { Book, Catalog, NearbyBook, RootBook } from '../src/library/model';

function root(id: string): RootBook {
  return {
    id,
    rootId: id,
    kind: 'root',
    icon: 'clock',
    headline: 'A life',
    title: 'A Life',
    hook: 'you live it once.',
    passage: ['You live it once.'],
    aftertaste: 'Once.',
    neighbors: [],
  };
}

function nearby(id: string, rootId: string): NearbyBook {
  return {
    id,
    rootId,
    kind: 'nearby',
    icon: 'clock',
    headline: 'A variation',
    title: `A Variation ${id}`,
    passage: ['You live it differently.'],
    aftertaste: 'Differently.',
    neighbors: [],
  };
}

/** One root, its two variations, and edges inside the family. */
function soundCatalog(): Catalog {
  const a = root('b0001');
  const b = nearby('b0002', 'b0001');
  const c = nearby('b0003', 'b0001');
  a.neighbors = [
    { targetBookId: b.id, difference: 'The cup moves left.' },
    { targetBookId: c.id, difference: 'The cup moves right.' },
  ];
  b.neighbors = [
    { targetBookId: a.id, difference: 'The cup stays.' },
    { targetBookId: c.id, difference: 'The cup moves right.' },
  ];
  c.neighbors = [
    { targetBookId: a.id, difference: 'The cup stays.' },
    { targetBookId: b.id, difference: 'The cup moves left.' },
  ];
  return { schemaVersion: 3, wall: { first: [a.id], second: [] }, books: [a, b, c] };
}

/** A copy of the sound catalog with one thing broken in it. */
function broken(breakIt: (data: Catalog, books: Book[]) => void): Catalog {
  const data = structuredClone(soundCatalog());
  breakIt(data, data.books);
  return data;
}

describe('a sound catalog', () => {
  it('passes, and is handed back unchanged', () => {
    const data = soundCatalog();
    expect(validate(data)).toBe(data);
  });
});

describe('the validator refuses', () => {
  it('a schema it does not know', () => {
    expect(() => validate(broken((data) => { data.schemaVersion = 2; }))).toThrow(
      /schemaVersion/,
    );
  });

  it('an accession number of the wrong shape', () => {
    expect(() => validate(broken((_, books) => { books[0]!.id = 'book-1'; }))).toThrow(
      /Invalid book id/,
    );
  });

  it('two volumes claiming one identity', () => {
    expect(() => validate(broken((_, books) => { books[2]!.id = books[1]!.id; }))).toThrow(
      /Duplicate book id/,
    );
  });

  it('a volume with nothing to read', () => {
    expect(() => validate(broken((_, books) => { books[1]!.passage = []; }))).toThrow(
      /Empty paragraph/,
    );
    expect(() => validate(broken((_, books) => { books[1]!.passage = ['  ']; }))).toThrow(
      /Empty paragraph/,
    );
  });

  it('a volume missing its title, headline or aftertaste', () => {
    expect(() => validate(broken((_, books) => { books[1]!.title = ''; }))).toThrow(/no title/);
    expect(() => validate(broken((_, books) => { books[1]!.headline = ' '; }))).toThrow(
      /no headline/,
    );
    expect(() => validate(broken((_, books) => { books[1]!.aftertaste = ''; }))).toThrow(
      /no aftertaste/,
    );
  });

  it('a life on the wall with no premise', () => {
    expect(() =>
      validate(broken((_, books) => { (books[0] as RootBook).hook = ''; })),
    ).toThrow(/no wall hook/);
  });

  it('a root that is not its own root', () => {
    expect(() => validate(broken((_, books) => { books[0]!.rootId = 'b0002'; }))).toThrow(
      /not its own root/,
    );
  });

  it('a variation that claims to be a life of its own', () => {
    expect(() => validate(broken((_, books) => { books[1]!.rootId = books[1]!.id; }))).toThrow(
      /its own root/,
    );
  });

  it('a variation belonging to a life that is not there', () => {
    expect(() =>
      validate(
        broken((data, books) => {
          const orphan = nearby('b0004', 'b0099');
          orphan.neighbors = [
            { targetBookId: books[0]!.id, difference: 'The cup stays.' },
            { targetBookId: books[1]!.id, difference: 'The cup moves left.' },
          ];
          data.books.push(orphan);
        }),
      ),
    ).toThrow(/no root life/);
  });

  it('the wrong number of nearby volumes', () => {
    expect(() => validate(broken((_, books) => { books[0]!.neighbors.pop(); }))).toThrow(
      /offers 1 nearby volumes/,
    );
  });

  it('an edge to a volume that does not exist', () => {
    expect(() =>
      validate(broken((_, books) => { books[0]!.neighbors[0]!.targetBookId = 'b0099'; })),
    ).toThrow(/links to unknown/);
  });

  it('a volume that leads to itself', () => {
    expect(() =>
      validate(broken((_, books) => { books[0]!.neighbors[0]!.targetBookId = books[0]!.id; })),
    ).toThrow(/links to itself/);
  });

  it('the same destination offered twice', () => {
    expect(() =>
      validate(
        broken((_, books) => {
          books[0]!.neighbors[0]!.targetBookId = books[0]!.neighbors[1]!.targetBookId;
        }),
      ),
    ).toThrow(/repeats/);
  });

  it('an edge that leaves its own life', () => {
    expect(() =>
      validate(
        broken((data, books) => {
          // A second life whose variations are somebody else's.
          const other = root('b0004');
          other.neighbors = [
            { targetBookId: books[1]!.id, difference: 'Another life entirely.' },
            { targetBookId: books[2]!.id, difference: 'Another life entirely.' },
          ];
          data.books.push(other);
          data.wall.second.push(other.id);
        }),
      ),
    ).toThrow(/links outside its root life/);
  });

  it('an edge that does not say what differs', () => {
    expect(() =>
      validate(broken((_, books) => { books[0]!.neighbors[0]!.difference = '   '; })),
    ).toThrow(/unlabelled edge/);
  });

  it('a life carrying a third variation', () => {
    expect(() =>
      validate(
        broken((data, books) => {
          // Every edge stays sound; there is simply one variation too many.
          const extra = nearby('b0004', 'b0001');
          extra.neighbors = [
            { targetBookId: books[0]!.id, difference: 'The cup stays.' },
            { targetBookId: books[1]!.id, difference: 'The cup moves left.' },
          ];
          data.books.push(extra);
        }),
      ),
    ).toThrow(/has 3 nearby volumes/);
  });

  it('a wall that is not the set of lives', () => {
    expect(() => validate(broken((data) => { data.wall.second.push('b0001'); }))).toThrow(
      /appears twice on the wall/,
    );
    expect(() => validate(broken((data) => { data.wall.first = []; }))).toThrow(
      /not the set of root lives/,
    );
    expect(() => validate(broken((data) => { data.wall.first = ['b0099']; }))).toThrow(
      /unknown book/,
    );
    expect(() => validate(broken((data) => { data.wall.first = ['b0002']; }))).toThrow(
      /lists nearby volume/,
    );
  });
});
