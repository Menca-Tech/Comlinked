# 02 — Kalayaan's first export shipment, and basics only before a Claim

**What to build:** Kalayaan Foods now does business across the Europe–Philippines line. Nordhavn Freight Forwarders is one of its three day-one Matches, and two weeks in both Companies have confirmed a first shipment of banana chips to Europe, with a Testimonial on the Success Wall. The timeline also becomes honest: wins are dated, the wall starts empty, and "Two weeks in" lands on Day 14. Separately, a Company that has not yet claimed shows only its public basics wherever another Company meets it.

**Spec:** `docs/specs/2026-11-17-pilot-preview.md`, sections "The network" (Nordhavn), "Claiming as one fact" (nothing sent before a Claim), "Before a Company claims" and "Wins, deals and Monthly Top Companies". User stories 12, 13, 15, 16, 62 to 67, 69, 70, 82, 83 and 91.

**Blocked by:** 01 — One claim day per Company, and a network of 100 under ECCP's name. The user must have reviewed and committed it.

**Status:** built on 2026-11-17, uncommitted. See "Outcome" at the end.

- [x] Nordhavn Freight Forwarders is one of Kalayaan's three day-one Matches in place of Palengke Online, which moves to Day 1's Daily Lead List
- [x] "Two weeks in" lands on Day 14, with the Nordhavn deal confirmed by both Companies and its Testimonial on the Success Wall
- [x] Wins and deals are dated: the wall is empty on Days 0 to 2, and by Day 14 the chamber has 3 confirmed deals and 2 wins
- [x] The message "sent for your company before you claimed your profile" is gone
- [x] A Company that has not claimed shows name, industry, city and website, marked "Not yet claimed", in search, on its profile and on Match and lead cards
- [x] Such a Company shows a Fit Score with no breakdown and one reason drawn from the viewer's side, offers no Connect, and holds a message as waiting
- [x] Day 1's Daily Lead List holds exactly one Company that has not claimed, and the three Matches hold none
- [x] The profile check in the Claim says other members see the description once it is confirmed
- [x] Meets the code quality points in its prompt, with the result reported

## Happy paths

- "New company", then claim: the three Matches are Maple Bay Grocers, Pacific Pack Solutions and Nordhavn Freight Forwarders. Nordhavn's reason says it ships between Manila and European ports and looks for manufacturers ready to export.
- Connect with Nordhavn: the request is accepted. Message it: the AI Draft is editable and sends only on Send.
- Day 1's Daily Lead List: five leads. After the three Matches come Palengke Online and Northline Logistics, and Northline is the one marked "Not yet claimed".
- Open the lead that has not claimed: name, industry, city, website and "Not yet claimed" show, with a Fit Score and one line such as "You're looking for freight. Northline Logistics works in cold-chain freight, Valenzuela City." There is no description, no offers or needs, no score breakdown and no Connect button.
- Message that Company: the thread says the message waits until it claims, and the next morning brings no reply.
- "Two weeks in": every screen says Day 14. The ComMail thread with Nordhavn shows "We did business" confirmed by both.
- Wins on Day 14: the Success Wall shows two wins, one of them "Kalayaan Foods Inc. with Nordhavn Freight Forwarders" about a first shipment to Europe.
- Nordhavn's profile on Day 14 shows that Testimonial.
- Team Dashboard on Day 14: deals and Testimonials match what the wall and the chamber's count show.
- Search for a Company that has not claimed: its row shows basics and the mark.

## Sad paths

- Wins on Day 1 or Day 2: a calm empty state says the first win appears when two members confirm a deal.
- The AI Assistant is off: the first message to Nordhavn starts as an empty box with the templates, and still sends.
- A Company's claim day arrives while the presenter moves time forward: its mark goes and its description, offers and needs appear.
- A Company that has not claimed never shows as a viewer, searcher or sender anywhere.
- A very long company name with the "Not yet claimed" mark on a 360 pixel phone wraps with no sideways scrolling.
- The reason line for a Company that seeks what Kalayaan offers starts from Kalayaan's offer, not from the other Company's unpublished needs.
- Tests that expected Day 15 or the old Matches are updated on purpose, and each change is listed in the report.

## Executer prompt

