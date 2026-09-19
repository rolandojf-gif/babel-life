# 1. Product Thesis

An intimate reading experience in which visitors find books describing writable versions of a life.
Its central interaction is finding a nearby book: one detail changes, and another life fits on the shelf.
Precisely authored fragments make the Library’s scale felt through repetition and difference.
The visitor chooses what to look for, never what happens to a simulated person.
The Library includes accounts of the actual future but provides no way to recognize them.
The experience ends at that limit, with an invitation to keep searching.
Build a small, curated window into an imagined Library, not a computational reproduction of it.

# 2. MVP Experience

Target a coherent first visit of roughly three to six minutes; nothing is timed or compulsory. English only. No name, age, biography, account, or free-text prompt. The Library does the imaginative work: it presents a strange, specific premise; curiosity prompts a click; the book is found; only then does the visitor consider what its existence implies. Never ask visitors to invent a life, choose an ambition, formulate a variation, or understand the premise before entering.

**State 1 — The threshold.** A single column opens with “Somewhere in the Library, there is a book in which…” followed by an accessible native scenario select and the primary action **FIND THE BOOK**. The default is the 47-second football scenario. Initially offer four seeds from section 4, in order 01, 03, 05, 06. Treat the selector as a curated curiosity device: show the complete provocative premises from section 4, never category names, setup questions, or a “choose a scenario” placeholder. The default already supplies an irresistible possibility, so the visitor can immediately click FIND THE BOOK. Keep the selected premise readable in full; if the native select truncates it, repeat it as plain wrapping text directly beneath the select, with the duplicate hidden from assistive technology. A quiet footer says “After Jorge Luis Borges.” No opening tutorial, imagery, navigation menu, or philosophical introduction.

**Optional secondary action — SHOW ME SOMETHING STRANGER.** Place a quiet text button below FIND THE BOOK on the chooser only. It selects the next authored premise in the fixed editorial order among currently available scenarios; it does not open a book. From the default football scenario (03 / b0003), it advances to forgotten afternoon (05), then cup (06). If the visitor manually selects Oscar (01), it advances to football (03). The new premise is immediately visible, and FIND THE BOOK remains the primary action. There is no randomness, generation, loading flourish, automatic advance, or endless loop. At the last available premise, omit this action; the selector still allows revisiting earlier possibilities. The shortcut neither unlocks shelves nor changes reading progress. After returning from a book or opening a further shelf, it works with the same selector and its current selection.

**State 2 — A book.** The selected fragment appears beneath a small Library coordinate and the label “A passage from the book.” Show the entire short passage at once. Beneath it: “This book exists.” The primary action becomes **FIND A NEARBY BOOK**. Secondary actions are **Look for another book**, **Copy book link**, and **Why?**. Finding is an immediate lookup with a brief crossfade, not a simulated search process. Coordinates stay visible and selectable.

**State 3 — Nearby.** The primary action reveals an inline list of adjacent books. Each choice names one difference; choosing it opens that complete passage. Preserve the parent’s wording except where the stated difference requires a change. Under the new passage, show a small, external annotation: “Different here: …”. It is not part of the book. **Return to the previous book** allows comparison without a split-screen UI. Every book offers another nearby route; the graph can contain cycles. No claim that the implementation enumerates infinitely many books.

**State 4 — Further shelves.** After the visitor follows the first nearby edge, reveal **Further into the Library** below the normal controls. Choosing it returns to the same scenario selector with seeds 08 and 07 now available in that order, selects 08, and adds the sentence “The difference need not be large.” Existing scenarios remain available. Opening either 07 or 08 reveals **Further still**; that action adds seeds 10–12 and selects 10. No lock icons, progress meter, congratulation, or requirement to read every book. The presentation escalates from accessible improbability and extreme specificity to tiny differences, disproportionate consequences, self-reference, future, mortality, and the Real Book. This is editorial pacing, not a requirement to read every option. The deeper shelf presents the forty-year letter first, then the train’s thirty-year consequence; the final shelf presents self-reference, future, then mortality.

**State 5 — This moment.** Seed 10 describes finding and reading a book on this site. It uses only a short, fixed passage; a separate marginal note can reflect the first scenario actually chosen in the current session. The visitor may then find the nearby book in which they close the tab. A quiet **I’m still here** action finds a third book describing continued reading. Its nearby book changes continued reading into rereading the same sentence. It does not say it knew what would happen, infer motives, detect closing, or attempt to prevent departure.

**State 6 — The limit.** Once any seed 10–12 or its nearby book has been opened, display **FIND MY REAL BOOK**. This opens a dedicated final view, not an identified book:

> THE BOOK EXISTS.
>
> THE LIBRARY CANNOT TELL YOU WHICH ONE IT IS.

Below, in ordinary sentence case: “Every writable account of what happens is here. So is every account that gets it wrong.” Primary action: **KEEP SEARCHING**. It returns to the selector with all shelves available and the previous selection retained. Secondary action: **Return to the book**. Never provide a coordinate, fragment, predicted outcome, or confidence score for “the real book.”

**Optional explanation, available throughout.** **Why?** expands one short step at a time under the passage. It never blocks exploration:

| Visitor’s action | Text revealed | Next action |
| --- | --- | --- |
| Why? | Because this story can be written. | But it never happened. |
| But it never happened. | That doesn’t matter here. | Explain. |
| Explain. | Imagine a library containing every finite text: every account of a life, every variation, every error. | Then which one is true? |
| Then which one is true? | Being on a shelf is not evidence. The Library contains the contradiction, too. | About this Library |
| About this Library | This is a curated reading experience inspired by Borges. Its passages are authored, and its coordinates belong to this edition. It cannot identify anyone’s future. | Close |

Opening a new book collapses the explanation. A persistent footer **About this Library** can open the final explanation directly. Preserve this honest disclosure without making it the opening experience.

