# 02 — Homepage hero with the Network Ring

**What to build:** the homepage opens on one navy hero that makes the promise of first leads within 24 hours and offers two paths, one for companies and one for chambers. Beside it on a laptop, and below the buttons on a phone, a finished drawing of the Network Ring shows a Company at the centre with its first-day Matches, marked as an example.

**Blocked by:** 01 — Quiet authority foundation

**Status:** folded into ../fast-track/session-1-homepage.md. Don't run this ticket on its own; its detail still applies.

- [ ] The hero has the promise, one line of support and two buttons
- [ ] "Join ComLinked free" reaches the Join form and "Bring ComLinked to your chamber" reaches the For chambers page
- [ ] The logo blue accent appears only in this headline across the site
- [ ] The Network Ring replaces the decorative logo rings in the hero
- [ ] On a phone the headline and both buttons fit the first screen, with the ring below
- [ ] The ring is marked as an example and has a text alternative
- [ ] The "Your first day" card sits directly below the hero
- [ ] Meets the code quality points in its prompt, with the result reported

## Happy paths

- A laptop visitor sees the promise, both paths and the full ring together.
- A phone visitor sees the promise and stacked buttons, then the simplified ring on scrolling.
- Each button reaches its destination.

## Sad paths

- A 360 pixel wide phone or 200% zoom: labels stay readable with no sideways scrolling.
- A long Company name: it doesn't collide with another label.
- JavaScript off: the finished ring and all text are visible.
- A screen reader: the drawing is described in one text alternative and its parts aren't read one by one.

## Executer prompt

```
Goal
Replace the homepage hero with one navy hero carrying the promise, two paths and a finished, static Network Ring drawing that works on laptops and phones.

Context
Repo: /Users/rafaeliiiprudente/Documents/coding projects/Comlinked. Branch: feat/website-redesign. Read first: CLAUDE.md, AGENTS.md, CONTEXT.md, and docs/specs/2026-11-09-website-redesign.md (Homepage, Visuals, and Network Ring in the hero).
In the glossary, a Network Ring has one Company at the centre with its Connections and today's Leads around it by Connection Degree. It is distinct from the logo ring, a brand mark. The product's own Network Ring in src/components/product/network-ring.tsx depends on the simulation and the motion library; do not reuse it, because the website stays light. This ticket builds the finished drawing only. The sequence is ticket 03.
Keep the headline wording "Your first business leads within 24 hours." with "within 24 hours." in logo blue. Example companies: Kalayaan Foods at the centre; Maple Bay Grocers, Pacific Pack Solutions and Northline Logistics as the three Matches; Luntian Foods and one or two more as Connections.

Scope
Modify: src/components/marketing/home-content.tsx (hero only, and move the "Your first day" card to directly below it unchanged), src/app/marketing-site.css, src/paths.ts only if a path is missing, e2e/website-redesign.spec.ts.
Create: src/components/marketing/hero-network-ring.tsx.
Leave untouched: the other homepage sections, other pages, and /app.

Approach
Use test-driven-development: write the e2e checks first. Use verification-before-completion and requesting-code-review. Project skills: nextjs-app-router, tailwind-v4, testing-e2e, no-ai-design-slop.
1. Use PageHero from section.tsx. Content: headline, one line of support, then "Join ComLinked free" linking to paths.marketing.join and "Bring ComLinked to your chamber" linking to paths.marketing.forChambers. The primary button has a light fill because navy can't be seen on navy. Remove the three-item tick list and "See how it works" from the hero.
2. Build hero-network-ring.tsx as a server component using inline SVG and HTML, with no client code. Give each centre, Match and line a stable data attribute for ticket 03. Laptop: centre, three Matches, a few Connections, full names. Phone: centre and three Matches with short names.
3. Add a visible "Example" tag. Give the drawing role="img" with one aria-label describing it.
4. Lay out two columns on laptops. On phones place text and full-width stacked buttons first, with "Join ComLinked free" on top and the ring below.

Acceptance criteria
At 390x844 the bottom of both buttons is within the viewport on load, below the ribbon and navigation. No sideways scrolling at 360, 390, 1280 and 1440. Both buttons reach their destinations. The ring exposes one accessible name and the "Example" tag is visible. With JavaScript disabled the headline and ring are visible. axe finds no serious or critical violations on /.

Code quality is part of done. Check the diff against each point before reporting, and apply them only to code this ticket touches.
Clean: each component has one job and a name that says so. No dead code, commented-out code, unused CSS classes, stray TODOs or console logs. No any, non-null ! or as used to silence an error. "use client" only on the smallest interactive leaf.
Maintainable: one source for each fact. Links come from src/paths.ts, colours and type from tokens instead of raw hex values, validation rules from one zod schema with types from z.infer, and e2e page and viewport lists from one constant. Reuse what is already in src/components/marketing before writing something new.
Scalable: adding a section, question, step or field changes one typed array or one component, with no copied markup or CSS. Sections this ticket builds or rebuilds go in their own files under src/components/marketing/<page>/ when the page file is over about 300 lines, and those new files are in Scope. Client JavaScript and dependencies stay at what this ticket needs.
Limits: extract shared code only for a use that exists now or is named in this prompt. Do not refactor outside Scope; list anything worth fixing in your final report.
Run the coding-standards skill on the diff before requesting review, and report the result and anything you duplicated on purpose.
For this ticket: the laptop and phone drawings come from one typed array of companies, with a short name and a phone flag, not two copies of the markup. Add one exported ExampleTag to section.tsx, which is in Scope here, because tickets 04, 07 and 09 use the same tag.

Verification
pnpm lint && pnpm type:check && pnpm test && pnpm build, then pnpm test:e2e, using NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co and NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder. Report actual output, including anything skipped.

Guardrails
Conventional Commits. Work on feat/website-redesign and never commit to main. Keep every commit green. Do not push or open a PR unless asked. Add no dependencies. Voice: sentence case, no emoji, no exclamation marks. If something here conflicts with the code, stop and ask.
```
