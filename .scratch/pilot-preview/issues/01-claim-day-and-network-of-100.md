# 01 — One claim day per Company, and a network of 100 under ECCP's name

**What to build:** the Demo's network grows from 40 Companies to 100, and it belongs to ECCP by name. A presenter who searches, opens the chamber tools or looks at Monthly Top Companies meets European-style members beside the Filipino food businesses, and reads "ECCP" wherever the chamber is named. Underneath, each Company has one claim day, and a Company that has not claimed never acts. Kalayaan Foods' own story does not change in this ticket.

**Spec:** `docs/specs/2026-11-17-pilot-preview.md`, sections "The chamber setting", "The network" (without Nordhavn's part in the story) and "Claiming as one fact". User stories 4, 84, 89 and 90.

**Blocked by:** None — can start immediately.

**Status:** built on 2026-11-17 with `/implement`, uncommitted. See "Outcome" at the end.

- [x] Each Company has one claim day, or none, and nothing else decides whether it has claimed
- [x] The network holds 100 Companies: Kalayaan Foods, the 39 existing ones and the 60 European-style members, each with an invented website
- [x] On Day 14 exactly 40 have claimed, Kalayaan among them, including every Company in its story, Nordhavn Freight Forwarders and at least 15 European-style members
- [x] On no day does a Company that has not claimed send a signal, a message or a Connection Request, accept one, reply, post an Ask, hold points or appear in Monthly Top Companies
- [x] Every screen that names the chamber reads one setting and says ECCP
- [ ] Every stated network or audience size is the real count (open: the member import still shows its 12-row sample list, which ticket 04 rebuilds)
- [x] Kalayaan's Matches, leads, interested Companies and rank are the same as before this ticket (one exception, under "Outcome")
- [x] Meets the code quality points in its prompt, with the result reported

## Happy paths

- "New company", then claim: the three Matches are still Maple Bay Grocers, Pacific Pack Solutions and Palengke Online.
- Search for "wine": Vinoteca Wine Importers is listed. Search for "freight": European-style and existing companies both appear.
- "Two weeks in": the ComDash header reads "Food manufacturing · Quezon City · ECCP member", and the interested Companies are who they were before.
- Chamber tools: the heading names ECCP instead of "example chamber", and the announcement button states how many members will receive it.
- Wins: Monthly Top Companies is headed with ECCP and the month, and lists only Companies that have claimed.
- Team Dashboard, opened from the Presenter Guide on Day 14: claimed within 14 days reads 40%.
- Engine page: the network map shows all 100 Companies and stays legible on a laptop and a phone.
- A staff claim reminder from the Team Dashboard still makes that Company claim the next morning.

## Sad paths

- A Connection Request sent to a Company that has not claimed stays pending and is never accepted.
- A message sent to a Company that has not claimed gets no reply.
- Fourteen "Next morning" steps in a row: every viewer, searcher, request and Ask comes from a Company that had claimed by that day.
- A Company with no claim day never appears in Monthly Top Companies, whatever points its data holds.
- A long European-style name on a 360 pixel phone wraps inside its row, with no sideways scrolling.
- The mockup's network data is missing from the machine: the session stops and says so, and invents nothing.
- The claim-day constraints cannot all hold at once: the session stops and reports the counts.

## Executer prompt

```
Goal
Give the ComLinked Demo a network of 100 invented Companies that belongs to ECCP by name, with one claim day per Company as the single fact behind "has it claimed", and with no Company acting before it has claimed. Kalayaan Foods' story must come out unchanged.

Context
Repo: /Users/rafaeliiiprudente/Documents/coding projects/Comlinked. Branch: feat/website-redesign-pages. Stay on it and create no new branch.
Read first, in this order: CLAUDE.md, AGENTS.md, CONTEXT.md (the entries Chamber, Community Manager, Chamber Contact, Claim, Pre-built Profile, and the section "Showing ComLinked"), docs/adr/0010-client-side-product-simulation.md, then docs/specs/2026-11-17-pilot-preview.md. In the spec, the sections "The chamber setting", "The network" and "Claiming as one fact" are your brief. The happy and sad paths are in .scratch/pilot-preview/issues/01-claim-day-and-network-of-100.md.
How the product runs: everything under /app is a browser-held simulation behind the service seam src/services/comlinked (ADR 0010). Screens are client components that read it with useSimulation and change it through act. Derived facts are exported functions of the seam, tested in src/services/comlinked/simulation.test.ts. A full page load resets the simulation.
What exists today:
- 40 Companies: Kalayaan Foods (the signed-in Company, "me") and 39 in POOL, built from RAW, TAG and EDGES in data.ts.
- Two sources for claiming, which disagree: AGENT_STATUS marks eight ids "unclaimed", and teamRec() works out a claimDay by formula for the staff and chamber screens. isUnclaimed() reads the first, members() and teamData() read the second, and a staff reminder writes S.team.claimed.
- Some data breaks the rule you are adding. For example, bigas is "unclaimed" but has rival points.
- The chamber is named in one place, me.chamber = "ECCP". The chamber tools say "example chamber", Wins says "Your chamber", and announcements say "Your chamber sent an announcement".
- rank() counts all eleven rivals in RIVAL_PTS, whether or not they have claimed.
The 60 new members are invented and exist only in the frozen HTML mockup, which is git-ignored and local to this machine: docs/mockup/source/network.js. docs/mockup/source/app.js shows how the mockup used them (search for COMLINKED_ECCP), and docs/mockup/checks/network-check.mjs lists the data rules that protected Kalayaan's story (its "Data rules" block). Read these three files. Never edit anything under docs/mockup. If network.js is missing, stop and tell the user.
Decided by the user, do not change: Kalayaan Foods stays the Company in the story. ECCP is named from one setting. ECCP appears as text only, never a logo. Every company is invented and uses a reserved example domain for its website.
Precondition: run git status. CONTEXT.md, docs/specs/2026-11-17-pilot-preview.md and .scratch/pilot-preview/ may be uncommitted and are expected. If anything under src/ or e2e/ is modified, stop and tell the user.

Scope
Modify:
- src/services/comlinked/types.ts, data.ts, simulation.ts, simulation.test.ts and index.ts.
- src/components/product/screens/chamber.tsx: the heading line and the announcement count only. Its layout is rebuilt in a later ticket.
- src/components/product/screens/wins.tsx: the Monthly Top Companies line only.
- src/components/product/screens/team.tsx: the pilot line names the chamber.
- src/components/product/screens/agent.tsx: only where it reads the unclaimed status.
- src/components/product/screens/engine.tsx and src/app/app/product.css: only if the network map is not legible with 100 Companies.
- e2e/product-smoke.spec.ts and e2e/website-redesign.spec.ts: only where a test asserts an old count or old chamber wording.
Create:
- src/services/comlinked/chamber.ts: the chamber setting, with the short name "ECCP", the full name "European Chamber of Commerce of the Philippines", the sender name "ECCP Membership" and the presenter's first name "Richard". Later tickets read the last two.
- src/services/comlinked/european-members.ts: the 60 members' data, so data.ts does not grow by them.
Leave untouched: finishClaim, seedTwoWeeks and WINS, which hold Kalayaan's story and change in ticket 02. Also ComDash, the product shell, the Presenter Guide, the website, /auth, /dashboard, src/middleware.ts, CONTEXT.md and docs/mockup.

Approach
Use test-driven-development: write the Vitest cases at the service seam before each change. Use systematic-debugging for failures, verification-before-completion before you report, and requesting-code-review once at the end. Project skills: testing-unit, testing-e2e, nextjs-app-router, coding-standards.
Step 1, one claim day, with today's 40 Companies. Give each Company a claim day or none, held with its data. Add one seam function that answers whether a Company has claimed by a given day, defaulting to today. A staff reminder keeps working by setting that Company's claim day for the session. Replace every reader of the old two sources: isUnclaimed, teamRec's claimDay formula, members, teamData, the daily simulation, the suggestion lists and the AI Lead Agent preview. Remove the "unclaimed" entries from AGENT_STATUS; "optout" stays, because it is a different fact. Kalayaan's own claim day is the day it claims in the flow.
Step 2, a Company that has not claimed never acts. It sends no Interest Signal, message or Connection Request, accepts no request, sends no reply, posts no Ask, holds no Activity Score points, is not counted in rank() and is not in Monthly Top Companies. Write the test first: run the simulation from a new claim through 30 mornings and assert that nothing comes from a Company that had not claimed by that day. Then correct whatever data or logic breaks it. Wins are out of this rule until ticket 02 dates them.
Step 3, the 60. Bring every row of the mockup's network data into european-members.ts with the same ids, names, industries, cities, categories, offers, needs, tags and points, and its connections into the network's edges. Add any category or industry label the new rows need. Give all 100 Companies an invented website on a reserved example domain, such as nordhavn.example. Carry the mockup's data rules over as Vitest cases: 60 new and unique ids; none of the 60 gives what Kalayaan seeks (grocery, freight, packaging) or wants what it offers (snacks, frozen, privatelabel, foodmfg); each new member links to at most one original Company; no pair of originals gains a connection; every new member has at least one connection.
Step 4, the schedule. Set claim days so that all of this holds:
- Nobody has claimed before Day 1.
- When Kalayaan claims on Day 1, at least eight others already have, including its three Matches and every Company that sends it a signal or a message that day.
- The eleven food suppliers it is ranked against have claimed by Day 1, so its rank is what it is today.
- On Day 14 exactly 40 of the 100 have claimed, counting Kalayaan. They include every Company that acts in its two-weeks story, Nordhavn Freight Forwarders (by Day 1) and at least 15 European-style members.
- Some Companies never claim.
If these cannot all hold, stop and report the counts instead of bending one.
Step 5, the name. Every place that names the chamber reads chamber.ts, including me.chamber, the chamber tools' heading, the Monthly Top Companies line, announcements and their notification, and the Team Dashboard's pilot line. Leave the other chambers named on the Pro view as they are.
Step 6, counts. Wherever the Demo states the size of the network or of an audience, it is computed. An announcement states the number of Companies that have claimed.
Step 7, check the two screens that draw the whole network, the Engine page and the Team Dashboard, at 1280 and 390 pixels wide. Fix legibility only if 100 Companies break it.
Step 8, run coding-standards on the diff, then requesting-code-review, then Verification.

Acceptance criteria
Vitest at the service seam covers:
- one function decides whether a Company has claimed, and the chamber list, the Team Dashboard and the AI Lead Agent preview agree for every Company
- a staff reminder leads to a claim the next morning
- the never-acts rule across 30 mornings, for signals, messages, requests, accepted requests, replies, Asks, points, rank and Monthly Top Companies
- 100 Companies, each with a website, and the five data rules carried over from the mockup
- every point of the schedule in Step 4
- the day-one Matches, the Day 1 Daily Lead List, the two-weeks interested Companies and the rank are what they were before this ticket
- the chamber's name on every derived label comes from chamber.ts, shown by a test that reads the setting instead of the literal
- the existing repeat-run determinism check still passes
Playwright covers each happy and sad path in the ticket file that a browser can show, plus no sideways scroll at 360 and 1280 pixels on the chamber tools, Wins and the Engine page.
Every existing unit, product and website test passes. Change an expectation only where a count or chamber wording really changed, and list each change in your report.
Code quality is part of done. Check the diff against each point, and apply them only to code this session touches.
- Clean: each function has one job and a name that says so. No dead code, commented-out code or stray logs. The old claim sources are deleted, not left beside the new one. No any, non-null ! or as used to silence an error.
- Maintainable: one source for each fact. The claim day lives with the Company's data and is read through one function. The chamber's name lives in chamber.ts. Counts are computed, never typed.
- Scalable: adding a Company changes one data row. Renaming the chamber changes one file. european-members.ts holds data only.
- Limits: do not refactor simulation.ts beyond what these steps need, and do not redesign any screen. List anything worth fixing in your report.
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
- Every company, person and figure stays invented. Do not use a real company's name, and do not use ECCP's logo.
- Never hide a Company's name. Keep the "Example data" tag on every screen.
- Voice: sentence case, no emoji, no exclamation marks.
- Do not edit docs/mockup or CONTEXT.md.
- If something here conflicts with the code or the spec, stop and ask.
```

## Outcome

Built on 2026-11-17 and left uncommitted on `feat/website-redesign-pages`.

**Checks run on the final code:** lint, type check, 211 unit tests, the production build and 180 browser tests all pass. The build and the browser tests ran in a scratch copy with its own server and the placeholder Supabase settings, because a ComLinked dev server was already running on port 3001.

**This ticket and the spec name the wrong third Match.** Before this ticket the three day-one Matches were Maple Bay Grocers, Pacific Pack Solutions and Palengke Online. Northline Logistics was fourth in Day 1's Daily Lead List, not a Match. They are unchanged. The user decided on 2026-11-17 that Nordhavn replaces Palengke Online, and the spec and ticket 02 now say so.

**What changed in Kalayaan's story**

- Northline Logistics has not claimed, so it is no longer suggested as a buyer two weeks in. Bayan Cold Storage takes that place.
- The Ask posted two weeks in reached 3 Companies instead of 4, because Tibay Crates and Pallets has not claimed.
- Sulit Accounting is no longer a lead on its last day, because nothing links its trade to Kalayaan's.
- Each later morning's viewers and searchers differ from before, because only Companies that have claimed can look.

**Rules added that the ticket did not spell out**

- The Daily Lead List and overnight attention draw only on Companies that share Kalayaan's trade: they buy what it offers, sell what it seeks, or sell the same. This is what keeps the 60 out of its leads and interested Companies on every day. Ticket 02 must retag Nordhavn so that it qualifies.
- An Ask reaches only Companies that have claimed.
- An opt-out from AI Lead Agent contact counts only once that Company has claimed.

**Facts for ticket 02**

- Bayan Cold Storage and Kahon Corrugated claim on Day 15. Counts of 42 in the tests are Day 15's and become 40 once the seed moves to Day 14.
- Moving the seed to Day 14 changes which Company posts the overnight Ask and leaves the AI Lead Agent's freight run with nobody to engage until Nordhavn offers freight.
- The existing wins still name Tibay Crates and Pallets, which never claims.

**Left for later**

- The member import still lists 12 Companies beside "100 members". Ticket 04 rebuilds it.
- On a phone the Engine map's initials are too small to read, as they were before. Marks no longer overlap, and each opens its Company.
- The same "buys what it offers, sells what it seeks" check is now written five times in the simulation.
