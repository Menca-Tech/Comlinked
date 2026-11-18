# 04 — Stops 1, 2 and 6: the Member List, ECCP's message and the ask

**What to build:** three Stops of the Pilot Preview get the screens a Chamber Leader needs to see. In Stop 1 the Member List is company names and websites only, and the import ends with claim links ready for ECCP to send, not sent. Stop 2 opens on the message a member receives from ECCP, and its button leads into the Claim. Stop 6 states what a pilot asks of ECCP in two items and offers one button that opens an email to Richard. The website's "Request a pilot" form now leads to the Pilot Preview's Opening.

**Spec:** `docs/specs/2026-11-17-pilot-preview.md`, sections "The claim message", "The Community Manager's import", "Opening and the ask" (the ask) and "Presenter Guide and website" (the website). User stories 5 to 12, 25, 26, 40 to 43, 48, 60, 61, 72, 73 and 94.

**Blocked by:** 03 — Walk the Pilot Preview end to end, with the later items hidden. The user must have reviewed and committed it.

**Status:** built and committed on 2026-11-17. See "Outcome" at the end.

- [x] The Member List previews as each Company's name and website, and nothing else
- [x] The import builds 100 profiles and ends with "100 profiles built. 100 claim links ready for ECCP to send.", and nothing says a link was sent
- [x] Stop 2 opens on the message from ECCP to Ana Reyes, marked as example wording, and its button opens the first claim screen
- [x] Stop 6 shows the two asks, what ComLinked does, what members get, that the pilot is free, and a button that opens an email to the presenter with the subject filled in
- [x] With no presenter address set, Stop 6 shows no button and says to reply to whoever sent the link
- [x] "Explore on your own" opens the member's side on Day 14 with a one-line way back into the Preview
- [x] The website's "Request a pilot" form opens the Pilot Preview's Opening
- [x] Meets the code quality points in its prompt, with the result reported

## Happy paths

- Stop 1 opens with the import finished: "100 profiles built. 100 claim links ready for ECCP to send."
- "Run the import again": the Member List shows 100 rows of name and website. "Build profiles" runs the count to 100 in a few seconds and shows the same result.
- A built profile opens as a draft, and its status reads that the claim link is ready for ECCP to send.
- Stop 2 opens on a message from "ECCP Membership" to "Ana Reyes, Kalayaan Foods Inc." with the subject "Your company profile on ComLinked is ready".
- The message says 3 ECCP members already match, and that other members see the description only after it has been checked. Under it: "Example wording. ECCP approves the real message."
- "Claim your profile" in the message opens "Your company is already here", and the Claim then ends on three Matches with Nordhavn Freight Forwarders among them.
- Next from the message, without claiming, opens Stop 3 as before.
- Stop 6 lists the two asks, the three things ComLinked does, the four member benefits, and "The pilot is free for ECCP and its members."
- "Email Richard" is a link that opens a new message to the presenter's address with the subject "ECCP pilot on ComLinked". The address also shows as text.
- "Explore on your own" opens ComDash on Day 14. A single line across the top leads back, and returns to Stop 6.
- On the website, a valid "Request a pilot" form shows a note that nothing was sent, then opens the Opening.

## Sad paths

- No presenter address is set: Stop 6 shows no email button and says "Reply to the person who sent you this link."
- A presenter address that is not an email address fails the build with a clear message, as other settings do.
- "Cancel" during the Member List preview returns to the finished result.
- Opening the full Demo's claim address shows the first claim screen directly, with no message.
- The message with fewer than three Matches leaves out the line about matches.
- The AI Assistant is off: the Claim and the first message still work.
- While exploring, the later items stay hidden and the Presenter Guide's button stays away.
- On a 360 pixel phone the message, the 100-row list and the ask have no sideways scrolling, and the email address wraps.
- Keyboard only: the message's button, the import's buttons and the email link are reachable with visible focus.
- The website form with blank or invalid fields behaves as before and does not open the Preview.

