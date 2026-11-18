# 01 — Shared parts and the four reference screens

**What to build:** the Demo gets its one scale and its shared parts, and four screens are built to the specimen so the user can judge the look in the real app. Every screen picks up flat hairline panels, the new company marks, tags, buttons, count badges, top bar and Story Bar at once. ComDash Overview, the chamber screens in both Seats, the Opening and the ask are then recomposed, each with its one Focus panel. The session ends at the user's approval of those four screens.

**Spec:** `docs/specs/2026-11-18-demo-premium-pass.md`. Sections "The scale", "Panels and the Focus panel", "Top bar and Story Bar", "Company marks and tags", "Charts" (the small chart), "The four recomposed screens" and "Where the specimen strays". User stories 1 to 11, 13 to 21, 23 to 27, 29 to 32, 45, 46, 48 to 55, 57, 60, 61, 64, 65, 67, 68, 70 and 71.

**Visual source:** `.scratch/demo-premium/specimen.html`, which opens on the user's picks.

**Blocked by:** None among these tickets. It waits for the "View as" tier work, which must be reviewed and committed by the user first.

**Status:** built and verified on 2026-11-18, and approved by the user the same day. Ticket 02 may start.

- [x] Sizes, radii, spacing and the quieter grey are defined once as named values, and the shared parts use them
- [x] Panels are flat white with a hairline and no shadow on every Demo screen, and a Focus panel is raised
- [x] A Company that has claimed shows a pale blue mark, one that has not shows a dashed mark, and your own Company's stays solid navy, from one mark component
- [x] Count badges are tinted pills, and no heading or label is set in capitals on the four reference screens or in the shared parts
- [x] The Story Bar is a slim second row of the white header with six step dots, an outlined Next and a quiet Back, on every Stop, at laptop and phone widths
- [x] ComDash Overview shows Next action as its Focus panel, Interest Signals in the wide column with one bar per day, and Connections and Profile stacked beside it
- [x] The chamber screens lead with the claimed figure over the split bar, with deals confirmed and wins posted beside it, in both Seats
- [x] The five chips under the bar filter the member list, All shows the members grouped by status with six per group, and a status shows its whole group
- [x] The Opening and the ask are two panels, navy and white, with every sentence they carry today
- [x] The rules are checked in the browser on the four reference screens: sizes on the scale, no capitals, at most one Focus panel, at most one solid button, no sideways scroll
- [x] Before screenshots of every Demo screen and after screenshots of the four reference screens are saved at 390 and 1280 pixels
- [x] Meets the code quality points in its prompt, with the result reported

## Happy paths

- The Opening on a laptop: one raised frame of two panels. Navy with the logo rings holds "A preview for ECCP", the one-line description and, at the foot, "ECCP has not joined ComLinked. Every company, person and figure here is invented." White holds "The 6 stops" as a timeline with the day beside each Stop, then Start.
- Start, then Next through all six Stops: each Stop shows the Story Bar as a slim white row under the top bar, with the step dots marking the Stop and Next in the same place.
- Stop 1, Day 0, the Community Manager's Seat: "0 of 100" claimed, the bar all "not yet claimed", the members under the one heading "Not yet claimed", and the manager's tools beside them with the member import first.
- Stop 4, ComDash Overview: Next action is the only raised panel. Interest Signals fills the wide column with its three figures, one bar or tick per day and the Hot Companies. Connections and Profile stack beside it, each as tall as its content.
- Stop 5, ECCP's view: "40 of 100" over a bar split 20, 16, 4 and 60, with deals confirmed 3 and wins posted 2 beside it. The chips read All 100, Active 20, Quiet 16, Needs an intro 4 and Not yet claimed 60. Members sit under four headings, six per group.
- Choosing "Needs an intro 4" shows those four members only. "All 100" brings back the groups.
- "Show all 20" under Active chooses the Active chip.
- "See the community manager's side" still opens the same day in the Community Manager's Seat, and sending the introduction leaves 3 needing an intro.
- Stop 6, the ask: the same two panels. Navy holds "What a pilot asks of ECCP", the two things ECCP gives as a numbered pair, and "The pilot is free for ECCP and its members." White holds "ComLinked does the rest", "What your members get", Email Richard and Explore on your own.
- On Leads, a Company that has not claimed shows a dashed mark and keeps its "Not yet claimed" tag.
- At 390 pixels: every one of these screens is one column with panels inset by 16px, and on the two-panel screens navy stacks above white.

