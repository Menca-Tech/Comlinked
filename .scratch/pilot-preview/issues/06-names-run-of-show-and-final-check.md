# 06 — Names, Run of Show, documents and the final check

**What to build:** the Pilot Preview becomes safe to hand to Richard. Every invented company name is checked against real companies and renamed where it clashes. Richard gets a one-page Run of Show he can print: for each Stop, what to click, what to say, and the likely question with its answer, with every answer that still needs his decision marked. The project's documents are brought up to date, and the whole Preview is checked end to end on a laptop and two phone widths.

**Spec:** `docs/specs/2026-11-17-pilot-preview.md`, section "Documents", the whole of "Testing Decisions", and "Questions for Richard". User stories 57 to 59, 92 and 93.

**Blocked by:** 04 — Stops 1, 2 and 6, and 05 — ECCP's Activity View. The user must have reviewed and committed both.

**Status:** partly built on 2026-11-18. The renames wait for a later pass, as the user chose.

- [ ] Each of the 100 invented company names has been checked against real companies, with real ECCP members first, and every clash is renamed everywhere it appears
- [x] The Run of Show is one printable page covering the Opening and the six Stops, and every button it names exists in the Demo
- [x] Every answer awaiting Richard is marked in the Run of Show, and the date of the name check is recorded on it
- [x] The feature status document describes how the Demo is shown, the network of 100, the Pilot Preview and the chamber roles as they now are
- [x] The plan's Adoption notes and the SRS list the four choices awaiting Richard, with no requirement text changed
- [ ] Every item under the spec's "Testing Decisions" has a test, and the full suite passes
- [x] Meets the quality points in its prompt, with the result reported

## Happy paths

- The name check finds a real company with the same name as an invented one: the invented Company gets a new name, initials and website, and every screen, seeded message and test follows.
- The name check finds no clash for a name: it is recorded as checked and left alone.
- Richard prints the Run of Show: it fits one page, and reads top to bottom in the order of the Stops.
- For Stop 2 it tells him to press "Claim your profile" in the message, and that button is there.
- For the question "Do you need our members' emails?" it gives the answer and marks it "Richard to confirm".
- For "How will ComLinked earn money?" it tells him to press G and switch on "Possible future pricing".
- The status document no longer says the Demo is presented from a laptop and stays on the Mac.
- The walk from the Opening to the ask passes at 1280 pixels and at 390 and 360, with axe clean on every Stop.
- Screenshots of every Stop at 390 and 1280 pixels are saved for the user to look through.

## Sad paths

- The session has no web search: it stops before changing any name and tells the user.
- A search is inconclusive: the name is treated as a clash and renamed.
- A renamed Company is named in a seeded message, a Testimonial or a test: all of them are updated, and none still shows the old name.
- A button named in the Run of Show does not exist in the Demo: the Run of Show is corrected, not the Demo.
- The final check finds a defect that needs more than a small fix: it is reported with steps to reproduce, and left for a new ticket.
- A requirement in the SRS conflicts with a choice awaiting Richard: the SRS gains an open decision and its requirement text stays as it is.
- The SRS's Word copy is not regenerated, and the report says so.
- Screenshots would land in a folder that git tracks: the session says so and does not add them.

## Executer prompt

