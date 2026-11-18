# 01 — Quiet authority foundation

**What to build:** every public page takes on the new look. Headlines are set in Source Serif 4, near-black gives way to deep navy, and visitors see the solid white navigation with For chambers first, a quieter footer and one thin ribbon saying this is a working mockup. Page-load fades are gone, so content appears at once. The written Site Mode rules match what is on screen.

**Blocked by:** the demo clean-up handoff (separate, must have landed)

**Status:** ready-for-agent

- [ ] Headlines on all five public pages use Source Serif 4; other text uses Nunito Sans
- [ ] Dark grounds on public pages are deep navy, not near-black
- [ ] The navigation is solid white, stays in view, and orders For chambers, How it works, ComDash, with one filled "Join free"
- [ ] The footer has no buttons and keeps its line and link columns
- [ ] The ribbon is one thin muted line above the navigation and scrolls away
- [ ] No content fades in on load
- [ ] The sign-in page uses the new navy hero with no decorative rings
- [ ] The design system's Site Mode rules are updated
- [ ] Meets the code quality points in its prompt, with the result reported

## Happy paths

- Any public page opens with its content visible immediately, in the new type and colours.
- A visitor scrolls: the ribbon leaves, the navigation stays.
- A section link lands with its heading below the navigation.
- The phone menu opens, closes with Escape and closes on navigation.

## Sad paths

- The serif font fails to load: a fallback serif shows and no text is hidden.
- A 360 pixel wide phone: no sideways scrolling.
- Keyboard only: every control shows focus and the skip link works.
- Reduced motion: nothing animates, and nothing stays hidden.

## Executer prompt

```
Goal
Give every public ComLinked page the new "quiet authority" foundation: Source Serif 4 headlines, deep navy instead of near-black, a solid white navigation, a quieter footer, a quiet ribbon and no page-load fades.

Context
Repo: /Users/rafaeliiiprudente/Documents/coding projects/Comlinked. Read first: CLAUDE.md, AGENTS.md, CONTEXT.md, docs/specs/2026-11-09-website-redesign.md and the Site Mode material in docs/design-system/README.md.
Precondition: the demo clean-up must have landed. Confirm src/components/marketing/demo-ribbon.tsx exists and rg "bg-cl-slot|\[CONFIRM|\[PILOT CHAMBER" src/components/marketing returns nothing. If not, stop and tell the user.
Create branch feat/website-redesign from feat/comlinked-brand-and-website. Make the first commit a docs commit containing the spec and the uncommitted CONTEXT.md glossary change.
Both fonts are already loaded in the root layout (--font-source-serif at weight 500, --font-nunito-sans). The product's navy is #133E5E; the site's --color-cl-accent-strong is a different value (#1A517A), so a new navy token is needed. This is the first of ten tickets: other tickets rebuild the pages, so several dark bands remain on the pages until then.

Scope
Modify: src/app/globals.css, src/app/marketing-site.css, src/app/(marketing)/layout.tsx, src/components/marketing/marketing-nav.tsx, footer.tsx, demo-ribbon.tsx, sign-in-content.tsx, and home-content.tsx, for-chambers-content.tsx, how-it-works-content.tsx, comdash-content.tsx (removing fade classes only), docs/design-system/README.md, docs/design-system/site-tokens.css.
Create: src/components/marketing/section.tsx, e2e/website-redesign.spec.ts.
Leave untouched: /app product screens, /dashboard, /auth logic and SignInForm, src/middleware.ts.

Approach
Use test-driven-development: write the e2e checks first and watch them fail. Use verification-before-completion before done and requesting-code-review at the end. Project skills: tailwind-v4, nextjs-app-router, testing-e2e, coding-standards.
1. Add a --color-cl-navy token of #133E5E. Within the public site, repoint the night tokens to the navy family and check text contrast.
2. Inside .cl-site, set the display font to Source Serif 4 with a Georgia fallback. All h1 to h3 on public pages use it at weight 500. Labels using font-sans stay Nunito Sans.
3. Create section.tsx with PageHero (the navy band) and Section (paper or white, optional id, scroll margin clearing the top bar) and SectionIntro (heading plus one sentence). Server components. Use PageHero on the sign-in page and remove its decorative rings.
4. Remove the cl-load and cl-rv classes everywhere and their CSS rules. Do not remove cl-in, cl-brk, cl-lost or cl-drw, which hold end states for drawings.
5. Navigation: solid white, sticky, links ordered For chambers, How it works, ComDash; Sign in is a quiet link; Join free is the only filled button, in navy. Keep the phone menu's behaviour.
6. Footer: remove the Join free and Chamber pilot buttons, and keep the line and the link columns.
7. Ribbon: restyle to one thin muted line on paper above the navigation, not sticky, keeping its text and "Try the product" link.
8. Update Site Mode in docs/design-system/README.md: type, navy ground, one navy band per page, only the homepage ring moves, and the new tone line. Add the token to site-tokens.css.

Acceptance criteria
In e2e/website-redesign.spec.ts, for /, /how-it-works, /comdash, /for-chambers and /auth/sign-in: the h1 computed font family includes Source Serif; the navigation stays in view after scrolling while the ribbon does not; the nav order is correct; the footer has no buttons; no sideways scrolling at 360, 390, 1280 and 1440 pixels wide; axe finds no serious or critical violations. Hero text is visible at first paint with reduced motion off.

Code quality is part of done. Check the diff against each point before reporting, and apply them only to code this ticket touches.
Clean: each component has one job and a name that says so. No dead code, commented-out code, unused CSS classes, stray TODOs or console logs. No any, non-null ! or as used to silence an error. "use client" only on the smallest interactive leaf.
Maintainable: one source for each fact. Links come from src/paths.ts, colours and type from tokens instead of raw hex values, validation rules from one zod schema with types from z.infer, and e2e page and viewport lists from one constant. Reuse what is already in src/components/marketing before writing something new.
Scalable: adding a section, question, step or field changes one typed array or one component, with no copied markup or CSS. Sections this ticket builds or rebuilds go in their own files under src/components/marketing/<page>/ when the page file is over about 300 lines, and those new files are in Scope. Client JavaScript and dependencies stay at what this ticket needs.
Limits: extract shared code only for a use that exists now or is named in this prompt. Do not refactor outside Scope; list anything worth fixing in your final report.
Run the coding-standards skill on the diff before requesting review, and report the result and anything you duplicated on purpose.
For this ticket: section.tsx is the only definition of the navy band and section spacing, and --color-cl-navy is defined once, with every navy use reading it. Removing fade classes does not require splitting a page file. e2e/website-redesign.spec.ts keeps its page and viewport lists in one constant for later tickets to extend.

Verification
pnpm lint && pnpm type:check && pnpm test && pnpm build, then pnpm test:e2e. This checkout has no .env, so build with NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co and NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder. Report actual output, including anything skipped.

Guardrails
Conventional Commits. Work on feat/website-redesign and never commit to main. Keep every commit green. Do not push or open a PR unless asked. Add no dependencies. Do not edit docs/mockup. Voice: sentence case, no emoji, no exclamation marks. If something here conflicts with the code, stop and ask.
```
