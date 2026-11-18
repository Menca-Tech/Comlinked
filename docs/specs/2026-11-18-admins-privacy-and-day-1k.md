# Paywall off, Day 1k, admins and privacy

**Status:** built, 2026-11-19, on `feat/website-redesign-pages`. Nothing pushed. The five questions for Richard in [Further Notes](#further-notes) still await him.

- Ticket 01, pricing off and the Chamber Size of 1,000: built, last commit `6f1ab4f`.
- Ticket 02, the account menu, roles, privacy and Contact Requests: built, last commit `22bcf95`.
- Ticket 03, the logo, Profile Strength from 55% and these documents: built; its Outcome is in `.scratch/admins-privacy/issues/03-logo-and-close-out.md`.
  **Date:** 2026-11-18
  **Source:** the meeting with Richard on 2026-11-18 (the user's first action item) and the grilling on it the same day (13 decisions). The user confirmed them by running `/to-spec`.
  **Deadline:** in the Vercel demo link shown at the Mapua meeting on 2026-11-19. If time runs short, build in the order given in [Priority if time runs short](#priority-if-time-runs-short).
  **Feature IDs:** C1 Company connections (refined: who sends and who accepts), A4 Profile strength meter (a logo step), L2 ComDash interest signals (no tiers unless switched on). Day 1k changes the Pilot Preview, specified in [2026-11-17-pilot-preview.md](2026-11-17-pilot-preview.md).
  **Vocabulary:** [CONTEXT.md](../../CONTEXT.md). New terms are proposed in [Words](#words).
  **Works on:** the current branch `feat/website-redesign-pages`, at or after f13f190. Waits for nothing.

## Problem Statement

Richard walked through the Demo with the user on 2026-11-18 and asked for changes before it goes in front of more people. Tomorrow it is shown at Mapua from the Vercel link, and later to ECCP.

Four things in the Demo work against what Richard and ECCP need to see:

- **It looks paid.** The full Demo opens as a Free member with names blurred, an upgrade box and "See who". Richard decided to turn the paywall off for now: showing members that ComLinked earns from them straight away is the wrong first message. The build plan already postpones premium plans and paywall blur until after the pilot.
- **It looks small.** ECCP has about 1,000 member companies, and ECCP sends the claim email to all of them. The Demo's chamber has 100, so ECCP's view ("40 of 100 claimed") doesn't look like ECCP.
- **One person holds the whole company.** A Company has one Authorized Representative and an alternate who can be swapped in. Richard asked who manages Connections when that person is away or leaves. He wants a primary and a backup admin, plus people in sales and procurement who can reach out without being able to accept.
- **Nothing says what a Connection exposes.** Other Companies' profiles show no people at all, so the Demo can't answer the question Richard raised: once two Companies connect, whose names, titles and contact details does the other side see? Companies will want control, and spam has to be kept down.

Richard also wants a Company's logo shown prominently on its profile. Today every Company is an initials mark.

## Solution

Five changes to the Demo, all behind the existing ComLinked Service Seam, with nothing stored or sent:

1. **Pricing starts off everywhere.** "Possible future pricing" starts off in the full Demo as well as in the Pilot Preview. ComDash shows every name and every Interest Signal with no tier. The Presenter Guide's switch still turns the Free, Growth and Pro views on.
2. **The chamber has 1,000 members.** ECCP's figures count 1,000 member companies, and the totals scale up (about 400 claimed by Day 14). Only the 100 Example Companies are named, and the screens say so.
3. **Kalayaan Foods has four people with roles.** Ana Reyes is the primary admin and Marco Dizon the backup admin. Both send and accept Connection Requests and manage people. An invented sales user and an invented procurement user send requests but can't accept them. A page lists them, each with a plain line saying what they can do.
4. **Each person controls what connected Companies see.** Connected Companies see each person's full name and title unless that person switches to an alias ("Ana R.") or hides their title. Email and phone show only after that person shares them in answer to a Contact Request. This works in both directions:
   - On Kalayaan's side, Ana's own privacy page shows one Contact Request waiting.
   - On the other side, connected Companies' profiles gain a People section with "Ask for contact details".
5. **Kalayaan can add a logo.** "Add your logo" joins the profile checklist. Once added, the logo appears large at the top of Kalayaan's profile and in the new account menu. Other Companies keep their initials, shown in the same large spot.

Everything new is reached from a LinkedIn-style **account menu** on the company mark at the top right. It holds Ana's name and role, "View company profile", then "Admins and authorized users" and "Privacy and contact details", then "Sign out".

The Pilot Preview keeps its six Stops. The Run of Show gains one likely question, answered by opening the account menu at Stop 4.

## User Stories

### The presenter (Richard)

1. As the presenter, I want the full Demo to open with no prices, tiers or blurred names, so that nobody at Mapua or ECCP thinks ComLinked charges members on day one.
2. As the presenter, I want to still be able to switch on "Possible future pricing" from the Presenter Guide, so that I can show the idea when someone asks how ComLinked will make money.
3. As the presenter, I want a page reload to turn pricing off again, so that I never start a showing by accident with tiers on.
4. As the presenter, I want ECCP's figures to count 1,000 members, so that the Chamber Leader recognises their own chamber.
5. As the presenter, I want the six Stops unchanged, so that the walkthrough I rehearsed still takes about 10 minutes.
6. As the presenter, I want the Run of Show to tell me how to answer "Who in a company can connect, and what do others see?", so that I can open the account menu at Stop 4 without improvising.
7. As the presenter, I want every new screen to work on a phone, so that people following the link on their own phone see the same thing I do.
8. As the presenter, I want every new name, email, phone and logo to be clearly invented, so that no real person or company appears in the Demo.

### The Chamber Leader and the Chamber Contact (ECCP)

9. As the Chamber Leader, I want Day 0 to say 1,000 profiles were built from our Member List, so that the scale matches the claim email we would send.
10. As the Chamber Leader, I want Day 14 to show about 400 of 1,000 claimed and about 200 active, so that I see the pilot targets at our real size.
11. As the Chamber Leader, I want deals and wins to stay at the plan's honest pace (about 3 deals and 1 or 2 wins by Day 14), so that the numbers look like targets, not a sales pitch.
12. As the Chamber Contact, I want the Activity View's member list to say it shows only example members, so that I am not misled into thinking 100 names are the whole chamber.
13. As the Chamber Contact, I want the status filters and group counts to add up to 1,000, so that the figures agree with each other.
14. As the Chamber Contact, I want an announcement to say how many of the 1,000 have claimed and will receive it, so that I know its reach.

### Ana Reyes, Kalayaan Foods' primary admin

15. As Ana, I want a menu on my company's mark at the top right, so that I can reach my account and company settings in one tap, as on LinkedIn.
16. As Ana, I want the menu to show my name, my role and my company, so that I know which account I'm in.
17. As Ana, I want "View company profile" in the menu, so that the shortcut I had before (tapping the mark) is still one tap away.
18. As Ana, I want "Admins and authorized users" in the menu, so that I can see who can act for Kalayaan Foods.
19. As Ana, I want each person listed with their job title, role and a plain line of what they can do, so that I understand the difference between an admin and an authorized user.
20. As Ana, I want to make Marco the primary admin, so that the company is covered if I leave or step back.
21. As Ana, I want to remove an authorized user, so that someone who leaves the company loses access.
22. As Ana, I want to be told that all our Connections stay with the company when someone is removed, so that I trust that relationships belong to Kalayaan Foods, not to a person.
23. As Ana, I want to be the only one who can remove the backup admin, so that the backup can't lock me out.
24. As Ana, I want to see when a Contact Request is waiting for one of my colleagues, without being able to answer it for them, so that I know their personal details are theirs to give.
25. As Ana, I want "Privacy and contact details" in the menu, so that I can decide what connected Companies see of me.
26. As Ana, I want to show my name as an alias ("Ana R."), so that connected Companies can't search for me elsewhere if I'd rather they didn't.
27. As Ana, I want to hide my job title, so that I share only as much as I choose.
28. As Ana, I want a preview of how connected Companies see me, so that I can check the effect of my choices.
29. As Ana, I want my email and phone kept hidden until I share them, so that a Connection doesn't open me up to spam.
30. As Ana, I want to see a waiting Contact Request from Nordhavn Freight Forwarders and choose Share or Decline, so that I decide who gets my details.
31. As Ana, I want declining to be quiet, so that I can say no without awkwardness.
32. As Ana, I want to know that Companies I'm not connected to see no people at all, so that I know exactly when my name is exposed.
33. As Ana, I want "Sign out" in the menu, so that the Demo feels like a real account.
34. As Ana, I want to add my company's logo from the profile checklist, so that our profile looks like us.
35. As Ana, I want the logo shown large at the top of our profile and on the menu, so that other Companies recognise us at a glance.
36. As Ana, I want adding the logo to raise our Profile Strength, so that I have a reason to do it.

### Ana, looking at another Company

37. As Ana, I want a connected Company's profile to show its people (name, title, role), so that I know whom to talk to.
38. As Ana, I want to ask one of their people for contact details, so that I can reach them outside ComMail when it matters.
39. As Ana, I want to see that my request is waiting and who decides, so that I know what happens next.
40. As Ana, I want their details to appear once they share them, with a Notification, so that I know when I can reach them.
41. As Ana, I want no People section on a Company I'm not connected to, only a line saying people show once connected, so that the rule is clear.
42. As Ana, I want a person who uses an alias to appear by that alias, so that I respect their choice.

### Marco Dizon and the authorized users (described, not seen as themselves)

43. As Marco, the backup admin, I want the same powers as Ana except removing her, so that I can accept Connection Requests while she's away.
44. As the sales user, I want to send Connection Requests to possible customers, so that I can find business without waiting for an admin.
45. As the procurement user, I want to send Connection Requests to possible suppliers, so that I can source without waiting for an admin.
46. As an authorized user, I want an admin to accept incoming requests, so that the company controls who it connects with.

### Honesty, access and upkeep

47. As the user, I want the build plan, the SRS, the glossary, the Pilot Preview spec and the Run of Show to match what the Demo shows, so that the next planning session starts from the truth.
48. As the user, I want every choice Richard hasn't confirmed marked as such, so that nothing reaches ECCP as settled when it isn't.
49. As a keyboard or screen reader user, I want the menu, the pages and the switches to work and announce themselves properly, so that the Demo passes the same accessibility checks as the rest.
50. As anyone, I want every flow here to work with the AI Assistant off, so that the non-negotiable holds.

## Happy and sad paths

### Happy paths

- **Pricing.** The full Demo opens on ComDash with every name shown and no switcher. The presenter opens the guide (G) and switches on "Possible future pricing": ComDash opens on Free member as it does today. A reload turns pricing off again.
- **Day 0.** The import counts profiles built up to 1,000. It lists the Example Companies and adds "and 900 more from the Member List".
- **Day 14, ECCP's view.** The tiles read about 400 of 1,000 claimed, about 200 active, a few dozen needing an intro, about 3 deals and 1 or 2 wins. The member list is headed "1,000 members", shows "Showing the 100 example members of 1,000" and groups the named Companies by status.
- **Roles.** Ana opens the menu, then "Admins and authorized users", and sees four people:
  - Ana Reyes, Owner, Primary admin
  - Marco Dizon, Backup admin
  - a sales and a procurement user, each an Authorized user

  Each has a line of what they can do. She makes Marco primary: their roles swap, and her menu now says Backup admin. She removes the sales user, and a toast says they no longer have access and all N Connections stayed with Kalayaan Foods.

- **Privacy.** Ana opens "Privacy and contact details" and switches to "Ana R.": the preview card changes. A request from Nordhavn waits under "Waiting for you". She taps Share, and a toast confirms Nordhavn can now see her email and phone.
- **Asking.** On Nordhavn's profile (connected), Ana sees its people and taps "Ask for contact details" on one of them. The button becomes "Asked. {first name} decides." After "Next morning", the email and phone appear and a Notification says they were shared.
- **Logo.** At Claim the profile checklist offers "Add your logo: +10%". Ana adds it, and Profile Strength rises by 10. The logo now shows large at the top of the profile and on the top-right mark. In the two-weeks-in preset the logo is already added.

### Sad paths

- Ana tries to remove herself: there is no Remove on her own row.
- Ana is the backup admin (after the swap) and looks at Marco's row: there is no Remove, because only the primary admin can remove the other admin.
- A Contact Request waits for Marco: the people page shows it as waiting with no Share or Decline. Only Marco can answer.
- Ana asks the same person twice: the button stays "Asked" until they answer. There is no second request.
- Ana declines Nordhavn's request: the toast says "Declined. Nordhavn won't be told." The request leaves the list, and her details stay hidden from Nordhavn.
- Ana opens a Company she isn't connected to, or one with a Connection Request still pending: there is no People section, only "People show once you're connected."
- Ana opens a connected Company that has no hand-written people: its People section says "No people listed yet."
- A Company that hasn't claimed: still basics only, as the Pilot Preview spec decides. There are no people and no Ask.
- The presenter switches pricing on, then reloads: pricing is off again and ComDash names everyone.
- "Show all" on a status group shows only that status's Example Companies, labelled as examples. It never says "all 400" while showing 40.
- With the AI Assistant off, every flow above works the same. Nothing here uses AI.
- On a phone (375px wide), the menu opens as a sheet from the bottom. The pages stack in one column with no sideways scroll, and every target is at least 44px.

## Implementation Decisions

### Pricing default

- "Possible future pricing" (a Later item) starts **off** in the full Demo as well as the Pilot Preview. "After-MVP previews" keeps today's behaviour: off in the Pilot Preview, on in the full Demo. The Presenter Guide's note under Later items states each item's default separately.
- When the presenter switches pricing on, ComDash behaves exactly as today: it opens on Free member, with Growth and Pro available.
- A full page load resets the simulation (ADR 0010), so pricing is off again after a reload.
- This replaces the default set by decision 26 of the ComDash redesign (the full Demo opened on Free member). The tier designs themselves don't change.

### The Chamber's size

- The chamber setting (the one place that names ECCP) gains the **Chamber Size: 1,000**. Renaming or resizing the chamber still changes one file.
- The **Example Companies** are the 100 named Companies: Kalayaan Foods plus the 99 in the network. They are unchanged: no Company is added, removed or renamed by this spec.
- **Chamber-wide figures scale with the Chamber Size.** The figures are claimed, active, quiet, needs an intro and not yet claimed, on every day. Each is made of two parts, and the figures always add up to the Chamber Size:
  - **The Example Companies, live.** Their figure as the simulation holds it, including what happens during the session (Kalayaan's Claim, an Intro).
  - **The 900 unnamed members, fixed.** The rest of the Chamber Size follows the Example Companies' claim schedule and activity records alone. For each day, each status gets (Chamber Size − Example Companies) / Example Companies, which is 9, times the number of Example Companies the schedule puts in that status that day, unaffected by session actions.
  - So Day 14 reads 400 claimed with no session actions, and one Intro at Stop 5 moves "needs an intro" from 40 to 39, not to 30.
- **Event figures don't scale.** Deals confirmed, wins posted, the Success Wall and Monthly Top Companies come from the Example Companies only, because each carries a name. This keeps Day 14 at the build plan's pace (20 deals and 10 Testimonials over 90 days).
- **Kalayaan's own world stays on the Example Companies.** Matches, the Daily Lead List, search, Search Rank, Interest Signals, the Network Ring and Intros don't change. No screen seen from a Company's Seat states the chamber's size as 100. Any copy that does is changed to read the Chamber Size or to drop the number.
- **ECCP's screens:**
  - The Activity View's tiles, status filter counts and status group counts read the scaled figures, and the member list is headed with the Chamber Size.
  - The member list names only Example Companies and always shows a line saying so ("Showing the 100 example members of 1,000"). A group's "Show all" names how many examples it will show. It never claims to show the scaled count.
  - The Community Manager's import counts profiles built up to the Chamber Size, and the Member List screen shows the Example Companies plus a line for the rest ("and 900 more from the Member List").
  - An announcement's confirmation counts the scaled claimed figure ("Sent to 400 members who have claimed.").
  - The Team Dashboard (a Later item) follows the same rule for any chamber-wide figure.
- **Pilot Preview copy:** Stop titles, Story Bar lines and Run of Show lines that state a count read the Chamber Size. Stop 1 says 1,000 profiles built and claim links ready.

### People of a Company

- A Company may hold a list of **people**. Each person has:
  - a name
  - a job title
  - a role (primary admin, backup admin, or authorized user with an area: sales or procurement)
  - whether they show an alias
  - whether they show their title
  - an invented email and phone
- **Kalayaan Foods has four:** Ana Reyes (job title Owner, primary admin), Marco Dizon (backup admin; the executer picks a fitting title), one sales and one procurement authorized user. The executer invents the two new names, Filipino names to suit Kalayaan. The existing `rep` and `altRep` become the two admins. Every place that reads the single rep today (the agent's "Approver", thread signatures, the meeting's attendees) keeps working by reading the primary or backup admin.
- **Connected Companies:** the day-one Matches and every Company Kalayaan is connected to in the two-weeks-in preset get 1–2 hand-written people each (today: Nordhavn Freight Forwarders, Maple Bay Grocers, Pacific Pack Solutions and Tala Print and Label), with names that suit the Company (European-style for the European members). Any other connected Company shows "No people listed yet."
- **Contact details are invented.** Emails use the same reserved example domain as the websites. Phone numbers must be visibly fake and not a working number, e.g. zeros after the area code.

### Roles and what each can do

- **Primary admin and backup admin:**
  - Both send and accept Connection Requests, manage people (remove an authorized user, make the backup the primary) and see Contact Requests waiting for colleagues.
  - Only the primary admin can remove the backup admin.
  - No one can remove themselves.
- **Authorized user:** sends Connection Requests in its area (sales to possible customers, procurement to possible suppliers) and can't accept them.
- **Described, not enforced.** The Demo stays signed in as Ana, so no screen applies an authorized user's limits. The limits are stated on the people page only. There is no switching between people.
- **Making the backup primary** swaps the two admins' roles. It replaces today's "Assign new rep" swap, and the Company page's "Authorized rep" row becomes a link to the people page.
- **Removing a person** keeps today's message: "{name} no longer has access. All N connections stayed with your company." The person disappears from the list, and from People sections and Contact Requests.
- **No cap is shown.** There is no "Invite a person" and no seat limit on the page. How many people a Company may have is an open question for Richard.
- **For the real build:** primary admin maps to the Org Role `owner`, backup admin to `admin`, and authorized user to `member` with an area. The words "super admin" are used nowhere, because Superadmin is ComLinked Staff's Platform Role.

### Account menu

- The company mark at the top right opens the account menu instead of going straight to the Company page. It shows the logo once added, otherwise the initials. It appears wherever the mark appears today (after the Claim).
- **Contents, in order:**
  - a header with the mark, Ana's name, her role and the Company's name
  - a "View company profile" button
  - a MANAGE group holding "Admins and authorized users" and "Privacy and contact details"
  - "Sign out"
- **Sign out** goes to the website's homepage. Coming back to `/app` continues the session's simulation until a reload, as with any navigation today.
- On a laptop it is a dropdown anchored to the mark; on a phone it is a sheet from the bottom. Use the existing shadcn/ui primitives the app already uses for menus and sheets. Escape closes it and focus returns to the mark. Its button has an accessible name that says it opens the account menu.
- The header's role follows the swap: after making Marco primary, Ana's menu says Backup admin.

### Admins and authorized users page

- Its own address under `/app`, reached from the menu, in App Mode and the Demo's premium-pass styling.
- One row per person: mark or initials, name, job title, role, and the plain line of what they can do. The lines are:
  - **Primary admin:** "Sends and accepts connection requests, and manages people. The only one who can remove the backup admin."
  - **Backup admin:** "Sends and accepts connection requests, and manages people. Covers for the primary admin."
  - **Sales:** "Sends connection requests to possible customers. An admin accepts requests."
  - **Procurement:** "Sends connection requests to possible suppliers. An admin accepts requests."
- Actions follow the rules above: "Make primary admin" on the backup, and "Remove" where allowed.
- A line under the list: "Connections belong to Kalayaan Foods, not to any one person."
- A Contact Request waiting for a colleague shows on that colleague's row as waiting, naming the Company that asked, with no answer buttons. The Demo includes one, for Marco from another connected Company.

### Privacy and contact details page

- Its own address under `/app`, reached from the menu. It holds Ana's own settings only, because each person decides for themselves.
- **"How connected companies see you":** a preview card of Ana as a connected Company sees her, updating as she changes settings.
- **Name:** a choice between "Ana Reyes" and "Ana R." (first name and last initial).
- **Job title:** a switch, on by default.
- **Email and phone:** a fixed line, not a switch: "Shared only with companies you approve, one request at a time." It is followed by the Companies she has shared with.
- **"Waiting for you":** Contact Requests to Ana, each with Share and Decline.
  - Share: "{Company} can now see your email and phone."
  - Decline: "Declined. {Company} won't be told."
- A line stating that Companies she isn't connected to see no people at all.
- Changes apply at once across the Demo.

### What a Company may see of another

The existing rule at the Service Seam (claimed Companies show their profile, unclaimed show basics only) gains people. People are shown on the profile of another Company (the viewed Company), when Kalayaan is the viewer:

- **Not connected, or a Connection Request pending:** no people, and "People show once you're connected."
- **Connected:** each person's shown name (alias or full name), title (unless hidden) and role label. Email and phone are shown only if that person has shared them with the viewing Company.
- **Not claimed:** basics only, unchanged (Pilot Preview spec, decision 24).
- Screens ask the seam for what they may show. A screen never filters people itself.

### Contact Requests

- **Outgoing:**
  - On a connected Company's profile, each person whose details Kalayaan doesn't have shows "Ask for contact details". Asking marks the request as waiting ("Asked. {first name} decides."), and asking again isn't possible.
  - On the next simulated morning the person shares: the details appear and a Notification says "{name} shared their contact details."
- **Incoming:**
  - Nordhavn's request for Ana arrives on the morning after Kalayaan and Nordhavn connect. It is present in the two-weeks-in preset if they are connected there. If Nordhavn isn't connected in that preset, use a day-one Match that is.
  - It appears under "Waiting for you" and as a Notification.
  - Marco's waiting request (from a different connected Company) appears only on the people page.
- **Only the person answers.** Admins see a colleague's request but can't answer it.
- A Contact Request is a new kind of record in the simulation, with the Company that asked, the person asked, the day, and its state: waiting, shared or declined.

### Logo and Profile Strength

- Kalayaan's Pre-built Profile has no logo. The profile checklist offers "Add your logo: +10%", alongside the photo step.
- **Profile Strength stays out of 100.** The base drops from 65 to 55, and the logo adds 10, so a complete profile is still 100%. Day-one Profile Strength therefore reads 55% instead of 65%. Update every figure and test that depends on it.
- In the two-weeks-in preset the logo is already added.
- **The logo itself:** an invented, simple logo for Kalayaan Foods (a mark and wordmark, as an SVG in the repo). It suits a Philippine snack and frozen-food maker and must not resemble any real brand. It is shown large at the top of Kalayaan's profile, in the menu header and on the top-right mark.
- **Every other Company** shows its initials mark in the same large spot at the top of its profile, which reads as "no logo yet". No other Company gets a logo.

### Pilot Preview and Run of Show

- The six Stops, their order and their Seats don't change. The account menu and its pages work in the Pilot Preview wherever the mark shows.
- The Run of Show gains a likely question at Stop 4: "Who in a company can connect, and what do others see?" The answer opens the account menu, shows the people page, then the privacy page.
- Stop 1 and Stop 5 copy and the Run of Show's figures read the Chamber Size.

### Words

Proposed additions to CONTEXT.md, made in the documents step:

- **Company Admin:** an Authorized Representative who can accept Connection Requests and manage the Company's people. A Company has a primary and a backup; only the primary can remove the backup.
- **Authorized User:** an Authorized Representative who can send Connection Requests in one area (sales or procurement) but not accept them.
- **Contact Request:** a connected Company's ask for one person's email and phone, which only that person can share.
- **Alias:** a shortened name ("Ana R.") a person can show to connected Companies instead of their full name.
- **Chamber Size:** how many member Companies a Chamber has, which chamber-wide figures count.
- **Example Companies:** the named Companies of the Demo's Chamber Network. Avoid "the network of 100" now that the Chamber Size differs.

"Super admin" is not used. Avoid "member" for a Company, except in a Chamber's own words ("1,000 members").

### Documents (after the code is green)

Done in the same executer session once every check passes. If time runs out, the code ships and these follow. Mark anything Richard hasn't confirmed as such.

- [2026-11-17-pilot-preview.md](2026-11-17-pilot-preview.md): the Chamber Size, the pricing default, and the Run of Show question. Add a note pointing here.
- [2026-11-11-comdash-redesign.md](2026-11-11-comdash-redesign.md): pricing now starts off in the full Demo.
- The build plan:
  - C1 says an Authorized Representative sends a Connection Request and the other Company's admin accepts it.
  - Section 6 gains a row: printing, forwarding and sharing company profiles outside ComLinked, earliest phase after the MVP.
  - The adoption notes gain the open questions below.
- The SRS: new open decisions from OD-17, one per open question below, and a version line.
- CONTEXT.md: the terms in [Words](#words).
- The Run of Show: the new likely question and the figures at 1,000.
- This spec: status updated with what was built.

### Phone and access

- Mobile first. Every new screen works at 375px wide with no sideways scroll; the menu is a sheet on a phone. Targets are at least 44px.
- The menu, the pages, the radio choice and the switch are reachable and usable from the keyboard with visible focus, and have proper names and roles for screen readers. Reduced motion removes the menu's transition.
- The Demo's existing "Example data" tag and demo notice stay on every new screen.

### Code quality

- **One rule, one place.** The rules for roles, visibility and Contact Requests live in the Service Seam. Screens ask the seam and never decide who may see or do what.
- **One source of truth.** The Chamber Size lives in the chamber setting only, and every chamber-wide figure reads it.
- **No duplicated copy.** The role lines are written once and read by the people page.
- **Reuse.** New screens reuse the existing product parts (panels, rows, marks, buttons, switches, sheets) and the Design System's tokens. They add no one-off styles.
- **Simple types.** The types for people, roles and Contact Requests stay small and plain. Nothing is generalised for features this spec doesn't build (inviting people, enforcing limits, real auth).

### Priority if time runs short

Build and check in this order, so that tomorrow's link has the most important parts first:

1. pricing default
2. Chamber Size
3. account menu and people page
4. people data, privacy page, People section and Contact Requests
5. logo and Profile Strength
6. documents

## Testing Decisions

- **Seams:** the two the Pilot Preview spec used, no new ones (confirmed by the user).
  - The **ComLinked Service Seam**, with Vitest simulation tests.
  - The **browser**, with Playwright plus axe, extending the existing product smoke, Pilot Preview and accessibility specs.
  - No component tests.
- **A good test checks behaviour someone can see or rely on, through the seam's public functions or the page.** It never checks internal state shape, styling details or how a function is built. Names say the rule in plain words, as the existing tests do ("accepts a strong fit within seconds…").
- **Service Seam tests (prior art: "the later items", "the chamber's name and its counts", "ECCP's Activity View", "two weeks in, on Day 14", "what a Company may see of another", "claiming as one fact"):**
  - **Pricing:** pricing starts off in a fresh full Demo and in the Pilot Preview. Switching it on gives the Free member view. A reset turns it off again.
  - **Chamber Size:** on Day 0, Day 1 and Day 14 the chamber-wide figures add up to 1,000. With no session actions they are 10 times the Example Companies' figures, so Day 14 claimed is 400. An Intro moves "needs an intro" by one. Deals and wins equal the named ones. The announcement says 400. The member groups list only Example Companies, and their counts are the scaled ones.
  - **Kalayaan's story is unchanged:** the existing story and network tests still pass, with only renamed descriptions where they say "100".
  - **Roles:** Kalayaan has four people with the right roles. Making the backup primary swaps them. Only the primary can remove the backup, no one can remove themselves, and removing someone keeps every Connection.
  - **Visibility:** not connected or pending shows no people. Connected shows names and titles. An alias shows "Ana R.". A hidden title is left out. Email and phone show only after sharing, and only to the Company that asked. Unclaimed Companies stay basics only.
  - **Contact Requests:**
    - Asking marks the request as waiting, and asking again is refused.
    - The next morning shares, with a Notification.
    - Nordhavn's request reaches Ana the morning after they connect.
    - Share and Decline change what Nordhavn sees, and Decline says Nordhavn won't be told.
    - A colleague's request can't be answered by an admin.
  - **Logo:** day-one Profile Strength is 55%. Adding the logo adds 10. A complete profile is 100%. The two-weeks-in preset has the logo.
  - Existing tests that assume pricing starts on (e.g. "plan views") switch it on first. Their expectations about the tiers stay the same.
- **Browser tests (prior art: `e2e/product-smoke.spec.ts` "on a phone", "ComDash" and the tier tests, `e2e/pilot-preview.spec.ts`, `e2e/a11y.spec.ts`):**
  - The full Demo opens on ComDash with names and no switcher. Switching pricing on in the guide shows Free member.
  - On a phone and a laptop:
    - the mark opens the account menu
    - "Admins and authorized users" lists four people with role lines
    - Make primary and Remove behave as specified
    - Escape closes the menu and returns focus
  - The privacy page's alias choice updates the preview card. Share and Decline answer Nordhavn's request.
  - A connected Company's profile shows its People section, and Ask for contact details then Next morning shows the details. A Company that isn't connected shows the "once you're connected" line.
  - ECCP's view at Stop 5 shows 1,000 members, about 400 claimed, and the example line.
  - Axe finds no violations on the two new pages and with the menu open.
  - The tier tests switch pricing on first, and "a full page load resets the selected view to Free member" becomes "a full page load turns pricing off".
- **Running on this machine:** follow the notes from earlier tickets. Port 3000 is another project, so use `PLAYWRIGHT_PORT=3111` when needed. The user's own dev server may hold `.next`, so build in a scratch copy. Wrap long runs in `caffeinate -i`. The homepage axe check is a known flake.

## Out of Scope

- **Deploying to Vercel and the login in front of it.** A separate decision (login page vs the Vercel protection chosen on 2026-11-17) and a separate handoff.
- **AI manual-first** (showing the manual way before the AI Lead Agent's equivalent, a three-option agent setup). Not yet grilled.
- **Renaming the 37 Example Company names that clash with real companies** (ticket 06 of the Pilot Preview). This is needed before outside eyes see the link, but it is its own task.
- **Inviting new people**, any seat count or seat limit, and any pricing for seats.
- **Enforcing an authorized user's limits** in search, Connect or accept, and **switching which person is signed in**.
- **Real authentication, Org Roles, RLS or database changes.** The Demo stays client-side (ADR 0010).
- **Printing, forwarding or sharing a company profile outside ComLinked.** Nothing is built, and the plan records it as after the MVP.
- **Logos for any Company other than Kalayaan Foods.**
- **Naming 900 more Companies** or any change to matching, search or the Example Companies.
- **The Free, Growth and Pro designs themselves**, which stay as they are behind the switch.
- **The LAT pre-assessment, the Brevo sync, geesproject.com, and the scoring and agent-stage documents** from the same meeting.

## Further Notes

- **The meeting summary contradicted itself on the backup admin.** One line, marked as a decision, said the two admins have the same powers. A later line said the secondary admin can request but not accept. The user chose equal admins, because a backup only covers a vacation if it can accept. Richard should confirm.
- **Questions for Richard** (record in the SRS from OD-17 and in the plan's adoption notes; he confirms before anything goes to ECCP):
  1. How many people may a Company have, and is any of that paid later?
  2. Are the two admins equal, as built?
  3. Only the person shares their own contact details; is that right?
  4. Names and titles are shown to connections by default, and contacts only on request; is that the right default?
  5. 1,000 members shown with 100 named examples; is that acceptable for ECCP?
- **The ComDash tiers still need Richard's agreement before ECCP sees them,** as decided on 2026-11-18. With pricing off by default, they only appear if the presenter switches them on.
- **Known risk for tomorrow:** the 37 clashing names are still in the Demo. If the rename can't happen before Mapua, the presenter should know which names are affected (listed in ticket 06's Outcome).
- **Off-platform contact can't be prevented:** someone can read a name and title and look the person up on LinkedIn. The alias and the hidden title are the Company's answer to that. Nothing in the Demo claims more.