```
Goal
Change Kalayaan Foods' story so that Nordhavn Freight Forwarders is a day-one Match and the two Companies confirm a first export shipment within two weeks, make wins and the two-weeks state honest about dates, and show only public basics for any Company that has not yet claimed.

Context
Repo: /Users/rafaeliiiprudente/Documents/coding projects/Comlinked. Branch: feat/website-redesign-pages. Stay on it and create no new branch.
Read first, in this order: CLAUDE.md, AGENTS.md, CONTEXT.md (Match, Match Reason, Fit Score, Daily Lead List, Pre-built Profile, Claim, Outcome, Testimonial, Success Wall), docs/adr/0010-client-side-product-simulation.md, then docs/specs/2026-11-17-pilot-preview.md. In the spec, "The network", "Claiming as one fact", "Before a Company claims" and "Wins, deals and Monthly Top Companies" are your brief. The happy and sad paths are in .scratch/pilot-preview/issues/02-export-story-and-basics-before-claim.md.
How the product runs: everything under /app is a browser-held simulation behind the service seam src/services/comlinked (ADR 0010). Screens are client components that read it with useSimulation and change it through act. Derived facts are exported seam functions, tested in simulation.test.ts. A full page load resets the simulation, so move between /app routes with next/link or router.push.
What ticket 01 left you: 100 Companies, the 60 European-style ones in european-members.ts; one claim day per Company, read only through hasClaimed() and claimDayOf(); pointsOf() and claimedCount(); the rule that a Company which has not claimed never acts; exactly 40 claimed on Day 14; the chamber named from chamber.ts. Read the "Outcome" section of .scratch/pilot-preview/issues/01-claim-day-and-network-of-100.md, then the code, before you plan. Three things from it matter here:
- The Daily Lead List and overnight attention draw only on Companies that share Kalayaan's trade (sharesMyTrade in simulation.ts): they buy what it offers, sell what it seeks, or sell the same. Nordhavn's present tags keep it out, so Step 1 must bring it in.
- Northline Logistics, Tibay Crates and Pallets and seven other original Companies never claim. Bayan Cold Storage and Kahon Corrugated claim on Day 15, so they have not claimed once "Two weeks in" is Day 14. Tests that expect 42 claimed were written for Day 15 and become 40.
- Moving the seed to Day 14 changes which Company posts that morning's Ask. It also leaves the AI Lead Agent preview's freight run with nobody to engage until Nordhavn offers freight, and an existing test needs that run to engage a Company.
What exists today in the story:
- finishClaim() sets the day-one state. It includes a thread to Northline Logistics noted "Your community manager sent this for your company before you claimed your profile."
- Day 1's Daily Lead List is Maple Bay Grocers (Fit Score 92), Pacific Pack Solutions (87), Palengke Online (87), Northline Logistics (77) and Tala Print and Label (77). The first three are the day-one Matches. Northline is the only one of the five that has not claimed.
- Fit Scores come in steps: 12 to start, 40 for wanting two or more things Kalayaan offers (30 for one), 30 for offering something it seeks, 10 for the same city or 5 for elsewhere in Metro Manila. Equal scores keep the network's order, in which the 60 come after the originals.
- seedTwoWeeks() builds "Two weeks in" on Day 15, with a meeting confirmed with Pacific Pack Solutions and no confirmed deal.
- WINS holds three undated wins, shown on the Success Wall from the first day.
- teamData() works out the chamber's deals and Testimonials by formula.
- Nordhavn's tags were written so it never matches Kalayaan.
- Every Company's full profile shows to everyone, claimed or not.
Decided by the user, do not change: Nordhavn takes Palengke Online's place among the three day-one Matches, and Palengke Online moves to Day 1's Daily Lead List (2026-11-17). The deal is a first shipment of banana chips to Europe carried by Nordhavn. Until a Company claims, others see only its name, industry, city and website. Matching still uses the full draft in private. Nothing is sent in a Company's name before it claims. AI drafts and a person decides, and every flow works with the AI Assistant off.
Precondition: the user has committed ticket 01. Run git status. If anything under src/ or e2e/ is modified, stop and tell the user. Untracked files under .scratch/ are expected.

Scope
Modify:
- src/services/comlinked/types.ts, data.ts, european-members.ts, simulation.ts and simulation.test.ts.
- src/components/product/shared.tsx: the profile head, the reason and offers parts, and the lead card.
- In src/components/product/screens/: company-view.tsx, search.tsx, leads.tsx, matches.tsx, thread.tsx, commail.tsx and wins.tsx. In claim.tsx, add one line on the profile check screen and nothing else.
- src/components/product/comdash/from-connections.tsx: only where it reads wins.
- src/components/product/comdash/summary-cards.test.tsx and signals-tab.test.tsx: only where a day or a name changed.
- src/app/app/product.css: the "Not yet claimed" mark and the waiting line.
- e2e/product-smoke.spec.ts.
Create: new components go in their own file under src/components/product/. shared.tsx is already close to 400 lines, so move the lead card parts you rework out with them instead of growing it.
Leave untouched: the chamber tools screen, ComDash's layout and its Interest Level and Next action rules, the product shell, the Presenter Guide, the website, /auth, /dashboard, src/middleware.ts, CONTEXT.md and docs/mockup.

Approach
Use test-driven-development: write the Vitest cases at the service seam before each change, then the Playwright checks. Use systematic-debugging for failures, verification-before-completion before you report, and requesting-code-review once at the end. Project skills: testing-unit, testing-e2e, nextjs-app-router, tailwind-v4, coding-standards, no-ai-design-slop.
Step 1, Nordhavn as a Match. Change only Nordhavn's own row, so every other Company's Fit Score stays what it is. Give it the freight Kalayaan seeks, two of the things Kalayaan offers as its wants, and Quezon City as its city. That makes its Fit Score 92, level with Maple Bay Grocers, so Day 1's Daily Lead List becomes Maple Bay Grocers, Nordhavn Freight Forwarders, Pacific Pack Solutions, Palengke Online and Northline Logistics, and the first three are the Matches. Tags alone are not enough: outside Quezon City it would reach 87 and stay behind Palengke Online. Do not change the Fit Score rules. If the list does not come out as stated, stop and report the scores. Nordhavn's Match Reason reads that it ships between Manila and European ports and is looking for manufacturers ready to export. Update the rule carried over from the mockup to read: apart from Nordhavn, none of the 60 trades in what Kalayaan buys or sells.
Step 2, the day-one state. Remove the thread that was sent for Kalayaan before it claimed. Keep the day-one Interest Signals and the incoming message.
Step 3, two weeks in, on Day 14. One seed builds this state, and the Presenter Guide's "Two weeks in" uses it. Move it from Day 15 to Day 14: events dated Day 15 move to Day 14, and nothing is dated before Day 1. In it, Kalayaan connected with Nordhavn on Day 1, exchanged messages, confirmed "We met", and both Companies confirmed "We did business" on Day 13, with the points the rules give. Kalayaan's Testimonial is posted: need "We needed a forwarder for our first shipment of banana chips to Europe." and result "We met through a day-one match, and the shipment left Manila within two weeks." Keep the other interested Companies and their Interest Levels as close to today's as the dates allow.
Step 4, dated wins and deals. A win has the day it was posted and shows on the Success Wall only from that day. Hold the chamber's other confirmed deals as dated data too. By Day 14 there are exactly three confirmed deals in the chamber and two wins on the wall:
- Kalayaan Foods with Nordhavn, from the story.
- Regalia Business Hotel with Vinoteca Wine Importers, a deal with a Testimonial on Day 9: need "We needed a European wine supplier for our restaurant and events." and result "A reply on the Asks board turned into a twelve-month supply agreement."
- Azur Bay Resort with Maison Blanc Linens, a deal on Day 12 with no Testimonial yet.
The three wins the Demo has today move to days after Day 14. Every Company in a deal has claimed by its day; adjust claim days if you must, keeping exactly 40 claimed on Day 14 and the rest of ticket 01's schedule. The wall's empty state reads "No wins yet. The first appears when two members confirm a deal." teamData() counts deals and Testimonials from this same data plus Kalayaan's own, and no longer by formula.
Step 5, basics only. Add one seam function that returns what the viewing Company may see of another: always its name, industry, city, website and whether it has claimed; its description, offers and needs only once it has claimed. Search results, the profile, and Match and lead cards render from it. A Company that has not claimed is marked "Not yet claimed" in text. Its card shows the Fit Score with no breakdown, and one reason from a seam function, built from the viewer's side and the other's public industry and city: "You're looking for {need}. {Name} works in {industry}, {city}." when it gives what the viewer seeks, otherwise "You offer {offer}. {Name} works in {industry}, {city}."
Step 6, contact. Connect is not offered for a Company that has not claimed. Message is. The thread says "Waiting until {Name} claims its profile", no reply arrives, and the waiting state is readable from the seam, because a later ticket shows the chamber that a member is waiting.
Step 7, Day 1. Kalayaan's three Matches have all claimed. Its Day 1 Daily Lead List holds exactly one Company that has not claimed.
Step 8, the Claim. The profile check screen gains the line "Other members see this description once you confirm it."
Step 9, update the browser tests, check 360 and 1280 pixel widths, run coding-standards on the diff, then requesting-code-review, then Verification.

Acceptance criteria
Vitest at the service seam covers:
- the three day-one Matches are Maple Bay Grocers, Nordhavn Freight Forwarders and Pacific Pack Solutions; Palengke Online and Northline Logistics complete Day 1's list; and none of the other 59 is in Kalayaan's Matches, leads or interested Companies on any day
- the day-one state holds no message sent before the Claim
- "Two weeks in" is Day 14, with the Nordhavn deal confirmed by both, the Testimonial on the wall and the points awarded by the existing rules
- no win shows before its day; the wall is empty through Day 2; Day 14 has exactly three deals and two wins; the Team Dashboard's figures equal them
- what a viewer may see of a claimed and of an unclaimed Company, and that it changes on the claim day
- both forms of the reason line, and that neither contains the other Company's offers or needs
- no Connect for an unclaimed Company; a message to it waits and gets no reply across several mornings
- Day 1's list holds exactly one unclaimed Company and the Matches hold none
- exactly 40 claimed on Day 14 still holds
- the existing repeat-run determinism check still passes
Playwright covers each happy and sad path in the ticket file, plus no sideways scroll at 360 and 1280 pixels on Leads, a profile and Wins, and axe with no serious or critical violations on a not-yet-claimed profile.
Every existing unit, component, product and website test passes. Change an expectation only where the story or a day really changed, never to weaken a check, and list each change in your report.
Code quality is part of done. Check the diff against each point, and apply them only to code this session touches.
- Clean: each function and component has one job and a name that says so. No dead code, commented-out code, unused CSS or stray logs. The formula for chamber deals is deleted, not left beside the data. No any, non-null ! or as used to silence an error. "use client" only on interactive leaves.
- Maintainable: one source for each fact. What a viewer may see of a Company comes from one seam function, and no screen reads a Company's description, offers or needs directly. Wins and deals are one dated list read by the wall, profiles and the Team Dashboard. One seed builds the two-weeks state. Links come from src/paths.ts and colours from App Mode tokens.
- Scalable: adding a win or a deal changes one data row. A new screen that lists Companies gets the basics rule by calling the same function.
- Limits: extract shared code only for a use that exists now. Do not refactor outside Scope; list anything worth fixing in your report.
Report the coding-standards result.

Verification
After each step: pnpm lint && pnpm type:check && pnpm test.
At the end: pnpm lint && pnpm type:check && pnpm test && pnpm build, then pnpm test:e2e.
Use NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co and NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder.
Port 3000 on this machine is often used by a different project, and Playwright reuses whatever answers there. Check what is on port 3000 first. If it is not ComLinked, run PLAYWRIGHT_PORT=3111 pnpm test:e2e. Never stop a server you did not start. A build clashes with a ComLinked dev server using the same .next folder, and a dev server started without the Supabase settings makes the auth-smoke test fail when Playwright reuses it. If one is running, either ask the user to stop it, or verify in a copy: copy the working tree to a scratch folder without node_modules, .next and .git, run pnpm install --offline --frozen-lockfile --ignore-scripts there, then run pnpm build and PLAYWRIGHT_PORT=3111 pnpm test:e2e in the copy, and delete the copy afterwards.
Report actual output, including anything skipped.

Guardrails
- Do not commit. Do not run git add, git commit or /ship unless the user asks in this session.
- Leave all work uncommitted on feat/website-redesign-pages. Do not switch or create branches, push, merge or open a PR.
- End your report with the changed files grouped by step, each group with a suggested Conventional Commit message.
- Add no dependencies.
- Every company, person and figure stays invented.
- Never hide the name of a Company. Basics only means the description, offers and needs wait for the Claim; the name always shows.
- Keep "AI drafts, a person decides": nothing sends without the person tapping Send, and every flow works with the AI Assistant off.
- Status and marks are text, not colour alone.
- Voice: sentence case, no emoji, no exclamation marks.
- Do not edit docs/mockup or CONTEXT.md.
- If something here conflicts with the code or the spec, stop and ask.
```

