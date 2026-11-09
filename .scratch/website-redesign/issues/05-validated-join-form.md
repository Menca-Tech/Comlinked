# 05 — Validated Join form

**What to build:** the homepage ends with the Join form. Filled in correctly, it leads into the claim flow. Filled in wrongly, it says what to fix, beside the field, and moves focus to the first problem. Nothing is stored or sent, and a visitor's details never appear in a web address.

**Blocked by:** 04 — Homepage sections below the hero

**Status:** folded into ../fast-track/session-1-homepage.md. Don't run this ticket on its own; its detail still applies.

- [ ] The form ends the homepage and keeps the `#join` link
- [ ] A valid form opens the claim flow and keeps the simulation in the browser
- [ ] Invalid fields show messages beside them and focus moves to the first
- [ ] Nothing is stored, sent or placed in a web address
- [ ] Unit tests cover the validation rules
- [ ] Meets the code quality points in its prompt, with the result reported

## Happy paths

- A visitor completes the form and lands in the claim flow.
- A visitor fixes an error and its message clears, then submits successfully.

## Sad paths

- A required field is blank, or contains only spaces: a message beside it, and no navigation.
- A badly formed email: a message beside it, and no navigation.
- Several errors: all are shown and focus moves to the first.
- Submit pressed twice: one navigation.
- Very long input: stays inside the field and is rejected over the limit.
- JavaScript off: the submit button is disabled, nothing is submitted and the web address doesn't change.
- A visitor who has already claimed in this demo: the claim route opens ComDash.

## Executer prompt

```
Goal
Turn the homepage Join section into a validated form that ends the page and leads into the simulated claim flow, without storing or sending anything.

Context
Repo: /Users/rafaeliiiprudente/Documents/coding projects/Comlinked. Branch: feat/website-redesign. Read first: CLAUDE.md, AGENTS.md, docs/specs/2026-11-09-website-redesign.md (Forms, Happy and sad paths) and docs/adr/0010-client-side-product-simulation.md.
Real sign-up (FR-WEB-02) is out of scope. The simulation lives in browser memory, so navigation must be client-side with router.push. A full page load would reset it. A native form submission with no script would put values in the URL, so the submit button stays disabled until the client component has mounted. A disabled default button also blocks implicit submission on Enter.

Scope
Modify: src/components/marketing/home-content.tsx (Join section), src/app/marketing-site.css, e2e/website-redesign.spec.ts.
Create: src/components/marketing/join-form.tsx (client), src/components/marketing/join-form.schema.ts, src/components/marketing/join-form.schema.test.ts.
Leave untouched: /auth, /app, other pages.

Approach
Use test-driven-development: write the schema tests and e2e checks first. Use verification-before-completion and requesting-code-review. Project skills: forms-validation, testing-unit, testing-e2e, nextjs-app-router.
1. Keep the current fields, labels and the visibility notice. Read the existing form to see which are required; the chamber field stays optional.
2. Schema with zod: trim strings, require company, name, role and work email, validate the email format, and cap text fields at 200 characters.
3. Use react-hook-form with the zod resolver and noValidate. Messages sit beside their fields, linked by aria-describedby, with aria-invalid set. Focus moves to the first error.
4. Keep the section as the page ending with id="join", on paper with one navy button labelled "Agree & join". Keep "Claim an existing company profile" linking to paths.product.claim and the Sign in link.
5. On valid submit, guard against double submission and call router.push(paths.product.claim). Do not log, store or send values.

Acceptance criteria
Vitest covers blank, spaces only, badly formed email, over-long and valid values. In Playwright: a valid form reaches /app/claim; blank and bad-email submissions stay on / with visible messages and focus on the first invalid field; correcting a field clears its message; a double click results in one navigation; the URL never contains a field value; with JavaScript disabled the button is disabled. /#join lands below the top bar. axe passes.

Code quality is part of done. Check the diff against each point before reporting, and apply them only to code this ticket touches.
Clean: each component has one job and a name that says so. No dead code, commented-out code, unused CSS classes, stray TODOs or console logs. No any, non-null ! or as used to silence an error. "use client" only on the smallest interactive leaf.
Maintainable: one source for each fact. Links come from src/paths.ts, colours and type from tokens instead of raw hex values, validation rules from one zod schema with types from z.infer, and e2e page and viewport lists from one constant. Reuse what is already in src/components/marketing before writing something new.
Scalable: adding a section, question, step or field changes one typed array or one component, with no copied markup or CSS. Sections this ticket builds or rebuilds go in their own files under src/components/marketing/<page>/ when the page file is over about 300 lines, and those new files are in Scope. Client JavaScript and dependencies stay at what this ticket needs.
Limits: extract shared code only for a use that exists now or is named in this prompt. Do not refactor outside Scope; list anything worth fixing in your final report.
Run the coding-standards skill on the diff before requesting review, and report the result and anything you duplicated on purpose.
For this ticket: label, message and aria wiring live in one FormField component in src/components/marketing/form-field.tsx, which is in Scope here, used by every field and by ticket 07's pilot form. By the end of this ticket home-content.tsx only composes the homepage sections.

Verification
pnpm lint && pnpm type:check && pnpm test && pnpm build, then pnpm test:e2e, using NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co and NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder. Report actual output, including anything skipped.

Guardrails
Conventional Commits. Work on feat/website-redesign and never commit to main. Keep every commit green. Do not push or open a PR unless asked. Add no dependencies. Voice: sentence case, no emoji, no exclamation marks. If something here conflicts with the code, stop and ask.
```
