# 03 — Logo, Profile Strength and the documents

**What to build:** Kalayaan Foods can add its logo. "Add your logo: +10%" joins the profile checklist, and Profile Strength is rebalanced so a complete profile is still 100%. Once added, an invented Kalayaan Foods logo shows large at the top of its profile, in the account menu's header and on the top-right mark. Every other Company shows its initials in the same large spot. Then the documents catch up with tickets 01 to 03:

- the Pilot Preview spec, the ComDash redesign spec and this spec
- the build plan and the SRS
- the glossary
- the status document
- the Run of Show

**Spec:** `docs/specs/2026-11-18-admins-privacy-and-day-1k.md`. Read these sections:

- Implementation Decisions: "Logo and Profile Strength", "Pilot Preview and Run of Show", "Words" and "Documents (after the code is green)"
- Happy and sad paths: the Logo line
- User stories 6, 34–36, 47 and 48
- Testing Decisions: the Logo bullet
- Further Notes, for the questions for Richard

**Blocked by:** 02 — Account menu, roles and privacy. The logo appears in the account menu's header, and the documents describe what 01 and 02 built. Both must be built, verified and committed first.

**Status:** done

- [x] Kalayaan's Pre-built Profile has no logo. The checklist offers "Add your logo: +10%" beside the photo step
- [x] Profile Strength starts at 55% on the day of the Claim. Products add 15, a project 10, a photo 10 and the logo 10, so a complete profile is 100%
- [x] Adding the logo raises Profile Strength by 10 and counts as a profile update, as the photo does
- [x] The two-weeks-in preset has the logo added
- [x] An invented Kalayaan Foods logo (mark and wordmark, an SVG in the repo) shows large at the top of Kalayaan's profile, in the menu header and on the top-right mark
- [x] Every other Company's profile shows its initials mark in the same large spot. No other Company gets a logo
- [x] Every figure and test that depended on the old 65% base is updated deliberately
- [x] The Pilot Preview spec, the ComDash redesign spec and this spec record what 01 to 03 built
- [x] The build plan's C1 reads "an Authorized Representative sends a Connection Request; the other Company's admin accepts". Section 6 gains a row for printing, forwarding and sharing company profiles outside ComLinked
- [x] The plan's adoption notes and the SRS (from OD-17, with a version line) hold the questions for Richard
- [x] CONTEXT.md gains Company Admin, Authorized User, Contact Request, Alias, Chamber Size and Example Companies
- [x] The Run of Show has the new likely question at Stop 4 and its figures at 1,000; the status document and the demo flow map agree with the Demo
- [x] Every change Richard hasn't confirmed is marked as awaiting him
- [x] Meets the code quality points in its prompt, with the result reported

## Happy paths

- Claim as Kalayaan in the full Demo: Profile Strength reads 55%, and the checklist lists "Add your logo: +10%".
- Tap "Add logo": Profile Strength reads 65%. The large spot at the top of the profile shows the Kalayaan Foods logo, and so does the top-right mark. The account menu's header shows it too.
- Add products, a project and a photo as well: Profile Strength reads 100%.
- Two weeks in: the logo is already there, and Profile Strength matches the preset's completed steps.
- Open Nordhavn's profile: its "NF" initials sit in the same large spot at the top.
- The Run of Show's Stop 4 lists "Who in a company can connect, and what do others see?" with what to open and what to say.
- CONTEXT.md, the plan, the SRS and the three specs use the same words for the same things.

## Sad paths

- Before the Claim there is no mark in the top bar, so no logo, as today.
- A Company that hasn't claimed shows its dashed initials mark in the large spot, as the claim-aware mark does elsewhere.
- Adding the logo twice is not possible: the button becomes the done state, as the photo's does.
- Profile Strength never passes 100%.
- The logo has a text alternative ("Kalayaan Foods logo") where it carries meaning, and is hidden from screen readers where the name is already beside it.
- At 360 pixels the large logo spot and the name fit with no sideways scroll; the logo scales down without distortion.
- The logo looks like no real brand, and uses no real food company's colours or shapes on purpose.
- Prettier passes on every changed document. No document claims that Richard agreed to something he hasn't seen.

