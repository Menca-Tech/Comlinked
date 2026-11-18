# 02 — The member's story and daily screens

**What to build:** the screens a member Company lives in are brought up to the reference screens. Stop 2's claim and Stop 3's digest, the three day-one Matches arriving one after another, the Interest Signals tab at the compact density with stacked day bars, the Connections and Profile tabs, and Leads, ComMail, Asks and Wins. Each screen gets its one Focus panel and one solid button, and things the viewer triggers respond with a short transition.

**Spec:** `docs/specs/2026-11-18-demo-premium-pass.md`. Sections "Panels and the Focus panel", "Charts" (the large chart), "Interest Signals at the compact density", "Motion" and "Company marks and tags". User stories 12, 22, 28, 33 to 47, 62 and 63.

**Visual source:** the four reference screens built by ticket 01, and `.scratch/demo-premium/specimen.html` for the parts they share.

**Blocked by:** 01 — Shared parts and the four reference screens. The user must have approved the reference screens, and ticket 01 must be committed.

**Status:** built and verified on 2026-11-18, and the user answered its four open points the same day (see "The user's answers" in the Outcome). Ticket 03 has not been started.

- [x] After the claim on Stop 2, the three day-one Matches arrive one after another in about a second, once, and with reduced motion they are simply there
- [x] The claim message, then the action panel of the claim steps, is Stop 2's Focus panel, and the claim steps use the shared two-panel frame and the scale
- [x] The digest leads with the rank line and "Open today's lead list"
- [x] Interest Signals keeps its structure and every interaction, takes the compact density, and shows the Messages tile as its Focus panel
- [x] "Visibility by day" shows one stacked bar per day for search appearances and recommendations, with no toggle, on laptops and phones
- [x] Interest Signals holds to the rules with possible future pricing off and on the Free member view
- [x] Invitations leads the Connections tab and Profile Strength leads the Profile tab
- [x] The selected Company leads Leads and day-one Matches, the open conversation leads ComMail, the box for posting an Ask leads Asks, and the card for sharing a win leads Wins
- [x] Each of these screens has at most one solid button
- [x] The timeline drawer slides in, a tab's underline moves, and a status replaces a button after Connect or Send, each in 150 to 250ms, and none of it runs with reduced motion
- [x] The rule checks cover every screen in this ticket, and before and after screenshots are saved at 390 and 1280 pixels
- [x] Meets the code quality points in its prompt, with the result reported

## Happy paths

- Stop 2 on a laptop: the claim message from ECCP is the raised panel. "Claim your profile" opens the claim steps in two panels, navy and white, and the white action panel leads.
- The claim finishes: the day-one Matches screen opens and the three Matches arrive one after another, about a second in all. The first Match is selected and is the raised panel, with Connect as the one solid button.
- Opening the Matches screen again from the top bar shows the three Matches at once, with no sequence.
- Stop 3: the digest's rank line and "Open today's lead list" lead, and the lists below are flat.
- Interest Signals, with possible future pricing off: six tiles with Messages raised; "Visibility by day" as one stacked bar per day, search appearances in navy and recommendations in light blue, with the grid, the legend, a label every other day and the note; the funnel beside it; then the table and the rail. Table headers are sentence case.
- Hovering a bar segment names the day, the count and the series. The latest day's two values show as text.
- At 390 pixels the chart shows both series with no toggle, and the table is stacked cards.
- A row opens the timeline drawer, which slides in. After Send, the action reads "✓ Messaged".
- Connections tab: Invitations is the raised panel with Accept as the one solid button. After Accept, the row's status changes in place.
- Profile tab: Profile Strength is the raised panel.
- Leads: the list is flat and the selected Company is raised, with one solid button. A not-yet-claimed Company shows a dashed mark and its tag.
- ComMail: the thread list is flat, and the open conversation with its reply box is raised, with Send as the one solid button.
- Asks: the box for posting an Ask is raised. Wins: the card for sharing a win is raised.
- At 390 pixels every one of these screens is one column in today's order, with panels inset by 16px.

## Sad paths

