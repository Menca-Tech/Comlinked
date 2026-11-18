# 03 — Walk the Pilot Preview end to end, with the later items hidden

**What to build:** the Pilot Preview exists and can be walked from its Opening to its last Stop with one button. A Story Bar on every screen names the day, what is happening and whose Seat is shown, and Next always moves the story on. Each Stop has its own address and opens in its own state, so a reload or a forwarded link lands in the right place. Inside the Preview, the pricing switcher and the after-MVP previews do not show unless the presenter switches them on. For now each Stop opens on the screen the Demo already has; tickets 04 and 05 replace three of those screens.

**Spec:** `docs/specs/2026-11-17-pilot-preview.md`, sections "The Pilot Preview and its Stops", "Story Bar and Seats", "The later items", the Opening, and "Presenter Guide". User stories 1 to 3, 28 to 39, 44 to 47, 51 to 56, 83, 85 to 87 and 91.

**Blocked by:** 02 — Kalayaan's first export shipment, and basics only before a Claim. The user must have reviewed and committed it.

**Status:** built and committed on 2026-11-17. See "Outcome" at the end.

- [x] The Opening names ECCP, says ECCP has not joined ComLinked and that every company, person and figure is invented, lists the six Stops and offers Start
- [x] A Story Bar shows on every screen of a Stop with the day, the title, the Seat line, the position, Back and Next
- [x] Next walks Opening, Stops 1 to 6 in order, whether or not anything was clicked in a Stop
- [x] Each Stop has its own address, and opening it cold prepares that Stop's state
- [x] A reload inside a Stop reopens that Stop; an unknown Stop, or a browser that blocks the tab's memory, shows the Opening
- [x] The top bar follows the Seat: today's bar for a Company, a labelled bar with no member's initials for the Community Manager and the Chamber Contact
- [x] In the Pilot Preview the Presenter Guide's button does not show, the G key still opens the guide, and the guide can jump to any Stop
- [x] Two switches in the Presenter Guide control the pricing switcher and the after-MVP previews; both are off in the Pilot Preview and on in the full Demo
- [x] Meets the code quality points in its prompt, with the result reported

## Happy paths

- Open the Pilot Preview: the Opening shows its title "A preview for ECCP", the two honesty statements, the six Stops in order and Start.
- Start: Stop 1 opens on Day 0 in the Community Manager's Seat. The Story Bar reads "Day 0 · ECCP's member list becomes profiles", "You're seeing ComLinked's community manager, working for ECCP." and "1 of 6".
- Next from Stop 1: Stop 2 opens on Day 1 on the claim screen, with Kalayaan Foods not yet claimed, and the Seat line "You're seeing Kalayaan Foods, an ECCP member."
- Next from Stop 2 without claiming: Stop 3 opens on Day 2 with the Morning Digest filled in.
- Next from Stop 3: Stop 4 opens on Day 14 on the ComDash Overview with the Nordhavn deal confirmed.
- Next from Stop 4: Stop 5 opens on Day 14 on the chamber's screen with "You're seeing ECCP's own view. It is read-only." and no tools.
- Next from Stop 5: Stop 6 opens, and its button reads "Start again".
- Back from any Stop opens the one before it, and Back from Stop 1 opens the Opening.
- Inside Stop 4, open the Interest Signals tab and then Leads: the Story Bar stays, and Next still opens Stop 5.
- Reload on Stop 4's Interest Signals tab: Stop 4 reopens on ComDash on Day 14, showing "4 of 6".
- Open the address of Stop 5 in a new tab: ECCP's view opens on Day 14 with no earlier Stop visited.
- In Stop 4, ComDash shows four tabs and three Overview cards, with no "View as" switcher.
- Press G in the Preview: the Presenter Guide opens. Its Pilot Preview section jumps to any Stop.
- Switch on "Possible future pricing": the Free, Growth and Pro switcher appears with its "Not in the MVP" note.
- Switch on "After-MVP previews": ComDash shows five tabs, the AI Lead Agent card returns, and the Team Dashboard and Engine open.
- Pick "Two weeks in" from the guide: the full Demo opens with no Story Bar, the guide button showing, five tabs and the switcher, as before.

