# 02 — Session 2: Interest Signals, Connections, plan switcher and final check

**What to build:** the remaining ComDash tabs and the plan switcher. Interest Signals lists every interested Company with a dated timeline. Connections has Manage connections, Invitations, Companies in your chamber, Buyers of what you sell, and "From your connections" with AI-drafted replies. A labelled Free, Growth and Pro switcher shows possible future pricing, where Free hides nothing. The session ends with a full check, presenter guide shortcuts, updated docs and the frozen-mockup note.

**Replaces:** proposed tickets 5 to 8.

**Blocked by:** 01 — Session 1, reviewed and committed by the user

**Status:** ready-for-agent

- [ ] Interest Signals shows each Company's Interest Level, summary and timeline, with Message and Connect
- [ ] Connections has all five panels, and replies follow "AI drafts, a person decides"
- [ ] Free opens by default and hides nothing; Growth and Pro add only the intent score and interest from other chambers
- [ ] The switcher is labelled "Possible future pricing. Not in the MVP."
- [ ] Every spec happy and sad path is accounted for
- [ ] The presenter guide can jump to each tab, and the docs match the product
- [ ] Meets the code quality points in its prompt, with the result reported

## Happy paths

- A company owner opens a Hot Company's timeline and messages it from there.
- Accepting an invitation removes it and raises the Connection count.
- Replying to a connection's Ask with the AI draft: editable, sent only on Send, then shown as answered.
- A presenter switches to Pro: interest from other chambers and intent scores appear, and Free content is unchanged.
- The selected view stays while moving between tabs.
- The presenter guide jumps straight to any tab.

## Sad paths

- Ignoring a request: the owner is told the sender won't be notified.
- AI off or the limit spent: the reply box starts empty and sending still works.
- No connections, invitations or items yet: calm empty states.
- Free view: no name, Interest Level or profile gap is hidden, and no upgrade prompt appears.
- A Company with one signal: timeline of one entry, labelled New.
- 360 pixel phone: no sideways scrolling on any tab; long names wrap.
- Screen reader and keyboard: tabs, switcher and replies are fully operable.
- A full page load resets the simulation and the selected view to Free.

## Executer prompt

