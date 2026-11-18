# 06 — Homepage review with Richard

**What to build:** the foundation and homepage are looked at on a laptop and a phone by the team, including Richard, and the direction is accepted or changed before the other three pages are built. An agent can prepare the review; people make the decision.

**Blocked by:** 02 — Homepage hero with the Network Ring; 03 — Network Ring sequence; 04 — Homepage sections below the hero; 05 — Validated Join form

**Status:** moved to the end of ../fast-track/session-2-pages-and-final-check.md. Don't run this ticket on its own; its detail still applies.

- [ ] The homepage is reviewed on a real laptop and a real phone
- [ ] Richard has seen it
- [ ] The direction is recorded as accepted, or the changes are listed
- [ ] Headline and chamber button wording is approved or corrected
- [ ] Code quality findings in the pack are fixed or accepted before tickets 07 to 09 start

## Happy paths

- The direction is accepted, and tickets 07, 08 and 09 can begin.

## Sad paths

- The direction needs changes: they are listed, new tickets are raised, and tickets 07 to 09 wait.
- Richard isn't available: the tickets stay blocked unless the user decides otherwise.
- The review pack can't be produced because checks fail: the failure is reported and nothing is shown as ready.

## Executer prompt

```
Goal
Prepare a review pack so the user and Richard can judge the redesigned foundation and homepage on a laptop and a phone. Do not make the decision and do not change product code.

Context
Repo: /Users/rafaeliiiprudente/Documents/coding projects/Comlinked. Branch: feat/website-redesign. Read first: CLAUDE.md and docs/specs/2026-11-09-website-redesign.md.
Tickets 01 to 05 must be complete. The feel being judged is "quiet authority": calm, spacious, confident type, little movement, one strong visual per page. Richard approves the page headlines and the chamber button wording. The review pack stays on this machine and is not published anywhere.

Scope
Create: .scratch/website-redesign/review/homepage-review.md and screenshots in the same folder.
Leave untouched: all source code. If a check fails, report it and stop.

Approach
Use verification-before-completion. Project skills: testing-e2e.
1. Run the full verification below.
2. With pnpm start and placeholder Supabase env, capture screenshots of / at 1440x900, 1280x720, 390x844 and 360x740: the top of the page and each section. Also capture the ring mid-sequence and finished.
3. Write homepage-review.md with: how to open the site locally and from a phone on the same network; the demo path from the homepage into /app/claim; a checklist of what to judge (does it feel calm and established, do the serif headlines read well, is the promise clear to a Chamber Leader and a company owner, does the ring sequence feel right, does the step into the claim flow feel continuous); the exact homepage headline and "Bring ComLinked to your chamber" wording for Richard to approve; the open items (Verified badge, first real chamber, demo date); and a blank decision section with Accepted, Changes needed, Reviewers and Date.
4. Tell the user the pack is ready and that tickets 07 to 09 remain blocked until the decision is recorded.

Acceptance criteria
The review file exists with every item above, screenshots are present for all four sizes, and all checks have been run and reported honestly. The decision section is left blank.

Code quality check: run the coding-standards skill on the branch diff against feat/comlinked-brand-and-website, and judge it for clean code (one job per component, no dead code), maintainability (one source for paths, tokens, validation rules and repeated content) and scalability (adding a section or field changes one place). Add the findings to a Code quality section of homepage-review.md. Do not fix them: tickets 07 to 09 will copy these patterns, so the user decides what is fixed first.

Verification
pnpm lint && pnpm type:check && pnpm test && pnpm build, then pnpm test:e2e, using NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co and NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder.

Guardrails
Make no code changes. Do not commit the review pack unless asked. Do not push, publish or send anything to Richard or anyone else; the user shares it. Never commit to main. Do not fill in the decision.
```