## Outcome

Built on 2026-11-17 and left uncommitted on `feat/website-redesign-pages`.

**Checks run on the final code**

- Lint, type check and 244 unit tests pass in the repository (5 database tests are skipped, as before).
- The production build passes. It ran in a scratch copy, because a ComLinked dev server was running on port 3001.
- Browser tests: 195 in all. They ran in the scratch copy on its own server, port 3111, with the placeholder Supabase settings. No single run was fully clean, because another project's test run was loading this machine. The best full run passed 193. Its two failures are website tests this change cannot reach, and both pass when run alone. Every test that failed in any run passes when rerun on one worker.

**What changed in Kalayaan's story**

- The three day-one Matches are Maple Bay Grocers, Nordhavn Freight Forwarders and Pacific Pack Solutions. Day 1's list ends with Palengke Online and Northline Logistics. Tala Print and Label moves to Day 2, and each later list starts one Company later.
- "Two weeks in" is Day 14. The Activity Score is 123 and the rank is #1 of 12. It was 59 and #4: the rules give 64 points for connecting with Nordhavn, three replies, the meeting, the deal and the Testimonial.
- The interested Companies are the same 12 at the same Interest Levels, plus Nordhavn, which is Hot and connected.
- Day 14's leads are Kahon Corrugated, Tindahan Convenience Stores, Biyahe Couriers, Lakbay Hotels and Selyo Compliance Services. Three of the five, the first among them, have not claimed.
- The morning's Ask on Day 14 is Nordhavn's. The digest reads "5 new leads, 2 companies viewed you, you moved up 1 place".
- The Connection Request to Tibay Crates and Pallets is gone, because Connect is not offered for a Company that has not claimed.
- No win by a Connection is on the wall on Day 14, so "From your connections" shows asks and profile updates that day. Maple Bay Grocers' win appears on Day 15.

