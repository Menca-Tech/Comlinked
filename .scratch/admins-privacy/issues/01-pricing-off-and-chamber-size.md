# 01 — Pricing off and a chamber of 1,000

**What to build:** the full Demo opens with no prices, tiers or blurred names; ComDash names everyone, as in the Pilot Preview. The Presenter Guide can still switch "Possible future pricing" on. ECCP's chamber counts 1,000 member Companies: every chamber-wide figure scales to 1,000, while the 100 Example Companies stay the only named ones and the screens say so. Deals, wins, and Kalayaan Foods' own story don't change.

**Spec:** `docs/specs/2026-11-18-admins-privacy-and-day-1k.md`. Read these sections:

- Implementation Decisions: "Pricing default" and "The Chamber's size"
- Happy and sad paths: the Pricing, Day 0 and Day 14 lines
- User stories 1–14
- Testing Decisions: the Pricing and Chamber Size bullets

**Blocked by:** None — can start immediately. It is the first of three sessions, run one after another on the same branch.

**Status:** done (2026-11-19)

- [x] A fresh full Demo has "Possible future pricing" off: ComDash names every Company and shows every Interest Signal, with no Free, Growth or Pro switcher
- [x] Switching pricing on in the Presenter Guide shows the Free member view exactly as today, and a full page load turns pricing off again
- [x] The Presenter Guide states each Later item's default separately: pricing off unless switched on, after-MVP previews off in the Pilot Preview and on in the full Demo
- [x] The Chamber Size (1,000) is held once, with the chamber setting, and every chamber-wide figure reads it
- [x] Chamber-wide figures add up to 1,000 on every day. The Example Companies count live; the 900 unnamed members follow the claim schedule, 9 for each Example Company in that status that day
- [x] Day 14 with no session actions reads 400 of 1,000 claimed, 200 active, 160 quiet, 40 needing an intro and 600 not yet claimed; deals confirmed 3 and wins posted 2
- [x] One Intro at Stop 5 moves "needs an intro" from 40 to 39
- [x] The Activity View is headed "1,000 members", always shows "Showing the 100 example members of 1,000", and "Show all" names how many examples it shows
- [x] Day 0's import finds 1,000 companies, builds 1,000 profiles and readies 1,000 claim links. The Member List shows the Example Companies plus "and 900 more from the Member List"
- [x] An announcement on Day 14 says "Sent to 400 members who have claimed."
- [x] Stop 1 and Stop 5 wording, and any Team Dashboard chamber-wide figure, read the Chamber Size; the Engine's wording calls its 100 the example companies
- [x] Kalayaan Foods' Matches, Daily Lead List, search, Search Rank, Interest Signals and Network Ring are unchanged
- [x] Meets the code quality points in its prompt, with the result reported

## Happy paths

- `/app` in a fresh tab, as Kalayaan two weeks in: ComDash Overview and Interest Signals name every interested Company with its Interest Level. There is no "View as" switcher, no "See who" and no upgrade box.
- G opens the Presenter Guide, then "Possible future pricing" goes on: the Free member view appears with its blurred rows, as today. Growth and Pro work as today.
- Reload: pricing is off again and names show.
- Stop 1, Day 0, the Community Manager's Seat: "0 of 1,000" claimed. The chips read All 1,000 and Not yet claimed 1,000. The heading is "1,000 members", with the example line under it.
- Stop 1's import: "members-sample.csv: 1,000 companies found", the build counts up to 1,000, and it ends "1,000 profiles built. 1,000 claim links ready for ECCP to send."
- Stop 5, ECCP's view: "400 of 1,000" over a bar split 200, 160, 40 and 600, with deals confirmed 3 and wins posted 2 beside it. The chips read All 1,000, Active 200, Quiet 160, Needs an intro 40 and Not yet claimed 600. The groups show six named examples each.
- "Show all" under Active shows the 20 named Active examples, labelled as examples, and selects the Active chip.
- The side step to the Community Manager's Seat, then sending an Intro: "needs an intro" reads 39.
- Day 14 in the full Demo: the Community Manager's announcement says "Sent to 400 members who have claimed."

## Sad paths