```
Goal
Make the ComLinked Pilot Preview ready to hand to its presenter: check every invented company name against real companies and rename any clash, write a one-page Run of Show, bring three project documents up to date, and prove the whole Preview works end to end on a laptop and two phone widths.

Context
Repo: /Users/rafaeliiiprudente/Documents/coding projects/Comlinked. Branch: feat/website-redesign-pages. Stay on it and create no new branch.
Read first, in this order: CLAUDE.md, AGENTS.md, CONTEXT.md (the chamber roles and the section "Showing ComLinked"), then docs/specs/2026-11-17-pilot-preview.md in full. Its sections "Documents", "Testing Decisions" and "Questions for Richard" are your brief. The happy and sad paths are in .scratch/pilot-preview/issues/06-names-run-of-show-and-final-check.md. Read the other five tickets in .scratch/pilot-preview/issues/ to learn what was built.
The situation: ECCP, the European Chamber of Commerce of the Philippines, is the first Pilot. Nobody there has seen ComLinked. Richard, the product owner, will present the Pilot Preview alone to ECCP's Chamber Leader in a first meeting, sharing his screen, and send a private link afterwards. He wrote the product plan but did not build the Demo. Four choices made for the Preview change his plan and await his confirmation; they are the first four under "Questions for Richard" in the spec.
What exists: the Pilot Preview is built. Its Stops are declared in src/services/comlinked/preview.ts. The 100 invented Companies are in src/services/comlinked/data.ts and european-members.ts. The chamber's name, the sender name and the presenter's first name are in chamber.ts. The browser tests for the Preview are in e2e/pilot-preview.spec.ts. Run the Demo and walk the Preview yourself before you write anything about it.
Decided by the user, do not change: the Run of Show is one printable page kept in the repository, off the shared screen. Nothing goes to ECCP until Richard signs off. Requirement text in the SRS and the plan changes only after he confirms; until then they record open choices. ECCP appears by name only.
Each earlier ticket file in .scratch/pilot-preview/issues/ ends with an "Outcome" section: what was built, the choices made, and what was left for later, including wording for the final check to look at. Read all five before you plan.
Precondition: the user has committed tickets 04 and 05. Run git status. If anything under src/ or e2e/ is modified, stop and tell the user. Untracked files under .scratch/ are expected.

Scope
Modify:
- src/services/comlinked/data.ts and european-members.ts: names, initials and websites of renamed Companies only.
- src/services/comlinked/simulation.ts and any test: only where a renamed Company's name is written out.
- e2e/pilot-preview.spec.ts: tests that the spec's "Testing Decisions" list and the suite still lacks.
- docs/specs/2026-11-08-mvp-feature-status.md.
- docs/specs/2026-10-11-mvp-build-plan.md: its Adoption notes only. Sections 1 to 8 transcribe Richard's PDF and must not change.
- docs/specs/2026-11-09-comlinked-srs.md: its version table and its open decisions only.
Create: docs/presentations/2026-11-17-pilot-preview-run-of-show.md.
Leave untouched: every screen and rule of the Demo, apart from a defect fix within the limit below; the SRS's Word copy; CONTEXT.md; docs/mockup; the website; /auth; /dashboard.

Approach
Use verification-before-completion before you report, systematic-debugging for any failure, and requesting-code-review once at the end. Project skills: testing-e2e, testing-unit, coding-standards.
Step 1, check the names. You need a web search tool. If you have none, stop now and tell the user; do not judge names from memory. List all 100 company names. For each, search for a real business with the same name, looking first at ECCP's own member directory and then at companies in the Philippines and in Europe. A clash is a real business with the same name, or with the same distinctive word in the same line of work. When a search is inconclusive, treat it as a clash. Keep a short record: the name, clash or clear, and the new name if any.
Step 2, rename. For each clash choose a new invented name in the same style, check that one too, and change the name, the initials and the website in the data. Ids do not change. Then find every place the old name is written out, in seeded messages, Testimonials, reasons and tests, and update it. Search the repository for each old name and confirm nothing remains.
Step 3, write the Run of Show. One page that prints on a single sheet: aim for under 500 words, as one table with a row for the Opening and each Stop and the columns Click, Say and If asked. Each Say is at most two sentences in plain spoken English. Take every button and screen name from the running Demo, not from this prompt. Mark each answer that awaits Richard with "Richard to confirm". Use this substance:
- Opening. Click Start. Say this is a preview built for ECCP, that ECCP has not joined, and that every company in it is invented. If asked whether these are ECCP's members: no, all 100 are invented, and the names were checked against real companies.
- Stop 1, Day 0. Run the import again and open one drafted profile. Say all ComLinked needs from ECCP is a list of company names and websites, and that a profile is built for each so no member starts from a blank form. If asked whether ComLinked needs members' email addresses: no, ECCP sends each member its claim link from its own address, with wording ECCP approves. Richard to confirm.
- Stop 2, Day 1. Open the message, claim the profile, show the three Matches and send the draft to Nordhavn. Say this is what a member receives under ECCP's name, and that within minutes she has three matched companies, one a forwarder that ships to Europe. If asked what others see before a member claims: only its name, industry, city and website; the description shows once the member has checked it. Richard to confirm. If asked what happens when a profile is wrong: the member corrects it during the claim.
- Stop 3, Day 2. Read the digest. Say every morning at 8:00 a member gets new leads, who viewed them and how their rank moved, which is the reason to come back. If asked whether AI contacts members: no, AI only drafts, a person sends, and everything works with it off.
- Stop 4, Day 14. Show Interest Signals, the conversation with Nordhavn and Wins. Say that two weeks in she can see by name who is interested, and that she and Nordhavn have both confirmed a first shipment to Europe. If asked whether a deal in two weeks is realistic: it is a first trial shipment, and across a chamber the plan's target is 20 deals in 90 days.
- Stop 5, Day 14. Use the filters, then the community manager's side to send one introduction, then return. Say this is ECCP's own screen, that its figures are the targets ComLinked would work toward by day 14 and not results, and that ECCP sees each member's status and nothing private. If asked how much work it is for ECCP's staff: one contact who sends the claim links, while ComLinked supplies the community manager. Richard to confirm.
- Stop 6. Point to the two asks. Say a pilot asks two things of ECCP, its member list and one contact, and is free for ECCP and its members. If asked how long a pilot runs, how member data is protected, or what follows the pilot and what it costs: each is Richard to confirm. Note beside the first that the glossary says 90 days, and beside the second that a privacy review comes before real members join.
Under the table add three short lines: before the meeting, open the link, press G once to check the guide opens, and close it; if asked how ComLinked will earn money, press G and switch on "Possible future pricing", and say it is not in the MVP and pricing is not decided; and a footer with the date the names were checked and the statement that the Demo sends and stores nothing.
Step 4, the documents.
- Feature status: update the date and the repository state at the top. Say that the Demo is presented by Richard in a first meeting and then sent as a private link, replacing "presented from a laptop" and "stays on the Mac". Record the network of 100 in the Next.js Demo, the one claim day, the basics-only rule, dated wins, the Activity View and the chamber roles. Add a short section on the Pilot Preview: its Stops, the Story Bar, the hidden later items and the ask. Add the four choices to "Open items for Richard".
- Plan, Adoption notes only: add the four choices awaiting Richard as new numbered items, each saying what the plan says today and what the Pilot Preview shows instead.
- SRS: add a version row dated today, and one open decision for each of the four choices, naming the requirements each would change (ASM-06 and TD-11; FR-A2-01 and FR-CH-02; FR-A1-01; and matching before a Claim). Change no requirement text.
Step 5, the final check. Go through every bullet under the spec's "Testing Decisions". For each, find the test that covers it. Where none does, add one to e2e/pilot-preview.spec.ts or the simulation's unit tests. Then run the whole suite. Walk the Preview yourself at 1280 and at 390 pixels as someone who has never seen it, and save a screenshot of the Opening and every Stop at both widths into test-results/pilot-preview/. If git does not ignore that folder, say so and do not add the files.
Step 6, defects. Fix a defect the final check finds only when the fix is small, about 20 lines or fewer, and inside the Pilot Preview's own files. Report anything larger with steps to reproduce, and leave it.
Step 7, run coding-standards on any code diff, then requesting-code-review, then Verification.

Acceptance criteria
- The record of the name check lists all 100 names with clash or clear, and every clash has a new name that was itself checked.
- A repository search finds no old name of a renamed Company, outside docs/mockup.
- The Run of Show exists at the path above, fits one printed page, has a row for the Opening and each of the six Stops, and every button it names is found in the running Demo.
- Each of the answers on the member list's contents, who sends claim links, what shows before a Claim, who supplies the community manager, the pilot's length, data protection and what follows the pilot is marked "Richard to confirm".
- The Run of Show carries the date of the name check.
- The feature status document, the plan's Adoption notes and the SRS's open decisions hold the changes in Step 4, and the plan's Sections 1 to 8 and the SRS's requirement text are unchanged, shown by the diff.
- Every bullet under "Testing Decisions" maps to a named test, listed in your report.
- The full suite passes, and the screenshots exist at both widths.
Quality is part of done.
- Clean: the Run of Show and the document edits use short sentences, sentence case, no emoji and no exclamation marks. No leftover notes or placeholders.
- Maintainable: the documents link to the spec instead of repeating it. Glossary terms are used as CONTEXT.md defines them. A renamed Company's name is written in one data row, and tests read names from the data where they can.
- Limits: no behaviour change beyond renames and a small defect fix. List anything worth fixing in your report.
Report the coding-standards result for any code you changed.

Verification
pnpm lint && pnpm type:check && pnpm test && pnpm build, then pnpm test:e2e.
Use NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co and NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder.
Port 3000 on this machine is often used by a different project, and Playwright reuses whatever answers there. Check what is on port 3000 first. If it is not ComLinked, run PLAYWRIGHT_PORT=3111 pnpm test:e2e. Never stop a server you did not start. A build clashes with a ComLinked dev server using the same .next folder; if one is running, ask the user to stop it.
Run pnpm exec prettier --check on every document you changed.
Report actual output, including anything skipped.

Guardrails
- Do not commit. Do not run git add, git commit or /ship unless the user asks in this session.
- Leave all work uncommitted on feat/website-redesign-pages. Do not switch or create branches, push, merge or open a PR.
- End your report with the changed files grouped by step, each group with a suggested Conventional Commit message, followed by the name check's record.
- Add no dependencies.
- When you search the web, search only for the invented company names. Send nothing about this project, its people or ECCP's plans to any outside service.
- Publish nothing: no page, no upload, no message to anyone. The Run of Show is a file in the repository.
- Promise nothing on Richard's behalf. An answer he has not confirmed is marked, never stated as settled.
- Never say ECCP has joined, agreed or endorsed anything. ECCP appears as text only, never a logo.
- Do not edit docs/mockup, CONTEXT.md, the plan's Sections 1 to 8 or the SRS's requirement text.
- If something here conflicts with the code or the spec, stop and ask.
```