**Shared entry and failures.** A valid shared URL opens that exact passage immediately, even on a deeper shelf. It grants the shelf access needed to continue from there. It does not fabricate prior choices. Invalid or unknown book URLs show “This address is not in this edition.” and **Enter the Library**; do not silently substitute a book. The threshold remains usable if local storage is unavailable. Without JavaScript, show a short static premise and a plain notice that the interactive Library requires JavaScript.

# 3. Key Product Decisions

- **Choose A: curated scenarios and curated fragments.** Precision, repeated wording, and controlled differences are the product. LLM prose would add latency, cost, and tonal variance while weakening “found, not generated.” The MVP has no AI calls, custom prompts, or generated filler. Deterministic retrieval does not require an AI model.
- **Depth over breadth.** Nine base scenarios and 28 books, with five-book football and tomorrow clusters and four-book train and self-reference clusters. Repeatedly finding a close variation should be more rewarding than choosing another premise. The remaining five scenarios each have one nearby book.
- **Show passages, not full biographies.** Each book has one immutable, authored passage of 20–65 words, with at most three short paragraphs. A seed can be shorter when specificity carries the idea. No fabricated page count, unreadable noise pages, or “read the complete book” action. The book beyond the passage is part of the literary premise, not hidden application data.
- **The Library is a thought experiment about finite writable accounts.** It need not contain an infinitely detailed physical life in a finite volume. Do not claim this app stores every text or that Borges’ particular fixed book format accommodates every possible length. The optional explanation explicitly uses an imagined library of every finite text.
- **Nearby means one meaningful textual difference, not an adjacent physical address.** Editorial relationships define nearby books. They may imply radically different consequences. A wording change alone does not establish a uniquely determined alternate world. The interface says what differs in the passage; it does not claim every unwritten event is identical.
- **Finding never creates an outcome.** Choices are search criteria. Avoid “choose your fate,” “your next move,” branching dialogue, character statistics, or actions presented as changing a life. Use “find,” “book,” “passage,” and “another account.” Never use “generating your life” or equivalent status language.
- **Progression reveals invitations.** Three shelf depths, two deliberate “further” actions, and no hidden counters beyond the explicit events in section 5. Shared links bypass gating. No achievements, streaks, collection percentage, or “complete all books.”
- **Self-reference is modest and verifiable.** Fixed book text plus a separate, local observation about a real choice. No individualized biography, reading-time inference, surveillance flourish, or claim that all prior choices were predicted. The strongest effect comes from the visitor recognizing a sentence, not a technical trick.
- **Mortality is optional and non-graphic.** It is selected explicitly from a clearly worded scenario. Never invent an actual death date, cause, or last words. The Real Book is reachable without opening mortality content.
- **Visual direction: a reading room, not a world map.** Warm off-white background, near-black text, muted gray coordinates, system serif passage typography and system sans-serif controls. Maximum reading width 38rem, 20px minimum mobile side padding, generous vertical space, passage size approximately 22–28px, line height around 1.5. Use a single thin rule to separate passage and controls. No textures, 3D rooms, particles, audio, animated stars, book cover illustrations, or theme picker.
- **Motion is punctuation.** One opacity transition of about 160ms on book changes; no typewriter effect, artificial delay, scrolling coercion, or animated coordinate scrambling. Reduced-motion preference removes transitions. All content is available immediately.
- **Success is comprehension, not duration.** In five informal usability sessions, at least four visitors should find a book unaided within ten seconds, describe nearby books as variations, and understand after the ending that the Library cannot predict their future. Ask these questions after exploration, never inside the experience. No analytics service in the MVP.

# 4. Content Model

There are nine base scenarios on three editorial shelves: **threshold** (01, 03, 05, 06), **difference** (07, 08), and **limit** (10, 11, 12). These names organize content internally; they are not visible level labels. Keep the retained scenario IDs rather than renumbering them. Seeds 02, 04, and 09 are removed: the astronaut, whispered-sentence coincidence, and comma-only biography give way to deeper variations of the strongest premises. Only one of nine seeds is a conventional aspiration.

Exactly 28 books remain. These are pre-publication editorial revisions: draft IDs formerly assigned to removed passages are reassigned explicitly below. This does not authorize reassigning a published book ID. Store every passage as complete literal text in the catalog; replacement instructions here define editorial copy, not runtime behavior. Do not expand the passages into stories.

**Base scenarios.** Only the visible selector text below is rendered as an option; categories remain internal metadata. Each line must provoke curiosity even when seen alone. Selector text completes the opening sentence and promises only what the authored book actually contains. Preserve precise quantities and ordinary physical events; improbability does not need supernatural suggestion.

Use the fixed editorial order **01 → 03 → 05 → 06 → 08 → 07 → 10 → 11 → 12**, filtered by available depth, for both the selector and SHOW ME SOMETHING STRANGER. Assign the existing scenario order field accordingly, while keeping b0003 (football) selected by default when the site opens. The football default combines a familiar activity with extreme specificity; the Oscar option offers an immediately legible oddity, not a career-selection menu. The cup supplies the smallest physical difference; the letter and train expose disproportionate consequences. Keep the cup’s ordinary day intact: do not advertise a radically changed life that its passage does not contain. Later labels turn toward the act of reading, the future, and the last ordinary sentence. No added scenarios or altered book identities are needed.

