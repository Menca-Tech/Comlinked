# 03 — The remaining screens and the close-out

**What to build:** the pass is finished and closed. The last Demo screens take the scale and the shared parts: Search, Notifications, Engine, the AI Lead Agent preview, After the MVP, the Team Dashboard and the Presenter Guide. The website's two example panels are redrawn to picture the new Demo. The design system document is brought in line with what the app now does. Styles nothing uses are removed, the rule checks run on every Demo screen, and the whole Demo is checked at four widths.

**Spec:** `docs/specs/2026-11-18-demo-premium-pass.md`. Sections "Panels and the Focus panel", "The website's two example panels", "Documents", "Code quality" and "Testing Decisions". User stories 18, 21, 56, 58 to 60, 63, 65 to 67, 69 and 70.

**Visual source:** the screens built by tickets 01 and 02, and `.scratch/demo-premium/specimen.html` for the chamber screen the website's Activity View panel pictures.

**Blocked by:** 02 — The member's story and daily screens, committed.

**Status:** ready-for-agent

- [ ] Search, Notifications, the Team Dashboard and After the MVP use the scale and the shared parts, with no raised panel
- [ ] The Network Ring is the Focus panel on Engine, and the Mandate form is the Focus panel on the AI Lead Agent preview
- [ ] The Presenter Guide uses the scale and the shared parts
- [ ] The website's "Who's interested" panel shows the new marks, tags and figures, and its Activity View panel shows the claimed figure with its split, both still marked as examples
- [ ] Nothing else on the website changes
- [ ] The design system's App Mode section and its token list describe the scale, panels, the Focus panel, marks, charts, the Story Bar, compact controls, phones, motion and the two-panel screens as built
- [ ] The ComDash redesign and Pilot Preview specs each carry a dated note pointing to the premium pass spec
- [ ] No App Mode style writes a font size, radius or colour as a literal outside the scale's definition, and the stylesheet holds no rule that nothing uses
- [ ] The rule checks run on every screen under `/app`, and a screen missing from their list fails a test
- [ ] No Demo screen scrolls sideways at 360, 390, 1280 or 1440 pixels
- [ ] After screenshots of every Demo screen are saved at 390 and 1280 pixels beside the before set
- [ ] Meets the code quality points in its prompt, with the result reported

## Happy paths

- Search: the field leads under the page title, and the results are a flat list with marks, a dashed mark for a Company that has not claimed, and "Your company" on your own row. No panel is raised.
- Notifications: a flat list, with new items marked. No panel is raised.
- Engine: the Network Ring sits in the one raised panel, and the notes beside it are flat.
- AI Lead Agent preview: the "What should your agent find?" form is the raised panel with Start the agent as the one solid button, and "Preview: after the MVP" stays as a tag.
- After the MVP: flat lists under their headings. No panel is raised.
- Team Dashboard: its tabs, figures and target rows use the compact density, with "On track" and "Behind" as tags with their icons. No panel is raised.
- The Presenter Guide, opened with G: its presets and switches use the shared buttons, chips and sizes.
- The website's ComDash page: the "Who's interested" panel shows pale blue marks, the Hot, Warm and New tags and sans figures, and reads as the Demo's Interest Signals in small.
- The website's For Chambers page: the Activity View panel shows "40 of 100" over the split bar with its four counts, in place of five tiles.
- Every Demo screen at 360, 390, 1280 and 1440 pixels: no sideways scroll, and one column with inset panels on phones.
- The design system document opened beside the app: every rule in its App Mode section matches what the screens do.

## Sad paths

- A search with no results shows its calm one-line empty state.
- No notifications: the calm empty state shows, and nothing is raised.
- The later items hidden, as in the Pilot Preview: the addresses of Engine and the AI Lead Agent preview still open ComDash Overview.
- The Team Dashboard on Day 0 or Day 1, with little to show, keeps its layout and says what will appear.
- Reduced motion: no transition or animation on any Demo screen.
- A screen added to `/app` later and left off the rule-check list makes a test fail, naming the screen.
- A very long company name at 360 pixels wraps inside its row on Search and the Team Dashboard.
- Keyboard only: every screen in this ticket is usable in order with a visible focus ring, and G still opens and closes the Presenter Guide.
- The website with the Demo's styles absent: the two panels still render from the website's own stylesheet, with no missing value.
- Colour cannot be told apart: "On track" and "Behind" keep their icon and label, and the website panel's split bar has its counts in text.

## Executer prompt