## Executer prompt

```
Goal
You are the executer for ticket 03 of three. Let Kalayaan Foods add its logo, with Profile Strength rebalanced so a complete profile is still 100%. Show the logo large at the top of its profile, in the account menu's header and on the top-right mark. Give every other profile the same large spot, holding its initials. Then bring the documents in line with what tickets 01 to 03 built. Do the code first and commit it when green. Do the documents after; if time runs out, the code ships and you report which documents are left.

Context
Repo: /Users/rafaeliiiprudente/Documents/coding projects/Comlinked. Branch: feat/website-redesign-pages. Stay on it and create no new branch.
Read first, in this order:
- CLAUDE.md, AGENTS.md
- CONTEXT.md, the whole file
- docs/adr/0010-client-side-product-simulation.md
- docs/design-system/README.md (App Mode)
- the whole of docs/specs/2026-11-18-admins-privacy-and-day-1k.md
- this ticket file, .scratch/admins-privacy/issues/03-logo-and-close-out.md, including its happy and sad paths
- the Outcomes of tickets 01 and 02 in .scratch/admins-privacy/issues/
Why: in the meeting on 2026-11-18, Richard asked for the company logo to be prominent on the profile. The decisions from that meeting must be recorded before the next planning session.
How the product runs: everything under /app is a browser-held simulation behind the Service Seam src/services/comlinked (ADR 0010). Screens are client components; they read state with useSimulation and change it through act. Tests: src/services/comlinked/simulation.test.ts (Vitest), and e2e/*.spec.ts (Playwright plus axe).
What exists today:
- strength() in simulation.ts returns 65, plus 15 for products, 10 for a project and 10 for a photo. The seam returns the percent with the missing steps for the checklist.
- The addPhoto action sets the photo, marks the profile as updated and awards the profile points.
- screens/company.tsx shows the checklist, including "A photo of your work, +10%" and "Add photo", and highlights the next missing step.
- ProfileHead in src/components/product/shared.tsx is the profile's header.
- Mono in shared.tsx is the claim-aware initials mark: own, claimed or dashed.
- The top bar's own-company button, in product-bars.tsx, and the account menu's header from ticket 02 show Mono.
- screens/company-view.tsx is another Company's profile. seedTwoWeeks builds the two-weeks-in preset.
- Images are served from public/assets/.
- Documents to update:
  - docs/specs/2026-11-17-pilot-preview.md
  - docs/specs/2026-11-11-comdash-redesign.md
  - docs/specs/2026-11-18-admins-privacy-and-day-1k.md
  - docs/specs/2026-10-11-mvp-build-plan.md: the C1 row, the Section 6 table, and "Adoption notes", with its "What the plan leaves open" and "Decided since adoption"
  - docs/specs/2026-11-09-comlinked-srs.md: the version table, and the open decisions OD-13 to OD-16
  - docs/specs/2026-11-08-mvp-feature-status.md
  - docs/presentations/2026-11-17-pilot-preview-run-of-show.md
  - docs/presentations/2026-11-18-demo-flow-map.html
  - CONTEXT.md
- Commit 0f44d81 shows how the Pilot Preview's open choices were recorded in the status document, the plan and the SRS. Follow its pattern.
Decided by the user, do not change:
- Only Kalayaan gets a logo, invented, never like a real brand. Other Companies keep initials in the same large spot.
- "Add your logo" is +10%, like the photo, and the base drops from 65 to 55.
- The two-weeks-in preset has the logo.
- Documents are updated in this session after the code is green. Anything Richard hasn't confirmed is marked as awaiting him.
- The words "super admin" are used nowhere.
Precondition: run git status. Tickets 01 and 02 must be committed. Expected: untracked or modified files under .scratch/ and docs/specs; leave them. If anything under src/ or e2e/ is modified, stop and tell the user.

Scope
Modify:
- src/services/comlinked/types.ts, simulation.ts and simulation.test.ts
- src/components/product/shared.tsx (ProfileHead and the mark)
- src/components/product/screens/company.tsx and company-view.tsx
- src/components/product/product-bars.tsx and the account menu component from ticket 02
- src/app/app/product.css, for the logo spot only
- e2e/product-smoke.spec.ts and e2e/a11y.spec.ts
- the documents listed above
Create: the Kalayaan Foods logo as one SVG file under public/assets/.
Leave untouched:
- matching, search, ComDash, the chamber screens and the Pilot Preview Stops
- the people, roles and privacy behaviour from ticket 02
- the website, docs/mockup and docs/design-system
- the SRS .docx: don't regenerate it; say in the Outcome that it lags the .md

Approach
Use test-driven-development for the code: Vitest at the Service Seam first, then the Playwright checks. Use systematic-debugging for failures, verification-before-completion before you report, and requesting-code-review once at the end. Project skills: testing-unit, testing-e2e, tailwind-v4, coding-standards; domain-modeling for the CONTEXT.md entries.
Step 1, the logo at the seam.
- Add a logo flag to Kalayaan's company, false at the Claim, and an action to add it that behaves like addPhoto.
- Rebalance Profile Strength to 55 plus products 15, project 10, photo 10 and logo 10. The logo appears among the missing steps.
- Set the logo in the two-weeks-in preset.
- Vitest checks: 55% at the Claim; +10 for the logo; 100% when complete; the preset has the logo; the missing steps list the logo until it's added.
- Update every test that depended on 65.
- Commit when green.
Step 2, the logo and the large spot.
- Draw the logo as a simple SVG: a mark plus the wordmark "Kalayaan Foods", suited to a Philippine snack and frozen-food maker, in two or three flat colours, readable at 32px. It must not resemble any real brand.
- Make the mark component show the logo for Kalayaan once added, so the top bar and the menu header follow with no screen-level check.
- Give ProfileHead a large logo spot at the top, used by Kalayaan's Company page and by every other Company's profile, showing the logo or the claim-aware initials.
- Add the logo step to the checklist beside the photo step.
- Browser tests for every happy and sad path in this ticket, at 360, 390 and 1280 pixels, with axe on both profiles.
- Commit when green.
Step 3, the documents. Write in the house voice: plain words, sentence case, short sentences. Use the glossary's terms. Mark anything Richard hasn't confirmed.
- docs/specs/2026-11-17-pilot-preview.md: add a short dated note at the top pointing to the new spec. Update its figures and the later items to the Chamber Size and the pricing default.
- docs/specs/2026-11-11-comdash-redesign.md: pricing now starts off in the full Demo.
- docs/specs/2026-11-18-admins-privacy-and-day-1k.md: set its status to built, with a line per ticket.
- The build plan:
  - The C1 wording.
  - The Section 6 row: printing, forwarding and sharing company profiles outside ComLinked, earliest phase after the MVP, because profiles stay within the Chamber Network in the MVP.
  - Under "Decided since adoption", the decisions from the spec, dated 2026-11-18.
  - Under "What the plan leaves open", the five questions for Richard.
- The SRS: a version line, and open decisions from OD-17, one per question for Richard, in the existing table's form.
- CONTEXT.md: the six terms from the spec's "Words", placed in their sections, and a note under Authorized Representative that a Company has admins and authorized users.
- The status document: the Demo's new screens and figures.
- The Run of Show: the likely question at Stop 4 and the figures at 1,000.
- The demo flow map: update it only where it states 100 members or pricing on.
- Run pnpm exec prettier --check on every changed document, and fix what it reports.
- Commit when green, as docs: commits.
Step 4, finish.
- Run the full checks below and requesting-code-review, and fix what it finds.
- Write the Outcome section at the end of this ticket file: checks with real results, the logo's description, choices the ticket didn't spell out, documents left undone if any, and the questions for Richard as recorded.
- Commit it.

Acceptance criteria
Vitest at the Service Seam covers every bullet in step 1, and the existing tests pass with deliberate updates to the old 65% base.
Playwright covers:
- every happy and sad path in this ticket file
- no sideways scroll on both profiles at 360, 390 and 1280 pixels
- axe with no serious or critical violation on Kalayaan's Company page, a connected Company's profile and the menu open
Every existing unit, component, product, Pilot Preview and website test passes. Each changed expectation is a deliberate update, never a weakened check.
Every changed document passes prettier and uses the same terms as CONTEXT.md.
Code quality is part of done. Check the diff against each point, and apply them only to code this session touches:
- Clean: one job per component and function. The logo spot is part of ProfileHead, not a copy in each screen. No dead code or stray logs. Strict types: no any, no non-null assertions, no silencing casts.
- Maintainable: one source for each fact. Profile Strength's weights live in one place, and the checklist reads the seam's missing steps. The mark component alone decides logo or initials. Sizes, radii, spacing and colours come from the named values, with no literals.
- Scalable: giving another Company a logo later is a data change only. Adding a profile step changes one place.
- Limits: no logo upload flow, image cropping, or logos for other Companies. Don't refactor outside Scope.
Run coding-standards on your diff and report the result.

Verification
After each code step: pnpm lint && pnpm type:check && pnpm test && pnpm build, plus the browser tests for that step's screens.
At the end: pnpm lint && pnpm type:check && pnpm test && pnpm build, then the whole of pnpm test:e2e, then pnpm exec prettier --check on every changed document.
Use NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co and NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder.
Port 3000 on this machine is often a different project, and Playwright reuses whatever answers there. Check it first, and if it isn't ComLinked run PLAYWRIGHT_PORT=3111 pnpm test:e2e.
The user may run their own ComLinked dev server on port 3001, which holds .next. If a build in the repo clashes with it, copy the working tree to the scratchpad (without node_modules, .next and .git), symlink node_modules to the repo's, and build there. Don't stop the user's server without asking.
Wrap long browser runs in caffeinate -i. The homepage ring's contrast check is a known flake under load; rerun it alone before treating it as real.
Report actual output, including anything skipped.

Guardrails
- Commit when green, after each step, as Conventional Commits on feat/website-redesign-pages. Never push, merge, open a PR, or switch or create branches.
- Stop after step 4 and report.
- Add no dependencies, hues or dark mode. The logo's colours belong to the logo only, not the Design System.
- No document says Richard or ECCP agreed to anything they haven't seen. Mark open choices as awaiting Richard.
- Never hide a Company's name. Keep the "Example data" tag on every screen. ECCP appears as text only, never a logo.
- Status is text, never colour alone. Never add unsafe-inline or unsafe-eval to script-src.
- Voice: sentence case, no emoji, no exclamation marks.
- Do not edit docs/mockup or docs/design-system.
- Send nothing about this project to an outside service. Never publish the mockup.
- If the code or the spec contradicts this prompt, stop and ask the user.
```

