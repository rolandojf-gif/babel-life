# Babel Life — System Blueprint & Content Architecture

## 1. Product Thesis & Epistemic Grounding

### Core Thesis
Babel Life is an intimate reading experience in which visitors discover books describing writable versions of a human life. 

Its central interaction is finding a nearby volume: one detail changes, and another life sits on the shelf. The Library’s scale is felt through precise repetition and subtle difference.

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

The application in `src/` is a static, zero-backend, client-side web experience written in vanilla TypeScript, Vite, and modern CSS. There are no frontend frameworks, databases, external APIs, user accounts, cookies, analytics, or AI generation pipelines.

### The Wall of Lives (`WallOfLives.ts`)
The site entry is the **Wall of Lives**, not a scenario selector, dropdown, or form.
*   **Masthead:** 
    *   Eyebrow: `THE LIBRARY OF LIVES`
    *   Heading: `Somewhere in the Library, every writable life already exists.`
    *   Lede: `Open one.`
*   **Card Grid (`BookCard.ts`):** 
    *   Lives are displayed as tactile visual cards cycling across three warm paper tones (`data-tone="0|1|2"`).
    *   Each card features a dedicated symbolic vector illustration (`illustrations.ts`).
    *   **Premise-First Presentation:** The card eyebrow is universally `THERE IS ALREADY A BOOK IN WHICH…`. Underneath, the hook completes the sentence with the full premise.
    *   **Titles Excluded from Wall:** Poetic and literary titles belong inside the book, never on the Wall card. The visitor enters through the curiosity of the premise alone.
    *   **Coordinate Badge:** Displays `Hexagon [ID] · Volume [N]`.
    *   **Action:** `OPEN THIS LIFE →`.
*   **Card Batching & Navigation:**
    *   Initial load displays **12 curated cards** (`wall.first`), dealt in an order drawn once per visit.
    *   Counter: `Twelve of twenty-four volumes.`
    *   Secondary Action: `SHOW ME SOMETHING STRANGER` swaps the grid to the second 12 cards (`wall.second`).
    *   Quiet Action: `SHOW ALL 24` expands the grid to display all 24 root lives simultaneously (`wall.all`).
    *   No disabled button states: controls disappear cleanly when their action is no longer applicable.
*   **The order of the deal (`shuffle.ts`):**
    *   The two curated sets of twelve are shuffled **separately and never mixed**, so which twelve open the wall stays an editorial decision and only their order is left to the deal. A visitor who comes back tomorrow meets the same twelve lives in a different order, not a different twelve.
    *   One seed is drawn per visit and held in memory by the controller. Every redraw of the wall — after opening a life, after browser Back, after `SHOW ALL 24` — deals the same order, so nothing moves under the visitor's hands. `SHOW ALL 24` appends the second set below the first rather than dealing the wall again.
    *   Nothing is stored: a reload is a new visit and deals again. The seed is an ordinary `Math.random()` draw, since card order is not a secret, and it runs through the same splitmix64 scramble (`scramble.ts`) that writes the pages at unreadable addresses.

### The Book View (`BookView.ts`)
When a visitor opens a life, the interface presents an authored volume from the Library:
*   **Navigation:** Top and bottom backlink: `← Wall of Lives`.
*   **Discovery Marker:** Prominently states `YOU FOUND THE BOOK`.
*   **Permanent Address:** Full 4-field coordinate line: `Hexagon [ID] · Wall [1–4] · Shelf [1–5] · Volume [1–32]`.
*   **Archival Assertion:** Quiet line: `This book was already here.`
*   **Consultation Note:** Immediately beneath it, the Library's note of this reading: `Consulted at HH:MM on a <weekday>.`, taken from the visitor's own device clock and marked up as a `<time>` element. It is a reading-room record of the consultation, never a claim about the reader: no identity, no history, no inference, nothing stored, nothing transmitted. It is the only element of the page that differs between two readings of the same volume; title, passage, aftertaste and address never do.
*   **Symbolic Artwork:** The book's matching illustration header.
*   **Literary Title:** The book's formal title (`h1.book__title`), read in full here. The Wall withholds it entirely; a shelf shows it only as a spine.
*   **Narrative Passage:** The authored account, split into structured paragraphs. Bare clock timestamps are styled as typographic margin stamps.
*   **Aftertaste:** A single, restrained closing resonance beneath the passage (`book.aftertaste`).
*   **Nearby Volumes Section (`NearbyVolumes.ts`):** 
    *   Heading: `NEARBY VOLUMES`.
    *   An inline list of exactly two adjacent volumes, enforced at load time by the catalog validator.
    *   Every link explicitly states the exact difference from the current book (`nearby__difference`), followed by the destination headline and `OPEN →`.