- The Pilot Preview still opens with both Later items off, whatever the full Demo did before.
- Switching pricing off while Growth is chosen returns ComDash to no tier, with every name shown.
- Day 0, before any Claim: the announcement is still refused because no member has claimed ("…would reach nobody").
- A status with no Example Companies (Active on Day 0) shows its one empty line and a chip count of 0. Its scaled count is also 0, because the unnamed members follow the same schedule.
- No screen seen from Kalayaan's Seat says the chamber has 100 companies.
- At 360 and 390 pixels, "1,000" and the example line fit with no sideways scroll; the chip row wraps as today.
- Screen readers hear "1,000" as a number, and the bar is still hidden from assistive technology, with every status as a label and count.
- Reduced motion: the import's build still ends at 1,000 with no animation.
- Every ComDash tier test still passes once it switches pricing on first.

## Executer prompt

```
Goal
You are the executer for ticket 01 of three. Make the ComLinked Demo open with no prices, tiers or blurred names, and make ECCP's chamber count 1,000 member Companies, with only the 100 Example Companies named. The Demo is shown today, 2026-11-19, at the Mapua meeting from a Vercel link, so finish, verify and commit each part before starting the next.

Context
Repo: /Users/rafaeliiiprudente/Documents/coding projects/Comlinked. Branch: feat/website-redesign-pages. Stay on it and create no new branch.
Read first, in this order:
- CLAUDE.md, AGENTS.md
- CONTEXT.md, the sections "Participants" and "Showing ComLinked"
- docs/adr/0010-client-side-product-simulation.md
- the whole of docs/specs/2026-11-18-admins-privacy-and-day-1k.md
- in docs/specs/2026-11-17-pilot-preview.md, the sections "The network", "The Community Manager's import", "ECCP's Activity View" and "The later items"
- this ticket file, .scratch/admins-privacy/issues/01-pricing-off-and-chamber-size.md, including its happy and sad paths
Why: in the meeting on 2026-11-18, Richard decided to turn the paywall off for now and to show ECCP at its real size, about 1,000 member companies.
How the product runs: everything under /app is a browser-held simulation behind the Service Seam src/services/comlinked (ADR 0010). Screens are client components; they read state with useSimulation and change it through act. Derived facts are seam functions. Tests: src/services/comlinked/simulation.test.ts (Vitest), and e2e/*.spec.ts (Playwright plus axe).
What exists today:
- Pricing:
  - The simulation's start state sets laterItems to { pricing: true, previews: true }. openStop sets both false for the Pilot Preview. toggleLaterItem flips one, and returns to the Free view when pricing goes off. The seam returns the chosen view only while pricing is on.
  - src/components/product/demo-guide.tsx lists the Later items under one note, "Off in the Pilot Preview and on in the full demo."
- The network: NETWORK in src/services/comlinked/data.ts is the pool plus Kalayaan Foods (100). Seam functions that read it:
  - claimedCount(day)
  - activityView(), whose tiles include claimed with of: NETWORK, and whose rows come from networkMembers()
  - memberGroups(choice), which shows GROUP_PREVIEW members per status in the All view
  - memberList(), for Day 0
  - the member import, timed by IMPORT_BUILD_MS
  - the announcement toast, "Sent to N members who have claimed."
  - percentages of NETWORK used by the Team Dashboard and the Engine
- Screens that show those figures:
  - src/components/product/chamber/: activity-view, member-list, status-filter, member-import, claimed-figure, split-bar, manager-tools
  - screens/team.tsx (weekly active of NETWORK)
  - screens/engine.tsx, which draws all 100 and says "calculated from a network of 100 companies"
- src/services/comlinked/chamber.ts is the one chamber setting (CHAMBER). src/services/comlinked/preview.ts holds the Stops' titles and Story Bar lines.
- Tests that assume pricing on or 100 members:
  - in simulation.test.ts: "the later items", "plan views", "the network of 100", "Kalayaan Foods' story with 100 Companies", "the chamber's name and its counts", "the Activity View's members, grouped by status", "ECCP's Activity View", "two weeks in, on Day 14", "Day 0, before any Claim", "the Member List", "the member import"
  - in e2e/pilot-preview.spec.ts: IMPORT_RESULT, "Claimed0 of 100", "All 100", "Claimed40 of 100", 100 member rows, the Member List's 100 rows
  - in e2e/product-smoke.spec.ts: "the chamber's network of 100", "100 members", "Claimed40 of 100", the Engine tests, the tier tests, and "a full page load resets the selected view to Free member"
  - in e2e/demo-rules.spec.ts: "members-sample.csv: 100 companies found"
Decided by the user, do not change:
- Pricing starts off in the full Demo too. The switch stays. The tier designs stay as they are.
- The Chamber Size is 1,000, held with the chamber setting.
- The 100 named Companies are the Example Companies. None is added, removed or renamed.
- Chamber-wide figures are the Example Companies' live figure plus the unnamed members' fixed figure. The unnamed figure is 9 times the number of Example Companies the claim schedule and activity records alone put in that status that day.
- Deals confirmed, wins posted, the Success Wall and Monthly Top Companies stay named and unscaled.
- Kalayaan's own world (Matches, Daily Lead List, search, Search Rank, Interest Signals, Network Ring, Intros) stays on the Example Companies.
Precondition: run git status. Expected: the untracked spec docs/specs/2026-11-18-admins-privacy-and-day-1k.md and untracked files under .scratch/; leave them. If anything under src/ or e2e/ is modified, stop and tell the user.

Scope
Modify:
- src/services/comlinked/chamber.ts, data.ts, simulation.ts, types.ts, preview.ts and simulation.test.ts
- src/components/product/demo-guide.tsx
- src/components/product/chamber/activity-view.tsx, member-list.tsx, status-filter.tsx, member-import.tsx, claimed-figure.tsx and manager-tools.tsx; split-bar.tsx only if its figures need it
- src/components/product/screens/team.tsx and engine.tsx, for wording and chamber-wide figures only
- e2e/pilot-preview.spec.ts, e2e/product-smoke.spec.ts and e2e/demo-rules.spec.ts
- any other file under src/ whose wording states the chamber's size as 100 from a Company's Seat
Create: a number formatter only if none exists, in the seam or src/lib, used for every figure that can reach 1,000.
Leave untouched:
- the ComDash tier designs
- matching, search and the Example Companies' data
- the account menu, people, privacy and logo work (tickets 02 and 03)
- docs/ (ticket 03 updates the documents)
- the website, docs/mockup, CONTEXT.md and docs/design-system

Approach
Use test-driven-development: Vitest at the Service Seam first, then the Playwright checks. Use systematic-debugging for failures, verification-before-completion before you report, and requesting-code-review once at the end. Project skills: testing-unit, testing-e2e, coding-standards, nextjs-app-router.
Step 1, pricing.
- Make pricing start off in the simulation's start state, leaving previews as today.
- Write each Later item's default in the Presenter Guide.
- Update the tests that assume pricing starts on, so each switches it on first; never weaken an expectation about the tiers.
- "a full page load resets the selected view to Free member" becomes "a full page load turns pricing off".
- Commit when green.
Step 2, the Chamber Size at the seam.
- Add the Chamber Size to the chamber setting.
- Give the seam one function that returns each status's chamber-wide figure for a day, from the two parts described above. Every chamber-wide figure reads it: the Activity View's tiles and chips, the group counts, the announcement, the import and the Team Dashboard.
- Keep NETWORK, or rename it, for the Example Companies only. Name things so the two sizes can't be confused, e.g. EXAMPLE_COMPANIES and the Chamber Size.
- Write the Vitest checks first:
  - Day 0, Day 1 and Day 14 figures add up to 1,000
  - Day 14 with no session actions is 400, 200, 160, 40 and 600
  - an Intro moves needs an intro by one
  - deals and wins are unchanged
  - the announcement says 400
  - groups list only Example Companies with scaled counts
  - Kalayaan's story tests still pass
- Commit when green.
Step 3, the screens.
- Show "1,000" with a thousands separator everywhere.
- The Activity View heading reads the Chamber Size. Show the line "Showing the 100 example members of 1,000" in every status view.
- "Show all" names the examples it shows, e.g. "Show all 20 examples"; it never claims the scaled count.
- The import and the Member List read the Chamber Size and add "and 900 more from the Member List" after the named rows.
- Stop 1 and Stop 5 wording and any Story Bar line with a count read it too.
- The Engine keeps drawing its 100 nodes; its wording names them as example companies.
- Search the product for any other wording that tells a Company the chamber has 100 companies, and change it.
- Update the browser tests and add the happy and sad paths of this ticket.
- Commit when green.
Step 4, finish.
- Run the full checks below and requesting-code-review, and fix what it finds.
- Write the Outcome section at the end of this ticket file: checks run with their real results, choices the ticket didn't spell out, and anything for the user to decide.
- Commit it.

Acceptance criteria
Vitest at the Service Seam covers:
- pricing starts off in a fresh full Demo and in the Pilot Preview, switching it on gives the Free member view, and a reset turns it off
- every bullet in step 2
- the existing Activity View, Team Dashboard agreement and repeat-run checks still pass with their new figures
Playwright covers:
- every happy and sad path in this ticket file
- no sideways scroll on Stop 1 and Stop 5 at 360, 390 and 1280 pixels
- axe with no serious or critical violation on ECCP's view in both Seats and on ComDash with pricing off
Every existing unit, component, product, Pilot Preview and website test passes. Each changed expectation is a deliberate update to the new numbers or the new pricing default, never a weakened check.
Code quality is part of done. Check the diff against each point, and apply them only to code this session touches:
- Clean: each function and component has one job and a name that says so. No dead code, commented-out code or stray logs. Strict types: no any, no non-null assertions, no silencing casts.
- Maintainable: one source for each fact. The Chamber Size lives only in the chamber setting. The chamber-wide figure comes from one seam function. "1,000" is formatted by one formatter. No screen computes a chamber figure itself.
- Scalable: changing the Chamber Size to another number changes one line, and every figure, label and test helper follows. Adding a status changes one place.
- Limits: no abstraction for features not in this ticket. Don't refactor outside Scope. Split a file you rebuild past about 300 lines only where it has a clear seam.
Run coding-standards on your diff and report the result.

Verification
After each step: pnpm lint && pnpm type:check && pnpm test && pnpm build, plus the browser tests for that step's screens.
At the end: pnpm lint && pnpm type:check && pnpm test && pnpm build, then the whole of pnpm test:e2e.
Use NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co and NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder.
Port 3000 on this machine is often a different project, and Playwright reuses whatever answers there. Check it first, and if it isn't ComLinked run PLAYWRIGHT_PORT=3111 pnpm test:e2e.
The user may run their own ComLinked dev server on port 3001, which holds .next. If a build in the repo clashes with it, copy the working tree to the scratchpad (without node_modules, .next and .git), symlink node_modules to the repo's, and build there. Don't stop the user's server without asking.
Wrap long browser runs in caffeinate -i. The homepage ring's contrast check is a known flake under load; rerun it alone before treating it as real.
Report actual output, including anything skipped.

Guardrails
- Commit when green, after each step, as Conventional Commits on feat/website-redesign-pages. Never push, merge, open a PR, or switch or create branches.
- Stop after step 4 and report. Do not start ticket 02.
- Add no dependencies.
- Never hide a Company's name. Never widen what a tier hides.
- Keep the "Example data" tag on every screen. ECCP appears as text only, never a logo.
- Status is text, never colour alone. Never add unsafe-inline or unsafe-eval to script-src.
- Voice: sentence case, no emoji, no exclamation marks.
- Send nothing about this project to an outside service. Never publish the mockup.
- If the code or the spec contradicts this prompt, stop and ask the user.
```

