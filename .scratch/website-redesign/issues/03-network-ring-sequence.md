# 03 — Network Ring sequence

**What to build:** when the homepage Network Ring comes into view, it plays one short sequence: the Company appears at the centre, its Matches arrive, and thin lines draw to connect them. Then it stays still. The headline and buttons never wait for it, and anyone who can't or shouldn't see the animation gets the finished drawing.

**Blocked by:** 02 — Homepage hero with the Network Ring

**Status:** folded into ../fast-track/session-1-homepage.md. Don't run this ticket on its own; its detail still applies.

- [ ] The sequence takes about 1.2 seconds, with each piece about 260ms and no bounce
- [ ] It plays once per page load and then stops
- [ ] On a phone it starts when the ring comes into view
- [ ] The headline and buttons are unaffected and the layout doesn't shift
- [ ] The website does not load the product's animation library
- [ ] Meets the code quality points in its prompt, with the result reported

## Happy paths

- A laptop visitor opens the homepage and watches the ring assemble once.
- A phone visitor scrolls to the ring and watches it assemble once.

## Sad paths

- Reduced motion: the finished drawing shows with no animation.
- JavaScript off, or the script fails: the finished drawing shows.
- The browser can't observe visibility: the finished drawing shows.
- The visitor never scrolls to the ring: the sequence doesn't play and nothing depends on it.
- The visitor returns to the homepage from another page without a full load: the finished drawing shows.
- Scrolling away and back: it doesn't replay.

## Executer prompt

```
Goal
Add one short, one-time load sequence to the homepage Network Ring, where the finished drawing is always the fallback.

Context
Repo: /Users/rafaeliiiprudente/Documents/coding projects/Comlinked. Branch: feat/website-redesign. Read first: CLAUDE.md, AGENTS.md, and docs/specs/2026-11-09-website-redesign.md (Network Ring in the hero, Happy and sad paths).
The ring exists as a server component, src/components/marketing/hero-network-ring.tsx, with data attributes on its centre, Matches and lines. The site uses a strict per-request nonce CSP: src/middleware.ts sets the x-nonce request header, and the root layout renders dynamically.
Design constraint: painting the finished ring and then hiding it after hydration would flash. So arm the animation before first paint with a very small nonced inline script placed immediately after the ring's markup in the server-rendered HTML. It is not a React client component. If the nonce is missing, render no script, and the finished drawing stays. On client-side navigation React does not run inline scripts, so the finished drawing shows; that is the intended result of "once per page load".

Scope
Modify: src/components/marketing/hero-network-ring.tsx, src/app/marketing-site.css, e2e/website-redesign.spec.ts.
Leave untouched: everything else. Do not add or import the motion library on the website.

Approach
Use test-driven-development: write the e2e checks first. Use systematic-debugging for failures, verification-before-completion and requesting-code-review. Project skills: nextjs-app-router, testing-e2e, coding-standards.
1. CSS: define keyframes under an armed state only. The centre fades in from 0ms, the Matches fade in staggered through about 700ms, and the lines draw through about 1200ms. Each piece takes about 260ms and uses the site's ease-out, with no bounce. Animate opacity and stroke offset only.
2. Default markup and CSS with no armed state show the finished drawing.
3. Inline script: exit unless prefers-reduced-motion is off and IntersectionObserver exists. Set the armed state on the ring. Observe the ring, and on first intersection set the playing state and disconnect.
4. Read the nonce from headers() in the server component and pass it to the script tag. Keep the script under about 400 characters.
5. Add prefers-reduced-motion CSS that keeps everything in the finished state regardless of state attributes.

Acceptance criteria
With motion allowed at 1440x900: the headline is visible immediately, and all ring parts are at full opacity within 2 seconds. At 390x844: a Match is at opacity 0 before the ring is scrolled into view, and at full opacity within 2 seconds after. With reducedMotion set to reduce, and with JavaScript disabled: all ring parts are at full opacity on load. The headline's bounding box doesn't change during the sequence. Scrolling away and back does not hide the ring. The page logs no CSP violation in the console. axe passes.

Code quality is part of done. Check the diff against each point before reporting, and apply them only to code this ticket touches.
Clean: each component has one job and a name that says so. No dead code, commented-out code, unused CSS classes, stray TODOs or console logs. No any, non-null ! or as used to silence an error. "use client" only on the smallest interactive leaf.
Maintainable: one source for each fact. Links come from src/paths.ts, colours and type from tokens instead of raw hex values, validation rules from one zod schema with types from z.infer, and e2e page and viewport lists from one constant. Reuse what is already in src/components/marketing before writing something new.
Scalable: adding a section, question, step or field changes one typed array or one component, with no copied markup or CSS. Sections this ticket builds or rebuilds go in their own files under src/components/marketing/<page>/ when the page file is over about 300 lines, and those new files are in Scope. Client JavaScript and dependencies stay at what this ticket needs.
Limits: extract shared code only for a use that exists now or is named in this prompt. Do not refactor outside Scope; list anything worth fixing in your final report.
Run the coding-standards skill on the diff before requesting review, and report the result and anything you duplicated on purpose.
For this ticket: duration, stagger and easing are CSS custom properties defined once, not numbers repeated across keyframes. The inline script is one named constant with a comment explaining why it is not a client component.

Verification
pnpm lint && pnpm type:check && pnpm test && pnpm build, then pnpm test:e2e, using NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co and NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder. Report actual output, including anything skipped.

Guardrails
Conventional Commits. Work on feat/website-redesign and never commit to main. Keep every commit green. Do not push or open a PR unless asked. Never add unsafe-inline or unsafe-eval to script-src. Add no dependencies. If something here conflicts with the code, stop and ask.
```
