import { copy as en } from './copy.en';
import { copy as es } from './copy.es';
import { getLocale, type Locale } from './locale';

/** Every visitor-facing string outside the catalog, in one language. */
export type Copy = {
  language: string;
  siteTitle: string;
  homeTitle: string;
  eyebrow: string;
  heading: string;
  dek: string;
  libraryScaleLabel: string;
  libraryScaleMantissa: string;
  libraryScaleSpokenMantissa: string;
  libraryScaleExponent: string;
  libraryScaleUnit: string;
  libraryScaleMeta: string;
  universeScaleLabel: string;
  universeScaleMantissa: string;
  universeScaleExponent: string;
  universeScaleUnit: string;
  /** Spoken form of a scale figure. `{mantissa}` already ends in the base ten. */
  scalePower: string;
  lede: string;
  cardEyebrow: string;
  openThisLife: string;
  somethingStranger: string;
  showAll: string;
  backToWall: string;
  found: string;
  alreadyHere: string;
  nearbyVolumes: string;
  openNearby: string;
  shelfEyebrow: string;
  openThisShelf: string;
  shelfHolds: readonly [string, string, string, string, string];
  notLegible: string;
  volumeLabel: string;
  previousShelf: string;
  nextShelf: string;
  previousVolume: string;
  nextVolume: string;
  noLegibleVolume: string;
  noLegibleNote: string;
  browseShelf: string;
  pageOf: string;
  pageDescription: string;
  consulted: string;
  days: readonly [string, string, string, string, string, string, string];
  anotherLife: string;
  invalidAddress: string;
  invalidAddressNote: string;
  enterTheLibrary: string;
  attribution: string;
  copyright: string;
  aboutHeading: string;
  aboutBody: string;
  legalHeading: string;
  legalBody: string;
  legalOwner: string;
  /**
   * `{count}` is the number of cards on the wall and `{total}` the number of
   * roots in the catalogue, both spelled from `countWords`.
   */
  wallCountPartial: string;
  /** `{total}` is the number of roots in the catalogue, spelled from `countWords`. */
  wallCountAll: string;
  /** The edition's case beside the masthead: its label, then what it holds. */
  editionLabel: string;
  /** `{count}` is every readable book in this edition. */
  editionBooks: string;
  /** `{count}` is the root books the wall can show. */
  editionOnWall: string;
  /** Sentence-initial number words, indexed by the number they spell. */
  countWords: readonly string[];
  /** `{count}` is the number of lives the stranger control adds, from `countWords`. */
  announceStranger: string;
  announceAll: string;
  coordHexagon: string;
  coordWall: string;
  coordShelf: string;
  coordVolume: string;
  cardAddress: string;
  shelfVolumesLabel: string;
  locatorHeading: string;
  locatorHere: string;
  locatorAlsoLegible: string;
  locatorSolo: string;
};

export function copyFor(locale: Locale): Copy {
  return locale === 'es' ? es : en;
}

export function getCopy(): Copy {
  return copyFor(getLocale());
}

/**
 * Live bundle for the active locale. Views keep importing `copy`; they do not
 * choose a language themselves.
 */
export const copy: Copy = new Proxy(en, {
  get(_target, property) {
    return Reflect.get(getCopy(), property);
  },
}) as Copy;

/** Fill `{name}` placeholders. Unknown names are left in the string. */
export function fill(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (token, name: string) => vars[name] ?? token);
}

/** How many of the thirty-two volumes on a shelf this edition can print. */
export function formatShelfHolds(legible: number): string {
  const lines = getCopy().shelfHolds;
  return lines[legible] ?? lines[0] ?? '';
}