## Outcome

Built on 2026-11-19 on `feat/website-redesign-pages`, in four commits after `f13f190`:

- `cf66a1f` pricing off by default
- `a6cf0f0` the Chamber Size at the seam
- `ce031f3` the chamber screens at 1,000
- `ce39eae` fixes from the code review

Nothing was pushed.

### Checks run (real results)

- `pnpm lint`: no warnings or errors.
- `pnpm type:check`: clean.
- `pnpm test`: 357 passed, 5 skipped (22 files, 1 skipped). `simulation.test.ts` alone: 256 passed.
- `pnpm build`: compiled successfully. It ran in a scratchpad copy with `node_modules` symlinked, because a dev server on 3111 held `.next`.
- `pnpm test:e2e` in full (`PLAYWRIGHT_PORT=3111`, `--workers=3`, fresh server): 509 passed, 1 failed. The failure was "foundation on / › axe finds no serious or critical violations", the known homepage-ring flake. Rerun alone three times, it passed each time.
- After each step, the Demo specs in full: product-smoke, demo-rules, pilot-preview and a11y. 366 passed after step 1, and 373 passed plus 2 failed after step 3. The 2 failures were my new phone-width check, which assumed the figure was in view on Stop 1; on a phone the tools come first. I changed it to check width, and it passed.
- Screenshots of Stop 5 at 390 and 1280, the Stop 1 import at 390, and the Team Dashboard chart at 360, looked over by eye. They are in the session scratchpad, not committed.
- Code review (`/code-review`, two axes) ran, and its findings were fixed in `ce39eae` or are listed below.