## Sad paths

- An address naming Stop 9: the Opening shows.
- The browser blocks the tab's memory and the page is reloaded mid-Stop: the Opening shows, with no error.
- A fresh visit to the full Demo's claim address in a tab that once ran the Preview: the full Demo opens, not a Stop.
- The browser's Back button after moving on a Stop: the earlier Stop opens afresh in its own state.
- With the previews hidden, the addresses of the AI Lead Agent, the Team Dashboard and the Engine open the ComDash Overview.
- With pricing hidden, ComDash stays on the Free view.
- Stop 1 on Day 0: nothing has claimed, no points exist, and no screen fails on a day before the first claim.
- The Story Bar on a 360 pixel phone: its text wraps to at most two lines, and Next stays fully visible and at least 44 pixels tall.
- Keyboard only: Back and Next are reachable in order with visible focus, and a Stop change moves focus to the screen's main heading.
- A screen reader hears the day, the title and the Seat when the Stop changes.
- Reduced motion: no transition between Stops.
- "Reset" in the Presenter Guide while in the Preview: the Demo starts over outside the Preview.

## Executer prompt

```
Goal
Build the Pilot Preview's skeleton in the ComLinked Demo: an Opening, six Stops with their own addresses and prepared states, and a Story Bar whose Next button walks them in order. Hide the pricing switcher and the after-MVP previews inside it behind two Presenter Guide switches.

Context
Repo: /Users/rafaeliiiprudente/Documents/coding projects/Comlinked. Branch: feat/website-redesign-pages. Stay on it and create no new branch.
Read first, in this order: CLAUDE.md, AGENTS.md, CONTEXT.md (the section "Showing ComLinked": Demo, Pilot Preview, Stop, Seat, Story Bar, Presenter Guide; and Community Manager, Chamber Contact), docs/adr/0010-client-side-product-simulation.md, then docs/specs/2026-11-17-pilot-preview.md. In the spec, "The Pilot Preview and its Stops", "Story Bar and Seats", "The later items", "Opening and the ask" (the Opening only) and "Presenter Guide and website" (the guide only) are your brief. The happy and sad paths are in .scratch/pilot-preview/issues/03-walk-the-preview-and-hide-later-items.md.
Who this is for: ECCP's Chamber Leader, who has never seen ComLinked. Richard presents it alone in a meeting and then sends a private link, so the Leader must be able to follow it on a phone with no presenter. The Story Bar is the only thing guiding them.
How the product runs: everything under /app is a browser-held simulation behind the service seam src/services/comlinked (ADR 0010). src/components/product/product-shell.tsx wraps every /app screen: it draws the top bar, the bottom tabs and the Presenter Guide's button, listens for the G key, and calls enterRoute() on each route change. Screens are client components that read state with useSimulation and change it through act. A full page load resets the simulation, so move between /app routes with next/link or router.push.
What exists today:
- enterRoute() claims Kalayaan Foods automatically on any /app route except the claim screen and "What's next". That is why the chamber's screen cannot be shown before a Claim.
- The Presenter Guide (src/components/product/demo-guide.tsx) has "New company" and "Two weeks in" starts, a "Walk the loop" list, time travel and links to the AI Lead Agent, the Team Dashboard, the Engine and "What's next".
- ComDash has five tabs listed in comdash/tabs.ts, a "View as" Free, Growth and Pro switcher in its frame, and an AI Lead Agent card on its Overview.
- The simulation starts on Day 1. Day 0 does not exist yet.
- Tickets 01 and 02 gave you: 100 Companies under ECCP's name from chamber.ts; one claim day per Company; Nordhavn as a day-one Match; one seed that builds "Two weeks in" on Day 14 with the Nordhavn deal confirmed. Read the "Outcome" section of .scratch/pilot-preview/issues/02-export-story-and-basics-before-claim.md, then find these in the code before you plan.
- The signal drawer reads an address parameter inside a Suspense boundary (comdash/signals-tab.tsx and signal-drawer.tsx). Follow that pattern: pnpm build fails if useSearchParams is used outside one.
Decided by the user, do not change: six Stops in this order and on these days. Each Stop opens already in its finished state, and Next works even if nothing was clicked. The Presenter Guide stays on the G key and its button does not show in the Pilot Preview. Both later-item switches are off in the Pilot Preview and on in the full Demo. The "Example data" tag stays on every screen.
Precondition: the user has committed ticket 02. Run git status. If anything under src/ or e2e/ is modified, stop and tell the user. Untracked files under .scratch/ are expected.

Scope
Modify:
- src/paths.ts: the Pilot Preview's addresses.
- src/services/comlinked/types.ts, simulation.ts, simulation.test.ts and index.ts.
- src/components/product/product-shell.tsx and demo-guide.tsx.
- src/components/product/comdash/tabs.ts, comdash-frame.tsx, summary-cards.tsx and summary-cards.test.tsx.
- src/components/product/screens/chamber.tsx: do not render its tools when the Seat is the Chamber Contact's. Change nothing else there.
- src/components/product/screens/whats-next.tsx: the AI Lead Agent card's link only.
- src/app/app/product.css.
- e2e/product-smoke.spec.ts: only where the guide or the tabs changed.
Create:
- src/services/comlinked/preview.ts: the declared list of the Opening and the six Stops.
- src/components/product/story-bar.tsx.
- A file under src/components/product/ for the top bars. product-shell.tsx is about 240 lines, so move the bars out of it instead of growing it.
- src/components/product/screens/preview-opening.tsx and preview-closing.tsx.
- src/app/app/preview/page.tsx and src/app/app/preview/ask/page.tsx.
- e2e/pilot-preview.spec.ts.
Leave untouched: the claim flow's screens, the member import, the chamber screen's layout, Kalayaan's story, the website, /auth, /dashboard, src/middleware.ts, CONTEXT.md and docs/mockup.

Approach
Use test-driven-development: write the Vitest cases at the service seam first, then the Playwright checks. Use systematic-debugging for failures, verification-before-completion before you report, and requesting-code-review once at the end. Project skills: nextjs-app-router, tailwind-v4, testing-unit, testing-e2e, coding-standards, no-ai-design-slop.
Step 1, the list of Stops. In preview.ts, declare the Opening and the six Stops once: number, day, title, Seat, the screen it opens on, and its address. The Story Bar, the Opening, the Presenter Guide and the tests all read this list.
- Opening: no day, no Seat. Address /app/preview.
- Stop 1: Day 0, "ECCP's member list becomes profiles", Community Manager. Opens on the chamber tools. Address /app/chamber?stop=1.
- Stop 2: Day 1, "A member claims its profile", Company. Opens on the claim screen. Address /app/claim?stop=2.
- Stop 3: Day 2, "The next morning", Company. Opens on the Morning Digest. Address /app/digest?stop=3.
- Stop 4: Day 14, "The member, two weeks in", Company. Opens on the ComDash Overview. Address /app/dash?stop=4.
- Stop 5: Day 14, "ECCP's view", Chamber Contact. Opens on the chamber tools. Address /app/chamber?stop=5.
- Stop 6: no day, "What a pilot asks of ECCP", no Seat. Opens on the closing screen. Address /app/preview/ask?stop=6.
The chamber's name in these titles comes from chamber.ts. Build every address through src/paths.ts.
Step 2, prepared states. Add one seam action that opens a Stop: it starts the simulation over, marks it as being in the Pilot Preview on that Stop, and builds the Stop's state from existing building blocks, synchronously and without the simulation's timers, so the result is the same on every run.
- Stop 1: Day 0, nobody has claimed, the member import already finished.
- Stop 2: Day 1, Kalayaan has not claimed, the Companies due to claim by Day 1 have.
- Stop 3: Kalayaan claimed on Day 1, is connected with Nordhavn and has sent it a first message, and one morning has passed, so the digest exists.
- Stops 4 and 5: the two-weeks seed. The Presenter Guide's "Two weeks in" must produce the same state, apart from being outside the Preview.
Make Day 0 a real day, before any Claim, with no activity. Inside the Pilot Preview the Stop's state decides whether Kalayaan has claimed, so enterRoute() does not claim it there.
Step 3, addresses and memory. Arriving at an address that carries a Stop marker, by any means, opens that Stop afresh. Moving around inside a Stop uses ordinary addresses and keeps the state. Remember the current Stop for the browser tab. When the page is reloaded (the navigation type is a reload) and the tab remembers a Stop, reopen that Stop at its address. Any other fresh load with no marker opens the full Demo as today. If reading or writing the tab's memory throws, carry on without it, which means a reload shows the Opening. An unknown Stop shows the Opening.
Step 4, the Story Bar. A strip directly under the top bar on every screen while the simulation is on a Stop. It shows "Day N · title" (the title alone on Stop 6), the Seat line, the position such as "2 of 6", Back, and Next. On Stop 6, Next reads "Start again" and opens the Opening. Back from Stop 1 opens the Opening. Seat lines: "You're seeing ComLinked's community manager, working for ECCP.", "You're seeing Kalayaan Foods, an ECCP member." and "You're seeing ECCP's own view. It is read-only." It is a labelled landmark. On a Stop change, move focus to the screen's main heading and announce the day, title and Seat politely. On a phone its text wraps to at most two lines and Next keeps a target of at least 44 pixels.
Step 5, the top bar per Seat. A Company's Seat keeps today's bar and bottom tabs. The Community Manager's and the Chamber Contact's Seats show the logo, the "Example data" tag and a label ("Community manager for ECCP" or "ECCP, read-only"), with no member's initials, notifications, search or bottom tabs.
Step 6, the Opening and the closing screen. The Opening has the title "A preview for ECCP", one sentence saying it shows how a ComLinked pilot could run for ECCP's members from the first day to two weeks in, the statement "ECCP has not joined ComLinked. Every company, person and figure here is invented.", the six Stops in order, and Start. The closing screen is plain for now: the Stop's title and one sentence naming the two asks, the Member List and one contact. Ticket 04 replaces it.
Step 7, the later items. Hold two switches in the simulation: possible future pricing, and after-MVP previews. Both are on in the full Demo and are set off when a Stop is opened. With previews off, ComDash shows four tabs and three Overview cards, the "What's next" card for the AI Lead Agent does not link, and the addresses of the AI Lead Agent, its ComDash tab, the Team Dashboard and the Engine open the ComDash Overview. With pricing off, the "View as" switcher is not rendered and the view stays Free.
Step 8, the Presenter Guide. Add a Pilot Preview section that jumps to the Opening or any Stop, and the two switches as labelled toggle buttons that state whether they are on. Keep every existing section. Do not render the guide's button while on a Stop or the Opening; the G key opens the guide everywhere. "New company", "Two weeks in" and "Reset" leave the Pilot Preview.
Step 9, check 360, 390, 1280 and 1440 pixel widths, run coding-standards on the diff, then requesting-code-review, then Verification.

Acceptance criteria
Vitest at the service seam covers:
- the list holds the Opening and six Stops with the days, titles, Seats and addresses above
- opening each Stop gives its stated day, Seat and claimed state, identically on a repeat run and whatever was done before
- Day 0 has no activity, no claimed Company and no points, and the derived figures used on screen do not fail on it
- Stop 3 holds a digest, the connection with Nordhavn and the first message
- "Two weeks in" and Stop 4 produce the same state apart from the Preview flags
- inside the Preview a route change never claims Kalayaan; outside it the existing behaviour holds
- opening a Stop sets both switches off; the full Demo's starts leave them on; each switch changes the tabs, the Overview cards, the pricing view and the redirect of hidden screens
- the existing repeat-run determinism check still passes
Playwright, in e2e/pilot-preview.spec.ts, covers each happy and sad path in the ticket file, plus:
- the whole walk with Next only, at 1280 pixels and again at 390 and 360
- no sideways scroll on any Stop at 360, 390, 1280 and 1440
- axe with no serious or critical violations on the Opening and every Stop
- keyboard use of the Story Bar, and reduced motion
Every existing unit, component, product and website test passes, changed only where the guide or the tabs changed, and each change is listed in your report.
Code quality is part of done. Check the diff against each point, and apply them only to code this session touches.
- Clean: each component and function has one job and a name that says so. No dead code, commented-out code, unused CSS or stray logs. No any, non-null ! or as used to silence an error. "use client" only on interactive leaves.
- Maintainable: one source for each fact. The Stops are declared once in preview.ts, and nothing else repeats a title, a day, a Seat or an address. Addresses come from src/paths.ts. The chamber's name comes from chamber.ts. Whether an item is hidden is read from the two switches in one place per item. Colours come from App Mode tokens, and styles live in product.css, not inline.
- Scalable: adding or reordering a Stop changes preview.ts and its prepared state only. Adding a Seat changes one place for its line and one for its bar.
- Limits: extract shared code only for a use that exists now. Do not refactor simulation.ts or the shell beyond these steps; list anything worth fixing in your report.
Report the coding-standards result.

Verification
After each step: pnpm lint && pnpm type:check && pnpm test.
At the end: pnpm lint && pnpm type:check && pnpm test && pnpm build, then pnpm test:e2e.
Use NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co and NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder.
Port 3000 on this machine is often used by a different project, and Playwright reuses whatever answers there. Check what is on port 3000 first. If it is not ComLinked, run PLAYWRIGHT_PORT=3111 pnpm test:e2e. Never stop a server you did not start. A build clashes with a ComLinked dev server using the same .next folder; if one is running, ask the user to stop it.
Report actual output, including anything skipped.

Guardrails
- Do not commit. Do not run git add, git commit or /ship unless the user asks in this session.
- Leave all work uncommitted on feat/website-redesign-pages. Do not switch or create branches, push, merge or open a PR.
- End your report with the changed files grouped by step, each group with a suggested Conventional Commit message.
- Add no dependencies.
- The Story Bar shows no plan codes, time travel, reset or other presenter controls.
- Never state that ECCP has joined, agreed or endorsed anything. ECCP appears as text only, never a logo.
- Keep the "Example data" tag on every screen, including the Opening.
- Status and Seat are text, not colour alone.
- Voice: sentence case, no emoji, no exclamation marks.
- Do not edit docs/mockup or CONTEXT.md.
- If something here conflicts with the code or the spec, stop and ask.
```

