# ComDash redesign

**Status:** ready-for-agent
**Date:** 2026-11-11
**Source:** grilling session of 2026-11-11, based on the ComDash prototype the user supplied (`comdash-prototype.html`, kept outside the repo in the user's Downloads folder)
**Feature IDs:** L2 (ComDash interest signals), D2 (daily lead list, via Next action), D4 (freshness nudges), C-series connections, A-series AI drafts

> **Note, 2026-11-18: how these screens look is now set by the [Demo premium pass](2026-11-18-demo-premium-pass.md).** Its scale, panels, Focus panel, company marks, day-bar charts and motion replace the sizes, surfaces, line chart and four-card Overview described below. What ComDash holds and does is still set here.

> **Changed 2026-11-18 (user): the "View as" tiers now copy the prototype.** This replaces user story 14 and every line below that says Free shows everything. While possible future pricing shows, the Interest Signals tab follows the prototype's `ComDash Interest Signals` tiers:
>
> - **Free member** lists six interested companies with names, levels and signals blurred, a "See who" button on each, an upgrade box, weekly alerts without names and five search terms.
> - **Growth** names the user's own chamber with intent scores, highest first, and hides other chambers behind "Unlock on Pro". It adds "Send my agent" with 10 engagements a month, and a "Compare Pro" box.
> - **Pro** names every chamber, with 40 engagements a month.
>
> The full Demo opens on Free member. With possible future pricing switched off, as in the Pilot Preview, ComDash shows everything the MVP does, with no tier. This contradicts the plan's "free for everyone, with no payments or blurred names" and the For Chambers promise of no tiers. Richard must agree before ECCP sees the tiers.

## Problem Statement

A company owner opening ComLinked lands on ComDash, the home screen. Today it centres on the Network Ring, the Activity Score and rank, and a short "Who's interested" list. The product owner has a newer prototype of the MVP ComDash that answers the owner's real question better: who is looking at my company, how interested are they, how did they find me, and what should I do next. The current screen doesn't show how interest builds from being found to being contacted, which search terms bring people in, or which interested companies are worth a reply today. Its parts are also spread across separate screens instead of one home with clear sections.

The Next.js app also stopped being the main version on 2026-11-10, when the HTML mockup was preferred. This redesign makes the Next.js app the main version again, so its ComDash has to be the best one.

## Solution

ComDash takes the prototype's structure exactly: a company header, a "View as" plan switcher, and five tabs (Overview, Interest Signals, AI Lead Agent, Connections, Profile). Each tab has its own web address under the ComDash route.

- **Overview** shows Next action, then four summary cards: Interest Signals (interested Companies, messages, search appearances, a small visibility line and the Hot Companies), AI Lead Agent (labelled "Preview: after the MVP"), Connections and Profile.
- **Interest Signals** shows the prototype's analytics in its order: the six top numbers, the visibility chart beside the interest funnel, then the table of interested Companies (with All, Hot, Warm and New filters) beside a rail of alerts, "Found you as a…", interest by industry and search terms that found you. Opening a Company shows its dated timeline in a side drawer, addressed as `?company=<id>`.

Placement changed on 2026-11-11 (ticket 03): sessions 1 and 2 put the analytics on the Overview, which the prototype puts on Interest Signals. Stories 16–32 below now describe the Interest Signals tab. On 2026-11-12 the user asked for the prototype's Interest Signals page to be copied exactly, with MVP data; see "Interest Signals detail" under Implementation Decisions (ticket 04).

- **AI Lead Agent** shows the existing AI Lead Agent preview, still labelled "Preview: after the MVP".
- **Connections** shows Manage connections, Invitations, Companies in your chamber, Buyers of what you sell, and "From your connections".
- **Profile** holds the existing company profile editor.

Everything outside the AI Lead Agent tab counts only MVP signals: found you in search, viewed your profile, saved your profile, messaged you, and was recommended your company. Nothing claims an agent is already working.

All data comes from the existing browser-held simulation (Kalayaan Foods in the ECCP network), extended honestly. A Company that has just claimed sees calm empty states that fill as simulated days pass. "Two weeks in" shows a full dashboard. Actions elsewhere in the product, such as sending a message from Leads, show up on ComDash.

The Free view opens by default and shows everything the MVP promises, with names never hidden. Growth and Pro are a labelled demo of possible future pricing, and only add things outside the MVP: interest from other chambers and a numeric intent score.

The Network Ring, the rank and Activity Score card, and Recent wins come off ComDash. Monthly top and Wins keep their own screens.

## User Stories

### Arriving and orienting

1. As a company owner, I want ComDash to open on the Overview tab, so that I see my most important information first.
2. As a company owner, I want my company name, industry, city and chamber in the header, so that I know whose dashboard I'm looking at.
3. As a company owner, I want five clearly labelled tabs, so that I can find signals, the agent preview, connections and my profile without hunting.
4. As a company owner, I want each tab to have its own web address, so that a link or a reload brings me back to the same tab.
5. As a presenter, I want the presenter guide to jump straight to any ComDash tab, so that I can tell the demo story in any order.
6. As a presenter, I want moving between tabs to keep the simulation state, so that nothing I did earlier in the demo is lost.
7. As a company owner who just claimed my profile, I want calm empty states that say what will appear and when, so that an empty dashboard doesn't feel broken.

### Plan switcher

8. As a company owner, I want the Free view to be selected by default, so that I see what I actually get.
9. As a company owner on Free, I want every interested Company named, so that the free promise in the plan (L2) holds.
10. As a company owner on Free, I want Interest Levels, Next action and profile gaps fully visible, so that nothing important is locked.
11. As a company owner on Free, I want no upgrade prompts inside the dashboard content, so that it doesn't feel like a sales funnel.
12. As a presenter, I want to switch to Growth or Pro to show possible future pricing, so that I can discuss ideas with chambers.
13. As a Chamber Leader watching a demo, I want the switcher clearly labelled "Possible future pricing. Not in the MVP.", so that I don't mistake it for a commitment.
14. As a presenter, I want Growth and Pro to add only interest from other chambers and a numeric intent score, so that Free never looks stripped down.
15. As a presenter, I want the selected view to persist while I move between tabs, so that the demo stays consistent.

### Interest Signals: numbers, chart and funnel

16. As a company owner, I want six top numbers, in this order: search appearances, recommendations, messages (highlighted as the strongest signal), introductions, profile views and profile saves, so that I can see my visibility at a glance.
17. As a company owner, I want each number compared with the previous period, so that I know whether things are improving.
18. As a company owner with no previous period yet, I want the comparison left out rather than shown as a false change, so that the numbers stay honest.
19. As a company owner, I want a visibility chart counted from the day I claimed, so that it shows my real history and nothing invented.
20. As a company owner, I want the chart to show search appearances and recommendations, so that I can see how often I'm being surfaced.
21. As a company owner, I want an interest funnel from found you to viewed, saved, messaged and connected, so that I can see where interest stops.
22. As a company owner, I want one plain line under the funnel suggesting what would move more Companies to the next stage, so that the funnel leads to action.
23. As a company owner, I want the headline count of interested Companies, so that I know how many are paying attention.

### Interest Signals: interested Companies, alerts and insights

24. As a company owner, I want a table of interested Companies with name, Interest Level, latest signal and one action, so that I can decide whom to contact.
25. As a company owner, I want Hot Companies listed first, then Warm, then New, so that the most promising appear at the top.
26. As a company owner, I want an alert when a Company becomes Hot, saves my profile or messages me, so that I don't miss a moment.
27. As a company owner, I want a community manager's intro to appear as an alert, so that chamber help is visible on my home screen.
28. As a company owner, I want "Found you as a…" to group the kinds of Companies that searched for me, so that I understand who is looking.
29. As a company owner, I want interest grouped by industry, showing groups of three or more, so that I can spot a market without exposing single Companies.
30. As a company owner, I want the search terms that found me, so that I know which words bring people to my profile.
31. As a company owner, I want a search term that my profile doesn't list to be marked as a profile gap, so that I can add it if I offer it.
32. As a company owner, I want to add a missing term to my profile or say "We don't offer this", so that the gap is resolved either way.

### Next action

33. As a company owner, I want one Next action card, so that I always know the single most useful thing to do.
34. As a company owner with AI drafts waiting, I want approving them shown first, so that nothing waits on me.
35. As a company owner with unfinished leads today, I want finishing today's leads shown second, so that the daily task (D2) stays central.
36. As a company owner, I want a Connection asking for what I sell shown next, so that I can respond to a real need.
37. As a company owner, I want a Hot Company that hasn't heard from me shown next, so that warm interest doesn't go cold.
38. As a company owner, I want connection requests shown next, then profile gaps, so that smaller tasks still surface.
39. As a company owner with an old profile, I want a freshness nudge (D4) when nothing else needs me, so that my profile stays current.
40. As a company owner with nothing to do, I want "You're all caught up", so that I can stop for the day.
41. As a company owner, I want each Next action to say "Shown because…", so that I trust why it was chosen.
42. As a company owner, I want acting on a Next action to update the card at once, so that the next item appears.

### Interest Signals tab

43. As a company owner, I want every interested Company listed with its Interest Level, so that I can work through them.
44. As a company owner, I want to open a Company and see a dated timeline of its signals, so that I understand how its interest built.
45. As a company owner, I want a short summary per Company, such as "Viewed your profile 4 times and saved it", so that I don't have to read every line.
46. As a company owner, I want to message or connect from a Company's entry, so that I can act where I'm looking.
47. As a company owner, I want repeat interest on separate days called out, so that I can tell real interest from one busy afternoon.

### AI Lead Agent tab

48. As a company owner, I want the AI Lead Agent tab to show the existing agent preview, so that I can see what's coming without thinking it's live.
49. As a Chamber Leader, I want that tab clearly labelled "Preview: after the MVP", so that expectations stay honest.

### Connections tab

50. As a company owner, I want to see and manage my Connections, so that I can keep my network tidy.
51. As a company owner, I want pending invitations with Accept and Ignore, so that I can respond to requests.
52. As a company owner who ignores a request, I want to be told the sender won't be notified, so that I feel safe ignoring.
53. As a company owner, I want Companies in my chamber with shared Connections, so that I can find nearby partners.
54. As a company owner, I want Buyers of what I sell based on my profile's products, so that I can find likely customers.
55. As a company owner, I want "From your connections" to show their Asks, Success Wall wins and profile updates, so that I can respond at the right moment.
56. As a company owner, I want an AI-drafted reply for each item, which I edit before sending, so that replying is quick and I stay in control.
57. As a company owner with the AI Assistant off, I want every reply to work by typing my own text, so that nothing depends on AI.
58. As a company owner, I want other Companies to see only my Connection count and Mutual Connections, so that my network stays mine.

### Profile tab

59. As a company owner, I want the Profile tab to open my existing profile editor, so that I edit my profile in one familiar place.
60. As a company owner, I want "Add to profile" from a search-term gap to land me in the right profile field, so that fixing a gap is quick.
61. As a company owner, I want profile completeness shown on the Overview's Profile card, so that I know how complete my profile is.

### Phone

62. As a company owner on a phone, I want Next action first, under my company name, so that the main task is the first thing I see.
63. As a company owner on a phone, I want the tabs in one row that I can swipe sideways, so that all five stay reachable.
64. As a company owner on a phone, I want the top numbers in a two-column grid, so that they stay readable.
65. As a company owner on a phone, I want interested Companies as stacked cards, so that nothing needs sideways scrolling.
66. As a company owner on a phone, I want the chart to show one line with a toggle, and the funnel stacked vertically, so that both stay legible.
67. As a company owner on a phone, I want nothing hidden compared with a laptop, so that I get the full product.

### Access and honesty

68. As a screen-reader user, I want tabs to behave as tabs, with the chart and funnel described in text, so that I get the same information.
69. As a keyboard user, I want to move between tabs and every action without a mouse, so that ComDash is fully operable.
70. As a user who prefers reduced motion, I want no animated transitions, so that the screen stays calm.
71. As a viewer of the demo, I want a note that all Companies, people and figures are example data, so that nobody mistakes them for real members.

## Happy and sad paths

### Happy paths

| Path                                                            | Expected                                                                          |
| --------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| A presenter claims Kalayaan Foods at `/app/claim`               | ComDash opens on Overview with calm empty states and today's leads as Next action |
| The presenter picks "Two weeks in" in the guide                 | Every Interest Signals panel fills; the Overview shows Next action and four cards |
| A company owner sends a message from Leads, then returns        | That Company's Interest Level and the funnel's "messaged" step update             |
| A company owner opens a Hot Company in Interest Signals         | Its timeline and summary show, with Message and Connect                           |
| A company owner clicks "Add to profile" on a search-term gap    | The Profile tab opens at the right field; after saving, the gap clears            |
| A company owner accepts an invitation                           | The request leaves Invitations and the Connection count rises                     |
| A company owner replies to a connection's Ask with the AI draft | The draft is editable, sends only on Send, and the item shows as answered         |
| A presenter switches to Pro                                     | Interest from other chambers and intent scores appear; Free content is unchanged  |
| A company owner reloads `/app/dash` on the Connections tab      | The Connections tab reopens with the simulation intact                            |
| A company owner clears every task                               | Next action shows "You're all caught up"                                          |

### Sad paths

| Path                                                   | Expected                                                                                              |
| ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| A Company has just claimed and has no signals          | Each panel shows a calm empty state, no zeros presented as a decline, no chart line                   |
| Only one simulated day has passed                      | Week-on-week comparisons are hidden rather than shown as +100%                                        |
| Fewer than three Companies share an industry           | That industry isn't shown in interest by industry                                                     |
| A Company searches ten times in one day                | It stays New, because repeats on one day count once                                                   |
| The AI Assistant is off or the daily AI limit is spent | Drafts are replaced by an empty reply box; every flow still works                                     |
| Free view                                              | No name, Interest Level or profile gap is hidden, and no upgrade prompt appears                       |
| An unknown tab address is opened                       | The Overview tab opens                                                                                |
| A deep link to a ComDash tab before claiming           | The claim completes automatically, as other `/app` routes do, then the tab opens                      |
| A very long Company name on a phone                    | It wraps inside its card with no sideways scrolling                                                   |
| A 360 pixel wide phone                                 | No sideways scrolling on any tab                                                                      |
| Keyboard only                                          | Every tab and action is reachable, with visible focus                                                 |
| Reduced motion                                         | No transitions; everything is visible immediately                                                     |
| JavaScript fails to load                               | The page shows a plain message to reload, as other `/app` screens do                                  |
| A full page load mid-demo                              | The simulation resets, as documented for `/app`, and the presenter guide offers the demo states again |

## Implementation Decisions

- **Scope of change.** The ComDash screen is replaced with the prototype's structure. Nothing else in `/app` changes, except the profile editor and the AI Lead Agent preview being reused inside tabs, and the presenter guide gaining tab shortcuts. The website, `/auth` and `/dashboard` are untouched.
- **Tab routing.** Each tab is its own route under the ComDash route (overview, signals, agent, connections, profile), sharing one ComDash layout with the header, plan switcher and tab row. The overview is the ComDash route itself. Moving between tabs uses client-side navigation so the browser-held simulation survives (ADR 0010). The existing standalone agent and company routes keep working, rendering the same components, so no existing link breaks.
- **Reuse, don't fork.** The AI Lead Agent tab renders the existing agent preview component unchanged. The Profile tab renders the existing company profile editor unchanged, apart from accepting a target field to focus when opened from a profile gap.
- **Removed from ComDash.** The Network Ring, the rank and Activity Score card, Recent wins, How to climb and Profile strength leave ComDash. The Network Ring component stays in the codebase unused. Monthly top and Wins keep their screens. The Activity Score rules are unchanged.
- **Service seam additions.** All new data is derived by pure functions exposed through the ComLinked service seam, reading the simulation state. Screens never compute these themselves:
  - Interest Signals per Company, with Interest Level and a one-line summary.
  - The funnel counts: found, viewed, saved, messaged, connected.
  - Top numbers with an optional comparison with the previous period.
  - Visibility by day or week since the claim date.
  - Search terms with profile-gap flags, and searcher roles for "Found you as a…".
  - Industry groups of three or more.
  - Alerts.
  - The ordered Next action, with its "Shown because" reason.
  - Plan-view filtering.
- **New signal kind.** The simulation gains a "saved your profile" signal. Search signals already carry the search term; the "Two weeks in" preset and the daily simulation gain saves and more varied search terms so that every panel has honest data by day 14. A new Company starts with none.
- **Interest Level** (glossary term). Over the last 14 simulated days: Hot if the Company messaged, or showed interest on 3 or more separate days; Warm if it showed interest on 2 separate days or saved the profile; New after one signal. Repeats of any kind on the same day count once.
- **Intent score** (Growth and Pro demo views only). Points per signal kind, one per kind per day: search appearance 1, recommended 2, profile view 3, save 5, message 10, capped at 100. Never shown on Free.
- **Plan views.** Free is the default and shows every MVP item. Growth adds the intent score for the Company's own chamber. Pro adds interest from other chambers, labelled with the chamber's name, plus the intent score. The switcher carries the label "Possible future pricing. Not in the MVP." The selected view is held in the simulation so it survives tab changes, and resets with it.
- **Next action order.**
  1. AI drafts waiting for approval
  2. Today's leads, if unfinished
  3. A Connection's Ask matching what the Company sells
  4. A Hot Company that hasn't heard from it
  5. Connection requests
  6. Profile gaps
  7. The freshness nudge, when the profile hasn't changed in 14 days
  8. "You're all caught up"

  Each carries a "Shown because…" sentence. This replaces the current "Do this next" logic.

- **"From your connections."** Built only from Asks, Success Wall wins and profile updates by the Company's Connections. Each item offers an AI-drafted reply through the existing draft and AI-limit rules. Nothing sends until the person taps Send, and with AI off the reply box starts empty. It is not a general news feed.
- **Connections lists.** Invitations come from the simulation's existing invites. "Companies in your chamber" uses existing Mutual Connections. "Buyers of what you sell" matches Companies whose needs match the products on the profile, using the existing fit logic.
- **Visual design.** The prototype's layout, panel order, panel titles and interactions are copied. Its sizes, spacing, radii, grid, borders, font weights and number treatment (tabular figures) are copied exactly, using App Mode colours and fonts rather than the prototype's palette or Open Sans and IBM Plex. Example figures come from the simulation, never from the prototype.
- **Interest Signals detail (decided 2026-11-12).** Where a prototype label names something outside the MVP, its MVP equivalent takes the same spot.
  - Tiles: Search appearances, Recommendations, Messages (the highlighted tile, in the prototype's Top 3 shortlist spot), Introductions, Profile views, Profile saves. Each has the prototype's change line, hidden when there is no previous period. Connections is not a tile.
  - Chart: "Visibility by day". Search appearances is the main line, with an area fill; Recommendations is the second line. Axis grid, end-of-line values, point hover labels and legend, with ticks every other day and no launch marker. The note is built from the data: "Since you claimed your profile on Day N", plus "Search appearances are rising" when the latest day beats the first-week average.
  - Funnel: Found you in search, Viewed your profile, Saved your profile, Messaged you, Connected, counting distinct Companies, with the note "last 14 days". "x% of previous" is a whole number, with one decimal under 10%, and never a percentage of zero. The suggestion line is picked by a fixed rule from the biggest drop, with no AI.
  - Table: "N interested companies", with chips All, Hot, Warm and New and their counts. The columns are Company, Interest Level (the level only on Free; score plus level on Growth and Pro), Latest signal ("Saved your profile · Day 12") and Action. The action is a status ("✓ Messaged", "✓ Connected"), otherwise a Message button. Rows open the drawer. New Companies with only search signals fold under "+ N more New companies with light activity (search appearances only)", a button that reveals them. On Pro, other-chamber rows say "· other chamber". There is no upsell.
  - Rail: Alerts (note "last 14 days"), Found you as a… (note "searches"), Who's interested by industry (groups of 3+), Search terms that found you. A gap shows the prototype's amber line, with small text links "Add to profile" and "We don't offer this"; once added, the green "Added to your profile." shows.
  - Drawer: the prototype's 420px panel, full width on a phone. One timeline row per signal kind per day, with ×N for repeats, and a "Repeat interest: signals on 3 separate days" row when the rule counts it. Free: heading "Signal timeline", the level only, no points. Growth and Pro: heading "How the intent score was built", level and score, points on each row, and "N points, capped at 100." There is no decay. It ends with "You see the company, not the person." and the status or Message, plus Connect. The drawer is non-modal: focus moves to Close, Escape closes it and returns focus to the row, and the open Company is kept as `?company=`.
  - Overview Interest Signals card: Interested companies (with the Hot count), Messages and Search appearances, a sparkline, and Hot Company names that open the drawer.
- **Phone layout.**
  - Next action moves to the top, and the four Overview cards stack in one column.
  - Tabs scroll horizontally in one row.
  - The timeline drawer fills the screen width.
  - Top numbers form a 2×3 grid.
  - The interested-companies table becomes stacked cards.
  - The chart shows one series with a toggle.
  - The funnel stacks vertically.
  - Nothing is hidden. Checked at 360 and 390 pixels.
- **Accessibility.**
  - Tabs follow the tab pattern with links.
  - The chart and funnel each have a text alternative listing their values.
  - Interest Level is shown as text, not colour alone.
  - Reduced motion removes transitions.
- **Main version.** The Next.js app becomes the main version again. The HTML mockup is frozen as the backup and gets a note that its ComDash is the older design; that note is added in the mockup source on the user's machine and never committed.
- **Glossary.** `CONTEXT.md` gains Interest Level, adds "saved its profile" to Interest Signal, and drops the Activity Score and rank from the ComDash entry.

## Testing Decisions

- **What makes a good test.** Tests check behaviour a company owner or presenter could observe: which Companies are Hot, what Next action shows, what a tab displays. They don't check internal data structures or component internals. Pure derived data is tested at the service seam; screens are tested through the browser.
- **Service seam (Vitest).** Extend the existing simulation tests, including their "Two weeks in" preset and their repeat-run determinism check. Cover:
  - Interest Level boundaries: one signal, two days, three days, same-day repeats, saves, messages, and the 14-day window.
  - Funnel counts and the hidden comparison with no previous period.
  - The industry-group threshold of three.
  - Search-term profile gaps, and resolving them by adding or dismissing.
  - Every Next action rule, in order, with its reason.
  - Plan-view filtering, where Free hides nothing.
  - A new Company's empty results.
  - "From your connections" containing only Asks, wins and profile updates.
- **Browser (Playwright plus axe).** Extend the existing product smoke test. Cover:
  - The claim-to-Overview path with empty states.
  - "Two weeks in" filling every panel.
  - Each tab's own address and reload.
  - A message from Leads updating ComDash.
  - Add to profile from a gap.
  - Accepting an invitation.
  - The AI-off reply path.
  - Switching plan views, including the label.
  - Phone layout at 360 and 390 with no sideways scroll.
  - Keyboard tab navigation.
  - Reduced motion.
  - axe with no serious or critical violations on every tab.
- **Prior art.** The simulation's unit tests, including the claiming, connections, two-weeks preset and point-limit groups. The product smoke test's laptop and phone daily-loop tests. The existing axe gate in the accessibility spec.

## Out of Scope

- Real data, a backend, real sign-in or real billing. Growth and Pro are a demo only, with no payment, plan storage or gating.
- The AI Lead Agent itself (agent search, agent-to-agent talks, booking), which stays in Phase 2. Its tab only shows the existing preview.
- Changes to the Activity Score rules, Monthly top, Wins, Leads, Asks Board, ComMail or the chamber tools beyond reuse.
- Rebuilding the redesign in the HTML mockup.
- The public website and its redesign.
- A general news feed.

## Further Notes

- **Clashes the user accepted knowingly.** The plan switcher sits uneasily with the plan's "free for everyone, no payments" non-negotiable. It is kept as a labelled demo, and Free shows everything. Removing the rank and Activity Score from ComDash moves D3's daily reason to come back off the home screen.
- **Plan wording.** The plan names four Interest Signals; this redesign adds "saved your profile" as a fifth. The plan's L2 row should be updated when the plan is next revised.
- **Branch and commits.** Work happens on `feat/website-redesign-pages`, with no new branch, at the user's request. Executer sessions leave changes uncommitted for the user to review.
- **Pilot.** ECCP is the first pilot chamber (decided 2026-11-10); the simulation already uses the ECCP network.
