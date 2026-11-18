# Fast track, session 1 — Demo leftovers and the homepage

**What to build:** the fixes left over from the demo clean-up, then the complete redesigned homepage: one navy hero with the Network Ring and its one-time sequence, the calm sections below it, and a Join form that checks its fields and leads into the simulated product.

**Replaces:** the demo clean-up handoff (what remains of it) and tickets 02, 03, 04 and 05. Those ticket files still hold the detail.

**Blocked by:** 01 — Quiet authority foundation, committed

**Status:** ready-for-agent

- [ ] The `a-lime` typo is fixed and the ComDash Network Ring follows the App Mode motion rule
- [ ] The footer and every homepage section show no placeholders
- [ ] "Try the product" reaches `/app/claim` and Sign in links reach `/app/dash`
- [ ] The homepage hero, ring sequence and sections match tickets 02, 03 and 04
- [ ] A valid Join form opens the claim flow, and an invalid one says what to fix
- [ ] Meets the code quality points in its prompt, with the result reported

## Happy paths

- A laptop visitor sees the promise, both paths and the ring assembling once; a phone visitor sees the promise and stacked buttons, then the simplified ring on scrolling.
- Each hero button reaches its destination.
- A Chamber Leader reaches the chamber section right after the first-day example.
- The old "What's free" link lands on What we commit to.
- A visitor completes the Join form and lands in the claim flow, or fixes an error, sees its message clear and then succeeds.
- A presenter moves between the website and `/app` without losing simulation state.

## Sad paths

- Reduced motion, JavaScript off, a failed script or no IntersectionObserver: the finished ring shows.
- Scrolling away and back doesn't replay the sequence; returning without a full page load shows the finished ring.
- A 360 pixel wide phone or 200% zoom: no sideways scrolling, and labels stay readable.
- A screen reader hears the ring as one text alternative.
- Real chamber details aren't confirmed, or one field is missing: the first-chamber spot renders nothing.
- A required field is blank or only spaces, or an email is badly formed: a message beside it and no navigation.
- Several errors: all are shown and focus moves to the first.
- Submit pressed twice: one navigation. Very long input is rejected over the limit.
- JavaScript off: the submit button is disabled, and no value reaches the web address.
- A visitor who has already claimed: the claim route opens ComDash.

## Executer prompt

