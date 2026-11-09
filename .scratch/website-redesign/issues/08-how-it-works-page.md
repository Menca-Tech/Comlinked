# 08 — How it works page

**What to build:** a company owner follows one company's journey: claiming its profile, its first day, and every day after, shown as the five steps of the Daily Lead Loop. A calm section explains that AI drafts and a person decides, and that everything works with the AI Assistant off. The page closes with one clear action.

**Blocked by:** 06 — Homepage review with Richard

**Status:** folded into ../fast-track/session-2-pages-and-final-check.md. Don't run this ticket on its own; its detail still applies.

- [ ] Six sections in the agreed order, with one navy band
- [ ] Claim your profile shows what a company profile contains
- [ ] The Daily Lead Loop's five steps are the page's one visual, with a text alternative
- [ ] The page closes on paper with one navy "Join ComLinked free" button
- [ ] Meets the code quality points in its prompt, with the result reported

## Happy paths

- A company owner reads from claim to the daily routine and follows the closing button to the Join form.
- A visitor follows the Daily Lead Loop in order and sees how the last step leads back to the first.

## Sad paths

- A phone at 360 pixels wide: the five steps stay readable in order, with no sideways scrolling.
- A screen reader: the five steps are read in order as text.
- JavaScript off: the page and the visual are fully readable.

## Executer prompt

```
Goal
Rebuild the How it works page as one company's journey, with the Daily Lead Loop as its one visual.

Context
Repo: /Users/rafaeliiiprudente/Documents/coding projects/Comlinked. Branch: feat/website-redesign. Read first: CLAUDE.md, AGENTS.md, CONTEXT.md, docs/specs/2026-11-09-website-redesign.md (How it works, Visuals), plan Sections 2 and 5, and .scratch/website-redesign/review/homepage-review.md to confirm the direction was accepted and pick up any changes. If the decision is blank or not accepted, stop and tell the user.
The glossary's Daily Lead Loop has five steps: Morning Digest, act on Leads, talk and close, share the win, rank rises, and the last feeds the first. The homepage's "What your company profile shows" section was removed in ticket 04; recover its content with git show feat/comlinked-brand-and-website:src/components/marketing/home-content.tsx.

Scope
Modify: src/components/marketing/how-it-works-content.tsx, src/components/marketing/section.tsx (add a ClosingCta if it doesn't exist yet, and reuse it if it does), src/app/marketing-site.css, e2e/website-redesign.spec.ts.
Create: src/components/marketing/daily-lead-loop.tsx.
Leave untouched: other pages, /app.

Approach
Use test-driven-development: write the e2e checks first. Use verification-before-completion and requesting-code-review. Project skills: tailwind-v4, testing-e2e, no-ai-design-slop.
Sections in order:
1. Navy PageHero: one message and one button. No decorative rings.
2. Claim your profile: what a company profile contains, using the recovered content.
3. Your first day.
4. Every day after: the Daily Lead Loop.
5. AI drafts. You decide: nothing is sent until a person taps Send, and everything works with the AI Assistant off.
6. ClosingCta on paper with one navy "Join ComLinked free" linking to paths.marketing.join.
daily-lead-loop.tsx: a server component using an ordered list of five steps as the real content, drawn as a simple loop on laptops and a vertical sequence on phones, showing that step five leads back to step one. It does not animate.
Keep the strong copy and tighten the rest to one idea per section, with no new claims. Remove extra dark bands so only the hero is navy. Only the homepage hero uses the blue headline accent, so remove it here.

Acceptance criteria
Headings in order on /how-it-works, with one navy band. The five steps exist as an ordered list in the correct order. The closing button reaches the Join form. No sideways scrolling at 360, 390, 1280 and 1440. The page is readable with JavaScript disabled. axe passes.

Code quality is part of done. Check the diff against each point before reporting, and apply them only to code this ticket touches.
Clean: each component has one job and a name that says so. No dead code, commented-out code, unused CSS classes, stray TODOs or console logs. No any, non-null ! or as used to silence an error. "use client" only on the smallest interactive leaf.
Maintainable: one source for each fact. Links come from src/paths.ts, colours and type from tokens instead of raw hex values, validation rules from one zod schema with types from z.infer, and e2e page and viewport lists from one constant. Reuse what is already in src/components/marketing before writing something new.
Scalable: adding a section, question, step or field changes one typed array or one component, with no copied markup or CSS. Sections this ticket builds or rebuilds go in their own files under src/components/marketing/<page>/ when the page file is over about 300 lines, and those new files are in Scope. Client JavaScript and dependencies stay at what this ticket needs.
Limits: extract shared code only for a use that exists now or is named in this prompt. Do not refactor outside Scope; list anything worth fixing in your final report.
Run the coding-standards skill on the diff before requesting review, and report the result and anything you duplicated on purpose.
For this ticket: one typed array of five steps renders one ordered list, and CSS alone turns it into the laptop loop or the phone sequence. ClosingCta is the single closing band in section.tsx, with its text passed as props. By the end of this ticket how-it-works-content.tsx only composes the page's sections.

Verification
pnpm lint && pnpm type:check && pnpm test && pnpm build, then pnpm test:e2e, using NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co and NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder. Report actual output, including anything skipped.

Guardrails
Conventional Commits. Work on feat/website-redesign and never commit to main. Keep every commit green. Do not push or open a PR unless asked. Add no dependencies. Voice: sentence case, no emoji, no exclamation marks. If something here conflicts with the code, stop and ask.
```