## Executer prompt

```
Goal
Give three Stops of the Pilot Preview their real screens: Stop 1's import of a Member List that holds only names and websites and ends with claim links ready for ECCP to send; Stop 2's opening on the message a member receives from ECCP; and Stop 6's ask, with a button that opens an email to the presenter. Point the website's "Request a pilot" form at the Pilot Preview's Opening.

Context
Repo: /Users/rafaeliiiprudente/Documents/coding projects/Comlinked. Branch: feat/website-redesign-pages. Stay on it and create no new branch.
Read first, in this order: CLAUDE.md, AGENTS.md, CONTEXT.md (Member List, Chamber Contact, Community Manager, Claim, Pre-built Profile, and the section "Showing ComLinked"), docs/adr/0010-client-side-product-simulation.md, then docs/specs/2026-11-17-pilot-preview.md. In the spec, "The claim message", "The Community Manager's import", "Opening and the ask" and "Presenter Guide and website" are your brief. The happy and sad paths are in .scratch/pilot-preview/issues/04-member-list-message-and-the-ask.md.
Who this is for: ECCP's Chamber Leader, meeting ComLinked cold. Their first questions are what is in the member list, who contacts their members, and what goes out under the chamber's name. These three screens are the answers, so their wording matters more than their decoration.
How the product runs: everything under /app is a browser-held simulation behind the service seam src/services/comlinked (ADR 0010). Screens are client components that read state with useSimulation and change it through act. A full page load resets the simulation, so move between /app routes with next/link or router.push.
What ticket 03 left you: src/services/comlinked/preview.ts declares the Opening and six Stops; one seam action opens a Stop in its prepared state; a Story Bar and a top bar per Seat; a plain closing screen for Stop 6 at /app/preview/ask; the later items hidden in the Preview. chamber.ts holds the chamber's short name, full name, sender name and the presenter's first name. Find these by reading the code before you plan.
What exists today:
- The member import is a card inside src/components/product/screens/chamber.tsx. Its preview lists 12 sample rows with a source column, it builds one profile every 260 milliseconds, and it ends "N profiles built. N claim links sent." A built profile opens as a draft whose status reads "Claim link sent".
- The Claim starts on "Your company is already here", in screens/claim.tsx.
- src/components/marketing/pilot-form.tsx checks the form, shows "This is a demo, so nothing was sent. Opening the chamber tools." and opens the chamber tools.
- The four member benefits are a list inside src/components/marketing/for-chambers/members-section.tsx.
- Environment variables are declared and validated in src/env.ts, with examples in .env.example.
Decided by the user, do not change: ECCP sends the claim links from its own address, so the Demo never says ComLinked sent one. The Member List holds no contact details. The message is example wording that ECCP approves. The ask is a link that opens the visitor's own mail app; the Demo sends and stores nothing. The presenter's address is a deployment setting and is never written into the repository.
Precondition: the user has committed ticket 03. Run git status. If anything under src/ or e2e/ is modified, stop and tell the user. Untracked files under .scratch/ are expected.

Scope
Modify:
- src/services/comlinked/types.ts, simulation.ts, simulation.test.ts, preview.ts and chamber.ts.
- src/components/product/screens/chamber.tsx: remove the import card from it and mount the new component in the same spot. Change nothing else there, because ticket 05 rebuilds the rest.
- src/components/product/screens/claim.tsx: show the message before the first claim screen on Stop 2.
- src/components/product/story-bar.tsx: the one-line form used while exploring.
- src/app/app/preview/ask/page.tsx.
- src/components/marketing/pilot-form.tsx and src/components/marketing/for-chambers/members-section.tsx.
- src/env.ts, src/env.test.ts, .env.example and playwright.config.ts: the presenter's address.
- src/app/app/product.css.
- e2e/pilot-preview.spec.ts, and e2e/website-redesign.spec.ts only for the pilot form's destination.
Create:
- src/components/product/chamber/member-import.tsx.
- src/components/product/screens/claim-message.tsx and preview-ask.tsx.
- A small module for the four member benefits, read by both the For Chambers page and the ask.
Delete: src/components/product/screens/preview-closing.tsx, once the ask replaces it.
Leave untouched: the rest of the chamber screen, the other claim screens, ComDash, Kalayaan's story, the Presenter Guide, every other website page and its wording, /auth, /dashboard, src/middleware.ts, CONTEXT.md and docs/mockup.

Approach
Use test-driven-development: write the Vitest cases at the service seam first, then the Playwright checks. Use systematic-debugging for failures, verification-before-completion before you report, and requesting-code-review once at the end. Project skills: nextjs-app-router, tailwind-v4, forms-validation, testing-unit, testing-e2e, coding-standards, no-ai-design-slop.
Step 1, the Member List and the import. Move the import into member-import.tsx. The list is all 100 Companies, each as its name and website and nothing else. Before any import it reads: "Upload the Member List: company names and websites. We build each company's profile and prepare a claim link for ECCP to send.", and keeps a note that the Demo always uses a sample list. The buttons are "Choose sample file", then "Build profiles" and "Cancel", then "Run the import again". The build counts to the full number in about four seconds in total. The result reads "100 profiles built. 100 claim links ready for ECCP to send.", with the numbers computed. A built profile still opens as a draft, and its status reads "Claim link ready for ECCP to send". Stop 1 opens with the import finished.
Step 2, the message. On Stop 2 the claim route first shows claim-message.tsx, laid out as one message in an inbox:
- From: the sender name from chamber.ts. To: the representative and Company from the simulation, "Ana Reyes, Kalayaan Foods Inc.". Subject: "Your company profile on ComLinked is ready".
- Body: "Dear Ana," then "ECCP is piloting ComLinked, a network where member companies find leads among each other. It is free for members." then "A profile for Kalayaan Foods Inc. has been drafted from your website. 3 ECCP members already match what you offer." then the button "Claim your profile", then "Other members see your description only after you have checked it."
- The count of matches is computed, and that sentence is left out when fewer than three Matches exist. Names come from the simulation and chamber.ts.
- Under the message: "Example wording. ECCP approves the real message."
The button opens the existing first claim screen. Outside Stop 2 the claim route opens that screen directly, as today.
Step 3, the presenter's address. Add NEXT_PUBLIC_PREVIEW_PRESENTER_EMAIL to src/env.ts as an optional, validated email address, with a commented example in .env.example that uses a reserved example domain. Expose the presenter's contact through chamber.ts as the first name plus the address, or nothing when no address is set. Set a reserved example address in playwright.config.ts so the browser tests see the button.
Step 4, the ask. preview-ask.tsx replaces the closing screen on Stop 6:
- Title: "What a pilot asks of ECCP".
- "ECCP gives two things": "Your Member List. Company names and websites only." and "One contact. They send each member its claim link from ECCP's own address."
- "ComLinked does the rest": builds each company's profile; supplies the community manager; makes introductions so no member goes without a lead.
- "What your members get": the four benefits, read from the same module as the For Chambers page.
- "The pilot is free for ECCP and its members."
- A link styled as the main button, "Email Richard", using the first name from chamber.ts. It is a mailto link to the presenter's address with the subject "ECCP pilot on ComLinked", correctly encoded. The address also shows as selectable text. With no address set, show neither, and the line "Reply to the person who sent you this link."
- "Explore on your own".
Step 5, exploring. "Explore on your own" opens the ComDash Overview in the two-weeks state, still inside the Pilot Preview and with the later items still hidden. The Story Bar shrinks to one line that names the Pilot Preview and links back to Stop 6.
Step 6, the website. After a valid "Request a pilot" form, show "This is a demo, so nothing was sent. Opening a preview of a pilot." and open the Pilot Preview's Opening. Change nothing else on the website.
Step 7, check 360, 390, 1280 and 1440 pixel widths, run coding-standards on the diff, then requesting-code-review, then Verification.

Acceptance criteria
Vitest covers:
- the Member List holds 100 rows, each with only a name and a website
- the import's result uses computed counts and never the word "sent"
- Stop 1 opens with the import finished, and running it again ends in the same result
- Stop 2 opens on the message; the message's match count follows the Matches, and the sentence goes when there are fewer than three
- the presenter's contact is nothing when no address is set, and the mailto link is correctly encoded when one is
- an invalid address fails environment validation with a message naming the variable
- exploring keeps the Preview and the hidden items, and its way back opens Stop 6
- the existing repeat-run determinism check still passes
Playwright covers each happy and sad path in the ticket file that a browser can show, plus:
- no sideways scroll on Stops 1, 2 and 6 at 360, 390, 1280 and 1440 pixels
- axe with no serious or critical violations on the message, the Member List preview and the ask
- keyboard use and reduced motion
Every existing unit, component, product and website test passes, changed only for the pilot form's destination, and each change is listed in your report.
Code quality is part of done. Check the diff against each point, and apply them only to code this session touches.
- Clean: each component has one job and a name that says so. No dead code, commented-out code, unused CSS or stray logs. preview-closing.tsx is deleted. No any, non-null ! or as used to silence an error. "use client" only on interactive leaves.
- Maintainable: one source for each fact. The chamber's name, the sender and the presenter's first name come from chamber.ts. The presenter's address comes from src/env.ts and nowhere else. The four benefits live in one module. Counts are computed. Addresses come from src/paths.ts, colours from App Mode tokens, and styles from product.css.
- Scalable: renaming the chamber or the presenter changes one file, and every sentence on these screens follows. The import handles any number of Companies.
- Limits: extract shared code only for a use that exists now. Do not redesign the chamber screen or reword the website. List anything worth fixing in your report.
Report the coding-standards result.

Verification
After each step: pnpm lint && pnpm type:check && pnpm test.
At the end: pnpm lint && pnpm type:check && pnpm test && pnpm build, then pnpm test:e2e.
Use NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co and NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder.
Port 3000 on this machine is often used by a different project, and Playwright reuses whatever answers there. Check what is on port 3000 first. If it is not ComLinked, run PLAYWRIGHT_PORT=3111 pnpm test:e2e. Never stop a server you did not start. A build clashes with a ComLinked dev server using the same .next folder; if one is running, ask the user to stop it.
Report actual output, including anything skipped.

Guardrails
- Do not commit. Do not run git add, git commit or /ship unless the user asks in this session.
- Leave all work uncommitted on feat/website-redesign-pages. Do not switch or create branches, push, merge or open a PR.
- End your report with the changed files grouped by step, each group with a suggested Conventional Commit message.
- Add no dependencies, and no service that sends email.
- Never write a real person's email address into the repository, a test or an example file. Use a reserved example domain.
- Never say a claim link was sent, and never say ECCP has joined, agreed or endorsed anything. ECCP appears as text only, never a logo.
- Keep the "Example data" tag on every screen.
- Voice: sentence case, no emoji, no exclamation marks.
- Do not edit docs/mockup or CONTEXT.md.
- If something here conflicts with the code or the spec, stop and ask.
```