## Outcome

Built on 2026-11-19 on `feat/website-redesign-pages`, in three commits after `22bcf95`:

- `0de9a24` step 1: the logo step and Profile Strength from 55, at the seam
- `1747b10` step 2: the logo on the profile, the mark and the menu, with the large spot on every profile, plus the code review's fixes
- `8d99d31` step 3: the documents

Nothing was pushed.

### Checks run (real results)

- `pnpm lint`: no warnings or errors.
- `pnpm type:check`: clean.
- `pnpm test`: 397 passed, 5 skipped (21 files, 1 skipped).
- `pnpm build`: compiled successfully, in the repo. Port 3000 was another project (aceyourcourse), and nothing held 3001.
- New browser tests (`PLAYWRIGHT_PORT=3111`): 9 passed. That is three tests at each of 360, 390 and 1280 pixels.
- `pnpm test:e2e` in full: 548 passed and 2 failed. Both failures were Pilot Preview checks that expected "KF" on the mark at Stop 4 and in "Explore on your own". Both use the two-weeks seed, which now has the logo. I changed both, on purpose, to expect the logo.
- After the fix and the review's fixes, the Demo specs ran again (product-smoke, pilot-preview, demo-rules and a11y): 415 passed. The website spec isn't touched by this change, and it passed in the full run.
- `pnpm exec prettier --check` passes on every changed document except `docs/presentations/2026-11-18-demo-flow-map.html`. That file already failed the check at HEAD. Running prettier on it reflowed all 1,132 lines, so I reverted that and kept only my three edits.
- Code review: one reviewer, read-only. It found nothing serious, and its low-severity points are below.