*   **Shelf Walk (`shelfwalk`):** Below the nearby volumes, the shelf itself: `← PREVIOUS VOLUME`, `BROWSE THIS SHELF`, `NEXT VOLUME →`. These address the Library by position rather than by accession number, so they lead into the adjacent addresses whatever stands there. Nearby volumes are adjacency in wording; the shelf walk is adjacency on the shelf. The two are deliberately unrelated.
*   **Continuation Actions:**
    *   `SHOW ME ANOTHER LIFE`: Deterministically advances to the next distinct thematic cluster in the wall sequence, cycling continuously without repetition.
    *   `← Wall of Lives`: Returns directly to the wall.

### The Unreadable Volumes (`pages.ts`, `AddressView.ts`)
At an address holding nothing this edition can print, the visitor is not told the shelf is empty. A quiet `LOOK INSIDE` offers one page of the volume that stands there.
*   **Never unasked, never on a legible volume.** The control appears only on the address view, opens nothing on its own, and is replaced by the page it was asked for rather than left disabled.
*   **Twenty-five orthographic symbols**, as the story has them: twenty-two letters, the space, the comma and the period. The twenty-two are the classical Latin alphabet without J, U, W or Z. The story names none of them; this is an editorial choice of this edition, frozen like the coordinate display.
*   **Fixed for its address.** 192 symbols drawn by splitmix64 seeded with the address's own 64-bit position: the same page on every device, in every session, for as long as the address exists. No clock, no randomness, no storage, and nothing about the reader anywhere in it.
*   **One page of four hundred and ten**, said plainly beneath it. The volume is not offered in full and no page count is faked elsewhere.
*   **Read by eye alone.** The symbols carry `aria-hidden`; a visually hidden line says what the page is, and focus moves to it when the control is replaced, so a screen reader is told about the page instead of being made to spell out 192 symbols of nothing.
*   **It asserts nothing.** Noise cannot claim that any account is true, which is why it is safe here and why it belongs here: it is the one place the edition lets a visitor see what the Library is almost entirely made of.

### Routing, Coordinates & Technical Invariants
*   **Hash-Based Routing (`routing.ts`):**
    *   `#` or empty string: Wall of Lives.
    *   `#book=bXXXX`: Discovered book view, addressed by accession number.
    *   `#shelf=<HEXAGON>-<wall>-<shelf>`: Shelf view (`ShelfView.ts`). The thirty-two addresses of one shelf in order, each showing either the spine of a legible volume or `not legible`. Header: `Thirty-two volumes stand here. N of them can be read.` — one, everywhere but the shelfmarked shelf below, where it is two. Walkable with `PREVIOUS SHELF` / `NEXT SHELF`. This is the one surface outside the book view where a title appears, because a shelf is read by its spines; the Wall still shows none.
    *   `#volume=<HEXAGON>-<wall>-<shelf>-<volume>`: One address. If the accession shelved there belongs to this edition, the book view renders for that volume; otherwise the address view (`AddressView.ts`): `NO LEGIBLE VOLUME` — `A volume stands at this address. Nothing in it can be read.` — with the page above, the walk continuing in both directions, and the way back to the shelf.
    *   Any other hash, and any coordinate whose fields fall outside the address space: `invalidAddress` view (`This address is not in this edition.`) with a direct button to `Enter the Library`.
    *   Native browser history (`pushState` / `popstate` / `hashchange`) supports standard Back and Forward navigation without custom state machines.
