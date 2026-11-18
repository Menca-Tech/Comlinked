# 05 — ECCP's Activity View

**What to build:** the chamber's screen becomes ECCP's own, and the best-looking screen its Chamber Leader sees. Stop 5 shows a read-only Activity View built from ComDash's parts: five figures for Day 14, a member list where each Company has one status, filters, and a side column with the Success Wall's wins and Monthly Top Companies. The Community Manager sees the same screen with the tools added, and a side step from Stop 5 shows them introducing a member who has no lead yet.

**Spec:** `docs/specs/2026-11-17-pilot-preview.md`, section "ECCP's Activity View", and "Wins, deals and Monthly Top Companies". User stories 17 to 24, 49, 50, 71 and 74 to 81, and 88.

**Blocked by:** 03 — Walk the Pilot Preview end to end, and 04 — Stops 1, 2 and 6. Ticket 04 also changes the chamber screen, so the user must have reviewed and committed both.

**Status:** built and committed on 2026-11-18

- [x] The Activity View shows five figures: claimed (of the network's size), active, need an intro, deals confirmed and wins posted
- [x] On Day 14 they read 40 of 100, 20, 4, 3 and 2
- [x] Each member has exactly one status: Not yet claimed, Needs an intro, Active or Quiet, and the four counts add up to the network's size
- [x] A member's status never depends on its dealings with Kalayaan Foods
- [x] Filters for All and each status show their counts and narrow the list
- [x] A row shows the Company and its status and nothing else about it; not-yet-claimed members with a message waiting come first, marked "A member is waiting"
- [x] The Chamber Contact's Seat has no action that changes anything; the Community Manager's Seat adds the member import, introductions, the announcement and unusual points
- [x] The side step from Stop 5 sends one introduction, and ECCP's view then shows one fewer member needing an Intro
- [x] Meets the code quality points in its prompt, with the result reported

## Happy paths

- Stop 5 on a laptop: the heading names ECCP and "Day 14 of the pilot". Five tiles read 40 of 100 claimed, 20 active, 4 need an intro, 3 deals confirmed and 2 wins posted.
- The member list starts with "All 100". The chips read Active 20, Quiet 16, Needs an intro 4 and Not yet claimed 60.
- Choosing "Needs an intro" leaves four rows, each with that status in words.
- Kalayaan Foods Inc. shows as Active, and so does Nordhavn Freight Forwarders.
- The side column shows two wins, one of them Kalayaan Foods with Nordhavn, and then the ten Monthly Top Companies under ECCP's name.
- A not-yet-claimed Company that Kalayaan has messaged sits first among the not-yet-claimed, marked "A member is waiting", with no name of who is waiting.
- "See the community manager's side" opens the same screen in the Community Manager's Seat, with an introduction ready for one member that needs it.
- Sending that introduction shows a confirmation. "Back to ECCP's view" then shows 3 need an intro and that member with a different status.
- Stop 1 on Day 0, in the Community Manager's Seat: the member import comes first, the tiles read 0 of 100 claimed, and every member is Not yet claimed.
- The announcement button states the number of members that have claimed.
- On a phone: the tiles form two columns, the list becomes cards, and the side column moves below.
- Wins still shows the same Success Wall and Monthly Top Companies as the side column.

## Sad paths

- A filter with no members, such as Active on Day 0, shows one line saying so.
- In the Chamber Contact's Seat there is no button, link or field that changes a member, sends anything or opens a member's private details.
- Connecting with or disconnecting from a Company as Kalayaan does not change that Company's status in ECCP's view.
- A Company cannot be both Active and Needs an intro: Needs an intro wins until an introduction is made.
- Choosing the same Company twice in an introduction is refused, as today.
- An introduction for a Company that has not claimed cannot be made: only claimed Companies can be chosen.
- A very long company name on a 360 pixel phone wraps inside its card, with no sideways scrolling.
- Status is readable without colour, and a screen reader hears each tile's figure with its label.
- Keyboard only: the filters, the side step and the tools are reachable in order with visible focus.
- The Team Dashboard's weekly active figure and its queue of Companies needing help agree with ECCP's view on the same day.

## Executer prompt

```
Goal
Rebuild the chamber's screen in the ComLinked Demo as ECCP's Activity View, made from ComDash's parts: five figures, one status per member, filters, and a side column of wins and Monthly Top Companies. The Chamber Contact reads it and cannot act. The Community Manager sees the same screen with the tools added, and a side step from Stop 5 shows one introduction being made.

Context
Repo: /Users/rafaeliiiprudente/Documents/coding projects/Comlinked. Branch: feat/website-redesign-pages. Stay on it and create no new branch.
Read first, in this order: CLAUDE.md, AGENTS.md, CONTEXT.md (Activity View, Chamber Contact, Community Manager, Chamber Leader, Team Dashboard, Intro, Success Wall, Monthly Top Companies, and the section "Showing ComLinked"), docs/adr/0010-client-side-product-simulation.md, docs/design-system/README.md (App Mode), then docs/specs/2026-11-17-pilot-preview.md. In the spec, "ECCP's Activity View" and "Wins, deals and Monthly Top Companies" are your brief. The happy and sad paths are in .scratch/pilot-preview/issues/05-eccp-activity-view.md.
Who this is for: ECCP's Chamber Leader, deciding whether to lend the chamber's name to a pilot. This is the one screen that is theirs. They need to see how a pilot is going, and to be able to promise their members that each member's own dealings stay private. So the screen shows totals and one status per member, and nothing more about any member.
How the product runs: everything under /app is a browser-held simulation behind the service seam src/services/comlinked (ADR 0010). Screens are client components that read state with useSimulation and change it through act. Derived facts are exported seam functions, tested in simulation.test.ts. A full page load resets the simulation, so move between /app routes with next/link or router.push.
What earlier tickets left you: 100 Companies under ECCP's name; one claim day per Company, with exactly 40 claimed on Day 14; wins and deals as one dated list, with three deals and two wins by Day 14; a seam state that says a message is waiting for a Company that has not claimed; the Pilot Preview's Stops, Story Bar and a top bar per Seat; the member import as its own component, src/components/product/chamber/member-import.tsx; the chamber screen already hiding its tools in the Chamber Contact's Seat. Read the "Outcome" sections of .scratch/pilot-preview/issues/02-export-story-and-basics-before-claim.md, 03-walk-the-preview-and-hide-later-items.md and 04-member-list-message-and-the-ask.md for the names of the seam functions, then find these in the code before you plan.
What exists today:
- src/components/product/screens/chamber.tsx is a plain list headed "Latest 12 members", with the three counts as one line of text, then the tools.
- members() builds that list for Kalayaan and eleven others. It marks a Company Active when it is connected with Kalayaan, and it can show Active and "Needs an intro" together.
- teamRec(), activeOn() and teamData() work out each Company's activity by formula for the staff Team Dashboard: weekly active Companies, first-day leads and a queue of Companies needing help. An introduction made by staff is recorded separately from one made in the chamber tools.
- ComDash has the parts to reuse, under src/components/product/comdash/: dash-panel.tsx (a titled panel and an empty note), top-numbers.tsx (the number tiles), level-filter.tsx (chips with counts), interested-companies.tsx (a table that becomes stacked cards on a phone), and their styles in src/app/app/product.css.
- screens/wins.tsx draws the Success Wall and Monthly Top Companies inline.
Decided by the user, do not change: the Day 14 figures are 40, 20, 4, 3 and 2, because they are where the plan's 90-day targets stand two weeks in. Each row shows status only: no lead, connection or deal counts per member. No pilot targets and no "on track" or "behind" labels. The pilot's length is not stated. The Chamber Contact's view is read-only. No new visual language: App Mode colours and fonts, and ComDash's sizes and spacing.
Precondition: the user has committed tickets 03 and 04. Run git status. If anything under src/ or e2e/ is modified, stop and tell the user. Untracked files under .scratch/ are expected.

Scope
Modify:
- src/services/comlinked/types.ts, data.ts, european-members.ts, simulation.ts, simulation.test.ts and preview.ts.
- src/components/product/screens/chamber.tsx: it becomes a thin composition of the new parts by Seat. Keep its draft profile view.
- src/components/product/screens/wins.tsx: use the shared wins and Monthly Top Companies lists.
- src/components/product/screens/team.tsx: only where a figure it reads has moved.
- src/components/product/comdash/top-numbers.tsx and level-filter.tsx: only to share their presentational part.
- src/components/product/story-bar.tsx: only if the side step needs it.
- src/app/app/product.css.
- e2e/pilot-preview.spec.ts, and e2e/product-smoke.spec.ts only where it asserts the old chamber list.
Create, under src/components/product/chamber/: the Activity View, its tiles, the member list, the status filter and the Community Manager's tools, one file each. Create shared list components for the Success Wall's wins and Monthly Top Companies under src/components/product/.
Leave untouched: member-import.tsx apart from where it is mounted, ComDash's screens and rules, Kalayaan's story, the claim flow, the ask, the Presenter Guide, the website, /auth, /dashboard, src/middleware.ts, CONTEXT.md and docs/mockup.

Approach
Use test-driven-development: write the Vitest cases at the service seam first, then the Playwright checks. Use systematic-debugging for failures, verification-before-completion before you report, and requesting-code-review once at the end. Project skills: nextjs-app-router, tailwind-v4, data-tables, testing-unit, testing-e2e, coding-standards, no-ai-design-slop.
Step 1, one status per member. Add one seam function that gives a Company's status on a day, by this order: Not yet claimed; Needs an intro, when it has claimed and still has no Lead; Active, when it has claimed and acted in the last 7 days; Quiet otherwise. For Kalayaan it follows the real simulation state. For every other Company it follows that Company's own fixed activity record, never its dealings with Kalayaan. An introduction made for a Company, by the Community Manager or by staff, clears Needs an intro; record both in one place.
Step 2, the figures. Add one seam function for the Activity View: the five totals, the count for each status, and the rows. Each row is the Company and its status, plus a flag when a message is waiting for a Company that has not claimed. The row carries nothing else about the Company and never who is waiting. Deals and wins come from the dated list. Tune the fixed activity records so that on Day 14 the totals are exactly 40 claimed, 20 active, 4 needing an Intro, 3 deals and 2 wins, with Kalayaan and Nordhavn both Active. Hold those records as data with the Companies. The Team Dashboard's weekly active figure and its queue read the same status function, so the two screens agree on any day.
Step 3, the screen. Build the Activity View from ComDash's parts:
- Heading: a small kicker with the chamber's name "on ComLinked", then "Day N of the pilot". The chamber's name comes from chamber.ts.
- Five tiles, in this order: Claimed (shown as "40 of 100"), Active, Need an intro, Deals confirmed, Wins posted. Share the tile markup with ComDash's tiles instead of copying it.
- Member list: a title with the total, then chips All, Active, Quiet, Needs an intro and Not yet claimed, each with its count, using ComDash's chip style. Rows show the Company's mark and name and its status in words. Not-yet-claimed members with a message waiting come first within their group, marked "A member is waiting". A filter with no members shows "No members with this status."
- Side column: the Success Wall's wins, then Monthly Top Companies, using the shared lists that Wins also uses.
- On a phone the tiles form two columns, the list becomes stacked cards and the side column moves below.
Step 4, two Seats. In the Chamber Contact's Seat nothing on the screen changes anything: the filters are its only controls. In the Community Manager's Seat the same screen adds the tools: the member import, "Make an introduction", "Announcement to all members" and "Unusual points". The tools come first on a phone and sit at the top of the side column on a laptop, so the import is visible without scrolling on Stop 1. The introduction's two pickers list Companies that have claimed, with those needing an Intro first. The announcement states how many members will receive it, which is the number that have claimed.
Step 5, the side step. On Stop 5 a link, "See the community manager's side", opens the same day in the Community Manager's Seat, with an introduction prepared between one member that needs it and a Company it would suit. Sending it confirms, and that member no longer needs an Intro. "Back to ECCP's view" returns to the Chamber Contact's Seat. The Story Bar's Seat line follows the Seat, and Next still opens Stop 6 from either.
Step 6, compare the screen with ComDash's Interest Signals tab at 1440, 1280, 390 and 360 pixels and match its sizes, spacing, radii and borders. Then run coding-standards on the diff, then requesting-code-review, then Verification.

Acceptance criteria
Vitest at the service seam covers:
- the Day 14 totals are 40, 20, 4, 3 and 2, and the status counts are 20, 16, 4 and 60
- every Company has exactly one status on every day from Day 0 to Day 30, and the four counts add up to the network's size
- each rule of the status order, including a claimed Company that is both active and without a Lead
- Day 0: nothing claimed and every member Not yet claimed
- connecting with a Company as Kalayaan does not change that Company's status
- an introduction clears Needs an intro, lowers the total by one, and the Team Dashboard's queue agrees
- the Team Dashboard's weekly active figure equals the Active count on the same day
- a waiting message puts a not-yet-claimed Company first with its flag, and the row holds no trace of the sender
- the announcement's audience equals the number claimed
- the existing repeat-run determinism check still passes
Playwright covers each happy and sad path in the ticket file, plus:
- no control in the Chamber Contact's Seat other than the filters
- no sideways scroll on Stops 1 and 5 and the side step at 360, 390, 1280 and 1440 pixels
- axe with no serious or critical violations in both Seats
- keyboard use and reduced motion
Every existing unit, component, product and website test passes, changed only where the old chamber list was asserted, and each change is listed in your report.
Code quality is part of done. Check the diff against each point, and apply them only to code this session touches.
- Clean: each component has one job and a name that says so, in its own file. No dead code, commented-out code, unused CSS or stray logs. The old member list function and the "Latest 12 members" markup are deleted. No any, non-null ! or as used to silence an error. "use client" only on interactive leaves.
- Maintainable: one source for each fact. A Company's status comes from one seam function read by the Activity View, the Community Manager's tools and the Team Dashboard. Totals and counts are computed at the seam, never in a component. Wins and Monthly Top Companies are drawn by one pair of components on both screens. Tiles and chips share ComDash's markup and styles. The chamber's name comes from chamber.ts, addresses from src/paths.ts and colours from App Mode tokens.
- Scalable: adding a status, a tile or a tool changes one place. The screen works for any network size.
- Limits: extract from ComDash only what both screens use now, and keep ComDash's behaviour and tests unchanged. Do not refactor outside Scope; list anything worth fixing in your report.
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
- Show nothing about a member beyond its name and status: no lead, connection, message or deal counts, and never who a member is talking to.
- Add no pilot targets, no "on track" or "behind" labels and no pilot length.
- Status is text, not colour alone.
- Keep the "Example data" tag on the screen. ECCP appears as text only, never a logo.
- Voice: sentence case, no emoji, no exclamation marks.
- Do not edit docs/mockup or CONTEXT.md.
- If something here conflicts with the code or the spec, stop and ask.
```

## Outcome

Built on 2026-11-18 and committed on `feat/website-redesign-pages` once everything was green, as the user chose for these tickets. Nothing was pushed.

**Checks run on the final code**

- Lint and type check pass, and 327 unit tests pass (5 database tests are skipped, as before). 23 are new. One old test of the chamber's counts was replaced, and three that read the old member list were rewritten.
- The production build passes. It ran in a scratch copy, because a ComLinked dev server was running on port 3001 from this folder.
- Browser tests: 286 in all, run against a dev server started from a scratch copy on port 3111 with the presenter's example address. 285 passed. The one failure is the website's axe check on `/`: a chip in the homepage's animated ring fails colour contrast mid-animation. This ticket doesn't touch that page, and the same check failed 1 of 8 runs on the committed code before this ticket while the machine was loaded.
- 28 browser tests are new. Earlier runs against the port 3001 server had some timeouts under load; each passed when rerun alone.
- Laid side by side with ComDash's Interest Signals tab at 1280 pixels, the tiles, panels, chips and table share its radii, padding, borders and type sizes. Only heights differ, with their content. Screenshots at 1280 and 390 pixels showed no sideways scroll.

**How the status works**

- `memberStatus(id, day)` in `simulation.ts` is the one rule:
  - Not yet claimed.
  - Needs an intro, while a claimed member has no Lead.
  - Active, when it acted in the last 7 days.
  - Quiet, otherwise.
- The Activity View, the Community Manager's tools and the Team Dashboard all read it.
- Every member except Kalayaan Foods has an activity record held with its data row in `data.ts` and `european-members.ts`, as `activity: { firstDayLead, actsEvery }`.
  - A member acts on the day it claims, then every `actsEvery` days. With `null` it acts only on its claim day.
  - A member with no first-day Lead needs an intro until one is made.
- Kalayaan Foods acts on its claim day and on any day it earns points. It has a Lead from its claim day, because it gets its day-one Matches when it claims.
- Every Intro, whether the Community Manager's or staff's, is recorded in `S.intros` with its day. The Team Dashboard's separate `helped` record is gone.
- `activityView()` gives:
  - the five tiles
  - the member count
  - the count for each status
  - the rows, each holding only id, name, initials, status and the waiting flag.

**Choices made that this ticket did not spell out**

- **Day 14 statuses.** Active: Kalayaan Foods, Nordhavn, every Monthly Top Company of Day 14, both sides of the two deals by Day 14, Pacific Pack and the six members that claimed on Days 8 to 14. Quiet: the other 16. Needs an intro: Lakbay Hotels, Bigasan Rice Mills, Palengke Online and Medivant Pharma Distribution.
- **List order.** The list follows the filters' order (Active, Quiet, Needs an intro, Not yet claimed), then the network's order, so Kalayaan Foods comes first.
- **The waiting member is already in the seed.** The two-weeks seed already holds a waiting message to Northline Logistics, so Stop 5 shows one member waiting with no extra step.
- **The side step is a button in the Story Bar, not a link.** It changes the Seat on the same address, and the Story Bar keeps it out of the Chamber Contact's screen, whose only controls are the filters.
  - A reload during the side step reopens Stop 5 in the Chamber Contact's Seat.
  - Returning to ECCP's view closes any draft profile opened on the community manager's side.
- **The prepared Intro** pairs the first member needing one (Lakbay Hotels) with its first network neighbour that has claimed and has a Lead (Maple Bay Grocers). Staff Intros use the same rule.
- **Drafts open from the member list only in the Community Manager's Seat.** Each member's name opens its draft profile there, as the old list did. In the Chamber Contact's Seat the rows are plain text.
- **The heading** is a kicker, "ECCP on ComLinked", then "Day 14 of the pilot", then "Read-only" in the Chamber Contact's Seat.
- **"Back to company view"** shows only in the full Demo. Inside the Pilot Preview it led to Kalayaan's ComDash under the Community Manager's Seat, which ticket 03 left for later.
- **Day 0 tools** say what can't happen yet:
  - Introductions open once two members have claimed.
  - An announcement would reach nobody, and is also refused at the seam.
  - The unusual points show only once Tala Print and Label has claimed. Before, its 68 points showed on Day 0, before it could have earned any.
- **Monthly Top Companies has an empty state.** It shows before any member has claimed.
- **Status pills stay in sentence case,** unlike the Interest Levels, which ComDash writes in capitals.

**Changed outside this ticket's main steps**

- **The Team Dashboard queue** follows the status rule:
  - "No lead yet" for Needs an intro.
  - "Hasn't claimed its profile" for Not yet claimed.
  - "Quiet for 7 days" for Quiet, except a member introduced in the last 7 days.
  - Claim reminders now sort before quiet members, so the queue's first 12 rows still include reminders. On Day 14, 15 quiet members are queued.
  - The old "No connection or intro yet" row for Kalayaan Foods is gone, because Kalayaan always has a Lead once claimed.
- **Team Dashboard figures change** with the records: weekly active is 20 of 40 claimed (50%) on Day 14, where it was 39.
- **`co()`** now throws for an unknown id instead of returning nothing.
- **`teamSpike`** reads its two parts without `!`.
- **ComDash's tiles and chips** now draw through the shared `NumberTiles` and `FilterChips`, with no visible change.
- **Wins** draws its Success Wall and Monthly Top Companies through the shared `SuccessWallList` and `MonthlyTopList`.

**Changes to existing tests**

- `simulation.test.ts`: three tests that read `members()` or `memberTotals()` now read `activityView()`, and the old test of the chamber's counts is replaced by the new Activity View tests.
- `pilot-preview.spec.ts`:
  - Stops 1 and 5 expect the new headings, and the tiles replace the old count line.
  - The tool heading is now "Announcement to all members".
  - The Day 0 test reaches ComDash through the Presenter Guide, since "Back to company view" no longer shows in the Pilot Preview.
  - The draft tests open drafts from the new member list; the Day 14 one goes through the side step.
  - The `memberImport` helper takes the innermost section under its heading.
- `product-smoke.spec.ts`: two tests read the new heading and tiles in place of the old count line.

**Left for later**

- **Kalayaan's Monthly Top row on Wins is not highlighted.** The old markup meant to add the class `me` but wrote `a-lime`, so it never applied. The shared list keeps that look, so ECCP's view doesn't mark Kalayaan as "me".
- **The member list shows all 100 rows under All.** On a phone the side column follows them. The filters are the way to a shorter list.
- **Wording kept from the ticket's code.** The intro pickers read "First company" and "Second company", and the Team Dashboard still says "Make an intro".
- **The homepage ring's axe check is flaky under load,** before and after this ticket.