- Reduced motion at the claim: the three Matches are present at once and no transition runs.
- Reduced motion anywhere in this ticket: no transition or animation runs.
- A new Company with no visibility yet: "Visibility by day" shows its calm empty state and no bars.
- A day with nothing shows a short tick. A day with only recommendations shows only the light blue segment.
- The Free member view: hidden rows, the upgrade box, the lock line and the plan line keep to the scale; a hidden row's mark carries no initials; and the tab still has at most one solid button.
- No Hot, Warm or New Companies under a chosen level: the table's one-line empty state shows, as today.
- No Invitations: the Connections tab's calm empty state is still the Focus panel.
- No Lead is left to act on: Leads still shows its finished state without a broken raised panel.
- ComMail with the AI Assistant off: the reply box is empty with its templates, and still leads.
- A message to a not-yet-claimed Company still says it waits until that Company claims.
- A very long company name at 360 pixels wraps inside its row or card, with no sideways scroll.
- Keyboard only: the tiles, the level chips, the table rows, the drawer, the tabs and each screen's main action are reachable in order with a visible focus ring, and Escape still closes the drawer and returns focus to its row.
- Screen readers still get each day's two values as a text list.

## Executer prompt

```
Goal
Bring the member Company's screens in the ComLinked Demo up to the approved reference screens: the claim and day-one Matches with the one staged moment, the digest, the Interest Signals, Connections and Profile tabs, and Leads, ComMail, Asks and Wins. Each gets one Focus panel, one solid button, the scale, and short transitions on what the viewer triggers.

Context
Repo: /Users/rafaeliiiprudente/Documents/coding projects/Comlinked. Branch: feat/website-redesign-pages. Stay on it and create no new branch.
Read first, in this order: CLAUDE.md, AGENTS.md, CONTEXT.md (the sections "Leads", "Talking and closing", "Showing ComLinked" and "Design"), docs/adr/0010-client-side-product-simulation.md, then all of docs/specs/2026-11-18-demo-premium-pass.md. The happy and sad paths are in .scratch/demo-premium/issues/02-member-story-and-daily-screens.md. Then read the "Outcome" section of .scratch/demo-premium/issues/01-shared-parts-and-reference-screens.md for the names of the shared parts, the scale's named values and the rule-check helpers, and find them in the code before you plan.
Look at the result of ticket 01 in the running app: ComDash Overview, the chamber screens, the Opening and the ask. They are your reference for how a finished screen looks. .scratch/demo-premium/specimen.html shows the same parts; where it and the spec disagree, the spec wins.
Who this is for: a company owner on a phone, and ECCP's Chamber Leader exploring after the walk. These are the screens they use every day, so they must hold up as well as the Stops.
How the product runs: everything under /app is a browser-held simulation behind the service seam src/services/comlinked (ADR 0010). Screens are client components that read state with useSimulation and change it through act. A full page load resets the simulation. The top bar and bottom tabs are buttons that call act.nav. Stops open by address: /app/claim?stop=2, /app/digest?stop=3 and /app/dash?stop=4 for the two-weeks-in state.
What ticket 01 left you: the scale as named values; the panel, the Focus panel (marked data-focus-panel), the claim-aware company mark, tags, chips, buttons, count badges, the top bar and the Story Bar; a two-panel frame; a day-bar chart part; and a list of screens the rule checks run on. Reuse these. Do not make a second copy of any of them.
What exists today:
- Stop 2: screens/claim-message.tsx, then screens/claim.tsx (the claim steps in two panels), then screens/matches.tsx, which shows the three day-one Matches through lead-board.tsx. Nothing is staged.
- Stop 3: screens/digest.tsx.
- Interest Signals: comdash/signals-tab.tsx with top-numbers.tsx (six tiles, Messages highlighted by an outline), visibility-chart.tsx (two lines with a fill, and a series toggle on phones), interest-funnel.tsx, interested-companies.tsx, level-filter.tsx, alerts-panel.tsx, found-you-as.tsx, industry-panel.tsx, search-terms.tsx, count-bars.tsx and signal-drawer.tsx. Its sizes were copied from a prototype and are scoped under cd-signals in src/app/app/product.css. The "View as" tier work added plan-switcher.tsx's plan line, agent-action.tsx, hidden rows, an upgrade box and a lock line.
- Connections tab: comdash/connections-tab.tsx with manage-connections.tsx, invitations-panel.tsx, suggestion-panels.tsx and from-connections.tsx. Profile tab: comdash/profile-tab.tsx, which shows screens/company.tsx.
- Leads: screens/leads.tsx with lead-board.tsx. ComMail: screens/commail.tsx and thread.tsx. Asks: screens/asks.tsx. Wins: screens/wins.tsx with success-wall.tsx and monthly-top.tsx. Another Company's profile: screens/company-view.tsx.
- The seam's visibilityByDay() already returns search appearances and recommendations for each day.
Decided by the user, do not change: Interest Signals keeps its structure, panel titles, order, filters, fold, drawer and every interaction, and only its sizes and surfaces change; the large chart becomes stacked day bars with no toggle; the Demo has exactly one staged moment, the Matches arriving after the claim; everything else moves only when the viewer acts; one Focus panel per screen as listed in the spec. No wording changes, and no screen does anything new. What a "View as" tier shows or hides is not yours to change.
Precondition: the user approved the reference screens and ticket 01 is committed. Read ticket 01's Outcome: if it does not record the user's approval, ask the user before starting. Run git status. If anything under src/ or e2e/ is modified, stop and tell the user. Untracked files under .scratch/ are expected.

Scope
Modify:
- src/app/app/product.css.
- src/components/product/screens/claim-message.tsx, claim.tsx, matches.tsx, digest.tsx, leads.tsx, commail.tsx, thread.tsx, asks.tsx, wins.tsx, company.tsx and company-view.tsx, and src/components/product/lead-board.tsx, success-wall.tsx and monthly-top.tsx.
- src/components/product/comdash/signals-tab.tsx, top-numbers.tsx, visibility-chart.tsx, interest-funnel.tsx, interested-companies.tsx, level-filter.tsx, alerts-panel.tsx, found-you-as.tsx, industry-panel.tsx, search-terms.tsx, count-bars.tsx, signal-drawer.tsx, plan-switcher.tsx, agent-action.tsx, interest-action.tsx and gap-actions.tsx, for how they look only.
- src/components/product/comdash/connections-tab.tsx, manage-connections.tsx, invitations-panel.tsx, suggestion-panels.tsx, from-connections.tsx and profile-tab.tsx.
- The day-bar chart part from ticket 01, to take a second stacked series.
- src/components/product/comdash/signals-tab.test.tsx, e2e/product-smoke.spec.ts and e2e/pilot-preview.spec.ts.
Leave untouched: the four reference screens and the shared parts, apart from a fault you must report; the service seam, unless the stacked chart cannot be drawn from what it returns, in which case stop and ask; Search, Notifications, Engine, the AI Lead Agent preview, After the MVP, the Team Dashboard and the Presenter Guide (ticket 03); the website; docs/design-system; /auth, /dashboard, src/middleware.ts, CONTEXT.md and docs/mockup.

Approach
Use test-driven-development: write the Playwright checks for a screen before changing it, and add the screen to the rule-check list first so the checks fail for the right reason. Use systematic-debugging for failures, verification-before-completion before you report, and requesting-code-review once at the end. Project skills: nextjs-app-router, tailwind-v4, testing-unit, testing-e2e, coding-standards, no-ai-design-slop. The spec and the reference screens outrank any skill's taste.
Step 1, Stop 2 and Stop 3. The claim message is a Focus panel. The claim steps use the shared two-panel frame and the scale, with the white action panel leading. On day-one Matches the selected Match is the Focus panel with one solid button. Add the staged moment: when the screen is reached from finishing the claim, the three Matches arrive one after another, about a second in all, once. Reached any other way, they are simply there. Use CSS only, no animation library, and nothing that delays the content for a viewer who does not wait. With reduced motion the finished state shows at once. The digest leads with the rank line and "Open today's lead list".
Step 2, Interest Signals. Replace the prototype's measurements under cd-signals with the compact density and the shared parts, and delete the rules that are no longer needed. Keep every title, order, filter, fold and interaction. The Messages tile becomes the Focus panel in place of its outline. Table headers become sentence case. Tags, chips, marks and buttons are the shared ones. Style the tier elements by the same rules: group headings, the plan line, hidden rows, the upgrade box, the lock line, weekly alerts and "Send my agent". Check both views: possible future pricing off, and the Free member view the full Demo opens on.
Step 3, the large chart. "Visibility by day" uses the day-bar chart part with two stacked series: search appearances in navy, recommendations above in light blue. Keep the axis grid, the legend, a hover label on each segment, a label every other day, the latest day's two values as text, the note built from the data and the text list for screen readers. Remove the series toggle and its styles. Label text renders at its scale size at every width.
Step 4, the Connections and Profile tabs. Invitations is the Focus panel on Connections; when there are none its calm empty state is. Profile Strength is the Focus panel on Profile. One solid button on each.
Step 5, Leads, ComMail, Asks and Wins. Leads: the selected Company is the Focus panel. ComMail: the open conversation with its reply box. Asks: the box for posting an Ask. Wins: the card for sharing a win. Lists are flat with hairline dividers, never a card per row and never a card inside a card. One solid button on each.
Step 6, transitions. Add 150 to 250ms transitions to what the viewer triggers on these screens: the timeline drawer sliding in, a tab's underline moving, a status replacing a button after Connect or Send, a chip being chosen. Nothing animates on load apart from the staged moment. Reduced motion turns all of it off.
Step 7, compare and finish. Save after screenshots of every screen in this ticket at 390 and 1280 pixels into test-results/demo-premium/after/02/, beside the before set ticket 01 saved in test-results/demo-premium/before/. Compare each with its before screenshot and with the reference screens. Then run coding-standards on the diff, then requesting-code-review, then Verification. Add an "Outcome" section to the ticket file: the checks run, the choices you made that the ticket did not spell out, existing tests you changed and why, and anything left for ticket 03.

Acceptance criteria
Playwright covers each happy and sad path in the ticket file, plus:
- the rule checks on every screen in this ticket at 1280 and 390 pixels: sizes on the scale, no capitals, at most one Focus panel, at most one solid button outside the Story Bar, no sideways scroll at 360 and 390
- Interest Signals under the rule checks twice: with possible future pricing off, and on the Free member view
- the live claim ending on three Matches, and with reduced motion the three present with no transition running
- the large chart showing both series for each day with no toggle, on a laptop and a phone, and its text list giving each day's values
- reduced motion: no transition or animation on any screen in this ticket
- keyboard use of each screen's main action, the drawer and the tabs
- axe with no serious or critical violation on every screen in this ticket, with the drawer open and closed
Vitest: the seam is unchanged, so no new seam tests. The component test for the Interest Signals tab is updated where it asserts the old chart or the tile outline.
Every existing unit, component, product, Pilot Preview and website test passes. Tests tied to the two-line chart, its toggle and the tile highlight are updated to the new screens; each change is a deliberate update of an expectation, never a weakened check, and each is listed in your report.
Code quality is part of done. Check the diff against each point, and apply them only to code this session touches.
- Clean: each component has one job and a name that says so. No dead code, commented-out code or stray logs. The prototype's measurements under cd-signals, the series toggle and the tile outline are deleted, not overridden. No any, non-null ! or as used to silence an error. "use client" only on interactive leaves.
- Maintainable: one source for each fact. No style you touch writes a font size, radius or colour as a literal: all come from the scale's named values. Both ComDash charts are drawn by the one day-bar part. The mark, tags, chips, panel and Focus panel are the shared ones. Screens ask the seam for counts and claim status and work nothing out themselves.
- Scalable: giving another screen a Focus panel is one attribute and one line in the rule-check list. A third series on the chart would change the chart part alone.
- Limits: change how these screens look, not what they do. Do not touch what a tier shows or hides. Do not refactor outside Scope; list anything worth fixing in your report.
Report the coding-standards result.

Verification
After each step: pnpm lint && pnpm type:check && pnpm test && pnpm build, plus the browser tests that cover that step's screens.
At the end: pnpm lint && pnpm type:check && pnpm test && pnpm build, then the whole of pnpm test:e2e.
Use NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co and NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder.
Port 3000 on this machine is often used by a different project, and Playwright reuses whatever answers there. Check what is on port 3000 first. If it is not ComLinked, run PLAYWRIGHT_PORT=3111 pnpm test:e2e. A ComLinked dev server the user is running may be on port 3001; never stop a server you did not start. A build clashes with a ComLinked dev server using the same .next folder; if one is running, ask the user to stop it.
The full browser run takes several minutes. Wrap a long run in caffeinate -i so the Mac does not sleep. The homepage ring's contrast check is known to fail now and then under load; rerun it alone before treating it as real.
Report actual output, including anything skipped.

Guardrails
- Commit when green. After a step passes its checks, commit it on feat/website-redesign-pages as Conventional Commits. Never push, merge, open a PR, or switch or create branches.
- Do not commit the screenshots. test-results/ is ignored; keep them there.
- Add no dependencies, icons, hues or dark mode.
- Change no wording and nothing a screen does. Keep "AI drafts, a person decides": nothing is sent until a person presses Send.
- Never widen what a "View as" tier hides, never hide a Company's name anywhere else, and add no upgrade prompt of your own.
- Exactly one staged moment. Add no other entrance animation, count-up or hover effect on panels.
- Status is text, never colour alone.
- Never add unsafe-inline or unsafe-eval to script-src.
- Never publish the specimen or the mockup, and send nothing about this project to an outside service.
- Voice: sentence case, no emoji, no exclamation marks.
- Do not edit docs/mockup, CONTEXT.md, docs/design-system or the website.
- If something here conflicts with the code or the spec, stop and ask.
```