### The logo

- **File:** `public/assets/kalayaan-foods-logo.svg`, invented.
- **Design:** a cream rounded square. On it, a rising orange half sun behind two green leaves on a green line. Under that, "KALAYAAN" in a green serif and "FOODS" spaced out in orange.
- **Colours:** three flat colours (#FBF3E4, #3E6B45, #E2873A). They belong to the logo only, not the Design System.
- **Real brands:** it is drawn to look like no real brand.
- **Accessibility:** the SVG carries the title "Kalayaan Foods logo". In the product the mark stays hidden from screen readers, because the name or the button's label is always beside it.

### Code quality, against the prompt's points

- **One source.**
  - `PROFILE_BASE` and `PROFILE_STEPS` in `simulation.ts` hold the weights and the missing-step names.
  - `strength()`, `profileCompleteness()`, `nextProfileStep()` and `stepPoints()` read them. The checklist's "+N%" and its highlighted step come from the seam.
  - A seam test checks that the base and the steps add up to 100.
- **The mark alone decides.** `Mono` shows `c.logo` when present and keeps its claim class. The top bar and the menu header follow with no screen-level check. `ProfileHead` holds the large spot (`xl`) for both profiles.
- **Scalable.**
  - Another Company's logo is a data change: an optional `logo` on `Company`, which `publicView` passes on.
  - A new profile step is one entry in `PROFILE_STEPS`, plus its row in the checklist.
- **Clean.** No `any`, no non-null assertions and no casts were added. The review's first fix used a cast, and I replaced it with a typed fallback.
- **CSS.** It uses named tokens. The large spot is `calc(var(--space-12) * 2)` (96px), because no 96px token exists.
- **Limits.** There is no upload flow, no cropping, and no logo for any other Company.
- **coding-standards.** Checked through the review against the ticket's points. No violations remain.

### Choices the ticket didn't spell out

- **Checklist wording.** The row reads "Your logo, +10%" with an "Add logo" button and an "Added" done state, to match the photo's row. The ticket's "Add your logo: +10%" reads as shorthand. The missing-step name is "your logo".
- **The large spot.**
  - It is a 96px square above the name on every profile. The name, the line under it and the tail (Verified, or the fit mark) sit in a row under it.
  - The phone top-bar size rule now targets the mark inside the account button, so the logo gets the same size as the initials did.
- **Two weeks in reads 90%.** That is 55 + products 15 + project 10 + logo 10, with the photo still missing. So the existing "90%" and "Add photo" checks still hold.
- **Plan numbering.** The plan's new adoption notes are items 21 to 25 (decided 2026-11-18, under "Decided since adoption") and 26 to 30 (the five questions, under "What the plan leaves open"). Each block is dated. The numbers don't run in order down the page, because items 17 to 20 already sit last.
- **Documents.**
  - The Pilot Preview spec got a dated note with the figures at 1,000, and its key tables and figures were updated. Older prose that says "100" for the named Example Companies was left alone.
  - The SRS `.docx` was not regenerated. It lags the `.md` (0.4).

### Review points not fixed

- **The network ring.** Its centre (`network-ring.tsx`) builds its own initials mark, so two weeks in it shows "KF" while the top bar shows the logo. The file is outside Scope. The follow-up is to render `Mono` there.
- **The small wordmark.** It can't be read at the 36 to 44px top-bar size. The sun and leaves still read. Should the small mark drop the wordmark, or is this fine?

### Questions for Richard, as recorded

These are in the plan's items 26 to 30 and the SRS's OD-17 to OD-21. All await Richard:

1. How many people may a Company have, and is any of that paid later?
2. Are the two admins equal, as built?
3. Only the person shares their own contact details; is that right?
4. Names and titles show to connections by default, and contacts only on request; is that the right default?
5. 1,000 members shown with 100 named examples; is that acceptable for ECCP?

The Run of Show's new Stop 4 answer and its 1,000 line are marked "Richard to confirm".
