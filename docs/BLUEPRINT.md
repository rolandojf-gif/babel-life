# Babel Life — System Blueprint & Content Architecture

This document is the engineering and editorial source of truth for Babel Life.
`tests/blueprint.test.ts` holds it to the shipped catalog, so a title edited in
one place and not the other fails the suite. Sections 2 and 6 describe what
exists today; section 5 describes what does not.

## 1. Product Thesis & Epistemic Grounding

### Core Thesis
Babel Life is an intimate reading experience in which visitors discover books describing writable versions of a human life.

Its central interaction is finding a nearby book: one detail changes, and another complete life stands on the shelf. The Library’s scale is felt through precise repetition and subtle difference.

The visitor chooses what to look for, never what happens to a simulated person. They find books that were already shelved in the Library; they do not generate futures, simulate outcomes, or configure a biography.

### The Epistemic Rule
**Textual existence does not imply reality.**

The Library of Babel contains every finite writable text. Therefore, it contains:
*   possible accounts,
*   impossible accounts,
*   absurd and contradictory accounts,
*   supernatural events,
*   accounts that match the actual future,
*   and infinitely many accounts that get it wrong.

**Physical realism is NOT a requirement of Babel Life.** The Library does not conform to the laws of physics, biology, or probability; it conforms only to the combinatorics of language.

The restriction is strictly epistemic:
> **The interface must never claim that any book is true, predictive, probable, or the visitor’s actual reality.**

Being on a shelf is not evidence. The Library contains the contradiction as well.

---

## 2. Implemented Architecture & User Experience (IMPLEMENTED NOW)

The application in `src/` is a static, zero-backend, client-side web experience written in vanilla TypeScript, Vite, and modern CSS. There are no frontend frameworks, databases, external APIs, user accounts, cookies, form submissions, or AI generation pipelines. One third-party script is loaded: the Cloudflare Web Analytics beacon (section 2, *Publication*).

### Two Editions, One Library (`content/locale.ts`, `content/copy.ts`)
Babel Life ships in **English and Spanish**, as two editions of the same Library rather than a translation layer over one.
*   **The URL is the only source of truth for language.** `/` is English, `/es/` is Spanish; the browser's own language setting is never consulted (`localeFromPathname`).
*   **Two real HTML entry documents**, `index.html` and `es/index.html`, both Vite build inputs. Each carries its own `<title>`, description, canonical URL, Open Graph and Twitter cards, JSON-LD and `<noscript>` fallback.
*   **Two catalogs.** `catalog.json` and `catalog.es.json` are separate editions, aligned accession by accession and checked at load time (`assertAligned`): same length, same IDs, same order. A hash route therefore means the same volume in both languages.
*   **The Wall has a name in each edition:** *Wall of Lives* in English, *Muro de vidas* in Spanish. *Wall* / *Pared* is kept for the physical wall of an address (1–4).
*   **Every visitor-facing string outside the catalog** lives in `copy.en.ts` / `copy.es.ts` behind one `Copy` type, so a string added to one edition and not the other is a type error.
*   **The language switcher (`LanguageSwitcher.ts`) keeps the hash**, so switching language on an open book opens the same volume in the other edition rather than returning to the wall.

### The Wall of Lives (`WallOfLives.ts`)
The site entry is the **Wall of Lives**, not a scenario selector, dropdown, or form.
*   **Masthead:**
    *   Eyebrow: `BABEL LIFE`
    *   Heading: `Somewhere in the Library of Babel, every writable life already exists.`
    *   Dek: the premise in two sentences, followed by the scale figures.
*   **The scale figures (`masthead__scale`):** the Library set against the observable universe — `≈ 1.96 × 10^1,834,097 books` beside `≈ 10^80 atoms`, with `25 symbols · 1,312,000 positions` beneath. These are Borges' own figures for one volume of the Library. Each figure carries a small etched mark and may surface under a fine pointer, but the figures are not controls: they take no tab stop, and hovering reveals nothing that is not already printed.
*   **The edition index (`libraryIndex.ts`):** the case of this edition beside the masthead, labelled as such, with one spine for every readable book, root and nearby alike. The Wall still shows only root books; the index is where the whole edition is visible at once. Its books and its counts are derived from the catalogue, never written in as literals, so a new family appears in it without further edits. Families stand together, and roots stay distinguishable from their nearby books, which remain books. The grouping is editorial: it never implies that these books are neighbours in the Library, and the one coordinate printed beneath is the real Library address of the book the locator stands on. The locator may stand on a root or a nearby book. It rests on the book the visitor last closed, or else on the first card of this visit's deal, and follows a hovered or keyboard-focused card. The drawing is `aria-hidden`; the label and the coordinate are text.
*   **Card Grid (`BookCard.ts`):**
    *   **Premise-First Presentation:** the shared eyebrow `THERE IS ALREADY A BOOK IN WHICH…` is shown once above the grid; each card carries it as visually hidden text so the link's accessible name is a complete sentence. The card itself shows the hook that completes it.
    *   **Titles Excluded from Wall:** poetic and literary titles belong inside the book, never on the Wall card. The visitor enters through the curiosity of the premise alone.
    *   Every card carries its book's motif (see *Motifs* below) and a short address line, `HEXAGON [ID] · VOLUME [N]`.
    *   **Action:** `OPEN THIS LIFE →`.
    *   **Featured slots.** Display positions 1, 4, 11, 16 and 21 are set larger, with a larger motif. Emphasis follows position in the deal, never the identity of the book.