## Outcome

Built on 2026-11-18, in the same session as ticket 01, after the user approved the reference screens and said to go on. Steps 1 to 7 are done and every check passes. Nothing is pushed.

**Commits on `feat/website-redesign-pages`**

- `07efda1`: step 1. Stop 2, the day-one Matches with the staged moment, the digest, and the lead board that Leads shares.
- `eb5016f`: steps 2 to 6. Interest Signals, the large chart, the Connections and Profile tabs, ComMail, Asks, Wins and the transitions. They share one stylesheet, so they went in together.
- `9cf5fce`: the code review's findings.
- `1fbc1f0`: Monthly Top Companies in regular weight, after the user's answer.

**Checks run on the final code**

- Lint and type check pass. 345 unit tests pass (5 database tests are skipped, as before). The production build passes in a scratch copy, because a ComLinked dev server on port 3001 holds the build folder.
- The full browser suite passed 414 of 414 on a fresh server on port 3111, on the code before the last commit. After that commit, which changes one list's weight, it passed 413 of 414 with three workers. The one failure was the homepage's contrast check, which this ticket names as failing now and then under load; it then passed twice alone.
  - Every test of the Demo passed in every full run. Only website tests failed, in files this ticket does not change, and only while the machine was busy (a load average of 18 during back-to-back runs). All of them pass when rerun: 82 of 82, twice each.
  - A dev server I had left running for an hour made six tests time out on navigation. A fresh server cleared them, as in ticket 01.
