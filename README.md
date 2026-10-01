# Babel Life

> **Every writable life already exists somewhere in the Library.**

Babel Life is an independent literary web project inspired by Jorge Luis Borges’ *The Library of Babel*.  
Instead of imagining a library containing every possible book, it asks a different question:

**What if the Library also contained every possible life?**

Each book in Babel Life represents one complete possible life. Nearby books differ in one meaningful way: a relationship, an absence, a coincidence, a name, a choice, a circumstance, or another small change capable of requiring a different book.

[**Open Babel Life →**](https://babel-life.netlify.app/)

<p align="center">
  <img src="./public/og-image.png" alt="Babel Life — Every writable life already exists." width="720">
</p>

## The edition

The current edition contains **81 books across 27 narrative families**:

- **27 root books**
- **54 nearby books**
- English and Spanish editions
- deterministic Library coordinates
- navigable shelves and related lives
- an intentionally finite reading edition inside an effectively unbounded fictional Library

The project is designed as a literary experience rather than a conventional catalogue or content feed. The interface borrows from books, archives, reading rooms and physical shelves so that navigation feels like moving through a Library rather than browsing a database.

## How it works

A **root book** introduces one possible life.

Its two **nearby books** keep most of that life intact while changing one meaningful element. The point is not that one decision magically creates another universe. It is that, if every writable life exists in Babel, even a small difference is enough to require another book.

Coordinates, shelves and book relationships give those lives a place inside the Library.

## Principles

Babel Life is built around a few constraints:

- keep the literary idea stronger than the interface
- prefer ordinary human differences over dramatic twists
- treat each book as a complete life, not a short story gimmick
- avoid accounts, feeds, gamification and unnecessary product mechanics
- keep the experience calm, tactile and readable
- use technology to support the fiction, not become the subject of it

## Technology

Babel Life is deliberately lightweight:

- **TypeScript**
- **Vite**
- **Vitest**
- semantic HTML and CSS
- **Netlify** for continuous deployment

No application framework or backend is required for the current edition.

## Development

Install dependencies:

```bash
npm install
```

Run locally:

```bash
npm run dev
```

Run the full verification pipeline:

```bash
npm run verify
```

The verification command runs the TypeScript check, test suite and production build. Netlify uses the same command as its deploy gate.

## Project status

Babel Life is an evolving personal project. The current focus is editorial quality, narrative coherence, accessibility and refinement of the Library experience rather than feature growth.

## About the Borges connection

Babel Life is inspired by Jorge Luis Borges’ short story *The Library of Babel*, but it is **not an adaptation, official edition or reproduction of the story**.

The project is independent and is not affiliated with, endorsed by or published by the Borges estate or any publisher. No passage from Borges’ story is reproduced. The texts, narrative families, coordinates and interface of Babel Life belong to this project.

## Author

Created by **Rolando Fernández** in 2026.

[Visit Babel Life](https://babel-life.netlify.app/)
