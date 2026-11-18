# 01 — Session 1: ComDash shell, Overview and Next action

**What to build:** ComDash takes the prototype's frame: a company header, five tabs with their own addresses, and a full Overview. The Overview shows top numbers, the visibility chart, the funnel, interested Companies with their Interest Level, alerts, "Found you as a…", interest by industry, and search terms with profile gaps. Next action follows the new 8-step order. Everything is drawn from the simulation, and a new Company sees calm empty states. The AI Lead Agent and Profile tabs reuse the existing preview and editor. The Network Ring, rank and score card, and Recent wins leave ComDash.

**Replaces:** proposed tickets 1 to 4 (shell, numbers and funnel, insights and gaps, Next action).

**Blocked by:** None — can start immediately (website redesign session 2 should be finished first, because both work on the same branch)

**Status:** ready-for-agent

- [ ] Five tabs, each with its own address, and reload keeps the tab
- [ ] Overview shows every prototype panel, filled from the simulation
- [ ] Interest Level follows the glossary rule exactly
- [ ] A new Company sees empty states, never invented history
- [ ] Profile gaps resolve through "Add to profile" or "We don't offer this"
- [ ] Next action follows the 8-step order with "Shown because…"
- [ ] The Ring, rank and score card, and Recent wins are gone from ComDash
- [ ] The phone layout works at 360 and 390 with nothing hidden
- [ ] Meets the code quality points in its prompt, with the result reported

## Happy paths

- A presenter claims Kalayaan Foods: Overview opens with empty states and today's leads as Next action.
- "Two weeks in": every Overview panel fills.
- A message sent from Leads updates the Company's Interest Level and the funnel.
- "Add to profile" on a gap opens the Profile tab at the right field; after saving, the gap clears.
- Reloading a tab's address reopens that tab with the simulation intact.
- Clearing every task shows "You're all caught up".

## Sad paths

- No signals yet: calm empty states, no chart line, no false decline.
- One day of history: comparisons are hidden, not shown as +100%.
- Fewer than three Companies in an industry: that group isn't shown.
- Ten searches from one Company in one day: it stays New.
- AI off or the AI limit is spent: drafts become an empty reply box, and flows still work.
- An unknown tab address: Overview opens.
- A deep link before claiming: the claim auto-completes, then the tab opens.
- A long Company name on a phone wraps; no sideways scrolling at 360.
- Keyboard only: every tab and action is reachable with visible focus. Reduced motion: no transitions.

## Executer prompt