- The rule checks pass on 24 screens at 1280 and 390 pixels, with no sideways scroll at 360: the six from ticket 01, and Stop 2's message, the three claim steps, the day-one Matches, the digest, Interest Signals (pricing off, with a timeline open, the Free member view and the Growth view), the Connections and Profile tabs, Leads, another Company's profile, ComMail, an open conversation, Asks and Wins.
- Coding standards: no finding left. No `any`, `!` or silencing cast, no logs, and no literal font size, radius or colour in any rule these screens use.
- Code review, on two axes:
  - Standards found one hard breach, a cast in a test, which is fixed. Also acted on: unclear names, a status prop that took every attribute, the turn of each Match listed by hand in the stylesheet, Wins doing two jobs in one component, and test helpers copied between files.
  - Spec found seven things, all acted on or put to the user: the status fade did not run on a phone; Leads' empty state had no Focus panel; a long name at 360 pixels was untested on these screens; the grey mark was a second component; Monthly Top Companies had lost its bold on the chamber screens; the digest had gained a screen-reader label; and the Profile strength meter took 400ms.
- Prettier passes on this file.

**Screenshots**

- After: 26 screens at 390 and 1280 pixels, in `.scratch/demo-premium/shots/after/02/`, mirrored to `test-results/demo-premium/after/02/`. Each has a file of the same name in `shots/before/`. The chamber screen in both Seats is there too, 56 files in all, because Monthly Top Companies changed on it.
- Playwright empties `test-results/` on every run, so the `.scratch` copies are the ones to keep.
- The script that takes them is now kept at `.scratch/demo-premium/shots.mjs`.

