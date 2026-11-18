# 09 — ComDash page

**What to build:** a short page that leads with the moment that brings companies back: a calm "Who's interested" panel of named example companies. It then explains the four Interest Signals, that names are never hidden, and in plain words how activity lifts a Company among relevant results.

**Blocked by:** 06 — Homepage review with Richard

**Status:** folded into ../fast-track/session-2-pages-and-final-check.md. Don't run this ticket on its own; its detail still applies.

- [ ] Four sections in the agreed order, with one navy band
- [ ] The hero has one message and the "Who's interested" panel, marked as an example, with a text alternative
- [ ] All four Interest Signals are explained, and names are stated as never hidden
- [ ] Rank is explained with relevance first
- [ ] Example rank values appear only inside the marked panel
- [ ] Meets the code quality points in its prompt, with the result reported

## Happy paths

- A company owner sees named example interest at once, understands how to climb, and follows the closing button to the Join form.

## Sad paths

- A long Company name in the panel on a phone: it wraps and doesn't overflow.
- A phone at 360 pixels wide: no sideways scrolling.
- A screen reader: the panel is described by its text alternative.
- JavaScript off: the page and panel are fully readable.

## Executer prompt

```
Goal
Rebuild the ComDash marketing page as a short page led by a built-in "Who's interested" example panel.

Context
Repo: /Users/rafaeliiiprudente/Documents/coding projects/Comlinked. Branch: feat/website-redesign. Read first: CLAUDE.md, AGENTS.md, CONTEXT.md, docs/specs/2026-11-09-website-redesign.md (ComDash page, Visuals, Proof and copy), plan Sections 3.2 and 4, and .scratch/website-redesign/review/homepage-review.md to confirm the direction was accepted and pick up any changes. If the decision is blank or not accepted, stop and tell the user.
The four Interest Signals: found you in search, viewed your profile, messaged you, was recommended your company. The panel is the page's one visual and is not a screenshot. Search rank is relevance first, with activity raising a Company among relevant results by up to 30%.

Scope
Modify: src/components/marketing/comdash-content.tsx, src/components/marketing/section.tsx (add a ClosingCta if it doesn't exist yet, and reuse it if it does), src/app/marketing-site.css, e2e/website-redesign.spec.ts.
Create: src/components/marketing/whos-interested-panel.tsx.
Leave untouched: the product ComDash under /app, other pages.

Approach
Use test-driven-development: write the e2e checks first. Use verification-before-completion and requesting-code-review. Project skills: tailwind-v4, testing-e2e, no-ai-design-slop.
Sections in order:
1. Navy PageHero: one message and the large panel. No decorative rings.
2. Who's interested, by name: the four signals, and that names are never hidden.
3. Climb by being active: relevance first in plain words, with a shortened list of what earns points that matches plan Section 4's values exactly.
4. ClosingCta on paper with one navy "Join ComLinked free" linking to paths.marketing.join.
Panel: a server component listing named example companies and their signal, with a visible "Example" tag, role="img" and one aria-label. A rank such as "#4 of 12 in Food Suppliers" may appear only inside it.
Remove extra dark bands and the blue headline accent. Tighten copy with no new claims.

Acceptance criteria
Headings in order on /comdash, with one navy band. All four signals appear as text. The "Example" tag is visible and the panel has one accessible name. No rank figure appears outside the panel. The closing button reaches the Join form. No sideways scrolling at 360, 390, 1280 and 1440. Readable with JavaScript disabled. axe passes.

Code quality is part of done. Check the diff against each point before reporting, and apply them only to code this ticket touches.
Clean: each component has one job and a name that says so. No dead code, commented-out code, unused CSS classes, stray TODOs or console logs. No any, non-null ! or as used to silence an error. "use client" only on the smallest interactive leaf.
Maintainable: one source for each fact. Links come from src/paths.ts, colours and type from tokens instead of raw hex values, validation rules from one zod schema with types from z.infer, and e2e page and viewport lists from one constant. Reuse what is already in src/components/marketing before writing something new.
Scalable: adding a section, question, step or field changes one typed array or one component, with no copied markup or CSS. Sections this ticket builds or rebuilds go in their own files under src/components/marketing/<page>/ when the page file is over about 300 lines, and those new files are in Scope. Client JavaScript and dependencies stay at what this ticket needs.
Limits: extract shared code only for a use that exists now or is named in this prompt. Do not refactor outside Scope; list anything worth fixing in your final report.
Run the coding-standards skill on the diff before requesting review, and report the result and anything you duplicated on purpose.
For this ticket: panel rows, the four signals and the point values are typed arrays, with a comment pointing the point values to plan Section 4. Reuse ExampleTag and ClosingCta from section.tsx instead of writing new ones. By the end of this ticket comdash-content.tsx only composes the page's sections.

Verification
pnpm lint && pnpm type:check && pnpm test && pnpm build, then pnpm test:e2e, using NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co and NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder. Report actual output, including anything skipped.

Guardrails
Conventional Commits. Work on feat/website-redesign and never commit to main. Keep every commit green. Do not push or open a PR unless asked. Add no dependencies. Voice: sentence case, no emoji, no exclamation marks. If something here conflicts with the code, stop and ask.
```
