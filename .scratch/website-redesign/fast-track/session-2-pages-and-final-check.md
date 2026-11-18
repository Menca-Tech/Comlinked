# Fast track, session 2 — Remaining pages, final check and review pack

**What to build:** the For chambers, How it works and ComDash pages in the new structure, a final site-wide check with leftover styling removed, and a review pack so the user and Richard can judge the finished site.

**Replaces:** tickets 07, 08, 09 and 10, and the preparation part of ticket 06. Those ticket files still hold the detail.

**Blocked by:** fast track session 1, reviewed and committed by the user

**Status:** ready-for-agent

- [ ] For chambers, How it works and ComDash match tickets 07, 08 and 09
- [ ] The pilot form checks its fields and says plainly that nothing was sent
- [ ] No placeholder, removed example figure, leftover old styling or second blue headline accent remains
- [ ] Each public page has exactly one navy band
- [ ] The design system and feature status docs match the site
- [ ] The review pack is ready and its decision section is blank
- [ ] Meets the code quality points in its prompt, with the result reported

## Happy paths

- A Chamber Leader reads For chambers, completes the form, sees the honest confirmation and arrives in the chamber tools; one who has already decided uses the hero button and reaches the form.
- A company owner reads How it works from claim to the daily routine, sees step five lead back to step one, and follows the closing button to the Join form.
- A company owner sees named example interest on ComDash at once, understands how to climb, and follows the closing button to the Join form.
- All public pages pass the full automated suite at every required size.
- A presenter goes from the website into the product and back without losing simulation state.
- The user opens the review pack and has everything needed to walk Richard through the site.

## Sad paths

- A required pilot field is blank or only spaces, an email is badly formed, or the member count isn't a number: a message beside it and no navigation.
- Several errors: all are shown and focus moves to the first. Submit pressed twice: one navigation and one confirmation.
- JavaScript off: the pilot submit button is disabled, the web address doesn't change, and all pages and visuals stay readable.
- Answers still unconfirmed: the agreed "We’ll confirm" wording shows, with no placeholder.
- A 360 pixel wide phone: the five steps stay in order, long Company names wrap, and nothing scrolls sideways.
- A screen reader: each panel is described by its text alternative, and the five steps are read in order.
- Removing a style breaks a page: the checks catch it before commit, and the style is restored or the page fixed.
- A spec path isn't covered: a check is added, or a manual result is recorded with the reason.
- A check fails and can't be fixed within scope: it is reported as open, and the review pack doesn't present the site as ready.
- Richard asks for a different direction: the changes are listed in the pack's decision section and handled as new work.

## Executer prompt