**The user's answers**

Asked on 2026-11-18, in the session that built it, after the review fixes were committed.

1. **Accept on an invitation: keep it as it is.** This ticket says "After Accept, the row's status changes in place." Today Accept removes the invitation and adds the Company to Manage connections, and "nothing a screen does changes" forbids changing that. The behaviour stays.
2. **Wins: the testimonial form leads when one is owed.** "Share this win" sits below it, flat, until the testimonial is posted, and leads when nothing is owed. The spec says only "the card for sharing a win".
3. **The Messages tile keeps the tiles' padding.** It is raised, and its figure stays in line with the other five. This is an exception to the spec's "slightly more padding" for a Focus panel.
4. **Monthly Top Companies: regular weight, on Wins and on the chamber screens.** The ten names were bold. The user chose this knowing it changes the side column of the approved chamber screens. It is commit `1fbc1f0`.

**Choices the ticket did not spell out**

These stand unless overturned.

1. **The digest's rank line** is the Focus panel's one serif line: "#7 of 12 in Food Suppliers" at 22 on a phone and 28 on a laptop, with the rank in ink and the rest quieter. It was "#7" at 32 beside a 16px caption. "Who viewed you" and "Also overnight" moved into a flat panel below.
2. **On a phone the selected Lead or Match is the Focus panel in its place in the list.** The rows before and after it sit in their own flat panels, so no card sits inside a card.
3. **The staged moment.** Each Match fades in and rises 8px over 400ms, 300ms after the one before: one second in all. The selected Match's detail arrives with the first. Any tap or key press ends it at once. Whether the screen was reached from the claim is held among the screens (`staged-arrival.ts`), not in the service seam.
4. **"Opening the Matches screen again from the top bar"** cannot be done: the top bar has no way to it. The tests leave by the top bar and come back with the browser's Back, and open the screen at its own address. Neither stages anything.
5. **Finished states** ("That’s your first three", "Your list is done for today", "You did business with …") are the Focus panel's serif line.
6. **Marks on Interest Signals.** Each Company in the table and in the timeline drawer carries its mark. A row a tier hides has a grey mark with no initials. A Company in another chamber, on the Pro view, has a grey mark with its initials, because the service seam cannot say whether it has claimed (see "Left for ticket 03").
7. **The chart's legend reads the latest day**: "Search appearances 1", "Recommendations 0", then "Day 14". Hovering a segment says "Day 5: 1 search appearances".
8. **The monospace face is gone from Interest Signals.** Figures, days and search terms are in the sans face, as the spec says figures are.
9. **"Send my agent" is outlined** on Growth and Pro, so no tier adds a second solid button. On the Free member view the upgrade box's button is the one solid button.
10. **Connections.** Reply and Send in a reply box are outlined and Cancel is quiet, since Accept is the tab's one solid button. With two invitations only the first Accept is solid. Suggested Companies are flat cells on hairlines; they were bordered cards inside a panel.
11. **Profile.** Profile strength is its own raised panel, and Company connections and testimonials sit in a flat panel below it. Its one solid button is whatever is still missing.
12. **ComMail on a phone.** The thread list alone has no Focus panel. The open conversation is the Focus panel.
13. **Wins with no win and nothing owed** raises nothing. The post preview lost its tinted box.
14. **A status that takes a button's place fades in over 250ms**, and only when it did so while the viewer watched. It covers Connect (suggestions, the drawer, another Company's profile), "Send my agent", a reply's "Answered", and a Lead once acted on.
15. **A tab's underline moves** by drawing out from under the tab that is left and in under the one chosen, over 250ms.
16. **The timeline drawer slides in only when the viewer opens it** on a tab already showing. Opened with the tab, by a Hot name on the Overview or by the address, it is simply there.
17. **The blur over a hidden name stays 5px**, as the tier work set it, now as a named value.
18. **New named values**: the gap between arrivals (300ms), and the widths of the reading column (760), the drawer (420), the side column of Asks, Wins and Profile (380) and ComMail's list (360).