## Outcome

Partly built on 2026-11-18. The name check ran. It found more clashes than one session could rename and re-check, and the session's limit of 200 web searches ran out. The user chose to do everything else now, and to rename later, including the website's example names.

**Done**

- **Run of Show:** `docs/presentations/2026-11-17-pilot-preview-run-of-show.md`. One table with a row for the Opening and each Stop, about 500 words.
  - Its button names were taken from the running Demo.
  - Its seven pending answers are marked "Richard to confirm".
  - Its footer records the name check's date and that the check is unfinished.
- **Feature status document:**
  - The Demo is now presented by Richard in a first meeting and then sent as a private link.
  - New sections or rows cover the network of 100 in the Next.js Demo, the Pilot Preview, the Activity View, the member import and the chamber roles.
  - The four choices are added to "Open items for Richard".
  - SRS version 0.3 is named.
- **Plan:** a new Adoption notes subsection with items 17 to 20. Sections 1 to 8 are unchanged; the diff only adds lines.
- **SRS:**
  - Version 0.3, with the title and document control bumped to match.
  - OD-13 to OD-16 name ASM-06 and TD-11, FR-A2-01 and FR-CH-02, FR-A1-01, and FR-L1-01 and FR-L1-03.
  - No requirement text changed. The other open decisions' rows changed only in column padding from Prettier.
  - The Word copy was not regenerated.