```
Goal
Finish the ComDash redesign: the Interest Signals and Connections tabs, the labelled plan switcher, and a final site-wide check with docs brought up to date.

Context
Repo: /Users/rafaeliiiprudente/Documents/coding projects/Comlinked. Branch: feat/website-redesign-pages. Stay on it and create no new branch.
Read first: CLAUDE.md, AGENTS.md, CONTEXT.md, docs/adr/0010-client-side-product-simulation.md, and the spec docs/specs/2026-11-11-comdash-redesign.md, which is your detailed brief. Visual reference: /Users/rafaeliiiprudente/Downloads/comdash-prototype.html, outside the repo. Read it, never copy it in, and never use its figures or data.
Session 1 built the ComDash layout and tab routes under /app/dash, the Overview panels in src/components/product/comdash/, Interest Level and the other derived data at the service seam (src/services/comlinked), and placeholder panels on the Interest Signals and Connections tabs. Reuse all of it.
Decided by the user, do not change: keep a "View as" Free / Growth / Pro switcher as a demo of possible future pricing. Free opens by default and shows everything the MVP promises: names, Interest Levels, profile gaps, Next action, nothing blurred, no upgrade prompts. Growth adds a numeric intent score for the Company's own chamber. Pro adds interest from other chambers, labelled with the chamber name, plus the intent score. "From your connections" is built only from Asks, Success Wall wins and profile updates, never a general news feed.
Precondition: the user must have committed session 1. Confirm the ComDash route segments under src/app/app/dash/ and src/components/product/comdash/ are tracked by git, and git status shows no changes under src/ or e2e/. If not, stop and tell the user. Untracked .scratch/ is expected.

Scope
Modify: src/services/comlinked/simulation.ts, types.ts, data.ts, simulation.test.ts; the ComDash layout and the signals and connections route segments under src/app/app/dash/; src/components/product/comdash/*; src/components/product/demo-guide.tsx (tab shortcuts); src/paths.ts if needed; src/app/app/product.css; e2e/product-smoke.spec.ts; docs/design-system/README.md (App Mode: ComDash); docs/specs/2026-11-08-mvp-feature-status.md.
Create: components under src/components/product/comdash/ for the new panels and the switcher.
On the user's machine only, never committed: a note at the top of the HTML mockup's ComDash in docs/mockup/source, saying "Older ComDash design. The Next.js app is current." Then rebuild with python3 docs/mockup/source/build.py and run sh docs/mockup/checks/run-all.sh.
Leave untouched: the website, /auth, /dashboard, src/middleware.ts, the Activity Score rules, Leads, Asks Board, ComMail and the chamber tools beyond reuse.

Approach
Use test-driven-development: Vitest at the service seam first, then Playwright. Use systematic-debugging, verification-before-completion and requesting-code-review once at the end. Project skills: nextjs-app-router, tailwind-v4, testing-unit, testing-e2e, coding-standards, no-ai-design-slop.
Step 1, Interest Signals tab. Every interested Company with Interest Level, a one-line summary such as "Viewed your profile 4 times and saved it", a dated timeline of its signals, repeat interest on separate days called out, and Message and Connect actions.
Step 2, Connections tab, in the prototype's order and wording: Manage connections; Invitations with Accept and Ignore, where Ignore confirms "Request ignored. They won't be notified."; Companies in your chamber with shared Connections; Buyers of what you sell, from the profile's products and the existing fit logic; "From your connections", showing Connections' Asks, Success Wall wins and profile updates, each with a reply using the existing draft and AI-limit rules: editable, sent only on Send, and an empty box when AI is off or spent. Other Companies see only a Company's Connection count and Mutual Connections.
Step 3, plan switcher. Add the view to the simulation state so it survives tab changes and resets with the simulation. Add a pure seam function that filters content by view. Add the intent score (search 1, recommended 2, view 3, save 5, message 10; one per kind per day; capped at 100), shown only on Growth and Pro. Show the label "Possible future pricing. Not in the MVP." beside the switcher.
Step 4, presenter guide: a shortcut to each ComDash tab.
Step 5, final check. Walk every row of the spec's happy and sad path tables, and add a check or record a manual result for each. Update the design system's App Mode ComDash entry and the feature status doc's ComDash rows, noting that Next.js is the main version again. Add the mockup note as above.
Step 6, review: coding-standards on the whole ComDash diff, the simplify skill, requesting-code-review, then Verification.

Acceptance criteria
Vitest covers: plan-view filtering, where Free hides nothing and Growth and Pro add only their extras; intent score values and the cap; "From your connections" containing only Asks, wins and profile updates; invitation accept and ignore; and the existing determinism check still passes.
Playwright covers: a Hot Company's timeline and Message; accepting and ignoring invitations; the AI-drafted reply sending only on Send; the AI-off reply; switching views and the visible label; the view persisting across tabs; presenter guide tab shortcuts; keyboard operation; reduced motion; no sideways scroll at 360, 390, 1280 and 1440 on every tab; axe with no serious or critical violations on all five tabs.
Every row of the spec's happy and sad path tables has a passing check or a recorded manual result in your final report. The mockup checks pass after the note is added.
Code quality is part of done. Check the diff against each point before reporting, and apply them only to code this session touches.
Clean: each component and function has one job and a name that says so. No dead code, commented-out code, unused CSS, stray TODOs or console logs, including session 1's placeholder panels. No any, non-null ! or as used to silence an error. "use client" only on the smallest interactive leaf.
Maintainable: one source for each fact. Screens read derived data only through the service seam. Plan-view rules live in one function, and views never fork whole components. Links come from src/paths.ts and colours from App Mode tokens. Reuse session 1's panels, empty states and Interest Level.
Scalable: adding a view, a Connections panel or an item kind in "From your connections" changes one place. Add no dependency.
Limits: extract shared code only for a use that exists now or is named in this prompt. Do not refactor outside Scope; list anything worth fixing in your final report.
Report the coding-standards result and anything you duplicated on purpose.

Verification
After each step: pnpm lint && pnpm type:check && pnpm test.
At the end: pnpm lint && pnpm type:check && pnpm test:coverage && pnpm build, then pnpm test:e2e, using NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co and NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder. If a dev server is running, ask the user to stop it rather than killing it. Report actual output, including anything skipped.

Guardrails
Do not commit. Do not run git add, git commit or /ship unless the user asks in this session. Leave all work uncommitted on feat/website-redesign-pages, and do not switch or create branches. End your final report with the changed files grouped by step, each group with a suggested Conventional Commit message. Never stage or commit docs/mockup, which is git-ignored and stays on this machine. Do not push, merge or open a PR. Add no dependencies. Never hide a Company name on Free and never add payment or upgrade flows. Keep "AI drafts, a person decides". Voice: sentence case, no emoji, no exclamation marks. If something here conflicts with the code, stop and ask.
```