*   **Deterministic 64-Bit Coordinates (`coordinates.ts`):**
    *   Every volume accession number (e.g., `b0003`) maps deterministically and reversibly to a 64-bit integer using BigInt arithmetic:
        $$x = (n \times 11400714819323198485 + 1442695040888963407) \pmod{2^{64}}$$
    *   Displayed as:
        *   `Hexagon`: Quotient $x / 640$ rendered in uppercase base-36 (unpadded).
        *   `Wall`: Remainder $r = x \pmod{640}$; integer quotient $r / 160 + 1$ (range 1–4).
        *   `Shelf`: Remainder $r \pmod{160}$; integer quotient $(r \pmod{160}) / 32 + 1$ (range 1–5).
        *   `Volume`: Remainder $(r \pmod{32}) + 1$ (range 1–32).
    *   **The mapping runs both ways.** The multiplier is odd and therefore invertible modulo $2^{64}$; `accessionAt()` applies the stored inverse $17428512612931826493$, so every address in the space resolves to exactly one accession number. Only `b0001`–`b0072` name a volume this edition can print. The remaining ~1.8 × 10¹⁹ addresses are perfectly valid addresses holding nothing legible, and the interface says exactly that. This asymmetry is the point: the Library is complete, the edition is not.
    *   **One shelfmark.** The arithmetic scatters seventy-two accession numbers across 2^64 addresses, so the chance of any two landing among the same thirty-two is about one in 10¹⁴: left to itself, every shelf in the edition holds exactly one readable volume and the shelf view always answers "One of them can be read." One pair was therefore placed by hand and frozen. `b0071` (*The Stranger Who Remembers You*) stands immediately to the right of `b0007` (*The 08:14*), at Hexagon 36S71XASK9B · Wall 1 · Shelf 4 · Volume 4. They share no wording and no edge: nearby on the shelf and nearby in the text have nothing to do with each other, and this is what that looks like from inside the Library.
    *   **A shelfmark is a transposition, not an overwrite.** The moved volume's old address and its new one exchange occupants, applied on the way in and on the way out, so the mapping stays a bijection: every address still holds exactly one volume, and the address `b0071` left now holds the unreadable volume that used to stand where it does. Section 4's editorial map governs what the volumes say; the shelfmark table in `coordinates.ts` governs where this one stands, and both are frozen for the first published edition.
    *   **Known boundary condition.** $2^{64}$ is not a multiple of 640, so the final hexagon holds only 256 of its 640 positions. `positionOf()` accepts any in-range field combination for that hexagon, so 384 addresses past the end of the space render as `NO LEGIBLE VOLUME` rather than `This address is not in this edition.` No printable volume is reachable that way (verified exhaustively over all 384). Cosmetic; revisit only if the edition ever prints a volume near the boundary.
*   **Accessibility & Motion:**
    *   Semantic landmarks (`main`, `header`, `footer`, `section`, `ul`, `li`).
    *   Polite ARIA live region (`aria-live="polite"`) for screen-reader status announcements.
    *   Explicit focus management on view transitions.
    *   Fluid typography, system fonts, and 44px minimum touch targets.
    *   Support for `prefers-reduced-motion`.