## Sad paths

- A status with no members whose chip is chosen, such as Active on Day 0, shows one line saying so, and the chip reads 0.
- A status with no members draws no segment in the bar and shows no heading in the grouped view.
- A group of six or fewer members shows all of them and no "Show all".
- A new Company with no visibility yet: the Overview's chart shows its calm empty state and no bars.
- A day with nothing shows a short tick, not a gap.
- With the later items switched on, the AI Lead Agent card joins the narrow column on ComDash Overview and no card is left half empty.
- Next action reading "You're all caught up" is still the Focus panel.
- The Story Bar at 360 pixels is no taller than today's on a Stop without a side step, and Next is fully visible and at least 44px tall.
- A very long company name at 360 pixels wraps inside its row, with no sideways scroll.
- No presenter address set: the ask still shows no email button and says to reply to whoever sent the link, inside the white panel.
- Colour cannot be told apart: every status has a label and a count, and the bar is hidden from assistive technology.
- Keyboard only: the chips, the member rows, the tabs and the Story Bar are reachable in order with a visible focus ring.
- Reduced motion: nothing on these screens transitions.
- A screen outside this ticket, such as Leads or ComMail, still works and passes its tests, though it has no Focus panel yet.

## Executer prompt

```
Goal
Give the ComLinked Demo one scale and one set of shared parts, and build four reference screens to the approved specimen: ComDash Overview, the chamber screens in both Seats, the Pilot Preview's Opening and the ask. Stop at the end for the user's approval of those four screens.

Context
Repo: /Users/rafaeliiiprudente/Documents/coding projects/Comlinked. Branch: feat/website-redesign-pages. Stay on it and create no new branch.
Read first, in this order: CLAUDE.md, AGENTS.md, CONTEXT.md (the sections "Showing ComLinked" and "Design", including Focus panel), docs/adr/0010-client-side-product-simulation.md, docs/design-system/README.md (App Mode), then all of docs/specs/2026-11-18-demo-premium-pass.md. The happy and sad paths are in .scratch/demo-premium/issues/01-shared-parts-and-reference-screens.md.
Then open .scratch/demo-premium/specimen.html in a browser. It opens on the user's picks. Its bar switches between ComDash, ECCP's view, the Opening and the ask, and T shows today's screen. It is the visual source. Where it and the spec disagree, the spec wins: read "Where the specimen strays" before you copy any value from it.
Who this is for: ECCP's Chamber Leader, shown the Demo by Richard and then left to replay it alone on a phone. Today the Demo is tidy but reads as a clean template. The direction is "quiet and exact": the same navy, off-white page, two fonts and layouts, with one thing leading on each screen. The yardstick is Mercury for feel and Stripe's dashboard for tables and figures. Only principles are borrowed.
How the product runs: everything under /app is a browser-held simulation behind the service seam src/services/comlinked (ADR 0010). Screens are client components that read state with useSimulation and change it through act. Derived facts are exported seam functions, tested in simulation.test.ts. A full page load resets the simulation. The top bar and bottom tabs are buttons that call act.nav, not links. Each Stop has its own address: /app/preview, /app/chamber?stop=1, /app/dash?stop=4, /app/chamber?stop=5 and /app/preview/ask?stop=6.
What exists today:
- src/app/app/product.css holds every App Mode style: shared classes named a-* (a-btn, a-top, a-count, a-tabs, a-card, a-mono, a-tag, a-st, a-surface), ComDash and chamber parts named cd-* (cd-panel, cd-tile, cd-chip, cd-level, cd-kicker), and the Story Bar as a-story*. It uses 16 pixel font sizes and 8 corner radii. Colours are tokens named --color-cl-* in src/app/globals.css.
- src/components/product/shared.tsx has the shared parts: Btn, Mono (the company mark, initials only), Panel ("one raised white panel per column"), PageHead, St, Tally.
- src/components/product/product-bars.tsx is the top bar and bottom tabs. src/components/product/story-bar.tsx is the Story Bar, a pale blue band.
- ComDash Overview: comdash/comdash-frame.tsx (the header, with a label in capitals above the name), next-action.tsx, summary-cards.tsx (four cards two by two) and sparkline.tsx (a line).
- The chamber screens: screens/chamber.tsx composes chamber/activity-view.tsx, activity-tiles.tsx (five tiles), status-filter.tsx (five chips), member-list.tsx (one flat list of 100) and manager-tools.tsx with member-import.tsx. The seam's activityView() returns the figures, the count per status and the rows.
- screens/preview-opening.tsx and screens/preview-ask.tsx are text on the page. The claim steps in screens/claim.tsx already use two panels, navy and white, styled as a-welcome.
- The seam already knows whether a Company has claimed (hasClaimed) and returns search appearances and recommendations per day (visibilityByDay).
Decided by the user, do not change: panels are flat with a hairline and only the Focus panel is raised; the Story Bar is a second white row with an outlined Next, not a navy strip; figures are Nunito Sans at 600 and the serif is kept for the page title, the Focus panel's one line and the two-panel headline; marks are pale blue when claimed and dashed when not; the small chart is day bars; ComDash Overview is wide plus stacked; the chamber screens lead with the claimed figure and group their members; the row under the bar is the status filter; the Opening and the ask are two panels like the claim steps. No wording changes anywhere, and no screen does anything new.
Precondition: the user has committed the "View as" tier work. Run git status. If anything under src/ or e2e/ is modified, stop and tell the user. Changes to CONTEXT.md and docs/specs, and untracked files under .scratch/ and docs/specs, are expected: leave them as they are.

Scope
Modify:
- src/app/app/product.css and src/app/globals.css (one new colour token only).
- src/components/product/shared.tsx, product-bars.tsx and story-bar.tsx.
- src/components/product/comdash/comdash-frame.tsx, next-action.tsx, summary-cards.tsx, sparkline.tsx, dash-panel.tsx and level-tag.tsx, and summary-cards.test.tsx where it asserts the old cards.
- src/components/product/chamber/activity-view.tsx, activity-tiles.tsx, status-filter.tsx, member-list.tsx and manager-tools.tsx, and screens/chamber.tsx.
- src/components/product/screens/preview-opening.tsx and preview-ask.tsx, and screens/claim.tsx only to share the two-panel frame.
- src/services/comlinked/types.ts, simulation.ts and simulation.test.ts, for the grouped member list only.
- Any file that renders the company mark, only to pass it the Company.
- e2e/pilot-preview.spec.ts and e2e/product-smoke.spec.ts.
Create: a day-bar chart component under src/components/product/, used now by the Overview and by ticket 02 for the large chart. A two-panel frame component if sharing it needs one. Split a new part into its own file when it has its own job.
Leave untouched: the Interest Signals, Connections and Profile tabs beyond what the shared parts change; Leads, ComMail, Asks, Wins, the claim flow's behaviour, day-one Matches and the digest (ticket 02); Search, Notifications, Engine, the AI Lead Agent preview, After the MVP, the Team Dashboard and the Presenter Guide (ticket 03); the website and src/app/marketing-site.css (ticket 03); docs/design-system (ticket 03); what any "View as" tier shows; /auth, /dashboard, src/middleware.ts, CONTEXT.md and docs/mockup.

Approach
Use test-driven-development: Vitest at the service seam first, then the Playwright checks. Use systematic-debugging for failures, verification-before-completion before you report, and requesting-code-review once at the end. Project skills: nextjs-app-router, tailwind-v4, testing-unit, testing-e2e, coding-standards, no-ai-design-slop. The spec and the specimen outrank any skill's taste.
Step 0, before screenshots. Before changing anything, save a screenshot of every Demo screen at 390 and 1280 pixels into test-results/demo-premium/before/, named by screen and width. Cover the Opening, all six Stops, the four ComDash tabs, Leads, ComMail, Asks, Wins, Search, Notifications, the Profile screen, day-one Matches, the digest, Engine, the AI Lead Agent preview, After the MVP and the Team Dashboard. Use a throwaway Playwright script kept outside the repo's tracked files. Tickets 02 and 03 need these, because step 1 changes every screen.
Step 1, the scale and the shared parts. Make the change easy first.
- Define the scale once, as named values at the top of the App Mode styles: the font sizes 12, 13, 14, 16, 18, 22, 28, 36 and 44; the radii 6, 10 and 14; spacing in steps of 4; and the standard and compact densities. Add the quieter grey #62676c as a colour token beside the existing ones, and confirm it holds 4.5:1 on the page and on a panel.
- Move the shared parts onto those values: the panel (flat white, 1px hairline, radius 14, no shadow), the Focus panel (white, no border, raised on a soft navy-tinted shadow, a little more padding), tags, chips, buttons (standard 40px on laptops and 44px on phones; compact 32px on laptops and 44px on phones), count badges (small tinted pills with navy figures) and the page head.
- The Focus panel carries the attribute data-focus-panel, so the browser tests in all three tickets find it the same way.
- The company mark becomes claim-aware in one component: pale blue ground and navy initials when the Company has claimed, a dashed outline and quieter initials when it has not, solid navy for your own Company. It gets that fact from the seam. No call site works it out.
- Interest Level tags: Hot solid navy, Warm blue tint, New outlined. Member status tags: Active blue tint, Quiet grey, Needs an intro error tint, Not yet claimed outlined.
- Remove capitals from the shared parts and drop the label above the ComDash name.
These parts are used by every screen, so every screen changes here. That is intended. Screens outside this ticket must still work and pass their tests; they get their own Focus panel in tickets 02 and 03.
Step 2, the top bar and the Story Bar. Top bar: white, a hairline under it, no shadow; the active place in ink at 600 with a navy underline. Story Bar: a second white row about 48px tall, closed by a hairline. Left to right: six step dots (done, current, to come), the day and what is happening at 600, the Seat line in the quieter grey, then the Stop count, Back as a quiet button and Next as an outlined button. A side step is a quiet button before the count. On phones the dots share the first row with Back and Next, the day and title follow, then the Seat line, and a side step takes its own row. What the bar says and where its buttons go do not change, and it stays unfixed to the screen.
Step 3, ComDash Overview. Next action spans the width as the Focus panel, with its line in the serif at 28. Below it on laptops, two columns: Interest Signals in the wide one with its three figures, the day bars and the Hot Companies; Connections and Profile stacked in the narrow one. When the later items show, the AI Lead Agent card joins the narrow stack. One column on phones in today's order. Build the day-bar chart as its own part: one bar per day, a short tick on an empty day, the first and last day labelled, the sentence under it unchanged. Draw it so its label text renders at its scale size at every width; an SVG that scales its text with the container does not meet this. "Hot companies" becomes a sentence-case title, and a Hot Company's name is underlined only on hover or focus.
Step 4, the chamber screens. Seam first: add what the grouped list needs to the Activity View's data. In the All view, the four statuses in today's order, each with its full count and at most six members in today's member order; a status with no members is left out. With a status chosen, that whole group. Keep the count per status, which the chips and the bar both read. Then the screen: one Focus panel holding the claimed figure at 44 ("40 of 100"), the bar split in proportion (Active navy, Quiet light logo blue, Needs an intro error red, Not yet claimed sunken grey, no segment for an empty status), and deals confirmed and wins posted beside it. Under the bar, the five chips, each status chip with its colour dot and count. Keep the group's accessible name and each chip's name as the status and its count, so existing tests still find them. Below, the member list beside today's side column. Rows sit in two columns on laptops and carry no status tag under a status heading. "Show all N" under a heading chooses that status's chip, so there is one behaviour and not two. Not-yet-claimed members with a message waiting still come first with "A member is waiting", and in the Community Manager's Seat a name still opens its draft profile. Both Seats use the same screen; the Chamber Contact's Seat still has no control except the chips.
Step 5, the Opening and the ask. Share one two-panel frame with the claim steps: one raised frame, navy with the logo rings beside white, navy stacked above white on phones. Opening: the title as the headline at 44 on laptops and 36 on phones, the one-line description, the invented-data line at the foot above a rule; "The 6 stops" as an ordered timeline with the day beside each Stop and none for the last; Start as the solid button. The ask: the title, the two things ECCP gives as a numbered pair, and "The pilot is free for ECCP and its members." at the foot in the serif; "ComLinked does the rest" and "What your members get" as plain lists; Email Richard solid, Explore on your own outlined, and the presenter's address as text. Every sentence is today's.
Step 6, the rule checks. Add browser helpers that, for a named screen at 1280 and 390 pixels, assert: every visible text size is on the scale; no visible text is transformed to capitals; at most one element carries data-focus-panel; at most one solid button outside the Story Bar; no sideways scroll at 360 and 390. Drive them from one list of screens, each with how to reach it. Put the four reference screens on the list, in both Seats and on Day 0 for the chamber screen. Tickets 02 and 03 add their screens to the same list.
Step 7, compare and finish. Save after screenshots of the four reference screens at 390 and 1280 into test-results/demo-premium/after/01/. Compare each with the specimen and with its before screenshot, and fix what differs for a reason the spec does not give. Then run coding-standards on the diff, then requesting-code-review, then Verification. Add an "Outcome" section to the ticket file: the checks run, the choices you made that the ticket did not spell out, existing tests you changed and why, and anything left for tickets 02 and 03.

Acceptance criteria
Vitest at the service seam covers:
- Day 14: the counts are 20 active, 16 quiet, 4 needing an intro and 60 not yet claimed, and they add up to the network's size
- Day 0: the counts are 0, 0, 0 and 100, and the All view holds one group
- the All view returns the groups in today's order, each with its full count and at most six members in today's member order
- a group of six or fewer returns all its members and reports nothing more to show
- choosing a status returns that whole group, and a status with no members returns none
- an introduction moves a member out of Needs an intro in both the counts and the groups
- the existing Activity View, Team Dashboard agreement and repeat-run checks still pass
Playwright covers each happy and sad path in the ticket file, plus:
- the rule checks from step 6 on the four reference screens
- the Run of Show's walk, end to end
- no sideways scroll on any Stop at 360, 390, 1280 and 1440 pixels
- axe with no serious or critical violation on the four reference screens, in both Seats
- keyboard use of the Story Bar and the chips, and reduced motion
Every existing unit, component, product, Pilot Preview and website test passes. Tests tied to the five tiles, the flat member list and the four Overview cards are updated to the new screens; each change is a deliberate update of an expectation, never a weakened check, and each is listed in your report.
Code quality is part of done. Check the diff against each point, and apply them only to code this session touches.
- Clean: each component has one job and a name that says so, in its own file. No dead code, commented-out code or stray logs. Styles and markup that the new parts replace are deleted, not overridden: the old tile row on the chamber screen, the old Story Bar band, the line sparkline, the four-card grid. No any, non-null ! or as used to silence an error. "use client" only on interactive leaves.
- Maintainable: one source for each fact. Sizes, radii, spacing and colours come from the named values, and no shared part you touch writes one as a literal. The mark, the tags, the panel, the Focus panel, the chips, the two-panel frame and the day-bar chart are each one part used everywhere. Counts, groups and claim status come from the seam, never from a component. Addresses come from src/paths.ts and the chamber's name from its setting.
- Scalable: adding a status changes one place and the bar, chips and groups follow. Adding a screen to the rule checks is one line in the list. The chamber screen works for any network size.
- Limits: extract shared code only for a use that exists now or is named here (the day-bar chart for ticket 02, the two-panel frame for the claim steps). Do not restyle screens that belong to tickets 02 and 03 beyond what the shared parts change. Do not refactor outside Scope; list anything worth fixing in your report.
Report the coding-standards result.

Verification
After each step: pnpm lint && pnpm type:check && pnpm test && pnpm build, plus the browser tests that cover that step's screens.
At the end: pnpm lint && pnpm type:check && pnpm test && pnpm build, then the whole of pnpm test:e2e.
Use NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co and NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder.
Port 3000 on this machine is often used by a different project, and Playwright reuses whatever answers there. Check what is on port 3000 first. If it is not ComLinked, run PLAYWRIGHT_PORT=3111 pnpm test:e2e. A ComLinked dev server the user is running may be on port 3001; never stop a server you did not start. A build clashes with a ComLinked dev server using the same .next folder; if one is running, ask the user to stop it.
The full browser run takes several minutes. Wrap a long run in caffeinate -i so the Mac does not sleep. The homepage ring's contrast check is known to fail now and then under load; rerun it alone before treating it as real.
Run pnpm exec prettier --check on every document you changed.
Report actual output, including anything skipped.

Guardrails
- Commit when green. After a step passes its checks, commit it on feat/website-redesign-pages as Conventional Commits. Never push, merge, open a PR, or switch or create branches.
- Do not commit the screenshots. test-results/ is ignored; keep them there.
- Stop after step 7 and ask the user to review the four reference screens against the specimen. Record their answer in the ticket's Outcome. Do not start ticket 02.
- Add no dependencies, icons, hues or dark mode.
- Change no wording and nothing a screen does. Keep the "Example data" tag on every screen. ECCP appears as text only, never a logo.
- Never widen what a "View as" tier hides, and never hide a Company's name anywhere else.
- Status is text, never colour alone.
- Never add unsafe-inline or unsafe-eval to script-src.
- Never publish the specimen or the mockup, and send nothing about this project to an outside service.
- Voice: sentence case, no emoji, no exclamation marks.
- Do not edit docs/mockup, CONTEXT.md, docs/design-system or the website.
- If something here conflicts with the code or the spec, stop and ask.
```

