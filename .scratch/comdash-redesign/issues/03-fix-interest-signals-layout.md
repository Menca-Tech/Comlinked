# 03 — Fix: Interest Signals tab follows the prototype's layout

**What to build:** the Interest Signals tab takes the prototype's layout: six top numbers, the Visibility chart and Interest funnel, the interested Companies table with All / Hot / Warm / New filters, and a rail with Alerts, Found you as a…, Who's interested by industry and Search terms that found you. Opening a Company shows its dated timeline in a side drawer. The Overview shrinks to the prototype's version: Next action, then four summary cards (Interest Signals, AI Lead Agent, Connections, Profile).

**Why:** sessions 1 and 2 put the analytics panels on the Overview and gave Interest Signals a card list. The prototype (`~/Downloads/comdash-prototype.html`) does the opposite. The user reported this on 2026-11-11.

**Blocked by:** 01 and 02, both committed (done: 27503e8)

**Status:** done by an executer on 2026-11-11, uncommitted. Its prototype fidelity is superseded by 04, which builds on this work.

- [ ] Interest Signals shows the prototype's panels in the prototype's order
- [ ] Level filters show counts, and an empty filter says so
- [ ] A row opens a timeline drawer that works by keyboard and closes with Escape
- [ ] Overview shows only Next action and the four summary cards
- [ ] "See signals" on a Hot Next action opens that Company's drawer
- [ ] The MVP adaptations still hold: Free hides nothing, New instead of Cool, MVP signals only
- [ ] Meets the code quality points in its prompt, with the result reported

## Happy paths

- "Two weeks in": Interest Signals fills every panel; Overview shows Next action and four cards.
- Choosing Hot shows only Hot Companies; All brings everyone back.
- Clicking a row, or pressing Enter on it, opens its drawer with the timeline, Message and Connect.
- On Growth or Pro, the drawer shows points for each entry and the intent score total.
- The Hot Companies list on the Overview card opens that Company's drawer on the Interest Signals tab.
- "See signals" on a Hot Next action does the same.

## Sad paths

- New company: every Interest Signals panel shows its calm empty state; the Overview card shows zeros and "No Hot companies yet".
- A filter with no Companies: "No companies at this Interest Level."
- Free view: every name, level and signal shows; no blur, no upgrade prompt, no points.
- An unknown or stale `company` in the address: the tab opens with no drawer.
- Escape or Close shuts the drawer and returns focus to the row.
- 360 px phone: the table becomes stacked cards, the drawer fills the width, no sideways scroll.
- A full page load resets the simulation, the filter and the drawer.

## Executer prompt

