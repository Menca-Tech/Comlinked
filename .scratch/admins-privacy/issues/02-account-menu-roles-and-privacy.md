# 02 — Account menu, roles and privacy

**What to build:** Kalayaan Foods has four people with roles instead of one Authorized Representative:

- Ana Reyes, Owner, the primary admin
- Marco Dizon, the backup admin
- an invented sales user and an invented procurement user, each an Authorized User

The company mark at the top right opens a LinkedIn-style account menu. From it, Ana reaches two pages:

- **Admins and authorized users:** the people, their roles, a line saying what each can do, and Make primary / Remove.
- **Privacy and contact details:** her alias and title settings, a preview of how connected Companies see her, and a waiting Contact Request from Nordhavn to share or decline.

On the profile of a Company Kalayaan is connected to, a People section lists that Company's people with "Ask for contact details". The seam decides who sees which people and details. Nothing is stored or sent.

**Spec:** `docs/specs/2026-11-18-admins-privacy-and-day-1k.md`. Read these sections:

- Implementation Decisions: "People of a Company", "Roles and what each can do", "Account menu", "Admins and authorized users page", "Privacy and contact details page", "What a Company may see of another", "Contact Requests" and "Phone and access"
- Happy and sad paths: the Roles, Privacy and Asking lines and their sad paths
- User stories 15–33, 37–46, 49 and 50
- Testing Decisions: the Roles, Visibility and Contact Requests bullets

**Blocked by:** 01 — Pricing off and a chamber of 1,000. It must be built, verified and committed first, because both tickets change the same simulation and test files.

**Status:** done (2026-11-19)