### Verification (`tests/`)
Vitest, eleven files, run with `npm test`; `npm run verify` runs the typecheck, the tests and the production build in one pass. `jsdom` is a dev dependency used by the controller cases alone — no browser automation, and nothing here reaches the shipped bundle.
*   `coordinates.test.ts` — the address space. Every expected value is derived independently of the module under test, never by calling it: the published positions of known volumes, the inverse over the whole `b0001`–`b9999` registry, field ranges, unpadded printing, one spelling per hexagon, the wrap at both ends of the space, the 384 addresses past the end, and the property the shelf copy depends on — every printed volume stands alone on its shelf, but for the shelfmarked pair, which is held to standing side by side, on one shelf, with no edge between them.
*   `catalog.test.ts` — the shipped inventory, re-deriving the rules rather than calling the validator: 24 lives and 48 variations, accession numbers unique and never recycled, every icon present in the illustration set, word counts inside the editorial range, no repeated passage or title, edges that stay inside one life, every variation reachable from its root, and the wall as exactly the set of roots in curated order.
*   `validator.test.ts` — the load-time refusals, one case per rejection, against catalogs built to be wrong.
*   `blueprint.test.ts` — this document against the catalog: the 24 `TITLE` and `WALL HOOK` lines of the frozen map in section 4, in wall order, plus the inventory this section states. A title edited in one place and not the other fails here.
*   `routing.test.ts` — every route the Library answers to, the strangers it does not, and a round trip through the hash writers for all 72 volumes.
*   `pages.test.ts` — the page at an unreadable address: the alphabet, the length, determinism across repeat readings, every symbol inside the alphabet and none of them favoured out of all recognition, a different page at every address, and two fixtures produced by a separate implementation of the same scramble rather than by calling this one.
*   `address-view.test.ts` — the address view under jsdom: the page is offered and not opened, the control is replaced by it, focus follows, the symbols are hidden from assistive technology behind a line that describes them, and the same address reads the same twice.
*   `shuffle.test.ts` — the deal: fixed by its seed, a permutation of exactly what it was given, the original left alone, every item first about as often as any other over 1200 seeds, and a seed of its own per visit.
*   `wall-view.test.ts` — the wall under jsdom: twelve cards led by their premises with no title presented as one, the other twelve behind `SHOW ME SOMETHING STRANGER` with no overlap, `SHOW ALL 24` leaving both sets exactly where they were, the same deal however often the wall is redrawn, controls put away rather than disabled, and every card pointing at its own volume.
*   `shelf-view.test.ts` — a shelf under jsdom: thirty-two spines, the readable ones named and linked as volumes, and the count line that says how many — "One of them can be read." on an ordinary shelf, "Two" on the shelfmarked one.
*   `controller.test.ts` — the routing table as behaviour, under jsdom: a legible address opens a book, an illegible one is not an error, an address outside the space is, navigation clears what the previous view held, and the same location never renders twice.

---

## 3. Editorial Rules

All passages and card copy must adhere strictly to these principles:

1.  **Wall = Premise First:** Wall cards must lead with the complete premise. The visitor chooses an idea, not a title, author, or category.
2.  **Book Page = Title First:** Poetic and literary titles belong inside the book above the passage.
3.  **Hooks Must Work in Isolation:** Every root card on the Wall must be completely compelling and self-explanatory on its own, without requiring comparison to other cards.
4.  **Concrete Specificity over Vague Mystery:** Ground premises in exact seconds, millimetres, years, objects, and actions (e.g., "forty-seven seconds", "one centimetre farther left", "1340", "a single vowel").
5.  **Avoid Cheap Melodrama:** No sensationalist daytime-television tropes (e.g., babies switched at birth, tragic deathbed confessions, miraculous cancer cures).
6.  **Emotional Balance:** Do not make all lives tragic, heroic, or aspirational. The extraordinary resides in the mundane (a misplaced cup, an unsent letter, an unbought house).
7.  **Small Variations Without Consequence Are Valid:** A nearby volume does not need a catastrophic butterfly-effect consequence to deserve a place on the shelf. Moving a cup 1 mm left without anything coming of it is quintessential Babel.
8.  **Strict Adjacency (Not Thematic Association):** Nearby volumes must be genuine small counterfactual variations of the *same* life, scene, or archival document, varying one specific factor.
9.  **Autonomous Artifacthood:** Passages and descriptions must read as pre-existing archival records found on a shelf. Never break the fourth wall with phrases like "in the other book" or address the user as an interactive gamer.
10. **Target Word Count:** Future narrative expansions should target roughly **70–140 words** (occasionally 150–160 words). Do not rewrite existing passages now.

---

## 4. Canonical Content Architecture (IMPLEMENTED)

### Architecture Overview
The canonical library, shipped in `src/content/catalog.json` (`schemaVersion: 3`):
*   **24 ROOT LIVES** displayed on the Wall of Lives.
*   **48 NEARBY VOLUMES** (exactly 2 nearby volumes per root).
*   **Total:** 72 volumes. Accession numbers run from `b0002` to `b0082` and are deliberately not contiguous: an ID retired during an earlier draft is never reused, so a published address never moves.