- **Tests:**
  - The top-bar test now covers Stop 2.
  - A new test, "the Run of Show › every click it names is on screen, Stop by Stop", clicks each button the Run of Show names, in its order.
  - A `section()` helper replaces the class locator for the Company's top-bar sections across the file.
- **Screenshots:** the Opening and every Stop at 1280 and 390 pixels, in `test-results/pilot-preview/`, which git ignores. The walk found no defect to fix.

**Checks run on the final code**

- Lint, type check and 327 unit tests pass (5 database tests are skipped, as before). The production build passes in a scratch copy, because a ComLinked dev server was running on port 3001.
- Browser tests run on a scratch-copy server on port 3111, with the presenter's example address:
  - The first full run passed 286 of 287. The one failure was the new Run of Show test, whose locator was ambiguous; it was fixed and passed when rerun.
  - A rerun of the Pilot Preview spec after the review fixes ran while the Mac slept, so it hit browser errors and timeouts. Its five failures all passed when rerun.
  - A final full run, again while the Mac kept dropping into sleep, passed 278 of 287. Of its 9 failures, 8 passed when rerun alone. The ninth is the website's accessibility check on `/`, whose animated ring fails colour contrast at times; it did so before ticket 05 too.
- Prettier passes on every changed document.

**Testing Decisions, each with its test**