```
Goal
Make the ComDash Interest Signals tab and Overview match the layout of the prototype at /Users/rafaeliiiprudente/Downloads/comdash-prototype.html. The analytics panels move from the Overview to Interest Signals. The Overview keeps only Next action and four summary cards.

Context
Repo: /Users/rafaeliiiprudente/Documents/coding projects/Comlinked. Branch: feat/website-redesign-pages. Stay on it and create no new branch.
Read first: CLAUDE.md, AGENTS.md, CONTEXT.md (Interest Signal, Interest Level, ComDash), docs/adr/0010-client-side-product-simulation.md, and docs/specs/2026-11-11-comdash-redesign.md. Where the spec places panels on the Overview, this prompt replaces it.
In the prototype, read the markup for #pSignals and #pOverview, the "Interest Signals" and "Overview" CSS blocks, and the functions renderBands, renderRows, openDrawer and the "Interest Signals card" render. Read it, never copy it in, and never use its figures or NorthPack data.
The ComDash already exists: the layout and tab routes are under src/app/app/dash/, the panels are in src/components/product/comdash/, and the derived data is at the service seam, src/services/comlinked. The Overview (src/components/product/screens/comdash.tsx) currently composes TopNumbers, VisibilityChart, InterestFunnel, InterestedCompanies, AlertsPanel, FoundYouAs, IndustryPanel, SearchTermsPanel, NextActionPanel and SummaryCards. signals-tab.tsx renders a card list with a details timeline. This is the bug.
Decided by the user, do not change: the prototype's layout, adapted for the MVP. Free opens by default and hides nothing: no blur, no "See who", no upsell, no lock lines. Interest Levels are Hot, Warm and New, never Cool. Outside the AI Lead Agent tab, count only MVP signals: no agent metrics and no "Lead Agent launch" marker or story. Growth adds the intent score. Pro adds interest from other chambers, labelled with the chamber. A full page load resets the simulation, so move between /app routes only with next/link or router.push.
Precondition: run git status. If anything under src/ or e2e/ is modified, stop and tell the user. Untracked .scratch/ is expected.

Scope
Modify: src/components/product/comdash/signals-tab.tsx, interested-companies.tsx, summary-cards.tsx, next-action.tsx; src/components/product/screens/comdash.tsx; src/app/app/dash/signals/page.tsx; src/services/comlinked/simulation.ts, types.ts and simulation.test.ts, only if the drawer or filters need a seam function; src/paths.ts; src/app/app/product.css; e2e/product-smoke.spec.ts, plus any e2e/website-redesign.spec.ts check that expects the interested-companies heading on the Overview; docs/specs/2026-11-11-comdash-redesign.md (the Overview and Interest Signals sections); docs/design-system/README.md (App Mode: ComDash).
Create: src/components/product/comdash/level-filter.tsx and signal-drawer.tsx, plus a small sparkline component if summary-cards.tsx would pass about 150 lines.
Leave untouched: the Connections, AI Lead Agent and Profile tabs, the plan switcher, the Interest Level and intent score rules, the Next action order, the website, /auth, /dashboard, src/middleware.ts, and docs/mockup.

Approach
Use test-driven-development: write the Playwright checks first, and Vitest cases for any new seam function. Then use systematic-debugging for failures, verification-before-completion before done, and requesting-code-review once at the end. Project skills: nextjs-app-router, tailwind-v4, testing-unit, testing-e2e, coding-standards, no-ai-design-slop.
Step 1, Interest Signals tab, in the prototype's order. First, the top numbers row, reusing TopNumbers. Next, a two-column row with the Visibility chart and the Interest funnel. Then a wide column with the interested Companies table beside a rail holding Alerts, Found you as a…, Who's interested by industry, and Search terms that found you. Reuse the existing panels, and move them rather than duplicating them.
Step 2, level filter. Above the table, add a group of toggle buttons (aria-pressed): All, Hot, Warm and New, each with its count. Hold the selection in component state. When a level has no Companies, show "No companies at this Interest Level."
Step 3, timeline drawer. A row is clickable and focusable, and Enter opens it. The drawer is a side panel (role="dialog", labelled by the Company name) and shows: the Interest Level tag, name, industry and city, the chamber for another chamber's Company, the dated timeline, the line "You see the company, not the person.", and the Message and Connect actions. On Growth and Pro, also show each entry's intent points and the total under "How the intent score was built". On Free, show no points. Close and Escape shut it and return focus to the row that opened it, and focus moves to Close on open. Put the open Company in the address as ?company=<id>, using router.push or replace, so it survives tab changes. An unknown id opens no drawer. Add a builder for this address to src/paths.ts.
Step 4, Overview. Compose only NextActionPanel, then four cards in a 2×2 grid, one column on a phone.
- Interest Signals card: three stats (interested Companies with Hot count, profile saves, search appearances), a small sparkline of visibility by day with a text alternative, and a "Hot companies" list. Each name opens its drawer on the Interest Signals tab. With none, show "No Hot companies yet".
- AI Lead Agent card: labelled "Preview: after the MVP", one line describing the preview, and a link to the tab. No agent numbers.
- Connections and Profile cards: keep the current ones.
Step 5, Next action. The Hot Company step gets a "See signals" link to that Company's drawer, next to its existing action.
Step 6, delete what this replaces: the card list and details timeline in signals-tab.tsx, and any CSS only they used. Update the spec and design system text to describe the new placement. Then run coding-standards on the diff, then requesting-code-review, then Verification.

Acceptance criteria
Playwright covers each item below:
- Two weeks in: Interest Signals shows all eight panels, and the Overview shows Next action and exactly four cards.
- New company: empty states on both tabs.
- Each level filter, its counts, and the empty-filter message.
- The drawer opens by click and by Enter, Escape returns focus to the row, and ?company= survives a tab change and back.
- An unknown company id opens no drawer.
- Free shows no points; Pro shows points and other-chamber rows.
- "See signals" and the Overview card's Hot names open the right drawer.
- No sideways scroll at 360, 390, 1280 and 1440 on both tabs, with the drawer open and closed.
- axe finds no serious or critical violations on both tabs and with the drawer open.
- Reduced motion turns off transitions.
Vitest covers any new seam function, and the existing determinism check still passes. Every existing product and auth smoke test passes, updated only where it relied on the old placement.
Code quality is part of done. Check the diff against each point below before reporting, and apply them only to code this session touches.
- Clean: each component has one job and a name that says so. Leave no dead code, commented-out code, unused CSS, stray TODOs or console logs. Do not use any, non-null ! or as to silence an error. Put "use client" only on the smallest interactive leaf.
- Maintainable: keep one source for each fact. Screens read derived data only through the service seam. Panels are moved, not copied. Plan-view rules stay in their existing single function. Links come from src/paths.ts, and colours come from App Mode tokens.
- Scalable: adding a filter level or a drawer field changes one place. Add no dependency.
- Limits: extract shared code only for a use that exists now. Do not refactor outside Scope; list anything worth fixing in your final report.
Report the coding-standards result and anything you duplicated on purpose.

Verification
After each step: pnpm lint && pnpm type:check && pnpm test.
At the end, run pnpm lint && pnpm type:check && pnpm test && pnpm build, then pnpm test:e2e. Use NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co and NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder. A build clashes with a dev server that uses the same .next folder, and Playwright reuses any server on port 3000. If one is running, ask the user to stop it rather than killing it. Report the actual output, including anything skipped.

Guardrails
- Do not commit. Do not run git add, git commit or /ship unless the user asks in this session.
- Leave all work uncommitted on feat/website-redesign-pages, and do not switch or create branches.
- End your final report with the changed files grouped by step, each group with a suggested Conventional Commit message.
- Do not push, merge or open a PR. Add no dependencies.
- Never hide a Company name and never add upgrade prompts.
- Keep "AI drafts, a person decides".
- Voice: sentence case, no emoji, no exclamation marks.
- Do not edit docs/mockup.
- If something here conflicts with the code, stop and ask.
```