## Outcome

Built on 2026-11-18. Steps 0 to 7 are done and every check passes. The user approved the four reference screens the same day (see "The user's review" below). Ticket 02 has not been started.

**Before it started**

- The "View as" tier work was still uncommitted. The user asked for it to be verified and committed first: lint, type check, 334 unit tests, build and 290 browser tests passed, and it is commit `1c42a06`.
- The user allowed the ComLinked dev server on port 3001 to be stopped. It came back at 10:54 and was left alone after that. Builds therefore ran in a scratch copy, and the browser tests on port 3111.

**Checks run on the final code**

- Lint and type check pass. 342 unit tests pass (5 database tests are skipped, as before). The production build passes in a scratch copy.
- The full browser suite passes: 328 of 328, on a fresh server on port 3111 with the presenter's example address.
  - Three earlier runs failed 8, 5 and 9 tests on navigation waits, a different set each time. The first run's eight passed when rerun alone, and all of them pass in the final run. The dev server had been running through hours of edits and each run was slower than the last; a fresh server ended it.
- The rule checks pass on the four reference screens, in both Seats and on Day 0, at 1280 and 390 pixels, with no sideways scroll at 360. They were pointed at the Interest Signals tab once to prove they can fail, and they did.
- The quieter grey `#62676c` holds 5.23:1 on the page and 5.71:1 on a panel.
- Coding standards: no finding. No `any`, `!` or silencing `as`, no logs, and the only colour literals added are the two token definitions.
- Code review, on two axes:
  - Standards found no hard breach. Fixed from it: the AI chip and the top bar's own mark now go through the shared tag and mark, the Focus panel's marker is written in one place, the chosen chip is reached by a typed ref, and small strokes have a named value.
  - Spec found three things that were wrong and are fixed: an old rule overrode the active state of Notifications and Search, one test had been weakened, and "all caught up" was tested with a mocked seam although the browser reaches it.