- **Service seam** (`src/services/comlinked/simulation.test.ts`):
  - Each Stop's state, the same on a repeat run and whatever came before: "opening a Stop › opens each Stop on its day…" and "…builds the same state every time, whatever was done before".
  - Day 0: "Day 0, before any Claim › holds no activity, no claimed Company and no points".
  - 100 Companies and Nordhavn a day-one Match: "the network of 100 › holds Kalayaan Foods, the 39 original companies and 60 European-style members" and "Kalayaan Foods' story with 100 Companies › makes Nordhavn a day-one Match…".
  - None of the 60 but Nordhavn in Kalayaan's Matches, leads or interested Companies: "…keeps the 60 out of what Kalayaan Foods buys and sells, apart from Nordhavn".
  - Claim days: the "the claim schedule" group, at least eight others claimed on Day 1, exactly 40 on Day 14 and everyone in the story claimed.
  - A Company that has not claimed never acts: "two weeks in, on Day 14 › has nobody acting before the day it claimed", "a Company that has not claimed › holds no points until its claim day" and "…is left out of Monthly Top Companies…".
  - Basics only, a reason from the viewer's needs, no Connect, a waiting message: the "what a Company may see of another" and "contacting a Company that has not claimed" groups.
  - Day 1's one lead that has not claimed: "…has three day-one Matches that have all claimed, and one lead that has not".
  - Day 14's 40, 20, 4, 3 and 2, and one status each: the "ECCP's Activity View" group.
  - An introduction clears needing an intro: "…clears needing an intro with an introduction, and the Team Dashboard's queue agrees".
  - Dated wins: "dated wins and deals › shows no win before its day, and none through Day 2".
  - The two switches: "the later items › are both off whenever the Opening or a Stop opens", and the full Demo's starts in the same group.
  - The chamber's name from the setting: "the chamber's name and its counts › names the chamber from the one setting" and "…names the chamber in its titles from the one setting".
  - Two weeks in and Stop 4: "…builds Stop 4 from the same seed as Two weeks in…".