The editorial map below is frozen and the shipped catalog matches it title for title. Passages run 113–155 words. Any future content pass edits this map first and the catalog second, never the reverse.

**Structural Division:**
*   **Root Lives** belong on the Wall. They provide 24 independent reasons to enter the Library.
*   **Nearby Volumes** do NOT appear on the Wall. They are discovered exclusively as adjacent volumes from within an open book.

### Final Canonical Content Map (Frozen Editorial Map)

```
1
TITLE: The 08:14
WALL HOOK: you miss the 08:14 by two seconds. The stranger beside you misses it too. You spend the next thirty-one years together.
NEARBY A: you reach the platform three seconds earlier, board the train, and never meet them.
NEARBY B: you both miss the train by the same two seconds, stand beside each other for seventeen minutes, and never speak.

2
TITLE: Forty-Seven Seconds
WALL HOOK: at 27, you make your professional football debut. Forty-seven seconds later, your entire professional career is over.
NEARBY A: the referee blows one second earlier. Your professional career lasts 46 seconds.
NEARBY B: your only touch is a header from six yards. It goes in. You never play professionally again.

3
TITLE: The Coat at Home
WALL HOOK: you win an Oscar and realise, as your name is called, that the speech you rehearsed for eleven years is inside a coat at home.
NEARBY A: you wear the coat. The speech is in the inside pocket exactly where you left it.
NEARBY B: the speech is still at home, but the stranger beside you lends you a pen and you write six words before reaching the stage.

4
TITLE: An Ordinary Thursday
WALL HOOK: your entire life is identical until tomorrow morning, when you put your coffee cup one centimetre farther left. Nothing comes of it.
NEARBY A: tomorrow the cup lands one millimetre farther left. Nothing comes of it.
NEARBY B: tomorrow you put it down exactly inside yesterday’s coffee ring. Nothing changes, and it is still another book.

5
TITLE: The Unremembered Afternoon
WALL HOOK: every event you remember matches the book except one Tuesday afternoon you cannot remember: the book says you walked to the river.
NEARBY A: the same missing Tuesday has you standing at the kitchen window for three and a half hours.
NEARBY B: the book describes the walk to the river, but you turn back at the footbridge and go home.

6
TITLE: The Second Page
WALL HOOK: at 59, you receive a letter written to you when you were 19, asking you to come back. You sit down before opening the second page.
NEARBY A: the letter reaches you four days after it was written and you go to the address.
NEARBY B: the letter reaches you at 59, but the envelope contains only the first page.

7
TITLE: This One
WALL HOOK: you open a book about someone opening this website and reading this exact sentence.
NEARBY A: the book says you close this page after the next sentence. You do.
NEARBY B: the book says you close this page after the next sentence. You read the same sentence a second time instead.

8
TITLE: Seventeen Years
WALL HOOK: seventeen years from now, you return to this website looking for a sentence you remember incorrectly.
NEARBY A: you return seventeen minutes later instead of seventeen years later and already remember the sentence incorrectly.
NEARBY B: you return seventeen years later and remember every word correctly except one.

9
TITLE: Someone Answers
WALL HOOK: the last ordinary sentence you ever say is already written down. The person who answers expects the conversation to continue.
NEARBY A: you say the same final sentence, but nobody answers.
NEARBY B: the person who answers pauses, repeats your sentence as a question, and waits.

10
TITLE: Without You
WALL HOOK: your parents never meet. The book follows both their lives to the end, and you appear nowhere in it.
NEARBY A: your parents meet once, exchange six words, and never learn each other’s names.
NEARBY B: they become close friends for forty years and never become a couple. You still never appear.

11
TITLE: The Other Cot
WALL HOOK: you were switched at birth and nobody ever discovered it. You grow up with different parents and never once believe you are living the wrong life.
NEARBY A: the switch is discovered before either family leaves the hospital.
NEARBY B: nobody discovers it until you are sixty, when an old hospital record is found.

12
TITLE: 14 March
WALL HOOK: the book counts eighty-two years of the same 14 March. Every morning, you remember none of the day before.
NEARBY A: one morning you wake with a single memory from the previous 14 March.
NEARBY B: every 14 March is identical except that one teaspoon moves to a different place each morning.

13
TITLE: The Sentence Everyone Knows
WALL HOOK: you become famous for a sentence you do not remember saying. Everyone else can quote it exactly.
NEARBY A: a recording survives, but one word is different from the version everyone quotes.
NEARBY B: the sentence was spoken by the person beside you, but the transcript puts your name underneath it.

14
TITLE: What They Said at Four
WALL HOOK: the child you never had has an entire life in this book. At four, they invent their own word for rain.
NEARBY A: at four, the child invents a different word for rain.
NEARBY B: the same child exists, but the book is written from the other parent’s point of view and you appear only intermittently.

15
TITLE: Your Laugh in 1340
WALL HOOK: you are born in 1340 with the same laugh, the same temper, and completely different things to be late for.
NEARBY A: you are born in the neighbouring household, forty metres away.
NEARBY B: you have the same temper, but lose it six years earlier over a disputed stone wall.

16
TITLE: No Reply
WALL HOOK: humanity receives a message from outside Earth, understands it completely, and decides not to answer. The book spends the next page on your ordinary Tuesday.
NEARBY A: the decision is postponed for twenty-four hours, and you learn about the message before going to work.
NEARBY B: one private reply is transmitted before the official decision is made.

17
TITLE: Letters Without Stamps
WALL HOOK: for fifty years, someone writes letters to you and sends none of them. Some are only about the weather.
NEARBY A: after thirty-two years, one letter about the weather is posted by mistake.
NEARBY B: the letters stop for eleven months and then resume without ever mentioning the gap.

18
TITLE: The Drawer
WALL HOOK: at 28, you invent something and put it in a drawer. Eighty years later, somebody else invents the same thing and gets the applause.
NEARBY A: at 28, you show the invention to one friend, who tells you it will never work.
NEARBY B: eighty years later the second inventor reproduces even the same unnecessary design flaw in your original drawing.

19
TITLE: Under Another Name
WALL HOOK: a clerical error gives you a dead person’s name. Forty years later, it is the name everyone you love uses.
NEARBY A: the clerical error is corrected after seven days and almost nobody remembers the wrong name.
NEARBY B: the clerical error misspells the dead person’s name by a single vowel, giving you a name that belonged to no one.

20
TITLE: The Last Speaker
WALL HOOK: you are the last person alive who speaks your language. Your oldest joke is still funny, but there is nobody left to tell it to.
NEARBY A: another fluent speaker is found alive three hundred kilometres away.
NEARBY B: your grandchild understands every word of the language but cannot answer you in it.

21
TITLE: The Stranger Who Remembers You
WALL HOOK: a stranger remembers you as the most important person in their life. You cannot remember ever meeting them.
NEARBY A: the stranger remembers one afternoon with you in extraordinary detail; you remember the day but not them.
NEARBY B: you remember the stranger as the most important person in your life; they have no memory of ever meeting you.

22
TITLE: The Final Page
WALL HOOK: you read a book you believe contains the rest of your life. Then you have to live tomorrow knowing what it says.
NEARBY A: you stop reading three pages before the end and spend the rest of your life wondering what they contained.
NEARBY B: you finish the book, then discover another equally convincing volume with a different final page.

23
TITLE: Under the Tablecloth
WALL HOOK: one ordinary dinner in your life fills an entire book: every sentence spoken, and every thought nobody says aloud.
NEARBY A: one guest says aloud over dessert the sentence they kept to themselves all evening.
NEARBY B: two people swap seats. The food, conversation and guests remain the same; three private thoughts change completely.

24
TITLE: A Stranger in the First Person
WALL HOOK: there is a book about someone who does not exist in your world. Nothing in their life resembles yours. You recognise yourself in every page.
NEARBY A: one small biographical detail suddenly matches your real life, and the sense of recognition becomes weaker.
NEARBY B: the same stranger’s life is narrated in third person instead of first, and you no longer recognise yourself in it.
```