| Seed / base book | Internal category | Visible selector text | Base passage |
| --- | --- | --- | --- |
| 01 / b0001 | Familiar | **you win an Oscar, but the speech you rehearsed for eleven years is in a coat at home.** | You win an Oscar. The speech you have rehearsed for eleven years is in the pocket of a coat you left at home. You thank the person who lent you a pen. |
| 03 / b0003 | Hyper-specific | **at 27, despite never having played professional football, you play exactly 47 seconds of a top-flight match.** | At twenty-seven, you make your professional debut in a top-flight match. You touch the ball once. Exactly forty-seven seconds after you enter, the referee ends the match. You never play professionally again. |
| 05 / b0005 | Hyper-specific | **every day of your life is right except one Tuesday afternoon you cannot remember.** | Every remembered event is recorded correctly. On a Tuesday afternoon you cannot remember, the book says you walked to the river. The next morning is correct again. |
| 06 / b0006 | Tiny variation | **every detail of your life matches until tomorrow’s breakfast: the cup is one centimetre farther left.** | Until tomorrow morning, the account matches your life. At breakfast, you put a cup one centimetre farther left. The next sentence describes an ordinary day. |
| 07 / b0007 | Causal divergence | **you miss the 08:14 by nine seconds and meet the person you will live with for thirty years.** | You reach the 08:14 nine seconds after its doors close. Waiting for the next train, you meet the person you will live with for thirty years. You both remember the platform differently. |
| 08 / b0008 | Diverging lives | **at 59, you receive a letter asking you to come back. It was written when you were 19.** | A letter written when you were nineteen reaches you at fifty-nine. It asks you to come back. You sit down before opening the second page. |
| 10 / b0010 | Self-reference | **you find a book describing you finding a book and reading this very sentence.** | You open a website about a library. You find a book. In it, someone opens a website about a library and finds a book. You read the next sentence. This one. |
| 11 / b0011 | Future | **exactly seventeen years from now, you return to this website looking for a sentence you remember incorrectly.** | Exactly seventeen years after opening this website, you return to its address. You remember one passage incorrectly. You look for it using the word you remember. |
| 12 / b0012 | Mortality | **the last ordinary sentence you will ever say is written down. On the next line, someone answers.** | The book records the last sentence you ever say. It is an ordinary sentence. On the next line, someone answers. Nothing on the page marks it as the last. |

**Football — five books.** The professional debut establishes that there were no previous professional appearances. Exact elapsed time makes the 47-second premise unambiguous. The following are complete variant passages, not actions offered to the footballer.

| Book | Difference from b0003 | Passage |
| --- | --- | --- |
| b0015 | You never touch the ball. | At twenty-seven, you make your professional debut in a top-flight match. You never touch the ball. Exactly forty-seven seconds after you enter, the referee ends the match. You never play professionally again. |
| b0016 | The referee ends the match one second earlier. | At twenty-seven, you make your professional debut in a top-flight match. You touch the ball once. Exactly forty-six seconds after you enter, the referee ends the match. You never play professionally again. |
| b0017 | The match ends before you enter. | At twenty-seven, you wait to make your professional debut in a top-flight match. You stand at the touchline for exactly forty-seven seconds. The referee ends the match before you enter. You never play professionally. |
| b0018 | Your only touch scores. | At twenty-seven, you make your professional debut in a top-flight match. You touch the ball once and score. Exactly forty-seven seconds after you enter, the referee ends the match. You never play professionally again. |

The no-entry alternative changes several sentences to preserve consistency. It changes the event of entering, not merely a character in the text. Scoring does not add a career, fame, or a changed final result that the passage never specifies.

**Tomorrow — five books.** Start with b0006. Each variant repeats it exactly, replacing only the position phrase specified below. All retain the ordinary day. A tiny difference need not cause a catastrophe or a revelation to deserve another book.

| Book | Exact position phrase replacing “one centimetre farther left” |
| --- | --- |
| b0002 | one millimetre farther left |
| b0004 | one millimetre farther right |
| b0021 | one centimetre farther right |
| b0009 | in exactly the same place as today |

The last replacement includes “in”: the complete sentence is “At breakfast, you put a cup in exactly the same place as today.” The nearby chain changes distance, then direction, then distance again, then whether the cup moves at all. No spill, hidden cause, or biographical consequence is inferred.

**Train — four books.** Preserve the doors closing as the timing boundary. b0014 and b0022 differ by two seconds of arrival time; one account contains the thirty-year relationship and the other explicitly does not. These are authored possible accounts, not a causal model claiming such a result is inevitable in reality.

| Book | Difference | Complete passage |
| --- | --- | --- |
| b0014 | You arrive eight seconds earlier but still miss it. | You reach the 08:14 one second after its doors close. Waiting for the next train, you meet the person you will live with for thirty years. You both remember the platform differently. |
| b0022 | You arrive just before the doors close; the relationship never begins. | You reach the 08:14 one second before its doors close. You board. The person you would have lived with for thirty years waits on the platform. You never meet. |
| b0019 | You miss it by the same second, but neither person speaks. | You reach the 08:14 one second after its doors close. Waiting for the next train, you stand beside the person you would have lived with for thirty years. Neither of you speaks. You never meet again. |

b0014 is a stepping stone to a different life, not the whole causal demonstration. Compare b0014 with b0022 to make the two-second difference unmistakable; compare b0014 with b0019 to separate physical proximity from an encounter. Consequential sentence changes are necessary and should be visible; do not label either pair “only one word differs.”

**Self-reference — four books.** b0010 is the base. b0025 repeats b0010 exactly, replacing “You read the next sentence. This one.” with “You close the tab after reading the next sentence. This one.” The other two books are:

| Book | Difference | Complete passage |
| --- | --- | --- |
| b0026 | You keep reading after the book about closing the tab. | You open a website about a library. You find a book in which you close the tab. You keep reading. There is a book for that, too. |
| b0024 | You read the same sentence again instead of moving on. | You open a website about a library. You find a book in which you close the tab. You read the same sentence again. There is a book for that, too. |

**I’m still here**, offered only on b0025, follows the ordinary edge to b0026. From there the visitor can find b0024 and return through the nearby graph. Do not add another special control or detect rereading. Every passage remains hypothetical literary text; only the explicit I’m still here click is observed. No joke, accusation, prediction, inferred motive, or action on tab closure.

**Other pairs.** Each repeats its base passage exactly with the single replacement shown. These retain range without competing with the four deeper clusters.

| Base | Nearby book | Exact replacement |
| --- | --- | --- |
| b0001 | b0013 | “eleven years” → “eleven minutes” |
| b0005 | b0020 | “walked to the river” → “stayed in the kitchen” |
| b0008 | b0023 | “at fifty-nine” → “at nineteen” |
| b0011 | b0027 | “seventeen years” → “seventeen minutes” |
| b0012 | b0028 | “someone answers” → “no one answers” |