### Code quality, against the prompt's points

- **One source.** `CHAMBER.size` in `chamber.ts` is the only place 1,000 is written in `src/`.
  - `chamberCounts(day)` is the one function behind every chamber-wide figure: Activity View tiles, chips, group counts, the announcement, the Team Dashboard's claimed, weekly active, target, adoption and first-lead figures.
  - `formatCount` is the one formatter.
  - `NETWORK` became `EXAMPLE_COMPANIES`; `claimedCount` is gone.
- **Scalable.**
  - Changing `CHAMBER.size` changes every figure and label. Unnamed members are shared out by running totals, so the counts stay whole and still add up when the size isn't a multiple of 100.
  - The status rules live once, in `statusBy`, which serves both the live status and the scheduled one. Adding a status changes that function and `MEMBER_STATUSES`.
  - Unit-test totals read `CHAMBER.size`.
  - Browser tests still spell out the copy ("1,000", "Showing the 100 example members of 1,000", "and 900 more…") on purpose, since they check exact wording on screen.
- **Clean.**
  - No `any`, no non-null assertions and no casts were added, and the diff removes one `!`.
  - No dead code or logs.
  - Copy is sentence case.
- **Limits.**
  - `simulation.ts` wasn't rebuilt, so it wasn't split.
  - One file outside the Modify list changed: `comdash/level-filter.tsx`, where the shared filter chips write their count with `formatCount`. That was the only way to show "All 1,000" with one formatter.