```
Goal
Finish what is left of the demo clean-up, then build the complete redesigned ComLinked homepage, on a new branch created for this session: a navy hero with the Network Ring and its one-time sequence, the calm sections below it, and a validated Join form that leads into the simulated product.

Context
Repo: /Users/rafaeliiiprudente/Documents/coding projects/Comlinked. Start on feat/comlinked-brand-and-website, which already holds ticket 01; the precondition below creates this session's branch, feat/website-redesign-homepage. Read first: CLAUDE.md, AGENTS.md, CONTEXT.md, docs/specs/2026-11-09-website-redesign.md and docs/adr/0010-client-side-product-simulation.md.
This prompt compresses four tickets for speed. Read each in full, in .scratch/website-redesign/issues/: 02-homepage-hero-network-ring.md, 03-network-ring-sequence.md, 04-homepage-sections.md, 05-validated-join-form.md. Follow each ticket's Scope, Approach, Acceptance criteria, its "For this ticket" code quality line, and its Happy and Sad paths, except where this prompt overrides them.
Overrides: ignore each ticket's own Verification section and per-ticket code review, and use the ones here instead. Ignore each ticket's Status line and the branch it names. Ignore every commit instruction in the tickets, because this session does not commit. The spec's review-first build order no longer applies: Richard reviews the finished site at the end of session 2, so nothing here waits for a review.
The demo runs on a browser-held simulation behind src/services/comlinked. A full page load resets it, so moves between the website and /app must use next/link or router.push, never a plain anchor. The For chambers, How it works and ComDash pages are rebuilt in session 2, so their placeholders stay until then.
Precondition: ticket 01 (commit 7db409f) must be on feat/comlinked-brand-and-website. Confirm src/components/marketing/section.tsx and demo-ribbon.tsx are tracked by git, and git status shows no changes under src/, e2e/ or docs/. If not, another session may still be working here, so stop and tell the user. Ticket 01's own demo clean-up precondition no longer applies, because this prompt does that work. Untracked .scratch/ and a modified .claude/commands/handoff.md are expected; leave both as they are. Once these checks pass, run git switch -c feat/website-redesign-homepage feat/comlinked-brand-and-website, before changing anything, and do all the work there. If that branch already exists, stop and ask.

Scope
Modify: src/components/product/screens/wins.tsx (one character), src/components/product/network-ring.tsx (motion only), src/app/app/product.css (only to fix ring labels), docs/design-system/README.md (App Mode: Network Ring), e2e/product-smoke.spec.ts, src/components/marketing/footer.tsx, marketing-nav.tsx, demo-ribbon.tsx, home-content.tsx, section.tsx, src/app/marketing-site.css, e2e/website-redesign.spec.ts, and src/paths.ts only if a path is missing.
Create in src/components/marketing/: hero-network-ring.tsx, first-chamber.tsx, first-chamber.test.ts, questions.tsx, form-field.tsx, join-form.tsx, join-form.schema.ts, join-form.schema.test.ts, and section files under home/.
Leave untouched: for-chambers-content.tsx, how-it-works-content.tsx, comdash-content.tsx, /auth routes and SignInForm, /dashboard, src/middleware.ts, simulation logic, the AI Lead Agent and Team Dashboard previews, the Verified badge, ComMail email copy and docs/mockup.

Approach
Use test-driven-development for the zod schemas. For the pages, write each e2e check alongside the ticket it covers and run only those by title with pnpm exec playwright test e2e/website-redesign.spec.ts -g "<title>". Use systematic-debugging for failures, verification-before-completion before done, and requesting-code-review once at the end. Project skills: nextjs-app-router, tailwind-v4, forms-validation, testing-e2e, testing-unit, coding-standards, no-ai-design-slop.
Step 1, typo. In wins.tsx change a-li${t.me ? "me" : ""} to a-li${t.me ? " me" : ""}.
Step 2, ComDash Network Ring. In network-ring.tsx pass initial={false} to both AnimatePresence elements so nothing animates on first render. Replace the 0.6s spoke transition and the spring node transition with a 0.2s ease-out tween, and remove the per-item delays. Keep the reduced-motion branch at duration 0. In docs/design-system/README.md add a Network Ring entry to the App Mode components: your Company at the centre, Connections and today's Leads around it by Connection Degree. Clarify that "rings stay on public pages" means the decorative logo rings. In e2e/product-smoke.spec.ts extend the laptop test so that after "Two weeks in" .dv2-ring and at least one .dv2-node are visible. Check "New company" and "Two weeks in" at 1440x900, 1280x720 and 390x844, and fix overlapping or clipped labels and sideways scrolling in product.css or the geometry function only.
Step 3, website links. In footer.tsx delete the About list item, and replace the Contact item with a next/link "Contact us" to paths.marketing.chamberPilot, styled like its sibling links. Point the "Try the product" link in demo-ribbon.tsx to paths.product.claim. Point the Sign in links in marketing-nav.tsx (desktop and mobile) and footer.tsx to paths.product.dash, and update the aria-current check to match. The /auth/sign-in route stays in place. Add e2e checks: Try the product reaches /app/claim, and Sign in reaches /app/dash with .a-rank visible.
Step 4, ticket 02. Hero and static ring.
Step 5, ticket 03. Ring sequence.
Step 6, ticket 04. Sections below the hero. If these questions survive the trim, use this wording: replace [CONFIRM: how claims are verified] with "We’ll confirm how claims are checked with your chamber during pilot planning." Replace [CONFIRM: how company data is protected, including from scraping] with "We’ll confirm this with your chamber during pilot planning." Change the heading "Your data is protected" to "Protecting your data".
Step 7, ticket 05. Join form. Delete the [PILOT CHAMBER] option, and point its Sign in link to paths.product.dash.
Step 8, review. Run coding-standards on the session's diff, fix what fails, then requesting-code-review, then Verification.

Acceptance criteria
Every Acceptance criterion in tickets 02 to 05 passes. Every Happy and Sad path in those tickets has a passing automated check or a recorded manual result in your final report. ComDash has no first-render entrance animation, and every Network Ring transition is at most 250ms with no per-item delay, with reduced motion still at zero duration. The ComDash ring is readable with no sideways scrolling at all three sizes in both demo states. rg 'a-li\$\{t.me \? "me"' src returns nothing. rg "bg-cl-slot|\[CONFIRM|\[PILOT CHAMBER|\[QUOTE|\[CONTACT EMAIL" src/components/marketing --glob '!for-chambers-content.tsx' returns nothing. Going from the website into /app and back with the presenter guide's Website button keeps simulation state. /auth/sign-in still renders, and the auth-smoke and a11y specs pass.
Code quality is part of done. Check the diff against each point before reporting, and apply them only to code this session touches.
Clean: each component has one job and a name that says so. No dead code, commented-out code, unused CSS classes, stray TODOs or console logs. No any, non-null ! or as used to silence an error. "use client" only on the smallest interactive leaf.
Maintainable: one source for each fact. Links come from src/paths.ts, colours and type from tokens instead of raw hex values, validation rules from one zod schema with types from z.infer, and e2e page and viewport lists from one constant. Reuse what is already in src/components/marketing before writing something new.
Scalable: adding a section, question, step or field changes one typed array or one component, with no copied markup or CSS. Client JavaScript and dependencies stay at what this work needs.
Limits: extract shared code only for a use that exists now or is named in this prompt or its tickets. Do not refactor outside Scope; list anything worth fixing in your final report.
For this session: section.tsx exports one ExampleTag. questions.tsx and form-field.tsx are ready for session 2 to reuse on the For chambers page. By the end, home-content.tsx only composes the homepage sections, and each section lives under src/components/marketing/home/.
Report the coding-standards result and anything you duplicated on purpose.

Verification
After each step: pnpm lint && pnpm type:check && pnpm test.
At the end of the session: pnpm lint && pnpm type:check && pnpm test && pnpm build, then pnpm test:e2e. This checkout has no .env, so use NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co and NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder. A build clashes with a dev server using the same .next folder, and Playwright reuses any server on port 3000. If a dev server is already running, do not kill it: ask the user to stop it first. Report actual output, including anything skipped.

Guardrails
Do not commit. Do not run git add, git commit or /ship, even when a step is finished, unless the user asks in this session. Leave all work uncommitted on feat/website-redesign-homepage so the user can review it. End your final report with the changed files grouped by step, each group with a suggested Conventional Commit message. Each step passes lint, type check and unit tests; if the end-of-session build or e2e run finds a problem, fix it before reporting. Do not merge, push or open a PR unless asked. Add no dependencies, and do not add the motion library to the website. Never add unsafe-inline or unsafe-eval to script-src. Do not edit or commit docs/mockup. Voice: sentence case, no emoji, no exclamation marks. Keep the strong lines and make no new claims. If something here conflicts with the code, stop and ask.
```