**Fixed graph and inventory.** Nine bases plus nineteen variants: football 5, tomorrow 5, train 4, self-reference 4, and five other pairs totaling 10. All accession numbers b0001–b0028 appear exactly once. Variants inherit their base scenario’s shelf regardless of their accession number; never infer depth or base status from the number.

Each pair below defines edges in both directions. Within a book’s list, order destinations by the row in which the pair appears. Use the direction-appropriate label as the difference note after traversal, without duplicating “Different here:”. Do not add all-to-all edges: the specified chains keep comparisons precise and make it possible to keep following a thread. The special I’m still here action is an additional trigger for an existing edge, not another book.

| From | To | Forward label / difference note | Reverse label / difference note |
| --- | --- | --- | --- |
| b0003 | b0015 | You never touch the ball. | You touch the ball once. |
| b0003 | b0016 | The match ends one second earlier. | The match ends one second later. |
| b0003 | b0017 | The match ends before you enter. | You enter and play forty-seven seconds. |
| b0003 | b0018 | Your only touch scores. | The passage records your touch without a goal. |
| b0015 | b0017 | You never enter the pitch. | You enter but never touch the ball. |
| b0006 | b0002 | The cup moves nine millimetres less to the left. | The cup moves nine millimetres farther left. |
| b0002 | b0004 | One millimetre right instead of left. | One millimetre left instead of right. |
| b0004 | b0021 | The cup moves nine millimetres farther right. | The cup moves nine millimetres less to the right. |
| b0021 | b0009 | The cup stays in today’s position. | The cup moves one centimetre right. |
| b0009 | b0006 | The cup moves one centimetre left. | The cup stays in today’s position. |
| b0007 | b0014 | Eight seconds earlier; you still miss it. | Eight seconds later; you still meet. |
| b0014 | b0022 | Two seconds earlier; you catch it and never meet. | Two seconds later; you miss it and share thirty years. |
| b0007 | b0022 | Ten seconds earlier; you catch it and never meet. | Ten seconds later; you miss it and share thirty years. |
| b0014 | b0019 | Neither of you speaks; the relationship never begins. | You meet and share thirty years. |
| b0010 | b0025 | You close the tab after the next sentence. | You read the next sentence. |
| b0025 | b0026 | You keep reading after the book about closing the tab. | The book says you close the tab after the next sentence. |
| b0026 | b0024 | You read the same sentence again. | You keep reading. |
| b0010 | b0026 | You find the book about closing the tab, then keep reading. | You find the book that contains this sentence. |
| b0001 | b0013 | You rehearsed for eleven minutes. | You rehearsed for eleven years. |
| b0005 | b0020 | You stayed in the kitchen that afternoon. | You walked to the river that afternoon. |
| b0008 | b0023 | The letter arrives at nineteen. | The letter arrives at fifty-nine. |
| b0011 | b0027 | You return seventeen minutes later. | You return seventeen years later. |
| b0012 | b0028 | No one answers. | Someone answers. |

**Editorial rules.** Keep second person as the book’s literary voice, not a factual assertion about the reader. Book text does not change with visitor age, clock, location, history, or reload. “Tomorrow” and “seventeen years later” are relative within the account; do not replace them with dates. Do not print the visitor’s real final sentence. No inspirational lessons, melodrama, protagonist names, dialogue trees, or borrowed Borges passages. Book labels, UI explanations, coordinates, and observations are separate from immutable passage text.

# 5. Interaction / State Machine

Use one small explicit controller, not a state-machine dependency. Primary states are **chooser**, **book**, **realBook**, and **invalidAddress**. Inline **nearbyOpen** and **explanationStep** are subordinate UI state. There is no asynchronous “finding” state because retrieval is local.

| Current state / event | Result and state effects |
| --- | --- |
| Initial root entry | chooser; default b0003; use valid stored shelf depth if available. |
| chooser / select scenario | Update selected scenario and its fully readable premise only; no book visit yet. |
| chooser / SHOW ME SOMETHING STRANGER | Select the next currently available scenario in the fixed editorial order; remain in chooser; no route, history entry, book visit, first-choice record, or progression change. Omit the action when no later available option exists. |
| chooser / FIND THE BOOK | book for selected base ID; write route; set firstChosenScenarioId only if absent; close subordinate panels. |
| book / FIND A NEARBY BOOK | Open inline list; do not change passage or route. Repeat activation collapses it. |
| book / choose nearby edge | book for target ID; set previousBookId to source; mark hasFollowedNearby true; close subordinate panels; write route. |
| b0025 / I’m still here | Follow its edge to b0026 using the same rules. |
| book / return to previous book | Open previousBookId and replace that pointer with current ID; supports immediate comparison without a history stack. |
| book / first further action | If depth is 0 and hasFollowedNearby, set depth 1; chooser with seed 08 selected. |
| book / second further action | If depth is 1 and hasSeenDifference, set depth 2; chooser with seed 10 selected. |
| Any book entry | Raise depth to at least the book’s shelf; set hasSeenDifference for depth-1 books and hasSeenLimit for depth-2 books. Flags stay true. |
| book / Look for another book | chooser; retain selection and available depth. |
| book / Why? or next explanation action | Advance inline explanation only; no history or progression effect. |
| book / FIND MY REAL BOOK | Allowed when hasSeenLimit; realBook; remember source book for return. |
| realBook / KEEP SEARCHING | chooser; depth 2; retain selected scenario. |
| realBook / Return to the book | Return to source book; if absent, chooser at depth 2. |
| Valid book URL / reload / browser history | Resolve exact ID; book; derive minimum depth from book; reset inline panels; do not invent a previousBookId or first choice. |
| Invalid hash or unknown ID | invalidAddress; preserve URL until visitor chooses Enter the Library. |