- **Browser** (`e2e/pilot-preview.spec.ts` unless named):
  - The walk with Next alone, laptop and phones: "Next alone walks the Opening and the six Stops at 1280 / 390 / 360 / 1440 pixels".
  - The live Claim: "Stop 2 › its button opens the first claim screen, and the Claim ends on three Matches with Nordhavn".
  - Reload, a cold address, an unknown Stop and the Back button: "a reload on Stop 4's Interest Signals tab…", "Stop 5's address opened in a new tab…", "an address naming Stop 9…" and "the browser's Back button…".
  - Top bar and Seat line on Stops 1, 2 and 5: "the top bar follows the Seat", and `expectStop` on every Stop.
  - ECCP's view and the side step: the "Stop 5, ECCP's Activity View" and "the side step from Stop 5" groups.
  - Later items: "with the previews hidden…", "switching on possible future pricing…" and "switching on the after-MVP previews…".
  - Guide: "the Presenter Guide has no button in the Preview, opens with G…".
  - The ask: "Email Richard is a link that opens a new message…". **The fallback with no address set has no browser test,** because one server cannot run both with and without the address. The seam test "the presenter's contact › is nothing when no address is set" covers it, and ticket 04 checked it by hand.
  - Exploring: the "exploring after Stop 6" group.
  - The website form: `e2e/website-redesign.spec.ts` "for chambers page › a valid form confirms honestly and opens the Pilot Preview's Opening".
  - Keyboard, reduced motion and axe: "from the keyboard, Back and Next…", "with reduced motion…" and "the Opening and every Stop pass axe".

**Left for the rename pass**