## Outcome

Built on 2026-11-17 and committed on `feat/website-redesign-pages` once everything was green, as the user chose for these tickets. The user sent ticket 03's path with `/implement`. Ticket 03 was already built and committed, so that was read as this ticket, the next one, and said so before any work began.

**Checks run on the final code**

- Lint, type check and 305 unit tests pass (5 database tests are skipped, as before). 24 of them are new.
- The production build passes. It ran in a scratch copy, because a ComLinked dev server was running on port 3001 from this folder. A build with a presenter address that is not an email address fails and names the setting.
- Browser tests: 258 in all, and all 258 passed in one run. 30 are new, in `e2e/pilot-preview.spec.ts`. They ran against a dev server started from the scratch copy on port 3111, with the presenter's example address set.
- The screen with no presenter address was checked by hand on the port 3001 server, which has no address set. It shows "Reply to the person who sent you this link." and no email button. No automated browser test covers it, because one server cannot show both.
- Two earlier full runs each had one or two failures that were not the product's: a new test of mine that read styles from rows the build had already removed (rewritten), and tests timing out while another tool was loading the machine.

**Choices made that this ticket did not spell out**

- On the ask, "What your members get" lists the four benefits by title only. The first benefit's text on the website says ComLinked sends the claim link, which the ask must not say, and the website's wording is not to change.
- Exploring starts when the viewer leaves the ask for any other screen, not only by "Explore on your own". The Story Bar's one line reads "Pilot Preview · exploring" with the button "Back to stop 6". The member's own top bar and bottom tabs show, and the screen opens at its top.
- A Member List row carries the Company's id beside its name and website. The id is never shown; a built profile opens by it.
- The Member List shows each name with its website under it, in a box that scrolls, with "Build profiles" and "Cancel" above it.
- The build takes four seconds whatever the list's length.
- A drafted profile's claim status reads "Claimed" once the Company has claimed, and "Claim link ready for ECCP to send" until then. Its source line is the Company's website.
- The message's main heading is its subject. The count in it is the number of Matches the Claim shows.
- In the browser, the AI Assistant can only be switched off after the Claim, because its switch is on the Profile tab. The Claim with it off is covered at the service seam.

