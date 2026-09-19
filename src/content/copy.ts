/**
 * Every visitor-facing string in phase 1. Book passages live in the catalog;
 * these are the labels, invitations and disclosures around them.
 */
export const copy = {
  openingLine: 'Somewhere in the Library, there is a book in which…',
  selectorLabel: 'A possibility',
  findTheBook: 'FIND THE BOOK',
  somethingStranger: 'SHOW ME SOMETHING STRANGER',
  passageLabel: 'A passage from the book.',
  bookExists: 'This book exists.',
  lookForAnotherBook: 'Look for another book',
  invalidAddress: 'This address is not in this edition.',
  enterTheLibrary: 'Enter the Library',
  attribution: 'After Jorge Luis Borges.',
  aboutHeading: 'About this Library',
  aboutBody:
    'This is a curated reading experience inspired by Borges. Its passages are authored, and its coordinates belong to this edition. It cannot identify anyone’s future.',
} as const;