**Choices made that this ticket did not spell out**

- Nordhavn seeks "Food manufacturers" and "Snack exporters".
- Tibay Crates and Pallets claims on Day 18, so that its win with Malaya Export Traders can be dated Day 25. The other two earlier wins are dated Day 15 and Day 19. Exactly 40 are still claimed on Day 14.
- A Company that has not claimed is found in search by its name and industry only. Its connections are not shown. No follow-up is suggested on a message to it. The AI Draft of a first message to it uses its industry and city.
- A profile shows the Company's website, claimed or not.
- The seed's digest figures and its "moved up" count are worked out from the seeded state. Search appearances went from 2 to 1, and "moved up" from 3 places to 1.
- Two rows of points carried over from the old seed had no message behind them. The reply to Pacific Pack is now dated Day 9, and Kalayaan's reply to Maple Bay is dated Day 6. The Maple Bay thread is now the one that offers a follow-up.

**Facts for later tickets**

- What a viewer may see of a Company: `publicView()`. The one-line reason: `matchReason()`. A message waiting for a Claim: `waitingForClaim()`.
- The wall, a Company's wins, and the count of deals: `successWall()`, `winsOf()` and `dealsConfirmed()`. The chamber's deals and wins are the rows of `CHAMBER_DEALS`.
- The "Not yet claimed" mark is `claim-mark.tsx`. The lead cards moved to `lead-board.tsx`.
- Browser tests are steadier against a server that is already running and has opened each route once.

**Left for later**

- The Claim's first screen and the Engine still read a Company's description and Fit Score breakdown directly. All three Matches on that Claim screen have claimed.
- Kalayaan's own profile reads its wins without going through `successWall()`. The result is the same.
- The Network Ring on ComDash does not mark a lead that has not claimed.
- The website's example ring still names Northline Logistics as a first-day Match. The website was out of scope.
- A win holds company names and a deal holds company ids, so one place maps names back to ids.