**Changed outside this ticket's file list**

- `src/components/product/product-bars.tsx`: the bar now follows `currentSeat()`, so the member's bar shows while exploring.
- `src/components/product/product-shell.tsx`: a defect from ticket 03. "Reset" and "New company" from inside the Pilot Preview claimed Kalayaan Foods before leaving, so the claim screen then opened on ComDash. The shell now enters a screen only when the address changes. The existing browser test for Reset failed on the committed code and passes now.
- `src/components/product/screens/preview-opening.tsx`: one class name, so the Opening and the ask share a list style.
- `e2e/product-smoke.spec.ts`: the import button's new label, "Build profiles".
- `e2e/website-redesign.spec.ts`: two tests follow the pilot form's new destination.

**Facts for later tickets**

- The seam: `memberList()`, `importResult()`, `claimMessage()`, `act.claimOpen()`, `exploring()`, `currentSeat()` and `shownRoute(route)` in `simulation.ts`. `PRESENTER` and `presenterContact()` in `chamber.ts`.
- The presenter's address is the setting `NEXT_PUBLIC_PREVIEW_PRESENTER_EMAIL`. With none set on the deployment, Stop 6 has no email button. `playwright.config.ts` sets an example one, so a dev server that Playwright reuses must have it too, or the "Email Richard" tests fail.
- The four member benefits are in `src/lib/member-benefits.ts`.
- The import is `src/components/product/chamber/member-import.tsx`. Its sections carry the class `mi`.
- For ticket 05: the chamber screen's `showsTools` can read `currentSeat()`. The draft view already tells claimed from not yet claimed.
- For ticket 06's Run of Show: Stop 1's button is "Build profiles", Stop 2 opens on the message, and the way back from exploring is "Back to stop 6".

**Left for later**

- The first claim screen still says "3 companies are already a match" and "Your first three matches" as fixed text.
- The AI Lead Agent preview and the Team Dashboard still say a claim email or reminder was "sent". They are hidden in the Pilot Preview unless the presenter switches them on.
- The website's first member benefit and its "How it works" step still say ComLinked sends the claim link. That waits for Richard's answer on who sends them.
- Some existing tests use invented addresses on domains that are not reserved, such as `maria@kalayaanfoods.com`. Ticket 06's name check should cover them.
- On Stop 1 the import sits under the list of 12 members until ticket 05 puts the tools first.
- `chamber.ts` now reads the environment, which brings the validation library into the product's client code.
- The new browser tests locate some elements by class, as the file already did.
