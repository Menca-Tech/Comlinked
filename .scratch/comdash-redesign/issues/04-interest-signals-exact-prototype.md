# 04 — Interest Signals copies the prototype page exactly, with MVP data

**What to build:** the Interest Signals tab matches the prototype's Interest Signals page piece by piece: the same sizes, spacing, grid, panel titles and interactions, using App Mode colours and fonts. Where the prototype names something outside the MVP, its MVP equivalent takes the same spot:

- six tiles, with Messages highlighted
- the visibility chart by day
- a funnel of companies
- the interested companies table, with level chips, a status-or-Message action, and a fold for light activity
- the four rail panels, with gap links
- a timeline drawer that adds up to the intent score on Growth and Pro

The Overview's Interest Signals card uses the new stats.

**Replaces:** the prototype-fidelity part of 03. 03's structure (panels moved, drawer, filter, Overview cut down) is kept and refined.

**Blocked by:** 03's work, reviewed and committed by the user

**Status:** ready-for-agent

- [ ] Each tile, chart, funnel, table, rail and drawer detail matches the spec's "Interest Signals detail"
- [ ] Sizes, spacing, radii, grid, borders, weights and tabular figures match the prototype, in App Mode colours and fonts
- [ ] Free hides nothing and shows no points; Growth and Pro add only the score and other chambers
- [ ] Meets the code quality points in its prompt, with the result reported

## Happy paths

- "Two weeks in": six tiles appear in the right order, Messages is highlighted, and the change lines show.
- The chart shows two lines with an area fill, end values and an honest note.
- The funnel steps show "x% of previous" and one suggestion line.
- Choosing Warm in the chips leaves only Warm rows, with the counts matching.
- "+ N more New companies with light activity" reveals the search-only Companies.
- On a gap in search terms, "Add to profile" opens the Profile field. After saving, the term shows "Added to your profile."
- On Pro, the drawer rows show points that add up to "N points, capped at 100." and other-chamber rows appear in the table.
- A message sent from the drawer turns the row's action into "✓ Messaged".

## Sad paths

- New company: no tile change lines, no chart line, an empty funnel, an empty table and an empty rail, all with calm empty states.
- One day of history: change lines hidden, and the chart note mentions only the claim day.
- A funnel step of 0: no percentage shown.
- A chip with no Companies: "No companies at this Interest Level."
- Free: the drawer is headed "Signal timeline", with no points, no score, no blur and no upsell.
- "We don't offer this" removes the gap line and keeps the term.
- 360 px: tiles in 2×3, the table as stacked cards, a full-width drawer, the chart on a toggle, and no sideways scroll.
- Keyboard: chips, rows, the fold button, gap links and the drawer are all reachable, with visible focus. Escape returns focus to the row.

## Executer prompt