## Outcome

Built on 2026-11-17 and committed on `feat/website-redesign-pages`, as the user chose for this session ("commit when green").

**Checks run on the final code**

- Lint, type check and 281 unit tests pass (5 database tests are skipped, as before). 37 of them are new.
- The production build passes. It ran in a scratch copy, because a ComLinked dev server was running on port 3001 from this folder.
- Browser tests: 228 in all, run against that dev server on port 3001. 226 passed, including all 33 new Pilot Preview tests. Two failed, and neither comes from this ticket:
  - The auth smoke test expects `/dashboard` to redirect to sign-in. The 3001 server runs with Supabase unconfigured, so its dev-only auth bypass serves the page.
  - "Day 1's leads end with Palengke Online and Northline" failed once, at "Go to my ComDash". It passed 3 of 3 alone and 16 of 16 under parallel load.
- An earlier run of the new spec, on a machine loaded by another project's tests, timed out on several tests. Each passed when rerun.

**Choices made that this ticket did not spell out**

- The Opening is Stop 0 in the code. Its state is the fresh start, Day 1 before Kalayaan Foods claims, marked as in the Pilot Preview.
- Stop 6 opens on the two-weeks seed, the same state as Stops 4 and 5, so "Explore on your own" can open the member's side on Day 14.
- Opening a Stop raises no toast. Stop 3's overnight digest would otherwise announce itself.
- Stop 3's first message to Nordhavn is the same text that Two weeks in starts from. It has no reply yet.
- The Story Bar sits in the page under the top bar, not fixed to the screen. On a phone a fixed bar would take about 180 pixels with the top bar.
- "Its text wraps to at most two lines" was read as each line of text wrapping to at most two lines. On a 360 pixel phone, Stop 1 shows its title on one line and its Seat line on two. Ask the user if the whole bar should be two lines; that needs shorter wording.
- When the browser blocks the tab's memory, any reload of an address with no Stop in it shows the Opening, as the brief says, the full Demo's reloads included.
- The Seat line keeps "an ECCP member", as the spec words it. A chamber whose name takes "a" would need that word changed.
- The Presenter Guide opens on its Pilot Preview section, then "Later items" with the two switches, then its existing sections. Its note on reloading now mentions the Pilot Preview.
- Picking the Stop already showing from the guide reopens it afresh.
- Switching the after-MVP previews off while on one of their screens opens the ComDash Overview.
- Kalayaan Foods no longer shows "Needs an intro" before it has claimed. Day 0 was the first place this could show.

