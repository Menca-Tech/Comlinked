# 10 — Final clean-up and site-wide check

**What to build:** with all four pages rebuilt, the leftover styling from the old site is removed, and every happy and sad path in the spec is confirmed across all public pages and screen sizes. The written docs describe the site as it now is, and the redesign is ready for the user to decide whether it replaces the demo version.

**Blocked by:** 07 — For chambers page; 08 — How it works page; 09 — ComDash page

**Status:** folded into ../fast-track/session-2-pages-and-final-check.md. Don't run this ticket on its own; its detail still applies.

- [ ] Styles and tokens no longer used by public pages are removed, including the decorative rings
- [ ] Every path in the spec's happy and sad path tables has a passing check or a recorded manual result
- [ ] No placeholder, removed example figure or second blue headline accent remains
- [ ] Each public page has exactly one navy band
- [ ] The design system and feature status docs match the site
- [ ] Meets the code quality points in its prompt, with the result reported

## Happy paths

- All public pages pass the full automated suite at every required size.
- A presenter goes from the website into the product and back without losing simulation state.

## Sad paths

- Removing a style breaks a page: it is caught by the checks before commit, and that style is restored or the page fixed.
- A path in the spec isn't covered: a check is added, or a manual result is recorded with the reason.
- A check fails and can't be fixed within this ticket's scope: it is reported as open, and the ticket isn't marked done.

## Executer prompt

```
Goal
Remove leftover old-site styling, confirm every happy and sad path in the redesign spec, and bring the docs in line with the site.

Context
Repo: /Users/rafaeliiiprudente/Documents/coding projects/Comlinked. Branch: feat/website-redesign. Read first: CLAUDE.md, AGENTS.md, CONTEXT.md, and docs/specs/2026-11-09-website-redesign.md, especially Happy and sad paths and Testing Decisions.
Tickets 01 to 09 must be complete. Earlier tickets left some old rules in place while pages were rebuilt.

Scope
Modify: src/app/marketing-site.css, src/app/globals.css (unused public-site tokens only), e2e/website-redesign.spec.ts, docs/design-system/README.md, docs/design-system/site-tokens.css, docs/design-system/tokens.json, docs/specs/2026-11-08-mvp-feature-status.md.
Leave untouched: /app and product.css, /dashboard, /auth logic. Keep tokens that any non-public code still uses, and confirm by searching before removing.

Approach
Use verification-before-completion, systematic-debugging for failures, and requesting-code-review at the end. Project skills: coding-standards, testing-e2e, tailwind-v4.
1. Search for each class and token in marketing-site.css and the public-site part of globals.css, and remove those with no remaining use: decorative ring backgrounds, near-black night variants and the slot colours.
2. Walk every row of the spec's happy and sad path tables. Add any missing automated check. For rows only a person can judge, or that can't be automated, list them in the final report with the manual result or the reason.
3. Add site-wide checks: no text matching \[(CONFIRM|PILOT|QUOTE|CONTACT|NAME|ROLE); the text "312" absent from public pages; exactly one navy band per page; the blue headline accent only on /.
4. Confirm the journey from the website into /app and back keeps simulation state, using the presenter guide's Website button.
5. Update the docs: Site Mode rules and tokens as built, a Network Ring note separating the hero drawing from the product component, and the website row in the feature status doc.

Acceptance criteria
All automated checks pass at 360, 390, 1280 and 1440 pixels wide on /, /how-it-works, /comdash, /for-chambers and /auth/sign-in. With reduced motion and with JavaScript disabled, each page remains complete. No console CSP violations on public pages. Unused styles are gone, and each table row is accounted for in the final report.

Code quality is part of done. Check the diff against each point before reporting, and apply them only to code this ticket touches.
Clean: each component has one job and a name that says so. No dead code, commented-out code, unused CSS classes, stray TODOs or console logs. No any, non-null ! or as used to silence an error. "use client" only on the smallest interactive leaf.
Maintainable: one source for each fact. Links come from src/paths.ts, colours and type from tokens instead of raw hex values, validation rules from one zod schema with types from z.infer, and e2e page and viewport lists from one constant. Reuse what is already in src/components/marketing before writing something new.
Scalable: adding a section, question, step or field changes one typed array or one component, with no copied markup or CSS. Sections this ticket builds or rebuilds go in their own files under src/components/marketing/<page>/ when the page file is over about 300 lines, and those new files are in Scope. Client JavaScript and dependencies stay at what this ticket needs.
Limits: extract shared code only for a use that exists now or is named in this prompt. Do not refactor outside Scope; list anything worth fixing in your final report.
Run the coding-standards skill on the diff before requesting review, and report the result and anything you duplicated on purpose.
For this ticket: search before removing, and leave no unused token, class or export on the public site. After the checks pass, run the simplify skill on the branch diff against feat/comlinked-brand-and-website, then re-run Verification. Report any public-site file still over about 300 lines, and confirm all four pages follow the same section pattern.

Verification
pnpm lint && pnpm type:check && pnpm test:coverage && pnpm build, then pnpm test:e2e, using NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co and NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder. Then pnpm start and check the homepage ring sequence in production mode. Report actual output, including anything skipped.

Guardrails
Conventional Commits. Work on feat/website-redesign and never commit to main. Keep every commit green. Do not push, open a PR or merge into the demo branch unless asked; whether the redesign replaces the demo version is the user's call. Add no dependencies. If something here conflicts with the code, stop and ask.
```