```
Goal
Finish and close the ComLinked Demo's premium pass: bring the last screens onto the scale and shared parts, redraw the website's two example panels to picture the new Demo, bring the design system document in line, remove styles nothing uses, and prove the rules on every Demo screen at four widths.

Context
Repo: /Users/rafaeliiiprudente/Documents/coding projects/Comlinked. Branch: feat/website-redesign-pages. Stay on it and create no new branch.
Read first, in this order: CLAUDE.md, AGENTS.md, CONTEXT.md (the sections "Showing ComLinked" and "Design"), docs/adr/0010-client-side-product-simulation.md, docs/design-system/README.md (all of it: you will rewrite part of it), then all of docs/specs/2026-11-18-demo-premium-pass.md. The happy and sad paths are in .scratch/demo-premium/issues/03-remaining-screens-and-close-out.md. Then read the "Outcome" sections of .scratch/demo-premium/issues/01-shared-parts-and-reference-screens.md and 02-member-story-and-daily-screens.md for the names of the shared parts, the scale's named values, the rule-check helpers and anything left for this ticket, and find them in the code before you plan.
Look at the finished screens in the running app: ComDash Overview, Interest Signals, Leads and the chamber screens. They are your reference for how a finished screen looks.
Who this is for: ECCP's Chamber Leader exploring after the walk, Richard when he switches on the later items, and the next developer, who must be able to build a new screen from the design system document alone.
How the product runs: everything under /app is a browser-held simulation behind the service seam src/services/comlinked (ADR 0010). Screens are client components that read state with useSimulation and change it through act. A full page load resets the simulation. The top bar and bottom tabs are buttons that call act.nav. The Presenter Guide opens with the G key and holds the switches for the later items (possible future pricing and the previews); with them off, the addresses of the later screens open ComDash Overview. The public website lives in src/app/(marketing) and src/components/marketing, has its own stylesheet and shares no component with the Demo.
What tickets 01 and 02 left you: the scale as named values; the panel, the Focus panel (marked data-focus-panel), the claim-aware company mark, tags, chips, buttons, count badges, the top bar, the Story Bar, the two-panel frame and the day-bar chart; and one list of screens that the rule checks run on. Reuse these. Do not make a second copy of any of them.
What exists today:
- src/components/product/screens/search.tsx, notifications.tsx, engine.tsx (with network-ring.tsx), agent.tsx (the AI Lead Agent preview, about 530 lines), whats-next.tsx (After the MVP) and team.tsx (the Team Dashboard, about 400 lines).
- src/components/product/demo-guide.tsx is the Presenter Guide, styled under cl-guide in src/app/app/product.css.
- src/components/marketing/whos-interested-panel.tsx and activity-view-panel.tsx are the website's two example panels, styled in src/app/marketing-site.css. The Activity View panel still pictures five tiles and a flat list.
- docs/design-system/README.md describes App Mode as it was: every panel raised on a soft shadow, an "Active panel", navy only on the claim steps, panels edge to edge on phones, ComDash Overview as four cards two by two, and a "View as" paragraph saying there is never blur or an upgrade prompt. docs/design-system/tokens.json lists the tokens.
Decided by the user, do not change: the Focus panel per screen as listed in the spec, with none on Search, Notifications, the Team Dashboard and After the MVP; only the two example panels change on the website; no wording changes anywhere in the Demo; no screen does anything new; the design system document describes the tiers as the user decided them on 2026-11-18 (a labelled demo of possible future pricing, off in the Pilot Preview) and does not argue with that decision.
Precondition: ticket 02 is committed. Run git status. If anything under src/ or e2e/ is modified, stop and tell the user. Untracked files under .scratch/ are expected.

Scope
Modify:
- src/app/app/product.css.
- src/components/product/screens/search.tsx, notifications.tsx, engine.tsx, agent.tsx, whats-next.tsx and team.tsx, and src/components/product/network-ring.tsx and demo-guide.tsx, for how they look only.
- src/components/marketing/whos-interested-panel.tsx and activity-view-panel.tsx, and src/app/marketing-site.css for those two panels only.
- docs/design-system/README.md and docs/design-system/tokens.json.
- docs/specs/2026-11-11-comdash-redesign.md and docs/specs/2026-11-17-pilot-preview.md: one dated note at the top of each, and nothing else.
- docs/presentations/2026-11-17-pilot-preview-run-of-show.md, only where a click or what is on screen has changed.
- e2e/product-smoke.spec.ts, e2e/pilot-preview.spec.ts and e2e/website-redesign.spec.ts.
Leave untouched: the screens finished by tickets 01 and 02, apart from removing styles they no longer use and fixing a rule a check now catches; the service seam; every other part of the website and Site Mode's rules; the build plan, the SRS and the status document; docs/design-system/site-tokens.css; /auth, /dashboard, src/middleware.ts, CONTEXT.md and docs/mockup; the specimen, which stays where it is, untracked.

Approach
Use test-driven-development: add each screen to the rule-check list before changing it, so the checks fail for the right reason. Use systematic-debugging for failures, verification-before-completion before you report, and requesting-code-review once at the end. Project skills: nextjs-app-router, tailwind-v4, testing-e2e, coding-standards, no-ai-design-slop. The spec and the finished screens outrank any skill's taste.
Step 1, the remaining screens. Search and Notifications: flat lists under the page title, the shared mark and tags, no raised panel. Engine: the Network Ring in the one Focus panel. The AI Lead Agent preview: the Mandate form as the Focus panel with one solid button. After the MVP: flat lists, no raised panel. The Team Dashboard: the compact density, shared tags and chips, no raised panel. Remove capitals wherever they remain. Keep each screen's content, order and behaviour.
Step 2, the Presenter Guide. Move its styles onto the scale and the shared buttons and chips. Its presets, switches and the G key work as they do today.
Step 3, the website's two example panels. Redraw them to picture the new Demo. "Who's interested": the claim-aware marks, the Hot, Warm and New tags and sans figures. The Activity View panel: the claimed figure over the split bar with its four counts, in place of the five tiles. Each stays marked as an example, and the bar's counts are in text. The two panels take their sizes, radii and colours from the same named values the Demo uses; do not copy numbers into the website's stylesheet. If the scale's definition must be reachable from the website for that, widen where it is defined, not what it contains. Touch nothing else on the website.
Step 4, the rule checks on every screen. Add every remaining screen under /app to the rule-check list, in each state that changes its layout. Then add one test that compares the list with the product addresses in src/paths.ts and fails, naming the screen, if one is missing. Run the rule checks at 1280 and 390 pixels and the sideways-scroll check at 360, 390, 1280 and 1440 on every screen.
Step 5, remove what nothing uses. Delete App Mode styles that no element uses any more, and replace any font size, radius or colour still written as a literal outside the scale's definition with its named value. Count the distinct font sizes and radii in the App Mode stylesheet before and after and report both. The pass started at 16 sizes and 8 radii; it ends at the scale.
Step 6, the documents. Rewrite the design system's App Mode section to match the app: the type table, panels and the Focus panel (the name "Active panel" goes), the claim-aware mark, the two charts, the Story Bar, standard and compact controls, panels inset on phones, the one staged moment, the two-panel form on the claim steps, the Opening and the ask, ComDash Overview's wide and stacked cards, and the "View as" paragraph as the tiers now are. Add the scale and the quieter grey to the token list. Put one dated note at the top of the ComDash redesign and Pilot Preview specs saying that how screens look is now set by docs/specs/2026-11-18-demo-premium-pass.md; do not rewrite their text. Walk the Run of Show against the app and change it only where a click or what is on screen differs.
Step 7, compare and finish. Save after screenshots of every Demo screen at 390 and 1280 pixels into test-results/demo-premium/after/03/, beside the before set in test-results/demo-premium/before/. Look at every pair. Then run coding-standards on the diff, then requesting-code-review, then Verification. Add an "Outcome" section to the ticket file: the checks run, the before and after counts of sizes and radii, the choices you made that the ticket did not spell out, existing tests you changed and why, where the screenshots are, and anything left for later.

Acceptance criteria
Playwright covers each happy and sad path in the ticket file, plus:
- the rule checks on every screen under /app at 1280 and 390 pixels: sizes on the scale, no capitals, at most one Focus panel, at most one solid button outside the Story Bar
- no sideways scroll on any Demo screen at 360, 390, 1280 and 1440 pixels
- the test that fails when a screen under /app is missing from the rule-check list
- reduced motion: no transition or animation on any Demo screen
- axe with no serious or critical violation on every screen in this ticket and on the website's ComDash and For Chambers pages
- the website's two panels showing the new marks and the claimed figure with its split, still carrying their example mark, and the rest of both pages unchanged
- the Presenter Guide opening with G, its presets and both switches
- the Run of Show's walk, end to end
Vitest: the seam is unchanged, so no new seam tests.
Every existing unit, component, product, Pilot Preview and website test passes. Tests tied to the old example panels are updated to the new ones; each change is a deliberate update of an expectation, never a weakened check, and each is listed in your report.
Documents: pnpm exec prettier --check passes on every document you changed, and every link in them resolves.
Code quality is part of done. Check the diff against each point, and apply them only to code this session touches.
- Clean: each component has one job and a name that says so. No dead code, commented-out code or stray logs. Every App Mode style that nothing uses is deleted. No any, non-null ! or as used to silence an error. "use client" only on interactive leaves.
- Maintainable: one source for each fact. A search of the App Mode styles finds no font size, radius or colour written as a literal outside the scale's definition. The website's two panels read the same named values as the Demo. The mark, tags, chips, panel and Focus panel are the shared ones on every screen. The design system document states each rule once and matches the code.
- Scalable: a new screen under /app cannot skip the rule checks. Changing a step of the scale changes one value and every screen follows.
- Limits: change how these screens look, not what they do. agent.tsx and team.tsx are long; restyle them, and split one only if this work rebuilds it. Do not refactor outside Scope; list anything worth fixing in your report.
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
- Do not commit the screenshots or the specimen. test-results/ is ignored; keep the screenshots there.
- Add no dependencies, icons, hues or dark mode.
- Change no wording in the Demo and nothing a screen does. On the website, change only the two example panels.
- Never widen what a "View as" tier hides, never hide a Company's name anywhere else, and add no upgrade prompt of your own.
- Status is text, never colour alone. Keep the "Example data" tag on every Demo screen and the example mark on both website panels.
- Do not edit existing ADRs, the build plan, the SRS or the body of the two older specs.
- Never add unsafe-inline or unsafe-eval to script-src.
- Never publish the specimen or the mockup, and send nothing about this project to an outside service.
- Voice: sentence case, no emoji, no exclamation marks.
- Do not edit docs/mockup or CONTEXT.md.
- If something here conflicts with the code or the spec, stop and ask.
```
