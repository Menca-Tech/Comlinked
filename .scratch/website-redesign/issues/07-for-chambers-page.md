# 07 — For chambers page

**What to build:** a Chamber Leader reads the case in order: what members get, how it works for the chamber, what a pilot asks, and what ComLinked commits to. An example of the activity view shows what the chamber will be able to see. The pilot form comes last, checks its fields, and says plainly that nothing was sent before opening the chamber tools.

**Blocked by:** 06 — Homepage review with Richard

**Status:** folded into ../fast-track/session-2-pages-and-final-check.md. Don't run this ticket on its own; its detail still applies.

- [ ] Seven sections in the agreed order, with one navy band
- [ ] The hero has one message, the activity view panel and one "Request a pilot" button that reaches the form
- [ ] The panel is marked as an example and has a text alternative
- [ ] The form ends the page and keeps the `#pilot` link
- [ ] `#how` and `#faq` keep working
- [ ] The confirmation says nothing was sent
- [ ] Meets the code quality points in its prompt, with the result reported

## Happy paths

- A Chamber Leader reads the page, completes the form, sees the honest confirmation and arrives in the chamber tools.
- A Chamber Leader who has already decided uses the hero button and reaches the form.

## Sad paths

- A required field is blank or only spaces: a message beside it, and no navigation.
- A badly formed email: a message beside it, and no navigation.
- Member count isn't a number: a message beside it.
- Several errors: all are shown and focus moves to the first.
- Submit pressed twice: one navigation and one confirmation.
- JavaScript off: the submit button is disabled and the web address doesn't change.
- Answers still unconfirmed: the agreed "We’ll confirm" wording shows, with no placeholder.

## Executer prompt

```
Goal
Rebuild the For chambers page as a seven-section case for a pilot, led by an activity view panel and ending in a validated pilot form that leads into the chamber tools.

Context
Repo: /Users/rafaeliiiprudente/Documents/coding projects/Comlinked. Branch: feat/website-redesign. Read first: CLAUDE.md, AGENTS.md, CONTEXT.md, docs/specs/2026-11-09-website-redesign.md (For chambers, Visuals, Forms, Happy and sad paths), plan Section 3.6, and .scratch/website-redesign/review/homepage-review.md to confirm the direction was accepted and pick up any changes. If the decision is blank or not accepted, stop and tell the user.
Real pilot requests (FR-WEB-03) are out of scope. Follow the Join form in src/components/marketing/join-form.tsx for form behaviour and its disabled-until-mounted button. Activity view means who has claimed, who is active and who needs an intro. The chamber visual must not be a Network Ring, because that term means one Company at the centre.

Scope
Modify: src/components/marketing/for-chambers-content.tsx, src/components/marketing/pilot-request-button.tsx (remove once the form replaces it), src/components/marketing/section.tsx if a shared closing or panel piece is needed, src/app/marketing-site.css, e2e/website-redesign.spec.ts.
Create: src/components/marketing/activity-view-panel.tsx, src/components/marketing/pilot-form.tsx (client), src/components/marketing/pilot-form.schema.ts, src/components/marketing/pilot-form.schema.test.ts.
Leave untouched: the chamber tools in /app, other pages.

Approach
Use test-driven-development. Use verification-before-completion and requesting-code-review. Project skills: forms-validation, testing-unit, testing-e2e, tailwind-v4, no-ai-design-slop.
Sections in order:
1. Navy PageHero: one message, activity view panel, one "Request a pilot" link to #pilot. No decorative rings.
2. What your members get.
3. How it works for your chamber (id="how").
4. What a pilot asks of you: the member list and one contact, and that pilot chambers and their members join free.
5. What we commit to: each Chamber Network kept separate, every feature open to every member, other Companies see only a Company's Connection count and Mutual Connections.
6. Questions, shortened (id="faq"), keeping the agreed "We’ll confirm" wording.
7. Request a pilot form (id="pilot") on paper with one navy button. Remove the separate closing band.
Panel: server component built in the page, with example counts and example Company names, a visible "Example" tag, role="img" and one aria-label.
Form: keep existing fields and which are optional. Zod: trim, require the required fields, validate email, member count optional but numeric when given, cap text at 200 and message at 1000 characters. On valid submit call toast("This is a demo, so nothing was sent. Opening the chamber tools.") then router.push(paths.product.chamber), guarded against double submission. Never log, store or send values.

Acceptance criteria
Headings in order on /for-chambers, with one navy band. /for-chambers#pilot, #how and #faq land below the top bar. Playwright: a valid form shows the confirmation and reaches /app/chamber; blank, bad-email and non-numeric submissions stay put with messages and focus on the first; a double click gives one navigation; no field value in the URL; button disabled with JavaScript off. Vitest covers the schema. No sideways scrolling at 360, 390, 1280 and 1440. axe passes.

Code quality is part of done. Check the diff against each point before reporting, and apply them only to code this ticket touches.
Clean: each component has one job and a name that says so. No dead code, commented-out code, unused CSS classes, stray TODOs or console logs. No any, non-null ! or as used to silence an error. "use client" only on the smallest interactive leaf.
Maintainable: one source for each fact. Links come from src/paths.ts, colours and type from tokens instead of raw hex values, validation rules from one zod schema with types from z.infer, and e2e page and viewport lists from one constant. Reuse what is already in src/components/marketing before writing something new.
Scalable: adding a section, question, step or field changes one typed array or one component, with no copied markup or CSS. Sections this ticket builds or rebuilds go in their own files under src/components/marketing/<page>/ when the page file is over about 300 lines, and those new files are in Scope. Client JavaScript and dependencies stay at what this ticket needs.
Limits: extract shared code only for a use that exists now or is named in this prompt. Do not refactor outside Scope; list anything worth fixing in your final report.
Run the coding-standards skill on the diff before requesting review, and report the result and anything you duplicated on purpose.
For this ticket: reuse FormField from form-field.tsx, Questions from questions.tsx and ExampleTag from section.tsx. If the double-submission guard would be a second copy of the Join form's, extract one shared helper instead. Member benefits, pilot asks and commitments are typed arrays. By the end of this ticket for-chambers-content.tsx only composes the page's sections.

Verification
pnpm lint && pnpm type:check && pnpm test && pnpm build, then pnpm test:e2e, using NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co and NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder. Report actual output, including anything skipped.

Guardrails
Conventional Commits. Work on feat/website-redesign and never commit to main. Keep every commit green. Do not push or open a PR unless asked. Add no dependencies. Make no claim beyond the plan and accepted ADRs. Voice: sentence case, no emoji, no exclamation marks. If something here conflicts with the code, stop and ask.
```
