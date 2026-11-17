# Pilot Preview for ECCP

**Status:** ready-for-agent
**Date:** 2026-11-17
**Source:** grilling session of 2026-11-17 on the demo workflow and design for ECCP (26 decisions)
**Feature IDs:** A1 (pre-built profiles), A2 (claim), L1 (day-one matches), L4 (community manager intros), D1 (morning digest), C4 (outcome buttons), S1 and S2 (testimonial, success wall), D5 (monthly top companies), Section 3.6 (member import, activity view)
**Vocabulary:** [CONTEXT.md](../../CONTEXT.md), section "Showing ComLinked"
**Awaiting Richard:** four choices here change his plan. They are listed under [Questions for Richard](#questions-for-richard) and are built as wording that is easy to alter.

## Problem Statement

ECCP, the European Chamber of Commerce of the Philippines, is the first Pilot. Nobody at ECCP has seen ComLinked or agreed to anything. The person who decides is ECCP's Chamber Leader, and they will meet ComLinked cold.

The Demo we have was built for a different audience and a different chamber:

- It tells the story of one member Company, Kalayaan Foods. The chamber's own screen is the last of eleven steps, and is reached only from the Presenter Guide or the "Request a pilot" form.
- ECCP is named in one place. The chamber tools say "example chamber", and Monthly Top Companies says "Your chamber".
- The network is 40 Filipino food-chain businesses around Metro Manila. It reads as a neighbourhood chamber, not as ECCP's membership.
- The chamber screen is a plain list. Its top bar shows a member's initials and notifications, and it says "12 profiles built" beside "Send to all 40 members".
- The member's home screen shows a Free, Growth and Pro switcher, while the For Chambers page promises "No tiers and no paywall for any member company".
- The pilot cannot be shown in order. Opening the chamber tools first quietly claims Kalayaan Foods, and the "New company" start wipes the import.
- A page reload resets everything, so a link forwarded inside ECCP lands at the start with no thread to follow.
- A Chamber Leader's first questions have no answer on screen: what is in the member list, who contacts my members, and what can others see about a member who has not yet looked at its profile.
- A Leader who is convinced has no way to say yes. The pilot form says "nothing was sent".

## Solution

A **Pilot Preview**: a guided, ten-minute walk through the Demo, made for ECCP's Chamber Leader, that shows how a Pilot would run for ECCP from the day its Member List is imported to two weeks in. It starts and ends in the chamber's Seat.

Richard presents it alone in a first meeting, on a laptop or a shared screen. Afterwards the Leader gets a private link to replay it and forward it inside ECCP, so it must make sense without a presenter.

| Stop | Day     | Seat              | What it shows                                                                                                  |
| ---- | ------- | ----------------- | -------------------------------------------------------------------------------------------------------------- |
| 0    | Opening | none              | A preview made for ECCP. ECCP has not joined ComLinked, and every company, person and figure is invented       |
| 1    | Day 0   | Community Manager | ECCP's Member List becomes 100 Pre-built Profiles, with a claim link per Company ready for ECCP to send        |
| 2    | Day 1   | Kalayaan Foods    | The message from ECCP, the Claim, three Matches that day (one is Nordhavn Freight Forwarders), a first message |
| 3    | Day 2   | Kalayaan Foods    | The 8:00 a.m. Morning Digest                                                                                   |
| 4    | Day 14  | Kalayaan Foods    | Who is interested, a first export shipment confirmed by both Companies, and a Testimonial on the Success Wall  |
| 5    | Day 14  | Chamber Contact   | ECCP's read-only Activity View: 40 of 100 claimed, who is active, who needs an Intro, deals, wins              |
| 6    | The ask | none              | What a Pilot asks of ECCP: the Member List and one contact, with a button that opens an email to Richard       |

A **Story Bar** sits under the top bar on every screen. It names the day, what is happening and whose Seat is shown, and its Next button moves to the next Stop. Each Stop has its own address, so a reload or a forwarded link opens the right Stop in the right state.

The Preview names ECCP throughout, read from one setting. The network grows to 100 invented Companies by bringing in the 60 European-style members that so far existed only in the frozen HTML mockup. Kalayaan Foods stays the member in the story, and now does business across the Europe–Philippines line: Nordhavn Freight Forwarders is a day-one Match and carries its first shipment of banana chips to Europe.

ECCP's own screen is rebuilt from ComDash's parts, and shows each member's status only. Its Day 14 figures match the plan's targets and no better.

Three things change in how a Pilot is described, so that a Chamber Leader hears a lighter and safer ask:

- ComLinked supplies the Community Manager during the Pilot.
- ECCP sends the claim links from its own address, and the Member List holds no contact details.
- Until a Company claims, other Companies see only its public basics.

The pricing switcher, the AI Lead Agent, the Team Dashboard and the Engine do not show in the Pilot Preview unless the presenter switches them on.

## User Stories

### The Chamber Leader in the meeting

1. As a Chamber Leader, I want the first screen to say this is a preview made for my chamber, so that I know it is not a claim that we have joined.
2. As a Chamber Leader, I want to be told plainly that every company, person and figure is invented, so that I do not mistake example members for real ones.
3. As a Chamber Leader, I want the story to begin with what my chamber does on the first day, so that I see my part before anyone else's.
4. As a Chamber Leader, I want to see my chamber's name on every screen that refers to the chamber, so that I am looking at my own pilot and not a generic product.
5. As a Chamber Leader, I want the member list shown as company names and websites only, so that I know I am not asked to hand over my members' contact details.
6. As a Chamber Leader, I want to see 100 profiles built from that list, so that I understand no member starts from a blank form.
7. As a Chamber Leader, I want to open one drafted profile, so that I can judge what ComLinked writes about a member.
8. As a Chamber Leader, I want to see that the claim links are handed to my chamber to send, so that I know ComLinked does not contact my members.
9. As a Chamber Leader, I want to read the exact message a member receives, carrying my chamber's name, so that I know what goes out under it.
10. As a Chamber Leader, I want that message marked as example wording my chamber approves, so that I know I control the real one.
11. As a Chamber Leader, I want to watch one member claim its profile in under a minute, so that I believe a busy owner will do it.
12. As a Chamber Leader, I want the member to get three Matches the same day, each with a reason to talk, so that I see the first lead arrive within 24 hours.
13. As a Chamber Leader, I want one of those Matches to be a European-linked member, so that I see business across the Europe–Philippines line, which is what my chamber exists for.
14. As a Chamber Leader, I want to see the next morning's digest, so that I understand why a member would come back every day.
15. As a Chamber Leader, I want to see that member two weeks later with named interest, a confirmed deal and a testimonial, so that I see results and not only logins.
16. As a Chamber Leader, I want the deal to be a believable one for two weeks, so that I do not feel oversold.
17. As a Chamber Leader, I want a screen that is my chamber's own, so that I know what I would look at during a pilot.
18. As a Chamber Leader, I want that screen to show how many members have claimed, are active and need an introduction, so that I can tell how the pilot is going.
19. As a Chamber Leader, I want it to show deals confirmed and wins posted across the chamber, so that I see members doing business with each other.
20. As a Chamber Leader, I want the figures to be what ComLinked expects of a real pilot, so that a real pilot does not then disappoint me.
21. As a Chamber Leader, I want to see only each member's status, not its private numbers, so that I can promise my members their dealings stay private.
22. As a Chamber Leader, I want my chamber's screen marked read-only, so that I know nothing is asked of my staff there.
23. As a Chamber Leader, I want to see that a community manager introduces a member who has no lead yet, so that I know no member is left without one.
24. As a Chamber Leader, I want to be told ComLinked supplies that community manager, so that I can judge the load on my own staff as small.
25. As a Chamber Leader, I want the last screen to state what a pilot asks of my chamber in two items, so that I know exactly what I am agreeing to.
26. As a Chamber Leader, I want that screen to say the pilot is free for my chamber and its members, so that cost is not left as a doubt.
27. As a Chamber Leader, I want to know what other members can see about a company that has not yet claimed, so that I can answer my members if they ask.
28. As a Chamber Leader, I want no pricing tiers on the member's home screen, so that what I am shown agrees with the promise of no paywall.
29. As a Chamber Leader, I want no AI feature that contacts companies by itself in the story, so that the promise "AI drafts, a person decides" holds.

### The Chamber Leader alone on the link

30. As a Chamber Leader replaying the link on my phone, I want one Next button that always moves the story forward, so that I never have to work out where to go.
31. As a Chamber Leader, I want each screen to say which day it is and whose view I am seeing, so that I do not confuse a member's screen with my chamber's.
32. As a Chamber Leader, I want to see how far through the preview I am, so that I know how much is left.
33. As a Chamber Leader, I want to go back a Stop, so that I can look again at something I passed.
34. As a Chamber Leader, I want a reload to bring me back to the Stop I was on, so that a dropped connection does not send me to the start.
35. As a Chamber Leader, I want to send a colleague the address of one Stop, so that they open exactly the screen I mean.
36. As a board member opening a forwarded Stop, I want that Stop to be in its proper state, so that it makes sense without the Stops before it.
37. As a Chamber Leader, I want to tap around inside a Stop without breaking the story, so that I can look closer and still press Next.
38. As a Chamber Leader, I want every Stop to work on a phone with no sideways scrolling, so that I can replay it anywhere.
39. As a Chamber Leader, I want every screen still labelled as example data, so that a screenshot I forward cannot be mistaken for real activity.
40. As a Chamber Leader who is convinced, I want one button that opens an email to the person who presented, so that I can say yes at once.
41. As a Chamber Leader, I want that email already addressed and given a subject, so that replying takes one line.
42. As a Chamber Leader, I want to explore the member's side freely after the last Stop, so that I can satisfy my own curiosity.
43. As a Chamber Leader, I want a way back into the preview from that free exploring, so that I am never lost.
44. As a Chamber Leader, I want no presenter controls on my screen, so that I am not shown plan codes, time travel or a reset button.

### The presenter

45. As Richard presenting alone, I want every Stop to open already in its finished state, so that I can show it without a run of clicks.
46. As Richard, I want Next to work whether or not I clicked anything in a Stop, so that a skipped step never strands me.
47. As Richard, I want the Story Bar's own line to tell me what the Stop is about, so that I always have a prompt on screen.
48. As Richard, I want to replay the profile build in Stop 1 with one button, so that I can show it happening.
49. As Richard, I want to make an introduction from the Community Manager's Seat as a side step from ECCP's view, so that I can show how a quiet member is helped.
50. As Richard, I want that side step to return me to ECCP's view with one fewer member needing an Intro, so that the effect is visible.
51. As Richard, I want the Presenter Guide to open with the G key, so that I can steer without the Leader seeing a guide button.
52. As Richard, I want the Presenter Guide to jump to any Stop, so that I can answer "show me that again".
53. As Richard, I want a switch that shows the possible future pricing view, so that I can show it if the Leader asks how ComLinked will earn money.
54. As Richard, I want a switch that shows the after-MVP previews, so that I can show the AI Lead Agent, the Team Dashboard or the Engine if the talk goes there.
55. As Richard, I want both switches off whenever the Pilot Preview starts, so that I never show them by accident.
56. As Richard, I want the full Demo's "New company" and "Two weeks in" starts kept in the Presenter Guide, so that I can still review the product freely.
57. As Richard, I want a one-page Run of Show I can print, so that my notes stay off the shared screen.
58. As Richard, I want the Run of Show to give, for each Stop, what to click, what to say, and the likely question with its answer, so that I can present without having built the Demo.
59. As Richard, I want the Run of Show to mark every answer that still needs my decision, so that I do not promise something unsettled.
60. As Richard, I want the ask to email me, so that ECCP's reply reaches the person who can commit.

### The member Company in the story

61. As an Authorized Representative, I want the message from my chamber to say a profile was drafted from my website, so that I know where it came from.
62. As an Authorized Representative, I want to be told that other members see my description only after I have checked it, so that I trust what was written about my company.
63. As a company owner, I want my three Matches on the first day to be companies that have already claimed, so that each one can answer me.
64. As a company owner, I want a Company that has not yet claimed to be marked "Not yet claimed" wherever I meet it, so that I know why it shows so little.
65. As a company owner, I want a reason to contact a not-yet-claimed Company drawn from my own needs, so that the lead is still useful.
66. As a company owner, I want to message a not-yet-claimed Company and be told the message waits until it claims, so that I do not expect a reply that cannot come.
67. As a company owner, I want no Connect button on a Company that cannot accept yet, so that I am not left with a request that never resolves.
68. As a company owner, I want to see my Day 2 digest name who viewed me overnight, so that I have a reason to open the app.
69. As a company owner, I want my confirmed deal to appear as a Testimonial on the Success Wall, so that other members see it worked.
70. As a company owner, I want nothing sent in my company's name before I have claimed, so that my first contact with other members is mine.

### The Community Manager and the Chamber Contact

71. As a Community Manager, I want my screen to say I act for one named chamber, so that it is clear whose members I am looking after.
72. As a Community Manager, I want the Member List previewed as names and websites before profiles are built, so that I can see what will be created.
73. As a Community Manager, I want the import to end with the claim links ready for the chamber to send, so that the hand-over to the Chamber Contact is clear.
74. As a Community Manager, I want the same Activity View as the Chamber Contact with my tools added, so that we look at one picture.
75. As a Community Manager, I want members who need an Intro listed together, so that I can act on them first.
76. As a Community Manager, I want an announcement to say how many members will receive it, so that the number is honest.
77. As a Chamber Contact, I want to filter members by status, so that I can find who has not claimed yet.
78. As a Chamber Contact, I want not-yet-claimed members with a message waiting listed first, so that I know whom to remind.
79. As a Chamber Contact, I want to see that a member is waiting without seeing who, so that members' dealings stay private.
80. As a Chamber Contact, I want the Success Wall's wins and the Monthly Top Companies beside the member list, so that I can recognise active members.
81. As a Chamber Contact, I want no button that changes anything, so that I cannot alter a member's record by mistake.

### Honesty, access and upkeep

82. As a viewer, I want no win, deal or point shown before the day it could have happened, so that the timeline holds together.
83. As a viewer, I want the day on the Story Bar to match the day on the screen, so that the story never contradicts itself.
84. As a viewer, I want a Company that has not claimed never to appear as having acted, so that the preview shows what a real pilot could.
85. As a keyboard user, I want to reach Next, Back and every action in a Stop without a mouse, so that the preview is fully operable.
86. As a screen-reader user, I want each Stop change announced with its day, title and Seat, so that I know where I am.
87. As a user who prefers reduced motion, I want no animated transitions between Stops, so that the screen stays calm.
88. As a reader, I want each member's status shown as text and not colour alone, so that I can tell them apart.
89. As the person planning the next chamber's pitch, I want the chamber's name set in one place, so that renaming the preview is one change.
90. As a maintainer, I want each Company's claim day held in one place, so that the chamber's view, the staff view and search can never disagree.
91. As a maintainer, I want the Presenter Guide's "Two weeks in" start and Stop 4 built from one seed, so that the two never drift apart.
92. As ComLinked, I want every invented company name checked against real companies before the link is shared, so that no real business appears by accident.
93. As ComLinked, I want ECCP shown by name only, never by its logo, so that nothing implies an endorsement.
94. As a visitor who submits the website's "Request a pilot" form, I want to land on the Pilot Preview's Opening, so that I see a pilot and not a bare tools screen.

## Happy and sad paths

### Happy paths

| Path                                                         | Expected                                                                                                                     |
| ------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| Richard opens the Pilot Preview                              | The Opening names ECCP, says ECCP has not joined and that everything is invented, lists the six Stops and offers Start       |
| Richard presses Start                                        | Stop 1 opens on Day 0 in the Community Manager's Seat with 100 profiles built and 100 claim links ready for ECCP to send     |
| Richard presses "Run the import again"                       | The Member List shows as names and websites, the build runs to 100, and the result reads as before                           |
| Richard presses Next from Stop 1                             | Stop 2 opens on Day 1 on the message from ECCP to Ana Reyes of Kalayaan Foods                                                |
| Richard claims the profile in Stop 2                         | The profile check, the authorization tick and sign-in follow, then three Matches, one of them Nordhavn Freight Forwarders    |
| Richard sends the AI Draft to Nordhavn                       | The message sends only on Send, and the Match shows as acted on                                                              |
| Richard presses Next without finishing the Claim             | Stop 3 opens on Day 2 with the Morning Digest, as if the Claim and first message had happened                                |
| Richard presses Next from Stop 3                             | Stop 4 opens on Day 14 on ComDash, with the Nordhavn deal confirmed by both and the Testimonial on the Success Wall          |
| Richard presses Next from Stop 4                             | Stop 5 opens ECCP's read-only Activity View: 40 of 100 claimed, 20 active, 4 need an Intro, 3 deals confirmed, 2 wins posted |
| Richard takes the side step and sends an introduction        | The member's status changes, and ECCP's view then shows 3 needing an Intro                                                   |
| Richard presses Next from Stop 5                             | Stop 6 shows the two asks, what members get, that the pilot is free, and "Email Richard"                                     |
| The Leader taps "Email Richard" on the link                  | Their mail app opens a new message to the presenter's address with the subject filled in                                     |
| The Leader reloads on Stop 4's Interest Signals tab          | Stop 4 reopens at ComDash on Day 14 with the Story Bar showing 4 of 6                                                        |
| A board member opens the forwarded address of Stop 5         | ECCP's view opens on Day 14 with its figures, with no earlier Stop visited                                                   |
| The Leader taps "Explore on your own" after Stop 6           | The member's side opens on Day 14, and a slim line offers the way back into the preview                                      |
| Richard presses G and switches on possible future pricing    | The Free, Growth and Pro switcher appears on ComDash with its "Not in the MVP" note                                          |
| Richard presses G and switches on the after-MVP previews     | ComDash shows five tabs again, and the AI Lead Agent, Team Dashboard and Engine can be opened                                |
| Richard picks "Two weeks in" from the Presenter Guide        | The full Demo opens on ComDash on Day 14 with no Story Bar and with the later items showing, as before                       |
| A visitor submits the website's "Request a pilot" form       | A note says nothing was sent, and the Pilot Preview's Opening follows                                                        |
| Ana opens a not-yet-claimed Company from her Daily Lead List | Name, industry, city and website show, marked "Not yet claimed", with one reason drawn from her needs and no Connect button  |

### Sad paths

| Path                                                               | Expected                                                                                                                   |
| ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| An address names a Stop that does not exist                        | The Opening shows                                                                                                          |
| The browser blocks per-tab memory, and the Leader reloads mid-Stop | The Opening shows, and no error appears                                                                                    |
| The browser's Back button is pressed after moving on a Stop        | The earlier Stop opens afresh in its own state                                                                             |
| No presenter address is set on the Demo                            | Stop 6 shows no email button and says to reply to whoever sent the link                                                    |
| The device has no mail app                                         | The presenter's address is also shown as text that can be copied                                                           |
| Ana messages a not-yet-claimed Company                             | The thread says the message waits until that Company claims, no reply arrives, and ECCP's view marks one member as waiting |
| The AI Assistant is off in Stop 2                                  | The first message starts as an empty box with the templates, and still sends                                               |
| The later items are hidden and their address is opened directly    | The ComDash Overview opens                                                                                                 |
| The Leader opens the Success Wall on Day 1 or Day 2                | A calm empty state says the first win appears when two members confirm a deal                                              |
| Stop 1's Activity View on Day 0                                    | It reads 0 of 100 claimed, with every member "Not yet claimed" and no wins                                                 |
| A status filter matches no member                                  | The list says so in one line                                                                                               |
| A very long company name on a 360 pixel phone                      | It wraps inside its card, with no sideways scrolling                                                                       |
| The Story Bar on a 360 pixel phone                                 | Its text wraps to at most two lines, and Next stays fully visible and easy to tap                                          |
| Keyboard only                                                      | Next, Back, the filters, the side step and the email link are reachable in order, with visible focus                       |
| Reduced motion                                                     | Moving between Stops has no transition                                                                                     |
| The Presenter Guide's "Reset" is used inside the Pilot Preview     | The Demo starts over outside the Pilot Preview, as it does today                                                           |

## Implementation Decisions

### The Pilot Preview and its Stops

- **One declared list of Stops.** The Opening and the six Stops are described in one place: the day, the title, the Seat, the screen the Stop opens on, and how its state is prepared. The Story Bar, the Opening's list, the Presenter Guide's jump list and the tests all read that list. Adding or reordering a Stop changes one place.
- **Prepared states are deterministic.** Opening a Stop builds the same simulation state every time, with nothing depending on what was clicked in an earlier Stop. This is what lets Next work after skipped clicks and lets a forwarded address stand alone.
- **Each Stop's state.**
  - Stop 1, Day 0: nobody has claimed. The Member List of 100 is loaded, all 100 profiles are built and 100 claim links are ready for ECCP to send. "Run the import again" replays the preview of the list and the build.
  - Stop 2, Day 1: Kalayaan Foods has not claimed. At least eight other Companies have, including its three Matches and every Company that sends it an Interest Signal that day. This Stop is the one live flow in the Preview, since the Claim is its point.
  - Stop 3, Day 2: Kalayaan claimed on Day 1, connected with Nordhavn and sent it a first message, and one night has passed, so the Morning Digest exists.
  - Stop 4, Day 14: the two-weeks state. Interest is named, the Nordhavn deal is confirmed by both Companies, and the Testimonial is on the Success Wall.
  - Stop 5, Day 14: the same state as Stop 4, seen from the Chamber Contact's Seat.
  - The Opening and Stop 6 hold no Seat and change no state.
- **One seed for two weeks in.** The Presenter Guide's "Two weeks in" start and Stop 4 are built by the same seed, and both land on Day 14. The seed moves from Day 15 to Day 14 so that the Story Bar and every "Day N" label on screen agree.
- **Day 0 is a real day.** The simulation accepts Day 0 as the day before any Company claims, with no activity on it.
- **Addresses.** Each Stop has one address: its opening screen plus a marker naming the Stop. Arriving at such an address by any means prepares that Stop afresh. Moving around inside a Stop uses ordinary addresses and keeps the state. The current Stop is also remembered for the browser tab, so a reload anywhere inside it reopens that Stop at its opening screen. Where the browser blocks that memory, a reload shows the Opening. An unknown Stop shows the Opening.
- **Being in the Pilot Preview is part of the simulation state.** It turns on the Story Bar, hides the Presenter Guide's button, and sets the two "later items" switches to off. The full Demo, entered as today, is unchanged: no Story Bar, the guide button showing, and the later items showing.
- **After Stop 6.** "Explore on your own" opens the member's side on Day 14 and stays in the Pilot Preview, with the Story Bar reduced to one line that leads back in. "Start again" returns to the Opening.

### Story Bar and Seats

- **Story Bar.** A strip directly under the top bar on every screen of a Stop. It shows the day and title, the Seat line, the position such as "2 of 6", Back, and Next. On Stop 6, Next becomes "Start again". It is a labelled landmark, and a Stop change moves focus to the screen's main heading and announces the day, title and Seat.
- **Titles.** Stop 1 "ECCP's member list becomes profiles". Stop 2 "A member claims its profile". Stop 3 "The next morning". Stop 4 "The member, two weeks in". Stop 5 "ECCP's view". Stop 6 "What a pilot asks of ECCP".
- **Seat lines.** Community Manager: "You're seeing ComLinked's community manager, working for ECCP." Company: "You're seeing Kalayaan Foods, an ECCP member." Chamber Contact: "You're seeing ECCP's own view. It is read-only."
- **The top bar follows the Seat.** In a Company's Seat it is today's bar. In the Community Manager's and the Chamber Contact's Seats it carries the logo, the "Example data" tag and a label for the Seat, with no member's initials, notifications, search or bottom tabs.

### The chamber setting

- **One setting names the chamber.** It holds the short name (ECCP), the full name, the sender name on the claim message, and the presenter's first name. Every screen that names the chamber reads it, inside and outside the Pilot Preview: the ComDash header, the chamber tools, Monthly Top Companies, announcements, the Opening, the Story Bar and the ask.
- **The presenter's address** comes from one setting on the deployment and is not stored in the repository. With none set, Stop 6 shows no email button.
- **Scope of "one change".** Renaming the chamber changes the name everywhere. The 100 invented members stay European-flavoured, so a second chamber's pitch still needs its own network.
- **Name only.** ECCP appears as text. Its logo and branding are not used.

### The network

- **100 Companies.** The 60 invented European-style members held in the frozen mockup's network data join the existing 39 and Kalayaan Foods. Each gains an invented website on a reserved example domain.
- **Kalayaan's story changes in one place.** Nordhavn Freight Forwarders, which ships between Manila and European ports and looks for exporters, becomes one of Kalayaan's three day-one Matches in place of Palengke Online, the second grocery retailer, which moves to Day 1's Daily Lead List (decided 2026-11-17). The three Matches are then a grocery retailer, a packaging supplier and a freight forwarder, one for each thing Kalayaan seeks. Northline Logistics, the local trucker, stays in Day 1's Daily Lead List as the one Company that has not claimed. Nordhavn is the Company it connects with, messages first, meets and confirms the deal with. The Testimonial reads as a first shipment of banana chips to Europe within two weeks of a day-one Match.
- **Everything else in its story stays.** Apart from Nordhavn, none of the 60 trades in what Kalayaan buys or sells, so its other Matches, leads and interested Companies are unchanged. The mockup's rules that guarded this carry over as tests.
- **Counts follow the network.** Wherever the Demo states the size of the network or of an audience, it uses the real count.

### Claiming as one fact

- **One claim day per Company.** Each Company has the day it claimed, or none. This replaces the two sources used today: a fixed list of unclaimed Companies and a formula used by the staff and chamber screens. Search, profiles, Matches, the Activity View, the Team Dashboard and the AI Lead Agent preview all read it.
- **The schedule.** On Day 14 exactly 40 of the 100 have claimed, Kalayaan among them. They include every Company that appears in Kalayaan's story and at least 15 of the European-style members, so the claimed list visibly mixes both.
- **A Company that has not claimed never acts.** It sends no Interest Signal, message or Connection Request, posts no Ask or win, earns no Activity Score points and is not in Monthly Top Companies. Any existing data that breaks this is corrected.
- **Nothing is sent in a Company's name before it claims.** The message a community manager "sent for your company before you claimed your profile" is removed from the day-one state.

### Before a Company claims

- **Basics only.** A Company that has not claimed shows its name, industry, city and website, marked "Not yet claimed". Its description, offers and needs appear only once it has claimed. This applies in search results, on its profile, and on Match and lead cards.
- **Matching still uses the full draft, in private.** A not-yet-claimed Company may be a Match or a lead. Its card shows the Fit Score with no breakdown, and one reason drawn from the viewer's own needs and the other's public industry and city, such as "You're looking for freight. Northline Logistics works in cold-chain freight, Valenzuela City."
- **Messaging waits.** A message to a not-yet-claimed Company is kept and marked as waiting until it claims. No reply arrives. Connect is not offered.
- **In the Preview.** Kalayaan's three day-one Matches have all claimed. Exactly one not-yet-claimed Company appears in its Day 1 Daily Lead List, to show the rule.
- **The Claim says so.** The profile check tells the claimer that other members see the description once it is confirmed.

### The claim message

- **Stop 2 opens on it.** It is shown as a message in the member's inbox, from the chamber's sender name to Ana Reyes of Kalayaan Foods Inc., with the subject "Your company profile on ComLinked is ready".
- **Wording.** It says the chamber is piloting ComLinked, a network where member companies find leads among each other, free for members; that a profile for Kalayaan Foods Inc. has been drafted from its website; that 3 ECCP members already match what it offers; and that other members see its description only after it has been checked. One button, "Claim your profile", opens the existing first claim screen.
- **Marked as an example.** A line under it reads "Example wording. ECCP approves the real message."
- **Only in the Pilot Preview.** The website's join form still opens the claim screen directly.

### The Community Manager's import

- **Member List.** The preview before building shows each Company's name and website only.
- **Result.** "100 profiles built. 100 claim links ready for ECCP to send." Nothing says a link was sent.
- **Drafts open.** Each built profile opens as today, from the list.

### ECCP's Activity View

- **Built from ComDash's parts.** It reuses ComDash's number tiles, panels, filter chips and its table that becomes stacked cards on a phone. No new visual language is introduced, and App Mode colours and fonts apply.
- **Heading.** The chamber's name "on ComLinked", the day of the pilot, and the read-only label. The pilot's length is not stated, since it is not confirmed.
- **Five tiles.** Claimed (of the network's size), Active, Need an intro, Deals confirmed, Wins posted.
- **Day 14 figures.** 40 claimed of 100, 20 active, 4 need an Intro, 3 deals confirmed, 2 wins posted. These are where the plan's Section 8.1 targets stand two weeks in: 40% claimed within 14 days, half of claimed Companies active in a week, one in ten without a first-day lead, 20 deals and 10 Testimonials in 90 days.
- **One status per member**, by this order: Not yet claimed; Needs an intro (claimed, and still without a Lead); Active (claimed, and acted in the last 7 days); Quiet (claimed otherwise). A member's status never depends on its dealings with Kalayaan Foods.
- **Filters.** All, Active, Quiet, Needs an intro and Not yet claimed, each with its count. The four statuses add up to the network's size.
- **Rows.** The Company and its status, and nothing else about it. Not-yet-claimed members with a message waiting are listed first and marked "A member is waiting", without saying who.
- **Side column.** The Success Wall's wins, then Monthly Top Companies.
- **Two Seats, one screen.** The Chamber Contact sees it with no actions. The Community Manager sees the same screen with the tools added: the member import, Make an introduction, the announcement, and unusual points.
- **Side step.** From Stop 5 a link opens the Community Manager's Seat on the same day, with an introduction ready for one member who needs it. Sending it changes that member's status, and a link returns to ECCP's view.
- **Announcements** state how many members will receive them, which is the number that have claimed.

### Wins, deals and Monthly Top Companies

- **Wins are dated.** A win shows on the Success Wall only from its day. The wall is empty on Days 0 to 2, with a calm empty state.
- **By Day 14** there are three confirmed deals across the chamber and two wins on the wall: Kalayaan Foods with Nordhavn, and one between two European-style members. The wins the Demo has today move to later days.
- **Monthly Top Companies** lists claimed Companies only.

### The later items

- **Two switches in the Presenter Guide.** "Possible future pricing" controls the Free, Growth and Pro switcher. "After-MVP previews" controls the AI Lead Agent tab and Overview card, the Team Dashboard and the Engine.
- **Off in the Pilot Preview, on in the full Demo.** Starting the Pilot Preview sets both off.
- **With previews off,** ComDash shows four tabs and the Overview shows three cards, and the addresses of the hidden screens open the ComDash Overview. With pricing off, ComDash stays on the Free view.

### Opening and the ask

- **Opening.** The title "A preview for ECCP", one sentence on what it shows, the statement that ECCP has not joined ComLinked and that every company, person and figure is invented, the six Stops in order, and Start.
- **The ask.** Two things ECCP gives: its Member List of company names and websites, and one contact who sends each member its claim link from ECCP's own address. What ComLinked does: builds each profile, supplies the community manager and makes introductions. What members get, using the four benefits already on the For Chambers page. A line that the pilot is free for the chamber and its members. Then the email button, labelled with the presenter's first name, which opens the visitor's own mail app with the address and a subject filled in. The address is also shown as text.
- **Nothing is sent or stored** by the Demo itself.

### Presenter Guide and website

- **Presenter Guide.** It gains a Pilot Preview section that jumps to the Opening or any Stop, and the two switches. Its existing sections stay. The G key opens it everywhere. Its button does not show inside the Pilot Preview.
- **Website.** The "Request a pilot" form keeps its checks and its note that nothing was sent, and then opens the Pilot Preview's Opening. Nothing else on the website changes, and it still names no chamber.

### Documents

- **Run of Show.** One printable page in the repository's docs. For each Stop: what to click, what to say in two lines, the likely question and its answer. Answers awaiting Richard are marked. It records the date the invented names were checked.
- **Name check.** Each of the 100 invented company names, and the sender name, is checked against real companies, with real ECCP members first. A clash is renamed.
- **Status and plan.** The feature status document is brought up to date: how the Demo is shown, the network's size, the Pilot Preview, and the chamber roles. The plan's Adoption notes gain the four choices awaiting Richard. The SRS gains them as open decisions; its requirement text changes only once he confirms.
- **Glossary.** Already updated on 2026-11-17: Community Manager, Pre-built Profile, Chamber Contact, Activity View, Member List, and the "Showing ComLinked" terms.

### Phone and access

- **Phone.** Every Stop works at 360 and 390 pixels with no sideways scrolling. The tiles form a two-column grid, the member table becomes cards, and the side column moves below.
- **Laptop.** Checked at 1280 and 1440 pixels, since the meeting runs on a laptop.
- **Access.** Status is text, not colour alone. Every action is reachable by keyboard with visible focus. Reduced motion removes transitions. No serious or critical accessibility violations on any Stop.

## Testing Decisions

- **What makes a good test.** It checks something Richard, the Chamber Leader or a member could observe: which Stop opens, which day it is, who has claimed, what a not-yet-claimed Company shows, what ECCP's view counts. It does not check internal data shapes or component internals.
- **Two seams, both existing.** Rules and numbers are tested at the ComLinked service seam. Screens are tested through the browser. No component tests are added.
- **Service seam (Vitest).** Extend the existing simulation tests. Cover:
  - Each Stop prepares its stated state, and does so identically on a repeat run and regardless of what was done before.
  - Day 0 holds no activity and no claimed Company.
  - The network has 100 Companies, and Nordhavn is among Kalayaan's three day-one Matches.
  - Apart from Nordhavn, none of the 60 enters Kalayaan's Matches, leads or interested Companies.
  - Claim days: at least eight others have claimed when Kalayaan claims; exactly 40 on Day 14, including every Company in Kalayaan's story and at least 15 European-style members.
  - On no day does a Company that has not claimed send a signal, a message or a request, post an Ask or a win, hold points or appear in Monthly Top Companies.
  - A not-yet-claimed Company exposes basics only, gives a reason drawn from the viewer's needs, cannot be connected with, and holds a message as waiting.
  - Day 1's Daily Lead List holds exactly one not-yet-claimed Company, and the day-one Matches hold none.
  - ECCP's Day 14 totals are 40, 20, 4, 3 and 2, the four statuses add up to 100, and each member has exactly one status.
  - An introduction clears "Needs an intro" for that member.
  - No win shows before its day, and the wall is empty on Days 0 to 2.
  - Starting the Pilot Preview sets both later-item switches off, and the full Demo's starts leave them on.
  - The chamber's name on every derived label comes from the setting.
  - "Two weeks in" and Stop 4 produce the same state.
- **Browser (Playwright plus axe).** Extend the existing product smoke tests. Cover:
  - The whole walk from the Opening to the ask on a laptop, using only Next.
  - The same walk on a phone at 360 and 390 pixels, with no sideways scroll on any Stop.
  - The live Claim in Stop 2, ending on three Matches with Nordhavn among them.
  - A reload inside a Stop, a Stop's address opened cold, an unknown Stop, and the browser's Back button.
  - The Seat's top bar and Seat line on Stops 1, 2 and 5.
  - ECCP's view: the five figures, the filters and their counts, the empty-filter line, and no action a Chamber Contact can take.
  - The side step changing the count from 4 to 3.
  - The later items hidden in the Preview, their addresses opening the Overview, and each switch showing them.
  - The Presenter Guide button absent in the Preview, and the G key opening the guide.
  - The ask's email link with its address and subject, and the fallback with no address set.
  - "Explore on your own" and the way back.
  - The website's "Request a pilot" form opening the Opening.
  - Keyboard use of the Story Bar, reduced motion, and axe with no serious or critical violations on every Stop.
- **Existing tests change.** Tests tied to today's names, counts and Day 15 are updated to the new story. The change must be a deliberate update of an expectation, never a weakened check.
- **Prior art.** The simulation's unit tests, including the claiming, two-weeks preset, daily simulation and repeat-run groups. The product smoke test's phone and laptop walks, its tab-address and reload tests, and its keyboard and reduced-motion tests. The accessibility spec's axe gate. The mockup's network check, whose rules are carried over.

## Out of Scope

- The private link itself: hosting, access, the demo-only notice and the no-index setting. Those were decided earlier on 2026-11-17 and have no spec yet. This spec only assumes one deployment carries both the full Demo and the Pilot Preview.
- Real data, a real backend, real sign-in, and sending real email. The ask opens the visitor's own mail app.
- Any change to ComLinked's real requirements before Richard confirms. The SRS and the plan only record the open choices.
- The website's wording, including the two answers it still says will be confirmed. Only the pilot form's destination changes.
- Showing pilot targets, on-track or behind labels, or per-member numbers to a chamber.
- The mockup's ECCP activity feed, which the plan postpones with the news feed.
- A second chamber's network or story.
- Changes to the AI Lead Agent, the Team Dashboard or the Engine beyond hiding them and reading the one claim day.
- Tracking who opens the link or which Stops they view.
- Rebuilding any of this in the frozen HTML mockup.

## Further Notes

### Questions for Richard

He confirms these before anything goes to ECCP. The first four change his plan and are built as wording that is easy to alter.

1. **Who supplies the Community Manager.** During the Pilot, ComLinked supplies them, and ECCP gives only the Member List and one contact. Section 8.3 of the plan reads this way; the SRS (ASM-06, TD-11) says a Community Manager works for the chamber.
2. **Who sends the claim links.** ECCP sends them from its own address, using links and a message ComLinked prepares, so the Member List holds no contact details. The plan's A2 and the SRS (FR-A2-01, FR-CH-02) have ComLinked sending them. Reminders would also go through ECCP.
3. **What shows before a Claim.** Public basics only, with the AI-written description shown after the Company has checked it. The SRS (FR-A1-01) lists the full draft at once.
4. **Matching before a Claim.** A new member can still be matched with Companies that have not claimed, shown with basics only.
5. **How long a Pilot runs.** The glossary says 90 days and the website says it will be confirmed.
6. **How member data is protected.** The privacy review has not started.
7. **What follows the Pilot,** and what it costs the chamber and its members.
8. **His address** for the ask.

Questions 2 and 3 set a privacy stance that is hard to walk back once promised to a chamber. If Richard agrees, they are worth recording as an ADR.

### Choices made while writing this spec

These follow from the decisions but were not put to the user one by one. Any of them can be overturned.

- Stop 2 is the exception to "every Stop opens already finished", because the Claim is what it shows. Next still works without it.
- "Two weeks in" moves from Day 15 to Day 14 so the Story Bar and the screens agree.
- The message "sent for your company before you claimed" is removed, since a Company that has not claimed never acts.
- The Success Wall starts empty and wins are dated, so nothing appears before it could have happened. This also changes the full Demo's first day.
- A member's fourth status is named "Quiet", to keep "Claimed" for the total.
- ECCP's Day 14 figures are fixed at 40, 20, 4, 3 and 2.
- ECCP's view says "Day 14 of the pilot" with no length.
- The website's "Request a pilot" form opens the Opening.
- The Daily Lead List and overnight attention draw only on Companies that share Kalayaan's trade: they buy what it offers, sell what it seeks, or sell the same. Added while building ticket 01, because it is what keeps the 60 out of its leads and interested Companies on every day.
- An Ask reaches only Companies that have claimed.
- Nordhavn Freight Forwarders is placed in Quezon City. With the freight Kalayaan seeks and two of the things it offers among its needs, that brings its Fit Score to 92 with no change to the Fit Score rules. Added while building ticket 02.
- Two weeks in, Kalayaan's Activity Score is 123 and it ranks #1 of 12 in its category. It had 59 points before, and the rules give 64 for connecting with Nordhavn, three replies, the meeting, the deal and the Testimonial.
- Tibay Crates and Pallets claims on Day 18, so that its win with Malaya Export Traders can be dated Day 25. The other two earlier wins are dated Day 15 and Day 19.
- A Company that has not claimed is found in search by its name and industry only. Its connections are not shown, no follow-up is suggested on a message to it, and the AI Draft of a first message to it uses its industry and city.
- On Day 14 three of Kalayaan's five leads have not claimed, which is in line with 40 of 100 having claimed. Only Day 1's list was fixed by a decision.

### Clashes the user accepted knowingly

- The user chose for Richard to present and drive alone, against the recommendation that the user drive. The Story Bar and the Run of Show carry that weight.
- The pricing switcher was kept on 2026-11-11. It is now hidden in the Pilot Preview, and still shows in the full Demo.

### Working rules

- Work happens on `feat/website-redesign-pages`, with no new branch, as for the ComDash redesign. Executer sessions leave changes uncommitted for the user to review.
- The HTML mockup stays local and frozen. Its network data is read as a source, and nothing is written back to it.
- The sequence agreed: Richard gets the questions above now; the Pilot Preview is built; then the private link goes up once and Richard rehearses on it. Nothing goes to ECCP until he signs off.