```
Goal
Make the ComDash Interest Signals tab copy the prototype's Interest Signals page exactly in layout, sizes, panel titles and interactions, filled with MVP data from the simulation and drawn in App Mode colours and fonts.

Context
Repo: /Users/rafaeliiiprudente/Documents/coding projects/Comlinked. Branch: feat/website-redesign-pages. Stay on it and create no new branch.
Read first: CLAUDE.md, AGENTS.md, CONTEXT.md (Interest Signal, Interest Level), docs/adr/0010-client-side-product-simulation.md, and docs/specs/2026-11-11-comdash-redesign.md. The spec's Implementation Decisions bullets "Visual design" and "Interest Signals detail (decided 2026-11-12)" are your exact brief, and they override anything older in the spec.
Prototype: /Users/rafaeliiiprudente/Downloads/comdash-prototype.html, outside the repo. Read the #pSignals markup, the CSS blocks "Interest Signals" and the drawer and .tl rules, and the functions renderBands, renderRows, renderFeed, renderTerms, openDrawer and the chart and funnel script. Copy its measurements: px sizes, gaps, radii, grid columns and breakpoints (1100, 760, 480), border widths, font weights, letter-spacing and tabular numbers. Never copy its colours, fonts, figures, NorthPack data, blur, upsells or agent wording.
Ticket 03 already built the structure. src/components/product/comdash/signals-tab.tsx composes TopNumbers, VisibilityChart, InterestFunnel, InterestedCompanies, AlertsPanel, FoundYouAs, IndustryPanel, SearchTermsPanel and SignalDrawer. level-filter.tsx, signal-drawer.tsx and sparkline.tsx exist. The Overview is NextActionPanel plus SummaryCards. Derived data lives at the service seam, src/services/comlinked: topNumbers, visibilityByDay, interestFunnel, interestForView and the rest. Refine this work; do not rebuild it.
Decided by the user, do not change: Free is the default and hides nothing. Interest Levels are Hot, Warm and New. Outside the AI Lead Agent tab, only MVP signals count, with no agent metrics or launch story. The intent score shows only on Growth and Pro, with the existing points (search 1, recommended 2, view 3, save 5, message 10, one per kind per day, capped at 100) and no decay. Use next/link or router.push between /app routes, because a full page load resets the simulation.
Precondition: the user has committed ticket 03. Run git status. If anything under src/, e2e/ or docs/ is modified, stop and tell the user. Untracked .scratch/ is expected.

Scope
Modify:
- src/services/comlinked/simulation.ts, types.ts and simulation.test.ts: tiles, funnel percentages, suggestion rule, grouped timeline rows, light-activity split and chart note.
- In src/components/product/comdash/: top-numbers.tsx, visibility-chart.tsx, interest-funnel.tsx, interested-companies.tsx, level-filter.tsx, alerts-panel.tsx, found-you-as.tsx, industry-panel.tsx, search-terms.tsx, gap-actions.tsx, signal-drawer.tsx, summary-cards.tsx, sparkline.tsx and dash-panel.tsx.
- src/app/app/product.css and e2e/product-smoke.spec.ts.
- e2e/website-redesign.spec.ts, only where it asserts old tile labels.
Create: a small component under src/components/product/comdash/ only if a file would pass about 150 lines, such as the table's status-or-Message action cell.
Leave untouched: the Next action order, the Connections, AI Lead Agent and Profile tabs, the plan switcher, the Interest Level rule, the website, /auth, /dashboard, src/middleware.ts, CONTEXT.md and docs/mockup.

Approach
Use test-driven-development. Write the Vitest cases at the service seam first, then the Playwright checks. Use systematic-debugging for failures, verification-before-completion before done, and requesting-code-review once at the end. Project skills: nextjs-app-router, tailwind-v4, testing-unit, testing-e2e, coding-standards, no-ai-design-slop.
Step 1, tiles. topNumbers returns, in order: Search appearances, Recommendations, Messages, Introductions, Profile views, Profile saves. Messages is flagged as the highlighted tile, which gets the prototype's .tile.star treatment in the App Mode accent. Each tile keeps its change line ("▲ 38%", or "▲ 3 more than before" for small counts), hidden when there is no previous period. Remove Connections from this row.
Step 2, chart. "Visibility by day". Search appearances is the main line, with an area fill and point hover titles; Recommendations is the second line. Add the axis grid, end-of-line values, legend and ticks every other day, with no marker. The note comes from a seam function: "Since you claimed your profile on Day N", plus " Search appearances are rising." when the latest day beats the first-week average. Keep the phone toggle and the text alternative.
Step 3, funnel. Steps: Found you in search, Viewed your profile, Saved your profile, Messaged you, Connected. Count distinct Companies, labelled "companies", with the note "last 14 days". Use the prototype's row grid (150px label, bar, bold count, "x% of previous"). Show a whole-number percentage, with one decimal under 10%, and no percentage when the previous step is 0. Show one suggestion line, picked by a fixed rule from the biggest drop.
Step 4, table. Title "N interested companies". Chips All, Hot, Warm and New with counts, using the prototype's .band pill buttons. The columns are Company, Interest Level, Latest signal and Action, with the prototype's 11.5px uppercase headers.
- Interest Level: the level pill on Free; the score plus pill on Growth and Pro.
- Latest signal: like "Saved your profile · Day 12".
- Action: "✓ Messaged" or "✓ Connected" status, otherwise a Message button that opens the existing AI draft, which a person edits and sends.
- Rows: the whole row is clickable and focusable, and Enter opens the drawer.
- Light activity: search-only New Companies fold under a button, "+ N more New companies with light activity (search appearances only)", which reveals them.
- Other chambers: Pro rows add "· other chamber".
- Empty chip: "No companies at this Interest Level."
Step 5, rail.
- Alerts: note "last 14 days", with the prototype's dated feed grid.
- Found you as a…: note "searches", with the prototype's bars.
- Industry: note "groups of 3+".
- Search terms: monospace term and count rows. A gap shows the amber line "Your profile doesn't list this. Add it if you offer it.", followed by small text links "Add to profile" and "We don't offer this". Add opens the Profile tab at the field; once added, show the green "Added to your profile.".
Step 6, drawer. Use the prototype's 420px panel and .tl grid (56px date, text, points). Show one row per signal kind per day, with ×N for repeats, plus a "Repeat interest: signals on 3 separate days" row when the Interest Level rule counts it, all from one seam function. Remove the summary and repeat paragraphs that the prototype doesn't have.
- Free: heading "Signal timeline", the level pill only, no points.
- Growth and Pro: heading "How the intent score was built", a "Hot · 88" style pill, "+N" on each row, and "N points, capped at 100.".
- End with "You see the company, not the person." and the status or Message, plus Connect.
- Keep the non-modal dialog, focus on Close, Escape returning focus to the row, and ?company=.
Step 7, Overview card. The Interest Signals card shows Interested companies (with "N Hot"), Messages and Search appearances, the sparkline, and Hot names that open the drawer.
Step 8, styling pass. Compare each panel against the prototype's CSS at 1440, 1100, 760, 390 and 360 widths, and fix any size or spacing that differs. Then run coding-standards on the diff, then requesting-code-review, then Verification.

Acceptance criteria
Vitest at the service seam covers:
- tile order and the highlighted flag
- hidden change lines with no previous period
- distinct-Company funnel counts and percentage formatting, including the 0 case
- each branch of the suggestion rule
- grouped timeline rows with ×N, and the repeat row
- points summing to the score, with the cap
- the light-activity split
- the chart note, rising and not rising
- the existing determinism check still passing
Playwright covers each happy and sad path in .scratch/comdash-redesign/issues/04-interest-signals-exact-prototype.md, plus:
- no sideways scroll at 360, 390, 1280 and 1440 with the drawer open and closed
- axe with no serious or critical violations on Interest Signals and Overview, with the drawer open
- reduced motion
Every existing product and auth smoke test passes, updated only where it asserted old labels.
Code quality is part of done. Check the diff against each point before reporting, and apply them only to code this session touches.
- Clean: each component and function has one job and a name that says so. No dead code, commented-out code, unused CSS, stray TODOs or console logs. No any, non-null ! or as used to silence an error. Use "use client" only on the smallest interactive leaf.
- Maintainable: one source for each fact. Screens read derived data only through the service seam: tile order, percentages, suggestion text, timeline grouping and the chart note are computed there, never in components. Plan-view rules stay in their single function. Links come from src/paths.ts. Colours come from App Mode tokens. Prototype measurements become CSS values in product.css, not inline styles.
- Scalable: adding a tile, funnel step, rail panel or timeline kind changes one place. Add no dependency.
- Limits: extract shared code only for a use that exists now. Do not refactor outside Scope; list anything worth fixing in your final report.
Report the coding-standards result and anything you duplicated on purpose.

Verification
After each step: pnpm lint && pnpm type:check && pnpm test.
At the end: pnpm lint && pnpm type:check && pnpm test && pnpm build, then pnpm test:e2e.
Use NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co and NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder.
A build clashes with a dev server using the same .next folder, and Playwright reuses any server on port 3000. If one is running, ask the user to stop it rather than killing it.
Report actual output, including anything skipped.

Guardrails
- Do not commit. Do not run git add, git commit or /ship unless the user asks in this session.
- Leave all work uncommitted on feat/website-redesign-pages, and do not switch or create branches.
- End your final report with the changed files grouped by step, each group with a suggested Conventional Commit message.
- Do not push, merge or open a PR. Add no dependencies.
- Never hide a Company name. Never add blur, upgrade prompts or agent metrics.
- Keep "AI drafts, a person decides": nothing sends without the person tapping Send, and every flow works with AI off.
- Voice: sentence case, no emoji, no exclamation marks.
- Do not edit docs/mockup or CONTEXT.md.
- If something here conflicts with the code or the spec, stop and ask.
```