```
Goal
Rebuild the For chambers, How it works and ComDash pages, finish the site-wide clean-up and checks, and prepare a review pack so the user and Richard can judge the finished ComLinked website, all on a new branch created for this session.

Context
Repo: /Users/rafaeliiiprudente/Documents/coding projects/Comlinked. The precondition below creates this session's branch, feat/website-redesign-pages. Read first: CLAUDE.md, AGENTS.md, CONTEXT.md and docs/specs/2026-11-09-website-redesign.md.
This prompt compresses four tickets and part of a fifth for speed. Read each in full, in .scratch/website-redesign/issues/: 07-for-chambers-page.md, 08-how-it-works-page.md, 09-comdash-page.md, 10-final-cleanup-and-check.md, 06-homepage-review-with-richard.md. Follow each ticket's Scope, Approach, Acceptance criteria, its "For this ticket" code quality line, and its Happy and Sad paths, except where this prompt overrides them.
Overrides: ignore each ticket's own Verification section and per-ticket code review, and use the ones here instead. Ignore each ticket's Status and Blocked by lines and the branch it names. Ignore every commit instruction in the tickets, because this session does not commit. Tickets 07 to 09 tell you to stop if the homepage review decision is blank: ignore that, and do not look for homepage-review.md. The spec's review-first build order no longer applies, because Richard now reviews the finished site at the end of this session. Ticket 07 lists pilot-request-button.tsx, but that file was never created; replace the existing inert "Request a pilot" button with the new form. Ticket 06 is replaced by Step 5 below.
Precondition: the user must have committed session 1's work on feat/website-redesign-homepage. If git merge-base --is-ancestor feat/website-redesign-homepage feat/comlinked-brand-and-website succeeds, the user has already merged it, so switch to feat/comlinked-brand-and-website; otherwise switch to feat/website-redesign-homepage. Then confirm hero-network-ring.tsx, form-field.tsx, questions.tsx and join-form.tsx exist in src/components/marketing and are tracked by git, and git status shows no changes under src/, e2e/ or docs/. If not, stop and tell the user. Untracked .scratch/ and a modified .claude/commands/handoff.md are expected; leave both as they are. Once these checks pass, run git switch -c feat/website-redesign-pages from the branch you just switched to, before changing anything, and do all the work there. If that branch already exists, stop and ask.
Real pilot requests (FR-WEB-03) are out of scope. The simulation lives in browser memory, so use next/link or router.push between the website and /app.

Scope
Modify: src/components/marketing/for-chambers-content.tsx, how-it-works-content.tsx, comdash-content.tsx, section.tsx, src/app/marketing-site.css, src/app/globals.css (unused public-site tokens only), e2e/website-redesign.spec.ts, docs/design-system/README.md, docs/design-system/site-tokens.css, docs/design-system/tokens.json, docs/specs/2026-11-08-mvp-feature-status.md.
Create in src/components/marketing/: activity-view-panel.tsx, pilot-form.tsx, pilot-form.schema.ts, pilot-form.schema.test.ts, daily-lead-loop.tsx, whos-interested-panel.tsx, and section files under for-chambers/, how-it-works/ and comdash/.
Create outside source: .scratch/website-redesign/review/site-review.md and screenshots in the same folder.
Leave untouched: /app and product.css, /dashboard, /auth logic, src/middleware.ts and docs/mockup. Keep tokens that any non-public code still uses, and confirm by searching before removing.

Approach
Use test-driven-development for the zod schema. For the pages, write each e2e check alongside the ticket it covers and run only those by title with pnpm exec playwright test e2e/website-redesign.spec.ts -g "<title>". Use systematic-debugging for failures, verification-before-completion before done, and requesting-code-review once at the end. Project skills: forms-validation, tailwind-v4, testing-e2e, testing-unit, coding-standards, no-ai-design-slop.
Step 1, ticket 07. For chambers. Delete the "Piloting with" and quote section. Replace [CONFIRM: pilot length and start date] and [CONFIRM: how company data is protected, including from scraping] with "We’ll confirm this with your chamber during pilot planning." Replace [CONFIRM: what pilot chambers provide] with "We’ll confirm anything else with your chamber during pilot planning."
Step 2, ticket 08. How it works. Build ClosingCta in section.tsx here.
Step 3, ticket 09. ComDash. Reuse ClosingCta.
Step 4, ticket 10. Final clean-up and site-wide checks. Also, in docs/specs/2026-11-08-mvp-feature-status.md, add a row to "Agreed for the demo" saying the demo runs on the Next.js app at /app with the HTML mockup as backup, update the "Mobile-first and web layouts" and "Website pages" rows to match what now exists, and update the commit reference in the header.
Step 5, review pack, after Verification has run. With pnpm start and the placeholder Supabase env, capture screenshots of /, /how-it-works, /comdash, /for-chambers and /auth/sign-in at 1440x900 and 390x844, plus the homepage ring mid-sequence and finished. Write site-review.md with: how to open the site locally and from a phone on the same network; the demo path from the homepage into /app/claim; a checklist of what to judge (does it feel calm and established, do the serif headlines read well, is the promise clear to a Chamber Leader and a company owner, does the ring sequence feel right, does the step into the claim flow feel continuous); the exact four page headlines and the "Bring ComLinked to your chamber" wording for Richard to approve; the open items (Verified badge, first real chamber, demo date); any failed check or manual-only result; and a blank decision section with Accepted, Changes needed, Reviewers and Date.

Acceptance criteria
Every Acceptance criterion in tickets 07 to 10 passes. Every row of the spec's happy and sad path tables, and every Happy and Sad path in those tickets, has a passing automated check or a recorded manual result in your final report. site-review.md contains every item above with screenshots present, and its decision section is blank.
Code quality is part of done. Check the diff against each point before reporting, and apply them only to code this session touches.
Clean: each component has one job and a name that says so. No dead code, commented-out code, unused CSS classes, stray TODOs or console logs. No any, non-null ! or as used to silence an error. "use client" only on the smallest interactive leaf.
Maintainable: one source for each fact. Links come from src/paths.ts, colours and type from tokens instead of raw hex values, validation rules from one zod schema with types from z.infer, and e2e page and viewport lists from one constant. Reuse what is already in src/components/marketing before writing something new.
Scalable: adding a section, question, step or field changes one typed array or one component, with no copied markup or CSS. Client JavaScript and dependencies stay at what this work needs.
Limits: extract shared code only for a use that exists now or is named in this prompt or its tickets. Do not refactor outside Scope; list anything worth fixing in your final report.
For this session: reuse FormField, Questions and ExampleTag from session 1 instead of writing new ones. By the end, each page's content file only composes its sections, and no public-site file passes about 300 lines without a reason you state. After the checks pass, run the simplify skill on the branch diff against feat/comlinked-brand-and-website, then re-run Verification.
Report the coding-standards result and anything you duplicated on purpose.

Verification
After each step: pnpm lint && pnpm type:check && pnpm test.
At the end of the session: pnpm lint && pnpm type:check && pnpm test:coverage && pnpm build, then pnpm test:e2e, then pnpm start and check the homepage ring sequence in production mode. This checkout has no .env, so use NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co and NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder. A build clashes with a dev server using the same .next folder, and Playwright reuses any server on port 3000. If a dev server is already running, do not kill it: ask the user to stop it first. Report actual output, including anything skipped.

Guardrails
Do not commit. Do not run git add, git commit or /ship, even when a step is finished, unless the user asks in this session. Leave all work uncommitted on feat/website-redesign-pages so the user can review it. End your final report with the changed files grouped by step, each group with a suggested Conventional Commit message, leaving out the review pack. Each step passes lint, type check and unit tests; if the end-of-session build or e2e run finds a problem, fix it before reporting. Do not push, open a PR or merge unless asked; whether the redesign replaces the demo version is the user's call. Add no dependencies. Do not send the review pack to anyone or fill in the decision; the user shares it with Richard. Do not edit or commit docs/mockup. Make no claim beyond the plan and accepted ADRs. Voice: sentence case, no emoji, no exclamation marks. If something here conflicts with the code, stop and ask.
```