**Availability rules.** Reveal the first further action after following an actual edge, not merely expanding the list. Reveal the second after opening any difference-shelf base or variant. Show the Real Book action on any book once hasSeenLimit is true. Opening a shared difference book makes **Further still** available immediately; opening a shared limit book makes **FIND MY REAL BOOK** available immediately. Ordinary controls remain present.

**Curiosity shortcut rules.** Use the existing selectedScenarioId, scenario order, and depth; add no queue, feed, random seed, counters, or persistence. The threshold editorial order is 01 → 03 → 05 → 06. A fresh chooser defaults to football (03 / b0003), so the shortcut advances to forgotten afternoon (05), then cup (06), and stops. If the visitor manually selects Oscar (01), the next step is football (03). At depth 1, the order continues with 08 → 07; at depth 2, with 10 → 11 → 12. Manual selection changes the starting point for the next step. The shortcut never wraps, advances itself, opens a passage, or counts as following a nearby edge. Only FIND THE BOOK records the first actual search. Selecting mortality, whether manually or through this shortcut, displays its explicit premise before the visitor decides to find it; it never opens that passage without confirmation through the normal find action. Keep the shortcut off BookView so FIND A NEARBY BOOK remains the central reading interaction.

**Navigation rules.** Routes are root/empty hash for chooser, `#book=b0003` for a book, and `#real` for the ending. Use hash navigation and its browser history behavior; no router package. All deliberate view changes create history entries; initial parsing never creates a duplicate. Reopening the current URL is a no-op. A direct `#real` visit is permitted and sets depth 2. Browser Back and Forward restore the addressed view without replaying effects or creating additional entries. “Return to the previous book” is a separate comparison action, not a substitute for browser navigation.

**Session observation.** Only the first explicit FIND THE BOOK selection sets firstChosenScenarioId. On b0010 and its variants, if that field exists, show outside the passage: “Your first search here: [scenario label].” This is a local session note, does not affect book identity, and never appears in a copied URL. If absent, omit it. Do not build an interaction transcript or interpolate history into book text.

**Input and accessibility.** Native select, buttons, and links; visible keyboard focus; inline list with a descriptive heading; minimum 44px touch targets. On view changes, focus the main heading or passage container without producing duplicate screen-reader announcements. Expanding nearby choices leaves focus on the trigger, with the next tab stop entering the list; use expanded-state attributes. A polite status region announces copy success/failure and the newly selected premise after SHOW ME SOMETHING STRANGER. Keep focus on the shortcut after selection; if the last available selection removes it, move focus to FIND THE BOOK. Normal document scrolling, usable at 200% zoom, no horizontal overflow at 320px. No modal dialogs are necessary.

# 6. Technical Architecture

**Frontend: vanilla TypeScript and Vite, with plain CSS.** No frontend framework. Four views, a static catalog, and a small controller do not justify a component framework, router, global-state library, animation library, or UI kit. Use native DOM rendering and event handling with a clean view boundary. Set text through safe text APIs; never interpret content or URL values as HTML. This is the implementation target; the blueprint is not evidence that dependencies already exist in the repository.

**Runtime: entirely client-side.** Build static assets. No application server, API, database, authentication, cloud functions, network search, or CMS. A generic static host can serve the eventual build; hosting selection and configuration are outside these phases. Hash URLs avoid rewrite rules. Use system fonts and no externally fetched assets.

**Content: one committed JSON catalog.** Store the 28 complete passages explicitly, not as runtime mutation instructions. Store scenario records, ordered edges, and copy separately inside that catalog or the small copy module indicated in section 9. TypeScript types document the shapes, and catalog validation rejects invalid references or duplicate identities before a release. No build-time content service or generated catalog.

**Persistence: one optional localStorage entry.** Store only schema version and maximum discovered depth under `babel-life:progress:v1`. Restore valid depths 0–2. Invalid JSON, unknown versions, invalid values, quota errors, or denied storage revert safely to memory-only operation. Do not persist observation notes, names, tracking identifiers, or history. Current book is already represented by the URL. firstChosenScenarioId and progression flags live only in memory; stored depth controls shelf visibility after reload. A reload of a difference or limit book restores relevant flags from that book.

**Identity: immutable catalog accession numbers.** Give each book the permanent ID assigned in section 4: lowercase `b` plus four decimal digits, b0001 through b0028. The catalog is the registry; IDs are never inferred from array position, randomly assigned at runtime, or recycled. Rendering the same record always yields the same passage and identity across sessions and devices. Correcting published passage text creates a new ID and retains the old record and URL. Scenario order, UI labels, and edge labels may change without changing a book. Before the first release, editorial revisions can retain the draft IDs. Future IDs append to the registry.

**Coordinates: deterministic, reversible display mapping.** Retain the existing internal identity mapping: parse the decimal accession number as integer n; compute x = (n × 11400714819323198485 + 1442695040888963407) modulo 2^64 using BigInt arithmetic. The visible address is **Hexagon · Wall · Shelf · Volume**, with a compact hexagon identifier and small decimal location numbers. It is a symbolic index for this edition, not a reproduction of Borges’ geometry.

For the display only, divide x into groups of 640 positions (4 walls × 5 shelves × 32 volumes). Hexagon is the integer quotient x / 640, rendered in uppercase base 36 without padding. Let r be x modulo 640. Wall is the integer quotient r / 160 plus 1; Shelf is the integer quotient (r modulo 160) / 32 plus 1; Volume is (r modulo 32) plus 1. Render Wall, Shelf, and Volume as unpadded decimal integers. Format as “Hexagon [identifier] · Wall [1–4] · Shelf [1–5] · Volume [1–32]”, wrapping at separators on mobile. Bracketed fields here are specification placeholders, never displayed literally.

This preserves all 64 bits and the existing one-to-one mapping: the odd multiplier gives unique x values, and the quotient/remainder fields lose no information. Freeze this display convention for the first published edition. Use BigInt throughout the arithmetic; never floating-point Number arithmetic. Do not show accession arithmetic, a hexadecimal digest, a decoder, or explanatory math in the visitor interface. No coordinate input/search interface is needed.