**Files touched outside the Modify list**

- `comdash/next-action.tsx`: the class of the Focus panel's serif line is now `a-formal`, since the digest, Leads and Wins use it too. The Overview looks the same.
- `shared.tsx`: the mark gained a `plain` state; `St` can carry the fade's marker; and three small helpers were added (`useInitial`, `replacedMark`, `useReplaced`).
- `two-panel.tsx`: `focus` is now `"side"` or `"main"`. The Opening and the ask still pass `"side"`.
- `day-bars.tsx` and `comdash/visibility-days.tsx`: a day now holds one value for each series.
- `comdash/invitations-panel.tsx`, `connect-action.tsx` and `from-connections.tsx`, which the Modify list names in part.
- New: `staged-arrival.ts`, `comdash/signal-mark.tsx`, `day-bars.test.tsx`, `screens/leads.test.tsx` and `e2e/demo-helpers.ts`.
- `e2e/demo-rules.spec.ts`: the rule-check list.

**Existing tests changed, and why**

None was weakened. Each asserts the new screen, and most assert more.

- `e2e/product-smoke.spec.ts`
  - A new company's Overview: "no rank" is found by its text, since the rank's class is gone.
  - "Two weeks in: Interest Signals fills every panel": the starred tile became the Focus panel holding Messages; the line chart's area, two lines and two end labels became 14 day bars and the legend with the latest day; and a count of seven panels became their seven titles in order, since tiles are panels now.
  - The 360 pixel and phone tests: the series toggle being there became no toggle, with both series on screen.
  - The tier test gained checks: a hidden row's mark has no initials, the upgrade box's button is the solid one, "Send my agent" is outlined, and another chamber's Company has a plain mark.
  - "all caught up" finds the Focus panel through the shared helper.