- Prettier passes on this file.

**Screenshots**

- Before: every Demo screen at 390 and 1280 pixels, 90 files.
- After: the four reference screens in both Seats, 18 files.
- Playwright empties `test-results/` at the start of every run, so the copies to keep are in `.scratch/demo-premium/shots/before/` and `.scratch/demo-premium/shots/after/01/`. They are mirrored into `test-results/demo-premium/`.

**Choices the ticket did not spell out**

The user confirmed the first three at the review. The rest were listed to the user and stand unless overturned.

1. **"ECCP gives two things" stays visible on the ask.** The specimen left it out. The ticket says every sentence stays, and the Run of Show points at it. Confirmed by the user.
2. **"ECCP on ComLinked" stays, under the title.** The specimen shows it there. The spec says a label that names the screen is dropped; the user chose to keep this one, so it is an exception to that line of the spec.
3. **"The pilot is free for ECCP and its members." is 22 on phones and 28 on laptops**, the scale's sizes for a Focus panel's serif line. The specimen drew it at 20. Confirmed by the user at 28.
4. **The Story Bar's text is 14.** The bar is treated as a compact area, which keeps it about 48px tall and no taller than today's on a phone.
5. **"Next action" is 14 in navy above its serif line**, as on the specimen. Every other panel title is 18 in both densities; the specimen's compact titles were 16.
6. **"Show all N" appears in the Chamber Contact's Seat.** It chooses its status's chip, so it is counted as part of the status filter. Focus moves to the chosen chip, because the button that asked is gone.
7. **Your own Company's mark is solid navy only where a screen shows it as yours**: the top bar, the claim steps, your profile and your row in Search. In the chamber's list Kalayaan Foods' mark follows its claim like any member's, so it is dashed on Day 0.
8. **One solid button in Next action.** Its main button is the standard size. Where it lists several rows, only the first row's button is solid.
9. **"Send introduction" is outlined until the Member List is imported**, so the import's button is the only solid one before that.
10. **Member status tags have no place on the chamber screens now**, since a row sits under its status. The tag part keeps the four tones the ticket lists; the error tone has no user yet.
11. **The claim steps moved into the shared frame.** They were full-bleed. This is the one visible change to a ticket 02 screen beyond the shared parts.
12. **The top bar is 60px tall on laptops**, as on the specimen, and 56px on phones.
13. **Tags are 20px tall at 12px. Chips are 32px on laptops and 44px on phones, with round dots. Quiet buttons read in navy.**
14. **One rule switches off transitions and animations for the whole Demo** under reduced motion, in place of three partial ones.
15. **Tab order in the Community Manager's Seat is unchanged on laptops**: the tools come before the chips, though they now sit lower on the screen.
16. **"Today's" Story Bar height in the 360 pixel test** is worked out from the old bar's measurements and the line counts of the new one.

