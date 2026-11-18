# 04 — Homepage sections below the hero

**What to build:** below the hero, the homepage tells one calm story in order: Your first day, For chambers, When people leave, What we commit to, and Questions. Specific commitments replace example figures as the proof, and a reserved spot for the first real chamber stays invisible until Richard confirms its details.

**Blocked by:** 01 — Quiet authority foundation

**Status:** folded into ../fast-track/session-1-homepage.md. Don't run this ticket on its own; its detail still applies.

- [ ] The sections appear in the agreed order, all on paper or white
- [ ] "One network, three ways in", "What your company profile shows" and the closing band are gone
- [ ] What we commit to takes over the `#free` link
- [ ] No example figures appear in the sales argument
- [ ] Commitments come only from the plan and accepted decisions, and the Verified badge isn't among them
- [ ] The first-chamber spot renders nothing until complete details exist
- [ ] Meets the code quality points in its prompt, with the result reported

## Happy paths

- A Chamber Leader reaches a chamber section directly after the first-day example, and follows it to For chambers.
- A visitor opens the old "What's free" link and lands on What we commit to.

## Sad paths

- Real chamber details aren't confirmed: no empty space and no placeholder.
- The first-chamber spot is switched on with a missing field: it still renders nothing.
- A long question or answer on a phone: no sideways scrolling.
- A section link: its heading isn't hidden by the top bar.

## Executer prompt

```
Goal
Rebuild the homepage below the hero into the agreed calm sequence, with commitments replacing example figures as the proof.

Context
Repo: /Users/rafaeliiiprudente/Documents/coding projects/Comlinked. Branch: feat/website-redesign. Read first: CLAUDE.md, AGENTS.md, CONTEXT.md, docs/specs/2026-11-09-website-redesign.md (Homepage, Proof and copy), and docs/specs/2026-10-11-mvp-build-plan.md Sections 1 and 5.
Section.tsx provides Section and SectionIntro. If ticket 02 has landed, the hero and "Your first day" card are already in place; if not, leave the hero alone. The Join form section stays in place and is rebuilt in ticket 05. Example company names may appear only inside clearly marked example visuals.

Scope
Modify: src/components/marketing/home-content.tsx (sections below the hero, excluding the Join form), src/app/marketing-site.css, e2e/website-redesign.spec.ts.
Create: src/components/marketing/first-chamber.tsx, src/components/marketing/first-chamber.test.ts.
Leave untouched: other pages, /app. "What your company profile shows" is removed here and re-homed by ticket 08, which recovers it from git.

Approach
Use test-driven-development. Use verification-before-completion and requesting-code-review. Project skills: tailwind-v4, testing-e2e, testing-unit, no-ai-design-slop.
Order after the hero:
1. Your first day: three named example Matches, each with a reason to meet, restyled for paper and marked as an example.
2. For chambers: one section with its message and a link to the For chambers page.
3. When people leave, relationships shouldn't: keep the heading and comparison, restyled, with its drawings static in their end state.
4. What we commit to, with id="free". State: free for every company, company names never hidden, Connections stay with the Company, each Chamber Network kept separate, AI drafts while a person decides. Do not mention the Verified badge.
5. Questions: keep only the doubts that stop someone joining. Unconfirmed answers keep "We’ll confirm this with your chamber during pilot planning." wording.
Delete "One network, three ways in" including the "312" figure, "What your company profile shows", and the closing "Build connections your company keeps" band.
First-chamber spot: first-chamber.tsx holds a zod schema for name, quote, person and role, and a constant set to null. The component renders nothing unless the value parses. Unit test: null, missing field, blank field and complete values.
Keep copy to one idea per section and make no new claims.

Acceptance criteria
Headings appear in the agreed order on /. /#free lands on What we commit to with its heading below the top bar. The text "312", "One network" and "Build connections your company keeps" do not appear. The first-chamber spot is absent. No sideways scrolling at 360, 390, 1280 and 1440. axe passes. The Vitest schema tests pass.

Code quality is part of done. Check the diff against each point before reporting, and apply them only to code this ticket touches.
Clean: each component has one job and a name that says so. No dead code, commented-out code, unused CSS classes, stray TODOs or console logs. No any, non-null ! or as used to silence an error. "use client" only on the smallest interactive leaf.
Maintainable: one source for each fact. Links come from src/paths.ts, colours and type from tokens instead of raw hex values, validation rules from one zod schema with types from z.infer, and e2e page and viewport lists from one constant. Reuse what is already in src/components/marketing before writing something new.
Scalable: adding a section, question, step or field changes one typed array or one component, with no copied markup or CSS. Sections this ticket builds or rebuilds go in their own files under src/components/marketing/<page>/ when the page file is over about 300 lines, and those new files are in Scope. Client JavaScript and dependencies stay at what this ticket needs.
Limits: extract shared code only for a use that exists now or is named in this prompt. Do not refactor outside Scope; list anything worth fixing in your final report.
Run the coding-standards skill on the diff before requesting review, and report the result and anything you duplicated on purpose.
For this ticket: commitments and questions are typed arrays. Build Questions as one component that takes a list, in src/components/marketing/questions.tsx, because ticket 07 renders the same thing. Use ExampleTag from section.tsx, adding it there if ticket 02 has not landed. Both files are in Scope here.

Verification
pnpm lint && pnpm type:check && pnpm test && pnpm build, then pnpm test:e2e, using NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co and NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder. Report actual output, including anything skipped.

Guardrails
Conventional Commits. Work on feat/website-redesign and never commit to main. Keep every commit green. Do not push or open a PR unless asked. Add no dependencies. Voice: sentence case, no emoji, no exclamation marks. Keep the strong lines. If something here conflicts with the code, stop and ask.
```