- Rename the 37 clashes and the 9 inconclusive names, and check the 10 names not yet searched.
  - Check each new name the same way.
  - The website's example names change too, as the user chose: Maple Bay Grocers, Pacific Pack Solutions, Northline Logistics, Hapag Kitchen Group and Kainan Catering Co. are flagged.
  - Several renames touch the story: two of the day-one Matches, Lakbay Hotels (the side step's member), Northline Logistics (the waiting member), Palengke Online and both sides of the two deals by Day 14.
  - Seeded messages, Testimonials, tests, the spec and the tickets name them.
- Run the `site:eccp.com` checks, which the search limit stopped.
- Some clear verdicts rest on two searches without the Philippines follow-up: Mareva, Vossberg, Lindqvist, Windbrook, Montclair, Strand and Hale, and Kovacs.
- Update the Run of Show's footer and the status document's name check line when the renames are done.
- The sender name "ECCP Membership" is ECCP's own, so it was not checked.

**Name check record, 2026-11-18**

A clash is a real business with the same name, or with the same distinctive word in the same line of work. Inconclusive counts as a clash. Searches carried the invented names only.

| #   | Name                              | Verdict      | Evidence                                                         |
| --- | --------------------------------- | ------------ | ---------------------------------------------------------------- |
| 1   | Kalayaan Foods Inc.               | clear        | no match                                                         |
| 2   | Maple Bay Grocers                 | inconclusive | Maple Bay Marina, Canada, listed under a grocery category        |
| 3   | Pacific Pack Solutions            | clash        | Allied Pacific Packaging Solutions Corp., box maker, Cebu        |
| 4   | Northline Logistics               | clash        | Northline, freight and logistics, Australia                      |
| 5   | Luntian Foods Inc.                | clear        | no match                                                         |
| 6   | Tala Print and Label              | clear        | no label printer; Tala lending app unrelated                     |
| 7   | Bayan Cold Storage                | clear        | no match                                                         |
| 8   | Sari Central Wholesale            | clear        | no match                                                         |
| 9   | Hapag Kitchen Group               | clash        | Hapag, restaurant, Makati                                        |
| 10  | Kainan Catering Co.               | inconclusive | "Kainan sa Laguna" among caterers; common eatery word            |
| 11  | Malaya Export Traders             | inconclusive | Malayan Traders Syndicate, Singapore                             |
| 12  | Tibay Crates and Pallets          | clear        | no match                                                         |
| 13  | Sinag Energy Systems              | clash        | PV Sinag Power Inc., solar, Philippines                          |
| 14  | Agos Water Services               | inconclusive | "Agos" water-access programme, Philippines                       |
| 15  | Lakbay Hotels                     | clash        | Lakbay Philippines condo hotel, Baguio                           |
| 16  | Buhay Pharmacy Chain              | clear        | no match                                                         |
| 17  | Tanim Farm Cooperative            | inconclusive | "Tanim Farm" farming programme, Cavite                           |
| 18  | Hilaga Spice Traders              | clear        | no match                                                         |
| 19  | Daloy Fleet Rentals               | clear        | no match                                                         |
| 20  | Alon Digital Studio               | clear        | no match                                                         |
| 21  | Pandayan Equipment                | inconclusive | Pandayan Superstores, filed under machinery wholesale            |
| 22  | Bukas Office Canteens             | clear        | no match                                                         |
| 23  | Bigasan Rice Mills                | clash        | "Bigasan" rice sellers, e.g. R&R Bigasan                         |
| 24  | Kapwa Snack Foods                 | clear        | no match                                                         |
| 25  | Lasa Frozen Foods                 | clash        | Lasa Kitchen, frozen Filipino meals, US                          |
| 26  | Ginhawa Bakeshop Supply           | clear        | no match                                                         |
| 27  | Masagana Dairy                    | clear        | Masagana Farm produces eggs, not dairy                           |
| 28  | Sariwa Produce Trading            | clear        | no match                                                         |
| 29  | Dagat Seafood Supply              | inconclusive | Cagayaman Dagat Seafood Restaurant                               |
| 30  | Tamis Confectionery               | inconclusive | Tanis Confectionery, Netherlands, one letter off                 |
| 31  | Palengke Online                   | clash        | Philstar "Palengke Online Bazaar"; many online palengkes         |
| 32  | Paaralan Canteen Services         | clear        | no match                                                         |
| 33  | Tindahan Convenience Stores       | clash        | Tindahan Grocery, Canada                                         |
| 34  | Biyahe Couriers                   | clear        | no match                                                         |
| 35  | Kahon Corrugated                  | clear        | Kahon Storage is storage, not boxes                              |
| 36  | Selyo Compliance Services         | clear        | no match                                                         |
| 37  | Sulit Accounting                  | clear        | no match                                                         |
| 38  | Himig Events                      | clear        | no match                                                         |
| 39  | Gabay Trade Consultants           | inconclusive | Gabay Research Philippines, consulting                           |
| 40  | Kalye Food Carts                  | clash        | Kalye Grill and Lumpia food truck, US                            |
| 41  | Nordhavn Freight Forwarders       | clear        | port district and a yacht brand only                             |
| 42  | Vanderhoek Customs Brokerage      | clear        | no match                                                         |
| 43  | Albaport Bonded Warehousing       | clear        | no match                                                         |
| 44  | Kestrel Air Cargo                 | clash        | Kestrel Liner Agencies, airfreight, UK                           |
| 45  | Mareva Shipping Agency            | clear        | no match (Philippines follow-up not run)                         |
| 46  | Albrecht Precision Philippines    | clash        | Albrecht Präzision, Germany                                      |
| 47  | Vossberg Automation               | clear        | no match (Philippines follow-up not run)                         |
| 48  | Lindqvist Pumps and Valves        | clear        | no match (Philippines follow-up not run)                         |
| 49  | Caravel Steel Trading             | clash        | The Caravel Group, steel raw materials, Hong Kong                |
| 50  | Heliotek Solar                    | clash        | Heliotek, solar, Costa Rica; HelioTek USA                        |
| 51  | Windbrook Energy                  | clear        | no match (Philippines follow-up not run)                         |
| 52  | Aquaterra Water Technologies      | clash        | Aquaterra Corp., water filtration, Canada                        |
| 53  | Montclair Building Supplies       | clear        | no match (Philippines follow-up not run)                         |
| 54  | Strand and Hale Construction      | clear        | no match (Philippines follow-up not run)                         |
| 55  | Orbis Specialty Chemicals         | inconclusive | Orbi Chemicals NV, Belgium                                       |
| 56  | Brightlane Software               | clash        | Brightlane.com, Inc., US, small-business services                |
| 57  | Kovacs Cyber Security             | clear        | no company (Philippines follow-up not run)                       |
| 58  | Telvero Business Telecom          | clash        | Telvero, telecom, US                                             |
| 59  | Datavia Analytics                 | not searched | search limit reached                                             |
| 60  | Lumen Shared Services             | not searched | search limit reached; Lumen Technologies is a known brand        |
| 61  | Hartmann Reyes Law                | clear        | no match                                                         |
| 62  | Eastbridge Audit Partners         | clear        | no match                                                         |
| 63  | Sterling Rivera Insurance Brokers | clash        | Sterling Insurance, Makati; Sterling Insurance Brokers, Malaysia |
| 64  | Meridia Trade Bank                | clash        | Meridian Trade Bank, Latvia                                      |
| 65  | Talentia Recruitment              | clash        | Talentia Software's recruitment product; Talentia Group, UK      |
| 66  | Keystone Market Advisory          | clash        | Keystone, market-entry consulting                                |
| 67  | Polyglot Translation              | clash        | Polyglot Latvia, translation                                     |
| 68  | Veritas Payroll                   | clash        | Veritas Prime, payroll outsourcing                               |
| 69  | Crestline B2B Marketing           | inconclusive | Crestline Promotional Products, US                               |
| 70  | Academia Europa Training          | clash        | Academia Europa, training, Spain                                 |
| 71  | Medivant Pharma Distribution      | clash        | Medivant Healthcare, US                                          |
| 72  | Sanavita Diagnostics              | inconclusive | Sanavita Pharmaceuticals, Germany                                |
| 73  | Ortomed Devices                   | not searched | search limit reached                                             |
| 74  | Kalinga Wellness Hospital         | not searched | search limit reached                                             |
| 75  | Azur Bay Resort                   | not searched | search limit reached                                             |
| 76  | Regalia Business Hotel            | not searched | search limit reached                                             |
| 77  | Vinoteca Wine Importers           | not searched | search limit reached                                             |
| 78  | Caffè Montagna Roasters           | not searched | search limit reached                                             |
| 79  | Fromagerie Alpine                 | not searched | search limit reached                                             |
| 80  | Maison Ardenne Chocolates         | not searched | search limit reached                                             |
| 81  | Travelnova Corporate Travel       | clear        | Travanova spelled differently                                    |
| 82  | Eventhaus Exhibitions             | clash        | EventHaus Ltd, trade shows, Ireland                              |
| 83  | De Bakkerij Artisan Bread         | clash        | De Bakkerij, bakery, Netherlands                                 |
| 84  | Olivia Mediterranean Foods        | inconclusive | Olivia's Greek Food, UK restaurant                               |
| 85  | Brauhaus Manila                   | clash        | Brauhaus pub, Makati                                             |
| 86  | Salumeria Emilia                  | inconclusive | generic words; Emilia charcuterie store, Australia               |
| 87  | Gelateria Dolomiti                | clash        | Gelateria Dolomiti, Austria                                      |
| 88  | Alpenmill Flour Trading           | clear        | no match                                                         |
| 89  | Fruta Viva Juices                 | inconclusive | Fruta Viva de Juver trademark, cancelled                         |
| 90  | Maison Blanc Linens               | inconclusive | Grande Maison de Blanc, linens, US                               |
| 91  | Vela Skincare                     | clash        | Vela Days, skincare, Australia                                   |
| 92  | Haus and Holm Furniture           | clear        | no match                                                         |
| 93  | Velomotor Auto Parts              | inconclusive | Velomotors, bikes and scooters, Russia                           |
| 94  | Klarwerk Facility Services        | clash        | KlarWerk Service, facility services, Germany                     |
| 95  | Sentinel Guard Services           | clash        | Sentinel Guard Services, exact name                              |
| 96  | Arcadia Business Parks            | clash        | Arcadia Business Park, US                                        |
| 97  | Brightwater International School  | clash        | Brightwater State School, Australia                              |
| 98  | Greenfield Agri Machinery         | clash        | Greenfields Agricultural Machinery, Cebu                         |
| 99  | Portside Ship Repair              | clash        | Portside Marine Service, US                                      |
| 100 | Aerolux Aviation Services         | clash        | Aerolux Ltd, aircraft galleys, UK                                |

Totals: 37 clash, 9 inconclusive, 10 not searched, 44 clear.