**Files touched outside the Modify list**

- `product-shell.tsx`: the claim steps no longer need their own body class.
- `comdash/invite-actions.tsx` (which request's Accept is solid), `comdash/level-filter.tsx` (the count in bold, a ref for the chosen chip) and `chamber/member-import.tsx` (its finished state is a panel).
- `screens/search.tsx` and `screens/company.tsx`, to pass the mark its Company.
- New parts: `tag.tsx`, `two-panel.tsx`, `day-bars.tsx`, `focus-panel.ts`, `comdash/visibility-days.tsx` (replaces `sparkline.tsx`), `chamber/claimed-figure.tsx` (replaces `activity-tiles.tsx`), `chamber/split-bar.tsx` and `chamber/status-key.ts`.
- New tests: `e2e/demo-rules.spec.ts` and `screens/preview-ask.test.tsx`. The ask with no presenter address cannot be reached in the browser, because the test server is started with one.

**Existing tests changed, and why**

None was weakened. Each now asserts the new screen, and most assert more than before.

- `e2e/pilot-preview.spec.ts`
  - Stop 5 and its address in a new tab: "Claimed 40 of 100" is read from the claimed figure, not a tile.
  - Stop 4, the full Demo from the guide, and exploring: a count of cards became the panels' titles in order.
  - Day 0, in two tests: five zero tiles and 100 status cells became the claimed figure, the two results, the five chips' counts, the one heading, and 100 rows once the chip is chosen.
  - "names ECCP and Day 14": the label's class became the header's text, and five tiles became the claimed figure, deals and wins, and that the figure is the Focus panel.
  - "the member list starts with All 100": 100 rows became four groups with their counts and six members each, each chip's whole group, and All restoring the groups.
  - "each row shows the member and its status in words": a row's text no longer ends with its status; the heading above it says it.
  - "the filters are the only controls": the list of controls gained the three "Show all" buttons.
  - The phone layout test: tiles in two columns became the claimed figure leading and the members in one column. A laptop layout test was added.
  - The long name at 360 pixels: the name now fits on one line there, because a row carries no status tag. The test asserts one line inside its row at 360, and two lines inside its row at 320.
  - The side step's two tests: the "Need an intro" tile became the chip's count, and Lakbay Hotels' status is read after choosing Active.
  - "on a phone the tools come before the figures": the first tile became the claimed figure.
- `e2e/product-smoke.spec.ts`
  - The leads board test: the claim screen is found by its heading, not a class.
  - The Overview's four cards, on a laptop and a phone: a class count became the panels' titles and their order.
  - The timeline drawer: the Interest Level tag is found by its text.
  - The chamber tools: "Claimed 40 of 100" is read from the claimed figure.
  - Two tests gained checks: a new company's single day bar, and "all caught up" as the Focus panel.
- `comdash/summary-cards.test.tsx`: the empty state also asserts no chart is drawn, and a new test covers one bar per day.

**Left for tickets 02 and 03**

- **Interest Signals tab.** It keeps the prototype's sizes through the `.cd-signals` rules (11, 11.5, 12.5 and 15.5px, serif figures at 700, table headers in capitals) and its chart toggle. It needs `data-density="compact"` and its screen in the rule checks.
- **Focus panels.** `TwoPanel` takes only `focus="side"`, so the claim steps need a way to mark the white panel. `Panel` has no focus option yet; `focusPanel()` is the helper to use.
- **Other parts not restyled.** The profile gap buttons in Next action are still compact. The blue-tinted "Active panel" is still used on Leads. Monthly Top Companies and the Success Wall are unchanged, so every name in the top ten is bold.
- **Seam.** `activityView().tiles` still returns "Active" and "Need an intro", which no screen shows now.
- **Dead styles.** `.a-dash-head`, `.w-dash` and `.dv2-node.is-open` and `.is-connected` have no user. Two sticky offsets of 96px assume the old 72px top bar.
- **Literal sizes** remain in every rule this ticket did not touch.
- **Browser test helpers.** `panelTitles`, `expectAccessible` and the Stops' addresses are repeated across the spec files.
- **Documents.** The design system and the Run of Show are untouched. No click in the Run of Show changed.
- **Member status tags.** Nothing maps a status to a tag's tone yet, for the Team Dashboard and the website's example panel.

**The user's review**

Approved on 2026-11-18, asked in the session that built it, after the commits. The user was pointed to the four screens on their own dev server, the specimen and the after screenshots, and answered:

- The four reference screens: approved.
- "ECCP gives two things" on the ask: keep it visible.
- "ECCP on ComLinked" on the chamber screens: keep it under the title.
- "The pilot is free for ECCP and its members." on laptops: 28px, by the scale.

No change was asked for, so the code is as committed in `fac98e1` and `9dc304d`. Nothing is pushed.