*   **Card Batching & Navigation:**
    *   Initial load displays **12 cards**. Counter: `Twelve of twenty-seven books.`
    *   Secondary Action: `SHOW ME SOMETHING STRANGER` swaps the grid to the remaining 15 cards.
    *   Quiet Action: `SHOW ALL 27` appends them below the opening twelve.
    *   No disabled button states: controls disappear cleanly when their action is no longer applicable.
    *   **Counts are derived, never written in.** The visible count, its total and the announcement of `SHOW ME SOMETHING STRANGER` are spelled from the deal and the catalogue (`TOTAL_ROOTS`, each edition's `countWords`); no template carries a number. The rule covers the wall's counters only. The label `SHOW ALL 27`, its announcement and the presentation in the two entry documents are narrative copy and are edited by hand if the number of roots changes.
*   **The order of the deal (`catalog.ts` `wallDeal`, `shuffle.ts`):**
    *   **Five editorial anchors are pinned** (`PINNED_ROOT_IDS`) and always open the wall, in that order. They are chosen and ordered as a progressive entry: the visitor's own exact life, then the lives of those before them, then every living person with whom a life might have been shared, then the darkest permutation, and last the smallest spatial differences of an ordinary day. Which books open the Library, and in what order, is an editorial decision rather than a shuffle's, and changes only as one.
    *   The other twenty-two root books are shuffled as **one pool**. Seven of them complete the opening twelve; the remaining fifteen become `SHOW ME SOMETHING STRANGER`. Opening out to all twenty-seven therefore never moves a card the visitor has already seen.
    *   One seed is drawn per visit and held in memory by the controller. Every redraw of the wall — after opening a life, after browser Back, after `SHOW ALL 27` — deals the same order, so nothing moves under the visitor's hands.
    *   Nothing is stored: a reload is a new visit and deals again. The seed is an ordinary `Math.random()` draw, since card order is not a secret, and it runs through the same splitmix64 scramble (`scramble.ts`) that writes the pages at unreadable addresses.

### The Book View (`BookView.ts`)
A discovered volume is presented as a **spread**: a left leaf carrying the discovery marker, the shelf locator, the consultation note and, beneath it, the book's motif as a plate; the narrative in the centre; and the shelf itself along the right.
*   **Navigation:** top backlink `← Wall of Lives`.
*   **Discovery Marker:** `YOU FOUND THE BOOK`.
*   **Shelf Locator (`shelfLocator.ts`):** the thirty-two positions of this shelf drawn as upright marks with the current volume picked out, `VOLUME [N] · YOU ARE HERE` beneath it, and a line naming the other legible volume on the shelf or saying there is none.
*   **Literary Title:** the book's formal title (`h1.book__title`), read in full here. The Wall withholds it entirely; a shelf shows it only as a spine.
*   **Archival Assertion:** quiet line: `This book was already here.`
*   **Consultation Note:** the Library's note of this reading: `Consulted at HH:MM on a <weekday>.`, taken from the visitor's own device clock and marked up as a `<time>` element. It is a reading-room record of the consultation, never a claim about the reader: no identity, no history, no inference, nothing stored, nothing transmitted. It is the only element of the page that differs between two readings of the same volume; title, passage, aftertaste and address never do.
*   **Narrative Passage:** the authored account, set with a drop capital and split into structured paragraphs. Bare clock timestamps are styled as typographic margin stamps.
*   **Aftertaste:** a single, restrained closing resonance beneath the passage (`book.aftertaste`).
*   **Embedded Shelf (`shelfListing.ts`):** the whole shelf, thirty-two positions, each showing either the spine of a legible volume or `illegible`, with the current volume marked. The book stands inside its shelving rather than alone.
*   **Nearby Books Section (`NearbyVolumes.ts`):**
    *   Heading: `NEARBY BOOKS`.
    *   Exactly two adjacent books, enforced at load time by the catalog validator.
    *   Every link states the exact difference from the current book (`nearby__difference`) before the destination headline and `OPEN →`. What waits there is another complete life, not an annotation on this one.
*   **Shelf Walk (`shelfwalk`):** `← PREVIOUS VOLUME`, `BROWSE THIS SHELF`, `NEXT VOLUME →`. These address the Library by position rather than by accession number, so they lead into the adjacent addresses whatever stands there. Nearby books are adjacency in wording; the shelf walk is adjacency on the shelf. The two are deliberately unrelated.
*   **Continuation Actions:**
    *   `SHOW ME ANOTHER LIFE`: deterministically advances to the next root book in the canonical wall order, cycling continuously without repetition and never landing inside the narrative family just read.
    *   `← Wall of Lives`: returns directly to the wall.

### Motifs (`illustrations.ts`, `motifs.ts`)
Every book, root and nearby alike, carries a drawn motif: on its Wall card if it is a root, and as the plate on the book's left leaf. Motifs are decorative and hidden from assistive technology.
*   **A motif says something about its own story.** Every root has a motif of its own. A nearby book's motif also comes from its own story, and may be its root's when the story keeps the same object. A generic symbol repeated without meaning does not earn its place; a motif is replaced only when it is generic, inherited from an older story or unrelated to the premise, and always in the same visual language.
*   **One motif per book across editions.** The catalogue's `icon` field is the same in English and Spanish.
*   **One hand.** Every motif is drawn through the same charcoal filter, in charcoal ink.
*   **Sanguine carries meaning, never decoration.** On a root it marks the point of contingency: the detail on which the life could have gone otherwise, the one its nearby books move. On a nearby book it marks what changed from its root. A root never repeats the stroke of one of its nearby books. A nearby book whose change cannot be drawn, or whose drawing shows what stays, is left wholly in charcoal. Motifs are not tinted for effect.
*   The accent of each book lives beside the drawings (`ACCENTS`), not in the catalogues.

### Atmosphere (`atmosphere.ts`, `motion.ts`)
A reading-room atmosphere is layered over the page and is **entirely decorative**: a fixed lamp glow and vignette, ten drifting motes of dust, scroll-driven reveals, and a slow pointer tilt with a travelling sheen on the wall cards. Every one of them is skipped under `prefers-reduced-motion`, and the tilt is skipped on touch pointers. Content is fully legible with or without any of it.

### The Unreadable Volumes (`pages.ts`, `AddressView.ts`)
At an address holding nothing this edition can print, the visitor is not told the shelf is empty. **The volume opens directly on an excerpt of its page**; there is no control to press and nothing to ask for.
*   **Twenty-five orthographic symbols**, as the story has them: twenty-two letters, the space, the comma and the period. The twenty-two are the classical Latin alphabet without J, U, W or Z. The story names none of them; this is an editorial choice of this edition, frozen like the coordinate display.
*   **Canonical book mathematics.** A physical volume in the Library consists of 410 pages, 40 lines per page, and 80 symbol positions per line, totaling 3,200 positions per page and 1,312,000 positions per volume. Across the 25-symbol alphabet, this defines the Library scale of $25^{1,312,000} \approx 1.96 \times 10^{1,834,097}$ possible books.
*   **Visible excerpt.** The application renders a deterministic 1,280-symbol excerpt (`VISIBLE_EXCERPT_LENGTH`, styled as 40 lines of 32 symbols echoing shelf geometry) of the page rather than all 3,200 symbols. This presentation choice avoids excessive vertical bulk on screen while preserving the visual density and rhythm of an unreadable page; it is a display window and does not alter the canonical physical page size.
*   **Fixed for its address.** Excerpt symbols are drawn by splitmix64 seeded with the address's own 64-bit position: the same excerpt on every device, in every session, for as long as the address exists. No clock, no randomness, no storage, and nothing about the reader anywhere in it.
*   **The excerpt is not a layout variable.** Its length is never changed to fit a screen. On a narrow screen the sheet keeps its proportions and shows what fits, fading its last lines: no internal scroll, no "show more", no smaller type. The whole excerpt stays in the document.
*   **One page of four hundred and ten**, said plainly beneath it. The volume is not offered in full.
*   **Read by eye alone.** The symbols carry `aria-hidden`; a line above them says what the page is, so a screen reader is told about the page instead of being made to spell out a page of nothing.
*   **It asserts nothing.** Noise cannot claim that any account is true, which is why it is safe here and why it belongs here: it is the one place the edition lets a visitor see what the Library is almost entirely made of.
*   **Never on a legible volume.** The page is the address view only. A volume this edition can print opens as a book.

### Routing, Coordinates & Technical Invariants
*   **Hash-Based Routing (`routing.ts`):**
    *   `#` or empty string: Wall of Lives.
    *   `#book=bXXXX`: discovered book view, addressed by accession number.
    *   `#shelf=<HEXAGON>-<wall>-<shelf>`: shelf view (`ShelfView.ts`). The thirty-two addresses of one shelf in order, each showing either the spine of a legible volume or `illegible`. Header: `Thirty-two volumes stand here. N of them can be read.` — one, everywhere but the shelfmarked shelf below, where it is two. Walkable with `PREVIOUS SHELF` / `NEXT SHELF`. This is the one surface outside the book view where a title appears, because a shelf is read by its spines; the Wall still shows none.
    *   `#volume=<HEXAGON>-<wall>-<shelf>-<volume>`: one address. If the accession shelved there belongs to this edition, the book view renders for that volume; otherwise the address view (`AddressView.ts`): `NO LEGIBLE VOLUME` — `A volume stands at this address. Nothing in it can be read.` — with its page, the walk continuing in both directions, and the way back to the shelf.
    *   Any other hash, and any coordinate whose fields fall outside the address space: `invalidAddress` view (`This address is not in this edition.`) with a direct button to `Enter the Library`.
    *   Routes are language-independent: the same hash names the same volume under `/` and under `/es/`.
    *   Native browser history (`pushState` / `popstate` / `hashchange`) supports standard Back and Forward navigation without custom state machines.
*   **Deterministic 64-Bit Coordinates (`coordinates.ts`):**
    *   Every volume accession number (e.g., `b0003`) maps deterministically and reversibly to a 64-bit integer using BigInt arithmetic:
        $$x = (n \times 11400714819323198485 + 1442695040888963407) \pmod{2^{64}}$$
    *   Displayed as:
        *   `Hexagon`: Quotient $x / 640$ rendered in uppercase base-36 (unpadded).
        *   `Wall`: Remainder $r = x \pmod{640}$; integer quotient $r / 160 + 1$ (range 1–4).
        *   `Shelf`: Remainder $r \pmod{160}$; integer quotient $(r \pmod{160}) / 32 + 1$ (range 1–5).
        *   `Volume`: Remainder $(r \pmod{32}) + 1$ (range 1–32).
    *   **The mapping runs both ways.** The multiplier is odd and therefore invertible modulo $2^{64}$; `accessionAt()` applies the stored inverse $17428512612931826493$, so every address in the space resolves to exactly one accession number. Only the accessions this edition prints name a readable volume. The remaining ~1.8 × 10¹⁹ addresses are perfectly valid addresses holding nothing legible, and the interface says exactly that. This asymmetry is the point: the Library is complete, the edition is not.
    *   **One shelfmark.** The arithmetic scatters the edition's accession numbers across 2^64 addresses, so the chance of any two landing among the same thirty-two is about one in 10¹⁴: left to itself, every shelf in the edition holds exactly one readable volume and the shelf view always answers "One of them can be read." One pair was therefore placed by hand and frozen. `b0071` (*Only the Gesture Remains*) stands immediately to the right of `b0007` (*The Exact Time*), at Hexagon 36S71XASK9B · Wall 1 · Shelf 4 · Volumes 3 and 4. They share no wording and no edge: nearby on the shelf and nearby in the text have nothing to do with each other, and this is what that looks like from inside the Library.
    *   **A shelfmark is a transposition, not an overwrite.** The moved volume's old address and its new one exchange occupants, applied on the way in and on the way out, so the mapping stays a bijection: every address still holds exactly one volume, and the address `b0071` left now holds the unreadable volume that used to stand where it does. Section 4's editorial map governs what the volumes say; the shelfmark table in `coordinates.ts` governs where this one stands, and both are frozen for the first published edition.
    *   **Known boundary condition.** $2^{64}$ is not a multiple of 640, so the final hexagon holds only 256 of its 640 positions. `positionOf()` accepts any in-range field combination for that hexagon, so 384 addresses past the end of the space render as `NO LEGIBLE VOLUME` rather than `This address is not in this edition.` No printable volume is reachable that way (verified exhaustively over all 384). Cosmetic; revisit only if the edition ever prints a volume near the boundary.
*   **Accessibility & Motion:**
    *   Semantic landmarks (`main`, `header`, `footer`, `section`, `ul`, `li`).
    *   Polite ARIA live region (`aria-live="polite"`) for screen-reader status announcements.
    *   Explicit focus management on view transitions.
    *   Fluid typography, system fonts, and 44px minimum touch targets.
    *   Support for `prefers-reduced-motion`.
    *   `document.documentElement.lang` is set from the active locale on mount.

### Publication
*   **Hosting: Netlify**, project `babel-life`, at `https://babel-life.netlify.app`, deploying continuously from `main`. A push to `main` publishes.
*   **`netlify.toml`** sets `command = "npm run build"`, `publish = "dist"` and `NODE_VERSION = "22"`. The build runs `tsc --noEmit` before Vite, so a type error fails the deploy rather than shipping. One redirect, `/es` → `/es/` (301); every other route of the site lives in the hash, so the server only ever receives `/` or `/es/` and a genuinely unknown path must still 404.
*   **Search and social metadata.** Both entry documents carry a canonical URL, reciprocal `hreflang` links (`en`, `es`, `x-default`), Open Graph and Twitter Card tags with a shared preview image, `WebSite` JSON-LD, and a Search Console verification token. `public/` ships `robots.txt`, `sitemap.xml` (the two entry URLs with their `hreflang` alternates) and `site.webmanifest`.
*   **Indexing boundary, stated so it is not mistaken for an oversight.** The site publishes exactly two indexable URLs. Every volume is a hash fragment, so the catalog is not addressable by a search engine. This follows from the thesis — a book is found in the Library, not retrieved from an index — and is a deliberate trade, not a gap to close by accident.
*   **Analytics: Cloudflare Web Analytics**, loaded from `static.cloudflareinsights.com` in both entry documents. It is the only third-party request the site makes. It sets no cookie and uses no `localStorage` for usage metrics, collects no personal data, and the footer's *Legal & privacy* disclosure says so in both languages. There is no other tracking of any kind, and no telemetry the application itself emits.

### Verification (`tests/`)
Vitest, seventeen files, run with `npm test`; `npm run verify` runs the typecheck, the tests and the production build in one pass. `jsdom` is a dev dependency used by the view and controller cases alone — no browser automation, and nothing here reaches the shipped bundle.

Note that `npm run build`, which is what Netlify runs, does **not** run the tests. Keeping `npm test` green is a discipline of the repository, not a gate the deploy enforces.

*   `coordinates.test.ts` — the address space. Every expected value is derived independently of the module under test, never by calling it: the published positions of known volumes, the inverse over the whole `b0001`–`b9999` registry, field ranges, unpadded printing, one spelling per hexagon, the wrap at both ends of the space, the 384 addresses past the end, and the property the shelf copy depends on — every printed volume stands alone on its shelf, but for the shelfmarked pair, which is held to standing side by side, on one shelf, with no edge between them.
*   `catalog.test.ts` — the shipped inventory, re-deriving the rules rather than calling the validator: 27 root books and 54 nearby books, accession numbers unique and never recycled, every icon present in the illustration set, passages inside the editorial word count of section 3, no repeated passage or title, edges that stay inside one narrative family, every nearby book reachable from its root, the wall as exactly the set of roots in curated order, and the deal — anchors pinned, the remainder shuffled and split without overlap, and no card moving when the wall opens out.
*   `validator.test.ts` — the load-time refusals, one case per rejection, against catalogs built to be wrong.
*   `blueprint.test.ts` — this document against the catalog: the `TITLE`, `WALL HOOK` and `NEARBY A`/`NEARBY B` lines of the map in section 4, in wall order, plus the inventory section 4 states. A title, premise or difference edited in one place and not the other fails here.
*   `locale.test.ts`, `language-switcher.test.ts` — the two editions: the locale read from the pathname and never from the browser, the switcher's hash-preserving links, and the copy bundles held to one shape.
*   `routing.test.ts` — every route the Library answers to, the strangers it does not, and a round trip through the hash writers for every volume.
*   `pages.test.ts` — the page at an unreadable address: the alphabet, the length, determinism across repeat readings, every symbol inside the alphabet and none of them favoured out of all recognition, a different page at every address, and fixtures produced by a separate implementation of the same scramble rather than by calling this one.
*   `address-view.test.ts` — the address view under jsdom: the page stands open on arrival, the symbols are hidden from assistive technology behind a line that describes them, and the same address reads the same twice.
*   `shuffle.test.ts` — the deal: fixed by its seed, a permutation of exactly what it was given, the original left alone, every item first about as often as any other over 1200 seeds, and a seed of its own per visit.
*   `wall-view.test.ts` — the wall under jsdom: the opening twelve led by their premises with no title presented as one, the rest behind `SHOW ME SOMETHING STRANGER` with no overlap, `SHOW ALL 27` leaving both sets exactly where they were, the same deal however often the wall is redrawn, controls put away rather than disabled, every card pointing at its own volume, and counts spelled from the catalogue with no number in any template, in both editions.
*   `library-index.test.ts` — the edition index: one spine per readable book and its counts derived from the catalogue, families kept together, the locator on root and nearby books alike with that book's real address, the readout following hover and keyboard focus and returning, and the resting book.
*   `shelf-view.test.ts` — a shelf under jsdom: thirty-two spines, the readable ones named and linked as volumes, and the count line that says how many — "One of them can be read." on an ordinary shelf, "Two" on the shelfmarked one.
*   `controller.test.ts` — the routing table as behaviour, under jsdom: a legible address opens a book, an illegible one is not an error, an address outside the space is, navigation clears what the previous view held, and the same location never renders twice.
*   `accents.test.ts` — the sanguine accents: every root carries one, each names strokes that exist in the book's own motif, a book without an entry is drawn wholly in charcoal, and the accent reaches the book's plate.
*   `motion.test.ts` — the reduced-motion path.

---

## 3. Editorial Rules

All passages and card copy must adhere strictly to these principles:

1.  **Wall = Premise First:** Wall cards must lead with the complete premise. The visitor chooses an idea, not a title, author, or category.
2.  **Book Page = Title First:** Poetic and literary titles belong inside the book above the passage.
3.  **Hooks Must Work in Isolation:** Every root card on the Wall must be completely compelling and self-explanatory on its own, without requiring comparison to other cards.
4.  **Every Premise Must Expose Something:** A premise earns its card by exposing a meaningful consequence of variation, contingency, identity or combinatorial possibility. Concrete specificity is welcome wherever it sharpens the idea, and must be exact when used (a second, a millimetre, a comma); it is not a decoration to be applied for effect, and a number invented to sound precise is worse than none. Vague mystery is not an idea. The Library's scale is available as a subject and often is one, but a book may just as well take its force from the plain existence of another complete life, without quantifying anything.
5.  **Avoid Cheap Melodrama:** No sensationalist daytime-television tropes (e.g., babies switched at birth, tragic deathbed confessions, miraculous cancer cures).
6.  **Emotional Balance:** Do not make all lives tragic, heroic, or aspirational. The extraordinary resides in the mundane (a misplaced cup, an unsent letter, an unbought house).
7.  **Small Variations Without Consequence Are Valid:** A nearby book does not need a catastrophic butterfly-effect consequence to deserve a place on the shelf. Moving a cup 1 mm left without anything coming of it is quintessential Babel.
8.  **Strict Adjacency (Not Thematic Association):** A nearby book must be another complete life that differs from the book it hangs off in one specified factor — the same scene, document or life course, varied in a single place. Thematic resemblance is not adjacency.
9.  **Autonomous Artifacthood:** Passages and descriptions must read as pre-existing archival records found on a shelf. Never break the fourth wall with phrases like "in the other book" or address the user as an interactive gamer.
10. **Short Form.** The edition is written short. The guardrail, enforced by `catalog.test.ts` over **both** editions, is:
    *   **No passage under 30 words.** This is a floor against a stub or a placeholder, not a craft rule. Anything authored clears it comfortably; the shortest passage shipped today is 39 words.
    *   **No passage over 110 words.** This is the rule that carries the direction. It sits deliberately below 113, the *minimum* of the long-form era this edition left behind, so a pass that drifts back toward it fails rather than passing in silence. The longest passage shipped today is 90 words.
    *   **Each edition is held to these bounds on its own, and to nothing relative to the other.** There is deliberately no rule about English and Spanish prose lengths matching: they are native literary editions, not translations trimmed toward a common count. Structural parity — same accessions, same order, same edges — is an invariant and is checked at load time; prose length is not, and should not be reintroduced as one.
    *   The bounds are editorial limits with stated headroom, not a record of today's extremes. Moving them is an editorial decision to be made here first.
11. **Terminology.** The fixed conceptual rule of Babel Life is **one complete life = one book**.
    *   A **book** is one complete life. This holds for every book in the catalog: a root book contains one complete life, and so does each of its nearby books. A variation, once it stands in the Library, is not an annotation on a life — it is another life, written out in full.
    *   A **narrative family** is a root book and its two nearby books: three complete lives that differ in one specified factor each. It is a unit of authorship and navigation. It is never called a life.
    *   A **volume** is the physical object at an address: what stands on a shelf, what the shelf walk steps through, what is counted as thirty-two per shelf, and what the unreadable addresses hold. Use it where the Library is being described as a place.
    *   The inventory therefore reads: 27 narrative families, 27 root books on the Wall, 54 nearby books, 81 books and 81 complete lives in total.
    *   Both editions follow the same distinction (`libro`, `vida`, `volumen`). `SHOW ME ANOTHER LIFE` is consistent with it: it hands the visitor another complete life, which is another book.

---

## 4. Canonical Content Architecture (IMPLEMENTED)

### Architecture Overview
The canonical library, shipped in `src/content/catalog.json` and `src/content/catalog.es.json` (`schemaVersion: 3`):
*   **27 NARRATIVE FAMILIES**, one per root book.
*   **27 ROOT BOOKS** displayed on the Wall of Lives.
*   **54 NEARBY BOOKS** (exactly 2 per root book).
*   **Total:** 81 books. Accession numbers run from `b0002` to `b0091` and are deliberately not contiguous: an ID retired during an earlier draft is never reused, so a published address never moves. Nine numbers in that range are retired: `b0004`, `b0013`, `b0014`, `b0015`, `b0017`, `b0021`, `b0024`, `b0029`, `b0030`.
*   Both editions carry the same 81 accessions in the same order, checked at load time.

The editorial map below is frozen and the shipped English catalog matches it line for line: `tests/blueprint.test.ts` asserts the title, the wall hook and both nearby differences of every root book, in wall order. Passages follow the short-form guardrail of section 3, rule 10. Any future content pass edits this map first and the catalog second, never the reverse.

**Structural Division:**
*   **Root Books** belong on the Wall. They provide 27 independent reasons to enter the Library.
*   **Nearby Books** do NOT appear on the Wall. They are discovered exclusively from within an open book, at the address next to it in the wording.
*   A root book and its two nearby books form one **narrative family**. The family is a unit of authorship and of navigation; it is not a life. Each of its three books is a complete life of its own.

**One numbered entry per narrative family**, in wall order: the root book's title and wall hook, then the difference that leads to each of its two nearby books.

**The map is written in English.** The Spanish edition is held to the same map by identity and order, not by line: `catalog.es.json` is authored Spanish, not a translation of these lines, and is checked against the English edition for alignment rather than for wording.

**The order below is the canonical wall order** (`wall.first` then `wall.second` in the catalog), which is the editorial order of the map. It is not the order a visitor meets: the five pinned anchors open every wall and the other twenty-two are shuffled per visit (section 2).

### Final Canonical Content Map (Frozen Editorial Map)

```
1
TITLE: The Exact Time
WALL HOOK: your birth is recorded to the second: the temperature of the room, the light, who was present.
NEARBY A: You are born four seconds later and nothing else changes.
NEARBY B: The place, date and every other possible circumstance of birth change.

2
TITLE: The House You Remember
WALL HOOK: every bedroom, school, game and fear from your childhood is recorded so that you can be written without omission.
NEARBY A: Another childhood converges on this same afternoon.
NEARBY B: A different desk leads to an unrecognisable person.

3
TITLE: The First Language
WALL HOOK: the language you learned first decides which words will fail you when you need them most.
NEARBY A: The same declaration is spoken in another language.
NEARBY B: All the languages you could understand are combined.

4
TITLE: Your Working Day
WALL HOOK: every day you have worked is recorded, up to the last time you will close a door at the end of a shift.
NEARBY A: Completely different careers converge at eight fifteen.
NEARBY B: Every job and the order in which you do them change.

5
TITLE: Where You Sleep
WALL HOOK: you sleep tonight in your exact room, and the distance from the bed to the wall is recorded.
NEARBY A: Only the room for one night changes.
NEARBY B: All possible homes and sequences of addresses change.

6
TITLE: Those Who Appear
WALL HOOK: your children, if you have any, are written in full, including the years after you die.
NEARBY A: Conception occurs an instant earlier and another person appears.
NEARBY B: Every possible child appears in every order and number.

7
TITLE: Before You
WALL HOOK: the possible lives of your parents change the conditions of yours again and again.
NEARBY A: The same parents live differently.
NEARBY B: One or both of the people who are your parents change.

8
TITLE: What You Keep
WALL HOOK: your past appears once as it happened and again as you remember it.
NEARBY A: Only the memory of one childhood afternoon remains.
NEARBY B: Every combination of memory and forgetting changes.

9
TITLE: Inventory
WALL HOOK: every object you have ever owned is listed, down to the one you forgot the same day.
NEARBY A: A blue paper clip belongs to you for seventeen minutes.
NEARBY B: Every object and every sequence of acquisition and loss changes.

10
TITLE: Where You Went
WALL HOOK: every step you have taken stands in order, up to the last one before you read this.
NEARBY A: A single step lands twenty centimetres to the left.
NEARBY B: Every route and the people encountered along it change.

11
TITLE: Your Book
WALL HOOK: your exact life is written from birth to the circumstances of your death.
NEARBY A: The same life ends one second later.
NEARBY B: Tomorrow you take thirteen steps to the kitchen instead of twelve.

12
TITLE: The Door Opposite
WALL HOOK: you are born into the family across from your home, and your current family simply lives nearby.
NEARBY A: You are born behind every possible door on your street.
NEARBY B: Someone else occupies your room in your current family.

13
TITLE: Every Seat
WALL HOOK: you die in an aircraft accident, in seat 1A.
NEARBY A: The same sequence exists for every ordinary way of dying.
NEARBY B: The whole life matches until the final minute.

14
TITLE: Left First
WALL HOOK: you put on your left sock first every day of your adult life, and nothing else changes.
NEARBY A: One Tuesday, at forty-six, you put on the right sock first.
NEARBY B: You put on the right sock first every day of your adult life.

15
TITLE: What Was Said
WALL HOOK: every word you have said is recorded, and every silence with its exact length.
NEARBY A: One pause lasts a second longer and nothing else changes.
NEARBY B: Every possible word, pause and conversation changes.

16
TITLE: Your Nights
WALL HOOK: every night of your life is recorded: which side you slept on, how often you woke, who breathed nearby.
NEARBY A: For one night, you sleep facing the other way.
NEARBY B: Every bed, position, interruption and companion changes.

17
TITLE: Every Body
WALL HOOK: you are born on the same day, to the same parents, in the same room, with another body.
NEARBY A: Two bodies differ by only one millimetre of adult height.
NEARBY B: Every bodily trait combines with every other one.

18
TITLE: Every Road
WALL HOOK: you spend your whole life travelling the world by car.
NEARBY A: The same life in motion, but on two wheels.
NEARBY B: The same need to keep moving, but through the sky.

19
TITLE: The Exact Age
WALL HOOK: you die at 86 years, 3 months, 11 days, 7 hours, 14 minutes and 8 seconds.
NEARBY A: The life ends at every age and after every possible final day.
NEARBY B: After the final night, you live one more day.

20
TITLE: Your Full Name
WALL HOOK: you keep your name while your body, family, language, memories and everything else change.
NEARBY A: The same signature belongs to a completely different life.
NEARBY B: Completely different people answer to your same name.

21
TITLE: Only the Gesture Remains
WALL HOOK: everything changes except one gesture, meal or word that remains exactly the same.
NEARBY A: Two different lives share one exact breakfast.
NEARBY B: Everything changes except the final word.

22
TITLE: Every Living Person
WALL HOOK: you spend your life with someone alive right now who does not know who you are.
NEARBY A: Every possible relationship exists with each person.
NEARBY B: Every possible relationship combines into complete networks.

23
TITLE: What No One Saw
WALL HOOK: your visible life remains identical while the thoughts, desires and interpretations it contains change.
NEARBY A: One thought appears for three seconds and changes nothing.
NEARBY B: Every inner interpretation, intention and combination changes.

24
TITLE: One Thing, Then All of Them
WALL HOOK: you live in another city, with another job, in another home, with another person.
NEARBY A: Even one Tuesday contains all its possible combinations.
NEARBY B: Family, body, language and every other detail all change at once.

25
TITLE: A Single Comma
WALL HOOK: there are no words, only a comma in one exact position.
NEARBY A: Every character is the same letter.
NEARBY B: The combinations eventually form a complete life.

26
TITLE: Written Twice
WALL HOOK: your life is written minute by minute, and every page of it also appears in someone else's book.
NEARBY A: The same evenings of your life are written from the other window, and the spine carries her name.
NEARBY B: The four seconds in which you cross paths appear in both books, each inside the complete life of the other.

27
TITLE: The Child in the Notebook
WALL HOOK: the person you invented in three pages has an entire life you never wrote.
NEARBY A: The book contains the complete life of the person who matches the child in those three pages.
NEARBY B: Another person writes three pages in their childhood about someone who matches you exactly.
```

EDITORIAL MAP STATUS: FROZEN. ASSERTED BY `tests/blueprint.test.ts`.

---

## 5. Planned Later (NOT IMPLEMENTED)

These features represent planned future iterations and must **NOT** be implemented during current content or maintenance passes:

1.  **Book Ratings ("RATE THIS BOOK"):**
    *   A discreet, non-intrusive rating mechanism placed at the foot of an opened book passage.
    *   Enables visitors to record resonance without writing reviews or leaving comments.
2.  **Wall Leaderboards & Curated Views:**
    *   Filter/sort views for `ALL TIME` and `THIS WEEK` rankings.
3.  **Confidence-Weighted Ranking Mathematics:**
    *   Rankings must **never** use a naive arithmetic average (which allows a single 5-star vote to rank above thousands of consistent ratings).
    *   Must incorporate vote volume and statistical confidence (e.g. lower bound of the Wilson score confidence interval or a Bayesian average with a fixed global prior).
4.  **Minimal Remote Persistence:**
    *   Ratings eventually require a lightweight remote datastore (e.g. serverless edge KV / edge SQL).
    *   Must be strictly limited to aggregating anonymous vote tallies; no user tracking, advertising beacons, fingerprinting, or personal profile data.

---

## 6. STATUS SNAPSHOT

This status snapshot is the absolute boundary for future agents and developers.

### IMPLEMENTED NOW
*   Static vanilla TypeScript + Vite + modern CSS client application. `npm run typecheck`, `npm test` and `npm run build` pass clean.
*   **A bilingual edition**: English at `/`, Spanish at `/es/`, two real HTML entry documents, two authored catalogs aligned accession by accession, one typed copy bundle per language, and a language switcher that keeps the visitor's place.
*   **Wall of Lives** with 12 opening cards, `SHOW ME SOMETHING STRANGER` (the remaining 15), and `SHOW ALL 27`.
*   **A wall with five pinned editorial anchors** and the other twenty-two root books shuffled as one pool per visit, split seven into the opening wall and fifteen behind the stranger control, so opening out never moves a card. Nothing stored; a reload deals again.
*   **The edition index** beside the masthead: every readable book of this edition by family, with a locator on one of them and its real printed address, following hover and keyboard focus.
*   Premise-first card presentation, the shared eyebrow shown once above the grid and carried on each card for its accessible name.
*   Literary titles displayed inside the book view and on shelf spines, never on the Wall.
*   **The book as a spread**: shelf locator, the book's motif as a plate, drop-capped passage, aftertaste, the whole shelf embedded beside it, nearby books and the shelf walk.
*   **A motif for every book**, drawn from its own story, every root with one of its own, in one charcoal hand, with sanguine only where it marks a root's point of contingency or what a nearby book changed.
*   **The full 81-book canonical catalog in both languages:** 27 root books on the Wall, 54 nearby books reachable only from inside a book, exactly two per root, passages inside the short-form guardrail. Validated at load time: ID syntax, duplicate identities, unresolved edges, edges leaving their narrative family, unlabelled edges, a wall that is not exactly the set of roots, and the two editions falling out of alignment.
*   Nearby books navigation naming specific differences from the current passage.
*   **One shelf with two readable volumes:** a single frozen shelfmark, implemented as a transposition of two addresses, so that one walk along a shelf finds two strangers standing together.
*   **A page at every unreadable address:** the address view opens the volume's page directly, in the Library's 25-symbol alphabet, fixed for that address by splitmix64 over its position, hidden from assistive technology behind a line that describes it.
*   **Navigable address space:** `#shelf=` and `#volume=` routes, a shelf view of thirty-two spines, an address view for addresses holding nothing legible, and volume-by-volume walking in both directions.
*   Deterministic 64-bit coordinate mapping using BigInt linear congruential arithmetic, invertible in both directions.
*   Deterministic `SHOW ME ANOTHER LIFE` sequence cycling through the root books.
*   Pure hash routing with browser history integration and invalid address handling.
*   Decorative reading-room atmosphere, skipped entirely under `prefers-reduced-motion`.
*   **Published on Netlify**, deploying continuously from `main`, with search and social metadata, a sitemap, a manifest and a `<noscript>` fallback in both languages.
*   **Cloudflare Web Analytics** for aggregate traffic, disclosed in the footer of both editions. No cookies, no `localStorage` for usage metrics, no personal data, no other third-party request.
*   Zero backend, zero AI generation, zero user accounts, zero form submissions, zero persistence of anything about a reader.

### KNOWN GAPS
*   **Untested views.** `BookView`, `NearbyVolumes`, `shelfLocator`, `shelfListing`, `atmosphere` and the drawings themselves have no cases of their own (their sanguine accents do) and are exercised only by reading the page.
*   **The Spanish catalog's prose is checked for shape, not for craft.** Accession alignment with the English edition and the word count are asserted; nothing reads it.
*   **No screen reader has been used at all.** Chromium at 320 / 390 / 1440 px covers the wall, the book spread, the shelf and the address view in both languages: no horizontal overflow anywhere, the language switcher keeps the open volume, and the wall's deal survives opening a life, browser Back, `SHOW ALL 27` and repeated redraws while a reload deals again.
*   The final-hexagon boundary condition described in section 2.
*   **`npm test` is not a deploy gate.** Netlify runs `npm run build`, which typechecks and builds but does not run the suite.
*   **Open defects recorded but not fixed**, carried here so they are not rediscovered as news:
    *   ~~`--ink-faint` contrast~~ — **Resolved.** Functional and readable text migrated to `--ink-muted` (#6a6153, ≥ 4.56:1 AA on every background surface). `--ink-faint` (#8a8173) retained only for decorative SVG strokes, end labels and spine glyphs.
    *   ~~Shared motifs on the wall~~ — **Resolved.** Every root book has a motif of its own, drawn from its premise.

### APPROVED NEXT
*   Nothing pending. The next approved item is whatever gets promoted out of section 5, or the closing of a known gap above.

### PLANNED LATER
*   `RATE THIS BOOK` interaction on book pages.
*   `ALL TIME` and `THIS WEEK` ranked views on the Wall.
*   Statistical confidence-weighted ranking algorithm (Wilson score / Bayesian average).
*   Minimal, anonymous serverless persistence strictly for rating aggregation.