**Facts for later tickets**

- The Stops: `PREVIEW_OPENING`, `PREVIEW_STOPS`, `PREVIEW_CLOSING` and `SEAT_LINES` in `src/services/comlinked/preview.ts`. A Stop's number is its place in the list.
- Opening a Stop: `openStop(n)` in `simulation.ts`, which builds each state from `STOP_STATES`. A new kind of state is one entry there and one name in `StopState`.
- Reading where the simulation is: `currentStop()`, `stopLine(stop)`, and `laterItemShown("pricing" | "previews")`. The switches change with `act.toggleLaterItem(item)`.
- Addresses: `paths.preview` in `src/paths.ts`. `stopForAddress()` reads an address. `rememberStop()` and `stopAfterReload()` hold the tab's memory.
- The shell's address handling is the `useAddressEntry` hook in `product-shell.tsx`. The top bars and bottom tabs moved to `product-bars.tsx`, where `SEAT_BARS` gives each Seat its bar. The Story Bar and its announcer are in `story-bar.tsx`.
- The after-MVP screens are listed in `AFTER_MVP_SCREENS` in `simulation.ts`. The ComDash tab is marked `afterMvp` in `comdash/tabs.ts`.
- Ticket 04 replaces `screens/preview-closing.tsx` and puts the claim message in front of Stop 2's claim screen. Ticket 05 replaces the chamber screen, where `showsTools` hides the tools in the Chamber Contact's Seat.

**Left for later**

- The browser's Back button reopens a Stop only at a Stop's own address. Back onto an inner screen of an earlier Stop, such as the matches after a Claim in Stop 2, keeps the later Stop's state.
- In Stop 1, the chamber screen's "Back to company view" opens Kalayaan's ComDash under the Community Manager's Seat.
- In Stop 5, the chamber screen's heading still reads "ECCP community manager view, example members", and the empty tools column leaves a gap on a laptop. Ticket 05 rebuilds this screen.
- In Stop 2, the logo in the Company's bar leads to the website, out of the Pilot Preview.
- The guide's "On this screen" reads "Website" on the Opening and the closing screen.
- Every page logs a Content Security Policy error for an inline script in development, website included. This was there before this ticket.