- `e2e/pilot-preview.spec.ts`: the reference screens' reduced-motion test uses the shared check, which is the same check. `hasVisibleFocus` is now `expectVisibleFocus`, in `demo-helpers.ts`.
- `comdash/signals-tab.test.tsx`: six tiles are found by role and read "0" by text, where a class was counted; and the empty state asserts no figure, where it asserted no chart class.

**Component tests added, and why the browser cannot reach them**

- `day-bars.test.tsx`: a day with recommendations only. The Demo's data holds none.
- `screens/leads.test.tsx`: Leads with no example company left, which takes weeks of mornings to reach.
- A new Company with no visibility at all is covered by the existing `signals-tab.test.tsx`. In the browser a new Company already has two signals on Day 1.

**Left for ticket 03**

- **The service seam.** `hasClaimed` throws for a Company in another chamber, because it is not in the network. The screens avoid asking. A claimed flag on the interest row would let the mark be claim-aware there too.
- **Marks in ComDash's plain rows.** Next action, Manage connections, Invitations, "From your connections" and the suggested Companies list a Company with no mark. Next action is a reference screen, so the shared row was left alone.
- **The Profile tab shows the company name twice**, once in ComDash's header and once in the profile's own head, both as the page title. It did before this ticket.
- **Dead styles.** Still `.a-dash-head`, `.w-dash`, and `.dv2-node.is-open` and `.is-connected`. `.a-panel` is now used only by the AI Lead Agent preview.
- **Literal sizes** remain only in rules for ticket 03's screens: the AI Lead Agent preview, Engine, the Team Dashboard, the Presenter Guide, the toast and the member import.
- **Browser test helpers.** `demo-helpers.ts` now holds the shared ones. `panelTitles`, `expectAccessible` and `noSidewaysScroll` are still repeated in three spec files, and older tests still write the reduced-motion check out in full.
- **Documents.** The design system and the Run of Show are untouched. No click in the Run of Show changed.