```
Goal
Replace the Next.js ComDash with the prototype's structure: header, five tabs with their own addresses, a complete Overview filled from the existing simulation, and Next action in the new order.

Context
Repo: /Users/rafaeliiiprudente/Documents/coding projects/Comlinked. Branch: feat/website-redesign-pages. Stay on it and create no new branch.
Read first: CLAUDE.md, AGENTS.md, CONTEXT.md (especially Interest Signal, Interest Level and ComDash), docs/adr/0010-client-side-product-simulation.md, and the spec docs/specs/2026-11-11-comdash-redesign.md, which is your detailed brief.
Visual reference: /Users/rafaeliiiprudente/Downloads/comdash-prototype.html. It lives outside the repo. Read it, never copy it in, and never use its figures or its NorthPack data.
The product is a browser-held simulation behind the ComLinked service seam, src/services/comlinked: index.ts re-exports simulation.ts, data.ts and types.ts. It holds a module-global state with simulated days and the demo states "New company" and "Two weeks in" (seedTwoWeeks). A full page load resets it, so moves between /app routes must use next/link or router.push. Signals are { co, type, detail, day }, with types search (detail holds the search term), viewed, messaged, recommended and intro.
Decided by the user, do not change: copy the prototype's layout and wording exactly; outside the AI Lead Agent tab, count only MVP signals, never agent activity; fill everything from the simulation, with no invented history; the Network Ring, rank and Activity Score card and Recent wins leave ComDash; AI Lead Agent tab = the existing agent preview; Profile tab = the existing company profile editor. The plan switcher, Interest Signals tab and Connections tab are session 2: in this session show the tab links, but those two tabs render a short "Coming in the next update" panel, and leave the switcher out.
Precondition: run git status. Expected uncommitted: CONTEXT.md, docs/specs/2026-11-11-comdash-redesign.md, possibly docs/specs/2026-11-08-mvp-feature-status.md, and untracked .scratch/. If anything under src/ or e2e/ is modified, another session may be working here: stop and tell the user.

Scope
Modify: src/services/comlinked/simulation.ts, types.ts, data.ts, simulation.test.ts; src/components/product/screens/comdash.tsx; src/components/product/screens/company.tsx (only to accept a field to focus); src/app/app/dash/page.tsx; src/app/app/product.css; e2e/product-smoke.spec.ts.
Create: route segments under src/app/app/dash/ for signals, agent, connections and profile, plus a shared layout for the header and tab row; components under src/components/product/comdash/ for each Overview panel.
Leave untouched: the Network Ring component file (now unused, keep it), src/components/product/screens/agent.tsx apart from being rendered, the existing /app/agent and /app/company routes (keep them working), the website, /auth, /dashboard, src/middleware.ts, docs/mockup.

Approach
Use test-driven-development: write the Vitest cases at the service seam first, then the Playwright checks. Use systematic-debugging for failures, verification-before-completion before done, and requesting-code-review once at the end. Project skills: nextjs-app-router, tailwind-v4, testing-unit, testing-e2e, coding-standards, no-ai-design-slop.
Step 1, shell. One ComDash layout with the header (company name, industry, city, chamber) and the tab row (Overview, Interest Signals, AI Lead Agent, Connections, Profile), with tabs as links using client-side navigation. Overview is /app/dash itself, and an unknown segment shows Overview. Render the existing agent preview and profile editor in their tabs. Remove the Ring, rank and score card, Recent wins, How to climb and Profile strength from ComDash.
Step 2, data at the seam. Add a "saved" signal kind, and add saves and varied search terms to the Two weeks in preset and the daily simulation so that every panel has honest data by day 14. Add pure, exported functions for: interested Companies with Interest Level and a one-line summary; top numbers (search appearances, profile views, saves, messages, recommendations, Connections) with a comparison only when a previous period exists; visibility by day since claim; funnel counts (found, viewed, saved, messaged, connected); alerts (became Hot, saved, messaged, community manager intro); searcher roles; industry groups of 3 or more; search terms with profile-gap flags, plus add and dismiss actions.
Interest Level: over the last 14 simulated days, Hot if the Company messaged or showed interest on 3 or more separate days; Warm if 2 separate days or it saved the profile; New after one signal. Same-day repeats count once.
Step 3, Overview panels in the prototype's order and wording: top numbers, Visibility chart, Interest funnel with one suggestion line, interested Companies table (Hot, then Warm, then New, with one action), Alerts, Found you as a…, Who's interested by industry, Search terms that found you (gaps: "Add to profile" opens the Profile tab focused on the right field; "We don't offer this" dismisses), Next action, and summary cards linking to tabs, including a Profile card with completeness. Each panel has a calm empty state for a new Company. The chart and funnel are inline SVG or HTML with a text alternative, and need no chart library.
Step 4, Next action. Replace the current nextAction logic with this order: AI drafts to approve; today's leads if unfinished; a Connection's Ask matching what the Company sells; a Hot Company that hasn't heard from it; connection requests; profile gaps; the freshness nudge when the profile hasn't changed in 14 simulated days; "You're all caught up". Each carries a "Shown because…" sentence. Update every caller of the old logic.
Step 5, phone. Next action moves to the top; tabs scroll sideways in one row; top numbers form a 2×3 grid; the table becomes stacked cards; the chart shows one series with a toggle; the funnel stacks vertically. Nothing is hidden.
Step 6, review: coding-standards on the diff, then requesting-code-review, then Verification.

Acceptance criteria
Vitest at the service seam covers: Interest Level boundaries (one signal, two days, three days, same-day repeats, a save, a message, outside 14 days); funnel counts; hidden comparisons with no previous period; the industry threshold of 3; gap add and dismiss; every Next action rule in order with its reason; a new Company's empty results; and the existing determinism check still passes.
Playwright covers: claim, then Overview with empty states; Two weeks in fills every panel; each tab's address and reload; an unknown tab shows Overview; a message from Leads changes ComDash; Add to profile from a gap; AI off still works; keyboard tab navigation; reduced motion; no sideways scroll at 360, 390, 1280 and 1440; axe has no serious or critical violations on Overview, AI Lead Agent and Profile. The existing product smoke and auth smoke tests still pass, updated where they relied on the old ComDash.
Every happy and sad path in the spec that belongs to this session has a passing check or a recorded manual result in your final report.
Code quality is part of done. Check the diff against each point before reporting, and apply them only to code this session touches.
Clean: each component and function has one job and a name that says so. No dead code, commented-out code, unused CSS, stray TODOs or console logs. No any, non-null ! or as used to silence an error. "use client" only on the smallest interactive leaf.
Maintainable: one source for each fact. Screens read derived data only through the service seam and never compute it themselves. Links come from src/paths.ts (add the tab paths there), colours from App Mode tokens, and Interest Level and Next action rules each live in one function.
Scalable: adding an Overview panel, signal kind or Next action rule changes one place. comdash.tsx only composes panels, and each panel is its own file. Add no chart or UI dependency.
Limits: extract shared code only for a use that exists now or is named in this prompt. Do not refactor outside Scope; list anything worth fixing in your final report.
Report the coding-standards result and anything you duplicated on purpose.

Verification
After each step: pnpm lint && pnpm type:check && pnpm test.
At the end: pnpm lint && pnpm type:check && pnpm test && pnpm build, then pnpm test:e2e, using NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co and NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder. A build clashes with a dev server using the same .next folder, and Playwright reuses any server on port 3000; if one is running, ask the user to stop it rather than killing it. Report actual output, including anything skipped.

Guardrails
Do not commit. Do not run git add, git commit or /ship unless the user asks in this session. Leave all work uncommitted on feat/website-redesign-pages, and do not switch or create branches. End your final report with the changed files grouped by step, each group with a suggested Conventional Commit message. Do not push, merge or open a PR. Add no dependencies. Keep "AI drafts, a person decides": nothing sends without the person tapping Send, and every flow works with AI off. Never hide a Company name. Voice: sentence case, no emoji, no exclamation marks. Do not edit docs/mockup. If something here conflicts with the code, stop and ask.
```
