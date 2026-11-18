# Demo premium pass

**Status:** ready-for-agent
**Date:** 2026-11-18
**Source:** grilling session of 2026-11-18 on making the Demo's screens look more premium (23 decisions, confirmed by the user)
**Feature IDs:** none new. This pass changes how existing screens look, not what they do.
**Vocabulary:** [CONTEXT.md](../../CONTEXT.md), sections "Showing ComLinked" and "Design"
**Visual source:** the specimen page at `.scratch/demo-premium/specimen.html`. It opens on the user's picks. Where the specimen and this spec disagree, this spec wins (see [Where the specimen strays](#where-the-specimen-strays)).
**Waits for:** the "View as" tier work that is uncommitted on this branch (see [Work this spec waits for](#work-this-spec-waits-for)).

## Problem Statement

The Demo is what Richard shows ECCP's Chamber Leader, and what the Leader replays alone afterwards. It is tidy and consistent, and nothing in it is broken. But it reads as a clean template, not as a product a chamber would trust with its members.

The causes repeat on almost every screen:

- **Nothing leads.** Panels, text and buttons carry the same weight, so the eye has no first stop. Leads and ComMail work best only because one item is selected.
- **Type has little range.** Nearly everything is 16px, and figures are small. The stylesheet holds 16 font sizes and 8 corner radii, many a half pixel apart, so there is no scale to hold to.
- **One tab looks unlike the rest.** Interest Signals was built to a prototype's exact measurements, so it is denser and flatter than every other screen.
- **Space looks left over.** The Opening and the ask are bare text on grey. ComDash Overview's Connections card sits half empty beside a tall card.
- **Finish is generic.** Company marks are flat grey squares. Every panel floats on the same shadow. Counts sit in solid navy circles. Labels in capitals sit above headings, which the design system forbids.
- **Charts mislead.** Daily counts of 0, 1 and 2 are drawn as a line, which zigzags and looks broken.
- **Long lists run on.** The chamber screens show all 100 members in one column about 7,000px tall.
- **The Story Bar shouts.** It is a full-width pale blue band, and the loudest thing on every Stop.
- **The high point lands flat.** A Company claims and its three Matches are simply there.

## Solution

A **premium pass** over every screen of the Demo. The direction is **quiet and exact**: the same navy, off-white page, two fonts and layouts, with premium earned through hierarchy, a short type scale, deliberate spacing, finer detail and very little movement. The yardstick is Mercury for overall feel and Stripe's dashboard for tables, figures and charts. Only principles are borrowed.

What changes for someone looking at the Demo:

1. **One thing leads on every screen.** Panels become flat white with a hairline border and no shadow. One panel per screen, the **Focus panel**, is raised: the thing to act on now.
2. **One scale.** Eight font sizes and three corner radii for the whole Demo, in a standard density for most screens and a compact density for data panels. Interest Signals keeps its structure and takes the compact density, so every tab looks like one product.
3. **Figures in the sans face.** The serif is kept for the page title and one formal line per screen, so it keeps its weight.
4. **Company marks that carry meaning.** A pale blue square with navy initials for a Company that has claimed, a dashed empty square for one that has not.
5. **Charts that fit the data.** One bar per day on both ComDash charts.
6. **A quiet Story Bar.** A slim second row of the white header: where you are in the walk, the day, whose Seat, Back and Next.
7. **Four screens recomposed.** The Opening and the ask become two panels, navy and white, like the claim steps. The chamber screens lead with one claimed figure over how the 100 members split, with members grouped by status. ComDash Overview gives Interest Signals the wide column and stacks Connections and Profile beside it.
8. **One staged moment.** After the claim on Stop 2, the three day-one Matches arrive one after another. Everything else moves only when the viewer acts.

Nothing a screen does changes, no wording changes, and the order of the Stops stays.

## User Stories

### The Chamber Leader in the meeting

1. As a Chamber Leader, I want the Opening to look like an invitation made for my chamber, so that I take the next ten minutes seriously.
2. As a Chamber Leader, I want the Opening to say plainly that ECCP has not joined and everything is invented, so that I am not misled by how finished it looks.
3. As a Chamber Leader, I want to see the six Stops as a timeline by day before the walk starts, so that I know what I am about to be shown.
4. As a Chamber Leader, I want one thing to stand out on each screen, so that I know where to look while Richard talks.
5. As a Chamber Leader, I want the Story Bar to tell me the day, what is happening and whose Seat I am in without pulling my eye from the screen, so that I follow the story and not the controls.
6. As a Chamber Leader, I want to see how far through the walk I am, so that I can judge how much is left.
7. As a Chamber Leader, I want the chamber screen to open on how many members have claimed, so that I see the pilot's progress in one figure.
8. As a Chamber Leader, I want to see how my 100 members split into active, quiet, needs an intro and not yet claimed, so that I understand the state of the pilot at a glance.
9. As a Chamber Leader, I want deals confirmed and wins posted shown beside the claimed figure, so that I see results next to adoption.
10. As a Chamber Leader, I want members grouped by status with a few shown per group, so that I see who is in each group without scrolling through 100 rows.
11. As a Chamber Leader, I want to tell at a glance which Companies have claimed, so that I trust that a named Company is really taking part.
12. As a Chamber Leader, I want the three day-one Matches to arrive in front of me after the claim, so that I feel the promise of leads on the first day.
13. As a Chamber Leader, I want figures large and plain, so that I can read them from across a meeting table or on a shared screen.
14. As a Chamber Leader, I want daily counts drawn as bars, so that a quiet day does not look like a fault.
15. As a Chamber Leader, I want the ask to state the two things my chamber gives, large and numbered, so that the cost of saying yes is clear.
16. As a Chamber Leader, I want "The pilot is free for ECCP and its members." to be easy to find on the ask, so that I do not have to ask what it costs.
17. As a Chamber Leader, I want the walk to close in the same form it opened in, so that it feels like one finished piece.
18. As a Chamber Leader, I want every screen to look like the same product, so that I do not wonder which parts are real.

### The Chamber Leader alone on the link

19. As a Chamber Leader replaying the Pilot Preview on my phone, I want every Stop to keep its hierarchy on a small screen, so that it makes sense without a presenter.
20. As a Chamber Leader on a phone, I want Next to stay fully visible and easy to tap on every Stop, so that I never get stuck.
21. As a Chamber Leader on a phone, I want no screen to scroll sideways, so that nothing is cut off.
22. As a Chamber Leader exploring on my own after the ask, I want Leads, ComMail, Asks and Wins to look as finished as the Stops, so that the product holds up when I leave the script.
23. As a colleague the Leader forwards the link to, I want the Opening to explain itself, so that I understand what I am looking at.

### The presenter

24. As Richard, I want Next in the same place on every Stop, so that I never hunt for it while speaking.
25. As Richard, I want the Story Bar to stay out of the way of the screen's own main button, so that I can point at one clear action.
26. As Richard, I want the clicks in the Run of Show to still work, so that I do not relearn the walk.
27. As Richard, I want the filter click on Stop 5 to still show the members who need an intro, so that the side step to the Community Manager follows naturally.
28. As Richard, I want the staged moment on Stop 2 to take about a second, so that it does not slow the walk.
29. As Richard, I want the later items I switch on from the Presenter Guide to fit the same layout, so that showing them does not break the screen.

### The member Company

30. As an Authorized Representative, I want Next action to be the one raised panel on ComDash Overview, so that I know what to do first.
31. As an Authorized Representative, I want the Overview's cards sized to their content, so that no card looks unfinished.
32. As an Authorized Representative, I want the Hot Companies listed with their marks and Interest Level, so that I can open the right timeline quickly.
33. As an Authorized Representative, I want the Interest Signals tab to look like the tabs beside it, so that ComDash feels like one screen.
34. As an Authorized Representative, I want the Messages tile to stand out among the six top numbers, so that I see the strongest Interest Signal first.
35. As an Authorized Representative, I want search appearances and recommendations shown per day as stacked bars, so that I see both on one chart without a toggle on my phone.
36. As an Authorized Representative, I want the selected Company to be the raised panel on Leads and on my day-one Matches, so that the list and the detail are easy to tell apart.
37. As an Authorized Representative, I want a not-yet-claimed Company's mark to look different from a claimed one, so that I know before I message that the reply may wait.
38. As an Authorized Representative, I want the open conversation to lead on ComMail, so that the reply box is where my eye lands.
39. As an Authorized Representative, I want the box for posting an Ask to lead on Asks, so that posting is the obvious thing to do.
40. As an Authorized Representative, I want the card for sharing a win to lead on Wins, so that sharing is the obvious next step after a deal.
41. As an Authorized Representative, I want my Profile Strength to lead on the Profile tab, so that I see what to improve.
42. As an Authorized Representative, I want Invitations to lead on the Connections tab, so that a Connection Request waiting on me is not missed.
43. As an Authorized Representative, I want the Morning Digest to lead with my rank and the button to today's Daily Lead List, so that the morning starts with one action.
44. As an Authorized Representative, I want the claim message and then the claim step's action panel to lead on Stop 2, so that claiming feels like one clear step.
45. As an Authorized Representative, I want one solid button on each screen, so that the main action is never in doubt.
46. As an Authorized Representative on a phone, I want controls at least 44px tall, so that I can tap them easily.
47. As an Authorized Representative, I want a status to change in front of me after I Connect or Send, so that I know the action worked.

### The Community Manager and the Chamber Contact

48. As a Chamber Contact, I want to filter members by status from the row under the split bar, so that I can find who has not claimed yet.
49. As a Chamber Contact, I want each filter to show its count and its colour from the split bar, so that the bar and the list read as one thing.
50. As a Chamber Contact, I want choosing a status to show that whole group, so that I can see every member in it.
51. As a Chamber Contact, I want "All" to bring back the grouped view, so that I can return to the overview.
52. As a Chamber Contact, I want my view marked read-only, so that I know I cannot act from it.
53. As a Community Manager, I want my tools kept beside the member list in the same quiet panels, so that the screen I work from matches the one the chamber reads.
54. As a Community Manager on Day 0, I want the figure to read 0 of 100 with every member not yet claimed, so that the starting point is honest.
55. As a Community Manager, I want a member with a message waiting to keep its "A member is waiting" line, so that I know whom to remind.

### ComLinked Staff and the later items

56. As ComLinked Staff, I want the Team Dashboard restyled to the same scale and panels, so that it does not look like an older product.
57. As a presenter who switches on the later items, I want the AI Lead Agent card to join the stack beside Interest Signals on ComDash Overview, so that the layout holds.
58. As a viewer of the Engine screen, I want the Network Ring to be its raised panel, so that the screen has one centre.
59. As a viewer of the AI Lead Agent preview, I want the Mandate form to be its raised panel, so that the first step is clear.

### Access and honesty

60. As a person using a keyboard, I want every control reachable in order with a visible focus ring, so that I can use the Demo without a mouse.
61. As a person using a screen reader, I want the split bar's meaning given in words and counts, so that I am not relying on colour.
62. As a person using a screen reader, I want the chart's daily values available as text, so that the bars are not the only source.
63. As a person who has asked for reduced motion, I want the day-one Matches shown at once and every transition removed, so that nothing moves.
64. As a person who cannot tell the colours apart, I want every status to carry a label and every not-yet-claimed mark to differ in shape, so that colour is never the only cue.
65. As a viewer, I want the "Example data" tag kept beside the logo on every screen, so that a screenshot is never mistaken for real activity.
66. As a visitor on the public website, I want the "Who's interested" and Activity View example panels to look like the Demo they picture, so that the picture and the product agree.

### Upkeep

67. As a developer, I want every size, radius and colour to come from one named scale, so that a new screen cannot drift.
68. As a developer, I want the company mark, the status tags and the Focus panel each built once and reused, so that a change is made in one place.
69. As a developer, I want the design system document to describe what the app now does, so that the next screen is built to the same rules.
70. As a reviewer, I want before and after screenshots of every screen at laptop and phone width, so that I can judge the pass without running it.
71. As the user, I want to approve four reference screens in the real app before the rest are built, so that a rule that looked right on the specimen is not copied onto twenty screens if it looks wrong in the app.

## Happy and sad paths

### Happy paths

| Path                                                   | Expected                                                                                                                                                                                              |
| ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| The Leader opens the Pilot Preview                     | Two panels: navy with the logo rings, "A preview for ECCP", the one-line description and the invented-data line; white with "The 6 stops" as a timeline by day and Start                              |
| Richard presses Start, then Next through all six Stops | Every Stop shows the Story Bar as a slim second row of the header, with the step dots marking the Stop, and Next in the same place                                                                    |
| Stop 1, Day 0, the Community Manager's Seat            | "0 of 100" claimed, the split bar all "not yet claimed", the members under one heading, and the manager's tools beside them                                                                           |
| Stop 2, the claim finishes                             | The three day-one Matches arrive one after another in about a second, and the selected Match is the Focus panel                                                                                       |
| Stop 3, the next morning                               | The rank line and "Open today's lead list" lead the digest                                                                                                                                            |
| Stop 4, ComDash Overview                               | Next action is the one raised panel. Interest Signals fills the wide column with its three figures, 14 day bars and the Hot Companies. Connections and Profile stack beside it                        |
| Stop 5, ECCP's view                                    | "40 of 100" over a bar split 20, 16, 4 and 60, with deals confirmed 3 and wins posted 2 beside it. Members are grouped Active, Quiet, Needs an intro, Not yet claimed, six per group                  |
| Richard chooses "Needs an intro 4" on Stop 5           | The list shows those four members only, and "All 100" brings back the grouped view                                                                                                                    |
| Stop 6, the ask                                        | Two panels: navy with the two things ECCP gives, numbered, and "The pilot is free for ECCP and its members."; white with what ComLinked does, what members get, Email Richard and Explore on your own |
| A member opens Interest Signals                        | Six tiles with Messages raised, stacked day bars beside the funnel, then the table and the rail, all in the compact density                                                                           |
| A member opens Leads                                   | The list is flat, the selected Company is raised, and a not-yet-claimed Company shows a dashed mark and its tag                                                                                       |
| A member sends a message from the timeline drawer      | The drawer slides in, and after Send the action reads as a status                                                                                                                                     |
| Any screen at 390 pixels                               | One column, panels inset by 16px, the same order as today, no sideways scroll                                                                                                                         |

### Sad paths

| Path                                                                                | Expected                                                                                                         |
| ----------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| A status has no members and its filter is chosen (Active on Day 0)                  | The list says so in one line, and the chip still shows 0                                                         |
| A status has no members in the split bar                                            | No segment is drawn for it, and its chip still shows 0                                                           |
| A group holds fewer than six members                                                | All of them show, with no "Show all" control                                                                     |
| A new Company with no visibility yet                                                | The chart panels show their calm empty state and no bars                                                         |
| A day with no search appearances or recommendations                                 | A short tick marks the day, so the gap reads as a quiet day                                                      |
| Reduced motion is on at the claim                                                   | The three Matches are all present at once, with no sequence                                                      |
| Reduced motion is on anywhere                                                       | No transition or animation runs                                                                                  |
| A very long company name at 360 pixels                                              | It wraps inside its row, the mark and tag stay in place, and nothing scrolls sideways                            |
| The Story Bar at 360 pixels                                                         | It is no taller than today's on Stops without a side step, and Next is fully visible and at least 44px tall      |
| The fonts fail to load                                                              | The fallback faces show, and no layout breaks or overlaps                                                        |
| The page is zoomed to 200%                                                          | Text does not overlap or get cut off                                                                             |
| Keyboard only                                                                       | Every chip, row, tab and Story Bar control is reachable in order with a visible focus ring                       |
| Colour cannot be told apart                                                         | Every status has a label and count, and a not-yet-claimed mark differs by its dashed outline                     |
| The presenter switches on the later items                                           | The AI Lead Agent card joins the stack beside Interest Signals, and no card is left half empty                   |
| Possible future pricing is on and the Free member view shows                        | Hidden rows, the upgrade box and the lock line keep to the scale, and the tab still has at most one solid button |
| A screen has nothing to act on ("You're all caught up")                             | The Focus panel still shows, holding that line                                                                   |
| A screen with no Focus panel (Search, Notifications, Team Dashboard, After the MVP) | No panel is raised, and the page title leads                                                                     |

## Implementation Decisions

### The scale

- **One scale for the whole Demo.** Every font size, corner radius and space on a Demo screen comes from the values below. They are defined once as named values and used by name. No literal size, radius or colour appears anywhere else in the App Mode styles.
- **Font sizes: eight, plus one.**

  | Size | Used for                                                                                                |
  | ---- | ------------------------------------------------------------------------------------------------------- |
  | 12   | Count badges, tags, chart axis, initials in a mark                                                      |
  | 13   | Notes, captions, labels above figures, details in the compact density                                   |
  | 14   | Details such as city or time, body text in the compact density, compact buttons                         |
  | 16   | Body text, company names, navigation, tabs, buttons, inputs                                             |
  | 18   | Section and panel titles                                                                                |
  | 22   | The Focus panel's serif line on phones                                                                  |
  | 28   | Figures. The Focus panel's serif line and the page title on phones                                      |
  | 36   | Page titles on laptops. The two-panel headline on phones                                                |
  | 44   | Only the two-panel headline on laptops (Opening, the ask, claim steps) and the chamber's claimed figure |

- **Faces and weights.** Source Serif 4 at 500 for the page title, the Focus panel's one formal line and the two-panel headline, and nothing else. Nunito Sans at 400 and 600 for everything else, figures included. 700 is not used.
- **Figures.** Nunito Sans 600 at 28 in both densities, in ink, with the label above in 13 and any note below in 13. Both faces already set figures at equal width, so no figure setting is needed.
- **Radii: three, plus pills.** 6 for company marks and small inner shapes, 10 for controls, 14 for panels. Tags, count badges and chips are pills.
- **Space.** Multiples of 4. Panel padding is 24 in the standard density and 16 to 20 in the compact density. The gap between panels is 20 in the standard density and 12 in the compact density. Space is tight inside a group and clearly larger between sections.
- **Two densities.** Standard for most screens. Compact for data panels wherever they appear: number tiles, tables, charts, side rails, the chamber screens and the Team Dashboard. A panel's density is set once on the panel, not per element.
- **Controls.** Standard controls are 40px tall on laptops and 44px on phones. Compact controls (chips, table actions, the Story Bar's buttons) are 32px on laptops and 44px on phones.
- **Colour.** No new hue. One new neutral joins App Mode: a quieter grey for third-level text, `#62676c`, which must hold 4.5:1 on both the page and a panel. Every other colour is an existing App Mode value.
- **No capitals.** No heading, label or table header is set in capitals. The labels above headings ("COMDASH", "HOT COMPANIES", "ECCP ON COMLINKED") go: where one names the screen it is dropped, and where it titles a list it becomes a sentence-case title.

### Panels and the Focus panel

- **Panels.** White, a 1px hairline border, the panel radius, no shadow. This replaces "one raised white panel per column".
- **The Focus panel.** One per screen at most. White, no border, raised on a soft navy-tinted shadow, with slightly more padding. Where it holds a line of text to act on, that line is the screen's one serif line below the title.
- **Which panel it is.**

  | Screen                                               | Focus panel                                                 |
  | ---------------------------------------------------- | ----------------------------------------------------------- |
  | Opening, the ask                                     | The navy panel                                              |
  | Claim message and claim steps (Stop 2)               | The claim message, then the action panel of the claim steps |
  | Day-one Matches                                      | The selected Match                                          |
  | Morning Digest                                       | The rank line and "Open today's lead list"                  |
  | ComDash Overview                                     | Next action                                                 |
  | Interest Signals                                     | The Messages tile                                           |
  | Connections tab                                      | Invitations                                                 |
  | Profile tab                                          | Profile Strength                                            |
  | Leads                                                | The selected Company                                        |
  | ComMail                                              | The open conversation and its reply box                     |
  | Asks                                                 | The box for posting an Ask                                  |
  | Wins                                                 | The card for sharing a win                                  |
  | Chamber screens, both Seats                          | The claimed figure with its split                           |
  | Engine                                               | The Network Ring                                            |
  | AI Lead Agent preview                                | The Mandate form                                            |
  | Search, Notifications, Team Dashboard, After the MVP | None                                                        |

- **One solid button per screen.** The screen's main action is the only solid navy button. Every other button is outline or quiet. The Story Bar's Next is outlined, so it never competes.
- **Phones.** Panels stay inset with a 16px gutter and keep their hairline, as the app does today. The Focus panel keeps its raise.

### Top bar and Story Bar

- **Top bar.** White with a hairline under it and no shadow. The active place is ink at 600 with a navy underline. Count badges are small tinted pills with navy figures, as the design system already says.
- **Story Bar.** A slim second row of the white header, about 48px tall on laptops, closed by a hairline. Left to right: six step dots (done, current, to come), the day and what is happening at 600, whose Seat in the quieter grey, then the Stop count, Back as a quiet button and Next as an outlined button. A Stop's side step is a quiet button before the count.
- **Story Bar on phones.** No taller than today's on a Stop without a side step: the step dots share the first row with Back and Next, the day and title follow, then the Seat line. A side step sits on its own row. Next is at least 44px tall.
- **Unchanged.** What the Story Bar says, where Next and Back go, the side step's behaviour and the "exploring" line all stay as the Pilot Preview spec set them. The Story Bar is still not fixed to the screen.

### Company marks and tags

- **Marks.** A square with initials, at the mark radius. A Company that has claimed: pale blue ground, navy initials. A Company that has not: no ground, a dashed outline, initials in the quieter grey. Your own Company's mark stays solid navy. Whether a Company has claimed comes from the service seam, which already knows it.
- **Everywhere.** The same mark shows wherever a Company is listed: Leads, day-one Matches, ComMail, Asks, Search, the digest, the Hot Companies, the timeline drawer and the chamber screens. It is one component.
- **The tag stays.** "Not yet claimed" still shows as a tag wherever it does today, so the mark's shape is never the only cue. Inside a group already headed by its status, rows carry no status tag.
- **Interest Level tags.** Hot is solid navy, Warm is the blue tint, New is outlined.
- **Member status tags.** Active is the blue tint, Quiet is grey, Needs an intro is the error tint, Not yet claimed is outlined.
- **Shape shows what can be tapped.** Tags and count badges are pills that cannot be tapped. Chips are pills with a border that can.

### Charts

- **Small chart, ComDash Overview.** One bar per day over the range it covers today. A day with nothing shows a short tick on the baseline. "Day 1" and the last day label the ends, and the sentence under the chart stays.
- **Large chart, Interest Signals.** One bar per day, with search appearances in navy and recommendations stacked above in light blue. It keeps the axis grid, the legend, a hover label on each segment, a tick label every other day, the latest day's values in text and the note built from the data. The text list of daily values for screen readers stays.
- **No toggle.** Both series fit on a phone, so the series toggle is removed.
- **Data.** Both charts use the two daily series the service seam already returns. No new figures are invented.
- **Empty.** A new Company with no visibility still sees the calm empty state and no bars.

### The four recomposed screens

- **ComDash Overview.** Next action spans the width as the Focus panel. Below it, two columns on laptops: Interest Signals in the wide one, holding its three figures, the day bars and the Hot Companies; Connections and Profile stacked in the narrow one, each as tall as its content. When the presenter shows the later items, the AI Lead Agent card joins the narrow stack. One column on phones, in today's order. Each card's contents and links are unchanged.
- **Chamber screens, both Seats.** The five tiles give way to one Focus panel: the claimed figure ("40 of 100"), a bar split in proportion into active, quiet, needs an intro and not yet claimed, and deals confirmed and wins posted beside it. Under the bar sits the status filter. Below, the member list sits beside the same side column as today (the Community Manager's tools, or the Success Wall and Monthly Top Companies).
- **The status filter is the bar's key.** Five chips: All, Active, Quiet, Needs an intro, Not yet claimed. Each status chip carries its colour from the bar and its count. The group keeps its accessible name, so it is still found as the status filter.
- **The member list.** With All chosen, members are grouped under the four status headings in today's order, each heading with its count, six members shown per group in two columns on laptops, and a control to show the whole group. With a status chosen, that whole group shows. A status with no members says so in one line. The grouping and the six-per-group cut are worked out at the service seam, not in the screen.
- **Bar colours.** Active is navy, Quiet is the light logo blue, Needs an intro is the error red, Not yet claimed is the sunken grey. A status with no members draws no segment. The bar is decoration for assistive technology: the chips carry the same counts in text.
- **The Opening.** Two panels in one raised frame, like the claim steps. Navy with the logo rings: the title as the two-panel headline, the one-line description, and the invented-data line at the foot above a rule. White: "The 6 stops" as a vertical timeline with the day beside each Stop, then Start as the solid button. The last Stop has no day.
- **The ask.** The same two panels. Navy: the title, the two things ECCP gives as a numbered pair, and "The pilot is free for ECCP and its members." at the foot in the serif. White: "ComLinked does the rest" and "What your members get" as plain lists, then Email Richard as the solid button, Explore on your own as outline, and the presenter's address as text.
- **Phones.** On both two-panel screens the navy panel stacks above the white one.
- **Wording.** Every sentence on these four screens is today's. Nothing is added.

### Interest Signals at the compact density

- **Kept.** The tab's structure, panel titles, order, filters, fold, drawer and every interaction from the ComDash spec.
- **Changed.** Its sizes, radii, panel surfaces and tags now come from the compact density and the shared parts, not from the prototype's measurements. The Messages tile is the tab's Focus panel in place of its outline highlight. Table headers are sentence case.
- **Tier elements.** The "View as" tier work adds group headings, the plan line, hidden rows with blurred text, an upgrade box, a lock line, weekly alerts and the "Send my agent" action to this tab. All of it is styled by the same rules: one scale, tags as pills, compact controls, and at most one solid button on the tab with the tier's buttons counted. A hidden row's mark carries no initials. This spec does not decide what a tier shows or hides.
- **Two views to check.** With possible future pricing off, as in the Pilot Preview, the tab shows every name and no tier element. With it on, the full Demo opens on the Free member view. Both must hold to the rules.

### Motion

- **State changes.** 150 to 250ms on things the viewer triggers: the timeline drawer sliding in, a tab's underline moving, a status replacing a button after Connect or Send, a chip being chosen.
- **One staged moment.** After the claim finishes on Stop 2, the three day-one Matches arrive one after another, about a second in all. It runs once, on arrival from the claim, and not when the screen is opened any other way.
- **Nothing else is staged.** No screen animates on load, and no figure counts up.
- **Reduced motion.** Every transition and the staged moment are off, and the finished state shows at once.

### The website's two example panels

- **Only these two.** The "Who's interested" panel on the ComDash page and the Activity View panel on the For Chambers page are restyled to picture the new Demo: the marks, the tags, sans figures, and the claimed figure with its split in place of five tiles.
- **Nothing else.** No other part of the website changes, and Site Mode's rules are untouched. Each panel stays marked as an example.

### Documents

- **Design system.** Its App Mode section is brought in line: the type table, panels and the Focus panel (renaming "Active panel"), the company mark, charts, the Story Bar, compact controls, inset panels on phones, the one staged moment, and the navy two-panel form widened from the claim steps to the Opening and the ask. Its token list gains the scale and the quieter grey. Its "View as" paragraph, which still says there is never blur or an upgrade prompt, is rewritten to match the tier decision of 2026-11-18.
- **Older specs.** The ComDash redesign and Pilot Preview specs each get a dated note at the top pointing here for how screens look. Their text is not rewritten.
- **Run of Show.** Updated only where a click or what is on screen changes. The Stop 5 filter click stays.
- **Glossary.** "Focus panel" is already in CONTEXT.md. No other term is added.
- **No ADR.** Styling is easy to reverse.

### Code quality

- The scale is defined once. A reviewer searching the App Mode styles finds no font size, radius or colour written as a literal outside that definition.
- The company mark, the tags, the panel, the Focus panel, the filter chips and the day-bar chart are each one shared part. No screen keeps its own copy.
- Rules that no longer apply are deleted, not overridden. The stylesheet ends with fewer distinct values than it started with.
- Screens do not work out counts, groups or claim status. They ask the service seam.
- No dependency, icon set, hue or dark mode is added.

## Testing Decisions

- **What makes a good test.** It checks something a viewer could observe: what leads on a screen, what a figure reads, which members a filter shows, whether Next is reachable, whether anything moves. It does not check class names, component structure or how a style is written.
- **Two seams, both existing.** Screens and the rules of the pass are tested through the browser. The chamber's grouping and split are tested at the ComLinked service seam. No component test is added unless a state cannot be reached in the browser. No screenshot comparison is added.
- **Service seam (Vitest).** Extend the existing simulation tests. Cover:
  - On Day 14 the split is 20 active, 16 quiet, 4 needing an intro and 60 not yet claimed, and the four add up to the network's size.
  - On Day 0 the split is 0, 0, 0 and 100.
  - The grouped list returns the four groups in order, each with its full count and at most six members, in the same member order as today.
  - A group with six or fewer members returns all of them and reports nothing more to show.
  - Choosing a status returns that whole group, and a status with no members returns none.
  - An introduction moves a member out of "Needs an intro" in both the split and the groups.
- **Browser (Playwright plus axe).** Extend the existing product, Pilot Preview and website tests. Cover:
  - **The rules, on every Demo screen at 1280 and 390 pixels:** every visible text size is on the scale; no text is set in capitals; at most one Focus panel; at most one solid button outside the Story Bar; no sideways scroll at 360 or 390.
  - The Opening and the ask each show two panels on a laptop and stack on a phone, with every sentence they carry today.
  - The Story Bar on each Stop: the step dots mark the Stop, Next and Back work, and at 360 pixels Next is fully visible and at least 44px tall.
  - ComDash Overview: Next action is the Focus panel, Interest Signals holds its three figures, one bar or tick per day and the Hot Companies, and Connections and Profile sit beside it on a laptop.
  - With the later items switched on, the AI Lead Agent card joins the narrow column.
  - Interest Signals holds to the rules both with possible future pricing off and on the Free member view.
  - The chamber screen on Day 14 and Day 0: the claimed figure, the counts on the five chips, six members per group, the whole group when a status is chosen, the one-line empty state, and "All" restoring the groups.
  - The Run of Show's clicks, walked end to end.
  - A claimed and a not-yet-claimed Company show different marks on Leads and on the chamber screen, and the not-yet-claimed one keeps its tag.
  - The large chart shows both series for each day with no toggle, on a laptop and a phone, and its text list still gives each day's values.
  - After the live claim, the three Matches end up present, and with reduced motion they are present with no transition running.
  - Reduced motion: no transition or animation on any Demo screen.
  - Keyboard: the chamber's chips, the member rows, the tabs and the Story Bar are reachable in order with a visible focus ring.
  - Axe with no serious or critical violation on every Demo screen, with the drawer open and closed.
  - The website's two example panels show the new marks and the claimed figure with its split, and still carry their example mark.
- **Existing tests change.** Tests tied to the five tiles, the flat member list, the two-line chart and its toggle, the four Overview cards in a grid and the tile highlight are updated to the new screens. Each change is a deliberate update of an expectation, never a weakened check.
- **Screenshots for review.** Each session saves before and after screenshots of its screens at 390 and 1280 pixels. The last session also checks 360 and 1440. These are for the user's review and are not compared by a test.
- **Prior art.** The simulation's Activity View and member status tests. The product smoke test's phone and laptop walks, its reduced-motion check that reads computed transitions, and its keyboard tests. The Pilot Preview test's status filter and Run of Show walk. The website test's example panel checks. The accessibility spec's axe gate.

## Out of Scope

- What any screen does, any wording, the order of the Stops and the Demo's story.
- The public website, apart from the two example panels.
- The sign-in pages and the `/dashboard` starter screens.
- What a "View as" tier shows or hides, and its wording.
- The rename of the invented company names flagged by the name check.
- Dark mode, new icons, new hues, illustration and photography.
- New dependencies, including any charting or animation library.
- Splitting the App Mode stylesheet into several files.
- Screenshot-comparison tests.
- The private demo link and anything to do with deploying.

## Further Notes

### Earlier decisions this replaces

- **ComDash, 2026-11-12, "copy the prototype's sizes exactly".** Interest Signals now takes its sizes from the compact density.
- **ComDash, 2026-11-12, the two-line "Visibility by day" chart with a phone toggle.** It becomes stacked day bars with no toggle.
- **ComDash spec, four Overview cards two by two.** Interest Signals takes a wide column, with the others stacked beside it.
- **Pilot Preview spec, five tiles and a flat member list "built from ComDash's parts".** The chamber screens lead with the claimed figure and group their members. The status filter, its counts, its empty line and story 77 all stay.
- **Design system.** Every panel raised on a soft shadow; navy only on the claim steps; the name "Active panel"; panels edge to edge on phones.

### Where the specimen strays

The specimen was drawn quickly to settle the look, and a few of its values sit between steps of the scale. The scale wins:

- Navigation, tabs, buttons, company names and the Story Bar's text are 15px in the specimen. They are 16 in the standard density and 14 in the compact density.
- The two-panel description is 17px. It is 16 or 18.
- Tile figures are 26px and the serif alternative used 30 and 48. Figures are 28 and the claimed figure is 44.
- Marks use 8px and 7px corners and initials at 11.5 and 10.5px. They use the 6 radius and 12px initials.
- The two-panel frame uses an 18px corner. It uses the panel radius.
- The specimen's phone layout is approximate. This spec's phone rules apply.

If the reference screens look heavy at 16 when the user reviews them, the answer is to change that step of the scale for the whole Demo, not to add a ninth size.

### Choices made while writing this spec

These were not put to the user as questions. Each can be overturned.

- Figures are 28 in both densities, where the specimen's compact tiles used 26.
- Compact controls are 32px tall on laptops, which adds an exception to the design system's 40px rule.
- On phones the Story Bar's dots share a row with Back and Next, to keep it no taller than today's.
- The staged moment runs only on arrival from the claim, not each time the Matches screen opens.
- A status with no members draws no segment in the split bar.
- In the grouped view a status with no members shows no heading, so Day 0 shows the one heading "Not yet claimed".
- "Show all" under a status heading chooses that status's chip, so there is one way to see a whole group, not two.
- The Focus panel carries one stable marker in the page, so the browser checks in every session find it the same way.
- The first session saves before screenshots of every Demo screen, because the shared parts change every screen at once.
- Rows inside a status group carry no status tag, since the heading names it.
- The Focus panels for Stop 2, the digest, Engine and the AI Lead Agent preview follow the table the user confirmed.
- The Presenter Guide's own panel is restyled to the same scale in the last session.
- The upgrade box's button counts as the Interest Signals tab's one solid button when a tier shows it.
- The design system's "View as" paragraph is rewritten in the last session to match the tier decision.

### Work this spec waits for

On 2026-11-18, in another session, the user decided that ComDash's "View as" tiers copy the prototype's paid tiers. The Free member view blurs names, Interest Levels and signals, lists six rows and five search terms, and shows an upgrade box and weekly alerts without names. Growth names the Company's own chamber and offers "Send my agent". Pro names every chamber. With possible future pricing off, which is the Pilot Preview's default, ComDash shows everything with no tier, so Stop 4 keeps its names.

That work was uncommitted on this branch while this spec was written. It touches the App Mode stylesheet, the Interest Signals components, the service seam and both browser test files, which this pass also changes.

- **Order.** Session 1 starts only after that work is reviewed and committed.
- **Reach.** This pass styles whatever that work leaves on screen. It does not decide what a tier shows.
- **A known departure.** The tiers break the build plan's "no blurred names" rule. The user chose this knowingly, as a labelled demo of possible future pricing, and Richard must agree before it is shown. This pass neither widens nor narrows it.

### Working rules

- **Three sessions.**
  1. The scale and shared parts (panels, the Focus panel, marks, tags, buttons, top bar, Story Bar), plus the four reference screens: ComDash Overview, the chamber screens in both Seats, the Opening and the ask. It ends at the user's approval.
  2. The member's story and daily screens: the claim message and claim steps, day-one Matches with the staged moment, the digest, the Interest Signals, Connections and Profile tabs, Leads, ComMail, Asks and Wins.
  3. Search, Notifications, Engine, the AI Lead Agent preview, After the MVP, the Team Dashboard and the Presenter Guide; the website's two panels; the documents; removal of dead styles; and the final check at 360, 390, 1280 and 1440 pixels.
- **The gate.** After session 1 the user compares the four reference screens with the specimen at laptop and phone width. Sessions 2 and 3 do not start until the user approves.
- **Branch and commits.** Built on the current branch. Each session commits when lint, type check, unit tests, build and the browser tests all pass. Nothing is pushed.
- **The rename pass** for the flagged company names runs before or after a session of this pass, never during one.
- **The specimen** stays where it is, untracked, as the visual source. It is never published.
- **Non-negotiables hold.** AI drafts and a person decides, every flow works with AI off, and phones come first. Nothing in this pass hides a name or adds a prompt to pay; the tier demo above is the one labelled exception, and it belongs to the tier work.