Accession IDs are intentionally simpler than content hashes: an explicit immutable registry is sufficient for 28 curated records and avoids normalization, collision handling, and hash-routing machinery. The coordinate mapping preserves all 64 bits; it is not a truncated hash. Nearby edges need not yield numerically close coordinates. If asked in the optional explanation, “Nearby in wording, not necessarily on the shelf.”

**Sharing: canonical book URLs.** Copy the current page’s origin and pathname plus `#book=<id>`, excluding all query parameters and session information. Every book, including self-reference and mortality records, is shareable without a prior visit. Show the same text to sender and recipient. Use Clipboard API on explicit click; if unavailable or rejected, reveal a selectable read-only URL field with “Copy this address.” Do not depend on native sharing or custom social preview cards. The ending is not a book and has no Copy book link.

**Future AI: deferred, with no scaffolding.** Do not add an SDK, API key placeholder, server endpoint, prompt format, provider interface, or empty adapter. If a later product decision allows custom searches, treat model output as a candidate authored passage, never verification of truth or a forecast. Reopening such a passage would require immutable stored text and an accession registry; replaying a model call would not provide stable identity. That is a separate architecture decision, not part of this MVP.

**Verification tooling.** Use Vitest for focused identity, catalog, and controller tests once those modules exist. Do not add browser automation dependencies for the initial MVP. Complete the manual browser matrix in phase 5. Type checking and production build must pass for each executable phase. No deployment work is authorized by this blueprint’s build phases.

# 7. Data Model

No implementation code is prescribed here. These are the minimum logical shapes and invariants.

| Entity | Fields | Rules |
| --- | --- | --- |
| Catalog | schemaVersion; scenarios; books | schemaVersion = 1; IDs unique within entity type; all references resolve. |
| Scenario | id; selectorText; category; depth; order; baseBookId | IDs s01, s03, s05, s06, s07, s08, s10, s11, s12; depth 0, 1, or 2; explicit order; one base book per scenario. category is editorial metadata, never a filter UI. |
| Book | id; scenarioId; passage; neighbors | One complete immutable plain-text passage; depth inherited from scenario; every book has at least one neighbor. Coordinates derived, never stored. |
| Neighbor edge | targetBookId; label; differenceNote | Ordered within source; target differs from source; unique target per source; label names the destination difference; differenceNote works below that destination when traversed from this source. |
| In-memory session | depth; hasFollowedNearby; hasSeenDifference; hasSeenLimit; firstChosenScenarioId | depth is monotonic; flags record actual events this session; nullable first choice; no personal data. |
| In-memory UI | view; selectedScenarioId; currentBookId; previousBookId; sourceBookIdForReal; activeDifferenceNote; nearbyOpen; explanationStep; copyStatus | IDs nullable where inapplicable; reset passage-specific transient values on book changes. Direct URL entry has no activeDifferenceNote. |
| Stored progress | schemaVersion; depth | Version 1, integer depth 0–2 only; ignore all other fields. |

Do not add a User, Life, Simulation, Prediction, Achievement, Inventory, or GeneratedNarrative entity. The distinction between immutable books and mutable presentation state is mandatory. A book can be reached by different edges without changing its text or identity.

Validate the exact required inventory, neighbor relationships, allowed depths, ID syntax, nonempty passages, and absence of duplicate complete passages assigned to different IDs. An identical passage should refer to its existing book. Ensure the ordinary replacement instructions were expanded into literal complete passages before release. Character-for-character repetition is intentional.

# 8. UI Component Map

These are rendering responsibilities, not a mandate for framework components. Keep six small view modules/functions:

1. **AppShell** — reading column, main landmark, footer, visual tokens, route/controller wiring, and invalid-address fallback.
2. **ScenarioChooser** — opening line, fully readable authored premises, native selector filtered by availability and ordered as in section 4, primary find action, secondary SHOW ME SOMETHING STRANGER, and the single further-shelf introductory sentence when relevant. Category names are never visible. No cards or carousel.
3. **BookView** — coordinates, passage, optional difference/session annotations, normal actions, copy fallback, and contextual deeper/Real Book invitations.
4. **NearbyBooks** — inline ordered destinations and collapse behavior; special continuation action for b0025. No graphical branching tree.
5. **ExplanationThread** — short progressive disclosures plus direct About entry; usable from the footer or book view.
6. **RealBookView** — final copy, keep searching, return action; no coordinate or artificial loading state.

The same BookView handles base, nearby, self-referential, future, and mortality books. Do not create one view per seed. Coordinates are a text formatter, not a standalone feature subsystem.

# 9. Repository Structure

This is the intended structure for implementation, not a statement that these files already exist. This planning pass creates or changes only this blueprint. Preserve unrelated existing repository content.

```text
docs/
  BLUEPRINT.md
index.html
package.json
package-lock.json
tsconfig.json
src/
  main.ts
  styles.css
  content/
    catalog.json
    copy.ts
  library/
    model.ts
    catalog.ts
    coordinates.ts
    controller.ts
    routing.ts
    persistence.ts
  views/
    AppShell.ts
    ScenarioChooser.ts
    BookView.ts
    NearbyBooks.ts
    ExplanationThread.ts
    RealBookView.ts
tests/
  catalog.test.ts
  coordinates.test.ts
  controller.test.ts
  routing.test.ts
  persistence.test.ts
```

Use Vite’s default behavior without a config file unless a demonstrated requirement needs one. No backend directory, public asset collection, environment secrets, deployment manifests, services layer, dependency-injection framework, or generic design-system package. npm is the package manager for a fresh repository; if an existing lockfile establishes another manager, retain it and its lockfile instead of introducing a second one.

# 10. Build Plan for Claude Opus

Execute one phase per user instruction. Each phase ends with a concise report of deliverables, checks, and any unresolved issue, then stops. Do not begin the next phase automatically. This blueprint is the source of truth; implementation must not silently revise product decisions. Inspect repository instructions and existing files before changing them; preserve unrelated work. These phases authorize implementation only when separately assigned to Opus.