EDITORIAL MAP STATUS: FROZEN FOR BLUEPRINT UPDATE

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
    *   Must incorporate vote volume and statistical confidence (e.g., lower bound of the Wilson score confidence interval or a Bayesian average with a fixed global prior).
4.  **Minimal Remote Persistence:**
    *   Ratings eventually require a lightweight remote datastore (e.g., serverless edge KV / edge SQL).
    *   Must be strictly limited to aggregating anonymous vote tallies; no user tracking, advertising beacons, fingerprinting, or personal profile data.

---

## 6. STATUS SNAPSHOT

This status snapshot is the absolute boundary for future agents and developers.

### IMPLEMENTED NOW
*   Static vanilla TypeScript + Vite + modern CSS client application. `npm run typecheck` and `npm run build` pass clean.
*   **Wall of Lives** with 12 initial cards, `SHOW ME SOMETHING STRANGER` (second 12), and `SHOW ALL 24`.
*   Card rendering with cycling warm paper tones and local SVG symbolic illustrations.
*   Premise-first card presentation (`THERE IS ALREADY A BOOK IN WHICH…` + hook).
*   Literary titles displayed inside the book view (`BookView`) and on shelf spines, never on the Wall.
*   Discovered book view with `YOU FOUND THE BOOK`, full 4-field coordinates, `This book was already here.`, the consultation note, passage, aftertaste, nearby volumes and the shelf walk.
*   **The full 72-volume canonical catalog:** 24 root lives on the Wall, 48 nearby volumes reachable only from inside a book, exactly two nearby volumes each, passages of 113–155 words. Validated at load time: ID syntax, duplicate identities, unresolved edges, edges leaving their root life, unlabelled edges, and a wall that is not exactly the set of roots.
*   Nearby volumes navigation naming specific differences from the current passage.
*   **A wall dealt fresh each visit:** the two curated sets of twelve shuffled separately, the order drawn once and held, so cards never move while the visitor reads. Nothing stored; a reload deals again.
*   **One shelf with two readable volumes:** a single frozen shelfmark, implemented as a transposition of two addresses, so that one walk along a shelf finds two strangers standing together.
*   **A page at every unreadable address:** `LOOK INSIDE` on the address view, 192 symbols of the Library's 25-symbol alphabet, fixed for that address by splitmix64 over its position, hidden from assistive technology behind a line that describes it.
*   **Navigable address space:** `#shelf=` and `#volume=` routes, a shelf view of thirty-two spines, an address view for addresses holding nothing legible, and volume-by-volume walking in both directions.
*   Deterministic 64-bit coordinate mapping using BigInt linear congruential arithmetic, invertible in both directions.
*   Deterministic `SHOW ME ANOTHER LIFE` sequence cycling between distinct clusters.
*   Pure hash routing with browser history integration and invalid address handling.
*   Zero backend, zero AI generation, zero user tracking, zero data collection, zero persistence.

### KNOWN GAPS
*   **Two views are untested.** Everything below them is covered, and `WallOfLives`, `ShelfView` and `AddressView` have cases of their own (see section 2); `BookView`, `NearbyVolumes` and the illustrations are exercised only by reading the page.
*   **The book view has not been walked in a browser, and no screen reader has been used at all.** Chromium at 320 / 390 / 1440 px covers the wall, the shelf and the address view: no horizontal overflow anywhere, the page at an unreadable address opens on request and takes focus, the shelfmarked shelf shows both spines, and the wall's deal survives opening a life, browser Back, `SHOW ALL 24` and repeated redraws while a reload deals again.
*   The final-hexagon boundary condition described in section 2.
*   No hosting or deployment. The build produces a static bundle and nothing publishes it.

### APPROVED NEXT
*   Nothing pending. The 72-volume migration and the address layer are shipped; the next approved item is whatever gets promoted out of section 5, or the closing of a known gap above.

### PLANNED LATER
*   `RATE THIS BOOK` interaction on book pages.
*   `ALL TIME` and `THIS WEEK` ranked views on the Wall.
*   Statistical confidence-weighted ranking algorithm (Wilson score / Bayesian average).
*   Minimal, anonymous serverless persistence strictly for rating aggregation.