- [x] Kalayaan has four people with job titles and roles. Every place that read the single rep (thread signatures, the agent's Approver and attendees, simulation messages) reads the primary or backup admin
- [x] The company mark opens the account menu: header (mark, Ana Reyes, her role, Kalayaan Foods), "View company profile", then MANAGE with "Admins and authorized users" and "Privacy and contact details", then "Sign out"
- [x] The menu is a dropdown on a laptop and a sheet from the bottom on a phone. Escape closes it and focus returns to the mark. Its button's name says it opens the account menu
- [x] "Sign out" goes to the website's homepage
- [x] The people page lists the four with role lines worded as the spec gives them. "Make primary admin" swaps the admins, and the menu header follows
- [x] Only the primary admin can remove the backup admin. No one can remove themselves. Removing someone shows "{name} no longer has access. All N connections stayed with your company."
- [x] The Company page's "Authorized rep" row becomes a link to the people page; "Assign new rep" is gone
- [x] A Contact Request waiting for Marco shows on his row, naming the Company that asked, with no answer buttons
- [x] The privacy page: the name choice (full or alias), a title switch, the fixed line about email and phone, the preview card, and "Waiting for you" with Nordhavn's request, Share and Decline
- [x] Share: "Nordhavn Freight Forwarders can now see your email and phone." Decline: "Declined. Nordhavn Freight Forwarders won't be told."
- [x] A connected Company's profile shows its People section: shown name, title unless hidden, role, and email and phone only once shared
- [x] A Company that isn't connected, or has a request pending, shows "People show once you're connected." A connected Company with no people shows "No people listed yet." An unclaimed Company stays basics only
- [x] "Ask for contact details" becomes "Asked. {first name} decides." and can't be sent twice. The next morning the details appear, with a Notification
- [x] Nordhavn's request reaches Ana the morning after Kalayaan and Nordhavn connect, and it is present in the two-weeks-in preset
- [x] Every rule above lives in the Service Seam, and screens ask the seam
- [x] Meets the code quality points in its prompt, with the result reported

## Happy paths

- Two weeks in, on a phone: tap the company mark, and a sheet rises with "Ana Reyes", "Primary admin · Kalayaan Foods", "View company profile", the two MANAGE items and "Sign out".
- "Admins and authorized users" lists four people:
  - Ana Reyes, Owner, Primary admin
  - Marco Dizon, his title, Backup admin
  - the sales user, Authorized user · Sales
  - the procurement user, Authorized user · Procurement

  Each row has its plain line. Under the list: "Connections belong to Kalayaan Foods, not to any one person."

- Marco's row says a request from Maple Bay Grocers is waiting for him (or another connected Company), with no buttons.
- "Make primary admin" on Marco: Marco becomes Primary admin and Ana Backup admin. Ana's menu header now says Backup admin.
- "Remove" on the sales user: the row goes, and the toast says they no longer have access and all 4 connections stayed with Kalayaan.
- "Privacy and contact details": the preview card shows "Ana Reyes, Owner, Primary admin". Choosing "Ana R." changes the card. Turning the title off removes "Owner" from it.
- "Waiting for you": Nordhavn Freight Forwarders asks for Ana's email and phone. Share brings the toast, and Nordhavn moves under "Shared with".
- Nordhavn's profile: People lists 1–2 Nordhavn people with titles and roles. "Ask for contact details" on one shows "Asked. {first name} decides." After "Next morning", their email (on the example domain) and a visibly fake phone appear, and a Notification says they shared.
- On a laptop: the same menu opens as a dropdown under the mark.
- "View company profile" opens Kalayaan's Company page. "Sign out" opens the website's homepage.

## Sad paths

- Ana's own row has no Remove.
- After the swap, Ana is the backup admin, and Marco's row has no Remove.
- Marco's waiting request has no Share or Decline for Ana.
- Asking the same person again: the button stays "Asked" and nothing new is created.
- Decline: the toast says Nordhavn won't be told, the request leaves the list, and Nordhavn still sees no email or phone for Ana.
- A Company with a Connection Request still pending: no People section, only "People show once you're connected."
- A Company that hasn't claimed: basics only, no people and no Ask, exactly as the Pilot Preview spec decides.
- A connected Company with no hand-written people: "No people listed yet."
- A removed person disappears from People sections and from any Contact Request.
- Before the Claim (Pilot Preview Stops 1 and 2): no company mark, so no menu, as today.
- A full page load: the people, roles and settings return to their starting state, like everything in the Demo.
- With the AI Assistant off, every flow here works the same.
- Keyboard only: the menu opens with Enter or Space, its items are reached with the arrow keys or Tab, and Escape closes it. The radio choice, the switch and every button are reachable with visible focus.
- Screen reader: the menu has a name and announces its items. The switch announces on or off. Toasts are announced as today.
- Reduced motion: the menu and the sheet appear with no transition.
- At 360 pixels: the menu sheet, the two pages and the People section fit with no sideways scroll; long names wrap; every target is at least 44px.

## Executer prompt

```
Goal
You are the executer for ticket 02 of three. Give Kalayaan Foods four people with roles, a LinkedIn-style account menu on the company mark, an "Admins and authorized users" page and a "Privacy and contact details" page. Add a People section with Contact Requests to the profiles of connected Companies. Every rule about roles and visibility lives in the Service Seam. The Demo is shown today, 2026-11-19, at the Mapua meeting, so build in two halves and commit each when green: first the menu and roles (steps 1–3), then privacy and Contact Requests (steps 4–6).

Context
Repo: /Users/rafaeliiiprudente/Documents/coding projects/Comlinked. Branch: feat/website-redesign-pages. Stay on it and create no new branch.
Read first, in this order:
- CLAUDE.md, AGENTS.md
- CONTEXT.md, the sections "Glossary" (Org Role, Platform Role, Superadmin), "Participants", "Talking and closing" and "Showing ComLinked"
- docs/adr/0010-client-side-product-simulation.md
- docs/design-system/README.md (App Mode)
- the whole of docs/specs/2026-11-18-admins-privacy-and-day-1k.md
- in docs/specs/2026-11-17-pilot-preview.md, the section "Before a Company claims"
- this ticket file, .scratch/admins-privacy/issues/02-account-menu-roles-and-privacy.md, including its happy and sad paths
- the Outcome of ticket 01 in .scratch/admins-privacy/issues/01-pricing-off-and-chamber-size.md
Why: in the meeting on 2026-11-18, Richard asked who manages Connections when the one representative is away, how to let sales and procurement reach out without accepting, and what a Connection exposes about a Company's people.
How the product runs: everything under /app is a browser-held simulation behind the Service Seam src/services/comlinked (ADR 0010). Screens are client components; they read state with useSimulation and change it through act. Derived facts are seam functions. Routes are named in src/paths.ts (paths.product) and each has src/app/app/<route>/page.tsx rendering a screen from src/components/product/screens/. Tests: src/services/comlinked/simulation.test.ts (Vitest), and e2e/*.spec.ts (Playwright plus axe).
What exists today:
- MyCompany (types.ts) has rep and altRep. The start state sets them to "Ana Reyes" and "Marco Dizon". Readers of rep:
  - screens/thread.tsx: "{rep} for your company"
  - screens/agent.tsx: "Approver: {rep}, Owner", and the meeting's attendees, rep and altRep
  - simulation.ts: messages and the AI switch note
- The swapRep action swaps rep and altRep and toasts "{old} no longer has access. All N connections stayed with your company."
- screens/company.tsx shows "Authorized rep: {rep}" with an "Assign new rep" button.
- src/components/product/product-bars.tsx: the top bar's own-company button (class a-own, aria-label "Your company") goes to the Company page and shows Mono with own.
- screens/company-view.tsx is another Company's profile:
  - ContactActions reads S.conn (connected or pending) and S.incoming.
  - The profile reads publicView(c) from the seam. PublicView, in types.ts, gives basics only before the Claim.
- notify(type, cid, text) adds a Notification. nextMorning(n) advances the simulation.
- The two-weeks-in preset (seedTwoWeeks) connects Nordhavn Freight Forwarders, Maple Bay Grocers, Pacific Pack Solutions and Tala Print and Label. The day-one Matches are Maple Bay Grocers, Pacific Pack Solutions and Nordhavn.
- shadcn/ui primitives in src/components/ui include dropdown-menu, sheet, switch and avatar. The Presenter Guide already opens a Sheet from the bottom on phones (useIsDesktop).
- Ticket 01 has made pricing start off and added the Chamber Size. Read its Outcome for anything that changed names.
Decided by the user, do not change:
- Two equal admins: both send and accept Connection Requests and manage people. The primary is the only one who can remove the backup admin. No one removes themselves.
- Authorized users send Connection Requests in their area (sales: possible customers; procurement: possible suppliers) and can't accept. This is described on the people page, not enforced. The Demo stays signed in as Ana; there is no switching person.
- Four people, no limit shown, no "Invite a person".
- The menu: header, "View company profile", MANAGE with the two pages, "Sign out". A dropdown on laptops, a sheet on phones.
- Connected Companies see names and titles. Anyone can switch to an alias (first name and last initial) or hide their title. Email and phone only after that person shares them in answer to a Contact Request.
- Only the person answers a Contact Request about themselves.
- Not connected or pending: no people. Unclaimed: basics only.
- The words "super admin" are used nowhere, because Superadmin is ComLinked Staff's Platform Role.
Precondition: run git status. Ticket 01's work must be committed. Expected: untracked or modified files under .scratch/ and docs/specs; leave them. If anything under src/ or e2e/ is modified, stop and tell the user.

Scope
Modify:
- src/services/comlinked/types.ts, data.ts, simulation.ts and simulation.test.ts; index.ts only to export new seam functions
- src/paths.ts
- src/components/product/product-bars.tsx and product-shell.tsx if the menu needs mounting there
- src/components/product/screens/company.tsx, company-view.tsx, thread.tsx, agent.tsx and notifications.tsx where a reader of rep or a new Notification needs it
- src/app/app/product.css, for the new parts only, using the existing named sizes, radii, spacing and colours
- e2e/product-smoke.spec.ts, e2e/pilot-preview.spec.ts and e2e/a11y.spec.ts
Create:
- src/app/app/people/page.tsx and src/app/app/privacy/page.tsx, registered in src/paths.ts. Choose other addresses under /app only if these clash.
- screen components for the two pages under src/components/product/screens/
- an account menu component and a People section component under src/components/product/, each in its own file
Leave untouched:
- the logo and Profile Strength (ticket 03)
- the documents under docs/ (ticket 03)
- matching, search, ComDash, the chamber screens and the Pilot Preview Stops
- the website, docs/mockup, CONTEXT.md and docs/design-system

Approach
Use test-driven-development: Vitest at the Service Seam first, then the Playwright checks. Use systematic-debugging for failures, verification-before-completion before you report, and requesting-code-review once at the end. Project skills: testing-unit, testing-e2e, shadcn-ui, tailwind-v4, nextjs-app-router, coding-standards. Make the change easy, then make the easy change.
Step 1, people at the seam (prefactor).
- Replace rep and altRep with a list of people on the Company. Each person has a name, a job title, a role (primary admin, backup admin, or authorized user with an area), an alias choice, a title choice, an email and a phone.
- Kalayaan's people:
  - Ana Reyes, job title Owner, primary admin
  - Marco Dizon, a fitting title, backup admin
  - an invented Filipino-named sales user
  - an invented Filipino-named procurement user
- Give the seam small functions for the primary admin and the backup admin, and move every reader of rep to them. No screen changes its wording here.
- Write Vitest checks: four people with the right roles; the agent's Approver and the thread signature still read Ana.
- Commit when green.
Step 2, roles at the seam.
- Actions to make the backup primary and to remove a person, applying the rules above. Removing keeps today's message and every Connection.
- Write each role's plain line once, with the exact wording from the spec.
- A seam function returns, for the signed-in person, what they may do to each row.
- Vitest checks: the swap; only the primary removes the backup; no one removes themselves; removing keeps Connections.
- Commit when green.
Step 3, the menu and the people page.
- Build the account menu on the company mark, from the existing dropdown-menu and sheet primitives:
  - a dropdown on a laptop, a sheet on a phone
  - Escape returns focus to the mark
  - its button is named for the account menu
  - reduced motion removes its transition
- Build the people page. Point the Company page's "Authorized rep" row at it, as a link, and remove "Assign new rep".
- Browser tests for the menu on a phone and a laptop, the people page, Make primary and Remove, plus their sad paths and axe.
- Commit when green. This is the first half; if time runs out after it, stop here and report.
Step 4, visibility and people of connected Companies, at the seam.
- Hand-write 1–2 people for each of Nordhavn Freight Forwarders, Maple Bay Grocers, Pacific Pack Solutions and Tala Print and Label: invented names that suit each Company, European-style for the European members.
- Emails use the reserved example domain the websites use. Phone numbers are visibly fake (zeros after the area code) and must not be a working number.
- Extend what a Company may see of another with people:
  - none when not connected or pending
  - for each person, the shown name (alias or full), the title unless hidden and the role label
  - email and phone only once that person has shared them with the viewing Company
  - unclaimed Companies stay basics only
- Ana's own alias and title choices are actions at the seam.
- Vitest checks for every visibility bullet in the spec's Testing Decisions.
- Commit when green.
Step 5, Contact Requests at the seam.
- A new record: the Company that asked, the person asked, the day, and a state of waiting, shared or declined.
- Outgoing: asking from Kalayaan creates a waiting request, and asking again is refused. On the next simulated morning the person shares, with a Notification "{name} shared their contact details."
- Incoming: Nordhavn asks for Ana's details on the morning after they connect, with a Notification, and the two-weeks-in preset contains it. One more incoming request, for Marco from Maple Bay Grocers, waits on his row.
- Share and Decline are Ana's only, for her own requests, with the toasts from the spec.
- Vitest checks for every Contact Request bullet in the spec's Testing Decisions.
- Commit when green.
Step 6, the privacy page and the People section.
- Build the privacy page: the preview card, the name choice (native radio inputs or an existing primitive; add no dependency), the title switch, the fixed email and phone line with "Shared with", "Waiting for you", and the line that unconnected Companies see no people.
- Build the People section on company-view for connected Companies, with "Ask for contact details" and the "once you're connected" and "No people listed yet" lines.
- Browser tests for every happy and sad path in this ticket, on a phone and a laptop, with axe on both pages and with the menu open.
- Commit when green.
Step 7, finish.
- Run the full checks below and requesting-code-review, and fix what it finds.
- Write the Outcome section at the end of this ticket file: checks with real results, the names you invented, choices the ticket didn't spell out, and anything for the user to decide.
- Commit it.

Acceptance criteria
Vitest at the Service Seam covers every bullet in steps 1, 2, 4 and 5, and the existing story, Connection, Claim and two-weeks-in tests still pass.
Playwright covers:
- every happy and sad path in this ticket file
- the menu by keyboard, and Escape returning focus to the mark
- no sideways scroll on the menu sheet, both pages and a connected profile at 360, 390 and 1280 pixels
- axe with no serious or critical violation on both pages, a connected profile, and with the menu open
Every existing unit, component, product, Pilot Preview and website test passes. Each changed expectation is a deliberate update, never a weakened check.
Code quality is part of done. Check the diff against each point, and apply them only to code this session touches:
- Clean: each component and function has one job and a name that says so. The menu, the two screens and the People section each sit in their own file. No dead code: rep, altRep, swapRep and "Assign new rep" are removed, not left beside the new code. No stray logs. Strict types: no any, no non-null assertions, no silencing casts.
- Maintainable: one source for each fact. Who may do what, and who may see what, is decided only in the seam; no screen filters people or checks a role itself. Role lines are written once. New styles use the named sizes, radii, spacing and colours, with no literals. Reuse the existing panels, rows, marks, buttons, switches and sheets.
- Scalable: adding a role or an area changes one place in the seam. Giving another Company people is a data change only. A third Contact Request state would change one type and one function.
- Limits: no invite flow, seat limit, enforced role limits, person switching, real auth or Org Role changes. Don't refactor outside Scope. Split a file you rebuild past about 300 lines where it has a clear seam.
Run coding-standards on your diff and report the result.

Verification
After each step: pnpm lint && pnpm type:check && pnpm test && pnpm build, plus the browser tests for that step's screens.
At the end: pnpm lint && pnpm type:check && pnpm test && pnpm build, then the whole of pnpm test:e2e.
Use NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co and NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder.
Port 3000 on this machine is often a different project, and Playwright reuses whatever answers there. Check it first, and if it isn't ComLinked run PLAYWRIGHT_PORT=3111 pnpm test:e2e.
The user may run their own ComLinked dev server on port 3001, which holds .next. If a build in the repo clashes with it, copy the working tree to the scratchpad (without node_modules, .next and .git), symlink node_modules to the repo's, and build there. Don't stop the user's server without asking.
A new CSS import may need a second edit or a dev server restart before it shows. Wrap long browser runs in caffeinate -i. The homepage ring's contrast check is a known flake under load; rerun it alone before treating it as real.
Report actual output, including anything skipped.

Guardrails
- Commit when green, after each step, as Conventional Commits on feat/website-redesign-pages. Never push, merge, open a PR, or switch or create branches.
- Stop after step 7 and report. Do not start ticket 03.
- Add no dependencies, icons outside lucide-react, hues or dark mode.
- Every person, email, phone and Company here is invented. No real person's name with a real company. No working phone number.
- Never show a person's email or phone without a share, and never show people to a Company that isn't connected.
- Never hide a Company's name. Never widen what a tier hides.
- Keep the "Example data" tag on every screen. ECCP appears as text only, never a logo.
- Status is text, never colour alone. Never add unsafe-inline or unsafe-eval to script-src.
- Voice: sentence case, no emoji, no exclamation marks.
- Send nothing about this project to an outside service. Never publish the mockup.
- If the code or the spec contradicts this prompt, stop and ask the user.
```

## Outcome

Built on 2026-11-19 on `feat/website-redesign-pages`, in seven commits after `6f1ab4f`:

- `cb8fa86` step 1: four people in place of a single rep
- `65fd8e4` step 2: roles at the seam
- `e9b981e` step 3: the account menu and the people page (first half)
- `daa481f` step 4: which people a Company may see of another
- `dcf523c` step 5: Contact Requests at the seam
- `f28cbef` step 6: the privacy page and the People section
- `9dcba94` fixes from the code review

Nothing was pushed.

### Checks run (real results)

- `pnpm lint`: no warnings or errors.
- `pnpm type:check`: clean.
- `pnpm test`: 391 passed, 5 skipped. `simulation.test.ts` alone: 290 passed.
- `pnpm build`: compiled after every step. It ran in a scratchpad copy with `node_modules` symlinked, because my dev server on 3111 held `.next`.
- After each step: the browser tests for that step's screens (for example 53 passed after step 3 and 25 after step 6).
- `pnpm test:e2e` in full (`PLAYWRIGHT_PORT=3111`, `--workers=3`, restarted server): 517 of 541 passed. The 24 failures were timeouts (`page.goto`, clicks and `page.evaluate` that never returned) spread across website, Pilot Preview and product specs. The machine's load average was 7 to 8 during the run, and a different set of tests failed in each of three full runs. Rerun with `--last-failed --workers=1`, all 24 passed (58.6s). So every test has passed, though not all in one run.
- One real failure, which reproduced alone: the phone daily-loop test clicked the account mark while a toast covered it. It now waits for toasts to clear first, as the same test already did later.
- Screenshots of the menu (phone sheet, laptop dropdown), the people page, the privacy page at 360 and Nordhavn's profile at 1280, looked over by eye. They are in the session scratchpad, not committed.
- Code review (`/code-review`, two axes) ran. Its findings are fixed in `9dcba94` or listed below.

### Code quality, against the prompt's points

- **Clean.**
  - The menu (`account-menu.tsx`), the two screens (`screens/people.tsx`, `screens/privacy.tsx`) and the People section (`people-section.tsx`) each have their own file. `person-card.tsx` is the one row the people page, the People section and the privacy preview share.
  - `rep`, `altRep`, `swapRep` and "Assign new rep" are gone.
  - No `any`, no non-null assertions and no silencing casts. The review caught one cast in `data.ts`, and it was removed.
- **Maintainable.**
  - Who may do what (`mayMakePrimary`, `mayRemove`, `peopleRows`) and who may see what (`peopleSeenBy`, `previewOfMe`, `contactRequestsToMe`) are decided only in `simulation.ts`. No screen filters people or checks a role.
  - The role labels and plain lines are written once, in `ROLES`.
  - The new CSS uses the Demo's named tokens.
- **Scalable.**
  - A new role or area is one entry in `PersonRole` and `ROLES`.
  - Giving another Company people is one entry in `PEOPLE_ENTRIES` in `data.ts`. A seam test checks that every person's id is unique.
  - A third Contact Request state would change `ContactRequestState` and the place that sets it. Readers only test for "waiting" or "shared", and `personSeen` reads any other state as "asked".
- **Limits.** There is no invite flow, seat limit, person switching or enforced role limit. `simulation.ts` grew by about 350 lines. I didn't split it, because the prompt says not to refactor outside Scope. People, visibility and Contact Requests are three sections that would move cleanly into a module of their own.
- **coding-standards** (via the Standards review): no hard violations remain.

### Names invented

- **Kalayaan Foods:**
  - Ana Reyes (Owner, primary admin)
  - Marco Dizon (Operations manager, backup admin)
  - Liza Manalo (Sales lead, Authorized user · Sales)
  - Paolo Villanueva (Purchasing officer, Authorized user · Procurement)
- **Nordhavn Freight Forwarders:** Mette Lindholm (Managing director, primary admin) and Jonas Brandt (Export sales manager, sales).
- **Maple Bay Grocers:** Carmela Lopez (General manager, primary admin) and Dennis Ramos (Category buyer, procurement).
- **Pacific Pack Solutions:** Ramon Castillo (General manager, primary admin) and Joy Fernandez (Account manager, sales).
- **Tala Print and Label:** Rosario Mendoza (Owner, primary admin). She shows her alias, "Rosario M.", so the Demo has one person who uses an alias (story 42).
- Emails are the first name at the Company's `.example` domain. Phones are `+63 2 0000 00NN`: Kalayaan 01–04, then 11–12, 21–22, 31–32 and 41.

### Choices the ticket didn't spell out

- **Only the primary admin can make the backup primary.** The spec says both admins "make the backup the primary". Read that way, a backup could promote itself and then remove the other admin, which is the lock-out story 23 rules out. So after the swap, Ana (now backup) has no "Make primary admin", and only a reload swaps back.
- **The menu's group label is "Manage", not "MANAGE".** The voice rule is sentence case, and the Demo's rules test fails text in capitals.
- **The menu, rendered outside the product root, carries `.cl-guide`**, as the Presenter Guide does, so it gets the Demo's tokens and the reduced-motion rule without changing `demo-scale.css`, which is outside Scope.
- **The Company page's row** is a link that reads "Admins and authorized users" with "Primary admin: {name}" under it. The connections line there is unchanged.
- **The people page's waiting line** reads "A Contact Request from Maple Bay Grocers is waiting. Only Marco Dizon can answer it." Marco's request comes from the morning after Maple Bay Grocers and Kalayaan connect, as Nordhavn's does, and is not notified, because it isn't Ana's.
- **Wording the spec didn't give:**
  - "Nothing is waiting." when no request waits
  - "Shared with no company yet." before any share
  - a "You" tag on Ana's row
  - "Job title: Shown / Hidden" above the switch, matching "AI Assistant: On"
- **The two-weeks-in preset** dates both requests Day 2 (the day after the Day 1 Connections). It notifies Ana of Nordhavn's request with that date, so the Notification reads "12 days ago".
- **Notifications.** A Contact Request's Notification opens the privacy page. A "shared their contact details" Notification opens that Company's profile.
- **A declined request still reads "Asked. {first name} decides."** to the Company that asked, so declining stays quiet. Kalayaan's own asks are always shared the next morning.
- **After a removal, the agent's meeting attendees** are whichever admins remain.
- **Test files.**
  - `e2e/demo-rules.spec.ts` is outside the listed Scope, but it requires every `/app` address in its screen list. The people and privacy pages were added there, and its Company page entry now goes through the menu.
  - The browser tests that opened the Company page from the mark now go through the menu ("Your company" became "Open the account menu").
  - `e2e/a11y.spec.ts` was not changed: axe runs on both pages, a connected profile and the open menu inside `product-smoke`.
  - The phone daily-loop test now waits for toasts to clear before it opens the menu, because on a phone a toast drops over the mark.

### For the user to decide

1. Should a backup admin be able to make themselves primary? It isn't allowed now, for the reason above. Richard's question 2, "are the two admins equal?", covers it.
2. Is it fine that there is no way back from the swap without a reload?
3. Should "Manage" be in capitals, as on LinkedIn, against the Demo's sentence-case rule?
4. `docs/design-system/README.md` still calls the person an "authorized rep". Ticket 03's documents step should update it.
5. Richard's questions 1–4 from the spec are untouched: how many people, equal admins, only the person shares, and names and titles shown by default.