**Phase 1 — The smallest readable interaction**

**Objective:** Prove that a visitor can follow curiosity into an already-existing book without inventing a possibility or configuring a life.

**Concrete deliverables:** Establish the minimal vanilla TypeScript/Vite project, plain CSS, accessible AppShell, ScenarioChooser, and BookView. Add model shapes and a partial catalog containing scenarios 01, 03, 05, 06 and base records b0001, b0003, b0005, b0006 with exact passages from section 4. Implement stable coordinate formatting now. Implement the root chooser and known base-book hash routes, browser navigation, and invalid-address view. Support selecting a fully written premise, FIND THE BOOK, Look for another book, and the chooser-only SHOW ME SOMETHING STRANGER behavior in section 5. Add short static About disclosure and the no-JavaScript fallback. Do not show unavailable actions as disabled placeholders. Use the final visual direction from the outset.

**Acceptance criteria:** Every option shows its complete provocative premise without visible category labels or requiring creative input. The secondary shortcut selects 01 → 03 → 05 → 06 without opening a book, writing history, or looping; from the default football selection (03 / b0003), it advances to 05 then 06; from a manually selected Oscar (01), it advances to 03. It disappears after 06, with focus handled as specified in section 5. FIND THE BOOK stays visually primary. All four scenarios retrieve the correct fixed passage; b0003 is the default; refresh and direct links to those four base books preserve text and coordinates; unknown/malformed IDs show the fallback. Coordinates remain identical across repeat lookups and differ across the four IDs. Keyboard-only selection and reading work at 320px and desktop widths. Type checking and production build pass. Report manual checks; a test framework is not required yet.

**What NOT to do yet:** Nearby records/actions, deeper shelves, progression storage, Real Book, self-reference, full explanation thread, copy-link feature, automated test tooling, AI, backend, deployment, custom assets. Catalog neighbor arrays may be empty in this intentionally incomplete phase; final graph validation arrives in phase 2.

**Phase 2 — Nearby books and the complete catalog**

**Objective:** Make difference, rather than storytelling length, the central interaction.

**Concrete deliverables:** Populate all nine scenarios and 28 immutable book passages. Implement complete graph validation, ordered NearbyBooks, accurate difference annotations, and previous-book comparison. Add the controller foundation and catalog/coordinate/controller tests using Vitest. Only threshold scenarios remain listed on fresh root entry; deeper records must already work by direct URL. Add Copy book link and its manual-copy fallback.

**Acceptance criteria:** The four football variants preserve the professional-debut premise and stated time except where the named difference changes entry or duration. The tomorrow chain remains an ordinary day across all five books. The train comparison b0014 ↔ b0022 explicitly connects a two-second arrival difference with catching versus missing the train and the absence versus presence of the thirty-year relationship. Self-reference supports b0010 → b0025 → b0026 → b0024 through normal nearby links. All edges resolve, cycles remain navigable, source-relative annotations are correct, and opening a URL directly shows no fabricated comparison. Every record has a unique ID, unique coordinate, and a working canonical share URL. Repeated navigation does not alter passage text. Tests cover the exact catalog graph, coordinate field ranges, unpadded formatting, and determinism, fixed coordinate fixtures, boundary arithmetic, return comparisons, and missing IDs. Type checking, tests, and build pass. Fix coordinate fixture expectations independently of the formatter under test; do not derive expected values by invoking it.

**What NOT to do yet:** Shelf invitations, progression storage, contextual observation, special I’m still here action, Real Book, explanation sequence, randomized variations, full biographies, backend or deployment. b0026 is reachable through its normal nearby edge; the special action arrives in phase 4.

**Phase 3 — Deeper discovery and the limit**

**Objective:** Deliver the complete conceptual journey without game-like gates or a lecture.

**Concrete deliverables:** Implement the exact availability rules, the two further actions, optional depth persistence, ExplanationThread, and RealBookView. Add the #real route and source-book return behavior. Add focused routing/persistence tests and progression controller cases. Shared deeper books grant the documented access. Keep the explanation and About text exact unless fixing a clear typographic mistake.

**Acceptance criteria:** Further shelves select 08 and then 10; the curiosity shortcut uses only currently available options and never unlocks a shelf or records a first search. A fresh visitor can follow b0003 → any football neighbor → further → b0007 → further still → b0010 → Real Book without visiting all seeds. A direct b0011 link reaches the ending without invented prior activity. The first further action requires following an edge, not opening its list. Real Book never contains a coordinate or predicted passage. Browser Back/Forward creates no navigation loops. Stored depth restores correctly; blocked, malformed, and obsolete storage never prevents reading. Type checking, tests, and build pass.

**What NOT to do yet:** Personalized passages, session observation or refusal embellishments, analytics, achievements, account persistence, elaborate animation, deployment.

**Phase 4 — The visitor’s present moment**

**Objective:** Make self-reference work precisely, without a false claim of prediction.

**Concrete deliverables:** Track firstChosenScenarioId in memory from the explicit find action only. Add the external first-search annotation on b0010 and all three of its variants (b0025, b0026, b0024). Implement I’m still here on b0025. Confirm fixed future and mortality passages and direct-link behavior. Add controller tests for self-reference and observation boundaries.

**Acceptance criteria:** A fresh shared b0025 link has the exact same passage and coordinate as a navigated visit, but no invented first-search note. Choosing I’m still here opens b0026, and does not modify b0025. Reloading clears the observation; copied URLs never contain it. Opening self-reference by URL does not claim to know any previous choice. No close-tab interception, timers, visibility tracking, death dates, clock interpolation, or fabricated last words exists. Type checking, tests, and build pass.

**What NOT to do yet:** Full interaction transcripts, generated custom text, psychological personalization, tracking, new scenarios, backend or deployment.

**Phase 5 — Reading quality and release readiness**

**Objective:** Verify the complete small experience and remove friction without expanding scope.