- **coding-standards.** I checked against AGENTS.md, the coding-standards skill and the ticket's points through the review's Standards axis. Screens import only from the seam. Status is shown in words, never by colour alone. "Example data" stays on screen. ECCP appears as text only.

### Choices the ticket didn't spell out

1. **Kalayaan Foods' own schedule.** The unnamed members follow the examples' schedule. For Kalayaan, that schedule is "claims on Day 1 and acts every day after".
   - Day 14 with no session actions is exactly 10 times the examples: 400, 200, 160, 40, 600.
   - On Day 1, before Kalayaan's Claim, its 9 unnamed members already count as claimed and Active. Kalayaan's Claim then adds one.
   - Day 0 reads 0 of 1,000.
2. **A status the unnamed members hold when no example does.** Example: introduce all four examples needing an intro, which leaves 36 needing one. The group still shows under "All" with its count, and the line "None of the example members has this status." A status with 0 in the whole chamber still shows the existing "No members with this status."
3. **The import counts its profiles in steps of 10.** It builds the 100 named rows one by one over about four seconds. "Building profiles: N of 1,000" keeps pace, so N rises by 10 each time and ends on 1,000.
4. **Team Dashboard.**
   - These read the chamber: the weekly active chart (axis 0 to 1,000, its "now" and its target), Adoption (claimed within 14 days, of 1,000), Engagement (weekly active of claimed) and Immediate leads (first-day lead rate, 360 of 400 = 90%).
   - These stay on the named examples:
     - the per-company averages (habit, ComMails, invites per active company)
     - the AI and freshness rates
     - agent adoption, since agent opt-outs belong to named Companies
     - the "companies need help" queue (79 today), since staff act on a named Company
   - The chart's left margin grew from 32 to 44 pixels so "1,000" fits on the axis.
5. **The Engine** still draws its 100 nodes. Its sentence and map label now say "the 100 example companies".
6. **Presenter Guide.** Each switch's small line now ends with its default: pricing says "Off unless you switch it on.", and the previews say "Off in the Pilot Preview and on in the full demo." The single shared note is gone.
7. **Browser tests changed on purpose.**
   - The tier tests now switch pricing on first. Their expectations about the tiers are unchanged.
   - Opening "Two weeks in" from the guide now expects no "View as" switcher.
   - The demo-rules screens that show the tiers now switch pricing on first.

### For the user to decide

- **The website's Activity View panel still pictures "40 of 100 claimed"** (`e2e/website-redesign.spec.ts`, the homepage example panel). The website was out of scope. Should it move to 400 of 1,000?
- Are steps of 10 in the import's build count fine?
- Should Kalayaan's 9 unnamed members count as claimed on Day 1 before its Claim? The other reading is to make Kalayaan's schedule follow its live Claim. Then the unnamed would no longer be "unaffected by session actions", and Day 1 would jump by 10 at the Claim.
- For Richard (spec question 5): 1,000 members shown with 100 named examples. Is that acceptable for ECCP?