**Concrete deliverables:** Finish spacing, responsive text wrapping, visible focus, appropriate focus movement, 160ms opacity transitions, reduced-motion handling, and copy-status announcements. Conduct the manual verification below. Correct defects, not architecture by preference. Report readiness and any usability feedback still needed. Do not publish.

**Acceptance criteria:** Type checking, focused tests, and production build pass. Verify desktop Chrome/Firefox and Safari where available, mobile Safari and Android Chrome where available; explicitly report any untested platform. Test 320px, 390px, and 1440px layouts; 200% zoom; keyboard-only use; one screen reader; reduced motion; denied storage; clipboard failure; refresh on shared URLs; invalid hashes; browser Back/Forward; all three paths to the ending; and a repeat visit with saved depth. No required network calls after static assets load. The full catalog contains exactly the specified initial 28 passages and no unfinished copy. Recruit five people for the comprehension check if users are available; otherwise mark that check pending rather than invent results. There are no critical navigation or accessibility defects in the tested environments.

**What NOT to do yet:** Extra visual effects, new product features, AI integration, custom biographies, visitor metrics infrastructure, service workers, SEO machinery, deployment setup, hosting changes, or publishing. End with a report and stop.

# 11. Risks / Failure Modes

| Failure mode | Concrete prevention / review test |
| --- | --- |
| An AI story generator | No prompt box, model call, generated filler, or long narrative. Confirm every passage resolves to a committed immutable record. |
| A choose-your-own-adventure game | Buttons locate books rather than change a protagonist’s actions. No simulated state, outcome score, reward, or success/failure ending. |
| A gimmicky game | No locks, achievements, counters, collectibles, suspense timers, infinite-scroll feed, tab traps, or teasing refusal copy. Further shelves are invitations. |
| An over-explained Borges website | Opening has one premise and one action. Explanations are optional and short. Attribution does not become biography, literary criticism, or an essay. |
| Visually impressive but conceptually empty | Test comprehension using plain text before adding motion. Nearby differences and the Real Book limit must carry the experience without graphics. |
| Aspiration simulator | Only one familiar fantasy seed. Default to the oddly specific football passage; its modest variants matter as much as scoring. |
| Fortune telling or deterministic prediction | Never identify the real book, invent personal facts, or treat presence in the Library as evidence. Include mutually incompatible accounts and the explicit epistemic limit. |
| Mathematical overclaim | This edition is a curated index into a thought experiment, not a complete enumerator. Finite writable accounts are the premise; coordinates prove neither textual completeness nor truth. |
| Nearby changes feel arbitrary | Preserve wording and specify one semantic difference. Do not rewrite style or imply an independently simulated downstream life. Review the football no-entry and train relationship changes for consistency; downstream wording must agree with the stated event. |
| Small catalog undermines scale | Let minimal edits carry the implication of other possibilities. Never pretend the finite interface offers exhaustive search; disclose the curated edition in About. No fabricated book counter. |
| Self-reference feels dishonest or creepy | Only record an explicit in-session first choice, outside book text. Shared links omit it. No claim to know why someone stayed or when they closed a tab. |
| Identity changes on sharing | Immutable record IDs, fixed coordinate arithmetic, canonical URLs, and retained published records. No time, randomness, or session input in passage resolution. |
| Deeper material is inaccessible or mortality is forced | Explicit short progression path; shared-link bypass; Real Book accessible through self-reference or future books. No requirement to open mortality. |
| Quiet styling becomes unusable | Maintain readable contrast, visible focus, legible controls, ordinary scrolling, short passages, and real touch targets. Mystery must not obscure the next action. |
| Scope grows while building | One phase at a time. No backend, AI adapter, asset pipeline, framework migration, or host configuration to anticipate hypothetical futures. |

# 12. Phase 1 Handoff Prompt for Claude Opus

> You are implementing Phase 1 only of this project. Read `docs/BLUEPRINT.md` as the source of truth, including the whole document before starting, then execute only “Phase 1 — The smallest readable interaction” in section 10. Inspect applicable repository instructions and existing files first, and preserve unrelated work. Do not rewrite the blueprint or redesign the product.
>
> Build the minimal vanilla TypeScript + Vite + plain CSS foundation described in sections 6–9. If the repository is fresh, use npm; if it already establishes another package manager, preserve that convention. Implement AppShell, the four-scenario opening selector as a curated curiosity device, and BookView using the exact base passages b0001, b0003, b0005, and b0006 in section 4. Default to b0003. Use the exact visible labels from section 4, keep each selected premise readable in full, and never display internal category labels or ask visitors to formulate a life. Add the visually secondary, chooser-only SHOW ME SOMETHING STRANGER action: select the next available authored scenario in the fixed order 01 → 03 → 05 → 06, advancing from the default football (03 / b0003) to forgotten afternoon (05), then cup (06), or from a manually selected Oscar (01) to football (03); do not open a book, write history, record a first search, or loop; omit it at the end. Follow section 5 for focus handling. FIND THE BOOK remains primary and is the explicit action that opens the selected book. Implement the permanent book IDs, the exact BigInt coordinate mapping with the Hexagon · Wall · Shelf · Volume display from section 6, root and base-book hash navigation, valid direct-link/reload behavior, browser Back/Forward, and the invalid-address fallback. Include the short static About disclosure and no-JavaScript fallback. Match the restrained responsive typography, keyboard access, and layout rules. No disabled placeholders for later features.
>
> In this phase, neighbor arrays may remain empty and the catalog is intentionally partial. Do not implement nearby books, later scenarios, deeper discovery, progression storage, self-reference, the Real Book, the progressive explanation, sharing controls, automated test tooling, AI, a backend, deployment, or custom visual assets. Do not set up infrastructure for later features.
>
> Run type checking and a production build, and manually verify all four selections, full premise readability, the shortcut’s fixed order and stopping behavior, the default selection, repeatable coordinates, valid and invalid direct URLs, refresh, browser history, keyboard operation, and desktop/mobile layout. Report exactly what you implemented, what you checked, and any unresolved limitation. Then STOP. Do not continue into Phase 2 unless I explicitly ask.
